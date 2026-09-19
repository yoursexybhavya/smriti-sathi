import { CheckCircle, Brain } from 'lucide-react';
import LargeButton from '../../components/LargeButton';

interface OnboardingCompleteProps {
  patientName: string;
  onFinish: () => void;
}

export default function OnboardingComplete({ patientName, onFinish }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-6 py-12">
      {/* Success Icon */}
      <div className="w-32 h-32 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-8 shadow-lg">
        <CheckCircle size={64} className="text-[#1B5E20]" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-[#1A1A1A] text-center">
        Setup Complete
      </h1>

      {/* Message */}
      <p className="text-lg text-[#4A4A4A] text-center mt-4 max-w-sm leading-relaxed">
        Welcome, {patientName}. Your memory companion is ready.
      </p>

      {/* Features Summary */}
      <div className="mt-10 w-full max-w-sm space-y-3">
        <SummaryItem icon="🧠" text="Memory activities are ready" />
        <SummaryItem icon="🔔" text="Reminders are set up" />
        <SummaryItem icon="📊" text="Progress tracking enabled" />
        <SummaryItem icon="🌐" text="Works offline" />
      </div>

      {/* Start Button */}
      <div className="mt-10 w-full max-w-sm">
        <LargeButton onPress={onFinish}>
          Start Using Smriti Sathi
        </LargeButton>
      </div>

      {/* Note */}
      <p className="text-sm text-[#7A7A7A] text-center mt-6 max-w-xs">
        A caregiver can adjust settings anytime.
      </p>
    </div>
  );
}

function SummaryItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E0D8CC]">
      <span className="text-2xl">{icon}</span>
      <span className="text-base text-[#1A1A1A] font-medium">{text}</span>
    </div>
  );
}
