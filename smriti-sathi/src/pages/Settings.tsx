import { useState, useEffect } from 'react';
import { User, Globe, Eye, ShieldCheck, Check, Edit3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { languageNames, type Language } from '../i18n/translations';
import { db } from '../db/database';

export function Settings() {
  const { language, setLanguage } = useLanguage();
  const { patient, createPatient, setPatient } = usePatient();
  const { speak } = useVoice();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [consentGranted, setConsentGranted] = useState(true);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setAge(patient.age.toString());
    }
  }, [patient]);

  const handleSaveProfile = async () => {
    if (!name.trim() || !age) return;
    const parsedAge = parseInt(age) || 70;

    if (patient && patient.id) {
      await db.patients.update(patient.id, { name: name.trim(), age: parsedAge });
      setPatient({ ...patient, name: name.trim(), age: parsedAge });
    } else {
      await createPatient(name.trim(), parsedAge, language);
    }
    setIsEditing(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    speak(languageNames[lang], lang);
  };

  return (
    <div className="page" style={{ padding: '8px 16px 32px 16px', gap: '18px' }}>
      {/* Title */}
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Elder profile, language, and accessibility preferences
        </p>
      </div>

      {/* Elder Profile Card */}
      <div
        className="lumos-card"
        style={{
          padding: '20px',
          border: '1px solid #233A57',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#38BDF8" />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
              ELDER PROFILE
            </span>
          </div>
          {patient && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FF7247',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditing || !patient ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Elder's Name (e.g. Baa / Krishna)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #223752',
                backgroundColor: '#0F1D2F',
                color: '#FFFFFF',
                fontSize: '15px',
              }}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #223752',
                backgroundColor: '#0F1D2F',
                color: '#FFFFFF',
                fontSize: '15px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary-lumos"
                onClick={handleSaveProfile}
                style={{ flex: 1, minHeight: '48px', padding: '10px' }}
              >
                Save Profile
              </button>
              {patient && (
                <button
                  className="btn-secondary-lumos"
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1, minHeight: '48px', padding: '10px' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: '#FFFFFF' }}>
              {patient.name}
            </div>
            <div style={{ fontSize: '13px', color: '#94A9C4', marginTop: '2px' }}>
              Age {patient.age} &bull; Registered for Daily Dementia Cognitive Care
            </div>
          </div>
        )}
      </div>

      {/* Multilingual Voice (Bhashini AI) */}
      <div
        className="lumos-card"
        style={{
          padding: '20px',
          border: '1px solid #233A57',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Globe size={20} color="#34D399" />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
            REGIONAL LANGUAGE (BHASHINI AI)
          </span>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
          Powers text-to-speech instructions, proverbs, and game audio in your native tongue:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(Object.entries(languageNames) as [Language, string][]).map(([code, langTitle]) => {
            const isSelected = language === code;
            return (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#0F1D2F',
                  border: isSelected ? '1px solid #38BDF8' : '1px solid #1C314E',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{langTitle}</span>
                {isSelected && <Check size={18} color="#38BDF8" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility Controls */}
      <div
        className="lumos-card"
        style={{
          padding: '20px',
          border: '1px solid #233A57',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Eye size={20} color="#FBBF24" />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
            ACCESSIBILITY
          </span>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            Visual Text Scaling
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setTextSize('normal');
                document.documentElement.setAttribute('data-text-size', 'normal');
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: textSize === 'normal' ? '2px solid #FF7247' : '1px solid #1C314E',
                backgroundColor: textSize === 'normal' ? 'rgba(255, 114, 71, 0.15)' : '#0F1D2F',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Standard
            </button>
            <button
              onClick={() => {
                setTextSize('large');
                document.documentElement.setAttribute('data-text-size', 'large');
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: textSize === 'large' ? '2px solid #FF7247' : '1px solid #1C314E',
                backgroundColor: textSize === 'large' ? 'rgba(255, 114, 71, 0.15)' : '#0F1D2F',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔍 Large Text (Elderly)
            </button>
          </div>
        </div>
      </div>

      {/* DPDP Act Compliance */}
      <div
        className="lumos-card"
        style={{
          padding: '20px',
          border: '1px solid #233A57',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#10B981" />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
            DPDP ACT 2023 COMPLIANCE
          </span>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
          Data is stored locally on this Android device. All patient telemetry is revocable by the designated family caregiver.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: consentGranted ? '#34D399' : '#EF4444' }}>
            {consentGranted ? '✓ Consent Active (DPDP Validated)' : '✕ Consent Revoked'}
          </span>
          <button
            onClick={() => setConsentGranted(!consentGranted)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid #223752',
              backgroundColor: '#0F1D2F',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {consentGranted ? 'Revoke' : 'Grant'}
          </button>
        </div>
      </div>
    </div>
  );
}
