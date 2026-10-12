import React from 'react';
import { BookOpen, Globe, X, MapPin } from 'lucide-react';
import { SpeechLanguage } from '../../lib/speech';

export interface HeaderProps {
  monumentCount: number;
  selectedLanguage: SpeechLanguage;
  onLanguageChange: (lang: SpeechLanguage) => void;
  onOpenCircuits: () => void;
  activeCircuitName: string | null;
  onClearCircuit: () => void;
  userCoordsText: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  monumentCount,
  selectedLanguage,
  onLanguageChange,
  onOpenCircuits,
  activeCircuitName,
  onClearCircuit,
  userCoordsText,
}) => {
  return (
    <header className="absolute top-3 right-3 sm:right-4 z-[900] pointer-events-none flex items-center gap-2">
      {/* Active Circuit Indicator Pill */}
      {activeCircuitName && (
        <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-white border border-blue-300 px-3 py-1.5 rounded-full shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs text-blue-900 font-medium">Circuit: {activeCircuitName}</span>
          <button
            onClick={onClearCircuit}
            className="text-xs text-gray-500 hover:text-gray-900 ml-1 p-0.5 rounded-full hover:bg-gray-100 transition"
            title="Exit Circuit"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* GPS Telemetry Readout */}
      {userCoordsText && (
        <div className="pointer-events-auto hidden lg:flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-600 shadow-md">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{userCoordsText}</span>
        </div>
      )}

      {/* Curated Circuits Button */}
      <button
        onClick={onOpenCircuits}
        className={`pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition shadow-md border ${
          activeCircuitName
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
        }`}
      >
        <BookOpen className={`w-4 h-4 ${activeCircuitName ? 'text-white' : 'text-blue-600'}`} />
        <span className="hidden sm:inline">Circuits</span>
      </button>

      {/* Language Selector Dropdown (Clean White Google Style) */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg shadow-md">
        <Globe className="w-4 h-4 text-gray-500" />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as SpeechLanguage)}
          className="bg-transparent text-xs text-gray-800 font-medium border-0 focus:outline-none cursor-pointer pr-1"
          aria-label="Select audio guide language"
        >
          <option value="en">English (EN)</option>
          <option value="hi">हिन्दी (HI)</option>
          <option value="ta">தமிழ் (TA)</option>
          <option value="te">తెలుగు (TE)</option>
          <option value="bn">বাংলা (BN)</option>
        </select>
      </div>

      {/* Google User Avatar Icon (Matching User's Safari Screen in Image 1) */}
      <div 
        className="pointer-events-auto w-9 h-9 rounded-full bg-purple-700 text-white font-semibold text-sm flex items-center justify-center shadow-md cursor-pointer hover:ring-2 hover:ring-purple-300 transition"
        title="Herodotus Guide Profile"
      >
        K
      </div>
    </header>
  );
};
