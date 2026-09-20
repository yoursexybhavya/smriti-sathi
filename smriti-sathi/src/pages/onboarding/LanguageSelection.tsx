import { ChevronLeft, Check, Volume2, Sparkles } from 'lucide-react';
import LargeButton from '../../components/LargeButton';

interface LanguageSelectionProps {
  selectedLanguage: string;
  onSelect: (language: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const languages = [
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'অসমীয়া লিপি',
    greeting: 'নমস্কাৰ, আজি আপোনাৰ দিনটো শুভ হওক।',
    flag: '🌺',
    region: 'Assam & Brahmaputra Valley',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin Script',
    greeting: 'Hello, wishing you a calm and peaceful day.',
    flag: '🌿',
    region: 'Indian English Standard',
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'দেৱনাগৰী লিপি',
    greeting: 'खुलुमबाय, नोंथांनि सानआ मोजां जागोन।',
    flag: '🌾',
    region: 'Bodoland Territorial Region',
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    script: 'মৈতৈ ময়েক / বেঙ্গলী',
    greeting: 'খুরুমজরি, নুমিৎসি নুংঙাইনা লেনসি।',
    flag: '🌸',
    region: 'Manipur & Imphal Valley',
  },
];

export default function LanguageSelection({
  selectedLanguage,
  onSelect,
  onNext,
  onBack,
}: LanguageSelectionProps) {
  return (
    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between flex-1">
      <div>
        {/* Step Heading */}
        <div className="mb-6 pb-4 border-b-2 border-[var(--color-border)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Step 2 of 4
              </span>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Regional Dialect & Audio
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
              Choose Language / ভাষা নিৰ্বাচন
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Select the voice and display language for the elder's daily companion.
            </p>
          </div>
        </div>

        {/* 4 Regional Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map(lang => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelect(lang.code)}
                className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-indigo-400/80 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <span className="text-lg font-extrabold text-[var(--color-text)] font-serif block leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-subtle)]'
                      }`}
                    >
                      {isSelected && <Check size={16} className="stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium italic mt-2 line-clamp-2">
                    "{lang.greeting}"
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold">
                  <span>{lang.region}</span>
                  <span className="text-emerald-700 dark:text-emerald-400">Audio Ready ✓</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audio Reassurance Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] flex items-start gap-3">
          <Volume2 size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <strong className="text-[var(--color-text)]">Native Speech Audio:</strong> All reminders, memory questions, and calming guidance will be spoken aloud in the selected language. You can change this anytime from Settings.
          </p>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--color-border)] flex flex-col sm:flex-row items-center gap-3.5">
        <div className="w-full sm:w-2/3">
          <LargeButton onPress={onNext} size="lg" variant="primary">
            <span>Continue to Accessibility / পৰৱৰ্তী: সুবিধা</span>
          </LargeButton>
        </div>
        <div className="w-full sm:w-1/3">
          <button
            type="button"
            onClick={onBack}
            className="w-full min-h-[58px] sm:min-h-[64px] px-5 py-3 rounded-2xl sm:rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] text-base font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Back to Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
