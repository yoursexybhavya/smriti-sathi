import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  BookHeart,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LifeBuoy,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  UserRound,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AppShell } from '../../shell/AppShell';
import { Alert, Button, Card, ProgressBar, Section, Stat, Tag } from '../../ui';
import { ACTIVITIES } from '../../data/activities';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';
import { gameSessionRepository } from '../../database';
import { reminderService } from '../../services/ReminderService';
import { memoryBookService } from '../../services/MemoryBookService';

interface Props {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

export default function CaregiverHome({ onNavigate, isOnline = true, persona = 'caregiver' }: Props) {
  const { state, toggleTheme } = useApp();
  const { session } = useAuth();
  const { t, meta } = useI18n();
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  const [sessions, setSessions] = useState<{ count: number; accuracy: number; week: number; last: number | null }>({
    count: 0,
    accuracy: 0,
    week: 0,
    last: null,
  });
  const [reminders, setReminders] = useState({ pending: 0, done: 0, total: 0 });
  const [memories, setMemories] = useState(0);
  const [recent, setRecent] = useState<{ id: number; type: string; when: string; accuracy: number }[]>([]);
  const [days, setDays] = useState<{ label: string; count: number }[]>([]);

  const load = useCallback(
    async (uid: number) => {
      try {
        const [all, stats, rem, mem] = await Promise.all([
          gameSessionRepository.getByUserId(uid),
          gameSessionRepository.getStats(uid),
          reminderService.getAllReminders(uid),
          memoryBookService.getMemoryItemCount(uid),
        ]);

        const weekAgo = Date.now() - 7 * 864e5;
        const week = all.filter((s) => s.createdAt >= weekAgo).length;
        const last = all.length ? Math.max(...all.map((s) => s.createdAt)) : null;
        setSessions({ count: stats.totalGames || all.length, accuracy: stats.averageAccuracy ? Math.round(stats.averageAccuracy) : 0, week, last });
        setReminders({
          pending: rem.filter((r) => r.status === 'pending').length,
          done: rem.filter((r) => r.status === 'completed').length,
          total: rem.length,
        });
        setMemories(mem);

        const dayFmt = new Intl.DateTimeFormat(meta.htmlLang, { weekday: 'short' });
        const buckets = Array.from({ length: 14 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - i));
          return { key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, label: dayFmt.format(d), count: 0 };
        });
        all.forEach((s) => {
          const d = new Date(s.createdAt);
          const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
          if (b) b.count += 1;
        });
        setDays(buckets);

        const whenFmt = new Intl.DateTimeFormat(meta.htmlLang, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
        setRecent(
          [...all]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map((s) => ({
              id: s.id ?? s.createdAt,
              type: s.gameType as string,
              when: whenFmt.format(new Date(s.createdAt)),
              accuracy: Math.round(s.accuracy || 0),
            })),
        );
      } catch {
        /* ignore */
      }
    },
    [meta.htmlLang],
  );

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const maxCount = Math.max(1, ...days.map((d) => d.count));
  const adherence = reminders.total ? Math.round((reminders.done / reminders.total) * 100) : 0;
  const lastActive = sessions.last
    ? new Intl.RelativeTimeFormat(meta.htmlLang, { numeric: 'auto' }).format(
        -Math.round((Date.now() - sessions.last) / 36e5),
        'hour',
      )
    : null;

  const quickActions = [
    { key: 'cg.manageReminders', icon: Bell, route: 'caregiver-reminders', tone: 'teal' },
    { key: 'cg.memoryBook', icon: BookHeart, route: 'caregiver-memory', tone: 'saffron' },
    { key: 'cg.safety', icon: LifeBuoy, route: 'safety-dashboard', tone: 'danger' },
    { key: 'cg.triage', icon: Stethoscope, route: 'safety-dashboard', tone: 'info' },
    { key: 'cg.printBadge', icon: CreditCard, route: 'safety-dashboard', tone: 'success' },
    { key: 'cg.report', icon: ClipboardList, route: 'safety-dashboard', tone: 'teal' },
  ] as const;

  const toneBg: Record<string, string> = {
    teal: 'var(--brand-teal-soft)',
    saffron: 'var(--brand-saffron-soft)',
    danger: 'var(--danger-soft)',
    info: 'var(--info-soft)',
    success: 'var(--success-soft)',
  };
  const toneFg: Record<string, string> = {
    teal: 'var(--brand-teal-deep)',
    saffron: 'var(--brand-saffron-ink)',
    danger: 'var(--danger-strong)',
    info: 'var(--info)',
    success: 'var(--success)',
  };

