/**
 * SMRITI SATHI — Mock Cloud Repository
 * 
 * Simulates a cloud backend for synchronization testing.
 * This will be replaced by actual API calls to FastAPI/Node.js + PostgreSQL.
 * 
 * Architecture designed for future replacement:
 * - Same interface as real cloud repository
 * - Configurable failure simulation
 * - Deterministic behavior for testing
 */

import { SyncEvent } from '../../database/db';

export interface CloudSyncResult {
  success: boolean;
  uuid: string;
  error?: string;
  cloudId?: string; // ID assigned by cloud
}

export interface CloudRepositoryConfig {
  failureRate: number; // 0.0 to 1.0
  latencyMs: number; // Simulated network delay
  failSpecificTypes?: SyncEvent['entityType'][];
  failSpecificOperations?: SyncEvent['operation'][];
}

class MockCloudRepositoryClass {
  private config: CloudRepositoryConfig;
  private syncedRecords: Map<string, CloudSyncResult> = new Map();
  private forceFailure: boolean = false;
  private syncLog: Array<{ event: SyncEvent; result: CloudSyncResult; timestamp: number }> = [];

  constructor() {
    this.config = {
      failureRate: 0, // Default: always succeed
      latencyMs: 200, // Default: 200ms simulated latency
    };
  }

  // Configuration methods
  setConfig(config: Partial<CloudRepositoryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): CloudRepositoryConfig {
    return { ...this.config };
  }

  // Force all syncs to fail (for testing error handling)
  setForceFailure(force: boolean): void {
    this.forceFailure = force;
  }

  isForceFailure(): boolean {
    return this.forceFailure;
  }

  // Main sync method - simulates sending data to cloud
  async syncEvent(event: SyncEvent): Promise<CloudSyncResult> {
    // Simulate network latency
    await this.simulateLatency();

    // Check for forced failure
    if (this.forceFailure) {
      const result: CloudSyncResult = {
        success: false,
        uuid: event.uuid,
        error: 'Simulated forced failure',
      };
      this.logSync(event, result);
      return result;
    }

    // Check for configured failure rate
    if (Math.random() < this.config.failureRate) {
      const result: CloudSyncResult = {
        success: false,
        uuid: event.uuid,
        error: 'Simulated network error',
      };
      this.logSync(event, result);
      return result;
    }

    // Check for specific type/operation failures
    if (this.config.failSpecificTypes?.includes(event.entityType)) {
      const result: CloudSyncResult = {
        success: false,
        uuid: event.uuid,
        error: `Simulated failure for entity type: ${event.entityType}`,
      };
      this.logSync(event, result);
      return result;
    }

    if (this.config.failSpecificOperations?.includes(event.operation)) {
      const result: CloudSyncResult = {
        success: false,
        uuid: event.uuid,
        error: `Simulated failure for operation: ${event.operation}`,
      };
      this.logSync(event, result);
      return result;
    }

    // Success - simulate cloud assigning an ID
    const result: CloudSyncResult = {
      success: true,
      uuid: event.uuid,
      cloudId: `cloud_${event.entityType}_${event.entityId}_${Date.now()}`,
    };

    // Store in "cloud" (idempotency check)
    this.syncedRecords.set(event.uuid, result);
    this.logSync(event, result);

    return result;
  }

  // Batch sync - sync multiple events
  async syncBatch(events: SyncEvent[]): Promise<CloudSyncResult[]> {
    const results: CloudSyncResult[] = [];
    
    for (const event of events) {
      const result = await this.syncEvent(event);
      results.push(result);
    }

    return results;
  }

  // Idempotency check - has this event already been synced?
  isAlreadySynced(uuid: string): boolean {
    return this.syncedRecords.has(uuid);
  }

  // Get synced record
  getSyncedRecord(uuid: string): CloudSyncResult | undefined {
    return this.syncedRecords.get(uuid);
  }

  // Get all synced records (for testing)
  getAllSyncedRecords(): Map<string, CloudSyncResult> {
    return new Map(this.syncedRecords);
  }

  // Get sync log
  getSyncLog(): Array<{ event: SyncEvent; result: CloudSyncResult; timestamp: number }> {
    return [...this.syncLog];
  }

  // Clear all data (for testing)
  reset(): void {
    this.syncedRecords.clear();
    this.syncLog = [];
    this.forceFailure = false;
    this.config = {
      failureRate: 0,
      latencyMs: 200,
    };
  }

  // Statistics
  getStats(): {
    totalSynced: number;
    totalFailed: number;
    totalAttempts: number;
  } {
    const totalSynced = this.syncLog.filter(l => l.result.success).length;
    const totalFailed = this.syncLog.filter(l => !l.result.success).length;
    
    return {
      totalSynced,
      totalFailed,
      totalAttempts: this.syncLog.length,
    };
  }

  // Private methods
  private async simulateLatency(): Promise<void> {
    if (this.config.latencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.config.latencyMs));
    }
  }

  private logSync(event: SyncEvent, result: CloudSyncResult): void {
    this.syncLog.push({
      event: { ...event },
      result: { ...result },
      timestamp: Date.now(),
    });
  }
}

// Singleton instance
export const MockCloudRepository = new MockCloudRepositoryClass();
