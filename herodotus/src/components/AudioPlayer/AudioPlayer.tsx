import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, FastForward, Globe } from 'lucide-react';
import { Monument } from '../../types/monument';
import { PlaybackState, SpeechLanguage } from '../../lib/speech';
import { WaveformVisualizer } from './WaveformVisualizer';

export interface AudioPlayerProps {
  monument: Monument;
  playbackState: PlaybackState;
  selectedLanguage: SpeechLanguage;
  playbackRate: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  onLanguageChange: (lang: SpeechLanguage) => void;
  className?: string;
}

const LANGUAGES: { code: SpeechLanguage; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
  { code: 'ta', label: 'TA', name: 'தமிழ்' },
  { code: 'te', label: 'TE', name: 'తెలుగు' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
];

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  monument,
  playbackState,
  selectedLanguage,
  playbackRate,
  onPlay,
  onPause,
  onResume,
  onStop,
  onRateChange,
  onLanguageChange,
  className = '',
}) => {
  const currentAudio =
    monument.audioNarrations[selectedLanguage] || monument.audioNarrations.en;

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isActive = isPlaying || isPaused;

  // Approximate elapsed playback time timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= currentAudio.durationSeconds) return prev;
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else if (playbackState === 'idle' || playbackState === 'stopped') {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackState, playbackRate, currentAudio.durationSeconds]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / Math.max(1, currentAudio.durationSeconds)) * 100)
  );

  return (
    <div
      className={`bg-[#1A1714] border border-[#C69214]/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 ${className}`}
      aria-label="Multilingual Audio Narration Player"
    >
      {/* Header Row: Title & Language Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C69214]/20 border border-[#C69214]/40 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-[#C69214]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide">
              Living Audio Guide
            </h3>
            <p className="text-[11px] text-[#8A8279]">
              Browser-Native Web Speech · ~{currentAudio.durationSeconds}s
            </p>
          </div>
        </div>

        {/* 5-Language Switcher */}
        <div className="flex items-center gap-1 bg-[#12100E] p-1 rounded-xl border border-[#2E2A25]">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  if (selectedLanguage !== lang.code) {
                    onLanguageChange(lang.code);
                    if (isActive) onStop();
                  }
                }}
                className={`px-2 py-1 rounded-lg text-xs font-mono uppercase transition ${
                  isSelected
                    ? 'bg-[#C69214] text-[#0D0B09] font-bold shadow'
                    : 'text-[#8A8279] hover:text-[#E8E0D4]'
                }`}
                title={lang.name}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 16-Bar Waveform Visualizer */}
      <WaveformVisualizer playbackState={playbackState} barCount={16} />

      {/* Progress Bar & Elapsed Time */}
      <div className="space-y-1">
        <div className="w-full bg-[#12100E] h-1.5 rounded-full overflow-hidden border border-[#2E2A25]">
          <div
            className="bg-[#C69214] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-[#8A8279]">
          <span>{formatTime(elapsedSeconds)}</span>
          <span className="text-[#C69214] font-semibold">{currentAudio.title}</span>
          <span>{formatTime(currentAudio.durationSeconds)}</span>
        </div>
      </div>

      {/* Playback Controls & Speed Modulation */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          {!isPlaying && !isPaused && (
            <button
              onClick={onPlay}
              className="flex items-center gap-2 bg-[#C69214] hover:bg-[#D4A856] text-[#0D0B09] font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-[#C69214]/20 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Narration ({selectedLanguage.toUpperCase()})</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 bg-[#C69214] text-[#0D0B09] font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-[#C69214]/20 transition"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              onClick={onResume}
              className="flex items-center gap-2 bg-[#C69214] text-[#0D0B09] font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-[#C69214]/20 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
          )}

          {isActive && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 bg-[#25201A] hover:bg-[#322A22] text-[#8A8279] hover:text-[#FFFFFF] px-3 py-2 rounded-xl text-xs border border-[#2E2A25] transition"
              title="Stop Narration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* Speed Modulation Selector (0.75x - 1.5x) */}
        <div className="flex items-center gap-1 text-xs text-[#8A8279]">
          <span className="text-[11px] font-mono mr-1">Speed:</span>
          {SPEED_OPTIONS.map((rate) => (
            <button
              key={rate}
              onClick={() => onRateChange(rate)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                playbackRate === rate
                  ? 'bg-[#C69214]/25 text-[#D4A856] font-bold border border-[#C69214]/50'
                  : 'hover:text-[#FFFFFF]'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Script Text Box */}
      <div className="text-xs text-[#8A8279] italic bg-[#12100E] p-3 rounded-xl border border-[#2E2A25]/60 max-h-24 overflow-y-auto leading-relaxed">
        "{currentAudio.narrationText}"
      </div>
    </div>
  );
};
