/**
 * SMRITI SATHI — Sync Service
 * 
 * Core synchronization engine that manages the flow:
 * Local DB → Pending Queue → Connectivity Check → Cloud Sync → Synced
 * 
 * Features:
 * - Automatic sync when connectivity restored
 * - Manual sync trigger
 * - Retry with exponential backoff
 * - Idempotency via UUID
 * - Data safety (never delete local until confirmed)
 * - Status tracking and event emission
 */

import { db, SyncEvent } from '../../database/db';
import { ConnectivityService, ConnectivityState } from './ConnectivityService';
import { CloudRepository, CloudSyncResult } from './CloudRepository';

// Sync status states
export type SyncStatus = 
  | 'offline'           // No connectivity
  | 'idle'              // Online, nothing to sync
  | 'pending'           // Online, records waiting to sync
  | 'syncing'           // Currently syncing
  | 'synced'            // All records synced
  | 'error';            // Some records failed

export interface SyncState {
  status: SyncStatus;
  pendingCount: number;
  syncedCount: number;
  failedCount: number;
  lastSyncAt?: number;
  lastError?: string;
  isSyncing: boolean;
}

export interface SyncStats {
  totalEvents: number;
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  lastSyncAt?: number;
  cloudStats: {
    totalSynced: number;
    totalFailed: number;
    totalAttempts: number;
  };
}

type SyncStateListener = (state: SyncState) => void;

class SyncServiceClass {
  private state: SyncState;
  private listeners: Set<SyncStateListener> = new Set();
  private autoSyncEnabled: boolean = true;
  private syncInProgress: boolean = false;
  private periodicSyncInterval: any = null;
  private retryTimeouts: Map<number, ReturnType<typeof setTimeout>> = new Map();
  private unsubscribeConnectivity: (() => void) | null = null;

  constructor() {
    this.state = {
      status: 'idle',
      pendingCount: 0,
      syncedCount: 0,
      failedCount: 0,
      isSyncing: false,
    };

    this.setupConnectivityListener();
    this.setupPeriodicSync();
    this.initialize();
  }

  private setupPeriodicSync(): void {
    if (typeof window !== 'undefined') {
      // Auto-sync pending data to Render cloud every 30 seconds when online
      this.periodicSyncInterval = setInterval(() => {
        if (this.autoSyncEnabled && ConnectivityService.isOnline() && !this.syncInProgress) {
          this.triggerSync();
        }
      }, 30000);
    }
  }

  private async initialize(): Promise<void> {
    await this.refreshState();
  }

  private setupConnectivityListener(): void {
    this.unsubscribeConnectivity = ConnectivityService.subscribe((event) => {
      if (event.state === 'online' && this.autoSyncEnabled) {
        // Auto-sync when connectivity restored
        this.triggerSync();
      } else {
        this.refreshState();
      }
    });
  }

  // Public API - State
  getState(): SyncState {
    return { ...this.state };
  }

  async getStats(): Promise<SyncStats> {
    const allEvents = await db.syncEvents.toArray();
    const cloudStats = CloudRepository.getStats();

    return {
      totalEvents: allEvents.length,
      pending: allEvents.filter(e => e.syncStatus === 'pending').length,
      syncing: allEvents.filter(e => e.syncStatus === 'syncing').length,
      synced: allEvents.filter(e => e.syncStatus === 'synced').length,
      failed: allEvents.filter(e => e.syncStatus === 'failed').length,
      lastSyncAt: this.state.lastSyncAt,
      cloudStats,
    };
  }

  // Public API - Sync Operations
  async triggerSync(): Promise<{ success: number; failed: number; skipped: number }> {
    if (this.syncInProgress) {
      return { success: 0, failed: 0, skipped: 1 };
    }

    if (ConnectivityService.isOffline()) {
      await this.refreshState();
      return { success: 0, failed: 0, skipped: 1 };
    }

    this.syncInProgress = true;
    this.updateState({ status: 'syncing', isSyncing: true });

    try {
      // Get pending events
      const pendingEvents = await db.syncEvents
        .where('syncStatus')
        .equals('pending')
        .sortBy('createdAt');

      if (pendingEvents.length === 0) {
        this.syncInProgress = false;
        await this.refreshState();
        return { success: 0, failed: 0, skipped: 0 };
      }

      // Mark all as syncing in local DB
      for (const event of pendingEvents) {
        if (event.id) {
          await db.syncEvents.update(event.id, { syncStatus: 'syncing' });
        }
      }

      // Send batch to Render Cloud Server
      const { results } = await CloudRepository.syncBatch(pendingEvents);

      let success = 0;
      let failed = 0;

      for (let i = 0; i < pendingEvents.length; i++) {
        const event = pendingEvents[i];
        const res = results[i];

        if (res && res.success) {
          await db.syncEvents.update(event.id!, {
            syncStatus: 'synced',
            syncedAt: Date.now(),
          });
          success++;
        } else {
          await this.handleFailedSync(event, res?.error || 'Cloud sync failed');
          failed++;
        }
      }

      this.syncInProgress = false;
      this.updateState({
        lastSyncAt: Date.now(),
        isSyncing: false,
      });

      await this.refreshState();
      return { success, failed, skipped: 0 };

    } catch (error) {
      this.syncInProgress = false;
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      this.updateState({
        status: 'error',
        lastError: errorMsg,
        isSyncing: false,
      });
      return { success: 0, failed: 0, skipped: 0 };
    }
  }

