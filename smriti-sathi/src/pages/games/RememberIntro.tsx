import { Brain, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface RememberIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export default function RememberIntro({ onStart, onBack }: RememberIntroProps) {
  return (
    <div className="min-h-screen w-full flex-1 flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 z-40 w-full bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto flex items-center gap-3.5 px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors active:scale-95 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">Remember</h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Memory Recall Activity</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-5 sm:px-8 py-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-[#10B981]/15 border-2 border-[#10B981]/30 flex items-center justify-center shadow-md">
            <Brain size={64} className="text-[#10B981]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[var(--color-text)]">Remember</h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Look carefully at familiar objects. Then select the ones you remember seeing.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 space-y-4 shadow-sm">
          <SectionHeader title="How It Works" />
          <div className="space-y-3">
            <InstructionStep number={1} text="You will see familiar objects on screen" />
            <InstructionStep number={2} text="Look at them carefully for a few seconds" />
            <InstructionStep number={3} text="Then, select the objects you remember" />
          </div>
        </div>

        {/* Note */}
        <div className="p-4 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed text-center">
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
      <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 font-bold">
        {number}
      </div>
      <p className="text-base text-[var(--color-text)] pt-1">{text}</p>
    </div>
  );
}
