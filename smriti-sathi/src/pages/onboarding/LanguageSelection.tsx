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
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-5xl mx-auto flex items-center gap-3 px-5 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Choose Language / ভাষা নিৰ্বাচন</h1>
            <p className="text-sm text-[#7A7A7A]">Step 2 of 4: Primary interface language</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context & Guidelines */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 bg-[#E3F2FD] rounded-2xl border border-[#BBDEFB]">
              <h3 className="text-base font-bold text-[#1565C0] mb-1">
                Your Language, Your Comfort
              </h3>
              <p className="text-sm md:text-base text-[#1565C0] leading-relaxed">
                Smriti Sathi provides native localized memory prompts and speech audio. You can change this anytime later in Settings.
              </p>
            </div>

            <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
              <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider block mb-1">
                North Eastern Regional Support
              </span>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Tailored for Assamese, Bodo, Manipuri, and Indian English with authentic dialect phrasing.
              </p>
            </div>
          </div>

          {/* Right Column: Language Selection Cards & Next */}
          <div className="md:col-span-7 space-y-4">
            <SectionHeader title="Available Languages" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onSelect(lang.code)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 min-h-[72px] ${
                    selectedLanguage === lang.code
                      ? 'bg-[#E8F5E9] border-[#1B5E20] shadow-md ring-2 ring-[#1B5E20]/20'
                      : 'bg-white border-[#E0D8CC] hover:border-[#C0B8A8]'
                  }`}
                >
                  <span className="text-3xl flex-shrink-0">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#1A1A1A] truncate">{lang.name}</h3>
                    <p className="text-sm text-[#4A4A4A] truncate">{lang.nativeName}</p>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="w-7 h-7 rounded-full bg-[#1B5E20] flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <LargeButton onPress={onNext}>
                Continue to Accessibility →
              </LargeButton>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