  // Retry failed events
  async retryFailed(): Promise<{ success: number; failed: number }> {
    const failedEvents = await db.syncEvents
      .where('syncStatus')
      .equals('failed')
      .toArray();

    let success = 0;
    let failed = 0;

    for (const event of failedEvents) {
      if (event.retryCount < event.maxRetries) {
        // Reset to pending for retry
        await db.syncEvents.update(event.id!, {
          syncStatus: 'pending',
          retryCount: event.retryCount + 1,
          lastError: undefined,
        });
        success++;
      } else {
        failed++;
      }
    }

    // Trigger sync after resetting
    if (success > 0) {
      await this.triggerSync();
    }

    return { success, failed };
  }

  // Retry a specific event
  async retryEvent(eventId: number): Promise<boolean> {
    const event = await db.syncEvents.get(eventId);
    if (!event) return false;

    if (event.retryCount >= event.maxRetries) {
      return false;
    }

    await db.syncEvents.update(eventId, {
      syncStatus: 'pending',
      retryCount: event.retryCount + 1,
      lastError: undefined,
    });

    if (ConnectivityService.isOnline()) {
      await this.triggerSync();
    }

    return true;
  }

  // Get all sync events for display
  async getEvents(): Promise<SyncEvent[]> {
    return await db.syncEvents.reverse().sortBy('createdAt');
  }

  // Get pending events
  async getPendingEvents(): Promise<SyncEvent[]> {
    return await db.syncEvents
      .where('syncStatus')
      .equals('pending')
      .sortBy('createdAt');
  }

  // Get failed events
  async getFailedEvents(): Promise<SyncEvent[]> {
    return await db.syncEvents
      .where('syncStatus')
      .equals('failed')
      .sortBy('createdAt');
  }

  // Clear synced events (cleanup - safe because they're confirmed in cloud)
  async clearSyncedEvents(): Promise<number> {
    const synced = await db.syncEvents
      .where('syncStatus')
      .equals('synced')
      .toArray();
    
    const count = synced.length;
    await db.syncEvents.where('syncStatus').equals('synced').delete();
    await this.refreshState();
    return count;
  }

  async resetAll(): Promise<void> {
    await db.syncEvents.clear();
    CloudRepository.reset();
    await this.refreshState();
  }

  // Auto-sync toggle
  setAutoSync(enabled: boolean): void {
    this.autoSyncEnabled = enabled;
  }

  isAutoSyncEnabled(): boolean {
    return this.autoSyncEnabled;
  }

  // Event subscription
  subscribe(listener: SyncStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Cleanup
  destroy(): void {
    this.listeners.clear();
    if (this.unsubscribeConnectivity) {
      this.unsubscribeConnectivity();
    }
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  // Private methods
  private async handleFailedSync(event: SyncEvent, error: string): Promise<void> {
    const newRetryCount = event.retryCount + 1;
    const canRetry = newRetryCount < event.maxRetries;

    await db.syncEvents.update(event.id!, {
      syncStatus: 'failed',
      retryCount: newRetryCount,
      lastError: error,
    });

    // Schedule automatic retry with exponential backoff
    if (canRetry && this.autoSyncEnabled && ConnectivityService.isOnline()) {
      const delay = this.calculateRetryDelay(newRetryCount);
      const timeout = setTimeout(async () => {
        await this.retryEvent(event.id!);
        this.retryTimeouts.delete(event.id!);
      }, delay);
      this.retryTimeouts.set(event.id!, timeout);
    }
  }

  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, retryCount - 1), 30000);
  }

  private async refreshState(): Promise<void> {
    const allEvents = await db.syncEvents.toArray();
    const pending = allEvents.filter(e => e.syncStatus === 'pending').length;
    const synced = allEvents.filter(e => e.syncStatus === 'synced').length;
    const failed = allEvents.filter(e => e.syncStatus === 'failed').length;

    let status: SyncStatus;

    if (ConnectivityService.isOffline()) {
      status = 'offline';
    } else if (this.syncInProgress) {
      status = 'syncing';
    } else if (failed > 0) {
      status = 'error';
    } else if (pending > 0) {
      status = 'pending';
    } else if (synced > 0) {
      status = 'synced';
    } else {
      status = 'idle';
    }

    this.updateState({
      status,
      pendingCount: pending,
      syncedCount: synced,
      failedCount: failed,
    });
  }

  private updateState(partial: Partial<SyncState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
}

// Singleton instance
export const SyncService = new SyncServiceClass();
