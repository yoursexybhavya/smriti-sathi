import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronRight, Clock, Heart, Sparkles } from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { ACTIVITIES, TONE_STYLES } from '../data/activities';
import { Button, Card, Section, Stat, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { gameSessionRepository } from '../database';

interface Props {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function GamesScreen({ onNavigate }: Props) {
  const { state, toggleTheme } = useApp();
  const { t } = useI18n();
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  const [levels, setLevels] = useState<Record<string, { level: number; done: boolean }>>({});
  const [totals, setTotals] = useState({ played: 0, streak: 0, accuracy: 0 });

  const load = useCallback(async (uid: number) => {
    try {
      const [sessions, stats] = await Promise.all([
        gameSessionRepository.getByUserId(uid),
        gameSessionRepository.getStats(uid),
      ]);
      const now = new Date();
      const today = sessions.filter((s) => {
        const d = new Date(s.createdAt);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const next: Record<string, { level: number; done: boolean }> = {};
      for (const a of ACTIVITIES) {
        const mine = sessions.filter((s) => (s.gameType as string) === a.id);
        next[a.id] = {
          done: today.some((s) => (s.gameType as string) === a.id),
          level: mine.length ? Math.min(5, Math.max(...mine.map((s) => s.difficulty || 1))) : 1,
        };
      }
      setLevels(next);
      setTotals({
        played: stats.totalGames || 0,
        streak: 0,
        accuracy: stats.averageAccuracy ? Math.round(stats.averageAccuracy) : 0,
      });
    } catch {
      /* empty state is fine */
    }
  }, []);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const suggested = ACTIVITIES.find((a) => !levels[a.id]?.done) ?? ACTIVITIES[0];

  return (
    <AppShell
      persona="elder"
      activeTab="games"
      onNavigate={onNavigate}
      onOpenSos={() => window.dispatchEvent(new Event('open-safe-return'))}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('games.title')}
      subtitle={t('games.subtitle')}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('auth.elder') }}
    >
      <div className="rise-in grid grid-cols-3 gap-2.5">
        <Stat value={totals.played} label={t('games.title')} icon={<Sparkles className="h-4 w-4" />} />
        <Stat value={totals.accuracy ? `${totals.accuracy}%` : '—'} label={t('prog.accuracy')} tone="teal" />
        <Stat value={`${Object.values(levels).filter((l) => l?.done).length}/4`} label={t('home.doneToday')} tone="saffron" />
      </div>

      {/* Recommended hero */}
      <Card tone="ink" className="rise-in delay-1 mt-4 !p-0">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Tag className="!border-white/25 !bg-white/12 !text-white">
              <Sparkles className="h-3 w-3" /> {t('games.recommended')}
            </Tag>
            <h2 className="mt-2.5 text-[1.45rem] leading-tight text-[#FBF6EE]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {t(suggested.titleKey)}
            </h2>
            <p className="mt-1 max-w-[46ch] text-[0.92rem] leading-snug text-[#CFE3DD]">{t(suggested.descKey)}</p>
            <div className="mt-2 flex items-center gap-3 text-[0.78rem] text-[#AFCBC4]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {suggested.minutes} {t('c.min')}
              </span>
              <span>·</span>
              <span>{t('games.levelN', { n: levels[suggested.id]?.level ?? 1 })}</span>
            </div>
          </div>
          <Button variant="saffron" size="lg" onClick={() => onNavigate(suggested.route)} iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}>
            {levels[suggested.id]?.done ? t('home.playAgain') : t('games.start')}
          </Button>
        </div>
      </Card>

      <Section className="mt-6" title={t('home.myActivities')}>
        <div className="grid gap-3 lg:grid-cols-2">
          {ACTIVITIES.map((a) => {
            const meta = levels[a.id];
            const Icon = a.icon;
            const tone = TONE_STYLES[a.tone];
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate(a.route)}
                className="card card--pad card--interactive flex items-start gap-4 text-left"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-md)]" style={{ background: tone.bg, color: tone.fg }}>
                  <Icon className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[1.1rem] font-bold text-ink">{t(a.titleKey)}</span>
                    {meta?.done ? (
                      <Tag tone="success" icon={<Check className="h-3 w-3" />}>
                        {t('home.doneToday')}
                      </Tag>
                    ) : (
                      <Tag>{t('games.levelN', { n: meta?.level ?? 1 })}</Tag>
                    )}
                  </span>
                  <span className="t-sm mt-1 block leading-snug">{t(a.descKey)}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-[0.82rem] font-bold" style={{ color: tone.fg }}>
                    {meta?.done ? t('games.continue') : t('games.start')} <ChevronRight className="h-4 w-4" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Family quiz */}
      <button
        type="button"
        onClick={() => onNavigate('family-memory-game')}
        className="card card--pad card--interactive card--saffron mt-4 flex w-full items-center gap-4 text-left"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-md)] bg-[var(--brand-saffron)] text-[#2B1A03]">
          <Heart className="h-7 w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-[1.05rem] font-bold text-ink">{t('games.familyQuiz')}</span>
          <span className="t-sm mt-0.5 block">{t('games.familyQuizDesc')}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--brand-saffron-ink)]" />
      </button>

      <p className="t-sm mt-6 text-center">{t('games.takeYourTime')}</p>
    </AppShell>
  );
}
