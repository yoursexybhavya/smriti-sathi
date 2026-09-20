import { Eye, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface RecogniseIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export default function RecogniseIntro({ onStart, onBack }: RecogniseIntroProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors cursor-pointer active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Recognise</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Pattern & Sequence Activity</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-md">
            <Eye size={64} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[var(--color-text)]">Recognise</h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Look at patterns and sequences. Find what comes next or what is different.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 space-y-4 shadow-sm">
          <SectionHeader title="What You Will Do" />
          <div className="space-y-3">
            <InstructionStep 
              number={1} 
              text="Look at objects or patterns shown to you" 
            />
            <InstructionStep 
              number={2} 
              text="Think about what comes next or what is different" 
            />
            <InstructionStep 
              number={3} 
              text="Choose your answer from the options given" 
            />
          </div>
        </div>

        {/* Example with Real Photographic Objects */}
        <div className="bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] p-5 shadow-xs">
          <p className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider mb-3 text-center">Example Sequence:</p>
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80" alt="Apple" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">Apple</span>
            </div>
            <span className="text-base font-bold text-[var(--color-text-muted)]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80" alt="Mango" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">Mango</span>
            </div>
            <span className="text-base font-bold text-[var(--color-text-muted)]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80" alt="Apple" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">Apple</span>
            </div>
            <span className="text-base font-bold text-[var(--color-text-muted)]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#E65100]/15 rounded-2xl border-2 border-dashed border-[#E65100] flex items-center justify-center shadow-xs">
              <span className="text-xl font-extrabold text-[#E65100]">?</span>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-[var(--color-text-secondary)] mt-3">
            What comes next? (Answer: Mango)
          </p>
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
      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
        {number}
      </div>
      <p className="text-base text-[var(--color-text)] pt-1">{text}</p>
    </div>
  );
}
