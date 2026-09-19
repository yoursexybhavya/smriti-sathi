import { db, Settings, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class SettingsRepository {
  // Create or update settings for a user
  async save(settings: Omit<Settings, 'id' | 'updatedAt'>): Promise<number> {
    const existing = await this.getByUserId(settings.userId);
    
    if (existing?.id) {
      await db.settings.update(existing.id, {
        ...settings,
        updatedAt: Date.now(),
      });
      await this.createSyncEvent('settings', existing.id, 'update');
      return existing.id;
    } else {
      const id = await db.settings.add({
        ...settings,
        updatedAt: Date.now(),
      });
      await this.createSyncEvent('settings', id, 'create');
      return id;
    }
  }

  // Get settings by user ID
  async getByUserId(userId: number): Promise<Settings | undefined> {
    return await db.settings
      .where('userId')
      .equals(userId)
      .first();
  }

  // Update specific settings
  async update(userId: number, updates: Partial<Omit<Settings, 'id' | 'userId'>>): Promise<void> {
    const existing = await this.getByUserId(userId);
    
    if (existing?.id) {
      await db.settings.update(existing.id, {
        ...updates,
        updatedAt: Date.now(),
      });
      await this.createSyncEvent('settings', existing.id, 'update');
    }
  }

  // Delete settings
  async delete(userId: number): Promise<void> {
    const existing = await this.getByUserId(userId);
    if (existing?.id) {
      await db.settings.delete(existing.id);
      await this.createSyncEvent('settings', existing.id, 'delete');
    }
  }

  // Create sync event
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

export const settingsRepository = new SettingsRepository();
