import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn';

interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  supported: boolean;
  rate: number;
  availableVoices: SpeechSynthesisVoice[];
}

export function useSpeech() {
  const [state, setState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    rate: 1.0,
    availableVoices: []
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices on mount
  useEffect(() => {
    if (!state.supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setState(prev => ({ ...prev, availableVoices: voices }));
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [state.supported]);

  const selectVoiceForLanguage = useCallback((lang: SpeechLanguage, voices: SpeechSynthesisVoice[]) => {
    const langCodes: Record<SpeechLanguage, string[]> = {
      en: ['en-IN', 'en-GB', 'en-US', 'en'],
      hi: ['hi-IN', 'hi', 'hi_IN'],
      ta: ['ta-IN', 'ta', 'ta_LK'],
      te: ['te-IN', 'te'],
      bn: ['bn-IN', 'bn-BD', 'bn']
    };

    const targetCodes = langCodes[lang] || ['en'];

    for (const code of targetCodes) {
      const match = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(code.toLowerCase()));
      if (match) return match;
    }
    // Default fallback
    return voices.find(v => v.default) || voices[0] || null;
  }, []);

  const play = useCallback((text: string, lang: SpeechLanguage = 'en', customRate?: number) => {
    if (!state.supported) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const playbackRate = customRate !== undefined ? customRate : state.rate;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    const matchedVoice = selectVoiceForLanguage(lang, state.availableVoices);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      const fallbackLangMap: Record<SpeechLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN'
      };
      utterance.lang = fallbackLangMap[lang] || 'en-IN';
    }

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.supported, state.rate, state.availableVoices, selectVoiceForLanguage]);

  const pause = useCallback(() => {
    if (!state.supported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, [state.supported]);

  const resume = useCallback(() => {
    if (!state.supported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [state.supported]);

  const stop = useCallback(() => {
    if (!state.supported) return;
    window.speechSynthesis.cancel();
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
  }, [state.supported]);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    setRate,
    rate: state.rate,
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    supported: state.supported
  };
}
