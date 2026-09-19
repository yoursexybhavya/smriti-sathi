import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Pill,
  Droplets,
  Sparkles,
  Calendar,
  Bell,
  CheckCircle2,
  Mic,
  Clock,
  Volume2,
} from 'lucide-react';
import { type Reminder } from '../db/database';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../contexts/LanguageContext';

export interface MultimodalReminderModalProps {
  reminder: Reminder;
  onAcknowledge: (reminder?: Reminder) => void | Promise<void>;
  onDismiss?: () => void;
}

export function MultimodalReminderModal({
  reminder,
  onAcknowledge,
  onDismiss,
}: MultimodalReminderModalProps) {
  const { speak, playReminderChime, playSuccessChime } = useVoice();
  const { t } = useLanguage();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Lock body scroll on mount, restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Device Haptic Feedback on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([300, 120, 300, 120, 450]);
      } catch (err) {
        console.warn('Haptic vibration failed on modal mount:', err);
      }
    }
  }, []);

  // Format time (e.g. 08:30 AM)
  const formatReminderTime = (hour: number, minute: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  // Get localized prompt header text based on reminder type
  const getPromptCategoryText = () => {
    switch (reminder.type) {
      case 'medicine':
        return t.timeForMedicine || 'TIME FOR MEDICINE';
      case 'water':
        return t.timeForWater || 'TIME TO DRINK WATER';
      case 'activity':
        return t.timeForActivity || 'TIME FOR BRAIN WORKOUT';
      case 'appointment':
        return t.appointment ? `${t.appointment.toUpperCase()} ALERT` : 'SCHEDULED APPOINTMENT';
      default:
        return 'CARE REMINDER';
    }
  };

  // Synchronized Audio Playback on mount
  useEffect(() => {
    let isCancelled = false;

    const cleanupAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };

    cleanupAudio();

    if (reminder.audioBlob) {
      try {
        const audioUrl = URL.createObjectURL(reminder.audioBlob);
        audioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          if (audioRef.current === audio) {
            audioRef.current = null;
          }
        };

        audio.onerror = () => {
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          if (audioRef.current === audio) {
            audioRef.current = null;
          }
          if (!isCancelled) {
            playReminderChime();
            const promptText = getPromptCategoryText();
            speak(`${promptText}. ${reminder.label}`);
          }
        };

        audio.play().catch((err) => {
          console.warn('Audio playback failed or was blocked by browser:', err);
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          if (audioRef.current === audio) {
            audioRef.current = null;
          }
          if (!isCancelled) {
            playReminderChime();
            const promptText = getPromptCategoryText();
            speak(`${promptText}. ${reminder.label}`);
          }
        });
      } catch (err) {
        console.warn('Audio initialization error:', err);
        if (!isCancelled) {
          playReminderChime();
          const promptText = getPromptCategoryText();
          speak(`${promptText}. ${reminder.label}`);
        }
      }
    } else {
      playReminderChime();
      const promptText = getPromptCategoryText();
      speak(`${promptText}. ${reminder.label}`);
    }

    return () => {
      isCancelled = true;
      cleanupAudio();
    };
  }, [reminder, playReminderChime, speak]);

  const handleAcknowledge = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    // Confirmation haptic double-tap
    if (typeof window !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([120, 60, 120]);
      } catch {
        // Guarded against errors
      }
    }

    playSuccessChime();
    await onAcknowledge(reminder);
  }, [onAcknowledge, playSuccessChime, reminder]);

  const handleDismiss = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  // Literal Iconography (>= 72px)
  const renderLiteralIcon = () => {
    const iconSize = 76;
    switch (reminder.type) {
      case 'medicine':
        return <Pill size={iconSize} color="#F59E0B" strokeWidth={2.2} aria-label="Medicine Pill" />;
      case 'water':
        return <Droplets size={iconSize} color="#38BDF8" strokeWidth={2.2} aria-label="Water Droplets" />;
      case 'activity':
        return <Sparkles size={iconSize} color="#10B981" strokeWidth={2.2} aria-label="Brain Workout Activity" />;
      case 'appointment':
        return <Calendar size={iconSize} color="#A855F7" strokeWidth={2.2} aria-label="Doctor Appointment" />;
      default:
        return <Bell size={iconSize} color="#FF7247" strokeWidth={2.2} aria-label="General Reminder" />;
    }
  };

  if (typeof document === 'undefined') {
    return null;
  }

  const mountNode = document.getElementById('modal-root') || document.body;

  const modalContent = (
    <div
      id="multimodal-reminder-overlay"
      className="multimodal-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="multimodal-reminder-title"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        backgroundColor: '#0A1420',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Centered Modal Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
        }}
      >
        {/* Literal Icon Container (>= 88px) */}
        <div
          data-icon={reminder.type}
          data-icon-type={reminder.type}
          data-testid="reminder-icon-container"
          style={{
            width: '96px',
            height: '96px',
            minWidth: '96px',
            minHeight: '96px',
            borderRadius: '50%',
            backgroundColor: '#15253B',
            border: '2px solid #223752',
            boxShadow: '0 0 32px rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderLiteralIcon()}
        </div>

        {/* Prompt Category Header (>= 24px) */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#FBBF24',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {getPromptCategoryText()}
        </div>

        {/* Familiar Voice Audio Badge (>= 24px) if custom recording attached */}
        {reminder.audioBlob ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#34D399',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <Mic size={26} color="#10B981" />
            <span>Familiar Voice Prompt</span>
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '2px solid #0284C7',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#38BDF8',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <Volume2 size={26} color="#38BDF8" />
            <span>Spoken Audio Alert</span>
          </div>
        )}

        {/* Primary Reminder Title (>= 24px, bold white #FFFFFF) */}
        <h1
          id="multimodal-reminder-title"
          style={{
            fontSize: '34px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0',
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
            maxWidth: '480px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {reminder.label.toUpperCase()}
        </h1>

        {/* Time Badge (>= 24px) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '24px',
            fontWeight: 600,
            color: '#E2E8F0',
            backgroundColor: '#0F1D2F',
            border: '1px solid #1E344F',
            borderRadius: '12px',
            padding: '10px 20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <Clock size={24} color="#94A9C4" />
          <span>Scheduled for {formatReminderTime(reminder.timeHour, reminder.timeMinute)}</span>
        </div>

        {/* Prominent Emerald Touch Button (height >= 68px, text >= 24px) */}
        <button
          type="button"
          onClick={handleAcknowledge}
          data-testid="modal-acknowledge-button"
          style={{
            width: '100%',
            maxWidth: '440px',
            height: '72px',
            minHeight: '68px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '24px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 32px rgba(16, 185, 129, 0.55)',
            marginTop: '12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          <CheckCircle2 size={32} color="#FFFFFF" strokeWidth={2.5} />
          <span>I HAVE TAKEN THIS</span>
        </button>

        {/* Optional / Accessible Dismiss Button (>= 24px) */}
        {onDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            data-testid="modal-dismiss-button"
            style={{
              height: '56px',
              minHeight: '48px',
              backgroundColor: 'transparent',
              color: '#94A9C4',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '24px',
              fontWeight: 600,
              padding: '8px 24px',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            Remind Me Later
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, mountNode);
}
