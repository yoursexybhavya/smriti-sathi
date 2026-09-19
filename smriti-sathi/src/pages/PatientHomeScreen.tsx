import { useState, useEffect, useCallback } from 'react';
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
  Volume2, 
  Sun, 
  Moon, 
  Heart,
  Sparkles,
  BellRing,
  Plus,
  CheckCircle2,
  Circle,
  Play
} from 'lucide-react';
import LargeActionCard from '../components/LargeActionCard';
import ProgressCard from '../components/ProgressCard';
import SectionHeader from '../components/SectionHeader';
import StatusIndicator from '../components/StatusIndicator';
import { useApp } from '../context/AppContext';
import { reminderService } from '../services/ReminderService';
import { notificationService } from '../services/NotificationService';
import { gameSessionRepository } from '../database';
import { Reminder } from '../database/db';
import { formatTime, isToday } from '../utils/dateUtils';

interface PatientHomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function PatientHomeScreen({ onNavigate, isOnline = true }: PatientHomeScreenProps) {
  const { state, toggleTheme } = useApp();
  const patient = state.currentPatient;
  const isDark = state.accessibility?.theme === 'dark';
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  // Real data state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activitiesTodayCount, setActivitiesTodayCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<string>('—');
  const [isSpeakingComfort, setIsSpeakingComfort] = useState(false);
  const [isBuzzerTesting, setIsBuzzerTesting] = useState(false);

  // Load real patient data from IndexedDB
  const loadRealData = useCallback(async (uid: number) => {
    try {
      // 1. Load real reminders
      const allReminders = await reminderService.getAllReminders(uid);
      setReminders(allReminders);

      // 2. Load real game sessions
      const sessions = await gameSessionRepository.getByUserId(uid);
      const stats = await gameSessionRepository.getStats(uid);

      // Real activities completed today
      const todaySessions = sessions.filter(s => isToday(s.createdAt));
      setActivitiesTodayCount(todaySessions.length);

      // Real calculated streak
      const streak = calculateStreak(sessions.map(s => s.createdAt));
      setCurrentStreak(streak);

      // Real accuracy
      if (stats.totalGames > 0 && stats.averageAccuracy > 0) {
        setAccuracy(`${stats.averageAccuracy}%`);
      } else {
        setAccuracy('—');
      }
    } catch (err) {
      console.error('Failed to load patient data from database:', err);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadRealData(userId);
    }
  }, [userId, loadRealData]);

  // Toggle reminder completion with real database update
  const handleToggleReminder = async (rem: Reminder) => {
    if (!userId || !rem.id) return;
    try {
      if (rem.status === 'completed') {
        await reminderService.updateReminder(rem.id, { status: 'pending' });
      } else {
        await reminderService.completeReminder(rem.id, userId);
      }
      await loadRealData(userId);
    } catch (err) {
      console.error('Error toggling reminder status:', err);
    }
  };

  // Test care buzzer & notification
  const handleTestBuzzer = async () => {
    setIsBuzzerTesting(true);
    try {
      await notificationService.triggerBuzzer(
        '🔔 Care Schedule Test Alarm',
        'This is the audible chime and vibration that alerts for daily medicine and care routines.'
      );
    } catch (err) {
      console.warn('Buzzer test error:', err);
    } finally {
      setTimeout(() => setIsBuzzerTesting(false), 3000);
    }
  };

