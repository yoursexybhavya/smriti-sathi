import { db, User, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class UserRepository {
  // Create a new user
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (user.age !== undefined) {
      const numAge = Number(user.age);
      if (isNaN(numAge) || numAge < 40 || numAge > 120) {
        throw new Error(`Invalid age: ${user.age}. Human age must be between 40 and 120 for elder care.`);
      }
    }
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
    if (updates.age !== undefined) {
      const numAge = Number(updates.age);
      if (isNaN(numAge) || numAge < 40 || numAge > 120) {
        throw new Error(`Invalid age: ${updates.age}. Human age must be between 40 and 120 for elder care.`);
      }
    }
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
