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
      <div className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Choose Language</h1>
            <p className="text-sm text-[#7A7A7A]">Step 2 of 4</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-32">
        {/* Instruction */}
        <div className="p-4 bg-[#E3F2FD] rounded-2xl border border-[#BBDEFB]">
          <p className="text-base text-[#1565C0] leading-relaxed">
            Select the language you are most comfortable with. You can change this later in Settings.
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-3">
          <SectionHeader title="Available Languages" />
          <div className="space-y-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 min-h-[72px] ${
                  selectedLanguage === lang.code
                    ? 'bg-[#E8F5E9] border-[#1B5E20] shadow-sm'
                    : 'bg-white border-[#E0D8CC] hover:border-[#C0B8A8]'
                }`}
              >
                <span className="text-3xl">{lang.flag}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">{lang.name}</h3>
                  <p className="text-base text-[#4A4A4A]">{lang.nativeName}</p>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="w-8 h-8 rounded-full bg-[#1B5E20] flex items-center justify-center">
                    <Check size={18} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            More languages from the North Eastern region will be added soon.
          </p>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <LargeButton onPress={onNext}>
            Continue
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
