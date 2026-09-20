import { CheckCircle2, Brain, Bell, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';

interface OnboardingCompleteProps {
  patientName: string;
  onFinish: () => void;
  onBack?: () => void;
}

export default function OnboardingComplete({ patientName, onFinish, onBack }: OnboardingCompleteProps) {
  return (
    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between flex-1">
      <div>
        {/* Step Heading */}
        <div className="mb-6 pb-4 border-b-2 border-[var(--color-border)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Setup Complete
              </span>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Ready for Daily Companion
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
              Setup Complete! / প্ৰস্তুতি সম্পূৰ্ণ!
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Everything is set up and calibrated for daily cognitive care and peace of mind.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Celebratory Hero Badge */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-3xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)]">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-4 border-emerald-500/40 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/15">
              <CheckCircle2 size={54} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Welcome / স্বাগতম
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] mt-1 tracking-tight">
              {patientName}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
              Your personal cognitive care companion is ready to guide and support you every single day.
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--color-border)] w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles size={14} />
              <span>Offline-first active · Private & Secure</span>
            </div>
          </div>

          {/* Right Column: 4 Summary Checkpoints */}
          <div className="md:col-span-7 space-y-3">
            <SummaryRow
              icon={<Brain size={22} className="text-indigo-600 dark:text-indigo-400" />}
              iconBg="bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900"
              title="Cognitive Memory Games Calibrated"
              subtitle="মনোযোগ আৰু স্মৃতি খেল সাজু"
              description="Gentle errorless stimulation games adjusted to patient pace."
            />
            <SummaryRow
              icon={<Bell size={22} className="text-amber-600 dark:text-amber-400" />}
              iconBg="bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900"
              title="Daily Care & Medicine Routine Active"
              subtitle="দৈনিক ঔষধ আৰু পানীৰ সোঁৱৰণী সক্ৰিয়"
              description="Scheduled morning/evening reminders and audible chimes."
            />
            <SummaryRow
              icon={<ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400" />}
              iconBg="bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900"
              title="Offline Encrypted Local Database"
              subtitle="তথ্য এই টেবলেটতে সম্পূৰ্ণ সুৰক্ষিত"
              description="All patient data stays safely stored on this tablet."
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center gap-3.5">
        <div className="w-full sm:flex-1 sm:max-w-xl">
          <LargeButton onPress={onFinish} size="lg" variant="primary">
            <span>Enter Smriti Sathi / স্মৃতি সাথী আৰম্ভ কৰক</span>
          </LargeButton>
        </div>
        {onBack && (
          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto min-w-[220px] whitespace-nowrap min-h-[58px] sm:min-h-[64px] px-6 py-3 rounded-2xl sm:rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] text-base font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              <span>Review Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  iconBg,
  title,
  subtitle,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="p-3.5 rounded-2xl bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-xs flex items-start gap-3.5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <h4 className="text-sm font-bold text-[var(--color-text)] leading-snug">{title}</h4>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-serif">{subtitle}</span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}
