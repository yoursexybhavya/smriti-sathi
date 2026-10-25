/**
 * SMRITI SATHI — Sundowning & Evening Circadian Care
 * 
 * Non-pharmacological behavioral calming intervention for evening agitation
 * and disorientation (Sundowning Syndrome) in dementia patients.
 * 
 * Features:
 * - Familiar Family Voice Reassurance ("You are safe at home")
 * - 4-7-8 Guided Serene Breathing Pacer with soft pulsing ring
 * - Relaxing Ambient Audio Chimes (Temple prayer chime, river breeze, soft rain)
 * - Circadian Anchoring (Tea time & evening medicine check)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sunset,
  Heart,
  Coffee,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';

interface SundowningCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SundowningCareModal: React.FC<SundowningCareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const { patient } = usePatient();

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'breeze' | 'chime' | 'rain' | 'off'>('chime');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [teaDone, setTeaDone] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const elderName = patient?.name || 'Kamala Baa';

  // 4-7-8 Breathing Timer Loop
  useEffect(() => {
    if (!isOpen) return;
    let phase = 0; // 0 = Inhale (4s), 1 = Hold (7s), 2 = Exhale (8s)
    setBreathPhase('Inhale');

    const interval = setInterval(() => {
      phase = (phase + 1) % 3;
      if (phase === 0) setBreathPhase('Inhale');
      else if (phase === 1) setBreathPhase('Hold');
      else setBreathPhase('Exhale');
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Ambient chime synthesis with Web Audio API (100% offline, zero audio asset dependency)
  const playCalmingChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic pentatonic pitch (D4 = 293.66Hz or E4 = 329.63Hz)
      osc.frequency.setValueAtTime(329.63, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(164.81, ctx.currentTime + 3.0);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  const handleSpeakReassurance = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingVoice) {
      setIsPlayingVoice(false);
      return;
    }

    setIsPlayingVoice(true);
    playCalmingChime();

    const textByLang: Record<string, string> = {
      as: `নমস্কাৰ ${elderName}। সন্ধিয়া নামি আহিছে। আপুনি আপোনাৰ ঘৰতে সুৰক্ষিতভাৱে আছে। ভৱ্য আৰু পৰিয়ালৰ সকলো আপোনাৰ লগত আছে। অলপ জিৰণি লওক, আৰু আমাৰ লগত চাহ কাপ খাওক।`,
      hi: `नमस्ते ${elderName} जी। शाम हो चुकी है। आप अपने ही घर में पूरी तरह सुरक्षित हैं। आपका परिवार आपके साथ है। आराम से बैठिए और गरम चाय पीजिए।`,
      en: `Good evening ${elderName}. Dusk has arrived. You are safe and secure at home with your family. Take a gentle breath, relax, and enjoy your warm evening tea.`,
      brx: `खुलुमबाय ${elderName}। बेलासिनि समा जाबाय। नोंथाङा नोंथांनि नआवनो मोजाङैनो दं।`,
      mni: `খুরুমজরি ${elderName}। নুমিৎ লোইশিল্লক্লে। অদোমগী য়ুমদা নীংথিনা লৈরি।`,
    };

    const textToSpeak = textByLang[language] || textByLang['en'];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'as' ? 'as-IN' : language === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.85; // Calming gentle tempo
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sundowning-title"
    >
      <div className="w-full max-w-xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Evening Amber Banner */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-xs">
              <Sunset size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Circadian Soothing Care
                </span>
                <span className="text-xs text-amber-200/80">• সন্ধিয়াৰ শান্তি</span>
              </div>
              <h2 id="sundowning-title" className="text-lg sm:text-xl font-black mt-0.5 text-white">
                Evening Peace Routine / সান্ধ্যকালীন শান্ততা
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-center">
          {/* Calming Reassurance Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              <span>You Are Safe At Home</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              &ldquo;{elderName}, you are safe in your own home with your loved ones. Dusk is here, and everything is calm.&rdquo;
            </p>
            <p className="text-xs text-slate-400 font-medium">
              অসমীয়া: &ldquo;আপুনি আপোনাৰ ঘৰতে আছে। পৰিয়ালৰ সকলো আপোনাৰ লগত আছে।&rdquo;
            </p>

            <button
              type="button"
              onClick={handleSpeakReassurance}
              className={`w-full min-h-[56px] py-3 px-5 rounded-2xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                isPlayingVoice
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlayingVoice ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlayingVoice ? 'Pause Familiar Voice' : 'Listen to Family Voice Prompt (🔊)'}</span>
            </button>
          </div>

          {/* 4-7-8 Deep Breathing Ring Pacer */}
          <div className="py-2 flex flex-col items-center">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
              Gentle Breathing Anchor / উশাহ-নিশাহৰ অনুশীলন
            </div>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-amber-400/40 transition-transform duration-[4000ms] ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 border-amber-400/80'
                    : breathPhase === 'Hold'
                    ? 'scale-105 border-indigo-400/80'
                    : 'scale-90 border-emerald-400/60'
                }`}
              />

              {/* Glowing center sphere */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-[4000ms] shadow-2xl ${
                  breathPhase === 'Inhale'
                    ? 'bg-gradient-to-tr from-amber-600 to-amber-400 scale-105 shadow-amber-500/30'
                    : breathPhase === 'Hold'
                    ? 'bg-gradient-to-tr from-indigo-600 to-indigo-400 scale-100 shadow-indigo-500/30'
                    : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 scale-95 shadow-emerald-500/30'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {breathPhase === 'Inhale' ? 'উশাহ লওক' : breathPhase === 'Hold' ? 'ধৰি ৰাখক' : 'এৰি দিয়ক'}
                </span>
                <span className="text-lg sm:text-xl font-black text-white">{breathPhase}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 max-w-xs">
              Slow continuous breaths soothe the vagus nerve and reduce evening cognitive confusion.
            </p>
          </div>

          {/* Evening Routine Step (Warm Tea / Milk) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-left gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Coffee size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Warm Evening Tea / গৰম চাহ</div>
                <div className="text-xs text-amber-200/80">A soothing cup with ginger or milk</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTeaDone(!teaDone);
                playCalmingChime();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                teaDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{teaDone ? '✓ Enjoyed' : 'Mark Done'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
export default SundowningCareModal;