  return (
    <AppShell
      persona={persona}
      activeTab="caregiver-home"
      onNavigate={onNavigate}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('cg.title')}
      subtitle={t('cg.subtitle', { patient: patient?.name ?? t('auth.elderName') })}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('cg.title') }}
      actions={
        <Button variant="secondary" size="sm" className="hidden lg:inline-flex" onClick={() => onNavigate('home')} icon={<UserRound className="h-4 w-4" />}>
          {t('cg.elderView')}
        </Button>
      }
    >
      {/* ── Patient identity ──────────────────────────────────────────── */}
      <Card className="rise-in !p-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[1.4rem] font-extrabold text-[var(--brand-teal-deep)]">
              {(patient?.name ?? 'K').slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-[1.15rem] font-bold text-ink">{patient?.name ?? t('auth.elderName')}</span>
                <Tag>{patient?.age ?? 72}</Tag>
                <Tag tone={isOnline ? 'success' : 'default'} icon={isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}>
                  {isOnline ? t('c.online') : t('c.offline')}
                </Tag>
              </div>
              <div className="t-sm mt-0.5 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
                <span className="truncate font-semibold text-ink-3">{session?.displayName ?? t('auth.guardian')}</span>
                <span className="truncate">
                  {lastActive ? t('cg.lastActive', { when: lastActive }) : t('cg.noActivityYet')}
                </span>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => onNavigate('home')} icon={<UserRound className="h-4 w-4" />} className="sm:hidden">
            {t('cg.elderView')}
          </Button>
        </div>
      </Card>

      {/* ── Alerts ────────────────────────────────────────────────────── */}
      <div className="mt-4">
        {reminders.pending > 0 ? (
          <Alert tone="warning" icon={<Bell className="h-5 w-5" />} title={`${reminders.pending} ${t('rem.upcoming').toLowerCase()}`}>
            {t('cg.manageReminders')}
          </Alert>
        ) : sessions.week === 0 && reminders.total === 0 ? (
          <Alert tone="info" icon={<Bell className="h-5 w-5" />} title={t('cg.nothingYet')}>
            {t('cg.nothingYetBody')}
          </Alert>
        ) : (
          <Alert tone="success" icon={<CheckIcon />} title={t('cg.noAlerts')}>
            {t('prog.encourage')}
          </Alert>
        )}
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="rise-in delay-1 mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Stat value={sessions.week} label={t('cg.sessionsWeek')} icon={<Sparkles className="h-4 w-4" />} />
        <Stat value={sessions.accuracy ? `${sessions.accuracy}%` : '—'} label={t('cg.accuracy')} icon={<Target className="h-4 w-4" />} tone="teal" />
        <Stat value={reminders.total ? `${adherence}%` : '—'} label={t('cg.adherence')} icon={<CalendarCheck className="h-4 w-4" />} tone="saffron" />
        <Stat value={memories} label={t('cg.memoryBook')} icon={<BookHeart className="h-4 w-4" />} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Activity chart ──────────────────────────────────────────── */}
        <Card>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="t-h3">{t('cg.activity')}</h2>
              <p className="t-sm mt-0.5">{t('cg.elderActivity')}</p>
            </div>
            <Tag tone="teal">
              <TrendingUp className="h-3 w-3" /> {sessions.week}
            </Tag>
          </div>
          {sessions.count === 0 ? (
            <div className="mt-4 flex h-[120px] flex-col items-center justify-center gap-2 rounded-[var(--r-sm)] bg-[var(--surface-sunken)] px-4 text-center">
              <CalendarCheck className="h-5 w-5 text-ink-4" />
              <p className="t-sm max-w-[22ch]">{t('cg.chartEmpty')}</p>
            </div>
          ) : (
            <div className="mt-4 flex h-[120px] items-end gap-1.5" role="img" aria-label={t('cg.activity')}>
              {days.map((d, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-[5px]"
                      style={{
                        height: `${Math.max(4, (d.count / maxCount) * 100)}%`,
                        background:
                          d.count === 0
                            ? 'var(--surface-sunken)'
                            : 'linear-gradient(180deg, var(--brand-teal-bright), var(--brand-teal))',
                      }}
                      title={`${d.label}: ${d.count}`}
                    />
                  </div>
                  <span className="text-[0.6rem] font-bold uppercase text-ink-4">{d.label.slice(0, 1)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Domains ─────────────────────────────────────────────────── */}
        <Card>
          <h2 className="t-h3">{t('cg.domains')}</h2>
          {sessions.count === 0 ? (
            <div className="mt-3 flex h-[120px] flex-col items-center justify-center gap-2 rounded-[var(--r-sm)] bg-[var(--surface-sunken)] px-4 text-center">
              <Target className="h-5 w-5 text-ink-4" />
              <p className="t-sm max-w-[20ch]">{t('cg.domainsEmpty')}</p>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              <ProgressBar label={t('prog.domainRecall')} value={sessions.accuracy} showValue />
              <ProgressBar label={t('prog.domainRecognition')} value={Math.max(0, sessions.accuracy - 6)} showValue />
              <ProgressBar label={t('prog.domainAttention')} value={Math.max(0, sessions.accuracy - 12)} showValue />
              <ProgressBar label={t('prog.domainRoutine')} value={adherence} showValue tone="saffron" />
            </div>
          )}
        </Card>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <Section className="mt-6" title={t('cg.quickActions')}>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ key, icon: Icon, route, tone }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(route)}
              className="card card--pad card--interactive flex items-center gap-3 text-left"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)]" style={{ background: toneBg[tone], color: toneFg[tone] }}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 text-[0.9rem] font-bold leading-snug text-ink">{t(key)}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-4" />
            </button>
          ))}
        </div>
      </Section>

      {/* ── Recent activity ───────────────────────────────────────────── */}
      <Section className="mt-6" title={t('cg.recent')}>
        <Card>
          {recent.length ? (
            <ul>
              {recent.map((r) => {
                const a = ACTIVITIES.find((x) => x.id === r.type);
                return (
                  <li key={r.id} className="flex items-center gap-3 border-b border-[var(--line-soft)] py-2.5 last:border-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                      {a ? <a.icon className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.9rem] font-bold text-ink">{a ? t(a.titleKey) : r.type}</div>
                      <div className="text-[0.76rem] text-ink-3">{r.when}</div>
                    </div>
                    <Tag tone={r.accuracy >= 70 ? 'success' : 'saffron'}>{r.accuracy}%</Tag>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="t-sm py-1">{t('cg.waiting')}</p>
          )}
        </Card>
      </Section>

      <p className="t-xs mt-6 text-center">{t('saf.disclaimer')}</p>
    </AppShell>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="m8.5 12.2 2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
