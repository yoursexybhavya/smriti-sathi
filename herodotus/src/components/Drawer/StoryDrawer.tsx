import React from 'react';
import {
  X,
  Clock,
  Ticket,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { Monument } from '../../types/monument';
import { SpeechLanguage, PlaybackState } from '../../lib/speech';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

export interface StoryDrawerProps {
  monument: Monument;
  isOpen: boolean;
  onClose: () => void;
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  playbackRate: number;
  onRateChange: (rate: number) => void;
  selectedLanguage: SpeechLanguage;
  onLanguageChange: (lang: SpeechLanguage) => void;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  monument,
  isOpen,
  onClose,
  playbackState,
  onPlay,
  onPause,
  onResume,
  onStop,
  playbackRate,
  onRateChange,
  selectedLanguage,
  onLanguageChange,
}) => {
  if (!isOpen) return null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `${monument.name} — Herodotus Audio Guide`,
          text: monument.shortDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${monument.coordinates.lat},${monument.coordinates.lng}`;

  // Check if today is a closed day
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isClosedToday = monument.timings.closedDays?.includes(todayDayName);

  return (
    <div
      className="fixed inset-0 z-[1100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-drawer-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#000000]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Panel: Full height on mobile & desktop */}
      <div
        className="relative w-full max-w-2xl h-full bg-[#12100E] border-l border-[#2E2A25] shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#2E2A25] bg-[#12100E]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C69214] uppercase">
              ASI MONUMENT RECORD · {monument.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#1A1714] text-[#8A8279] hover:text-[#FFFFFF] border border-[#2E2A25] transition"
              title="Share Monument"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1A1714] text-[#8A8279] hover:text-[#FFFFFF] border border-[#2E2A25] transition"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6">
          {/* Hero Image with Gradient Overlay */}
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#1A1714] border border-[#2E2A25]">
            <img
              src={monument.heroImage}
              alt={monument.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_monument_1789383083590.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />

            {/* Badges on Hero */}
            <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-[#0D0B09]/90 border border-[#C69214]/50 text-[#D4A856] text-xs font-semibold uppercase tracking-wider">
                {monument.category}
              </span>
              {monument.unesco && (
                <span className="px-2.5 py-1 rounded-md bg-[#C69214] text-[#0D0B09] text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" /> UNESCO World Heritage
                </span>
              )}
            </div>

            {/* Title & Metadata Over Image */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <h1
                id="story-drawer-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFFFF] leading-tight"
              >
                {monument.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#D4A856] flex-wrap">
                <span className="font-medium">{monument.hindiName}</span>
                <span>·</span>
                <span className="text-[#8A8279]">
                  {monument.dynasty} ({monument.era})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stat Metric Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-[#1A1714] border border-[#2E2A25] p-2.5 rounded-xl">
              <span className="text-[#8A8279] block text-[10px] uppercase">Founded</span>
              <span className="text-[#E8E0D4] font-semibold">
                {monument.foundedYear > 0
                  ? `${monument.foundedYear} CE`
                  : `${Math.abs(monument.foundedYear)} BCE`}
              </span>
            </div>
            <div className="bg-[#1A1714] border border-[#2E2A25] p-2.5 rounded-xl">
              <span className="text-[#8A8279] block text-[10px] uppercase">Location</span>
              <span className="text-[#E8E0D4] font-semibold truncate block">
                {monument.city}, {monument.state}
              </span>
            </div>
            <div className="bg-[#1A1714] border border-[#2E2A25] p-2.5 rounded-xl">
              <span className="text-[#8A8279] block text-[10px] uppercase">ASI Circle</span>
              <span className="text-[#E8E0D4] font-semibold truncate block">
                {monument.asiCircle}
              </span>
            </div>
            <div className="bg-[#1A1714] border border-[#2E2A25] p-2.5 rounded-xl">
              <span className="text-[#8A8279] block text-[10px] uppercase">Tariff (Ind/Int)</span>
              <span className="text-[#C69214] font-semibold">
                ₹{monument.tariffs.indianRupees} / ₹{monument.tariffs.foreignRupees}
              </span>
            </div>
          </div>

          {/* Audio Narration Engine Section */}
          <AudioPlayer
            monument={monument}
            playbackState={playbackState}
            selectedLanguage={selectedLanguage}
            playbackRate={playbackRate}
            onPlay={onPlay}
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
            onRateChange={onRateChange}
            onLanguageChange={onLanguageChange}
          />

          {/* Full Historical Narrative (300-500 words) */}
          <div className="space-y-2.5">
            <h3 className="font-serif text-lg font-bold text-[#FFFFFF] tracking-wide">
              Living Stone Narrative
            </h3>
            <p className="text-sm text-[#C5BDB2] leading-relaxed whitespace-pre-line">
              {monument.fullNarrative}
            </p>
          </div>

          {/* Architectural Highlights */}
          {monument.architecturalHighlights.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#FFFFFF] tracking-wide">
                Architectural Highlights
              </h3>
              <div className="space-y-2">
                {monument.architecturalHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-[#1A1714] p-3 rounded-xl border border-[#2E2A25]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C69214] mt-2 shrink-0" />
                    <span className="text-xs text-[#E8E0D4] leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Timeline Milestones */}
          {monument.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#FFFFFF] tracking-wide">
                Historical Timeline
              </h3>
              <div className="space-y-3 border-l-2 border-[#2E2A25] ml-2 pl-4 py-1">
                {monument.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C69214] ring-4 ring-[#12100E]" />
                    <div className="text-[11px] font-mono text-[#C69214] font-bold">
                      {item.year}
                    </div>
                    <div className="text-xs text-[#E8E0D4] leading-relaxed">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visitor Logistics & Tariffs */}
          <div className="bg-[#1A1714] border border-[#2E2A25] rounded-2xl p-4 sm:p-5 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#FFFFFF]">Visitor Logistics</h3>

            {/* Closed Day Warning if today is closed */}
            {isClosedToday && (
              <div className="flex items-center gap-2 bg-[#7F1D1D]/30 border border-[#EF4444]/40 p-3 rounded-xl text-xs text-[#FCA5A5]">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <span>
                  <strong>Closed Today ({todayDayName}):</strong> This monument is closed for
                  weekly maintenance.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#8A8279] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C69214]" /> Opening Hours
                </span>
                <p className="text-[#E8E0D4]">
                  {monument.timings.open} — {monument.timings.close}
                </p>
                {monument.timings.closedDays && monument.timings.closedDays.length > 0 && (
                  <p className="text-[11px] text-[#D4A856]">
                    Closed: {monument.timings.closedDays.join(', ')}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[#8A8279] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C69214]" /> Best Time to Visit
                </span>
                <p className="text-[#E8E0D4]">{monument.timings.bestTimeToVisit}</p>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#2E2A25]/60">
                <span className="text-[#8A8279] flex items-center gap-1.5 font-medium">
                  <Ticket className="w-3.5 h-3.5 text-[#C69214]" /> Official Tariffs & Entry Rules
                </span>
                <div className="flex items-center gap-3 text-[#E8E0D4] flex-wrap pt-1">
                  <span>Indian Nationals: <strong>₹{monument.tariffs.indianRupees}</strong></span>
                  <span>SAARC / BIMSTEC: <strong>₹{monument.tariffs.saarcRupees}</strong></span>
                  <span>Foreign Tourists: <strong>₹{monument.tariffs.foreignRupees}</strong></span>
                </div>
                {monument.tariffs.entryFreeUnder15 && (
                  <p className="text-[11px] text-[#10B981] font-medium pt-1">
                    ✔ Statutory ASI Exemption: Free entry for children under 15 years
                  </p>
                )}
              </div>
            </div>

            {/* Direct ASI Booking & Navigation CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href={monument.eTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#C69214] hover:bg-[#D4A856] text-[#0D0B09] font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg transition"
              >
                <span>Book Official ASI Ticket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25201A] hover:bg-[#322A22] text-[#D4A856] border border-[#C69214]/30 py-2.5 px-4 rounded-xl text-xs font-semibold transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
