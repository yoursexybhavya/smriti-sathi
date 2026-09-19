import { db, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class SyncRepository {
  // Get all pending sync events
  async getPending(): Promise<SyncEvent[]> {
    return await db.syncEvents
      .where('syncStatus')
      .equals('pending')
      .sortBy('createdAt');
  }

  // Get all failed sync events
  async getFailed(): Promise<SyncEvent[]> {
    return await db.syncEvents
      .where('syncStatus')
      .equals('failed')
      .sortBy('createdAt');
  }

  // Get all syncing events
  async getSyncing(): Promise<SyncEvent[]> {
    return await db.syncEvents
      .where('syncStatus')
      .equals('syncing')
      .sortBy('createdAt');
  }

  // Get all sync events
  async getAll(): Promise<SyncEvent[]> {
    return await db.syncEvents.toArray();
  }

  // Get event by UUID (for idempotency)
  async getByUUID(uuid: string): Promise<SyncEvent | undefined> {
    return await db.syncEvents.where('uuid').equals(uuid).first();
  }

  // Create a new sync event
  async create(
    entityType: SyncEvent['entityType'],
    entityId: number,
    operation: SyncEvent['operation'],
    payload?: string
  ): Promise<number> {
    return await db.syncEvents.add({
      uuid: generateUUID(),
      entityType,
      entityId,
      operation,
      syncStatus: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now(),
      payload,
    });
  }

  // Mark sync event as syncing
  async markSyncing(id: number): Promise<void> {
    await db.syncEvents.update(id, {
      syncStatus: 'syncing',
    });
  }

  // Mark sync event as synced
  async markSynced(id: number): Promise<void> {
    await db.syncEvents.update(id, {
      syncStatus: 'synced',
      syncedAt: Date.now(),
    });
  }

  // Mark sync event as failed
  async markFailed(id: number, error?: string): Promise<void> {
    const event = await db.syncEvents.get(id);
    if (!event) return;

    await db.syncEvents.update(id, {
      syncStatus: 'failed',
      retryCount: event.retryCount + 1,
      lastError: error,
    });
  }

  // Reset failed event to pending for retry
  async resetForRetry(id: number): Promise<boolean> {
    const event = await db.syncEvents.get(id);
    if (!event) return false;
    if (event.retryCount >= event.maxRetries) return false;

    await db.syncEvents.update(id, {
      syncStatus: 'pending',
      lastError: undefined,
    });
    return true;
  }

  // Clear all synced events (cleanup - safe because confirmed in cloud)
  async clearSynced(): Promise<number> {
    const count = await db.syncEvents
      .where('syncStatus')
      .equals('synced')
      .count();
    
    await db.syncEvents
      .where('syncStatus')
      .equals('synced')
      .delete();
    
    return count;
  }

  // Clear all sync events (reset)
  async clearAll(): Promise<void> {
    await db.syncEvents.clear();
  }

  // Get sync status summary
  async getStatus(): Promise<{
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
    total: number;
  }> {
    const all = await db.syncEvents.toArray();
    
    return {
      pending: all.filter(e => e.syncStatus === 'pending').length,
      syncing: all.filter(e => e.syncStatus === 'syncing').length,
      synced: all.filter(e => e.syncStatus === 'synced').length,
      failed: all.filter(e => e.syncStatus === 'failed').length,
      total: all.length,
    };
  }
}

export const syncRepository = new SyncRepository();
