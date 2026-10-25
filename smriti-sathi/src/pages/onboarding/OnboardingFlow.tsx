import { useState } from 'react';
import { Check } from 'lucide-react';
import OnboardingWelcome from './OnboardingWelcome';
import PatientProfileSetup from './PatientProfileSetup';
import LanguageSelection from './LanguageSelection';
import AccessibilitySetup from './AccessibilitySetup';
import OnboardingComplete from './OnboardingComplete';
import { BrandMark, Button } from '../../ui';
import { useI18n } from '../../i18n';
import { PatientProfile, AccessibilitySettings, useApp } from '../../context/AppContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
}

const STEPS = ['ob.nameLabel', 'ob.langTitle', 'ob.accessTitle', 'ob.doneTitle'];

export default function OnboardingFlow({ onComplete, onCancel }: OnboardingFlowProps) {
  const { completeOnboarding, skipToElderDemo } = useApp();
  const { t, setLanguage: setI18nLanguage } = useI18n();

  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [language, setLanguage] = useState('en');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
  });

  const goBack = () => {
    if (step === 0 && onCancel) {
      onCancel();
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  };

  const finish = () => {
    if (patient) {
      completeOnboarding(patient, language, accessibility).then(onComplete);
    } else {
      skipToElderDemo().then(onComplete);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
        {/* Brand + back */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div>
              <div className="text-[0.95rem] font-bold leading-tight text-ink">{t('app.name')}</div>
              <div className="text-[0.7rem] text-ink-3">{t('app.shortTagline')}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={goBack}>
            ← {step === 0 ? t('auth.backToElder') : t('c.back')}
          </Button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  background:
                    i < step ? 'var(--brand-teal)' : i === step ? 'var(--brand-saffron)' : 'var(--line)',
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="t-eyebrow">{t('ob.step', { n: step + 1, total: STEPS.length })}</span>
            <span className="t-xs font-bold text-ink-2">{t(STEPS[step])}</span>
          </div>
        </div>

        <div className="pop-in" key={step}>
          {step === 0 && <OnboardingWelcome onNext={() => setStep(1)} onCancel={onCancel} />}
          {step === 1 && (
            <PatientProfileSetup
              initial={patient}
              onNext={(p) => {
                setPatient(p);
                setStep(2);
              }}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <LanguageSelection
              selected={language}
              onSelect={(code) => {
                setLanguage(code);
                setI18nLanguage(code);
              }}
              onNext={() => setStep(3)}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <AccessibilitySetup
              initial={accessibility}
              onNext={(a) => {
                setAccessibility(a);
                setStep(4);
              }}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <OnboardingComplete patient={patient} accessibility={accessibility} onFinish={finish} onBack={goBack} />
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-brand" />
          <span className="t-xs">{t('c.savedOffline')}</span>
        </div>
      </div>
    </div>
  );
}