  // Speak comfort message aloud
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
      {/* Elder-friendly App Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3">
          
          {/* Left: Warm Greeting with Avatar */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              🌸
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-[var(--color-text)] truncate">
                {greeting}, {patient?.name || 'Friend'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate">
                স্মৃতি সাথী · Memory Care Companion
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

            {/* Prominent Settings Button */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] hover:border-[#10B981] transition-all active:scale-95 shadow-sm min-h-[40px]"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} className="text-[#10B981]" />
              <span className="text-xs sm:text-sm font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
        {/* Dual Orientation: Single-column centered on Portrait (<1024px), Two-column on Landscape (>=1024px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-2xl mx-auto lg:max-w-none">
          
          {/* Left Column (7 cols in Landscape, full width in Portrait) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Daily Focus Hero Card */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-[#10B981]/15 to-[#0EA5E9]/10 rounded-3xl border-2 border-[#10B981]/30 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#10B981] text-white">
                    <Sparkles size={13} />
                    <span>Today's Daily Focus</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight pt-1">
                    Remember Game
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    View familiar everyday objects, then test your gentle recall. Strengthens visual memory with zero rush or pressure.
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-[#10B981] shadow-md flex items-center justify-center flex-shrink-0">
                  <Eye size={32} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('remember-game')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[52px]"
              >
                <Play size={18} fill="currentColor" />
                <span>Start Daily Exercise →</span>
              </button>
            </div>

            {/* Cognitive Exercises Grid */}
            <div className="space-y-3.5">
              <SectionHeader
                title="Cognitive Exercises"
                icon={<Brain size={20} className="text-[#10B981]" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  onPress={() => onNavigate('memory-match')}
                  variant="secondary"
                />
                <LargeActionCard
                  icon={<Sun size={28} className="text-[#E65100]" />}
                  title="Daily Routine"
                  subtitle="Sequence your daily habits from dawn to dusk"
                  onPress={() => onNavigate('daily-routine')}
                  variant="primary"
                />
                <LargeActionCard
                  icon={<BookOpen size={28} className="text-[#A855F7]" />}
                  title="Personal Memory Book"
                  subtitle="Explore cherished photos and family stories"
                  onPress={() => onNavigate('memory-book-viewer')}
                  variant="neutral"
                />
              </div>
            </div>

            {/* Daily Comfort & Audio Anchor Card */}
            <div className="p-5 bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] shadow-sm space-y-3 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#10B981] font-semibold text-sm">
                  <Heart size={18} fill="#10B981" />
                  <span>Daily Comfort & Reassurance</span>
                </div>
                <button
                  type="button"
                  onClick={speakComfort}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all active:scale-90 min-h-[40px] ${
                    isSpeakingComfort
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[#10B981]'
                  }`}
                >
                  <Volume2 size={16} />
                  <span>{isSpeakingComfort ? 'Playing...' : 'Listen Aloud'}</span>
                </button>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">
                "Take your time. There is no rush. Every moment you spend here strengthens your mind, keeps your memories bright, and brings peace to your day."
              </p>
            </div>
          </div>

          {/* Right Column (5 cols in Landscape, full width in Portrait) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Today's Real Care Schedule */}
            <div className="space-y-3.5">
              <SectionHeader
                title="Today's Care Schedule"
                icon={<Calendar size={20} className="text-[#F59E0B]" />}
                action={{
                  label: 'Manage',
                  onPress: () => onNavigate('reminders'),
                }}
              />

              {/* Audible Buzzer & Notification Test Card */}
              <div className="p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <BellRing size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">Care Alarm & Buzzer</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">Plays chime and alerts even in background</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestBuzzer}
                  disabled={isBuzzerTesting}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 min-h-[40px] ${
                    isBuzzerTesting
                      ? 'bg-[#F59E0B] text-white'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#F59E0B]'
                  }`}
                >
                  <Volume2 size={14} />
                  <span>{isBuzzerTesting ? 'Ringing...' : 'Test Alarm'}</span>
                </button>
              </div>

              {/* Reminders List from Real DB */}
              <div className="space-y-2.5">
                {reminders.length > 0 ? (
                  reminders.map(rem => {
                    const isCompleted = rem.status === 'completed';
                    return (
                      <div
                        key={rem.id}
                        className={`w-full p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between gap-3.5 transition-all shadow-sm ${
                          isCompleted ? 'opacity-65 bg-[var(--color-bg-subtle)]' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left active:scale-[0.98] transition-transform"
                          aria-label={`Toggle ${rem.title}`}
                        >
                          <div className="w-11 h-11 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center flex-shrink-0">
                            {getReminderIcon(rem.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-base font-semibold text-[var(--color-text)] truncate ${isCompleted ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                              {rem.title}
                            </h4>
                            <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                              {formatTime(rem.scheduledTime)} {rem.description ? `· ${rem.description}` : ''}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all active:scale-90 flex-shrink-0 ${
                            isCompleted
                              ? 'bg-[#10B981] border-[#10B981] text-white'
                              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[#10B981]'
                          }`}
                          aria-label={isCompleted ? 'Marked complete' : 'Mark as complete'}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] text-center space-y-3 shadow-sm">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      No care reminders scheduled for today. Your routine is calm.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('reminders')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-bold hover:bg-[#10B981]/25 transition-all"
                    >
                      <Plus size={15} />
                      <span>+ Add Care Reminder</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Real Engagement & Progress Stats (Zero Dummy Data) */}
            <div className="space-y-3.5">
              <SectionHeader
                title="Your Progress Today"
                icon={<TrendingUp size={20} className="text-[#0EA5E9]" />}
                action={{
                  label: 'View Details',
                  onPress: () => onNavigate('progress'),
                }}
              />
              <div className="grid grid-cols-3 gap-3">
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Brain size={20} />}
                    label="Activities"
                    value={activitiesTodayCount}
                    subtitle="Completed Today"
                    color="#10B981"
                  />
                </div>
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Sparkles size={20} />}
                    label="Streak"
                    value={currentStreak > 0 ? `${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}` : '0 Days'}
                    subtitle="Daily Habit"
                    color="#F59E0B"
                  />
                </div>
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Eye size={20} />}
                    label="Accuracy"
                    value={accuracy}
                    subtitle="Overall Recall"
                    color="#0EA5E9"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function getReminderIcon(type: Reminder['type']) {
  switch (type) {
    case 'medicine':
      return <Pill size={20} className="text-[#10B981]" />;
    case 'hydration':
      return <Droplets size={20} className="text-[#0EA5E9]" />;
    case 'activity':
      return <Activity size={20} className="text-[#10B981]" />;
    case 'appointment':
      return <Calendar size={20} className="text-[#A855F7]" />;
    default:
      return <Calendar size={20} className="text-[#F59E0B]" />;
  }
}

function calculateStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0;
  
  const dates = new Set(
    timestamps.map(t => {
      const d = new Date(t);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const checkDate = dates.has(todayStr) ? today : (dates.has(yesterdayStr) ? yesterday : null);
  if (!checkDate) return 0;

  let streak = 0;
  const cursor = new Date(checkDate);
  while (true) {
    const str = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (dates.has(str)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
