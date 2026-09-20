import { useState, useEffect } from 'react';
import { Brain, ArrowLeft, Sparkles, Info, Eye, Sun, Play, Trophy, Flame, Target } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { GameStorage } from '../services/storage/GameStorage';
import RecogniseGame from './games/RecogniseGame';
import RememberGame from './games/RememberGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import DailyRoutineGame from './games/DailyRoutineGame';
import FamilyMemoryGame from '../games/family/FamilyMemoryGame';
import { Heart } from 'lucide-react';

interface GamesScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function GamesScreen({ onNavigate, isOnline = navigator.onLine }: GamesScreenProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalGames: 0, currentStreak: 0, averageAccuracy: 0 });

  useEffect(() => {
    const loadData = async () => {
      const allSessions = await GameStorage.getPatientSessions(patientId);
      const patientStats = await GameStorage.getPatientStats(patientId);
      let totalAcc = 0;
      allSessions.forEach((s) => (totalAcc += s.accuracy));
      const avgAcc = allSessions.length > 0 ? Math.round(totalAcc / allSessions.length) : 0;
      setStats({ totalGames: allSessions.length, currentStreak: patientStats.currentStreak, averageAccuracy: avgAcc });
    };
    loadData();
  }, [patientId]);

  if (activeGame === 'family-memory-game') return <FamilyMemoryGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'recognise-game') return <RecogniseGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'remember-game') return <RememberGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'memory-match') return <MemoryMatchGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'daily-routine') return <DailyRoutineGame onBack={() => setActiveGame(null)} />;

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
        {/* Info banner */}
        <div className="relative overflow-hidden rounded-[24px] border border-sky-200 bg-[linear-gradient(135deg,#F0F9FF_0%,#EFF6FF_55%,#FFFFFF_100%)] p-4 flex items-start gap-3 shadow-sm">
          <span className="h-9 w-9 rounded-full bg-white border border-sky-200 shadow-sm inline-flex items-center justify-center flex-shrink-0">
            <Info size={18} className="text-sky-600" />
          </span>
          <p className="text-[13px] font-medium leading-relaxed text-sky-900/80 flex-1">
            Gentle cognitive exercises designed for elder engagement. Difficulty adapts automatically to your comfort.
          </p>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance('These games are designed for cognitive engagement and enjoyment. Choose any game below to keep your mind active.');
                u.rate = 0.85;
                window.speechSynthesis.speak(u);
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-extrabold shadow-sm hover:bg-sky-50 active:scale-95 transition-all"
          >
            🔊 Listen
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Trophy size={16} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-[22px] font-black tracking-tight text-[var(--color-text)]">{stats.totalGames}</p>
            <p className="text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)]">PLAYED</p>
          </div>
          <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-center">
            <div className="mx-auto h-8 w-8 rounded-full bg-white border border-amber-200 flex items-center justify-center">
              <Flame size={16} className="text-amber-600" />
            </div>
            <p className="mt-2 text-[22px] font-black tracking-tight text-amber-900">{stats.currentStreak}</p>
            <p className="text-[11px] font-extrabold tracking-wide text-amber-700">STREAK</p>
          </div>
          <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Target size={16} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-[22px] font-black tracking-tight text-[var(--color-text)]">{stats.averageAccuracy}%</p>
            <p className="text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)]">ACCURACY</p>
          </div>
        </div>

        <div className="flex items-baseline justify-between px-1">
          <h3 className="text-[13px] font-black tracking-[0.08em] text-[var(--color-text-muted)]">AVAILABLE GAMES</h3>
          <span className="text-[11px] font-bold text-[var(--color-text-faint)]">Tap to play</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <GameCard
            title="Family Memory Quiz"
            desc="Recognize grandchildren, sons, daughters, and their hobbies with speech and photos."
            icon={<Heart size={28} className="text-white fill-current" />}
            accent="rose"
            badge="Recommended"
            meta={['Family Faces', 'Voice Guided']}
            cta="Play Family Quiz"
            onPress={() => setActiveGame('family-memory-game')}
          />
          <GameCard
            title="Remember"
            desc="Look at familiar objects, then recall which ones you saw."
            icon={<Eye size={28} />}
            accent="emerald"
            badge="Ready"
            meta={['5 Levels', '3–6 Objects']}
            cta="Start Activity"
            onPress={() => setActiveGame('remember-game')}
          />
          <GameCard
            title="Memory Match"
            desc="Find matching pairs of images. Tests visual memory and recall."
            icon={<Brain size={28} />}
            accent="sky"
            badge="Ready"
            meta={['5 Levels', 'Pairs']}
            cta="Start Activity"
            onPress={() => setActiveGame('memory-match')}
          />
          <GameCard
            title="Recognise"
            desc="Find patterns, sequences, and what is different."
            icon={<Eye size={28} />}
            accent="amber"
            badge="Trending"
            meta={['5 Levels', '3 Types']}
            cta="Start Activity"
            onPress={() => setActiveGame('recognise-game')}
          />
          <GameCard
            title="Daily Routine"
            desc="Order daily habits in sequence from morning to night."
            icon={<Sun size={28} />}
            accent="emerald"
            badge="New"
            meta={['5 Levels', 'Temporal']}
            cta="Start Activity"
            onPress={() => setActiveGame('daily-routine')}
          />
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] px-1 py-2 rounded-full hover:bg-[var(--color-card-hover)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    </>
  );
}

