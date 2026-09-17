import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useInactivityScaffold
 *
 * Evidence-based cognitive scaffolding hook for dementia care (Milestone 3).
 * Detects user inactivity and triggers a visual beacon (emerald pulse)
 * to guide the elder toward the correct target after `delayMs` (default: 3000ms).
 *
 * Automatically resets the countdown on user interaction (click, touch, keydown)
 * or explicit manual resets.
 */
export function useInactivityScaffold(
  delayMs: number = 3000,
  onScaffold?: () => void
): {
  showScaffold: boolean;
  isScaffoldActive: boolean;
  resetInactivity: () => void;
  triggerInteraction: () => void;
} {
  const [showScaffold, setShowScaffold] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const onScaffoldRef = useRef(onScaffold);

  useEffect(() => {
    onScaffoldRef.current = onScaffold;
  }, [onScaffold]);

  const resetInactivity = useCallback(() => {
    setShowScaffold(false);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setShowScaffold(true);
      if (onScaffoldRef.current) {
        onScaffoldRef.current();
      }
    }, delayMs);
  }, [delayMs]);

  const triggerInteraction = useCallback(() => {
    resetInactivity();
  }, [resetInactivity]);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setShowScaffold(true);
      if (onScaffoldRef.current) {
        onScaffoldRef.current();
      }
    }, delayMs);

    const handleUserInteraction = () => {
      resetInactivity();
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [delayMs, resetInactivity]);

  return {
    showScaffold,
    isScaffoldActive: showScaffold,
    resetInactivity,
    triggerInteraction,
  };
}
