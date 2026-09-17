import { useState, useEffect, useRef, useCallback } from 'react';
import { db, type Reminder } from '../db/database';
import { useVoice } from './useVoice';

export interface UseReminderSchedulerOptions {
  intervalMs?: number;
  onTrigger?: (reminder: Reminder) => void;
}

export interface UseReminderSchedulerReturn {
  activeDueReminder: Reminder | null;
  dismissDueReminder: () => void;
  acknowledgeDueReminder: (reminder?: Reminder) => Promise<void>;
  checkDueReminders: () => Promise<void>;
}

export function useReminderScheduler(
  options: UseReminderSchedulerOptions = {}
): UseReminderSchedulerReturn {
  const { intervalMs = 10000, onTrigger } = options;
  const { speak, playReminderChime, playSuccessChime } = useVoice();

  const [activeDueReminder, setActiveDueReminder] = useState<Reminder | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const triggeredKeysRef = useRef<Set<string>>(new Set());
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  const stopActiveAudio = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
  }, []);

  const playReminderAudioPrompt = useCallback(
    (reminder: Reminder) => {
      stopActiveAudio();

      if (reminder.audioBlob) {
        try {
          const audioUrl = URL.createObjectURL(reminder.audioBlob);
          const audio = new Audio(audioUrl);
          activeAudioRef.current = audio;

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            if (activeAudioRef.current === audio) {
              activeAudioRef.current = null;
            }
          };

          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            if (activeAudioRef.current === audio) {
              activeAudioRef.current = null;
            }
            // Fallback to synthesized chime & speech
            playReminderChime();
            speak(reminder.label);
          };

          audio.play().catch((err) => {
            console.warn('Familiar voice playback failed or blocked:', err);
            URL.revokeObjectURL(audioUrl);
            if (activeAudioRef.current === audio) {
              activeAudioRef.current = null;
            }
            playReminderChime();
            speak(reminder.label);
          });
        } catch {
          playReminderChime();
          speak(reminder.label);
        }
      } else {
        playReminderChime();
        speak(reminder.label);
      }
    },
    [stopActiveAudio, playReminderChime, speak]
  );

  const checkDueReminders = useCallback(async () => {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0 = Sun, 6 = Sat
      const todayStr = now.toDateString();

      // Retrieve all active reminders
      const activeReminders = await db.reminders.filter((r) => r.isActive).toArray();

      for (const rem of activeReminders) {
        if (!rem.id) continue;

        // Verify day of week match (empty repeatDays = every day or one-time)
        const dayMatches =
          !rem.repeatDays || rem.repeatDays.length === 0 || rem.repeatDays.includes(currentDay);
        if (!dayMatches) continue;

        // Verify hour and minute match
        if (rem.timeHour !== currentHour || rem.timeMinute !== currentMinute) {
          continue;
        }

        // Verify not already acknowledged today
        if (rem.lastAcked) {
          const ackDateStr = new Date(rem.lastAcked).toDateString();
          if (ackDateStr === todayStr) {
            continue;
          }
        }

        // Verify not already triggered during this minute
        const triggerKey = `${rem.id}_${todayStr}_${currentHour}_${currentMinute}`;
        if (triggeredKeysRef.current.has(triggerKey)) {
          continue;
        }

        // Mark as triggered for this minute
        triggeredKeysRef.current.add(triggerKey);

        // Limit cache size to prevent memory leaks
        if (triggeredKeysRef.current.size > 200) {
          triggeredKeysRef.current.clear();
          triggeredKeysRef.current.add(triggerKey);
        }

        // Trigger multimodal haptics if available
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
          navigator.vibrate([300, 100, 300, 100, 400]);
        }

        // System notification if permission granted
        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          try {
            new Notification(rem.label, {
              body: 'Time for your care routine',
              icon: '/favicon.svg',
            });
          } catch {
            // Notifications may be blocked in insecure contexts
          }
        }

        // Set active due reminder and play voice prompt
        setActiveDueReminder(rem);
        playReminderAudioPrompt(rem);

        if (onTriggerRef.current) {
          onTriggerRef.current(rem);
        }

        // Process one reminder per tick to avoid overlapping prompts
        break;
      }
    } catch (err) {
      console.error('Error during reminder check tick:', err);
    }
  }, [playReminderAudioPrompt]);

  const dismissDueReminder = useCallback(() => {
    stopActiveAudio();
    setActiveDueReminder(null);
  }, [stopActiveAudio]);

  const acknowledgeDueReminder = useCallback(
    async (reminderToAck?: Reminder) => {
      stopActiveAudio();
      playSuccessChime();

      const target = reminderToAck || activeDueReminder;
      if (!target) {
        setActiveDueReminder(null);
        return;
      }

      try {
        const now = new Date();
        await db.reminderLogs.add({
          reminderId: target.id || 0,
          patientId: target.patientId || 1,
          scheduledAt: now,
          acknowledgedAt: now,
          synced: 0,
        });

        if (target.id) {
          await db.reminders.update(target.id, { lastAcked: now });
        }
      } catch (err) {
        console.error('Failed to log reminder acknowledgment:', err);
      } finally {
        setActiveDueReminder(null);
      }
    },
    [stopActiveAudio, playSuccessChime, activeDueReminder]
  );

  // Foreground polling loop
  useEffect(() => {
    const timer = setInterval(() => {
      checkDueReminders();
    }, intervalMs);

    const initialTimer = setTimeout(() => {
      checkDueReminders();
    }, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
      stopActiveAudio();
    };
  }, [checkDueReminders, intervalMs, stopActiveAudio]);

  return {
    activeDueReminder,
    dismissDueReminder,
    acknowledgeDueReminder,
    checkDueReminders,
  };
}
