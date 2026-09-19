import { ArrowLeft, Globe, Volume2, Type, Bell, Shield, Database, Smartphone, Info, User, RefreshCw, ChevronRight, BookOpen, LogOut, Sparkles } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { LANGUAGES, APP } from '../core/constants/app';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/Role';
import { DemoDataService } from '../services/DemoDataService';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function SettingsScreen({ onNavigate, isOnline = true }: SettingsScreenProps) {
  const { state, resetOnboarding } = useApp();
  const { role, logout, session } = useAuth();
  const patient = state.currentPatient;
  const isCaregiver = role === UserRole.CAREGIVER;

  return (
    <>
      <AppHeader title="Settings" subtitle="Customize your experience" isOnline={isOnline} />
      <div className="px-5 py-6 pb-28 space-y-6">
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

        {/* Voice & Accessibility */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Volume2 size={18} className="text-[#E65100]" />
            Voice & Accessibility
          </h3>
          <Card className="p-4 space-y-4">
            <SettingToggle label="Voice Instructions" description="Read instructions aloud" defaultOn />
            <SettingToggle label="Large Text" description="Use bigger fonts throughout" defaultOn />
            <SettingToggle label="High Contrast" description="Increase color contrast" />
            <SettingToggle label="Sound Effects" description="Play sounds during games" defaultOn />
          </Card>
        </div>

        {/* Display */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Type size={18} className="text-[#7B1FA2]" />
            Display
          </h3>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base text-[#1A1A1A]">Text Size</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A7A7A]">A</span>
                  <div className="w-32 h-2 bg-[#F5F0E8] rounded-full">
                    <div className="w-20 h-full bg-[#1B5E20] rounded-full" />
                  </div>
                  <span className="text-lg text-[#7A7A7A]">A</span>
                </div>
              </div>
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
            <SettingToggle label="Medicine Reminders" description="Alert for medication times" defaultOn />
            <SettingToggle label="Game Reminders" description="Daily game suggestions" defaultOn />
            <SettingToggle label="Appointment Alerts" description="Notify before appointments" defaultOn />
          </Card>
        </div>

        {/* Data & Privacy */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 flex items-center gap-2">
            <Shield size={18} className="text-[#1B5E20]" />
            Data & Privacy
          </h3>
          <Card className="p-4 space-y-4">
            <SettingToggle label="Offline Mode" description="Store data locally" defaultOn />
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
                <span className="text-sm text-[#7A7A7A]">Team</span>
                <span className="text-sm text-[#1A1A1A] font-medium">{APP.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#7A7A7A]">Platform</span>
                <span className="text-sm text-[#1A1A1A] font-medium flex items-center gap-1">
                  <Smartphone size={12} /> Android (Prototype)
                </span>
              </div>
            </div>
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
    </>
  );
}

function SettingToggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex-1 mr-4">
        <span className="text-base text-[#1A1A1A] font-medium">{label}</span>
        <p className="text-xs text-[#7A7A7A] mt-0.5">{description}</p>
      </div>
      <div className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${
        defaultOn ? 'bg-[#1B5E20]' : 'bg-[#C0B8A8]'
      }`}>
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          defaultOn ? 'translate-x-5' : 'translate-x-0.5'
        }`} />
      </div>
    </div>
  );
}
