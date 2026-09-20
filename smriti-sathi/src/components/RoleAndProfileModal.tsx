import { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Shield, 
  HeartHandshake, 
  X, 
  Check, 
  Sparkles, 
  RefreshCw, 
  LogOut, 
  Lock,
  ChevronRight,
  Pill,
  Droplets,
  Activity,
  Calendar
} from 'lucide-react';
import { useApp, PatientProfile } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/Role';
import { DEFAULT_USERS } from '../services/auth/AuthService';

interface RoleAndProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'role' | 'profile';
  onNavigate?: (screen: string) => void;
}

export default function RoleAndProfileModal({
  isOpen,
  onClose,
  initialTab = 'profile',
  onNavigate,
}: RoleAndProfileModalProps) {
  const { state, updatePatient, resetOnboarding } = useApp();
  const { session, switchRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'role' | 'profile'>(initialTab);

  // Profile form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('72');
  const [selectedAvatar, setSelectedAvatar] = useState('👵');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // PIN verification state for caregiver/doctor switch
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({
    caregiver_primary: '1234',
    asha_worker: '0000',
  });
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (state.currentPatient) {
      setName(state.currentPatient.name || 'Kamala Baa');
      setAge(state.currentPatient.age ? String(state.currentPatient.age) : '72');
      if (state.currentPatient.profileImage) {
        setSelectedAvatar(state.currentPatient.profileImage);
      }
    }
  }, [state.currentPatient, isOpen]);

  if (!isOpen) return null;

  const currentUserId = session?.userId || 'patient_primary';

  const avatarOptions = [
    { emoji: '👵', label: 'Kamala Baa', assamese: 'কমলা বা', defaultAge: '72' },
    { emoji: '👴', label: 'Deka Koka', assamese: 'ডেকা ককা', defaultAge: '76' },
    { emoji: '🌸', label: 'Aai', assamese: 'আই', defaultAge: '68' },
    { emoji: '🌿', label: 'Bapu', assamese: 'বাপু', defaultAge: '70' },
  ];

  const allAvatarEmojis = ['👵', '👴', '🌸', '🌿', '🌺', '🌻', '🧓', '🕊️', '☀️', '🪴'];

  const selectPreset = (preset: typeof avatarOptions[0]) => {
    setSelectedAvatar(preset.emoji);
    setName(preset.label);
    setAge(preset.defaultAge);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated: PatientProfile = {
        id: state.currentPatient?.id || '1',
        name: name.trim(),
        age: parseInt(age, 10) || 72,
        preferredLanguage: state.currentPatient?.preferredLanguage || 'as',
        profileImage: selectedAvatar,
        dailyRoutine: state.currentPatient?.dailyRoutine || ['morning', 'afternoon'],
        reminderPreferences: state.currentPatient?.reminderPreferences || {
          medicine: true,
          hydration: true,
          activity: true,
          appointment: true,
        },
      };

      await updatePatient(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to update patient profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    setPinError(null);
    const targetUser = DEFAULT_USERS.find(u => u.id === userId);
    if (!targetUser) return;

    // Check PIN if required
    if (targetUser.pin) {
      const enteredPin = pinInputs[userId] || '';
      if (enteredPin !== targetUser.pin) {
        setPinError(`Incorrect PIN for ${targetUser.displayName}. Default is ${targetUser.pin}`);
        return;
      }
    }

    const res = await switchRole(userId);
    if (res.success) {
      onClose();
      if (userId === 'patient_primary') {
        onNavigate?.('home');
      } else {
        onNavigate?.('caregiver-home');
      }
    } else {
      setPinError('Failed to switch role');
    }
  };

  const handleRerunOnboarding = async () => {
    if (confirm('This will restart the 4-step onboarding flow. Continue?')) {
      onClose();
      await resetOnboarding();
    }
  };

  const handleFullLogout = async () => {
    if (confirm('Log out and return to the main role selection screen?')) {
      onClose();
      await logout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-profile-title"
      >
        {/* Header with Navigation Tabs */}
        <div className="p-4 sm:p-5 border-b-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-400'
              }`}
            >
              <User size={16} />
              <span>👤 Name & Age</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('role')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'role'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-400'
              }`}
            >
              <Users size={16} />
              <span>👥 Who is Using? (Role)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] bg-[var(--color-card)] border border-[var(--color-border)] hover:border-indigo-500 transition-all active:scale-90 cursor-pointer shadow-xs"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* ============================================================== */}
          {/* TAB 1: NAME & AGE (ELDER PROFILE EDITOR) */}
          {/* ============================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Patient Profile / ব্যক্তি পৰিচয়
                  </span>
                </div>
                <h2 id="role-profile-title" className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
                  Elder Name & Age Section
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                  Update the patient's full name, age, and persona avatar. Changes apply across games, voice prompts, and notifications.
                </p>
              </div>

              {/* Quick Select Presets */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Quick Presets / দ্ৰুত বাছনি:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {avatarOptions.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => selectPreset(opt)}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all active:scale-95 text-center cursor-pointer min-h-[58px] ${
                        name === opt.label
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 shadow-xs'
                          : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-indigo-400'
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-xs font-bold text-[var(--color-text)] leading-tight">{opt.label}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">Age {opt.defaultAge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                  Select Avatar Emoji / ফটো চিহ্ন
                </label>
                <div className="flex flex-wrap gap-2">
                  {allAvatarEmojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all active:scale-90 cursor-pointer ${
                        selectedAvatar === emoji
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs scale-105'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Age Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text)] block">
                    Elder's Full Name / বয়সীয়ালজনৰ সম্পূৰ্ণ নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kamala Baa"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] text-[var(--color-text)] text-base font-semibold focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text)] block">
                    Age / বয়স (Years) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAge(prev => String(Math.max(40, (parseInt(prev, 10) || 70) - 1)))}
                      className="w-11 h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-lg font-bold text-[var(--color-text)] hover:border-indigo-500 active:scale-90 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="40"
                      max="115"
                      className="w-full px-2 py-3.5 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] text-[var(--color-text)] text-center text-base font-bold focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setAge(prev => String(Math.min(115, (parseInt(prev, 10) || 70) + 1)))}
                      className="w-11 h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-lg font-bold text-[var(--color-text)] hover:border-indigo-500 active:scale-90 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving || !name.trim()}
                  className={`w-full sm:flex-1 min-h-[54px] py-3.5 px-6 rounded-2xl font-bold text-base shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    saveSuccess
                      ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={20} />
                      <span>Changes Saved Successfully!</span>
                    </>
                  ) : isSaving ? (
                    <span>Saving Profile...</span>
                  ) : (
                    <span>Save Name & Age Changes</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRerunOnboarding}
                  className="w-full sm:w-auto min-h-[54px] px-4 py-3.5 rounded-2xl bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Run the 4-step onboarding wizard"
                >
                  <RefreshCw size={16} />
                  <span>Re-run 4-Step Setup</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: WHO IS USING? (ROLE PERSONA SELECTION) */}
          {/* ============================================================== */}
          {activeTab === 'role' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Switch App Role / ব্যৱহাৰকাৰী সলনি
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
                  Who is Using Smriti Sathi?
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                  Seamlessly toggle between the simplified elder interface, family caregiver tools, and clinical health worker logs.
                </p>
              </div>

              {pinError && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <span>⚠️ {pinError}</span>
                </div>
              )}

              {/* Role Option 1: Elderly Patient */}
              <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                currentUserId === 'patient_primary'
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                      👵
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                          Elderly Patient (Elder / Self)
                        </h3>
                        {currentUserId === 'patient_primary' && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                        Voice prompts, large high-contrast buttons, daily routine timeline, and 4 evidence-based memory games.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Zero PIN required · Friction-free
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSwitchUser('patient_primary')}
                    disabled={currentUserId === 'patient_primary'}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] cursor-pointer ${
                      currentUserId === 'patient_primary'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                    }`}
                  >
                    {currentUserId === 'patient_primary' ? '✓ Currently Using' : 'Switch to Elder View →'}
                  </button>
                </div>
              </div>

              {/* Role Option 2: Son / Family Guardian */}
              <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                currentUserId === 'caregiver_primary'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                      👨‍👦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                          Son / Family Guardian
                        </h3>
                        {currentUserId === 'caregiver_primary' && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                        Add family photos for the Memory Book, create custom quizzes, schedule daily medication alarms, and track progress.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-[var(--color-text-muted)]" />
                    <span className="text-xs text-[var(--color-text-secondary)]">PIN:</span>
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInputs['caregiver_primary'] || ''}
                      onChange={(e) => setPinInputs(prev => ({ ...prev, caregiver_primary: e.target.value }))}
                      className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                      placeholder="1234"
                    />
                    <button
                      type="button"
                      onClick={() => setPinInputs(prev => ({ ...prev, caregiver_primary: '1234' }))}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      (Fill 1234)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSwitchUser('caregiver_primary')}
                    disabled={currentUserId === 'caregiver_primary'}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] cursor-pointer ${
                      currentUserId === 'caregiver_primary'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
                    }`}
                  >
                    {currentUserId === 'caregiver_primary' ? '✓ Currently Using' : 'Switch to Guardian View →'}
                  </button>
                </div>
              </div>

              {/* Role Option 3: Doctor / ASHA Health Worker */}
              <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                currentUserId === 'asha_worker'
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                      🩺
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                          Doctor / ASHA Health Worker
                        </h3>
                        {currentUserId === 'asha_worker' && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                        Review cognitive Stability Performance Index (SPI), analyze subtle decline trends over 7+ sessions, and clinical logs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-[var(--color-text-muted)]" />
                    <span className="text-xs text-[var(--color-text-secondary)]">PIN:</span>
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInputs['asha_worker'] || ''}
                      onChange={(e) => setPinInputs(prev => ({ ...prev, asha_worker: e.target.value }))}
                      className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                      placeholder="0000"
                    />
                    <button
                      type="button"
                      onClick={() => setPinInputs(prev => ({ ...prev, asha_worker: '0000' }))}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      (Fill 0000)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSwitchUser('asha_worker')}
                    disabled={currentUserId === 'asha_worker'}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] cursor-pointer ${
                      currentUserId === 'asha_worker'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95'
                    }`}
                  >
                    {currentUserId === 'asha_worker' ? '✓ Currently Using' : 'Switch to Doctor View →'}
                  </button>
                </div>
              </div>

              {/* Logout Option */}
              <div className="pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={handleFullLogout}
                  className="w-full py-3 px-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/60 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px]"
                >
                  <LogOut size={16} />
                  <span>Log Out to Start Screen (Select Role on App Entry)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
