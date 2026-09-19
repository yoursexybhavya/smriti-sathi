/**
 * Reminder Service
 * High-level service for reminder management
 * Handles recurring reminders, snooze, and notification scheduling
 */

import { reminderRepository } from '../database/repositories/ReminderRepository';
import { notificationService } from './NotificationService';
import { Reminder } from '../database/db';

export class ReminderService {
  /**
   * Create a new reminder
   */
  async createReminder(
    userId: number,
    type: Reminder['type'],
    title: string,
    scheduledTime: number,
    description?: string,
    repeatPattern?: Reminder['repeatPattern']
  ): Promise<number> {
    const reminderId = await reminderRepository.create({
      userId,
      type,
      title,
      scheduledTime,
      description,
      repeatPattern: repeatPattern || 'none',
      status: 'pending',
    });

    // Schedule notification
    const reminder = await reminderRepository.getById(reminderId);
    if (reminder) {
      await notificationService.schedule(reminder);
    }

    return reminderId;
  }

  /**
   * Complete a reminder
   */
  async completeReminder(reminderId: number, userId: number): Promise<void> {
    const reminder = await reminderRepository.getById(reminderId);
    if (!reminder) {
      throw new Error('Reminder not found');
    }

    await reminderRepository.complete(reminderId, userId);

    // If recurring, create next occurrence
    if (reminder.repeatPattern && reminder.repeatPattern !== 'none') {
      await this.createNextOccurrence(reminder);
    }
  }

  /**
   * Snooze a reminder
   */
  async snoozeReminder(reminderId: number, minutes: number = 10): Promise<void> {
    const reminder = await reminderRepository.getById(reminderId);
    if (!reminder) {
      throw new Error('Reminder not found');
    }

    const newTime = Date.now() + minutes * 60 * 1000;
    await reminderRepository.update(reminderId, {
      scheduledTime: newTime,
      status: 'pending',
    });

    // Reschedule notification
    const updatedReminder = await reminderRepository.getById(reminderId);
    if (updatedReminder) {
      await notificationService.schedule(updatedReminder);
    }
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(reminderId: number): Promise<void> {
    // Cancel notification
    notificationService.cancel(reminderId);
    
    // Delete from database
    await reminderRepository.delete(reminderId);
  }

  /**
   * Update a reminder
   */
  async updateReminder(
    reminderId: number,
    updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>
  ): Promise<void> {
    // Cancel existing notification
    notificationService.cancel(reminderId);

    // Update in database
    await reminderRepository.update(reminderId, updates);

    // Reschedule if still pending
    const updatedReminder = await reminderRepository.getById(reminderId);
    if (updatedReminder && updatedReminder.status === 'pending') {
      await notificationService.schedule(updatedReminder);
    }
  }

  /**
   * Get reminders for today
   */
  async getTodayReminders(userId: number): Promise<Reminder[]> {
    return await reminderRepository.getForToday(userId);
  }

  /**
   * Get pending reminders
   */
  async getPendingReminders(userId: number): Promise<Reminder[]> {
    return await reminderRepository.getPending(userId);
  }

  /**
   * Get reminders by type
   */
  async getRemindersByType(userId: number, type: Reminder['type']): Promise<Reminder[]> {
    return await reminderRepository.getByType(userId, type);
  }

  /**
   * Get all reminders for a user
   */
  async getAllReminders(userId: number): Promise<Reminder[]> {
    return await reminderRepository.getByUserId(userId);
  }

  /**
   * Initialize reminder system
   * Call this on app startup to schedule all pending reminders
   */
  async initialize(userId: number, patientName?: string): Promise<void> {
    // Request notification permission
    await notificationService.requestPermission();

    // Get all pending reminders
    const pendingReminders = await this.getPendingReminders(userId);

    // Schedule all
    await notificationService.rescheduleAll(pendingReminders, patientName);

    console.log(`Initialized ${pendingReminders.length} reminders`);
  }

  /**
   * Create next occurrence of a recurring reminder
   */
  private async createNextOccurrence(reminder: Reminder): Promise<void> {
    let nextTime = reminder.scheduledTime;

    switch (reminder.repeatPattern) {
      case 'daily':
        nextTime += 24 * 60 * 60 * 1000; // Add 1 day
        break;
      case 'weekly':
        nextTime += 7 * 24 * 60 * 60 * 1000; // Add 7 days
        break;
      default:
        return; // No recurrence
    }

    // Create new reminder
    await this.createReminder(
      reminder.userId,
      reminder.type,
      reminder.title,
      nextTime,
      reminder.description,
      reminder.repeatPattern
    );
  }

  /**
   * Get reminder statistics
   */
  async getStatistics(userId: number): Promise<{
    total: number;
    pending: number;
    completed: number;
    missed: number;
    today: number;
  }> {
    const allReminders = await this.getAllReminders(userId);
    const todayReminders = await this.getTodayReminders(userId);

    return {
      total: allReminders.length,
      pending: allReminders.filter(r => r.status === 'pending').length,
      completed: allReminders.filter(r => r.status === 'completed').length,
      missed: allReminders.filter(r => r.status === 'missed').length,
      today: todayReminders.length,
    };
  }

  /**
   * Mark overdue reminders as missed
   */
  async markOverdueAsMissed(userId: number): Promise<void> {
    const pendingReminders = await this.getPendingReminders(userId);
    const now = Date.now();

    for (const reminder of pendingReminders) {
      // If reminder is more than 1 hour overdue, mark as missed
      if (now - reminder.scheduledTime > 60 * 60 * 1000) {
        await reminderRepository.markMissed(reminder.id!);
        notificationService.cancel(reminder.id!);
      }
    }
  }
}

// Export singleton instance
export const reminderService = new ReminderService();
