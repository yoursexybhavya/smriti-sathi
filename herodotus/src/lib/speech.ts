export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';
export type SpeechLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export interface SpeechCallbacks {
  onStateChange?: (state: PlaybackState) => void;
  onBoundary?: (charIndex: number) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

// Module-level persistent references to prevent Chromium garbage collection bugs
let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let isInitialized = false;

/**
 * Checks if the Web Speech API Synthesis is supported in the current environment.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Initializes the Web Speech engine and populates the system voice cache.
 * Registers `onvoiceschanged` handler for asynchronous voice loading in browsers like Chrome.
 */
export function initSpeechEngine(): void {
  if (isInitialized || !isSpeechSynthesisSupported()) return;

  const updateVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };

  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
  isInitialized = true;
}

/**
 * Retrieves cached system voices.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (cachedVoices.length === 0 && isSpeechSynthesisSupported()) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

/**
 * Selects the optimal system voice for the specified language with regional dial-in and system fallback.
 * Supports:
 * - English: en-IN -> en-GB -> en-US -> en
 * - Hindi: hi-IN -> hi -> hi_IN
 * - Tamil: ta-IN -> ta -> ta_LK
 * - Telugu: te-IN -> te -> te_IN
 * - Bengali: bn-IN -> bn-BD -> bn -> bn_IN
 */
export function selectVoiceForLanguage(
  lang: SpeechLanguage,
  voices: SpeechSynthesisVoice[] = getAvailableVoices()
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const langCodes: Record<SpeechLanguage, string[]> = {
    en: ['en-IN', 'en-GB', 'en-US', 'en'],
    hi: ['hi-IN', 'hi', 'hi_IN'],
    ta: ['ta-IN', 'ta', 'ta_LK'],
    te: ['te-IN', 'te', 'te_IN'],
    bn: ['bn-IN', 'bn-BD', 'bn', 'bn_IN'],
  };

  const targetCodes = langCodes[lang] || [lang];

  for (const code of targetCodes) {
    const targetNorm = code.toLowerCase().replace('_', '-');
    const matched = voices.find((v) => {
      const vLangNorm = v.lang.toLowerCase().replace('_', '-');
      return vLangNorm.startsWith(targetNorm);
    });
    if (matched) return matched;
  }

  // Fallback to default system voice or first available voice
  return voices.find((v) => v.default) || voices[0] || null;
}

export const getAvailableVoice = selectVoiceForLanguage;

/**
 * Synthesizes and narrates speech using the browser-native Web Speech API.
 * 
 * Features:
 * - Cancels existing audio before starting
 * - Protects against Chromium GC bug via module-level reference
 * - Heartbeat interval to prevent Chrome 15s freeze on long texts
 * - Clamps playback rate to [0.75, 1.5]
 * - Fires appropriate lifecycle callbacks
 */
export function playNarration(
  text: string,
  lang: SpeechLanguage,
  rate = 1.0,
  callbacks?: SpeechCallbacks
): void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onError?.('Web Speech API is not supported in this browser.');
    return;
  }

  // Cancel any active utterance cleanly
  stopNarration();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;

  utterance.rate = Math.min(Math.max(rate, 0.75), 1.5);
  utterance.pitch = 1.0;

  const voice = selectVoiceForLanguage(lang);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    const defaultCodes: Record<SpeechLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
    };
    utterance.lang = defaultCodes[lang] || 'en-IN';
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
    callbacks?.onStateChange?.('playing');

    // Chromium keep-alive heartbeat: pause and resume every 10s to avoid silent freeze
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    keepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  utterance.onend = () => {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
    activeUtterance = null;
    callbacks?.onEnd?.();
    callbacks?.onStateChange?.('idle');
  };

  utterance.onerror = (e) => {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
    activeUtterance = null;
    // Don't treat intentional cancellation / interruption as fatal errors
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      callbacks?.onError?.(`Speech synthesis error: ${e.error}`);
    }
    callbacks?.onStateChange?.('idle');
  };

  if (callbacks?.onBoundary) {
    utterance.onboundary = (e) => {
      callbacks.onBoundary?.(e.charIndex);
    };
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Pauses active narration.
 */
export function pauseNarration(callbacks?: SpeechCallbacks): void {
  if (!isSpeechSynthesisSupported()) return;
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    callbacks?.onPause?.();
    callbacks?.onStateChange?.('paused');
  }
}

/**
 * Resumes paused narration.
 */
export function resumeNarration(callbacks?: SpeechCallbacks): void {
  if (!isSpeechSynthesisSupported()) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    callbacks?.onResume?.();
    callbacks?.onStateChange?.('playing');
  }
}

/**
 * Stops narration completely and resets utterance reference.
 */
export function stopNarration(callbacks?: SpeechCallbacks): void {
  if (!isSpeechSynthesisSupported()) return;
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
  window.speechSynthesis.cancel();
  activeUtterance = null;
  callbacks?.onStateChange?.('stopped');
}
