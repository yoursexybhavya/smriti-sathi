import { useState } from 'react';
import { Volume2, Check, ArrowRight, ShieldCheck, Heart, UserCheck, Stethoscope } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { languageNames, type Language } from '../i18n/translations';

interface FirstLaunchOnboardingProps {
  onComplete: () => void;
}

export function FirstLaunchOnboarding({ onComplete }: FirstLaunchOnboardingProps) {
  const { language, setLanguage } = useLanguage();
  const { completeOnboarding, seedClinicalDemo } = usePatient();
  const { speak } = useVoice();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [role, setRole] = useState<'elder' | 'caregiver'>('elder');

  // Step 3 form fields
  const [elderName, setElderName] = useState('');
  const [elderAge, setElderAge] = useState('');
  const [pin, setPin] = useState('');
  const [medReminder, setMedReminder] = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);
  const [brainReminder, setBrainReminder] = useState(true);
  const [medTime, setMedTime] = useState('09:00');
  const [waterTime, setWaterTime] = useState('11:00');
  const [brainTime, setBrainTime] = useState('16:00');
  const [error, setError] = useState('');

  const voicePreviews: Record<Language, string> = {
    as: 'নমস্কাৰ, মই স্মৃতি সাথী। আপোনাৰ স্মৃতি যত্নৰ সংগী।',
    brx: 'खुलुमबाय, आं स्मृति साथी। नोंथांनि गोसो गोहोम सांग्रांथि।',
    mni: 'খুরুমজরি, ঐ স্মৃতি সাথী। নহাক্কী নিংশিং লনগী মতেং।',
    en: 'Welcome to Smriti Sathi, your cognitive memory care companion.',
  };

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    speak(voicePreviews[lang], lang);
  };

  const handleFinishSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderName.trim()) {
      setError('Please enter elder name (e.g. Baa, Deuta, or Full Name)');
      return;
    }

    const ageNum = parseInt(elderAge) || 72;
    await completeOnboarding({
      name: elderName.trim(),
      age: ageNum,
      language: selectedLang,
      role,
      pin: pin.trim().length === 4 ? pin.trim() : '1234',
      remindersEnabled: {
        medicine: medReminder,
        hydration: waterReminder,
        brainWorkout: brainReminder,
      },
      reminderTimes: {
        medicine: { hour: parseInt(medTime.split(':')[0]), minute: parseInt(medTime.split(':')[1]) },
        hydration: { hour: parseInt(waterTime.split(':')[0]), minute: parseInt(waterTime.split(':')[1]) },
        brainWorkout: { hour: parseInt(brainTime.split(':')[0]), minute: parseInt(brainTime.split(':')[1]) },
      },
    });

    onComplete();
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#07101B',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0E1C2D',
          border: '1px solid #284469',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* App Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 114, 71, 0.15)',
              border: '1px solid rgba(255, 114, 71, 0.3)',
              borderRadius: '9999px',
              padding: '6px 14px',
              color: '#FF7247',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            <Heart size={16} />
            <span>Memory Care Companion</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Smriti Sathi (স্মৃতি সাথী)
          </h1>
          <p style={{ fontSize: '14px', color: '#94A9C4', marginTop: '4px' }}>
            {step === 1 && 'Step 1 of 3: Choose Primary Language'}
            {step === 2 && 'Step 2 of 3: Device Role Selection'}
            {step === 3 && 'Step 3 of 3: Elder Profile & Local Security'}
          </p>
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#E2E8F0', marginBottom: '16px', textAlign: 'center' }}>
              Select language to continue / ভাষা বাছক:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => {
                const isSelected = selectedLang === code;
                return (
                  <div
                    key={code}
                    onClick={() => handleLanguageSelect(code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#15253B',
                      border: isSelected ? '2px solid #38BDF8' : '1px solid #223A57',
                      cursor: 'pointer',
                      minHeight: '68px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: isSelected ? '6px solid #38BDF8' : '2px solid #647B99',
                          backgroundColor: '#0E1C2D',
                        }}
                      />
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                        {name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageSelect(code);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38BDF8',
                        cursor: 'pointer',
                      }}
                      title="Listen audio sample"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary-lumos"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '17px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '56px',
              }}
            >
              <span>Next / আগবাঢ়ক</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 2: ROLE SELECTION */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#E2E8F0', marginBottom: '16px', textAlign: 'center' }}>
              Who will be using this device primarily?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {/* Elder Option */}
              <div
                onClick={() => setRole('elder')}
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  backgroundColor: role === 'elder' ? 'rgba(56, 189, 248, 0.15)' : '#15253B',
                  border: role === 'elder' ? '2px solid #38BDF8' : '1px solid #223A57',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  minHeight: '90px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    flexShrink: 0,
                  }}
                >
                  <UserCheck size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    🧓 I am the Elder (বয়সীয়াল ব্যক্তি)
                  </div>
                  <div style={{ fontSize: '13px', color: '#94A9C4', marginTop: '4px', lineHeight: 1.4 }}>
                    Elder Mode: Extra-large buttons, spoken audio guidance, and daily 5-minute memory workouts.
                  </div>
                </div>
              </div>

              {/* Caregiver Option */}
              <div
                onClick={() => setRole('caregiver')}
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  backgroundColor: role === 'caregiver' ? 'rgba(255, 114, 71, 0.15)' : '#15253B',
                  border: role === 'caregiver' ? '2px solid #FF7247' : '1px solid #223A57',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  minHeight: '90px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 114, 71, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF7247',
                    flexShrink: 0,
                  }}
                >
                  <Stethoscope size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    👨‍👩‍👧 Family Member / ASHA Worker
                  </div>
                  <div style={{ fontSize: '13px', color: '#94A9C4', marginTop: '4px', lineHeight: 1.4 }}>
                    Caregiver Mode: Set up elder profile, customize care reminders, and monitor cognitive stability trends.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary-lumos"
                style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 600 }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (role === 'elder') {
                    // Skip complex setup
                    setElderAge('');
                    setPin('');
                    setMedReminder(false);
                    setWaterReminder(false);
                    setBrainReminder(false);
                  }
                  setStep(3);
                }}
                className="btn-primary-lumos"
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Continue</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ELDER PROFILE CREATION & LOCAL PIN */}
        {step === 3 && (
          <form onSubmit={handleFinishSetup}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#E2E8F0', marginBottom: '16px' }}>
              Create Elder Profile & Local Device PIN:
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {/* Elder Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A9C4', marginBottom: '6px' }}>
                Elder's Name (e.g. Baa / Deuta / Ram Chandra) *
              </label>
              <input
                type="text"
                value={elderName}
                onChange={(e) => {
                  setElderName(e.target.value);
                  setError('');
                }}
                placeholder="Enter elder's name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#15253B',
                  border: '1px solid #223A57',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            {role === 'caregiver' && (<>
            {/* Age */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A9C4', marginBottom: '6px' }}>
                Age
              </label>
              <input
                type="number"
                value={elderAge}
                onChange={(e) => setElderAge(e.target.value)}
                placeholder="72"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#15253B',
                  border: '1px solid #223A57',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Enabled Reminders */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A9C4', marginBottom: '8px' }}>
                Enable Daily Care Reminders:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#15253B',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={medReminder}
                    onChange={(e) => setMedReminder(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#FF7247' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>💊 Morning Medicine (ৰাতিপুৱাৰ ঔষধ)</span>
                    <input type="time" value={medTime} onChange={(e) => setMedTime(e.target.value)} onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px', background: '#0E1C2D', border: '1px solid #223A57', color: '#FFF', padding: '4px 8px', borderRadius: '6px' }} />
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#15253B',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={waterReminder}
                    onChange={(e) => setWaterReminder(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#38BDF8' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>💧 Hydration (পানী খোৱা)</span>
                    <input type="time" value={waterTime} onChange={(e) => setWaterTime(e.target.value)} onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px', background: '#0E1C2D', border: '1px solid #223A57', color: '#FFF', padding: '4px 8px', borderRadius: '6px' }} />
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#15253B',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={brainReminder}
                    onChange={(e) => setBrainReminder(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>🧠 Memory Workout (স্মৃতি পৰীক্ষা)</span>
                    <input type="time" value={brainTime} onChange={(e) => setBrainTime(e.target.value)} onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px', background: '#0E1C2D', border: '1px solid #223A57', color: '#FFF', padding: '4px 8px', borderRadius: '6px' }} />
                  </div>
                </label>
              </div>
            </div>

            {/* Enabled Reminders */}
            </>)}
            {role === 'caregiver' && (<>
            {/* 4-Digit Security PIN */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldCheck size={16} color="#38BDF8" />
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#94A9C4' }}>
                  Caregiver 4-Digit Security PIN
                </label>
              </div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#15253B',
                  border: '1px solid #223A57',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  letterSpacing: '4px',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: '11px', color: '#647B99', marginTop: '4px' }}>
                Protects caregiver dashboard & ASHA clinical sync from elder disorientation/wandering. Default: 1234.
              </p>
            </div>

            </>)}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary-lumos"
                style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 600 }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary-lumos"
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minHeight: '52px',
                }}
              >
                <Check size={20} />
                <span>Start Smriti Sathi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
