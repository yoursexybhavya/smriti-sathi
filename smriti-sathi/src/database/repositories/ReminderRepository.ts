import { db, Reminder, ReminderCompletion, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class ReminderRepository {
  // Create a new reminder
  async create(reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<number> {
    const id = await db.reminders.add({
      ...reminder,
      createdAt: Date.now(),
    });

    await this.createSyncEvent('reminder', id, 'create');
    return id;
  }

  // Get reminder by ID
  async getById(id: number): Promise<Reminder | undefined> {
    return await db.reminders.get(id);
  }

  // Get all reminders for a user
  async getByUserId(userId: number): Promise<Reminder[]> {
    return await db.reminders
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('scheduledTime');
  }

  // Get pending reminders
  async getPending(userId: number): Promise<Reminder[]> {
    return await db.reminders
      .where('userId')
      .equals(userId)
      .and(reminder => reminder.status === 'pending')
      .sortBy('scheduledTime');
  }

  // Get reminders by type
  async getByType(userId: number, type: Reminder['type']): Promise<Reminder[]> {
    return await db.reminders
      .where('userId')
      .equals(userId)
      .and(reminder => reminder.type === type)
      .reverse()
      .sortBy('scheduledTime');
  }

  // Get reminders for today
  async getForToday(userId: number): Promise<Reminder[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    return await db.reminders
      .where('userId')
      .equals(userId)
      .and(reminder => 
        reminder.scheduledTime >= startOfDay && 
        reminder.scheduledTime < endOfDay
      )
      .sortBy('scheduledTime');
  }

  // Update reminder
  async update(id: number, updates: Partial<Reminder>): Promise<void> {
    await db.reminders.update(id, updates);
    await this.createSyncEvent('reminder', id, 'update');
  }

  // Complete reminder
  async complete(id: number, userId: number): Promise<void> {
    await db.reminders.update(id, { status: 'completed' });
    
    await db.reminderCompletions.add({
      reminderId: id,
      userId,
      completedAt: Date.now(),
    });

    await this.createSyncEvent('reminder', id, 'update');
    await this.createSyncEvent('reminder_completion', id, 'create');
  }

  // Mark reminder as missed
  async markMissed(id: number): Promise<void> {
    await db.reminders.update(id, { status: 'missed' });
    await this.createSyncEvent('reminder', id, 'update');
  }

  // Delete reminder
  async delete(id: number): Promise<void> {
    await db.reminders.delete(id);
    await this.createSyncEvent('reminder', id, 'delete');
  }

  // Get completion history for a reminder
  async getCompletions(reminderId: number): Promise<ReminderCompletion[]> {
    return await db.reminderCompletions
      .where('reminderId')
      .equals(reminderId)
      .reverse()
      .sortBy('completedAt');
  }

  // Get completion count for a reminder
  async getCompletionCount(reminderId: number): Promise<number> {
    return await db.reminderCompletions
      .where('reminderId')
      .equals(reminderId)
      .count();
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

export const reminderRepository = new ReminderRepository();