function GameCard({
  title,
  desc,
  icon,
  accent,
  badge,
  meta,
  cta,
  onPress,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: 'emerald' | 'sky' | 'amber' | 'rose';
  badge: string;
  meta: string[];
  cta: string;
  onPress: () => void;
}) {
  const styles: Record<string, { wrap: string; icon: string; badge: string; cta: string }> = {
    rose: {
      wrap: 'bg-[linear-gradient(135deg,#FFF1F2_0%,#FFE4E6_55%,#FFFFFF_100%)] border-rose-200 hover:border-rose-300 hover:shadow-[0_16px_32px_rgba(244,63,94,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#E11D48,#F43F5E)] text-white shadow-[0_10px_20px_rgba(244,63,94,0.28)] border-white/20',
      badge: 'bg-rose-500 text-white border-rose-600',
      cta: 'bg-rose-600 text-white shadow-[0_8px_16px_rgba(244,63,94,0.22)]',
    },
    emerald: {
      wrap: 'bg-[linear-gradient(135deg,#ECFDF5_0%,#F0FDF4_60%,#FFFFFF_100%)] border-emerald-200 hover:border-emerald-300 hover:shadow-[0_16px_32px_rgba(16,185,129,0.16)]',
      icon: 'bg-[linear-gradient(135deg,#059669,#10B981)] text-white shadow-[0_10px_20px_rgba(16,185,129,0.28)] border-white/20',
      badge: 'bg-emerald-500 text-white border-emerald-600',
      cta: 'bg-emerald-600 text-white shadow-[0_8px_16px_rgba(16,185,129,0.22)]',
    },
    sky: {
      wrap: 'bg-[linear-gradient(135deg,#F0F9FF_0%,#EFF6FF_60%,#FFFFFF_100%)] border-sky-200 hover:border-sky-300 hover:shadow-[0_16px_32px_rgba(14,165,233,0.14)]',
      icon: 'bg-[linear-gradient(135deg,#0284C7,#0EA5E9)] text-white shadow-[0_10px_20px_rgba(14,165,233,0.28)] border-white/20',
      badge: 'bg-sky-500 text-white border-sky-600',
      cta: 'bg-sky-600 text-white shadow-[0_8px_16px_rgba(14,165,233,0.22)]',
    },
    amber: {
      wrap: 'bg-[linear-gradient(135deg,#FFFBEB_0%,#FEF3C7_55%,#FFFFFF_100%)] border-amber-200 hover:border-amber-300 hover:shadow-[0_16px_32px_rgba(245,158,11,0.14)]',
      icon: 'bg-[linear-gradient(135deg,#D97706,#F59E0B)] text-white shadow-[0_10px_20px_rgba(245,158,11,0.26)] border-white/20',
      badge: 'bg-amber-500 text-white border-amber-600',
      cta: 'bg-amber-600 text-white shadow-[0_8px_16px_rgba(245,158,11,0.22)]',
    },
  };
  const s = styles[accent];
  return (
    <Card onPress={onPress} className={`overflow-hidden border-2 p-0 ${s.wrap} group`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`h-[64px] w-[64px] rounded-[20px] border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-[1.04] ${s.icon}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-[18px] font-black tracking-tight text-[var(--color-text)]">{title}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black tracking-wide border ${s.badge}`}>{badge}</span>
            </div>
            <p className="text-[13px] font-medium leading-relaxed text-[var(--color-text-secondary)] mt-1">{desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {meta.map((m) => (
                <span key={m} className="px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)] shadow-sm">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-muted)]">
            <Sparkles size={12} className="text-amber-500" /> Adaptive difficulty
          </span>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-extrabold ${s.cta} group-hover:translate-x-0.5 transition-transform`}>
            <Play size={14} /> {cta}
          </span>
        </div>
      </div>
    </Card>
  );
}
