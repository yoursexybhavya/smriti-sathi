import { useState } from 'react';
import { Check } from 'lucide-react';
import OnboardingWelcome from './OnboardingWelcome';
import PatientProfileSetup from './PatientProfileSetup';
import LanguageSelection from './LanguageSelection';
import AccessibilitySetup from './AccessibilitySetup';
import EmergencyContactSetup from './EmergencyContactSetup';
import OnboardingComplete from './OnboardingComplete';
import { BrandMark, Button } from '../../ui';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import {
  PatientProfile,
  AccessibilitySettings,
  EmergencyContact,
  useApp,
} from '../../context/AppContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
}

const STEPS = ['ob.welcomeTitle', 'ob.nameTitle', 'ob.langTitle', 'ob.accessTitle', 'ob.contactTitle', 'ob.doneTitle'];

/**
 * Set-up for the person being cared for.
 *
 * The same five questions serve everybody: an elder setting up their own device
 * sees their own name pre-filled, and a family member answers them on behalf of
 * their parent. Nothing is seeded afterwards — the app opens on genuinely empty
 * screens and fills up as the person actually uses it.
 */
export default function OnboardingFlow({ onComplete, onCancel }: OnboardingFlowProps) {
  const { completeOnboarding, state } = useApp();
  const { persona, session } = useAuth();
  const { t, setLanguage: setI18nLanguage } = useI18n();

  const signedInName = session?.displayName ?? '';

  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState<PatientProfile | null>(
    persona === 'elder' && signedInName
      ? {
          id: '',
          name: signedInName,
          age: 0,
          preferredLanguage: state.interfaceLanguage,
          dailyRoutine: [],
          reminderPreferences: { medicine: true, hydration: true, activity: true, appointment: true },
        }
      : null,
  );
  const [language, setLanguage] = useState(state.interfaceLanguage || 'en');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
  });
  const [contact, setContact] = useState<EmergencyContact | null>(state.emergencyContact);

  const goBack = () => {
    if (step === 0 && onCancel) {
      onCancel();
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  };

  const finish = () => {
    if (!patient) return;
    const withSeed = {
      ...patient,
      age: patient.age || 0,
    };
    void completeOnboarding(withSeed, language, accessibility, contact).then(onComplete);
  };

  return (
    <div className="min-h-[100dvh] w-full px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div className="min-w-0">
              <div className="truncate text-[0.95rem] font-bold leading-tight text-ink">{t('app.name')}</div>
              <div className="truncate text-[0.7rem] text-ink-3">{t('app.shortTagline')}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={goBack}>
            ← {t('c.back')}
          </Button>
        </div>

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
          {step === 0 && <OnboardingWelcome onNext={() => setStep(1)} />}
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
            <EmergencyContactSetup
              initial={contact}
              onNext={(c) => {
                setContact(c);
                setStep(5);
              }}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <OnboardingComplete
              patient={patient}
              accessibility={accessibility}
              onFinish={finish}
              onBack={goBack}
            />
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
