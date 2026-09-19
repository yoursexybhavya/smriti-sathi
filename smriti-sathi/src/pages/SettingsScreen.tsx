import { ArrowLeft, Globe, Volume2, Type, Bell, Shield, Database, Smartphone, Info, User, RefreshCw, ChevronRight, BookOpen, LogOut, Sparkles } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { LANGUAGES, APP } from '../core/constants/app';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/Role';
import { DemoDataService } from '../services/DemoDataService';
import { useState } from 'react';
import { checkAppUpdates, CURRENT_APP_VERSION, type UpdateInfo } from '../components/UpdateChecker';
import { FamilyPairingModal } from '../components/FamilyPairingModal';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function SettingsScreen({ onNavigate, isOnline = true }: SettingsScreenProps) {
  const { state, resetOnboarding, updateAccessibility } = useApp();
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

  return (
    <>
      <AppHeader title="Settings" subtitle="Customize your experience" isOnline={isOnline} />
      <div className="max-w-5xl mx-auto px-5 py-6 pb-28 space-y-6">
        {/* Patient Profile */}
        {patient && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
              <User size={18} className="text-[#1B5E20]" />
              Patient Profile
            </h3>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-[#1B5E20]">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#1A1A1A]">{patient.name}</h4>
                  <p className="text-sm text-[#7A7A7A]">Age: {patient.age}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Memory Book */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <BookOpen size={18} className="text-[#7B1FA2]" />
            Memory Book
          </h3>
          <Card className="p-4">
            <button
              onClick={() => onNavigate('memory-book')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Manage Memory Book</span>
                <p className="text-sm text-[#7A7A7A]">Add photos and memories</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
          </Card>
        </div>

        {/* Restart Onboarding */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <RefreshCw size={18} className="text-[#E65100]" />
            Setup
          </h3>
          <Card className="p-4">
            <button
              onClick={() => {
                if (confirm('This will restart the setup process. Continue?')) {
                  resetOnboarding();
                }
              }}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Restart Setup</span>
                <p className="text-sm text-[#7A7A7A]">Change patient, language, or preferences</p>
              </div>
              <RefreshCw size={18} className="text-[#E65100]" />
            </button>
          </Card>
        </div>

        {/* Language */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Globe size={18} className="text-[#1565C0]" />
            Language
          </h3>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base text-[#1A1A1A] font-medium">App Language</span>
                <span className="text-sm text-[#4A4A4A] bg-[#E8F5E9] px-3 py-1 rounded-full font-medium">
                  {LANGUAGES.find(l => l.code === state.interfaceLanguage)?.name || 'English'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.slice(0, 5).map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      lang.code === state.interfaceLanguage
                        ? 'bg-[#1B5E20] text-white'
                        : 'bg-[#F5F0E8] text-[#4A4A4A] hover:bg-[#E0D8CC]'
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
            <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
              <Smartphone size={18} className="text-[#10B981]" />
              Family Pairing
            </h3>
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#1A1A1A] font-medium">Link with Caregiver</p>
                  <p className="text-sm text-[#7A7A7A] mt-1">Connect your account with a family member</p>
                </div>
                <button
                  onClick={() => setShowPairingModal(true)}
                  className="px-4 py-2 bg-[#E8F5E9] text-[#1B5E20] rounded-xl font-medium border border-[#2E7D32]"
                >
                  Connect
                </button>
              </div>
            </Card>
          </div>
        )}


        {/* Voice & Accessibility */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Volume2 size={18} className="text-[#E65100]" />
            Voice & Accessibility
          </h3>
          <Card className="p-4 space-y-4">
            <SettingToggle
              label="Voice Instructions"
              description="Read instructions aloud"
              value={state.accessibility.voiceGuidance}
              onChange={(v) => updateAccessibility({...state.accessibility, voiceGuidance: v})}
            />
            <SettingToggle
              label="High Contrast"
              description="Deep black & yellow WCAG AAA contrast"
              value={state.accessibility.highContrast}
              onChange={(v) => updateAccessibility({...state.accessibility, highContrast: v})}
            />
          </Card>
        </div>

        {/* Display & Text Size */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Type size={18} className="text-[#7B1FA2]" />
            Text Size & Visual Preview
          </h3>
          <Card className="p-5 space-y-4">
            <div>
              <span className="text-base text-[#1A1A1A] font-semibold block mb-2">Select Text Size</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'normal'})}
                  className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${
                    state.accessibility.textSize === 'normal'
                      ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20] font-bold'
                      : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#4A4A4A]'
                  }`}
                >
                  <span className="text-base block">Normal</span>
                  <span className="text-xs opacity-70">18px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'large'})}
                  className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${
                    state.accessibility.textSize === 'large'
                      ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20] font-bold'
                      : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#4A4A4A]'
                  }`}
                >
                  <span className="text-lg block font-semibold">Large</span>
                  <span className="text-xs opacity-70">24px</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessibility({...state.accessibility, textSize: 'extra-large'})}
                  className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${
                    state.accessibility.textSize === 'extra-large'
                      ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20] font-bold'
                      : 'bg-[#FDF8F0] border-[#E0D8CC] text-[#4A4A4A]'
                  }`}
                >
                  <span className="text-xl block font-bold">Extra Large</span>
                  <span className="text-xs opacity-70">30px</span>
                </button>
              </div>
            </div>

            {/* Live Preview Inside Settings */}
            <div className={`p-4 rounded-2xl border transition-all ${
              state.accessibility.highContrast
                ? 'bg-[#0A0A0A] border-2 border-yellow-400 text-white'
                : 'bg-[#FDF8F0] border border-[#E0D8CC] text-[#1A1A1A]'
            }`}>
              <div className="flex items-center justify-between mb-1 opacity-70 text-xs font-bold uppercase">
                <span>Live Preview</span>
                <span>{state.accessibility.textSize.toUpperCase()}</span>
              </div>
              <p className={`font-bold ${
                state.accessibility.textSize === 'extra-large'
                  ? 'text-2xl'
                  : state.accessibility.textSize === 'large'
                  ? 'text-xl'
                  : 'text-lg'
              } ${state.accessibility.highContrast ? 'text-yellow-400' : 'text-[#1B5E20]'}`}>
                Good Morning, Kamala Baa!
              </p>
              <p className={`mt-1 opacity-90 ${
                state.accessibility.textSize === 'extra-large'
                  ? 'text-lg'
                  : state.accessibility.textSize === 'large'
                  ? 'text-base'
                  : 'text-sm'
              }`}>
                This is how text and buttons appear on your screen.
              </p>
            </div>
          </Card>
        </div>

        {/* Reminders */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Bell size={18} className="text-[#F57F17]" />
            Notifications
          </h3>
          <Card className="p-4 space-y-4">
            <SettingToggle label="Medicine Reminders" description="Alert for medication times" value={true} />
            <SettingToggle label="Game Reminders" description="Daily game suggestions" value={true} />
            <SettingToggle label="Appointment Alerts" description="Notify before appointments" value={true} />
          </Card>
        </div>

        {/* Data & Privacy */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Shield size={18} className="text-[#1B5E20]" />
            Data & Privacy
          </h3>
          <Card className="p-4 space-y-4">
            <SettingToggle label="Offline Mode" description="Store data locally" value={true} />
            <SettingToggle label="Auto-Sync" description="Sync when online" />
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-base text-[#1A1A1A] font-medium">Local Storage</span>
                <p className="text-xs text-[#7A7A7A] mt-0.5">Data stored on this device</p>
              </div>
              <div className="flex items-center gap-1">
                <Database size={14} className="text-[#7A7A7A]" />
                <span className="text-sm text-[#4A4A4A]">2.4 MB</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Developer Tools — Caregiver/Developer access only */}
        {isCaregiver && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Shield size={18} className="text-[#7B1FA2]" />
            Developer Tools
          </h3>
          <Card className="p-4 space-y-2">
            <button
              onClick={() => onNavigate('adaptive-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Run Adaptive Engine Tests</span>
                <p className="text-sm text-[#7A7A7A]">Verify difficulty adjustment logic</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => onNavigate('database-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Run Database Tests</span>
                <p className="text-sm text-[#7A7A7A]">Verify offline-first persistence</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => onNavigate('reminder-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Run Reminder Tests</span>
                <p className="text-sm text-[#7A7A7A]">Test reminder system functionality</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => onNavigate('voice-language-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Run Voice & Language Tests</span>
                <p className="text-sm text-[#7A7A7A]">Test TTS, STT, and multilingual features</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => onNavigate('sync-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Run Sync Tests</span>
                <p className="text-sm text-[#7A7A7A]">Test offline→online synchronization (Phase 9)</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => onNavigate('security-tests')}
              className="w-full flex items-center justify-between py-2 min-h-[48px]"
            >
              <div className="text-left">
                <span className="text-base font-medium text-[#1A1A1A]">Security & Privacy Audit</span>
                <p className="text-sm text-[#7A7A7A]">Verify role separation, secrets, data safety (Phase 10)</p>
              </div>
              <ChevronRight size={18} className="text-[#7A7A7A]" />
            </button>
          </Card>
        </div>
        )}

        {/* Demo Data Management */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Sparkles size={18} className="text-[#1B5E20]" />
            Demo Data
          </h3>
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-sm text-[#4A4A4A] mb-2">
                Reset demo data to start fresh with Aai Devi's sample data.
              </p>
              <button
                onClick={async () => {
                  if (confirm('This will reset all demo data. Continue?')) {
                    try {
                      await DemoDataService.resetDemoData();
                      alert('Demo data reset successfully!');
                      window.location.reload();
                    } catch (error) {
                      console.error('Failed to reset demo data:', error);
                      alert('Failed to reset demo data. Please try again.');
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 min-h-[48px] bg-[#E8F5E9] text-[#1B5E20] rounded-xl font-medium hover:bg-[#C8E6C9] transition-colors"
              >
                <RefreshCw size={18} />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <div className="space-y-3">
          <Card className="p-4">
            <button
              onClick={async () => {
                await logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 min-h-[48px] bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </Card>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Info size={18} className="text-[#4A4A4A]" />
            About
          </h3>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-[#7A7A7A]">App Name</span>
                <span className="text-sm text-[#1A1A1A] font-medium">{APP.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#7A7A7A]">Version</span>
                <span className="text-sm text-[#1A1A1A] font-medium">{APP.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#7A7A7A]">Organization</span>
                <span className="text-sm text-[#1A1A1A] font-medium">{APP.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#7A7A7A]">Platform</span>
                <span className="text-sm text-[#1A1A1A] font-medium flex items-center gap-1">
                  <Smartphone size={12} /> Android Tablet
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* App Updates */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <RefreshCw size={18} className="text-[#1565C0]" />
            App Updates
          </h3>
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#1A1A1A] font-medium">Current Version</p>
                <p className="text-sm text-[#7A7A7A] mt-1">{CURRENT_APP_VERSION}</p>
              </div>
            </div>

            {updateResult?.hasUpdate ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-[#E8F5E9] border border-[#2E7D32] rounded-xl text-[#1B5E20] text-sm font-medium">
                  Update Available: {updateResult.latestVersion}
                </div>
                <a
                  href={updateResult.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] text-white py-3 px-4 rounded-xl font-medium"
                >
                  <RefreshCw size={18} />
                  Download Update
                </a>
              </div>
            ) : (
              <div className="mt-4">
                {updateCheckedOnce && (
                  <div className="mb-3 text-sm text-[#2E7D32] font-medium">
                    Your app is up to date.
                  </div>
                )}
                <button
                  onClick={handleCheckUpdates}
                  disabled={checkingUpdate}
                  className="w-full flex items-center justify-center gap-2 bg-[#F5F0E8] text-[#4A4A4A] py-3 px-4 rounded-xl font-medium border border-[#D4C5B0] hover:bg-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={18} className={checkingUpdate ? 'animate-spin' : ''} />
                  {checkingUpdate ? 'Checking...' : 'Check for Updates'}
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#4A4A4A] text-base font-medium px-4 py-3 rounded-xl hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
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

function SettingToggle({ label, description, value = false, onChange }: { label: string; description: string; value?: boolean; onChange?: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1" onClick={() => onChange?.(!value)}>
      <div className="flex-1 mr-4">
        <span className="text-base text-[#1A1A1A] font-medium">{label}</span>
        <p className="text-xs text-[#7A7A7A] mt-0.5">{description}</p>
      </div>
      <div className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${
        value ? 'bg-[#1B5E20]' : 'bg-[#C0B8A8]'
      }`}>
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`} />
      </div>
    </div>
  );
}
