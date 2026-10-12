import React from 'react';
import { Clock, Ticket, ChevronRight, X, Sparkles, Navigation, Volume2 } from 'lucide-react';
import { Monument } from '../../types/monument';
import { SpeechLanguage, PlaybackState } from '../../lib/speech';
import { formatDistance } from '../../lib/haversine';

export interface PreviewCardProps {
  monument: Monument;
  onClose: () => void;
  onOpenDetails: () => void;
  playbackState: PlaybackState;
  onToggleAudio: () => void;
  selectedLanguage: SpeechLanguage;
  distanceKm?: number;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  monument,
  onClose,
  onOpenDetails,
  playbackState,
  onToggleAudio,
  selectedLanguage,
  distanceKm,
}) => {
  const isPlaying = playbackState === 'playing';

  return (
    <div
      className="absolute bottom-5 left-3 right-3 sm:left-6 sm:right-auto sm:w-[440px] z-[950] pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="region"
      aria-label={`Preview card for ${monument.name}`}
    >
      <div className="bg-[#1A1714]/95 backdrop-blur-xl border border-[#2E2A25] hover:border-[#C69214]/50 rounded-2xl shadow-2xl overflow-hidden transition">
        {/* Top Image Banner with Badges */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#12100E]">
          <img
            src={monument.heroImage}
            alt={monument.name}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            onError={(e) => {
              // Fallback to local hero image if external URL is blocked or offline
              (e.target as HTMLImageElement).src = '/images/hero_monument_1789383083590.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#0D0B09]/80 text-[#E8E0D4] hover:text-[#FFFFFF] flex items-center justify-center border border-[#2E2A25] transition"
            title="Dismiss preview"
            aria-label="Close preview card"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on Top-Left */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-[#0D0B09]/85 border border-[#C69214]/50 text-[#D4A856] text-[10px] font-semibold tracking-wider uppercase">
              {monument.category}
            </span>
            {monument.unesco && (
              <span className="px-2 py-0.5 rounded-md bg-[#C69214] text-[#0D0B09] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" /> UNESCO
              </span>
            )}
            {distanceKm !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-[#1E293B]/85 text-[#94A3B8] text-[10px] font-mono flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 text-[#38BDF8]" />
                {formatDistance(distanceKm)}
              </span>
            )}
          </div>

          {/* Title & Location Overlay */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFFFF] leading-tight drop-shadow-md">
              {monument.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#D4A856]">
              <span>{monument.hindiName}</span>
              <span>·</span>
              <span className="text-[#8A8279]">{monument.city}, {monument.state}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 space-y-3">
          {/* Hook summary */}
          <p className="text-xs text-[#C5BDB2] line-clamp-2 leading-relaxed">
            {monument.shortDescription}
          </p>

          {/* Logistics Quick Stats Row */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#2E2A25]/60">
            <div className="flex items-center gap-2 text-[#8A8279]">
              <Clock className="w-3.5 h-3.5 text-[#C69214] shrink-0" />
              <span className="truncate">{monument.timings.open} – {monument.timings.close}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8A8279]">
              <Ticket className="w-3.5 h-3.5 text-[#C69214] shrink-0" />
              <span className="truncate">
                ₹{monument.tariffs.indianRupees} <span className="text-[10px]">(Ind)</span> / ₹{monument.tariffs.foreignRupees} <span className="text-[10px]">(Int)</span>
              </span>
            </div>
          </div>

          {/* Action Row: Listen / Pause & Explore */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onToggleAudio}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
                isPlaying
                  ? 'bg-[#C69214] text-[#0D0B09] shadow-lg shadow-[#C69214]/30'
                  : 'bg-[#25201A] hover:bg-[#322A22] text-[#D4A856] border border-[#C69214]/40'
              }`}
            >
              {isPlaying ? (
                <>
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 bg-[#0D0B09] soundwave-bar" />
                    <span className="w-0.5 bg-[#0D0B09] soundwave-bar" />
                    <span className="w-0.5 bg-[#0D0B09] soundwave-bar" />
                  </div>
                  <span>Pause Narration ({selectedLanguage.toUpperCase()})</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Guide ({selectedLanguage.toUpperCase()})</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenDetails}
              className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#0D0B09] hover:bg-[#1E1B18] text-[#FFFFFF] text-xs font-medium border border-[#2E2A25] transition"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C69214]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
