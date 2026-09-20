/**
 * useVoice Hook
 *
 * Provides multilingual voice assistance, speech synthesis, and audio feedback.
 * Works seamlessly offline via the Web Speech API and Web Audio synthesizer chimes,
 * while also providing an integration hook for Government of India's Bhashini API.
 */

import { useCallback, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { synthesizeBhashiniTTS } from '../services/bhashiniService';

// Web Speech API language mappings
const SPEECH_LANG_MAP: Record<Language, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US'],
  as: ['as-IN', 'bn-IN', 'hi-IN', 'en-IN'],
  brx: ['hi-IN', 'en-IN'],
  mni: ['bn-IN', 'hi-IN', 'en-IN'],
};

export function useVoice() {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Web Audio Context on demand
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /**
   * Speak a text message in the user's preferred language.
   * Priority: Online Government Bhashini AI Neural Voice -> Offline Web Speech API.
   */
  const speak = useCallback(async (text: string, overrideLang?: Language) => {
    const targetLang = overrideLang || language;

    // Stop previous audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    // Try online Bhashini TTS first if navigator is online
    if (navigator.onLine && targetLang !== 'en') {
      try {
        const audioUri = await synthesizeBhashiniTTS(text, targetLang);
        if (audioUri) {
          const audio = new Audio(audioUri);
          activeAudioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          await audio.play();
          return;
        }
      } catch {
        // Fall through to offline Web Speech
      }
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this device');
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const preferredCodes = SPEECH_LANG_MAP[targetLang] || ['en-IN'];

      let voices = window.speechSynthesis.getVoices();
      let matchedVoice = null;

      if (voices.length > 0) {
        for (const code of preferredCodes) {
          matchedVoice = voices.find(
            (v) =>
              v.lang.toLowerCase() === code.toLowerCase() ||
              v.lang.toLowerCase().replace('_', '-').startsWith(code.toLowerCase().slice(0, 2))
          );
          if (matchedVoice) {
            utterance.voice = matchedVoice;
            utterance.lang = matchedVoice.lang;
            break;
          }
        }
      }

      if (!matchedVoice) {
        utterance.lang = preferredCodes[0];
      }

      // Dementia-friendly speech pacing: unhurried, clear, gentle
      utterance.rate = 0.82;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error speaking text:', err);
      setIsSpeaking(false);
    }
  }, [language]);

  /**
   * Stop any active speech or audio synthesis
   */
  const stopSpeaking = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  /**
   * Harmonious success chime (C5 - E5 - G5 ascending arpeggio)
   * Designed to be uplifting and non-startling for dementia patients.
   */
  const playSuccessChime = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  }, [getAudioContext]);

  /**
   * Soft card flip / tactile sound
   */
  const playCardFlip = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }, [getAudioContext]);

  /**
   * Gentle reminder chime
   */
  const playReminderChime = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two gentle chime rings
    [0, 0.4].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + delay); // A5

      gain.gain.setValueAtTime(0.01, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.2, now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.55);
    });
  }, [getAudioContext]);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    playSuccessChime,
    playCardFlip,
    playReminderChime,
  };
}
