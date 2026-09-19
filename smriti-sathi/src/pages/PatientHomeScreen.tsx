import { useState } from 'react';
import { 
  Brain, 
  Eye, 
  Pill, 
  Droplets, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Settings, 
  BookOpen, 
  Grid3X3, 
  Clock, 
  Volume2, 
  LogOut, 
  Sun, 
  Moon, 
  Heart,
  Sparkles
} from 'lucide-react';
import LargeActionCard from '../components/LargeActionCard';
import ReminderCard from '../components/ReminderCard';
import ProgressCard from '../components/ProgressCard';
import SectionHeader from '../components/SectionHeader';
import StatusIndicator from '../components/StatusIndicator';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface PatientHomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function PatientHomeScreen({ onNavigate, isOnline = true }: PatientHomeScreenProps) {
  const { state, toggleTheme } = useApp();
  const { logout } = useAuth();
  const patient = state.currentPatient;
  const isDark = state.accessibility?.theme === 'dark';

  // Interactive completed reminders state
  const [completedReminders, setCompletedReminders] = useState<Record<string, boolean>>({
    medicine: true,
    hydration: false,
    activity: false,
    appointment: false,
  });

  const [isSpeakingComfort, setIsSpeakingComfort] = useState(false);

  const toggleReminder = (key: string) => {
    setCompletedReminders(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const speakComfort = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const message = "Take your time. There is no rush. Every moment you spend here strengthens your mind, keeps your memories bright, and brings peace to your day.";
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.85;
      setIsSpeakingComfort(true);
      utterance.onend = () => setIsSpeakingComfort(false);
      utterance.onerror = () => setIsSpeakingComfort(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3">
          {/* Left: Role Switcher Escape Hatch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-red-400 hover:text-red-500 transition-all active:scale-95 shadow-sm"
              title="Switch Profile / Roles"
              aria-label="Switch User Profile"
            >
              <LogOut size={17} />
              <span className="text-xs sm:text-sm font-semibold">Switch Role</span>
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[var(--color-text)] truncate">
                {greeting}, {patient?.name || 'Friend'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] hidden sm:block">
                Memory Care Companion
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <StatusIndicator
              type={isOnline ? 'online' : 'offline'}
              compact
            />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-focus)] transition-all active:scale-90"
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={19} className="text-[#F59E0B]" /> : <Moon size={19} className="text-[#64748B]" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => onNavigate('settings')}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-all active:scale-90"
              aria-label="Settings"
            >
              <Settings size={19} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {/* Today's Cognitive Exercises */}
        <div className="space-y-3.5">
          <SectionHeader
            title="Cognitive Exercises"
            icon={<Brain size={20} className="text-[#10B981]" />}
          />
          <div className="space-y-3">
            <LargeActionCard
              icon={<Eye size={28} className="text-[#10B981]" />}
              title="Remember Game"
              subtitle="Look at real-life objects, then recall them"
              onPress={() => onNavigate('remember-game')}
              variant="primary"
            />
            <LargeActionCard
              icon={<Brain size={28} className="text-[#0EA5E9]" />}
              title="Recognise Game"
              subtitle="Spot patterns and find what is different"
              onPress={() => onNavigate('recognise-game')}
              variant="secondary"
            />
            <LargeActionCard
              icon={<Grid3X3 size={28} className="text-[#F59E0B]" />}
              title="Memory Match"
              subtitle="Pair matching cards with calm errorless learning"
              onPress={() => onNavigate('games')}
              variant="secondary"
            />
            <LargeActionCard
              icon={<Clock size={28} className="text-[#EC4899]" />}
              title="Daily Routine Sequencing"
              subtitle="Order daily activities step-by-step"
              onPress={() => onNavigate('games')}
              variant="neutral"
            />
            <LargeActionCard
              icon={<BookOpen size={28} className="text-[#A855F7]" />}
              title="Personal Memory Book"
              subtitle="Explore your cherished photos and family stories"
              onPress={() => onNavigate('memory-book-viewer')}
              variant="neutral"
            />
          </div>
        </div>

        {/* Right Column: Reminders & Progress */}
        <div className="space-y-6">
          {/* Today's Interactive Reminders */}
          <div className="space-y-3.5">
            <SectionHeader
              title="Today's Care Schedule"
              icon={<Calendar size={20} className="text-[#F59E0B]" />}
              action={{
                label: 'View All',
                onPress: () => onNavigate('reminders'),
              }}
            />
            <div className="space-y-2.5">
              <ReminderCard
                icon={<Pill size={22} className="text-[#10B981]" />}
                title="Morning Medicine"
                time="9:00 AM"
                description="Take with a glass of water"
                completed={completedReminders.medicine}
                onToggleComplete={() => toggleReminder('medicine')}
              />
              <ReminderCard
                icon={<Droplets size={22} className="text-[#0EA5E9]" />}
                title="Drink Fresh Water"
                time="11:00 AM"
                description="Stay well hydrated"
                completed={completedReminders.hydration}
                onToggleComplete={() => toggleReminder('hydration')}
              />
              <ReminderCard
                icon={<Activity size={22} className="text-[#10B981]" />}
                title="Garden Walk & Fresh Air"
                time="2:00 PM"
                description="Light, peaceful stroll"
                completed={completedReminders.activity}
                onToggleComplete={() => toggleReminder('activity')}
              />
              <ReminderCard
                icon={<Calendar size={22} className="text-[#A855F7]" />}
                title="Wellness Check-In"
                time="4:30 PM"
                description="Check-in with family caregiver"
                completed={completedReminders.appointment}
                onToggleComplete={() => toggleReminder('appointment')}
              />
            </div>
          </div>

          {/* Interactive Progress Summary */}
          <div className="space-y-3.5">
            <SectionHeader
              title="Engagement & Progress"
              icon={<TrendingUp size={20} className="text-[#0EA5E9]" />}
              action={{
                label: 'View Analytics',
                onPress: () => onNavigate('progress'),
              }}
            />
            <div className="grid grid-cols-3 gap-3">
              <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                <ProgressCard
                  icon={<Brain size={20} />}
                  label="Activities"
                  value={4}
                  subtitle="Completed"
                  color="#10B981"
                />
              </div>
              <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                <ProgressCard
                  icon={<Sparkles size={20} />}
                  label="Streak"
                  value="7 Days"
                  subtitle="Consistent"
                  color="#F59E0B"
                />
              </div>
              <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                <ProgressCard
                  icon={<Eye size={20} />}
                  label="Accuracy"
                  value="82%"
                  subtitle="High Recall"
                  color="#0EA5E9"
                />
              </div>
            </div>
          </div>

          {/* Interactive Comfort & Voice Anchor Card */}
          <div className="p-5 bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] shadow-sm space-y-3 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#10B981] font-semibold text-sm">
                <Heart size={18} fill="#10B981" />
                <span>Daily Comfort & Reassurance</span>
              </div>
              <button
                type="button"
                onClick={speakComfort}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-90 ${
                  isSpeakingComfort
                    ? 'bg-[#10B981] text-white border-[#10B981]'
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[#10B981]'
                }`}
              >
                <Volume2 size={15} />
                <span>{isSpeakingComfort ? 'Playing...' : 'Listen Aloud'}</span>
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              "Take your time. There is no rush. Every moment you spend here strengthens your mind and brings peace to your day."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
