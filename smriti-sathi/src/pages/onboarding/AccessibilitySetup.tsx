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
      settings.highContrast ? 'bg-[#000000] text-white' : 'bg-[#F5F0E8] text-[#1A1A1A]'
    }`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors ${
        settings.highContrast ? 'bg-[#111111] border-[#333333]' : 'bg-white border-[#E0D8CC]'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                settings.highContrast
                  ? 'bg-[#222222] hover:bg-[#333333] text-white border border-[#444444]'
                  : 'bg-[#F5F0E8] hover:bg-[#E0D8CC] text-[#1A1A1A]'
              }`}
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Accessibility & Display</h1>
              <p className={`text-sm ${settings.highContrast ? 'text-yellow-400' : 'text-[#7A7A7A]'}`}>
                Step 3 of 4: Tailor to your comfort
              </p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#E8F5E9] text-[#1B5E20]'
          }`}>
            {settings.highContrast ? 'High Contrast Mode' : 'Standard Warm Theme'}
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
                icon={<Type size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'} />}
              />
              <div className={`rounded-2xl border p-4 space-y-3 ${
                settings.highContrast ? 'bg-[#111111] border-[#333333]' : 'bg-white border-[#E0D8CC]'
              }`}>
                {/* Normal */}
                <button
                  onClick={() => updateTextSize('normal')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[64px] flex items-center justify-between ${
                    settings.textSize === 'normal'
                      ? settings.highContrast
                        ? 'bg-[#1F2937] border-yellow-400 text-white'
                        : 'bg-[#E8F5E9] border-[#1B5E20] text-[#1A1A1A]'
                      : settings.highContrast
                        ? 'bg-[#18181B] border-[#3F3F46] text-gray-300 hover:border-gray-400'
                        : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#1A1A1A] hover:border-[#C0B8A8]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">Normal Size (18px)</span>
                      {settings.textSize === 'normal' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#1B5E20] text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-base mt-1 text-[#555555] dark:text-gray-300">
                      Standard text size for easy everyday reading.
                    </p>
                  </div>
                  {settings.textSize === 'normal' && (
                    <Check size={24} className={settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'} />
                  )}
                </button>

                {/* Large */}
                <button
                  onClick={() => updateTextSize('large')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[72px] flex items-center justify-between ${
                    settings.textSize === 'large'
                      ? settings.highContrast
                        ? 'bg-[#1F2937] border-yellow-400 text-white'
                        : 'bg-[#E8F5E9] border-[#1B5E20] text-[#1A1A1A]'
                      : settings.highContrast
                        ? 'bg-[#18181B] border-[#3F3F46] text-gray-300 hover:border-gray-400'
                        : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#1A1A1A] hover:border-[#C0B8A8]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">Large Size (24px)</span>
                      <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">Recommended</span>
                      {settings.textSize === 'large' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#1B5E20] text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-lg mt-1 font-medium text-[#444444] dark:text-gray-200">
                      Bigger words for comfortable, strain-free reading.
                    </p>
                  </div>
                  {settings.textSize === 'large' && (
                    <Check size={26} className={settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'} />
                  )}
                </button>

                {/* Extra Large */}
                <button
                  onClick={() => updateTextSize('extra-large')}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all min-h-[84px] flex items-center justify-between ${
                    settings.textSize === 'extra-large'
                      ? settings.highContrast
                        ? 'bg-[#1F2937] border-yellow-400 text-white'
                        : 'bg-[#E8F5E9] border-[#1B5E20] text-[#1A1A1A]'
                      : settings.highContrast
                        ? 'bg-[#18181B] border-[#3F3F46] text-gray-300 hover:border-gray-400'
                        : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#1A1A1A] hover:border-[#C0B8A8]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold">Extra Large (30px)</span>
                      {settings.textSize === 'extra-large' && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#1B5E20] text-white'
                        }`}>Selected</span>
                      )}
                    </div>
                    <p className="text-xl mt-1 font-bold text-[#333333] dark:text-white">
                      Maximum size for elders with visual difficulties.
                    </p>
                  </div>
                  {settings.textSize === 'extra-large' && (
                    <Check size={30} className={settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'} />
                  )}
                </button>
              </div>
            </div>

            {/* 2. High Contrast Mode Toggle */}
            <div className="space-y-3">
              <SectionHeader
                title="2. High Contrast Mode"
                icon={<Eye size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-[#E65100]'} />}
              />
              <div className={`rounded-2xl border p-5 ${
                settings.highContrast ? 'bg-[#111111] border-yellow-400' : 'bg-white border-[#E0D8CC]'
              }`}>
                <button
                  onClick={toggleHighContrast}
                  className="w-full flex items-center justify-between min-h-[60px] text-left"
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
                    <p className={`text-base mt-1 ${settings.highContrast ? 'text-gray-300' : 'text-[#666666]'}`}>
                      Deep black background, stark borders, and bold yellow accents designed for maximum visibility.
                    </p>
                  </div>

                  <div className={`w-16 h-9 rounded-full relative transition-colors flex-shrink-0 ${
                    settings.highContrast ? 'bg-yellow-400' : 'bg-[#C0B8A8]'
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
                icon={<Volume2 size={22} className={settings.highContrast ? 'text-yellow-400' : 'text-[#1565C0]'} />}
              />
              <div className={`rounded-2xl border p-5 space-y-3 ${
                settings.highContrast ? 'bg-[#111111] border-[#333333]' : 'bg-white border-[#E0D8CC]'
              }`}>
                <button
                  onClick={toggleVoiceGuidance}
                  className="w-full flex items-center justify-between min-h-[56px] text-left"
                >
                  <div className="pr-4">
                    <span className="text-lg font-bold">Enable Voice Instructions</span>
                    <p className={`text-base mt-1 ${settings.highContrast ? 'text-gray-300' : 'text-[#666666]'}`}>
                      Reads questions, medicine reminders, and instructions aloud.
                    </p>
                  </div>
                  <div className={`w-16 h-9 rounded-full relative transition-colors flex-shrink-0 ${
                    settings.voiceGuidance
                      ? (settings.highContrast ? 'bg-yellow-400' : 'bg-[#1B5E20]')
                      : 'bg-[#C0B8A8]'
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
                    className={`mt-2 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-colors ${
                      settings.highContrast
                        ? 'bg-[#222222] text-yellow-400 border border-yellow-400 hover:bg-[#333333]'
                        : 'bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB]'
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
                  settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'
                }`}>
                  <Sparkles size={16} />
                  Live Preview / লাইভ পূৰ্বদৰ্শন
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium">
                  {settings.textSize.toUpperCase()} • {settings.highContrast ? 'HIGH CONTRAST' : 'STANDARD'}
                </span>
              </div>

              {/* Dynamic Mockup Screen Box */}
              <div className={`rounded-3xl p-6 transition-all duration-300 shadow-xl ${
                settings.highContrast
                  ? 'bg-[#0A0A0A] border-4 border-yellow-400 text-white'
                  : 'bg-white border-2 border-[#1B5E20]/30 text-[#1A1A1A]'
              }`}>
                {/* Mock Card Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-4 border-current opacity-70">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Smriti Sathi Preview
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#E8F5E9] text-[#1B5E20]'
                  }`}>
                    {settings.highContrast ? 'WCAG AAA (14:1)' : 'WCAG AA'}
                  </span>
                </div>

                {/* Mock Title */}
                <h3 className={`${headingStyles[settings.textSize]} mb-2 leading-tight ${
                  settings.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'
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
                    ? 'bg-[#18181B] border-2 border-yellow-400/80'
                    : 'bg-[#FDF8F0] border border-[#E0D8CC]'
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
                  className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md ${
                    settings.highContrast
                      ? 'bg-yellow-400 text-black text-xl hover:bg-yellow-300 border-2 border-white'
                      : 'bg-[#1B5E20] text-white text-lg hover:bg-[#144718]'
                  }`}
                >
                  <Check size={22} />
                  <span>I Took My Medicine</span>
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <LargeButton
                onPress={handleNext}
                className={settings.highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-[#1B5E20] text-white'}
              >
                Continue to Next Step →
              </LargeButton>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

