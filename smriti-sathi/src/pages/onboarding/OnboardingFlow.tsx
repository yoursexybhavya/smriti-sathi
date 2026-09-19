import { useState } from 'react';
import OnboardingWelcome from './OnboardingWelcome';
import PatientProfileSetup from './PatientProfileSetup';
import LanguageSelection from './LanguageSelection';
import AccessibilitySetup from './AccessibilitySetup';
import OnboardingComplete from './OnboardingComplete';
import { PatientProfile, AccessibilitySettings, useApp } from '../../context/AppContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [language, setLanguage] = useState('en');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
  });

  const handlePatientNext = (newPatient: PatientProfile) => {
    setPatient(newPatient);
    setStep(2);
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
    }
  };

  const goBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  switch (step) {
    case 0:
      return <OnboardingWelcome onNext={() => setStep(1)} />;
    case 1:
      return (
        <PatientProfileSetup
          onNext={handlePatientNext}
          onBack={goBack}
        />
      );
    case 2:
      return (
        <LanguageSelection
          selectedLanguage={language}
          onSelect={setLanguage}
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
          patientName={patient?.name || 'Friend'}
          onFinish={handleFinish}
        />
      );
    default:
      return <OnboardingWelcome onNext={() => setStep(1)} />;
  }
}
