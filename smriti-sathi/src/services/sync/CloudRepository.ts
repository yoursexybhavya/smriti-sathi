/**
 * SMRITI SATHI — Production Cloud Repository
 * Handles direct HTTP synchronization with the Render Cloud Backend.
 */

import { SyncEvent } from '../../database/db';

export interface CloudSyncResult {
  success: boolean;
  uuid: string;
  error?: string;
  cloudId?: string;
}

export interface CloudStats {
  totalSynced: number;
  totalFailed: number;
  totalAttempts: number;
  lastSyncTimestamp?: number;
  isCloudReachable: boolean;
}

const DEFAULT_SERVER_URL = 'https://smriti-sathi.onrender.com';
const STORAGE_KEY = 'smriti_sathi_server_url';

class CloudRepositoryClass {
  private serverUrl: string;
  private syncedUuids: Set<string> = new Set();
  private stats: CloudStats = {
    totalSynced: 0,
    totalFailed: 0,
    totalAttempts: 0,
    isCloudReachable: true,
  };

  constructor() {
    this.serverUrl = localStorage.getItem(STORAGE_KEY) || DEFAULT_SERVER_URL;
  }

  getServerUrl(): string {
    return this.serverUrl;
  }

  setServerUrl(url: string): void {
    const trimmed = url.trim().replace(/\/+$/, '');
    this.serverUrl = trimmed || DEFAULT_SERVER_URL;
    try {
      localStorage.setItem(STORAGE_KEY, this.serverUrl);
    } catch {
      // Storage unavailable
    }
  }

  isAlreadySynced(uuid: string): boolean {
    return this.syncedUuids.has(uuid);
  }

  getStats(): CloudStats {
    return { ...this.stats };
  }

  reset(): void {
    this.syncedUuids.clear();
    this.stats = {
      totalSynced: 0,
      totalFailed: 0,
      totalAttempts: 0,
      isCloudReachable: true,
    };
  }

  async checkHealth(): Promise<{ ok: boolean; message?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.stats.isCloudReachable = res.ok;
      return { ok: res.ok, message: res.ok ? 'Server Online' : `HTTP ${res.status}` };
    } catch (err) {
      this.stats.isCloudReachable = false;
      const msg = err instanceof Error ? err.message : 'Network error';
      return { ok: false, message: msg };
    }
  }

  /**
   * Sync a batch of SyncEvents to the Render cloud server
   */
  async syncBatch(events: SyncEvent[]): Promise<{
    results: CloudSyncResult[];
    allSuccess: boolean;
  }> {
    if (!events.length) {
      return { results: [], allSuccess: true };
    }

    this.stats.totalAttempts += events.length;

    // Separate records by entity type for the backend telemetry database
    const sessions: any[] = [];
    const reminderLogs: any[] = [];
    const genericEvents: any[] = [];

    for (const ev of events) {
      let parsedPayload: any = null;
      if (ev.payload) {
        try {
          parsedPayload = JSON.parse(ev.payload);
        } catch {
          parsedPayload = { raw: ev.payload };
        }
      }

      if (ev.entityType === 'game_session' && parsedPayload) {
        sessions.push(parsedPayload);
      } else if (ev.entityType === 'reminder_completion' && parsedPayload) {
        reminderLogs.push(parsedPayload);
      } else {
        genericEvents.push({
          uuid: ev.uuid,
          entityType: ev.entityType,
          entityId: ev.entityId,
          operation: ev.operation,
          payload: parsedPayload,
          createdAt: ev.createdAt,
        });
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${this.serverUrl}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          deviceId: 'Elder-Tablet',
          patientId: '1',
          timestamp: new Date().toISOString(),
          sessions,
          reminderLogs,
          events: genericEvents,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.stats.isCloudReachable = true;
        this.stats.lastSyncTimestamp = Date.now();

        const results: CloudSyncResult[] = events.map(ev => {
          this.syncedUuids.add(ev.uuid);
          this.stats.totalSynced++;
          return {
            success: true,
            uuid: ev.uuid,
          };
        });

        return { results, allSuccess: true };
      } else {
        const errorText = `Server error HTTP ${response.status}`;
        this.stats.totalFailed += events.length;

        const results: CloudSyncResult[] = events.map(ev => ({
          success: false,
          uuid: ev.uuid,
          error: errorText,
        }));

        return { results, allSuccess: false };
      }
    } catch (err) {
      this.stats.isCloudReachable = false;
      this.stats.totalFailed += events.length;
      const errorMsg = err instanceof Error ? err.message : 'Network unreachable';

      const results: CloudSyncResult[] = events.map(ev => ({
        success: false,
        uuid: ev.uuid,
        error: errorMsg,
      }));

      return { results, allSuccess: false };
    }
  }

  /**
   * Sync a single event to the cloud
   */
  async syncEvent(event: SyncEvent): Promise<CloudSyncResult> {
    const { results } = await this.syncBatch([event]);
    return results[0] || { success: false, uuid: event.uuid, error: 'Empty result' };
  }
}

export const CloudRepository = new CloudRepositoryClass();
