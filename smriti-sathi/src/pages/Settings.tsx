import { useState, useEffect } from 'react';
import { User, Globe, Eye, ShieldCheck, Check, Edit3, Users, Download, RefreshCw, Sparkles, Trash2, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { languageNames, type Language } from '../i18n/translations';
import { ProfileSwitcherModal } from '../components/ProfileSwitcherModal';
import { FamilyPairingModal } from '../components/FamilyPairingModal';
import { checkAppUpdates, CURRENT_APP_VERSION, type UpdateInfo } from '../components/UpdateChecker';

export function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { patient, updatePatient, clearAllData } = usePatient();
  const { speak } = useVoice();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [consentGranted, setConsentGranted] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);

  // Update check states
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
  const [updateCheckedOnce, setUpdateCheckedOnce] = useState(false);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setAge(patient.age.toString());
    }
  }, [patient]);

  const handleSaveProfile = async () => {
    if (!name.trim() || !age || !patient?.id) return;
    const parsedAge = parseInt(age) || 70;
    await updatePatient(patient.id, { name: name.trim(), age: parsedAge });
    setIsEditing(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    speak(languageNames[lang], lang);
  };

  const handleCheckUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateResult(null);
    try {
      const res = await checkAppUpdates();
      setUpdateResult(res);
      setUpdateCheckedOnce(true);
    } catch {
      setUpdateResult({ hasUpdate: false, latestVersion: CURRENT_APP_VERSION, downloadUrl: '' });
      setUpdateCheckedOnce(true);
    } finally {
      setCheckingUpdate(false);
    }
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
          {t.settings}
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          {t.appTagline}
        </p>
      </div>

      {/* Responsive Grid of Setting Cards */}
      <div className="settings-grid">
        {/* Elder Profile Card */}
        <div
          className="lumos-card"
          style={{
            padding: '20px',
            border: '1px solid #233A57',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#38BDF8" />
              <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
                {t.elderProfile}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowProfileModal(true)}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid #38BDF8',
                  borderRadius: 'var(--radius-pill)',
                  color: '#38BDF8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Users size={14} />
                <span>{t.switchProfile}</span>
              </button>
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
                    padding: '4px 6px',
                  }}
                >
                  <Edit3 size={15} />
                  <span>{t.edit}</span>
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A9C4', marginBottom: '4px' }}>
                  {t.elderNameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #223752',
                    backgroundColor: '#0F1D2F',
                    color: '#FFFFFF',
                    fontSize: '15px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A9C4', marginBottom: '4px' }}>
                  {t.ageLabel}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #223752',
                    backgroundColor: '#0F1D2F',
                    color: '#FFFFFF',
                    fontSize: '15px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  className="btn-primary-lumos"
                  onClick={handleSaveProfile}
                  style={{ flex: 1, minHeight: '46px', padding: '10px', fontSize: '15px' }}
                >
                  {t.saveProfile}
                </button>
                <button
                  className="btn-secondary-lumos"
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1, minHeight: '46px', padding: '10px', fontSize: '15px' }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: '#FFFFFF' }}>
                {patient?.name || 'Krishna'}
              </div>
              <div style={{ fontSize: '13px', color: '#94A9C4', marginTop: '4px', lineHeight: 1.4 }}>
                {t.ageLabel}: {patient?.age || 72} &bull; {t.registeredCare}
              </div>
            </div>
          )}
        </div>

        {/* Family Account & Caregiver Pairing Card */}
        <div
          className="lumos-card"
          style={{
            padding: '20px',
            border: '1px solid #233A57',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} color="#38BDF8" />
              <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
                {t.familyAccountTitle}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
              1-TAP PAIR
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
            {t.familyAccountDesc}
          </p>

          <button
            onClick={() => setShowPairingModal(true)}
            className="btn-secondary-lumos"
            style={{
              width: '100%',
              padding: '12px',
              minHeight: '48px',
              fontSize: '14px',
              borderColor: '#38BDF8',
              color: '#38BDF8',
              backgroundColor: '#122237',
            }}
          >
            <span>👨‍👩‍👧</span>
            <span>{t.pairAccountBtn} / Sync Status</span>
          </button>
        </div>

        {/* Regional Language (Bhashini AI) Card */}
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
              {t.regionalLanguage}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
            {t.regionalLanguageDesc}
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

        {/* Accessibility Controls Card */}
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
              {t.accessibility}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              {t.textScaling}
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
                {t.standardText}
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
                {t.largeText}
              </button>
            </div>
          </div>
        </div>

        {/* DPDP Act Compliance Card */}
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
              {t.dpdpCompliance}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {t.dpdpDesc}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: consentGranted ? '#34D399' : '#EF4444' }}>
              {consentGranted ? t.consentActive : t.consentRevoked}
            </span>
            <button
              onClick={() => setConsentGranted(!consentGranted)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid #223752',
                backgroundColor: '#0F1D2F',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {consentGranted ? t.revoke : t.grant}
            </button>
          </div>
        </div>

        {/* Application Updates & OTA Card */}
        <div
          className="lumos-card"
          style={{
            padding: '20px',
            border: '1px solid #233A57',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="#A855F7" />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#94A9C4', textTransform: 'uppercase' }}>
              {t.appUpdates}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {t.version}: <strong style={{ color: '#FFFFFF' }}>{CURRENT_APP_VERSION}</strong> &bull; Offline PWA & Native Android APK
          </p>

          {updateResult?.hasUpdate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: 'var(--radius-sm)', color: '#34D399', fontSize: '13px', fontWeight: 600 }}>
                {t.updateAvailableBanner} ({updateResult.latestVersion})
              </div>
              <a
                href={updateResult.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-lumos"
                style={{ textDecoration: 'none', padding: '12px', minHeight: '46px', fontSize: '14px', backgroundColor: '#10B981' }}
              >
                <Download size={18} />
                <span>{t.downloadUpdate}</span>
              </a>
            </div>
          ) : (
            <div>
              {updateCheckedOnce && (
                <div style={{ fontSize: '13px', color: '#34D399', marginBottom: '10px', fontWeight: 600 }}>
                  {t.upToDate}
                </div>
              )}
              <button
                onClick={handleCheckUpdates}
                disabled={checkingUpdate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid #2B466B',
                  backgroundColor: '#132338',
                  color: '#38BDF8',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: checkingUpdate ? 'not-allowed' : 'pointer',
                }}
              >
                <RefreshCw size={15} className={checkingUpdate ? 'spin' : ''} />
                <span>{checkingUpdate ? t.checkingUpdates : t.checkForUpdates}</span>
              </button>
            </div>
          )}
        </div>

        {/* Zero-Baseline / Reset All Activity & Scores Card */}
        <div
          className="lumos-card"
          style={{
            padding: '20px',
            border: '1px solid #7F1D1D',
            backgroundColor: '#161118',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Trash2 size={20} color="#EF4444" />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.6px', color: '#FCA5A5', textTransform: 'uppercase' }}>
              {t.resetAllData}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {t.resetAllDataDesc}
          </p>

          <button
            onClick={async () => {
              if (window.confirm(t.resetDataConfirm)) {
                await clearAllData();
                alert(t.resetDataSuccess);
              }
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid #EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Trash2 size={15} />
            <span>{t.resetAllData}</span>
          </button>
        </div>
      </div>

      {/* Account Switcher Modal */}
      <ProfileSwitcherModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Family Account Pairing Modal */}
      <FamilyPairingModal
        isOpen={showPairingModal}
        onClose={() => setShowPairingModal(false)}
      />
    </div>
  );
}
