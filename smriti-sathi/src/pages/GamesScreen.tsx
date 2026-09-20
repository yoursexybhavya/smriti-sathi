import { useState, useEffect } from 'react';
import { Brain, Grid3X3, ArrowLeft, Sparkles, Info, Eye, Sun } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import LargeButton from '../components/LargeButton';
import { useApp } from '../context/AppContext';
import { GameStorage } from '../services/storage/GameStorage';
import RecogniseGame from './games/RecogniseGame';
import RememberGame from './games/RememberGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import DailyRoutineGame from './games/DailyRoutineGame';

interface GamesScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function GamesScreen({ onNavigate, isOnline = navigator.onLine }: GamesScreenProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';
  
  // Local state for routing within games module
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Game stats
  const [stats, setStats] = useState({
    totalGames: 0,
    currentStreak: 0,
    averageAccuracy: 0,
  });
  const [recogniseGamesPlayed, setRecogniseGamesPlayed] = useState(0);
  const [rememberGamesPlayed, setRememberGamesPlayed] = useState(0);

  // Load stats
  useEffect(() => {
    const loadData = async () => {
      // Get session stats
      const allSessions = await GameStorage.getPatientSessions(patientId);
      const patientStats = await GameStorage.getPatientStats(patientId);
      
      let totalAcc = 0;
      allSessions.forEach(s => totalAcc += s.accuracy);
      const avgAcc = allSessions.length > 0 ? Math.round(totalAcc / allSessions.length) : 0;
      
      setStats({
        totalGames: allSessions.length,
        currentStreak: patientStats.currentStreak,
        averageAccuracy: avgAcc,
      });

      // Get game-specific counts
      const recogniseSessions = allSessions.filter(s => s.gameType === 'recognise');
      const rememberSessions = allSessions.filter(s => s.gameType === 'remember');
      setRecogniseGamesPlayed(recogniseSessions.length);
      setRememberGamesPlayed(rememberSessions.length);
    };
    
    loadData();
  }, [patientId]);

  // Handle local game navigation
  if (activeGame === 'recognise-game') {
    return <RecogniseGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'remember-game') {
    return <RememberGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory-match') {
    return <MemoryMatchGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'daily-routine') {
    return <DailyRoutineGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <>
      <AppHeader 
        title="Cognitive Games" 
        subtitle="Stimulate memory, focus, and routine" 
        isOnline={isOnline} 
        showBack 
        onBack={() => onNavigate('home')} 
        showSettings
        onSettingsPress={() => onNavigate('settings')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* Interactive Info Banner */}
        <div className="flex items-center justify-between gap-3 p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-accent-blue)]/30 shadow-sm">
          <div className="flex items-start gap-3 min-w-0">
            <Info size={20} className="text-[var(--color-accent-blue)] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Gentle cognitive exercises designed for elder engagement and enjoyment. Difficulty automatically adapts to your comfort.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance("These games are designed for cognitive engagement and enjoyment. Choose any game below to keep your mind active.");
                u.rate = 0.85;
                window.speechSynthesis.speak(u);
              }
            }}
            className="flex-shrink-0 p-2.5 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/10 transition-colors border border-[var(--color-border-subtle)]"
            title="Listen to guidance"
            aria-label="Listen to guidance"
          >
            <Sun size={18} className="hidden" />
            <span className="text-xs font-bold">🔊 Listen</span>
          </button>
        </div>

        {/* Game Cards */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <h3 className="text-lg font-bold text-[var(--color-text)] px-1 md:col-span-2">Available Games</h3>
          
          {/* REMEMBER Game - Fully Working */}
          <Card onPress={() => setActiveGame('remember-game')} className="overflow-hidden cursor-pointer hover:border-[var(--color-success)] transition-all active:scale-98">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30 flex items-center justify-center flex-shrink-0">
                  <Eye size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[var(--color-text)]">Remember</h4>
                    <span className="text-xs font-bold text-[var(--color-success)] bg-[var(--color-success)]/15 px-2 py-0.5 rounded-full border border-[var(--color-success)]/30">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    Look at familiar objects, then recall which ones you saw.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      5 Levels
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      3-6 Objects
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--color-accent-amber)]" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-bold text-[var(--color-success)]">Start Activity</span>
              </div>
            </div>
          </Card>

          {/* Memory Match Game */}
          <Card onPress={() => setActiveGame('memory-match')} className="overflow-hidden cursor-pointer hover:border-[var(--color-accent-blue)] transition-all active:scale-98">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/30 flex items-center justify-center flex-shrink-0">
                  <Brain size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[var(--color-text)]">Memory Match</h4>
                    <span className="text-xs font-bold text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/15 px-2 py-0.5 rounded-full border border-[var(--color-accent-blue)]/30">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    Find matching pairs of images. Tests your visual memory and recall ability.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      5 Levels
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      Pairs
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--color-accent-amber)]" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-bold text-[var(--color-accent-blue)]">Start Activity</span>
              </div>
            </div>
          </Card>

          {/* RECOGNISE Game */}
          <Card onPress={() => setActiveGame('recognise-game')} className="overflow-hidden cursor-pointer hover:border-[var(--color-warning)] transition-all active:scale-98">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[var(--color-warning)]/30 flex items-center justify-center flex-shrink-0">
                  <Eye size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[var(--color-text)]">Recognise</h4>
                    <span className="text-xs font-bold text-[var(--color-warning)] bg-[var(--color-warning)]/15 px-2 py-0.5 rounded-full border border-[var(--color-warning)]/30">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    Find patterns, sequences, and what is different.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      5 Levels
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      3 Activity Types
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--color-accent-amber)]" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-bold text-[var(--color-warning)]">Start Activity</span>
              </div>
            </div>
          </Card>

          {/* DAILY ROUTINE Sequencing Game */}
          <Card onPress={() => setActiveGame('daily-routine')} className="overflow-hidden cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all active:scale-98">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center flex-shrink-0">
                  <Sun size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[var(--color-text)]">Daily Routine</h4>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    Order daily habits in sequence from morning to night.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      5 Levels
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      Temporal Focus
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--color-accent-amber)]" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Errorless learning</span>
                </div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Start Activity</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Your Progress</h3>
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalGames}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Games Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.currentStreak}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Day Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.averageAccuracy}%</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg. Accuracy</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <LargeButton
            onPress={() => onNavigate('home')}
            variant="outline"
            icon={<ArrowLeft size={22} />}
          >
            Back to Home
          </LargeButton>
        </div>
      </div>
    </>
  );
}
