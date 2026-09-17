import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Settings as SettingsIcon, Volume2, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { languageNames, type Language } from '../i18n/translations';
import { ProfileSwitcherModal } from './ProfileSwitcherModal';

export function TopHeader() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { patient, stats } = usePatient();
  const { speak } = useVoice();

  const [showProfileModal, setShowProfileModal] = useState(false);

  const cycleLanguage = () => {
    const langs: Language[] = ['as', 'brx', 'mni', 'en'];
    const currentIndex = langs.indexOf(language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    setLanguage(nextLang);
    speak(languageNames[nextLang], nextLang);
  };

  const elderFirstName = patient?.name?.split(' ')[0] || 'Elder';

  return (
    <>
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
        {/* Left: Streak & CPI pills + Elder Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Active Elder Profile Pill */}
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#172A43',
              border: '1px solid #2B466B',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#38BDF8',
              cursor: 'pointer',
            }}
            title={t.switchProfile}
          >
            <Users size={16} color="#38BDF8" />
            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {elderFirstName}
            </span>
          </button>

          {/* Real Dynamic Streak Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#132235',
              border: '1px solid #203650',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 700,
              color: stats.streak > 0 ? '#38BDF8' : 'var(--color-text-secondary)',
            }}
            title={t.dailyActiveStreak}
          >
            <Flame
              size={18}
              color={stats.streak > 0 ? '#38BDF8' : '#647B99'}
              fill={stats.streak > 0 ? '#38BDF8' : 'none'}
            />
            <span>{stats.streak}</span>
          </div>

          {/* Real Dynamic CPI Pill */}
          <div
            onClick={() => navigate('/caregiver')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#132235',
              border: '1px solid #203650',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 700,
              color: stats.cpi > 0 ? '#FBBF24' : 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            title={t.cognitiveIndex}
          >
            <Zap
              size={18}
              color={stats.cpi > 0 ? '#FBBF24' : '#647B99'}
              fill={stats.cpi > 0 ? '#FBBF24' : 'none'}
            />
            <span>{stats.cpi > 0 ? stats.cpi : '0'}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            title={t.regionalLanguage}
          >
            <span>🗣️</span>
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Audio helper button */}
          <button
            onClick={() => speak(`${t.hi}, ${elderFirstName}. ${t.todaysRoutine}`)}
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
            title={t.voiceGuide}
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
            title={t.settings}
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      {/* Account Switcher Modal */}
      <ProfileSwitcherModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
