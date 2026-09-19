import { useState } from 'react';
import { ChevronLeft, Type, Eye, Volume2 } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';
import { AccessibilitySettings } from '../../context/AppContext';

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

  const updateTextSize = (size: AccessibilitySettings['textSize']) => {
    setSettings(prev => ({ ...prev, textSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleVoiceGuidance = () => {
    setSettings(prev => ({ ...prev, voiceGuidance: !prev.voiceGuidance }));
  };

  const handleNext = () => {
    onSave(settings);
    onNext();
  };

  const textSizePreview = {
    normal: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl',
  };

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
            <h1 className="text-xl font-bold text-[#1A1A1A]">Accessibility</h1>
            <p className="text-sm text-[#7A7A7A]">Step 3 of 4</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-32">
        {/* Text Size */}
        <div className="space-y-3">
          <SectionHeader
            title="Text Size"
            icon={<Type size={20} />}
          />
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4 space-y-3">
            <TextSizeOption
              label="Normal"
              preview="This is normal text"
              selected={settings.textSize === 'normal'}
              onSelect={() => updateTextSize('normal')}
            />
            <TextSizeOption
              label="Large"
              preview="This is large text"
              selected={settings.textSize === 'large'}
              onSelect={() => updateTextSize('large')}
            />
            <TextSizeOption
              label="Extra Large"
              preview="This is extra large text"
              selected={settings.textSize === 'extra-large'}
              onSelect={() => updateTextSize('extra-large')}
            />
          </div>
        </div>

        {/* High Contrast */}
        <div className="space-y-3">
          <SectionHeader
            title="High Contrast"
            icon={<Eye size={20} />}
          />
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
            <button
              onClick={toggleHighContrast}
              className="w-full flex items-center justify-between min-h-[56px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Enable High Contrast</span>
                <p className="text-sm text-[#7A7A7A] mt-0.5">Makes text easier to read</p>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${
                settings.highContrast ? 'bg-[#1B5E20]' : 'bg-[#C0B8A8]'
              }`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Voice Guidance */}
        <div className="space-y-3">
          <SectionHeader
            title="Voice Guidance"
            icon={<Volume2 size={20} />}
          />
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
            <button
              onClick={toggleVoiceGuidance}
              className="w-full flex items-center justify-between min-h-[56px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Enable Voice Guidance</span>
                <p className="text-sm text-[#7A7A7A] mt-0.5">Instructions will be read aloud</p>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${
                settings.voiceGuidance ? 'bg-[#1B5E20]' : 'bg-[#C0B8A8]'
              }`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.voiceGuidance ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5">
          <p className="text-sm text-[#7A7A7A] mb-2">Preview:</p>
          <p className={`${textSizePreview[settings.textSize]} text-[#1A1A1A] leading-relaxed`}>
            Welcome! This is how text will appear in the app.
          </p>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <LargeButton onPress={handleNext}>
            Continue
          </LargeButton>
        </div>
      </div>
    </div>
  );
}

function TextSizeOption({
  label,
  preview,
  selected,
  onSelect,
}: {
  label: string;
  preview: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[56px] ${
        selected
          ? 'bg-[#E8F5E9] border-[#1B5E20]'
          : 'bg-[#FDF8F0] border-[#E0D8CC] hover:border-[#C0B8A8]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-[#1A1A1A]">{label}</span>
        {selected && <span className="text-[#1B5E20] font-bold">✓</span>}
      </div>
      <p className="text-[#4A4A4A] mt-1">{preview}</p>
    </button>
  );
}
