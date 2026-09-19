/**
 * Notification & Care Buzzer Service
 * Handles native Android background alarms, exact scheduled notifications,
 * and audible buzzer chimes with vibration for elderly dementia care routines.
 * 
 * Uses @capacitor/local-notifications on native Android/iOS
 * and falls back seamlessly to Web Audio + Web Notifications in browser.
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
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

/**
 * Senior-friendly Audible Care Buzzer
 * Generates an intentional, comforting, yet distinct 4-tone chime
 * using the Web Audio API without requiring external audio assets.
 */
class CareBuzzer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private loopTimeout: number | null = null;

  play(repeatCount: number = 3): void {
    this.stop();
    this.isPlaying = true;

    // Trigger native haptic vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400, 150, 600]);
      } catch {}
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      let currentLoop = 0;
      const playToneSequence = () => {
        if (!this.isPlaying || !this.audioCtx) return;

        // Warm, soothing 4-tone ascending chime: C5, E5, G5, C6
        // Non-startling, melodic frequency profile tailored for seniors
        const tones = [523.25, 659.25, 783.99, 1046.50];
        const noteDuration = 0.28;
        const now = this.audioCtx.currentTime;

        tones.forEach((freq, idx) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();

          osc.type = 'triangle'; // triangle wave gives warm, bell-like timbre
          osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

          gain.gain.setValueAtTime(0, now + idx * noteDuration);
          gain.gain.linearRampToValueAtTime(0.35, now + idx * noteDuration + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * noteDuration + noteDuration + 0.2);

          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);

          osc.start(now + idx * noteDuration);
          osc.stop(now + idx * noteDuration + noteDuration + 0.25);
        });

        currentLoop++;
        if (currentLoop < repeatCount && this.isPlaying) {
          this.loopTimeout = window.setTimeout(playToneSequence, 1600);
        } else {
          this.isPlaying = false;
        }
      };

      playToneSequence();
    } catch (err) {
      console.warn('Audio buzzer chime error:', err);
    }
  }

  stop(): void {
    this.isPlaying = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  get active(): boolean {
    return this.isPlaying;
  }
}

export const careBuzzer = new CareBuzzer();

