import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookHeart,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Image as ImageIcon,
  LifeBuoy,
  Moon,
  Phone,
  Play,
  Sunrise,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { ACTIVITIES, TONE_STYLES } from '../data/activities';
import { Button, Card, ProgressRing, Section, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { useVoice } from '../hooks/useVoice';
import { reminderService } from '../services/ReminderService';
import { gameSessionRepository } from '../database';
import type { Reminder } from '../database/db';

export interface PatientHomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

function greetingKey(hour: number) {
  if (hour < 12) return 'home.morning';
  if (hour < 17) return 'home.afternoon';
  if (hour < 21) return 'home.evening';
  return 'home.night';
}

function calculateStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0;
  const days = new Set(
    timestamps.map((ts) => {
      const d = new Date(ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 400; i += 1) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      // today not played yet — keep counting from yesterday
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function PatientHomeScreen({ onNavigate }: PatientHomeScreenProps) {
  const { state, toggleTheme } = useApp();
  const { t, meta, lang } = useI18n();
  const { speak, isSpeaking } = useVoice();

  const patient = state.currentPatient;
  const patientName = patient?.name || t('auth.elderName');
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, { level: number; done: boolean }>>({});

  const load = useCallback(async (uid: number) => {
    try {
      const [all, sessions, stats] = await Promise.all([
        reminderService.getAllReminders(uid),
        gameSessionRepository.getByUserId(uid),
        gameSessionRepository.getStats(uid),
      ]);
      setReminders(all);

      const today = sessions.filter((s) => {
        const d = new Date(s.createdAt);
        const now = new Date();
        return (
          d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      });
      setSessionsToday(today.length);
      setStreak(calculateStreak(sessions.map((s) => s.createdAt)));
      setAccuracy(stats.totalGames > 0 && stats.averageAccuracy > 0 ? Math.round(stats.averageAccuracy) : null);

      const next: Record<string, { level: number; done: boolean }> = {};
      for (const a of ACTIVITIES) {
        const mine = sessions.filter((s) => (s.gameType as string) === a.id);
        next[a.id] = {
          done: today.some((s) => (s.gameType as string) === a.id),
          level: mine.length ? Math.min(5, Math.max(...mine.map((s) => s.difficulty || 1))) : 1,
        };
      }
      setLevels(next);
    } catch {
      /* offline / empty database is a normal state */
    }
  }, []);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const greeting = t(greetingKey(new Date().getHours()));
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(meta.htmlLang, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    [meta.htmlLang],
  );

  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(meta.htmlLang, { hour: 'numeric', minute: '2-digit', hour12: true }),
    [meta.htmlLang],
  );
  const [busy, setBusy] = useState(false);
  const [snoozedUntil, setSnoozedUntil] = useState<Record<number, number>>({});

  const { pending, doneToday } = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    const pending = reminders
      .filter((r) => r.status === 'pending' && r.scheduledTime < endOfDay)
      .sort((a, b) => a.scheduledTime - b.scheduledTime);

    const doneToday = reminders.filter(
      (r) => r.status === 'completed' && r.scheduledTime >= startOfDay && r.scheduledTime < endOfDay
    ).length;

    return { pending, doneToday };
  }, [reminders]);
  const nextReminder = pending[0];

  const suggested = useMemo(
    () => ACTIVITIES.find((a) => !levels[a.id]?.done) ?? ACTIVITIES[0],
    [levels],
  );

  const completedCount = ACTIVITIES.filter((a) => levels[a.id]?.done).length;

  const completeReminder = async (rem: Reminder) => {
    if (!userId || !rem.id || busy) return;
    setBusy(true);
    try {
      await reminderService.completeReminder(rem.id, userId);
      speak(t('games.wellDone'));
      await load(userId);
    } finally {
      setBusy(false);
    }
  };
  const snoozeReminder = async (rem: Reminder) => {
    if (!userId || !rem.id || busy) return;
    setBusy(true);
    try {
      const snoozeMinutes = 15;
      await reminderService.snoozeReminder(rem.id, snoozeMinutes);
      const until = Date.now() + snoozeMinutes * 60 * 1000;
      setSnoozedUntil((prev) => ({ ...prev, [rem.id!]: until }));
      speak(`${rem.title} ${t('home.snooze')}. ${timeFmt.format(new Date(until))}`);
      await load(userId);
    } finally {
      setBusy(false);
    }
  };

  const readPage = async () => {
    const parts = [`${greeting}, ${patientName}.`];
    if (nextReminder)
      parts.push(`${t('home.nextReminder')}: ${nextReminder.title} ${timeFmt.format(new Date(nextReminder.scheduledTime))}.`);
    else parts.push(t('home.noReminderToday'));
    if (!levels[suggested.id]?.done) parts.push(`${t('home.startGame')}: ${t(suggested.titleKey)}.`);
    parts.push(t('home.takeYourTime'));
    await speak(parts.join(' '), lang);
  };

  return (
    <AppShell
      persona="elder"
      activeTab="home"
      onNavigate={onNavigate}
      onOpenSos={() => window.dispatchEvent(new Event('open-safe-return'))}
      onToggleTheme={toggleTheme}
      onOpenLanguage={() => onNavigate('settings')}
      theme={state.accessibility?.theme}
      identity={{ name: patientName, sub: `${t('auth.elder')} · ${patient?.age ?? 72}` }}
      title={`${greeting}, ${patientName}`}
      shortTitle={patientName}
      subtitle={todayLabel}
      actions={
        <Button
          variant="secondary"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={readPage}
          loading={isSpeaking}
          icon={<Volume2 className="h-4 w-4" />}
        >
          {t('home.hearThis')}
        </Button>
      }
    >
      {/* ── Hero: today's single gentle next step ─────────────────────── */}
      <section className="rise-in">
        <Card tone="ink" className="overflow-hidden !p-0">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="teal" className="!border-white/25 !bg-white/12 !text-white">
                  <Sunrise className="h-3 w-3" /> {t('home.todayEyebrow')}
                </Tag>
                {streak > 0 && (
                  <Tag className="!border-white/25 !bg-white/12 !text-white">
                    <Flame className="h-3 w-3" /> {streak} {t('home.streak')}
                  </Tag>
                )}
              </div>

              <h2
                className="mt-3 text-[1.75rem] leading-[1.15] text-[#FBF6EE] sm:text-[2.15rem]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              >
                {t(suggested.titleKey)}
              </h2>
              <p className="mt-1.5 max-w-md text-[0.95rem] leading-relaxed text-[#CFE3DD]">{t(suggested.descKey)}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="saffron"
                  size="lg"
                  onClick={() => onNavigate(suggested.route)}
                  icon={<Play className="h-[18px] w-[18px]" />}
                >
                  {levels[suggested.id]?.done ? t('home.playAgain') : t('home.startGame')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={readPage}
                  loading={isSpeaking}
                  icon={<Volume2 className="h-4 w-4" />}
                >
                  {t('home.hearThis')}
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-5 rounded-[var(--r-lg)] bg-white/8 p-4 ring-1 ring-white/12">
              <ProgressRing value={(completedCount / ACTIVITIES.length) * 100} size={78} stroke={7} tone="#E8A94E">
                <span className="t-num text-[1.05rem] font-extrabold text-[#FBF6EE]">
                  {completedCount}/{ACTIVITIES.length}
                </span>
              </ProgressRing>
              <div>
                <div className="text-[0.92rem] font-bold text-[#FBF6EE]">{t('home.sessionsToday')}</div>
                <div className="text-[0.78rem] text-[#AFCBC4]">
                  {sessionsToday} {t('prog.sessions').toLowerCase()}
                </div>
                {accuracy !== null && (
                  <div className="mt-1 flex items-center gap-1 text-[0.78rem] text-[#AFCBC4]">
                    <TrendingUp className="h-3.5 w-3.5" /> {accuracy}% {t('prog.accuracy').toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Next reminder ─────────────────────────────────────────────── */}
      <div className="mt-4 rise-in delay-1">
        {nextReminder ? (
          <Card tone="sage">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--brand-teal)] text-white">
                <Bell className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="t-eyebrow !text-[var(--brand-teal-deep)] opacity-80 flex items-center gap-1.5">
                  {t('home.nextReminder')}
                  {snoozedUntil[nextReminder.id!] && Date.now() < snoozedUntil[nextReminder.id!] && (
                    <Tag tone="saffron">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {t('home.snooze')} (15m)
                    </Tag>
                  )}
                </div>
                <div className="mt-0.5 truncate text-[1.15rem] font-bold text-ink">{nextReminder.title}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink-2">
                  <Clock className="h-4 w-4" /> {timeFmt.format(new Date(nextReminder.scheduledTime))}
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Button block size="lg" disabled={busy} onClick={() => completeReminder(nextReminder)} icon={<Check className="h-[18px] w-[18px]" />}>
                  {t('home.taken')}
                </Button>
                <Button variant="secondary" size="lg" disabled={busy} onClick={() => snoozeReminder(nextReminder)}>
                  {snoozedUntil[nextReminder.id!] && Date.now() < snoozedUntil[nextReminder.id!] ? '+15m' : t('home.snooze')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card tone="sage">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--brand-teal)] text-white">
                <Check className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <div className="text-[1.05rem] font-bold text-ink">{t('home.noReminderToday')}</div>
                <div className="t-sm">{t('home.noReminderBody')}</div>
              </div>
              <div className="ml-auto hidden items-center gap-2 text-[0.82rem] font-semibold text-ink-3 sm:flex">
                <Check className="h-4 w-4" /> {doneToday} {t('rem.completed').toLowerCase()}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── Activities grid ───────────────────────────────────────────── */}
      <Section
        className="mt-6"
        title={t('home.myActivities')}
        subtitle={t('games.subtitle')}
        action={
          <button type="button" className="t-sm font-bold text-brand hover:underline" onClick={() => onNavigate('games')}>
            {t('c.viewAll')}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map((a) => {
            const meta2 = levels[a.id];
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate(a.route)}
                className="card card--interactive card--pad min-h-[112px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-[var(--r-sm)]"
                    style={{ background: TONE_STYLES[a.tone].bg, color: TONE_STYLES[a.tone].fg }}
                  >
                    <Icon className="h-[22px] w-[22px]" />
                  </span>
                  {meta2?.done ? (
                    <Tag tone="success" icon={<Check className="h-3 w-3" />}>
                      {t('home.doneToday')}
                    </Tag>
                  ) : (
                    <Tag>{t('games.levelN', { n: meta2?.level ?? 1 })}</Tag>
                  )}
                </div>
                <div className="mt-3 text-[1rem] font-bold text-ink">{t(a.titleKey)}</div>
                <div className="t-xs mt-0.5 line-clamp-2">{t(a.descKey)}</div>
                <div className="mt-2 flex items-center gap-1 text-[0.78rem] font-bold" style={{ color: TONE_STYLES[a.tone].fg }}>
                  {a.minutes} {t('c.min')} <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Family album + progress ───────────────────────────────────── */}
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <button type="button" onClick={() => onNavigate('memory-book')} className="card card--interactive card--pad card--saffron text-left">
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--brand-saffron)] text-[#2B1A03]">
              <BookHeart className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-[1.05rem] font-bold text-ink">{t('home.myAlbum')}</div>
              <div className="t-sm">{t('mem.subtitle')}</div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-[var(--brand-saffron-ink)]" />
          </div>
        </button>

        <button type="button" onClick={() => onNavigate('progress')} className="card card--interactive card--pad text-left">
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--info-soft)] text-[var(--info)]">
              <TrendingUp className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-[1.05rem] font-bold text-ink">{t('home.myProgress')}</div>
              <div className="t-sm">
                {accuracy !== null ? `${accuracy}% ${t('prog.accuracy').toLowerCase()}` : t('prog.noneBody')}
              </div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-ink-4" />
          </div>
        </button>
      </div>

      {/* ── Safety & comfort strip ────────────────────────────────────── */}
      <Section className="mt-6" title={t('saf.title')} subtitle={t('saf.subtitle')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-safe-return'))}
            className="card card--pad card--interactive text-left"
            style={{ background: 'var(--danger)', borderColor: 'transparent', color: '#fff' }}
          >
            <LifeBuoy className="h-7 w-7" />
            <div className="mt-2.5 text-[1.05rem] font-extrabold">{t('home.imLost')}</div>
            <div className="mt-0.5 text-[0.82rem] leading-snug text-white/80">{t('home.imLostBody')}</div>
          </button>

          <a href="tel:+919999999999" className="card card--pad card--interactive text-left">
            <Phone className="h-7 w-7 text-brand" />
            <div className="mt-2.5 text-[1.05rem] font-bold text-ink">{t('home.callFamily')}</div>
            <div className="t-sm mt-0.5">{t('saf.emergencyContact')}</div>
          </a>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-sundowning'))}
            className="card card--pad card--interactive text-left"
          >
            <Moon className="h-7 w-7 text-[var(--brand-saffron)]" />
            <div className="mt-2.5 text-[1.05rem] font-bold text-ink">{t('home.eveningCalm')}</div>
            <div className="t-sm mt-0.5">{t('home.eveningCalmBody')}</div>
          </button>
        </div>
      </Section>

      <p className="t-sm mt-7 flex items-center justify-center gap-2 text-center">
        <ImageIcon className="h-4 w-4 opacity-60" />
        {t('home.takeYourTime')}
      </p>
      <p className="sr-only">{t('app.tagline')}</p>
    </AppShell>
  );
}
