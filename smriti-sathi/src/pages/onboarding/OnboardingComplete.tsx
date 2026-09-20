import { CheckCircle, Brain } from 'lucide-react';
import LargeButton from '../../components/LargeButton';

interface OnboardingCompleteProps {
  patientName: string;
  onFinish: () => void;
  onBack?: () => void;
}

export default function OnboardingComplete({ patientName, onFinish, onBack }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-center px-6 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Congratulatory Banner */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-28 h-28 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-6 shadow-xl border-4 border-emerald-500/30 animate-in zoom-in-75 duration-200">
            <CheckCircle size={60} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Setup Complete! / প্ৰস্তুতি সম্পূৰ্ণ!
          </h1>

          <p className="text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 font-bold mt-2">
            Welcome, {patientName}.
          </p>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
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
            <LargeButton onPress={onFinish} size="lg">
              Start Using Smriti Sathi
            </LargeButton>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-base font-bold transition-all cursor-pointer active:scale-95"
              >
                Review Settings
              </button>
            )}
            <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400">
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
    <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <span className="text-2xl">{icon}</span>
      <span className="text-base text-slate-800 dark:text-slate-200 font-medium">{text}</span>
    </div>
  );
}
