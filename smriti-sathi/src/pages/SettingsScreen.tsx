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
  Check 
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
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
  const { state, resetOnboarding, updateAccessibility, toggleTheme } = useApp();
  const { role, logout, session } = useAuth();
  const patient = state.currentPatient;
  const isCaregiver = role === UserRole.CAREGIVER;

  // Modals state
  const [showPairingModal, setShowPairingModal] = useState(false);

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
        onBack={() => onNavigate(isCaregiver ? 'caregiver-home' : 'home')} 
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-32 space-y-6">
        {/* Patient Profile */}
        {patient && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
              <User size={18} className="text-[#10B981]" />
              Active Profile
            </h3>
            <Card className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-[var(--color-text)] truncate">{patient.name}</h4>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Age: {patient.age} • Patient (Care Recipient)</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Visual Theme (Light & Dark) */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Sun size={18} className="text-[#F59E0B]" />
            Visual Theme
          </h3>
          <Card className="p-4 sm:p-5 space-y-3">
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Choose between Daylight Mode (crisp, high-contrast light) or Midnight Mode (calm, dark navy with zero eye strain).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (state.accessibility?.theme === 'dark') toggleTheme();
                }}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all active:scale-95 ${
                  state.accessibility?.theme !== 'dark'
                    ? 'border-[#10B981] bg-[var(--color-bg-subtle)] font-bold ring-4 ring-[#10B981]/20 shadow-sm'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[#10B981]'
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
                className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all active:scale-95 ${
                  state.accessibility?.theme === 'dark'
                    ? 'border-[#10B981] bg-[var(--color-bg-subtle)] font-bold ring-4 ring-[#10B981]/20 shadow-sm'
                    : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[#10B981]'
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
            <Type size={18} className="text-[#0EA5E9]" />
            Text Size & Live Preview
          </h3>
          <Card className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-sm font-bold text-[var(--color-text)] block mb-2">Select Reading Size</span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'normal'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 ${
                    state.accessibility.textSize === 'normal'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#10B981]'
                  }`}
                >
                  <span className="text-base block">Normal</span>
                  <span className="text-xs opacity-70">18px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'large'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 ${
                    state.accessibility.textSize === 'large'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#10B981]'
                  }`}
                >
                  <span className="text-lg block font-semibold">Large</span>
                  <span className="text-xs opacity-70">22px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'extra-large'})}
                  className={`py-3 px-2 rounded-2xl text-center border-2 transition-all active:scale-95 ${
                    state.accessibility.textSize === 'extra-large'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] font-bold shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#10B981]'
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
              } ${state.accessibility.highContrast ? 'text-yellow-400' : 'text-[#10B981]'}`}>
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
            <Volume2 size={18} className="text-[#10B981]" />
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
              <BookOpen size={18} className="text-[#A855F7]" />
              Personal Memories
            </h3>
            <Card className="p-4 sm:p-5">
              <button
                onClick={() => onNavigate('memory-book')}
                className="w-full flex items-center justify-between py-2 min-h-[48px]"
              >
                <div className="text-left">
                  <span className="text-base font-bold text-[var(--color-text)]">Manage Memory Book</span>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">View family stories and cherished pictures</p>
                </div>
                <ChevronRight size={20} className="text-[var(--color-text-muted)]" />
              </button>
            </Card>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <Globe size={18} className="text-[#1565C0]" />
            Multilingual Language
          </h3>
          <Card className="p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">Current App Language</span>
                <span className="text-xs sm:text-sm text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full font-bold border border-[#10B981]/30">
                  {LANGUAGES.find(l => l.code === state.interfaceLanguage)?.name || 'English'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                      lang.code === state.interfaceLanguage
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[#10B981]'
                    }`}
                  >
                    {lang.nativeName}
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
              <Smartphone size={18} className="text-[#10B981]" />
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
                  className="px-4 py-2.5 bg-[#10B981]/15 text-[#10B981] rounded-xl font-bold border border-[#10B981]/30 hover:bg-[#10B981]/25 transition-colors text-sm"
                >
                  Pair Device
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Reset Setup */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <RefreshCw size={18} className="text-[#E65100]" />
            Onboarding & Setup
          </h3>
          <Card className="p-4 sm:p-5">
            <button
              type="button"
              onClick={() => {
                if (confirm('This will restart the initial onboarding setup flow. Continue?')) {
                  resetOnboarding();
                }
              }}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-bold text-[var(--color-text)]">Re-run Initial Setup</span>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Reconfigure profile name, age, and language</p>
              </div>
              <RefreshCw size={18} className="text-[#E65100]" />
            </button>
          </Card>
        </div>

        {/* Developer Diagnostics (Caregiver role only) */}
        {isCaregiver && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
              <Shield size={18} className="text-[#A855F7]" />
              Caregiver & Clinical Diagnostics
            </h3>
            <Card className="p-4 sm:p-5 space-y-2 divide-y divide-[var(--color-border)]">
              <button
                onClick={() => onNavigate('adaptive-tests')}
                className="w-full flex items-center justify-between py-3 min-h-[44px]"
              >
                <div className="text-left">
                  <span className="text-sm font-bold text-[var(--color-text)]">Adaptive Engine Diagnostics</span>
                  <p className="text-xs text-[var(--color-text-secondary)]">Verify algorithm difficulty adjustments</p>
                </div>
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>

              <button
                onClick={() => onNavigate('database-tests')}
                className="w-full flex items-center justify-between py-3 min-h-[44px]"
              >
                <div className="text-left">
                  <span className="text-sm font-bold text-[var(--color-text)]">IndexedDB Storage Verification</span>
                  <p className="text-xs text-[var(--color-text-secondary)]">Check offline-first persistence tables</p>
                </div>
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>

              <button
                onClick={() => onNavigate('reminder-tests')}
                className="w-full flex items-center justify-between py-3 min-h-[44px]"
              >
                <div className="text-left">
                  <span className="text-sm font-bold text-[var(--color-text)]">Reminder & Notification Test Suite</span>
                  <p className="text-xs text-[var(--color-text-secondary)]">Trigger background alarm chime and notifications</p>
                </div>
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>

              <button
                onClick={() => onNavigate('sync-tests')}
                className="w-full flex items-center justify-between py-3 min-h-[44px]"
              >
                <div className="text-left">
                  <span className="text-sm font-bold text-[var(--color-text)]">Cloud Telemetry & Sync Tests</span>
                  <p className="text-xs text-[var(--color-text-secondary)]">Verify sync engine with cloud server</p>
                </div>
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>
            </Card>
          </div>
        )}

        {/* Application Updates */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] px-1 flex items-center gap-2">
            <RefreshCw size={18} className="text-[#10B981]" />
            Application Updates
          </h3>
          <Card className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-[var(--color-text)]">Current Installed Version</p>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                  Smriti Sathi {CURRENT_APP_VERSION} (Build 250)
                </p>
              </div>
              <span className="px-3 py-1 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded-full text-xs font-bold">
                Production Release
              </span>
            </div>

            {updateResult?.hasUpdate ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl text-[#10B981] text-sm font-bold">
                  New Version Available: {updateResult.latestVersion}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = updateResult.downloadUrl;
                    link.download = `SmritiSathi-${updateResult.latestVersion}.apk`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-4 rounded-2xl font-bold shadow-md transition-all active:scale-95"
                >
                  <RefreshCw size={18} />
                  <span>Download & Install {updateResult.latestVersion}</span>
                </button>
              </div>
            ) : (
              <div>
                {updateCheckedOnce && (
                  <div className="mb-3 text-sm text-[#10B981] font-bold flex items-center gap-2">
                    <Check size={16} />
                    <span>Your application is up to date with version {CURRENT_APP_VERSION}.</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleCheckUpdates}
                  disabled={checkingUpdate}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-bg-subtle)] text-[var(--color-text)] py-3 px-4 rounded-2xl font-bold border border-[var(--color-border)] hover:border-[#10B981] transition-all disabled:opacity-50"
                >
                  <RefreshCw size={18} className={checkingUpdate ? 'animate-spin' : ''} />
                  <span>{checkingUpdate ? 'Checking Server...' : 'Check for Updates'}</span>
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Switch Profile / Sign Out (UNIVERSAL ACCESS FOR BOTH PATIENT & CAREGIVER) */}
        <div className="space-y-3">
          <Card className="p-4 sm:p-5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 min-h-[52px] bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/30 rounded-2xl font-bold text-base transition-colors active:scale-95"
            >
              <LogOut size={20} />
              <span>Sign Out / Switch Profile</span>
            </button>
            <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
              Returns to the account selector screen. No data is lost.
            </p>
          </Card>
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate(isCaregiver ? 'caregiver-home' : 'home')}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-base hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
      
      {showPairingModal && (
        <FamilyPairingModal
          isOpen={showPairingModal}
          onClose={() => setShowPairingModal(false)}
        />
      )}
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
    <div 
      className="flex items-center justify-between py-1 cursor-pointer" 
      onClick={() => onChange?.(!value)}
    >
      <div className="flex-1 mr-4">
        <span className="text-base text-[var(--color-text)] font-bold">{label}</span>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>
      </div>
      <div className={`w-13 h-7 rounded-full relative transition-colors ${
        value ? 'bg-[#10B981]' : 'bg-[var(--color-border)]'
      }`}>
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          value ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </div>
    </div>
  );
}
