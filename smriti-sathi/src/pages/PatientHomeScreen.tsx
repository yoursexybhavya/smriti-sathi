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
  Play,
  Bell,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import SectionHeader from '../components/SectionHeader';
import StatusIndicator from '../components/StatusIndicator';
import LargeButton from '../components/LargeButton';
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
  const [gameProgress, setGameProgress] = useState({
    remember: { doneToday: false, level: 1 },
    recognise: { doneToday: false, level: 1 },
    memoryMatch: { doneToday: false, level: 1 },
    dailyRoutine: { doneToday: false, level: 1 },
  });

  // Notification permission state
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'granted'
  );

  const requestNotificationPermission = async () => {
    try {
      if (typeof Notification !== 'undefined' && Notification.requestPermission) {
        const res = await Notification.requestPermission();
        setNotificationPermission(res);
        if (res === 'granted') {
          await notificationService.triggerBuzzer(
            '🔔 Care Reminders Enabled',
            'Smriti Sathi will now alert you for daily medicine and routine schedules.'
          );
        }
      }
    } catch (err) {
      console.warn('Failed to request notification permission:', err);
    }
  };

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

      // Per-game level and daily completion
      const getGameLevel = (type: string) => {
        const gameSess = sessions.filter(s => (s.gameType as string) === type);
        if (!gameSess.length) return 1;
        const maxDiff = Math.max(...gameSess.map(s => s.difficulty || 1));
        return Math.min(5, Math.max(1, maxDiff));
      };

      setGameProgress({
        remember: {
          doneToday: todaySessions.some(s => s.gameType === 'remember'),
          level: getGameLevel('remember'),
        },
        recognise: {
          doneToday: todaySessions.some(s => s.gameType === 'recognise'),
          level: getGameLevel('recognise'),
        },
        memoryMatch: {
          doneToday: todaySessions.some(s => s.gameType === 'memory_match'),
          level: getGameLevel('memory_match'),
        },
        dailyRoutine: {
          doneToday: todaySessions.some(s => (s.gameType as string) === 'daily_routine'),
          level: getGameLevel('daily_routine'),
        },
      });

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
      {/* Elder-friendly Scandinavian App Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-b-2 border-[var(--color-border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3.5 sm:px-6 py-3 gap-2 sm:gap-4">
          
          {/* Left: Warm Greeting with Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
              🌸
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-[var(--color-text)] truncate tracking-tight">
                  {greeting}, {patient?.name || 'Friend'}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
                  <ShieldCheck size={13} />
                  <span>Calm Routine</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium truncate">
                স্মৃতি সাথী · Memory Companion
              </p>
            </div>
          </div>

          {/* Right: Actions (Theme Toggle & Prominent 52px Settings Button) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Online/Offline status badge */}
            <div className="hidden sm:block">
              <StatusIndicator
                type={isOnline ? 'online' : 'offline'}
                compact
              />
            </div>

            {/* Theme Toggle (Tactile 52px target) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-12 h-12 min-w-[48px] min-h-[40px] sm:min-h-[48px] rounded-2xl flex items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-2 border-[var(--color-border)] hover:border-indigo-500 dark:hover:border-indigo-400 transition-all active:scale-95 cursor-pointer shadow-xs"
              aria-label={isDark ? 'Switch to Daylight Light Theme' : 'Switch to Midnight Dark Theme'}
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={22} className="text-amber-500" /> : <Moon size={22} className="text-slate-600" />}
            </button>

            {/* Prominent High-Visibility Settings Button */}
            <button
              onClick={() => onNavigate('settings')}
              className="h-12 min-h-[40px] sm:min-h-[48px] px-3 sm:px-4 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              aria-label="Settings and Preferences"
            >
              <Settings size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-48 sm:pb-56">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start max-w-2xl mx-auto lg:max-w-none">
          
          {/* LEFT COLUMN: Cognitive Play & Core Activities (7 cols on Landscape) */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8">
            
            {/* Daily Focus Hero Card */}
            <div className="p-6 sm:p-8 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] shadow-sm space-y-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Today's Daily Focus</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight pt-0.5">
                    Remember Game
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    View familiar everyday objects, then recall them peacefully. Strengthens visual memory with zero pressure.
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm flex items-center justify-center flex-shrink-0">
                  <Eye size={36} />
                </div>
              </div>

              <LargeButton
                onPress={() => onNavigate('remember-game')}
                icon={<Play size={22} fill="currentColor" />}
                size="lg"
              >
                Start Daily Exercise
              </LargeButton>
            </div>

            {/* Cognitive Exercises Grid - 2x2 High-Definition Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader
                  title="Cognitive Exercises"
                  icon={<Brain size={24} className="text-indigo-600 dark:text-indigo-400" />}
                />
                <span className="text-xs font-bold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                  4 Calibrated Games
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Remember Game Card */}
                <button
                  type="button"
                  onClick={() => onNavigate('remember-game')}
                  className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 bg-[var(--color-card)] hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-150 active:translate-y-1 active:scale-[0.99] flex flex-col justify-between gap-3 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 cursor-pointer min-h-[140px]"
                  aria-label="Play Remember Game"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="w-14 h-14 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Eye size={28} />
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                      Level {gameProgress.remember.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                      Remember
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      Observe familiar objects, then recall gently
                    </p>
                  </div>
                  <div className="pt-1">
                    {gameProgress.remember.doneToday ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={14} /> Completed Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                        <Play size={12} fill="currentColor" /> Ready to Play
                      </span>
                    )}
                  </div>
                </button>

                {/* 2. Recognise Game Card */}
                <button
                  type="button"
                  onClick={() => onNavigate('recognise-game')}
                  className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 bg-[var(--color-card)] hover:border-cyan-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-md transition-all duration-150 active:translate-y-1 active:scale-[0.99] flex flex-col justify-between gap-3 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/30 cursor-pointer min-h-[140px]"
                  aria-label="Play Recognise Game"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="w-14 h-14 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Brain size={28} />
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800">
                      Level {gameProgress.recognise.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                      Recognise
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      Spot subtle differences and patterns
                    </p>
                  </div>
                  <div className="pt-1">
                    {gameProgress.recognise.doneToday ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={14} /> Completed Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-200/60 dark:border-cyan-800/60">
                        <Play size={12} fill="currentColor" /> Ready to Play
                      </span>
                    )}
                  </div>
                </button>

                {/* 3. Memory Match Card */}
                <button
                  type="button"
                  onClick={() => onNavigate('memory-match')}
                  className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 bg-[var(--color-card)] hover:border-purple-500 dark:hover:border-purple-400 shadow-sm hover:shadow-md transition-all duration-150 active:translate-y-1 active:scale-[0.99] flex flex-col justify-between gap-3 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 cursor-pointer min-h-[140px]"
                  aria-label="Play Memory Match Game"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="w-14 h-14 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Grid3X3 size={28} />
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">
                      Level {gameProgress.memoryMatch.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                      Memory Match
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      Pair matching cultural and floral cards
                    </p>
                  </div>
                  <div className="pt-1">
                    {gameProgress.memoryMatch.doneToday ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={14} /> Completed Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                        <Play size={12} fill="currentColor" /> Ready to Play
                      </span>
                    )}
                  </div>
                </button>

                {/* 4. Daily Routine Card */}
                <button
                  type="button"
                  onClick={() => onNavigate('daily-routine')}
                  className="w-full p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 bg-[var(--color-card)] hover:border-amber-500 dark:hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-150 active:translate-y-1 active:scale-[0.99] flex flex-col justify-between gap-3 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/30 cursor-pointer min-h-[140px]"
                  aria-label="Play Daily Routine Game"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="w-14 h-14 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Sun size={28} />
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                      Level {gameProgress.dailyRoutine.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                      Daily Routine
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      Sequence comforting dawn to dusk habits
                    </p>
                  </div>
                  <div className="pt-1">
                    {gameProgress.dailyRoutine.doneToday ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={14} /> Completed Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                        <Play size={12} fill="currentColor" /> Ready to Play
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Featured Anchor Card: Personal Memory Book */}
            <div className="p-6 sm:p-7 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white dark:from-slate-800 dark:via-purple-950/20 dark:to-slate-800 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <BookOpen size={30} />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    {/* Featured Family Sanctuary */}
                    Cherished Family Stories
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">Personal Memory Book</h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                    Explore family photos, familiar village places, and voice notes
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('family-memory-game')}
                  className="min-h-[56px] px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm shadow-[0_4px_12px_rgba(225,29,72,0.3)] border-2 border-rose-400/60 transition-all active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Play Family Memory Quiz"
                >
                  <span>🎮 Family Quiz</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('memory-book-viewer')}
                  className="min-h-[56px] px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)] border-2 border-indigo-400/60 transition-all active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Open Personal Memory Book"
                >
                  <span>View Photos</span>
                </button>
              </div>
            </div>

            {/* Daily Comfort & Audio Anchor Card */}
            <div className="p-6 sm:p-7 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] shadow-xs space-y-3.5 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Heart size={20} fill="currentColor" />
                  <span>Daily Comfort & Reassurance</span>
                </div>
                <button
                  type="button"
                  onClick={speakComfort}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 text-xs font-bold transition-all active:scale-95 min-h-[44px] cursor-pointer ${
                    isSpeakingComfort
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-[var(--color-border)] hover:border-emerald-500'
                  }`}
                >
                  <Volume2 size={16} />
                  <span>{isSpeakingComfort ? 'Speaking...' : 'Listen Aloud'}</span>
                </button>
              </div>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed italic">
                "Take your time. There is no rush. Every moment you spend here strengthens your mind, keeps your memories bright, and brings peace to your day."
              </p>
            </div>
          </div>

          {/* Right Column (5 cols in Landscape, Full Width in Portrait) */}
          <div className="lg:col-span-5 space-y-7 sm:space-y-8">
            
            {/* Notification Permission Banner (If notifications are not granted yet) */}
            {notificationPermission !== 'granted' && (
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border-2 border-amber-300 dark:border-amber-700 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                    <Bell size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-amber-950 dark:text-amber-100">
                      Enable Care Reminders
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-0.5 leading-snug">
                      Allow alerts so Smriti Sathi can chime for morning medicine and water routines.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="w-full min-h-[50px] py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell size={18} />
                  <span>Turn On Daily Care Alarms</span>
                </button>
              </div>
            )}

            {/* Today's Real Care Schedule */}
            <div className="space-y-3.5">
              <SectionHeader
                title="Today's Care Schedule"
                icon={<Calendar size={22} className="text-amber-600 dark:text-amber-400" />}
                action={{
                  label: 'Manage',
                  onPress: () => onNavigate('reminders'),
                }}
              />

              {/* Audible Buzzer & Notification Test Card */}
              <div className="p-4.5 sm:p-5 bg-[var(--color-card)] rounded-2xl border-2 border-[var(--color-border)] flex items-center justify-between gap-3.5 shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <BellRing size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--color-text)] truncate">Care Alarm & Buzzer</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">Audible chime even in background</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestBuzzer}
                  disabled={isBuzzerTesting}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 min-h-[46px] cursor-pointer border-2 ${
                    isBuzzerTesting
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-[var(--color-border)] hover:border-amber-500'
                  }`}
                >
                  <Volume2 size={16} />
                  <span>{isBuzzerTesting ? 'Ringing...' : 'Test Alarm'}</span>
                </button>
              </div>

              {/* Reminders List from Real DB */}
              <div className="space-y-3.5">
                {reminders.length > 0 ? (
                  reminders.map(rem => {
                    const isCompleted = rem.status === 'completed';
                    return (
                      <div
                        key={rem.id}
                        className={`w-full p-4.5 sm:p-5 bg-[var(--color-card)] rounded-2xl border-2 border-[var(--color-border)] flex items-center justify-between gap-4 transition-all shadow-xs ${
                          isCompleted ? 'opacity-65 bg-[var(--color-bg-subtle)]' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem)}
                          className="flex items-center gap-3.5 min-w-0 flex-1 text-left active:scale-[0.99] transition-transform cursor-pointer"
                          aria-label={`Toggle ${rem.title}`}
                        >
                          <div className="w-13 h-13 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                            {getReminderIcon(rem.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-base font-bold text-[var(--color-text)] truncate ${isCompleted ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                              {rem.title}
                            </h4>
                            <p className="text-xs text-[var(--color-text-secondary)] font-semibold mt-0.5">
                              {formatTime(rem.scheduledTime)} {rem.description ? `· ${rem.description}` : ''}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem)}
                          className={`w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl flex items-center justify-center border-2 transition-all active:scale-90 flex-shrink-0 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-emerald-500 hover:text-emerald-600'
                          }`}
                          aria-label={isCompleted ? 'Marked complete' : 'Mark as complete'}
                        >
                          {isCompleted ? <CheckCircle2 size={28} className="stroke-[2.5]" /> : <Circle size={28} className="stroke-[2]" />}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 sm:p-7 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] text-center space-y-4 shadow-xs">
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                      No care reminders scheduled for today. Your routine is peaceful.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('reminders')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/30 text-sm font-bold hover:bg-emerald-500/25 transition-all cursor-pointer min-h-[48px]"
                    >
                      <Plus size={16} />
                      <span>Add Care Reminder</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Real Engagement & Progress Stats (Zero Dummy Data) */}
            <div className="space-y-3.5">
              <SectionHeader
                title="Your Progress Today"
                icon={<TrendingUp size={22} className="text-indigo-600 dark:text-indigo-400" />}
                action={{
                  label: 'View Details',
                  onPress: () => onNavigate('progress'),
                }}
              />
              <div className="grid grid-cols-3 gap-3 sm:gap-3.5">
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Brain size={22} />}
                    label="Activities"
                    value={activitiesTodayCount}
                    subtitle="Completed"
                    color="#10B981"
                  />
                </div>
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Sparkles size={22} />}
                    label="Streak"
                    value={currentStreak > 0 ? `${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}` : '0 Days'}
                    subtitle="Daily Habit"
                    color="#F59E0B"
                  />
                </div>
                <div onClick={() => onNavigate('progress')} className="cursor-pointer active:scale-95 transition-transform">
                  <ProgressCard
                    icon={<Eye size={22} />}
                    label="Accuracy"
                    value={accuracy}
                    subtitle="Recall Score"
                    color="#6366F1"
                  />
                </div>
              </div>
            </div>

            {/* Prominent Settings & System Preferences Card (Guaranteed Discovery) */}
            <div className="p-6 sm:p-7 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] shadow-xs space-y-4.5 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Settings size={26} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] truncate">
                      Preferences & Display
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate">
                      Text size, high contrast, languages & updates
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="w-full min-h-[56px] py-4 px-5 rounded-2xl bg-[var(--color-bg-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--color-text)] border-2 border-[var(--color-border)] hover:border-indigo-500 font-bold text-sm sm:text-base flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer shadow-xs"
              >
                <span>Open App Settings</span>
                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
              </button>
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
      return <Pill size={22} className="text-emerald-600 dark:text-emerald-400" />;
    case 'hydration':
      return <Droplets size={22} className="text-blue-600 dark:text-blue-400" />;
    case 'activity':
      return <Activity size={22} className="text-emerald-600 dark:text-emerald-400" />;
    case 'appointment':
      return <Calendar size={22} className="text-purple-600 dark:text-purple-400" />;
    default:
      return <Calendar size={22} className="text-amber-600 dark:text-amber-400" />;
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
