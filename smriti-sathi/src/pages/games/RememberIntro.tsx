import { Brain, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface RememberIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export default function RememberIntro({ onStart, onBack }: RememberIntroProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Remember</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Memory Recall Activity</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8 space-y-8">
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
