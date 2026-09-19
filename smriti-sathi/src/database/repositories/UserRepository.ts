import { db, User, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class UserRepository {
  // Create a new user
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = Date.now();
    const id = await db.users.add({
      ...user,
      createdAt: now,
      updatedAt: now,
    });

    await this.createSyncEvent('user', id, 'create');
    return id;
  }

  // Get user by ID
  async getById(id: number): Promise<User | undefined> {
    return await db.users.get(id);
  }

  // Get all users
  async getAll(): Promise<User[]> {
    return await db.users.toArray();
  }

  // Update user
  async update(id: number, updates: Partial<User>): Promise<void> {
    await db.users.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    await this.createSyncEvent('user', id, 'update');
  }

  // Delete user
  async delete(id: number): Promise<void> {
    await db.users.delete(id);
    await this.createSyncEvent('user', id, 'delete');
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

export const userRepository = new UserRepository();
