import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  durationSec: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
  clearRecording: () => void;
}

function getPreferredMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
  ];
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  // Sync activeUrlRef with state for clean revocation
  useEffect(() => {
    activeUrlRef.current = audioUrl;
  }, [audioUrl]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const revokeUrl = useCallback(() => {
    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current);
      activeUrlRef.current = null;
    }
  }, []);

  const clearRecording = useCallback(() => {
    revokeUrl();
    setAudioBlob(null);
    setAudioUrl(null);
    setDurationSec(0);
    setError(null);
  }, [revokeUrl]);

  const cancelRecording = useCallback(() => {
    clearTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        // Prevent onstop from creating a blob on cancel
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore stop errors if already stopping
      }
    }
    cleanupStream();
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setDurationSec(0);
    if (stopResolverRef.current) {
      stopResolverRef.current(null);
      stopResolverRef.current = null;
    }
  }, [clearTimer, cleanupStream]);

  const startRecording = useCallback(async () => {
    setError(null);
    clearRecording();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Audio recording is not supported in this browser environment.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mimeType = getPreferredMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const recordedBlob = new Blob(chunksRef.current, { type: finalMime });
        chunksRef.current = [];
        cleanupStream();

        setAudioBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        clearTimer();

        if (stopResolverRef.current) {
          stopResolverRef.current(recordedBlob);
          stopResolverRef.current = null;
        }
      };

      recorder.onerror = (event) => {
        const msg = (event as unknown as { error?: Error })?.error?.message || 'MediaRecorder error occurred.';
        setError(msg);
        cancelRecording();
      };

      // Start recording with 200ms timeslice for responsive chunking
      recorder.start(200);
      setIsRecording(true);
      setIsPaused(false);
      setDurationSec(0);

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setDurationSec(elapsed);
      }, 500);
    } catch (err: unknown) {
      cleanupStream();
      const message = err instanceof Error ? err.message : 'Microphone access denied or unavailable.';
      setError(message);
      throw err;
    }
  }, [clearRecording, cleanupStream, clearTimer, cancelRecording]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      clearTimer();
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
        cleanupStream();
        resolve(null);
        return;
      }

      stopResolverRef.current = resolve;
      try {
        recorder.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
        cleanupStream();
        setIsRecording(false);
        setIsPaused(false);
        resolve(null);
      }
    });
  }, [clearTimer, cleanupStream]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearTimer();
    }
  }, [clearTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      const currentDuration = durationSec;
      const resumeTime = Date.now();
      timerRef.current = setInterval(() => {
        const added = Math.floor((Date.now() - resumeTime) / 1000);
        setDurationSec(currentDuration + added);
      }, 500);
    }
  }, [durationSec]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.ondataavailable = null;
          mediaRecorderRef.current.onstop = null;
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore unmount stop errors
        }
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (activeUrlRef.current) {
        URL.revokeObjectURL(activeUrlRef.current);
      }
    };
  }, [clearTimer]);

  return {
    isRecording,
    isPaused,
    durationSec,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    clearRecording,
  };
}
