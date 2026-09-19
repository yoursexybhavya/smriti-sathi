import { Eye, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';

interface RecogniseIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export default function RecogniseIntro({ onStart, onBack }: RecogniseIntroProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Recognise</h1>
            <p className="text-sm text-[#7A7A7A]">Pattern activity</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
            <Eye size={64} className="text-[#E65100]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Recognise</h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed">
            Look at patterns and sequences. Find what comes next or what is different.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 space-y-4">
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
        <div className="bg-[#FDF8F0] rounded-3xl border-2 border-[#E0D8CC] p-5 shadow-xs">
          <p className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-3 text-center">Example Sequence:</p>
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border border-[#E0D8CC] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80" alt="Apple" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[#4A4A4A]">Apple</span>
            </div>
            <span className="text-base font-bold text-[#7A7A7A]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border border-[#E0D8CC] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80" alt="Mango" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[#4A4A4A]">Mango</span>
            </div>
            <span className="text-base font-bold text-[#7A7A7A]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border border-[#E0D8CC] p-1.5 flex flex-col items-center justify-center shadow-xs">
              <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80" alt="Apple" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-[#4A4A4A]">Apple</span>
            </div>
            <span className="text-base font-bold text-[#7A7A7A]">→</span>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FFF3E0] rounded-2xl border-2 border-dashed border-[#E65100] flex items-center justify-center shadow-xs">
              <span className="text-xl font-extrabold text-[#E65100]">?</span>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-[#4A4A4A] mt-3">
            What comes next? (Answer: Mango)
          </p>
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
      <div className="w-8 h-8 rounded-full bg-[#E65100] text-white flex items-center justify-center flex-shrink-0 font-bold">
        {number}
      </div>
      <p className="text-base text-[#1A1A1A] pt-1">{text}</p>
    </div>
  );
}
