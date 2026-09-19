import { useState, useEffect } from 'react';
import { ChevronLeft, Type, Eye, Volume2, Check, Sparkles } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';
import { AccessibilitySettings } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';

interface AccessibilitySetupProps {
  initialSettings: AccessibilitySettings;
  onSave: (settings: AccessibilitySettings) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AccessibilitySetup({
  initialSettings,
  onSave,
  onNext,
  onBack,
}: AccessibilitySetupProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(initialSettings);
  const { speak } = useVoice();
  const [speaking, setSpeaking] = useState(false);

  // Sync document body with selected settings for real-time visual feedback
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large');
    document.body.classList.add(`text-size-${settings.textSize}`);

    return () => {
      // Ensure clean state if navigated away
      if (!settings.highContrast) {
        document.body.classList.remove('high-contrast');
      }
    };
  }, [settings.highContrast, settings.textSize]);

  const updateTextSize = (size: AccessibilitySettings['textSize']) => {
    setSettings(prev => ({ ...prev, textSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleVoiceGuidance = () => {
    setSettings(prev => ({ ...prev, voiceGuidance: !prev.voiceGuidance }));
  };

  const handleTestVoice = () => {
    setSpeaking(true);
    speak('Welcome to Smriti Sathi. This is how voice guidance will speak to you.');
    setTimeout(() => setSpeaking(false), 3000);
  };

  const handleNext = () => {
    onSave(settings);
    onNext();
  };

  // Font size scale definitions for the preview
  const headingStyles = {
    normal: 'text-xl font-bold',
    large: 'text-2xl font-bold',
    'extra-large': 'text-3xl font-extrabold',
  };

  const bodyStyles = {
    normal: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl font-medium',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      settings.highContrast ? 'bg-black text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100'
    }`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors ${
        settings.highContrast ? 'bg-zinc-900 border-zinc-800' : 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-slate-200 dark:border-slate-700'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                settings.highContrast
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
              }`}
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Accessibility & Display</h1>
              <p className={`text-sm ${settings.highContrast ? 'text-yellow-400' : 'text-slate-500 dark:text-slate-400'}`}>
                Step 3 of 4: Tailor to your comfort
              </p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            settings.highContrast 
              ? 'bg-yellow-400 text-black' 
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
          }`}>
            {settings.highContrast ? 'High Contrast Mode' : 'Standard Scandinavian Theme'}
          </span>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="max-w-6xl mx-auto px-5 py-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Accessibility Controls */}
          <div className="md:col-span-7 space-y-6">
            
            {/* 1. Text Size Selector */}
            <div className="space-y-3">
              <SectionHeader
                title="1. Choose Text Size"
                icon={<Type size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />}
              />
              <div className={`rounded-2xl border p-4 space-y-3 ${
                settings.highContrast ? 'bg-zinc-900 border-zinc-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}>
                {/* Normal */}
                <button
                  type="button"
                  onClick={() => updateTextSize('normal')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[64px] flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'normal'
                      ? settings.highContrast
                        ? 'bg-zinc-800 border-yellow-400 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/20'
                      : settings.highContrast
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">Normal Size (18px)</span>
                      {settings.textSize === 'normal' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-base mt-1 text-slate-500 dark:text-slate-400">
                      Standard text size for easy everyday reading.
                    </p>
                  </div>
                  {settings.textSize === 'normal' && (
                    <Check size={24} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />
                  )}
                </button>

                {/* Large */}
                <button
                  type="button"
                  onClick={() => updateTextSize('large')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[72px] flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'large'
                      ? settings.highContrast
                        ? 'bg-zinc-800 border-yellow-400 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/20'
                      : settings.highContrast
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">Large Size (24px)</span>
                      <span className="text-xs bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 px-2 py-0.5 rounded font-semibold">Recommended</span>
                      {settings.textSize === 'large' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-lg mt-1 font-medium text-slate-600 dark:text-slate-300">
                      Bigger words for comfortable, strain-free reading.
                    </p>
                  </div>
                  {settings.textSize === 'large' && (
                    <Check size={26} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />
                  )}
                </button>

                {/* Extra Large */}
                <button
                  type="button"
                  onClick={() => updateTextSize('extra-large')}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all min-h-[84px] flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'extra-large'
                      ? settings.highContrast
                        ? 'bg-zinc-800 border-yellow-400 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/20'
                      : settings.highContrast
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold">Extra Large (30px)</span>
                      {settings.textSize === 'extra-large' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-xl mt-1 font-bold text-slate-700 dark:text-slate-200">
                      Maximum size for elders with visual difficulties.
                    </p>
                  </div>
                  {settings.textSize === 'extra-large' && (
                    <Check size={30} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />
                  )}
                </button>
              </div>
            </div>

            {/* 2. High Contrast Mode Toggle */}
            <div className="space-y-3">
              <SectionHeader
                title="2. High Contrast Mode"
                icon={<Eye size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />}
              />
              <div className={`rounded-2xl border p-5 ${
                settings.highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}>
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className="w-full flex items-center justify-between min-h-[60px] text-left cursor-pointer"
                >
                  <div className="pr-4">
                    <span className="text-lg font-bold flex items-center gap-2">
                      Enable High Contrast
                      {settings.highContrast && (
                        <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-extrabold">
                          ACTIVE
                        </span>
                      )}
                    </span>
                    <p className={`text-base mt-1 ${settings.highContrast ? 'text-zinc-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      Deep black background, stark borders, and bold yellow accents designed for maximum visibility.
                    </p>
                  </div>

                  <div className={`w-16 h-9 rounded-full relative transition-colors flex-shrink-0 ${
                    settings.highContrast ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-600'
                  }`}>
                    <div className={`absolute top-1.5 w-6 h-6 rounded-full transition-transform ${
                      settings.highContrast
                        ? 'translate-x-8 bg-black'
                        : 'translate-x-1.5 bg-white shadow-md'
                    }`} />
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Voice Guidance Toggle */}
            <div className="space-y-3">
              <SectionHeader
                title="3. Spoken Voice Guidance"
                icon={<Volume2 size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'} />}
              />
              <div className={`rounded-2xl border p-5 space-y-3 ${
                settings.highContrast ? 'bg-zinc-900 border-zinc-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}>
                <button
                  type="button"
                  onClick={toggleVoiceGuidance}
                  className="w-full flex items-center justify-between min-h-[56px] text-left cursor-pointer"
                >
                  <div className="pr-4">
                    <span className="text-lg font-bold">Enable Voice Instructions</span>
                    <p className={`text-base mt-1 ${settings.highContrast ? 'text-zinc-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      Reads questions, medicine reminders, and instructions aloud.
                    </p>
                  </div>
                  <div className={`w-16 h-9 rounded-full relative transition-colors flex-shrink-0 ${
                    settings.voiceGuidance
                      ? (settings.highContrast ? 'bg-yellow-400' : 'bg-indigo-600')
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}>
                    <div className={`absolute top-1.5 w-6 h-6 rounded-full transition-transform ${
                      settings.voiceGuidance
                        ? (settings.highContrast ? 'translate-x-8 bg-black' : 'translate-x-8 bg-white shadow-md')
                        : 'translate-x-1.5 bg-white shadow-md'
                    }`} />
                  </div>
                </button>

                {settings.voiceGuidance && (
                  <button
                    type="button"
                    onClick={handleTestVoice}
                    disabled={speaking}
                    className={`mt-2 w-full min-h-[52px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-colors cursor-pointer ${
                      settings.highContrast
                        ? 'bg-zinc-800 text-yellow-400 border border-yellow-400 hover:bg-zinc-700'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60'
                    }`}
                  >
                    <Volume2 size={20} className={speaking ? 'animate-pulse' : ''} />
                    <span>{speaking ? 'Speaking now...' : '🔊 Test Voice Audio / মাত পৰীক্ষা কৰক'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Interactive Live Preview Box */}
          <div className="md:col-span-5 sticky top-24 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Sparkles size={16} />
                  Live Preview / লাইভ পূৰ্বদৰ্শন
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                  {settings.textSize.toUpperCase()} • {settings.highContrast ? 'HIGH CONTRAST' : 'STANDARD'}
                </span>
              </div>

              {/* Dynamic Mockup Screen Box */}
              <div className={`rounded-3xl p-6 transition-all duration-300 shadow-xl ${
                settings.highContrast
                  ? 'bg-zinc-950 border-4 border-yellow-400 text-white'
                  : 'bg-white dark:bg-slate-800 border-2 border-indigo-500/30 text-slate-900 dark:text-slate-100'
              }`}>
                {/* Mock Card Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-4 border-current opacity-70">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Smriti Sathi Preview
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                    {settings.highContrast ? 'WCAG AAA (14:1)' : 'WCAG AA'}
                  </span>
                </div>

                {/* Mock Title */}
                <h3 className={`${headingStyles[settings.textSize]} mb-2 leading-tight ${
                  settings.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                  Good Morning, Kamala Baa!
                </h3>

                {/* Mock Body */}
                <p className={`${bodyStyles[settings.textSize]} mb-5 leading-relaxed opacity-90`}>
                  This is how your text, reminders, and memory activities will appear on your tablet screen.
                </p>

                {/* Mock Action Card */}
                <div className={`p-4 rounded-2xl mb-5 transition-colors ${
                  settings.highContrast
                    ? 'bg-zinc-900 border-2 border-yellow-400/80'
                    : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700'
                }`}>
                  <p className="text-xs font-bold opacity-75 uppercase tracking-wider mb-1">
                    Morning Reminder:
                  </p>
                  <p className={`${bodyStyles[settings.textSize]} font-semibold`}>
                    💧 Drink a warm glass of water & take morning tablet
                  </p>
                </div>

                {/* Mock Interactive Button */}
                <button
                  type="button"
                  className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer ${
                    settings.highContrast
                      ? 'bg-yellow-400 text-black text-xl hover:bg-yellow-300 border-2 border-white'
                      : 'bg-indigo-600 text-white text-lg hover:bg-indigo-700'
                  }`}
                >
                  <Check size={22} />
                  <span>I Took My Medicine</span>
                </button>
              </div>
            </div>

            {/* Continue & Back Buttons */}
            <div className="pt-2 space-y-3">
              <LargeButton
                onPress={handleNext}
                className={settings.highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              >
                Continue to Next Step →
              </LargeButton>
              <button
                type="button"
                onClick={onBack}
                className={`w-full min-h-[48px] py-3 px-4 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                  settings.highContrast
                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                ← Back to Language
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

