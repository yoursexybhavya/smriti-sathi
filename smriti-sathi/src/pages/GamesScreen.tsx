import { useState, useEffect } from 'react';
import { Brain, ArrowLeft, Sparkles, Info, Eye, Sun, Play, Trophy, Flame, Target } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../hooks/useVoice';
import type { Language } from '../i18n/translations';
import { GameStorage } from '../services/storage/GameStorage';
import RecogniseGame from './games/RecogniseGame';
import RememberGame from './games/RememberGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import DailyRoutineGame from './games/DailyRoutineGame';
import FamilyMemoryGame from '../games/family/FamilyMemoryGame';
import { Heart } from 'lucide-react';

const GAME_BANNER_PROMPTS: Record<Language, string> = {
  en: 'Gentle cognitive exercises designed for elder engagement. Difficulty adapts automatically to your comfort.',
  as: 'বয়োজ্যেষ্ঠসকলৰ বাবে প্ৰস্তুত কৰা স্মৃতি আৰু মনোযোগৰ শান্ত খেল। আপোনাৰ সুবিধা অনুযায়ী স্তৰ নিজে সলনি হয়।',
  brx: 'गोसोखौ मोजां लाखिनो बानायनाय सुलुम गेलेनाय। नोंथांनि गोसोबायदि बेयो सोलायगोन।',
  mni: 'ৱাখলবু মপুং ফাহন্নবা অমসুং শক্তি হাপ্পদা মতেং পাংবা শান্নবশিং। অদোমগী খুদোংচাবগী মতুং ইন্না মহাকপু শেমগৎকনি।'
};

interface GamesScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function GamesScreen({ onNavigate, isOnline = navigator.onLine }: GamesScreenProps) {
  const { state } = useApp();
  const { language } = useLanguage();
  const { speak } = useVoice();
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-44 sm:pb-52 space-y-6 sm:space-y-8">
        {/* Info banner */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-200 dark:border-sky-900/70 bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/40 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <span className="h-10 w-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 shadow-xs inline-flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-sky-600 dark:text-sky-400" />
          </span>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-sky-950 dark:text-sky-200 flex-1">
            Gentle cognitive exercises designed for elder engagement. Difficulty adapts automatically to your comfort.
          </p>
          <button
            type="button"
            onClick={() => speak(GAME_BANNER_PROMPTS[language] || GAME_BANNER_PROMPTS.en, language)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 text-xs font-extrabold shadow-xs hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Listen to game guide in selected language"
          >
            🔊 Listen
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Trophy size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text)]">{stats.totalGames}</p>
            <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[var(--color-text-muted)]">PLAYED</p>
          </div>
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 sm:p-5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-2xl bg-white dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Flame size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-amber-950 dark:text-amber-200">{stats.currentStreak}</p>
            <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-amber-800 dark:text-amber-400">STREAK</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text)]">{stats.averageAccuracy}%</p>
            <p className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[var(--color-text-muted)]">ACCURACY</p>
          </div>
        </div>

        <div className="flex items-baseline justify-between px-1">
          <h3 className="text-xs sm:text-sm font-black tracking-[0.08em] text-[var(--color-text-muted)]">AVAILABLE GAMES</h3>
          <span className="text-xs font-bold text-[var(--color-text-faint)]">Tap to play</span>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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

        {/* Calm Elder Cognitive Guide / Motivational Section for Tablet & Desktop */}
        <div className="rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl shadow-xs">
                🧠
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                    Evidence-Based Neuroplasticity & Memory Care
                  </h4>
                  <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Non-stressful
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
                  Daily visual recognition and chronological sequencing exercise active memory pathways without cognitive fatigue. Take your time, enjoy each exercise, and celebrate daily streaks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] px-4 py-2.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-text)] transition-colors shadow-xs cursor-pointer"
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
      wrap: 'bg-rose-50/70 dark:bg-slate-900/90 border-rose-200 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-[0_16px_32px_rgba(244,63,94,0.14)]',
      icon: 'bg-rose-600 text-white shadow-[0_8px_18px_rgba(244,63,94,0.28)] border-rose-500/30',
      badge: 'bg-rose-500 text-white border-rose-600',
      cta: 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_6px_14px_rgba(244,63,94,0.22)]',
    },
    emerald: {
      wrap: 'bg-emerald-50/70 dark:bg-slate-900/90 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_16px_32px_rgba(16,185,129,0.14)]',
      icon: 'bg-emerald-600 text-white shadow-[0_8px_18px_rgba(16,185,129,0.28)] border-emerald-500/30',
      badge: 'bg-emerald-500 text-white border-emerald-600',
      cta: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_6px_14px_rgba(16,185,129,0.22)]',
    },
    sky: {
      wrap: 'bg-sky-50/70 dark:bg-slate-900/90 border-sky-200 dark:border-sky-900/60 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-[0_16px_32px_rgba(14,165,233,0.14)]',
      icon: 'bg-sky-600 text-white shadow-[0_8px_18px_rgba(14,165,233,0.28)] border-sky-500/30',
      badge: 'bg-sky-500 text-white border-sky-600',
      cta: 'bg-sky-600 hover:bg-sky-700 text-white shadow-[0_6px_14px_rgba(14,165,233,0.22)]',
    },
    amber: {
      wrap: 'bg-amber-50/70 dark:bg-slate-900/90 border-amber-200 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-[0_16px_32px_rgba(245,158,11,0.14)]',
      icon: 'bg-amber-600 text-white shadow-[0_8px_18px_rgba(245,158,11,0.26)] border-amber-500/30',
      badge: 'bg-amber-500 text-white border-amber-600',
      cta: 'bg-amber-600 hover:bg-amber-700 text-white shadow-[0_6px_14px_rgba(245,158,11,0.22)]',
    },
  };
  const s = styles[accent];
  return (
    <Card onPress={onPress} className={`overflow-hidden border-2 p-0 ${s.wrap} group min-h-[175px] sm:min-h-[200px]`}>
      <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between h-full">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className={`h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-2xl sm:rounded-3xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-[1.04] ${s.icon}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-[18px] sm:text-[21px] font-black tracking-tight text-[var(--color-text)]">{title}</h4>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide border ${s.badge}`}>{badge}</span>
            </div>
            <p className="text-[13px] sm:text-[15px] font-medium leading-relaxed text-[var(--color-text-secondary)] mt-1.5">{desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {meta.map((m) => (
                <span key={m} className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-[var(--color-border)] text-[11px] font-extrabold tracking-wide text-[var(--color-text-secondary)] shadow-2xs">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-muted)]">
            <Sparkles size={13} className="text-amber-500" /> Adaptive difficulty
          </span>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-extrabold ${s.cta} group-hover:translate-x-0.5 transition-transform`}>
            <Play size={14} /> {cta}
          </span>
        </div>
      </div>
    </Card>
  );
}
