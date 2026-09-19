/**
 * Notification Service
 * Handles local notifications for reminders
 * Works offline using browser Notification API
 */

import { Reminder } from '../database/db';
import { voiceReminderService } from './voice/VoiceReminderService';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

export class NotificationService {
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<number, number> = new Map(); // reminderId -> timeoutId

  constructor() {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.isSupported = true;
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Check if notifications are available and permitted
   */
  isAvailable(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Show an immediate notification
   */
  async show(options: NotificationOptions): Promise<Notification | null> {
    if (!this.isAvailable()) {
      console.warn('Notifications not available');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      });

      // Auto-close after 10 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 10000);
      }

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for a reminder
   */
  async schedule(reminder: Reminder, patientName?: string): Promise<void> {
    const now = Date.now();
    const timeUntilReminder = reminder.scheduledTime - now;

    // Don't schedule if time has passed
    if (timeUntilReminder <= 0) {
      console.log('Reminder time has passed, showing immediately');
      await this.showReminderNotification(reminder, patientName);
      return;
    }

    // Clear any existing scheduled notification for this reminder
    this.cancel(reminder.id!);

    // Schedule the notification
    const timeoutId = window.setTimeout(async () => {
      await this.showReminderNotification(reminder, patientName);
      this.scheduledNotifications.delete(reminder.id!);
    }, timeUntilReminder);

    this.scheduledNotifications.set(reminder.id!, timeoutId);
    console.log(`Scheduled notification for reminder ${reminder.id} in ${timeUntilReminder}ms`);
  }

  /**
   * Show a reminder notification with voice
   */
  private async showReminderNotification(reminder: Reminder, patientName?: string): Promise<void> {
    // Show notification
    await this.show({
      title: this.getReminderTitle(reminder),
      body: reminder.title,
      tag: `reminder-${reminder.id}`,
      requireInteraction: true,
    });

    // Speak the reminder if voice is available
    if (voiceReminderService.isAvailable()) {
      await voiceReminderService.speak({
        text: reminder.title,
        patientName,
        reminderType: reminder.type,
      });
    }
  }

  /**
   * Get a user-friendly title for a reminder type
   */
  private getReminderTitle(reminder: Reminder): string {
    switch (reminder.type) {
      case 'medicine':
        return '💊 Medicine Reminder';
      case 'hydration':
        return '💧 Hydration Reminder';
      case 'activity':
        return '🏃 Activity Reminder';
      case 'appointment':
        return '📅 Appointment Reminder';
      default:
        return 'Reminder';
    }
  }

  /**
   * Cancel a scheduled notification
   */
  cancel(reminderId: number): void {
    const timeoutId = this.scheduledNotifications.get(reminderId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(reminderId);
      console.log(`Cancelled notification for reminder ${reminderId}`);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAll(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
    console.log('Cancelled all scheduled notifications');
  }

  /**
   * Get count of scheduled notifications
   */
  getScheduledCount(): number {
    return this.scheduledNotifications.size;
  }

  /**
   * Reschedule all pending reminders
   */
  async rescheduleAll(reminders: Reminder[], patientName?: string): Promise<void> {
    // Cancel all existing
    this.cancelAll();

    // Schedule each pending reminder
    const pendingReminders = reminders.filter(r => r.status === 'pending');
    
    for (const reminder of pendingReminders) {
      await this.schedule(reminder, patientName);
    }

    console.log(`Rescheduled ${pendingReminders.length} reminders`);
  }

  /**
   * Test notification
   */
  async test(): Promise<void> {
    await this.show({
      title: '🔔 Test Notification',
      body: 'This is a test notification from Smriti Sathi',
      tag: 'test',
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
