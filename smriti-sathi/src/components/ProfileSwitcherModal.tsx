import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { usePatient } from '../contexts/PatientContext';
import { useLanguage } from '../contexts/LanguageContext';
import { languageNames, type Language } from '../i18n/translations';

interface ProfileSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSwitcherModal({ isOpen, onClose }: ProfileSwitcherModalProps) {
  const { patient, patients, selectPatient, createPatient } = usePatient();
  const { t, setLanguage } = useLanguage();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newLang, setNewLang] = useState<Language>('as');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelect = async (id: number, lang: string) => {
    await selectPatient(id);
    if (lang && (lang === 'en' || lang === 'as' || lang === 'brx' || lang === 'mni')) {
      setLanguage(lang as Language);
    }
    onClose();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMsg('Please enter a name');
      return;
    }
    const ageNum = parseInt(newAge) || 70;
    const created = await createPatient(newName.trim(), ageNum, newLang);
    setLanguage(newLang);
    setIsAdding(false);
    setNewName('');
    setNewAge('');
    setErrorMsg('');
    if (created.id) {
      await selectPatient(created.id);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0E1C2D',
          border: '1px solid #284469',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: '#FFFFFF' }}>
              {isAdding ? t.createNewProfile : t.elderProfile}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {isAdding ? 'Register another family elder or ASHA client' : t.switchProfile}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A9C4',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {!isAdding ? (
          <div>
            {/* List of Patients */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {patients.map((p) => {
                const isActive = patient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => p.id && handleSelect(p.id, p.language)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : '#15253B',
                      border: isActive ? '2px solid #38BDF8' : '1px solid #223752',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? '#0284C7' : '#1F344F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '18px',
                        }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94A9C4', marginTop: '2px', display: 'flex', gap: '10px' }}>
                          <span>Age: {p.age}</span>
                          <span>&bull;</span>
                          <span style={{ color: '#34D399', fontWeight: 600 }}>
                            {languageNames[p.language as Language] || p.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#38BDF8',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Elder Button */}
            <button
              onClick={() => setIsAdding(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#172A43',
                border: '1px dashed #38BDF8',
                color: '#38BDF8',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={20} />
              <span>{t.addProfile}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div style={{ color: '#EF4444', fontSize: '13px', padding: '8px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A9C4', marginBottom: '6px', fontWeight: 600 }}>
                {t.elderNameLabel} *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Baa / Deuta / Grandfather"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #284469',
                  backgroundColor: '#122033',
                  color: '#FFFFFF',
                  fontSize: '15px',
                }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A9C4', marginBottom: '6px', fontWeight: 600 }}>
                {t.ageLabel}
              </label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                placeholder="e.g. 74"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #284469',
                  backgroundColor: '#122033',
                  color: '#FFFFFF',
                  fontSize: '15px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A9C4', marginBottom: '6px', fontWeight: 600 }}>
                {t.nativeLanguageLabel}
              </label>
              <select
                value={newLang}
                onChange={(e) => setNewLang(e.target.value as Language)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #284469',
                  backgroundColor: '#122033',
                  color: '#FFFFFF',
                  fontSize: '15px',
                }}
              >
                {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
                  <option key={code} value={code} style={{ backgroundColor: '#122033', color: '#FFFFFF' }}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn-primary-lumos"
                style={{ flex: 1, padding: '12px', minHeight: '48px' }}
              >
                {t.saveProfile}
              </button>
              <button
                type="button"
                className="btn-secondary-lumos"
                onClick={() => setIsAdding(false)}
                style={{ flex: 1, padding: '12px', minHeight: '48px' }}
              >
                {t.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
