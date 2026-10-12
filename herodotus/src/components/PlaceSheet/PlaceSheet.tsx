import React, { useState } from 'react';
import {
  X, Navigation, Volume2, Bookmark, Share2, Ticket,
  Clock, MapPin, Globe, Sparkles, Star, ChevronLeft,
  Play, Pause, RotateCcw, ExternalLink, Calendar, CheckCircle2, Copy, Check
} from 'lucide-react';
import { Monument } from '../../types/monument';
import { PlaybackState, SpeechLanguage } from '../../lib/speech';

export interface PlaceSheetProps {
  monument: Monument | null;
  isOpen: boolean;
  onClose: () => void;
  playbackState: PlaybackState;
  onPlayNarration: () => void;
  onPauseNarration: () => void;
  onResumeNarration: () => void;
  onStopNarration: () => void;
  selectedLanguage: SpeechLanguage;
  onSelectLanguage: (lang: SpeechLanguage) => void;
  playbackRate: number;
  onSelectRate: (rate: number) => void;
  distanceKm?: number;
}

export const PlaceSheet: React.FC<PlaceSheetProps> = ({
  monument,
  isOpen,
  onClose,
  playbackState,
  onPlayNarration,
  onPauseNarration,
  onResumeNarration,
  onStopNarration,
  selectedLanguage,
  onSelectLanguage,
  playbackRate,
  onSelectRate,
  distanceKm,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audio' | 'history' | 'tariffs'>('overview');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  if (!isOpen || !monument) return null;

  const currentAudio = monument.audioNarrations[selectedLanguage] || monument.audioNarrations.en;
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${monument.coordinates.lat},${monument.coordinates.lng}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${monument.name} — Herodotus Guide`,
        text: monument.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${monument.coordinates.lat}, ${monument.coordinates.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <aside
      className="absolute top-0 left-0 bottom-0 z-[950] w-full sm:w-[416px] bg-white shadow-2xl flex flex-col overflow-hidden border-r border-gray-200 animate-in slide-in-from-left duration-250"
      aria-label="Monument details"
    >
      {/* Top Banner Image with Floating Controls */}
      <div className="relative h-56 sm:h-64 w-full bg-gray-100 shrink-0">
        <img
          src={monument.heroImage}
          alt={monument.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/hero_monument_1789383083590.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Back / Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition active:scale-95"
          title="Back to Map"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Top-Right Action Tools */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition active:scale-95 ${
              isSaved ? 'bg-blue-600 text-white' : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            title="Save monument"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition active:scale-95"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Badges on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 flex-wrap text-white">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium tracking-wide">
            {monument.category}
          </span>
          {monument.unesco && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3" /> UNESCO World Heritage
            </span>
          )}
          {distanceKm !== undefined && (
            <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[11px] font-mono">
              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`} away
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Rating Section (Google Maps style) */}
      <div className="p-4 sm:p-5 border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {monument.name}
        </h1>
        <div className="text-sm font-medium text-gray-600 mt-0.5">
          {monument.hindiName}
        </div>

        {/* Rating and Category */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
          <div className="flex items-center text-amber-500 font-bold">
            <span>4.8</span>
            <Star className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <span className="text-gray-400">·</span>
          <span>(12,450+ visitors)</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-700 font-medium">{monument.dynasty} ({monument.era})</span>
        </div>

        {/* Quick Action Circle Buttons (Directions, Audio, Tickets, etc.) */}
        <div className="flex items-center justify-around pt-4 mt-3 border-t border-gray-100">
          {/* Directions */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition active:scale-95">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] font-medium text-blue-600">Directions</span>
          </a>

          {/* Audio Guide */}
          <button
            onClick={() => {
              if (isPlaying) {
                onPauseNarration();
              } else if (isPaused) {
                onResumeNarration();
              } else {
                onPlayNarration();
              }
            }}
            className="flex flex-col items-center gap-1 text-center group"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 text-white'
                : 'bg-white hover:bg-gray-50 text-blue-600 border border-blue-200'
            }`}>
              <Volume2 className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-medium ${isPlaying ? 'text-amber-600 font-bold' : 'text-blue-600'}`}>
              {isPlaying ? 'Pause Guide' : 'Audio Guide'}
            </span>
          </button>

          {/* Book ASI Tickets */}
          <a
            href={monument.eTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-md transition active:scale-95">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-blue-600">Tickets</span>
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 flex items-center justify-center shadow-md transition active:scale-95">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-gray-600">Share</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation (Overview, Audio Guide, History, Logistics) */}
      <div className="flex border-b border-gray-200 px-4 shrink-0 bg-white">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'audio'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>Audio Guide</span>
          {isPlaying && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          History & Highlights
        </button>
        <button
          onClick={() => setActiveTab('tariffs')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'tariffs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Timings & Fees
        </button>
      </div>

      {/* Scrollable Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {monument.shortDescription}
            </p>

            {/* Practical Info List */}
            <div className="space-y-3 pt-2 text-sm">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-gray-800">{monument.city}, {monument.district}, {monument.state}</div>
                  <div className="text-xs text-gray-500">ASI Circle: {monument.asiCircle}</div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-600 text-xs">Open today</span>
                    <span className="text-gray-800 text-xs">{monument.timings.open} – {monument.timings.close}</span>
                  </div>
                  {monument.timings.closedDays && (
                    <div className="text-xs text-rose-500">Closed: {monument.timings.closedDays.join(', ')}</div>
                  )}
                  <div className="text-xs text-gray-500">{monument.timings.bestTimeToVisit}</div>
                </div>
              </div>

              {/* Tariffs */}
              <div className="flex items-start gap-3">
                <Ticket className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-gray-800 font-medium">
                    ₹{monument.tariffs.indianRupees} (Domestic) · ₹{monument.tariffs.foreignRupees} (Foreign)
                  </div>
                  <div className="text-xs text-emerald-600">Entry free for children under 15 years</div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span>GPS: {monument.coordinates.lat.toFixed(4)}° N, {monument.coordinates.lng.toFixed(4)}° E</span>
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Audio Guide Teaser */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-900">Audio Guide Available</div>
                  <div className="text-[11px] text-blue-700">Listen in {selectedLanguage.toUpperCase()} ({currentAudio.durationSeconds}s)</div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('audio')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow transition"
              >
                Listen
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIO GUIDE */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
              {/* Language Selector Pills */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Select Narration Language</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(
                    [
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'हिन्दी' },
                      { code: 'ta', label: 'தமிழ்' },
                      { code: 'te', label: 'తెలుగు' },
                      { code: 'bn', label: 'বাংলা' },
                    ] as { code: SpeechLanguage; label: string }[]
                  ).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onSelectLanguage(l.code);
                        if (isPlaying) onStopNarration();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition text-center ${
                        selectedLanguage === l.code
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Soundwave Visualizer */}
              <div className="h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-1.5 px-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-blue-600 gmaps-soundwave-bar'
                        : 'bg-gray-300 h-2'
                    }`}
                    style={{ animationDelay: `${(i % 8) * 0.12}s` }}
                  />
                ))}
              </div>

              {/* Playback Controls Row */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {!isPlaying && !isPaused && (
                    <button
                      onClick={onPlayNarration}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-xs shadow transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Narration</span>
                    </button>
                  )}

                  {isPlaying && (
                    <button
                      onClick={onPauseNarration}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-xl text-xs shadow transition active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </button>
                  )}

                  {isPaused && (
                    <button
                      onClick={onResumeNarration}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-xs shadow transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume</span>
                    </button>
                  )}

                  {(isPlaying || isPaused) && (
                    <button
                      onClick={onStopNarration}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs border border-gray-200 transition"
                      title="Stop audio"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="hidden sm:inline">Speed:</span>
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => onSelectRate(rate)}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                        playbackRate === rate
                          ? 'bg-blue-100 text-blue-700 font-bold border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Narration Script Text */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 italic leading-relaxed max-h-48 overflow-y-auto">
                "{currentAudio.narrationText}"
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY & HIGHLIGHTS */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            {/* Full Narrative */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Historical Narrative</h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {monument.fullNarrative}
              </p>
            </div>

            {/* Architectural Highlights */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Architectural Highlights</h3>
              <div className="space-y-2">
                {monument.architecturalHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {monument.timeline.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Historical Milestones</h3>
                <div className="space-y-2 border-l-2 border-blue-200 ml-2 pl-3">
                  {monument.timeline.map((item, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-600" />
                      <div className="text-[11px] font-bold text-blue-600">{item.year}</div>
                      <div className="text-xs text-gray-600">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIMINGS & TARIFFS */}
        {activeTab === 'tariffs' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-blue-600" /> Official Tariff Structure
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Indian Nationals</span>
                  <span className="text-base font-bold text-gray-900">₹{monument.tariffs.indianRupees}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Foreign Nationals</span>
                  <span className="text-base font-bold text-gray-900">₹{monument.tariffs.foreignRupees}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">SAARC / BIMSTEC</span>
                  <span className="text-base font-bold text-gray-900">₹{monument.tariffs.saarcRupees}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Children (&lt;15 yrs)</span>
                  <span className="text-base font-bold text-emerald-600">FREE</span>
                </div>
              </div>
            </div>

            <a
              href={monument.eTicketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-md transition"
            >
              <span>Book Official ASI E-Ticket Online</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>
    </aside>
  );
};
