import { db, MemoryItem, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class MemoryItemRepository {
  /**
   * Create a new memory item
   */
  async create(item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = Date.now();
    const id = await db.memoryItems.add({
      ...item,
      createdAt: now,
      updatedAt: now,
    });

    await this.createSyncEvent('memory_item', id, 'create');
    return id;
  }

  /**
   * Get memory item by ID
   */
  async getById(id: number): Promise<MemoryItem | undefined> {
    return await db.memoryItems.get(id);
  }

  /**
   * Get all memory items for a user
   */
  async getByUserId(userId: number): Promise<MemoryItem[]> {
    return await db.memoryItems
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('createdAt');
  }

  /**
   * Get memory items by category
   */
  async getByCategory(userId: number, category: MemoryItem['category']): Promise<MemoryItem[]> {
    return await db.memoryItems
      .where('userId')
      .equals(userId)
      .and(item => item.category === category)
      .reverse()
      .sortBy('createdAt');
  }

  /**
   * Update memory item
   */
  async update(id: number, updates: Partial<Omit<MemoryItem, 'id' | 'createdAt'>>): Promise<void> {
    await db.memoryItems.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    await this.createSyncEvent('memory_item', id, 'update');
  }

  /**
   * Delete memory item
   */
  async delete(id: number): Promise<void> {
    await db.memoryItems.delete(id);
    await this.createSyncEvent('memory_item', id, 'delete');
  }

  /**
   * Get memory item count for a user
   */
  async getCount(userId: number): Promise<number> {
    return await db.memoryItems
      .where('userId')
      .equals(userId)
      .count();
  }

  /**
   * Get memory item count by category
   */
  async getCountByCategory(userId: number, category: MemoryItem['category']): Promise<number> {
    return await db.memoryItems
      .where('userId')
      .equals(userId)
      .and(item => item.category === category)
      .count();
  }

  /**
   * Create sync event
   */
  private async createSyncEvent(
    entityType: SyncEvent['entityType'],
    entityId: number,
    operation: SyncEvent['operation']
  ): Promise<void> {
    await db.syncEvents.add({
      uuid: generateUUID(),
      entityType,
      entityId,
      operation,
      syncStatus: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now(),
    });
  }
}

export const memoryItemRepository = new MemoryItemRepository();
