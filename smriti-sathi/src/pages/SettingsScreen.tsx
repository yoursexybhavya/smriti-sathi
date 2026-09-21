import { 
  ArrowLeft, 
  Globe, 
  Volume2, 
  Type, 
  Bell, 
  Shield, 
  Database, 
  Smartphone, 
  Info, 
  User, 
  RefreshCw, 
  ChevronRight, 
  BookOpen, 
  LogOut, 
  Sun, 
  Moon, 
  Check,
  Users
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import LargeButton from '../components/LargeButton';
import RoleAndProfileModal from '../components/RoleAndProfileModal';
import { LANGUAGES, APP } from '../core/constants/app';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/Role';
import { useState } from 'react';
import { checkAppUpdates, CURRENT_APP_VERSION, type UpdateInfo } from '../components/UpdateChecker';
import { FamilyPairingModal } from '../components/FamilyPairingModal';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function SettingsScreen({ onNavigate, isOnline = true }: SettingsScreenProps) {
  const { state, resetOnboarding, updateAccessibility, updateLanguage, toggleTheme } = useApp();
  const { role, logout, session } = useAuth();
  const patient = state.currentPatient;
  const isCaregiver = role === UserRole.CAREGIVER;

  // Modals state
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showRoleProfileModal, setShowRoleProfileModal] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'role' | 'profile'>('profile');

  // Update check states
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
  const [updateCheckedOnce, setUpdateCheckedOnce] = useState(false);

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

  // Caregiver Portal PIN state
  const [caregiverUnlocked, setCaregiverUnlocked] = useState(isCaregiver);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleUnlockCaregiver = () => {
    if (pin === '1234') {
      setCaregiverUnlocked(true);
      setShowPinInput(false);
      setPin('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Default is 1234.');
    }
  };

  const handleLockCaregiver = () => {
    setCaregiverUnlocked(false);
    setShowPinInput(false);
    setPin('');
    setPinError('');
  };

  const handleLogout = async () => {
    if (confirm('Switch account / sign out to profile selection screen?')) {
      await logout();
    }
  };

  return (
    <>
      <AppHeader 
        title="Settings" 
        subtitle="Customize display, language, and accessibility" 
        isOnline={isOnline} 
        showBack 
        onBack={() => onNavigate(caregiverUnlocked ? 'caregiver-home' : 'home')} 
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-44 sm:pb-52 space-y-6">
        {/* Patient Profile */}
        {patient && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                Active Profile & Role
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {role === UserRole.PATIENT ? 'Elder Patient View' : 'Caregiver View'}
              </span>
            </div>
            <Card className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-3xl flex-shrink-0 shadow-xs">
                  <span>{patient.profileImage || '👵'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-[var(--color-text)] truncate">{patient.name}</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Age: {patient.age} • Care Recipient Profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab('profile');
                    setShowRoleProfileModal(true);
                  }}
                  className="w-full py-3 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px] cursor-pointer"
                >
                  <User size={16} />
                  <span>✏️ Edit Name & Age</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab('role');
                    setShowRoleProfileModal(true);
                  }}
                  className="w-full py-3 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px] cursor-pointer"
                >
                  <Users size={16} />
                  <span>👥 Switch Role (Elder, Son, Doctor)</span>
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Visual Theme (Light & Dark) */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Sun size={18} className="text-amber-500" />
            Visual Theme
          </h3>
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Choose between Daylight Mode (crisp light canvas) or Midnight Mode (calm, dark slate with zero eye strain).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (state.accessibility?.theme === 'dark') toggleTheme();
                }}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all active:scale-95 cursor-pointer min-h-[56px] ${
                  state.accessibility?.theme !== 'dark'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Sun size={22} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm sm:text-base font-bold text-[var(--color-text)] truncate">Light Theme</div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">Daylight Slate</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (state.accessibility?.theme !== 'dark') toggleTheme();
                }}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all active:scale-95 cursor-pointer min-h-[56px] ${
                  state.accessibility?.theme === 'dark'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center flex-shrink-0">
                  <Moon size={22} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm sm:text-base font-bold text-[var(--color-text)] truncate">Dark Theme</div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">Midnight Navy</div>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Display & Text Size Scaling with Live Preview */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Type size={18} className="text-indigo-600 dark:text-indigo-400" />
            Text Size & Live Preview
          </h3>
          <Card className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-sm font-bold text-[var(--color-text)] block mb-2">Select Reading Size</span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'normal'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 cursor-pointer min-h-[56px] ${
                    state.accessibility.textSize === 'normal'
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-indigo-400'
                  }`}
                >
                  <span className="text-base block">Normal</span>
                  <span className="text-xs opacity-70">18px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'large'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 cursor-pointer min-h-[56px] ${
                    state.accessibility.textSize === 'large'
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-indigo-400'
                  }`}
                >
                  <span className="text-lg block font-semibold">Large</span>
                  <span className="text-xs opacity-70">22px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'extra-large'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 cursor-pointer min-h-[56px] ${
                    state.accessibility.textSize === 'extra-large'
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-indigo-400'
                  }`}
                >
                  <span className="text-xl block font-bold">Extra Large</span>
                  <span className="text-xs opacity-70">26px</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
              state.accessibility.highContrast
                ? 'bg-black border-yellow-400 text-yellow-300 shadow-md'
                : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text)]'
            }`}>
              <div className="flex items-center justify-between mb-2 opacity-80 text-xs font-bold uppercase tracking-wider">
                <span>Live Interactive Preview</span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)]">
                  {state.accessibility.textSize.toUpperCase()} • {state.accessibility.highContrast ? 'WCAG AAA' : 'STANDARD'}
                </span>
              </div>
              <p className={`font-bold transition-all ${
                state.accessibility.textSize === 'extra-large'
                  ? 'text-2xl'
                  : state.accessibility.textSize === 'large'
                  ? 'text-xl'
                  : 'text-lg'
              } ${state.accessibility.highContrast ? 'text-yellow-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {patient ? `Good Day, ${patient.name}!` : 'Smriti Sathi Memory Care'}
              </p>
              <p className={`mt-1.5 opacity-90 transition-all leading-relaxed ${
                state.accessibility.textSize === 'extra-large'
                  ? 'text-lg'
                  : state.accessibility.textSize === 'large'
                  ? 'text-base'
                  : 'text-sm'
              }`}>
                This text immediately scales across all games, daily reminders, and buttons in real-time.
              </p>
            </div>
          </Card>
        </div>

        {/* Voice & Accessibility Toggles */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Volume2 size={18} className="text-indigo-600 dark:text-indigo-400" />
            Voice Guidance & High Contrast
          </h3>
          <Card className="p-4 sm:p-5 space-y-4">
            <SettingToggle
              label="Spoken Voice Prompts"
              description="Read reminders and activity instructions aloud"
              value={state.accessibility.voiceGuidance}
              onChange={(v) => updateAccessibility({...state.accessibility, voiceGuidance: v})}
            />
            <SettingToggle
              label="High Contrast Display"
              description="Deep black & golden yellow WCAG AAA contrast"
              value={state.accessibility.highContrast}
              onChange={(v) => updateAccessibility({...state.accessibility, highContrast: v})}
            />
          </Card>
        </div>

        {/* Memory Book */}
        {!isCaregiver && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
              Personal Memories
            </h3>
            <Card className="p-4 sm:p-5">
              <button
                onClick={() => onNavigate('memory-book-viewer')}
                className="w-full flex items-center justify-between py-2 min-h-[48px] cursor-pointer"
              >
                <div className="text-left">
                  <span className="text-base font-bold text-[var(--color-text)]">View Personal Memory Book</span>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Explore family stories and cherished pictures</p>
                </div>
                <ChevronRight size={20} className="text-[var(--color-text-muted)]" />
              </button>
            </Card>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
            Multilingual Language
          </h3>
          <Card className="p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">Current App Language</span>
                <span className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full font-bold border border-indigo-200 dark:border-indigo-800">
                  {LANGUAGES.find(l => l.code === state.interfaceLanguage)?.name || 'English'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateLanguage(lang.code)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer min-h-[48px] ${
                      lang.code === state.interfaceLanguage
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                        : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-indigo-400'
                    }`}
                  >
                    {lang.nativeName} ({lang.name})
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Family Pairing */}
        {!isCaregiver && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
              <Smartphone size={18} className="text-indigo-600 dark:text-indigo-400" />
              Caregiver Connection
            </h3>
            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-[var(--color-text)]">Link with Caregiver</p>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">Sync reminders and activity updates securely</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPairingModal(true)}
                  className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-sm min-h-[44px] cursor-pointer"
                >
                  Pair Device
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Caregiver Administration Portal (PIN 1234) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
              <Shield size={18} className="text-indigo-600 dark:text-indigo-400" />
              Caregiver & Family Portal
            </h3>
            {caregiverUnlocked && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Unlocked (Caregiver Active)
              </span>
            )}
          </div>

          <Card className="p-4 sm:p-5 space-y-4">
            {caregiverUnlocked ? (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                      Caregiver Management Active
                    </p>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300">
                      Family setup, clinical telemetry, and diagnostics unlocked
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLockCaregiver}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 transition-colors shadow-xs cursor-pointer min-h-[40px]"
                  >
                    Lock Elder Mode
                  </button>
                </div>

                {/* Caregiver Dashboard Link */}
                <button
                  type="button"
                  onClick={() => onNavigate('caregiver-home')}
                  className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                >
                  <div>
                    <span className="text-base font-bold text-[var(--color-text)] block">Open Caregiver Dashboard</span>
                    <p className="text-xs text-[var(--color-text-secondary)]">Care circle monitoring, safety overview, and clinical logs</p>
                  </div>
                  <ChevronRight size={20} className="text-[var(--color-text-muted)]" />
                </button>

                {/* Re-run setup */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('This will restart the initial onboarding setup flow. Continue?')) {
                      resetOnboarding();
                    }
                  }}
                  className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                >
                  <div>
                    <span className="text-base font-bold text-[var(--color-text)] block">Re-run Initial Setup Wizard</span>
                    <p className="text-xs text-[var(--color-text-secondary)]">Reconfigure parent's profile name, age, and language</p>
                  </div>
                  <RefreshCw size={18} className="text-indigo-600 dark:text-indigo-400" />
                </button>

                {/* Diagnostics List */}
                <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-1">
                    System & Engine Diagnostics
                  </p>
                  <button
                    onClick={() => onNavigate('adaptive-tests')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="text-sm font-bold text-[var(--color-text)]">Adaptive Engine Diagnostics</span>
                      <p className="text-xs text-[var(--color-text-secondary)]">Verify algorithm difficulty adjustments</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                  </button>

                  <button
                    onClick={() => onNavigate('database-tests')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="text-sm font-bold text-[var(--color-text)]">IndexedDB Storage Verification</span>
                      <p className="text-xs text-[var(--color-text-secondary)]">Check offline-first persistence tables</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                  </button>

                  <button
                    onClick={() => onNavigate('reminder-tests')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="text-sm font-bold text-[var(--color-text)]">Reminder & Notification Test Suite</span>
                      <p className="text-xs text-[var(--color-text-secondary)]">Trigger background alarm chime and notifications</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                  </button>

                  <button
                    onClick={() => onNavigate('sync-tests')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="text-sm font-bold text-[var(--color-text)]">Cloud Telemetry & Sync Tests</span>
                      <p className="text-xs text-[var(--color-text-secondary)]">Verify sync engine with cloud server</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                  </button>

                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer text-left"
                    >
                      <div>
                        <span className="text-sm font-bold">Sign Out / Switch Profile</span>
                        <p className="text-xs text-[var(--color-text-secondary)]">Caregiver administrative sign out</p>
                      </div>
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : showPinInput ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--color-text)]">Enter Caregiver PIN (Default: 1234)</span>
                  <button
                    type="button"
                    onClick={() => { setShowPinInput(false); setPin(''); setPinError(''); }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold ${
                        pin.length > idx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-subtle)]'
                      }`}
                    >
                      {pin.length > idx ? '●' : ''}
                    </div>
                  ))}
                </div>

                {pinError && (
                  <p className="text-xs font-bold text-red-500 text-center">{pinError}</p>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => {
                        if (pin.length < 4) {
                          const nextPin = pin + digit.toString();
                          setPin(nextPin);
                          setPinError('');
                          if (nextPin.length === 4) {
                            if (nextPin === '1234') {
                              setCaregiverUnlocked(true);
                              setShowPinInput(false);
                              setPin('');
                            } else {
                              setPinError('Incorrect PIN. Default is 1234.');
                            }
                          }
                        }
                      }}
                      className="h-12 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] hover:border-indigo-400 text-base font-bold text-[var(--color-text)] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setPin(''); setPinError(''); }}
                    className="h-12 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (pin.length < 4) {
                        const nextPin = pin + '0';
                        setPin(nextPin);
                        setPinError('');
                        if (nextPin.length === 4) {
                          if (nextPin === '1234') {
                            setCaregiverUnlocked(true);
                            setShowPinInput(false);
                            setPin('');
                          } else {
                            setPinError('Incorrect PIN. Default is 1234.');
                          }
                        }
                      }
                    }}
                    className="h-12 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] hover:border-indigo-400 text-base font-bold text-[var(--color-text)] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPin(p => p.slice(0, -1)); setPinError(''); }}
                    className="h-12 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)] text-base font-bold text-[var(--color-text-muted)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    aria-label="Backspace"
                  >
                    ⌫
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-[var(--color-text)]">Caregiver Access Portal</p>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                    Enter security PIN (1234) to manage clinical setup, reset wizard, and view telemetry
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinInput(true)}
                  className="px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-sm font-bold transition-all active:scale-95 cursor-pointer min-h-[48px] flex items-center gap-2"
                >
                  <Shield size={16} />
                  <span>Unlock Caregiver Tools</span>
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <LargeButton
            variant="secondary"
            onPress={() => onNavigate(caregiverUnlocked ? 'caregiver-home' : 'home')}
            size="lg"
          >
            Back to Home Dashboard
          </LargeButton>
        </div>
      </div>
      
      {showPairingModal && (
        <FamilyPairingModal
          isOpen={showPairingModal}
          onClose={() => setShowPairingModal(false)}
        />
      )}

      <RoleAndProfileModal
        isOpen={showRoleProfileModal}
        onClose={() => setShowRoleProfileModal(false)}
        initialTab={modalInitialTab}
        onNavigate={onNavigate}
      />
    </>
  );
}

function SettingToggle({ 
  label, 
  description, 
  value = false, 
  onChange 
}: { 
  label: string; 
  description: string; 
  value?: boolean; 
  onChange?: (val: boolean) => void 
}) {
  return (
    <button 
      type="button"
      className="w-full flex items-center justify-between py-2 min-h-[52px] cursor-pointer text-left focus:outline-none" 
      onClick={() => onChange?.(!value)}
      aria-checked={value}
      role="switch"
    >
      <div className="flex-1 mr-4">
        <span className="text-base text-[var(--color-text)] font-bold block">{label}</span>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">{description}</p>
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 ${
        value ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'
      }`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          value ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </div>
    </button>
  );
}
