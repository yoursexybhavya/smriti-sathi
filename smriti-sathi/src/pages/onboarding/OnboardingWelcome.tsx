import { Brain, Heart, Shield, Sparkles } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { APP } from '../../core/constants/app';
import { useApp } from '../../context/AppContext';

interface OnboardingWelcomeProps {
  onNext: () => void;
  onBack?: () => void;
  onExploreDemo?: () => void;
}

export default function OnboardingWelcome({ onNext, onExploreDemo }: OnboardingWelcomeProps) {
  const { skipToElderDemo } = useApp();

  const handleDemoClick = () => {
    if (onExploreDemo) {
      onExploreDemo();
    } else {
      skipToElderDemo();
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between flex-1">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
        {/* Left Column: Reassuring Brand Identity */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Luminous Logo Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 border-2 border-indigo-200 dark:border-indigo-700/80 flex items-center justify-center mb-5 shadow-md shadow-indigo-500/10">
            <Brain size={48} className="text-indigo-600 dark:text-indigo-400 stroke-[2.2]" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)] tracking-tight">
            {APP.name}
          </h1>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">
              স্মৃতি সাথী
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Elder Companion
            </span>
          </div>

          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mt-3 leading-relaxed max-w-md">
            A serene, dignified cognitive care companion designed for elders in Northeast India. Strengthening memories, daily habits, and peace of mind.
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-muted)] flex items-center gap-2.5">
            <Sparkles size={18} className="text-amber-500 flex-shrink-0" />
            <span>Culturally adapted for Assamese, Bodo, Manipuri & English speakers.</span>
          </div>
        </div>

        {/* Right Column: Three Core Care Pillars */}
        <div className="md:col-span-6 space-y-3.5">
          <FeatureCard
            icon={<Heart size={24} className="text-rose-600 dark:text-rose-400" />}
            iconBg="bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900"
            title="Cognitive Games & Memory"
            subtitle="মনোযোগ আৰু স্মৃতি খেল"
            description="Gentle cognitive exercises designed with errorless learning to encourage and uplift."
          />
          <FeatureCard
            icon={<Shield size={24} className="text-indigo-600 dark:text-indigo-400" />}
            iconBg="bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900"
            title="Daily Care & Medicine Routine"
            subtitle="দৈনিক ঔষধ আৰু পানীৰ সোঁৱৰণী"
            description="Audible voice prompts and clear picture reminders for medicine, hydration, and visits."
          />
          <FeatureCard
            icon={<Brain size={24} className="text-emerald-600 dark:text-emerald-400" />}
            iconBg="bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900"
            title="100% Offline & Private"
            subtitle="ইন্টাৰনেট অবিহনে সম্পূৰ্ণ সুৰক্ষিত"
            description="All personal memory books and records stay safely on this tablet without needing internet."
          />
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center gap-3.5">
        <div className="w-full sm:flex-1 sm:max-w-xl">
          <LargeButton onPress={onNext} size="lg" variant="primary">
            Begin Setup / আৰম্ভ কৰক
          </LargeButton>
        </div>
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full sm:w-auto min-w-[220px] whitespace-nowrap min-h-[58px] sm:min-h-[64px] px-6 py-3 rounded-2xl sm:rounded-3xl border-2 border-emerald-600/50 dark:border-emerald-400/50 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-base font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⚡ Demo Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
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
    <div className="p-4 rounded-2xl bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-xs flex items-start gap-4 transition-all hover:border-[var(--color-primary)]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-base font-bold text-[var(--color-text)] leading-snug">{title}</h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-serif">{subtitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
