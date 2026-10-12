import React from 'react';
import { PlaybackState } from '../../lib/speech';

export interface WaveformVisualizerProps {
  playbackState: PlaybackState;
  barCount?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  playbackState,
  barCount = 16,
  className = '',
}) => {
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';

  // Staggered parameters for realistic organic acoustic oscillation
  const barConfigs = [
    { duration: '0.8s', delay: '0.05s', min: '20%', max: '85%' },
    { duration: '1.1s', delay: '0.15s', min: '15%', max: '95%' },
    { duration: '0.7s', delay: '0.30s', min: '25%', max: '75%' },
    { duration: '1.3s', delay: '0.10s', min: '10%', max: '100%' },
    { duration: '0.9s', delay: '0.25s', min: '30%', max: '90%' },
    { duration: '1.2s', delay: '0.40s', min: '15%', max: '80%' },
    { duration: '0.8s', delay: '0.20s', min: '25%', max: '95%' },
    { duration: '1.0s', delay: '0.05s', min: '20%', max: '70%' },
    { duration: '1.1s', delay: '0.35s', min: '15%', max: '90%' },
    { duration: '0.7s', delay: '0.10s', min: '25%', max: '85%' },
    { duration: '1.2s', delay: '0.25s', min: '10%', max: '100%' },
    { duration: '0.9s', delay: '0.15s', min: '30%', max: '80%' },
    { duration: '1.0s', delay: '0.45s', min: '20%', max: '75%' },
    { duration: '0.8s', delay: '0.30s', min: '15%', max: '95%' },
    { duration: '1.3s', delay: '0.20s', min: '25%', max: '85%' },
    { duration: '0.9s', delay: '0.05s', min: '15%', max: '70%' },
  ];

  return (
    <div
      className={`h-11 bg-[#12100E] border border-[#2E2A25] rounded-xl flex items-center justify-center gap-1.5 px-4 overflow-hidden ${className}`}
      aria-label="Audio Waveform Display"
    >
      {barConfigs.slice(0, barCount).map((cfg, idx) => (
        <span
          key={idx}
          className={`w-1 rounded-full transition-all duration-300 origin-center ${
            isPlaying
              ? 'bg-[#C69214] shadow-sm shadow-[#C69214]/50'
              : isPaused
              ? 'bg-[#8A8279] h-2.5 opacity-60'
              : 'bg-[#2E2A25] h-1.5 opacity-40'
          }`}
          style={
            isPlaying
              ? {
                  animation: `waveformOscillate ${cfg.duration} infinite ease-in-out alternate`,
                  animationDelay: cfg.delay,
                  height: '100%',
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};
