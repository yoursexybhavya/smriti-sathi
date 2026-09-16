import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Settings as SettingsIcon, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { languageNames, type Language } from '../i18n/translations';

export function TopHeader() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { patient } = usePatient();
  const { speak } = useVoice();

  const cycleLanguage = () => {
    const langs: Language[] = ['as', 'en', 'brx', 'mni'];
    const currentIndex = langs.indexOf(language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    setLanguage(nextLang);
    speak(languageNames[nextLang], nextLang);
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 8px 20px',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Left streak & LPI pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Streak Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#132235',
            border: '1px solid #203650',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 14px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
          title="Daily Active Streak"
        >
          <Flame size={18} color="#38BDF8" fill="#38BDF8" />
          <span>3</span>
        </div>

        {/* LPI / Cognitive Index Pill */}
        <div
          onClick={() => navigate('/caregiver')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#132235',
            border: '1px solid #203650',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 14px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 700,
            color: '#FBBF24',
            cursor: 'pointer',
          }}
          title="Cognitive Performance Index (CPI)"
        >
          <Zap size={18} color="#FBBF24" fill="#FBBF24" />
          <span>785</span>
        </div>
      </div>

      {/* Right Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Multilingual quick-switch pill */}
        <button
          onClick={cycleLanguage}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#132235',
            border: '1px solid #203650',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#34D399',
            cursor: 'pointer',
          }}
          title="Switch Language (Bhashini AI)"
        >
          <span>🗣️</span>
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Audio helper button */}
        <button
          onClick={() => speak(`Welcome back ${patient?.name || 'Krishna'}. Today's brain workout is ready.`)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Voice Guide"
        >
          <Volume2 size={22} />
        </button>

        {/* Settings gear */}
        <button
          onClick={() => navigate('/settings')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Settings"
        >
          <SettingsIcon size={24} />
        </button>
      </div>
    </header>
  );
}
