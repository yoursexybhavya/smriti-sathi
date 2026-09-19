import { Brain, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface RememberIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export default function RememberIntro({ onStart, onBack }: RememberIntroProps) {
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
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Remember</h1>
            <p className="text-sm text-[#7A7A7A]">Memory activity</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-[#E8F5E9] flex items-center justify-center shadow-md">
            <Brain size={64} className="text-[#1B5E20]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Remember</h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed">
            Look carefully at the objects. You will be asked about them.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 space-y-4">
          <SectionHeader title="How It Works" />
          <div className="space-y-3">
            <InstructionStep number={1} text="You will see some objects on the screen" />
            <InstructionStep number={2} text="Look at them carefully for a few seconds" />
            <InstructionStep number={3} text="Then, select the objects you remember" />
          </div>
        </div>

        {/* Note */}
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed text-center">
            Take your time. There is no rush.
          </p>
        </div>

        {/* Start Button */}
        <LargeButton onPress={onStart}>
          Start Activity
        </LargeButton>
      </div>
    </div>
  );
}

function InstructionStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center flex-shrink-0 font-bold">
        {number}
      </div>
      <p className="text-base text-[#1A1A1A] pt-1">{text}</p>
    </div>
  );
}