export class NotificationService {
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<number, number> = new Map(); // reminderId -> timeoutId
  private channelCreated: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.isSupported = true;
      this.permission = Notification.permission;
    }
  }

  /**
   * Initialize native channels and permissions
   */
  async initialize(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        // Register high-priority care reminder channel on Android
        await LocalNotifications.createChannel({
          id: 'smriti_care_reminders',
          name: 'Smriti Sathi Care Alarms',
          description: 'Urgent medication, hydration, and care routine alarms with audible buzzer',
          importance: 5, // High priority / Heads-up display
          visibility: 1, // Visible on lock screen
          vibration: true,
          lights: true,
          lightColor: '#10B981',
          sound: 'default',
        });
        this.channelCreated = true;
        console.log('✓ Android Care Alarms notification channel registered');
      } catch (err) {
        console.warn('Could not create notification channel:', err);
      }

      try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }
      } catch (err) {
        console.warn('Error checking/requesting native notification permissions:', err);
      }
    } else if (this.isSupported && this.permission === 'default') {
      try {
        await this.requestPermission();
      } catch (err) {
        console.warn('Error requesting web notification permissions:', err);
      }
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await LocalNotifications.requestPermissions();
        const granted = res.display === 'granted';
        return granted ? 'granted' : 'denied';
      } catch (err) {
        console.error('Native permission request failed:', err);
        return 'denied';
      }
    }

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
    if (Capacitor.isNativePlatform()) return true;
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
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Date.now() % 100000),
              title: options.title,
              body: options.body,
              channelId: 'smriti_care_reminders',
              schedule: { at: new Date(Date.now() + 100) },
              sound: 'default',
            },
          ],
        });
        return null;
      } catch (err) {
        console.warn('Native immediate notification failed:', err);
      }
    }

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

    // Don't schedule if time has already passed
    if (timeUntilReminder <= 0) {
      console.log('Reminder time has passed, alerting immediately');
      await this.showReminderNotification(reminder, patientName);
      return;
    }

    const title = this.getReminderTitle(reminder);
    const body = reminder.description ? `${reminder.title} — ${reminder.description}` : reminder.title;
    const reminderId = reminder.id || Math.floor(Math.random() * 100000);

    // 1. If running natively, schedule Android exact background alarm
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: reminderId,
              title,
              body,
              channelId: 'smriti_care_reminders',
              schedule: {
                at: new Date(reminder.scheduledTime),
                allowWhileIdle: true, // Wakes up Android Doze mode
              },
              sound: 'default',
              extra: { reminderId },
            },
          ],
        });
        console.log(`✓ Scheduled exact native alarm for reminder ${reminderId} at ${new Date(reminder.scheduledTime).toLocaleTimeString()}`);
      } catch (err) {
        console.warn('Failed to schedule native alarm:', err);
      }
    }

    // 2. Schedule in-memory timeout for immediate foreground alerts
    this.cancel(reminderId);

    const timeoutId = window.setTimeout(async () => {
      await this.showReminderNotification(reminder, patientName);
      this.scheduledNotifications.delete(reminderId);
    }, timeUntilReminder);

    this.scheduledNotifications.set(reminderId, timeoutId);
    console.log(`Scheduled in-app timer for reminder ${reminderId} in ${Math.round(timeUntilReminder / 1000)}s`);
  }

  /**
   * Trigger the senior-friendly audible buzzer, vibration, and alert
   */
  async triggerBuzzer(title: string = '⏰ Care Alert — Smriti Sathi', body: string = 'It is time for your scheduled care activity!'): Promise<void> {
    // Play warm melodic buzzer chime & vibrate
    careBuzzer.play(3);

    // Show high-priority notification
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 999999,
              title,
              body,
              channelId: 'smriti_care_reminders',
              schedule: { at: new Date(Date.now() + 100) },
              sound: 'default',
            },
          ],
        });
      } catch (err) {
        console.warn('Failed to trigger native notification:', err);
      }
    } else if (this.isAvailable()) {
      await this.show({
        title,
        body,
        tag: 'care-buzzer-test',
        requireInteraction: true,
      });
    }
  }

  /**
   * Stop the active buzzer chime
   */
  stopBuzzer(): void {
    careBuzzer.stop();
  }

  /**
   * Show a reminder notification with voice and audible buzzer
   */
  private async showReminderNotification(reminder: Reminder, patientName?: string): Promise<void> {
    const title = this.getReminderTitle(reminder);
    const body = reminder.description ? `${reminder.title} — ${reminder.description}` : reminder.title;

    // Ring care chime
    careBuzzer.play(3);

    // Show native or web notification
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: reminder.id || Math.floor(Date.now() % 100000),
              title,
              body,
              channelId: 'smriti_care_reminders',
              schedule: { at: new Date(Date.now() + 100) },
              sound: 'default',
            },
          ],
        });
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    } else {
      await this.show({
        title,
        body,
        tag: `reminder-${reminder.id}`,
        requireInteraction: true,
      });
    }

    // Speak the reminder aloud if voice is available
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
        return '💊 Medicine Care Alarm';
      case 'hydration':
        return '💧 Hydration Reminder';
      case 'activity':
        return '🏃 Physical & Mental Activity';
      case 'appointment':
        return '📅 Caregiver Check-In';
      default:
        return '🔔 Care Reminder';
    }
  }

  /**
   * Cancel a scheduled notification
   */
  cancel(reminderId: number): void {
    if (Capacitor.isNativePlatform()) {
      try {
        LocalNotifications.cancel({ notifications: [{ id: reminderId }] });
      } catch (err) {
        console.warn(`Failed to cancel native notification ${reminderId}:`, err);
      }
    }

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
    if (Capacitor.isNativePlatform()) {
      try {
        LocalNotifications.removeAllDeliveredNotifications();
      } catch {}
    }

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
    this.cancelAll();

    const pendingReminders = reminders.filter(r => r.status === 'pending');
    for (const reminder of pendingReminders) {
      await this.schedule(reminder, patientName);
    }

    console.log(`Rescheduled ${pendingReminders.length} reminders`);
  }

  /**
   * Test notification and buzzer chime
   */
  async test(): Promise<void> {
    await this.triggerBuzzer('🔔 Test Care Alarm', 'This is a test alarm with audible chime and vibration from Smriti Sathi');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
