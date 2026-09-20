import { useState } from 'react';
import { Sun, Moon, Sparkles, Brain, Check, ShieldCheck } from 'lucide-react';
import OnboardingWelcome from './OnboardingWelcome';
import PatientProfileSetup from './PatientProfileSetup';
import LanguageSelection from './LanguageSelection';
import AccessibilitySetup from './AccessibilitySetup';
import OnboardingComplete from './OnboardingComplete';
import { PatientProfile, AccessibilitySettings, useApp } from '../../context/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export default function OnboardingFlow({ onComplete, onCancel }: OnboardingFlowProps) {
  const { state, completeOnboarding, toggleTheme, skipToElderDemo } = useApp();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [language, setLanguage] = useState('as');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
  });

  const isDark = state.accessibility?.theme === 'dark';

  const handlePatientNext = (newPatient: PatientProfile) => {
    setPatient(newPatient);
    setStep(2);
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setGlobalLanguage(lang as any);
  };

  const handleLanguageNext = () => {
    setStep(3);
  };

  const handleAccessibilitySave = (settings: AccessibilitySettings) => {
    setAccessibility(settings);
  };

  const handleAccessibilityNext = () => {
    setStep(4);
  };

  const handleFinish = () => {
    if (patient) {
      completeOnboarding(patient, language, accessibility);
      onComplete();
    } else {
      // Fallback
      skipToElderDemo().then(onComplete);
    }
  };

  const handleExploreDemo = () => {
    skipToElderDemo().then(onComplete);
  };

  const goBack = () => {
    if (step === 0 && onCancel) {
      onCancel();
      return;
    }
    setStep(prev => Math.max(0, prev - 1));
  };

  // Step names for the progress indicator
  const stepsList = [
    { num: 1, title: 'Profile' },
    { num: 2, title: 'Language' },
    { num: 3, title: 'Display' },
    { num: 4, title: 'Ready' },
  ];

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return <OnboardingWelcome onNext={() => setStep(1)} onBack={onCancel} onExploreDemo={handleExploreDemo} />;
      case 1:
        return <PatientProfileSetup onNext={handlePatientNext} onBack={goBack} />;
      case 2:
        return (
          <LanguageSelection
            selectedLanguage={language}
            onSelect={handleLanguageSelect}
            onNext={handleLanguageNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <AccessibilitySetup
            initialSettings={accessibility}
            onSave={handleAccessibilitySave}
            onNext={handleAccessibilityNext}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <OnboardingComplete
            patientName={patient?.name || 'Kamala Baa'}
            onFinish={handleFinish}
            onBack={goBack}
          />
        );
      default:
        return <OnboardingWelcome onNext={() => setStep(1)} onExploreDemo={handleExploreDemo} />;
    }
  };

  return (
    <div className="onboarding-screen-frame">
      <div className="onboarding-card">
        {/* Unified Top Navigation & Status Bar */}
        <header className="px-6 py-4 border-b-2 border-[var(--color-border)] bg-[var(--color-card)] flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
              <Brain size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-[var(--color-text)] tracking-tight block leading-tight">
                Smriti Sathi
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-serif font-bold">
                স্মৃতি সাথী
              </span>
            </div>
          </div>

          {/* Center: Stepper (Visible for step 1 to 4) */}
          {step > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              {stepsList.map(s => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={12} className="stroke-[3]" />
                      ) : (
                        <span>{s.num}</span>
                      )}
                      <span>{s.title}</span>
                    </div>
                    {s.num < 4 && (
                      <div className={`w-3 h-0.5 ${step > s.num ? 'bg-emerald-500' : 'bg-[var(--color-border)]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Right: Controls (Theme Toggle & Direct Demo Bypass) */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handleExploreDemo}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                title="Skip setup and explore home dashboard"
              >
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Quick Demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-2 border-[var(--color-border)] hover:border-indigo-500 transition-all active:scale-95 shadow-xs cursor-pointer"
              aria-label="Toggle Theme"
              title={isDark ? 'Switch to Daylight Light Theme' : 'Switch to Midnight Dark Theme'}
            >
              {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-600" />}
            </button>
          </div>
        </header>

        {/* Step Body */}
        {renderCurrentStep()}
      </div>
    </div>
  );
}
