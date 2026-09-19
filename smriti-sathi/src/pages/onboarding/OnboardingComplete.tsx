import { CheckCircle, Brain } from 'lucide-react';
import LargeButton from '../../components/LargeButton';

interface OnboardingCompleteProps {
  patientName: string;
  onFinish: () => void;
}

export default function OnboardingComplete({ patientName, onFinish }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Congratulatory Banner */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-28 h-28 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6 shadow-xl border-4 border-[#1B5E20]/20 animate-in zoom-in-75 duration-200">
            <CheckCircle size={60} className="text-[#1B5E20]" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
            Setup Complete! / প্ৰস্তুতি সম্পূৰ্ণ!
          </h1>

          <p className="text-xl md:text-2xl text-[#1B5E20] font-bold mt-2">
            Welcome, {patientName}.
          </p>

          <p className="text-base md:text-lg text-[#4A4A4A] mt-2 leading-relaxed">
            Your personal cognitive memory care companion is ready to assist you every day.
          </p>
        </div>

        {/* Right: Summary & Action */}
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-3">
            <SummaryItem icon="🧠" text="Cognitive & memory activities calibrated" />
            <SummaryItem icon="🔔" text="Daily medicine & hydration reminders active" />
            <SummaryItem icon="📊" text="Local offline progress tracking enabled" />
            <SummaryItem icon="🛡️" text="Encrypted local database on this tablet" />
          </div>

          <div className="pt-4 space-y-3">
            <LargeButton onPress={onFinish}>
              Start Using Smriti Sathi →
            </LargeButton>
            <p className="text-center text-xs md:text-sm text-[#7A7A7A]">
              Caregivers can adjust reminders or settings anytime from the Settings tab.
            </p>
          </div>
        </div>
      </div>
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
