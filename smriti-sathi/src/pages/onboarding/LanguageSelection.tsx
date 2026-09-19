import { ChevronLeft, Check } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface LanguageSelectionProps {
  selectedLanguage: string;
  onSelect: (language: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🇮🇳' },
];

export default function LanguageSelection({
  selectedLanguage,
  onSelect,
  onNext,
  onBack,
}: LanguageSelectionProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Choose Language / ভাষা নিৰ্বাচন</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Step 2 of 4: Primary interface language</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Step 2 / 4
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context & Guidelines */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60">
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                Your Language, Your Comfort
              </h3>
              <p className="text-sm md:text-base text-indigo-800/90 dark:text-indigo-300 leading-relaxed">
                Smriti Sathi provides native localized memory prompts and speech audio. You can change this anytime later in Settings.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                North Eastern Regional Support
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tailored for Assamese, Bodo, Manipuri, and Indian English with authentic dialect phrasing.
              </p>
            </div>
          </div>

          {/* Right Column: Language Selection Cards & Next */}
          <div className="md:col-span-7 space-y-4">
            <SectionHeader title="Available Languages" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onSelect(lang.code)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 min-h-[72px] cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-3xl flex-shrink-0">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{lang.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lang.nativeName}</p>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Check size={16} className="text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <LargeButton onPress={onNext}>
                Continue to Accessibility →
              </LargeButton>
              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                ← Back to Profile Setup
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
