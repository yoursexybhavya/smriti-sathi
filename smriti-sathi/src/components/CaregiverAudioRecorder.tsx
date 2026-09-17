import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { db } from '../db/database';

export interface CaregiverAudioRecorderProps {
  reminderId?: number;
  reminderLabel?: string;
  initialAudioBlob?: Blob | null;
  initialDurationSec?: number;
  onSave?: (blob: Blob, durationSec: number) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel?: () => void;
  compact?: boolean;
}

export function CaregiverAudioRecorder({
  reminderId,
  reminderLabel,
  initialAudioBlob,
  initialDurationSec = 0,
  onSave,
  onDelete,
  onCancel,
  compact = false,
}: CaregiverAudioRecorderProps) {
  const {
    isRecording,
    durationSec,
    audioBlob: recordedBlob,
    audioUrl: recordedUrl,
    error: recorderError,
    startRecording,
    stopRecording,
    cancelRecording,
    clearRecording,
  } = useAudioRecorder();

  const [overrideBlob, setOverrideBlob] = useState<{ blob: Blob | null; duration: number } | null>(null);
  const existingBlob = overrideBlob !== null ? overrideBlob.blob : (initialAudioBlob || null);
  const existingDuration = overrideBlob !== null ? overrideBlob.duration : initialDurationSec;
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgressSec, setPlayProgressSec] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const existingUrlRef = useRef<string | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create or update object URL for existing blob
  useEffect(() => {
    if (existingBlob) {
      const url = URL.createObjectURL(existingBlob);
      existingUrlRef.current = url;
      return () => {
        URL.revokeObjectURL(url);
        existingUrlRef.current = null;
      };
    } else {
      existingUrlRef.current = null;
    }
  }, [existingBlob]);

  const activeAudioUrl = recordedUrl || existingUrlRef.current;
  const activeDuration = recordedBlob ? durationSec : existingDuration;

  const stopPreviewAudio = useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    setIsPlaying(false);
    setPlayProgressSec(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPreviewAudio();
    };
  }, [stopPreviewAudio]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPreviewAudio();
      return;
    }

    if (!activeAudioUrl) return;

    stopPreviewAudio();
    const audio = new Audio(activeAudioUrl);
    previewAudioRef.current = audio;

    audio.onended = () => {
      stopPreviewAudio();
    };

    audio.onerror = () => {
      stopPreviewAudio();
      setLocalError('Unable to play audio recording.');
    };

    audio.play().then(() => {
      setIsPlaying(true);
      playTimerRef.current = setInterval(() => {
        if (previewAudioRef.current) {
          setPlayProgressSec(Math.floor(previewAudioRef.current.currentTime));
        }
      }, 250);
    }).catch((err) => {
      console.warn('Audio preview playback blocked or failed:', err);
      setLocalError('Audio playback was prevented by the browser.');
      stopPreviewAudio();
    });
  };

  const handleStartRecord = async () => {
    stopPreviewAudio();
    setLocalError(null);
    setSaveSuccess(false);
    try {
      await startRecording();
    } catch {
      // Handled by hook error state
    }
  };

  const handleStopRecord = async () => {
    await stopRecording();
  };

  const handleCancelRecord = () => {
    cancelRecording();
    setLocalError(null);
  };

  const handleSave = async () => {
    const blobToSave = recordedBlob;
    if (!blobToSave) return;

    setIsSaving(true);
    setLocalError(null);

    try {
      if (reminderId) {
        await db.reminders.update(reminderId, {
          audioBlob: blobToSave,
          audioDurationSec: durationSec,
          audioRecordedAt: new Date(),
        });
      }

      if (onSave) {
        await onSave(blobToSave, durationSec);
      }

      setOverrideBlob({ blob: blobToSave, duration: durationSec });
      clearRecording();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save reminder voice recording:', err);
      setLocalError('Failed to save recording to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    stopPreviewAudio();
    clearRecording();
    setIsSaving(true);
    try {
      if (reminderId) {
        await db.reminders.update(reminderId, {
          audioBlob: undefined,
          audioDurationSec: undefined,
          audioRecordedAt: undefined,
        });
      }
      if (onDelete) {
        await onDelete();
      }
      setOverrideBlob({ blob: null, duration: 0 });
      setSaveSuccess(false);
    } catch (err) {
      console.error('Failed to delete reminder voice recording:', err);
      setLocalError('Failed to delete recording.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const errorMessage = recorderError || localError;

  return (
    <div
      className="caregiver-audio-recorder"
      style={{
        backgroundColor: compact ? '#0A1524' : '#0B1728',
        border: isRecording ? '2px solid #EF4444' : '1px solid #1E3A5F',
        borderRadius: '16px',
        padding: compact ? '12px 16px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Header / Context */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={18} color={isRecording ? '#EF4444' : '#38BDF8'} />
            <span>{reminderLabel ? `Familiar Voice: ${reminderLabel}` : 'Familiar Voice Prompt'}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8EA7C5', marginTop: '2px' }}>
            {isRecording
              ? 'Recording in progress... speak clearly in your natural voice.'
              : existingBlob || recordedBlob
              ? 'Caregiver voice attached. Plays when reminder is triggered.'
              : 'Record in a family member\'s voice to comfort and guide the elder.'}
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => {
              stopPreviewAudio();
              cancelRecording();
              onCancel();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#647B99',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '4px 8px',
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            fontSize: '12px',
          }}
        >
          <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success banner */}
      {saveSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6EE7B7',
            fontSize: '12px',
          }}
        >
          <Check size={16} color="#10B981" />
          <span>Voice prompt saved to reminder successfully!</span>
        </div>
      )}

      {/* State 1: Active Recording UI */}
      {isRecording && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '18px 12px',
            backgroundColor: '#160F1A',
            border: '1px solid #7F1D1D',
            borderRadius: '12px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 10px #EF4444',
                animation: 'pulse 1s infinite',
              }}
            />
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
              {formatSec(durationSec)}
            </span>
          </div>

          {/* Simple animated soundwave simulator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px' }}>
            {[40, 70, 100, 60, 85, 50, 90, 65, 45].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: `${h}%`,
                  backgroundColor: '#EF4444',
                  borderRadius: '2px',
                  opacity: 0.8,
                  animation: `pulse ${(i % 3) * 0.3 + 0.5}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              onClick={handleStopRecord}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              }}
              aria-label="Stop recording"
            >
              <Square size={16} fill="#FFFFFF" />
              <span>Done Recording</span>
            </button>

            <button
              onClick={handleCancelRecord}
              style={{
                backgroundColor: '#202E42',
                color: '#C8D5E5',
                border: '1px solid #334B6B',
                borderRadius: '9999px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              aria-label="Cancel recording"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* State 2: Recorded Blob Pending Save (Preview & Confirm) */}
      {!isRecording && recordedBlob && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#0F2137',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #234E7B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleTogglePlay}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#38BDF8',
                  color: '#07101B',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(56, 189, 248, 0.4)',
                }}
                aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  {isPlaying ? 'Playing Preview...' : 'Preview New Recording'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A9C4' }}>
                  {formatSec(isPlaying ? playProgressSec : activeDuration)} / {formatSec(activeDuration)}
                </div>
              </div>
            </div>

            <button
              onClick={clearRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: '#94A9C4',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              aria-label="Discard recording"
            >
              <RotateCcw size={14} />
              <span>Re-record</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
              aria-label="Save voice prompt"
            >
              <Check size={18} />
              <span>{isSaving ? 'Saving...' : 'Save Voice Prompt'}</span>
            </button>

            <button
              onClick={clearRecording}
              style={{
                backgroundColor: '#1B2C42',
                color: '#CBD5E1',
                border: '1px solid #284469',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              aria-label="Discard"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* State 3: Existing Saved Audio or Ready to Record */}
      {!isRecording && !recordedBlob && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {existingBlob ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#0F2137',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #1E3E66',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleTogglePlay}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
                </button>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {isPlaying ? 'Playing Audio...' : 'Voice Prompt Attached'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
                    {formatSec(isPlaying ? playProgressSec : existingDuration)} duration
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleStartRecord}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#16283F',
                    color: '#38BDF8',
                    border: '1px solid #234E7B',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  aria-label="Replace recording"
                >
                  <RotateCcw size={13} />
                  <span>Replace</span>
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#F87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    width: '34px',
                    height: '34px',
                    cursor: 'pointer',
                  }}
                  title="Remove voice prompt"
                  aria-label="Remove voice prompt"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartRecord}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: '#13243A',
                border: '1px dashed #2C4D75',
                borderRadius: '12px',
                padding: '14px 20px',
                color: '#38BDF8',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              aria-label="Record voice prompt"
            >
              <Mic size={18} color="#38BDF8" />
              <span>Record Voice Prompt</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
