import { Brain, Heart, Shield, Sun, Moon, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { APP } from '../../core/constants/app';
import { useApp } from '../../context/AppContext';

interface OnboardingWelcomeProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function OnboardingWelcome({ onNext, onBack }: OnboardingWelcomeProps) {
  const { state, toggleTheme } = useApp();
  const isDark = state.accessibility?.theme === 'dark';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-center px-4 py-8 transition-colors duration-200">
      {/* Top Bar with Back & Theme Toggle */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-500 transition-all active:scale-95 shadow-sm text-sm font-semibold cursor-pointer"
            aria-label="Back to Account Login"
          >
            <ArrowLeft size={18} />
            <span>Switch Profile / Login</span>
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-500 transition-all active:scale-90 shadow-sm cursor-pointer"
          aria-label="Toggle Theme"
          title={isDark ? 'Light Theme' : 'Dark Theme'}
        >
          {isDark ? <Sun size={19} className="text-[#F59E0B]" /> : <Moon size={19} className="text-[#64748B]" />}
        </button>
      </div>

      {/* Hero & Features Container */}
      <div className="max-w-5xl mx-auto w-full px-2 md:px-6 py-6 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Branding & Tagline */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Logo */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-slate-900 border border-slate-700/80 flex items-center justify-center mb-6 shadow-xl ring-4 ring-indigo-500/20">
            <Brain size={54} className="text-indigo-400" />
          </div>

          {/* App Name */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] tracking-tight">
            {APP.name}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            স্মৃতি সাথী
          </p>

          {/* Tagline */}
          <p className="text-base md:text-xl text-[var(--color-text-secondary)] mt-3 max-w-md leading-relaxed">
            {APP.tagline}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <span>🌿 Cognitive Care & Memory Companion</span>
          </div>
        </div>

        {/* Right: Feature Highlights & CTA */}
        <div className="md:col-span-6 space-y-4">
          <FeatureRow
            icon={<Heart size={24} className="text-rose-500" />}
            title="Memory Activities & Games"
            description="Gentle, culturally attuned cognitive exercises with errorless learning"
          />
          <FeatureRow
            icon={<Shield size={24} className="text-indigo-600 dark:text-indigo-400" />}
            title="Multimodal Reminders"
            description="Audio, picture, and family voice prompts for medicine and hydration"
          />
          <FeatureRow
            icon={<Brain size={24} className="text-blue-500" />}
            title="100% Offline-First Architecture"
            description="Runs completely locally in remote Northeast hill areas without internet"
          />

          <div className="pt-4 space-y-3">
            <LargeButton onPress={onNext}>
              Begin Setup / আৰম্ভ কৰক →
            </LargeButton>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] text-sm font-semibold transition-colors cursor-pointer"
              >
                ← Return to Profile Selection
              </button>
            )}
            <p className="text-center text-xs md:text-sm text-[var(--color-text-muted)]">
              Designed for elderly users and caregivers with high-contrast accessibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-subtle)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}
