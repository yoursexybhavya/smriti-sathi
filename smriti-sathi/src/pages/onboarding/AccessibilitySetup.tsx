import { useState, useEffect } from 'react';
import { Type, Eye, Volume2, Check, Sparkles, ChevronLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
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
    speak('নমস্কাৰ! স্মৃতি সাথীলৈ স্বাগতম। এইদৰে আপোনাক কথাৰে সহায় কৰা হ’ব।');
    setTimeout(() => setSpeaking(false), 3200);
  };

  const handleNext = () => {
    onSave(settings);
    onNext();
  };

  const headingTextClasses = {
    normal: 'text-xl font-bold',
    large: 'text-2xl font-bold',
    'extra-large': 'text-3xl font-extrabold',
  };

  const bodyTextClasses = {
    normal: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    'extra-large': 'text-lg sm:text-xl font-medium',
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between flex-1">
      <div>
        {/* Step Heading */}
        <div className="mb-6 pb-4 border-b-2 border-[var(--color-border)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Step 3 of 4
              </span>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Sight & Sound Accessibility
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
              Accessibility & Display / দৃষ্টি আৰু সুবিধা
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Customize large readable text, high-contrast visibility, and spoken audio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Text Size & Toggles */}
          <div className="md:col-span-7 space-y-5">
            {/* 1. Text Size Selector */}
            <div>
              <label className="text-sm sm:text-base font-bold text-[var(--color-text)] flex items-center gap-2 mb-2">
                <Type size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span>Text Size / আখৰৰ আকাৰ</span>
              </label>

              <div className="space-y-2">
                {/* Normal */}
                <button
                  type="button"
                  onClick={() => updateTextSize('normal')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'normal'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-400 text-[var(--color-text)] ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] hover:border-indigo-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">Standard Size (18px)</span>
                      <span className="text-xs text-[var(--color-text-muted)] font-serif">সাধাৰণ আকাৰ</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">For easy everyday reading</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                    settings.textSize === 'normal' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[var(--color-border)]'
                  }`}>
                    {settings.textSize === 'normal' && <Check size={14} className="stroke-[3]" />}
                  </div>
                </button>

                {/* Large */}
                <button
                  type="button"
                  onClick={() => updateTextSize('large')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'large'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-400 text-[var(--color-text)] ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] hover:border-indigo-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold">Large Size (24px)</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">Comfortable strain-free reading for seniors</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                    settings.textSize === 'large' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[var(--color-border)]'
                  }`}>
                    {settings.textSize === 'large' && <Check size={14} className="stroke-[3]" />}
                  </div>
                </button>

                {/* Extra Large */}
                <button
                  type="button"
                  onClick={() => updateTextSize('extra-large')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    settings.textSize === 'extra-large'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-400 text-[var(--color-text)] ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] hover:border-indigo-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold">Extra Large (30px)</span>
                      <span className="text-xs text-[var(--color-text-muted)] font-serif">অতি ডাঙৰ</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">Maximum readability for visual difficulty</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                    settings.textSize === 'extra-large' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[var(--color-border)]'
                  }`}>
                    {settings.textSize === 'extra-large' && <Check size={14} className="stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 2. High Contrast Mode Toggle */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)]">
              <button
                type="button"
                onClick={toggleHighContrast}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="pr-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-amber-500 flex-shrink-0" />
                    <span className="text-base font-bold text-[var(--color-text)]">
                      High Contrast Mode / উচ্চ বিপৰীত ৰূপ
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Stark black background, bold yellow accents & maximum WCAG AAA legibility.
                  </p>
                </div>
                <div
                  className={`w-14 h-8 rounded-full p-1 transition-colors flex-shrink-0 flex items-center ${
                    settings.highContrast
                      ? 'bg-amber-500 justify-end'
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {settings.highContrast ? <Check size={13} className="text-amber-600 stroke-[3]" /> : null}
                  </div>
                </div>
              </button>
            </div>

            {/* 3. Spoken Voice Audio Guidance */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] space-y-3">
              <button
                type="button"
                onClick={toggleVoiceGuidance}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="pr-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span className="text-base font-bold text-[var(--color-text)]">
                      Spoken Voice Prompts / কথাৰে সহায়
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Reads aloud daily reminders, instructions, and memory game cues.
                  </p>
                </div>
                <div
                  className={`w-14 h-8 rounded-full p-1 transition-colors flex-shrink-0 flex items-center ${
                    settings.voiceGuidance
                      ? 'bg-indigo-600 justify-end'
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {settings.voiceGuidance ? <Check size={13} className="text-indigo-600 stroke-[3]" /> : null}
                  </div>
                </div>
              </button>

              {settings.voiceGuidance && (
                <button
                  type="button"
                  onClick={handleTestVoice}
                  disabled={speaking}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                >
                  <Volume2 size={16} className={speaking ? 'animate-pulse text-rose-500' : ''} />
                  <span>{speaking ? 'Speaking Audio Sample...' : '🔊 Listen to Audio Sample / মাত শুনা'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live High-Contrast Screen Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Live Tablet Preview / পূৰ্বদৰ্শন</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
                {settings.textSize.toUpperCase()}
              </span>
            </div>

            {/* Simulated Tablet Screen Preview Card */}
            <div
              className={`p-5 rounded-3xl border-2 transition-all shadow-md ${
                settings.highContrast
                  ? 'bg-black border-4 border-yellow-400 text-white'
                  : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-[var(--color-border)] opacity-75">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  Smriti Sathi Tablet
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                }`}>
                  {settings.highContrast ? 'WCAG AAA' : 'High Clarity'}
                </span>
              </div>

              {/* Sample Headline - GUARANTEED HIGH CONTRAST */}
              <h3 className={`${headingTextClasses[settings.textSize]} leading-tight font-extrabold ${
                settings.highContrast ? 'text-yellow-400' : 'text-[var(--color-text)]'
              }`}>
                Good Morning, Kamala Baa!
              </h3>
              <p className="text-xs font-serif text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
                নমস্কাৰ, কমলা বা!
              </p>

              <p className={`${bodyTextClasses[settings.textSize]} text-[var(--color-text-secondary)] mb-4 leading-relaxed`}>
                This is how your medicine reminders and memory activities will look on your screen.
              </p>

              {/* Sample Reminder Widget */}
              <div className={`p-3.5 rounded-2xl mb-4 border-2 ${
                settings.highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-white'
                  : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text)]'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">💧</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Morning Reminder (৮:০০ বজাত)
                  </span>
                </div>
                <p className={`${bodyTextClasses[settings.textSize]} font-bold`}>
                  Drink water & take blood pressure tablet
                </p>
              </div>

              {/* Sample Button */}
              <button
                type="button"
                className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 ${
                  settings.highContrast
                    ? 'bg-yellow-400 text-black border-2 border-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Check size={18} className="stroke-[3]" />
                <span className="text-sm sm:text-base">I Took My Medicine / ঔষধ খালু</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--color-border)] flex flex-col sm:flex-row items-center gap-3.5">
        <div className="w-full sm:w-2/3">
          <LargeButton onPress={handleNext} size="lg" variant="primary">
            <span>Continue to Review / পৰৱৰ্তী: সম্পূৰ্ণ</span>
          </LargeButton>
        </div>
        <div className="w-full sm:w-1/3">
          <button
            type="button"
            onClick={onBack}
            className="w-full min-h-[58px] sm:min-h-[64px] px-5 py-3 rounded-2xl sm:rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] text-base font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Back to Language</span>
          </button>
        </div>
      </div>
    </div>
  );
}
