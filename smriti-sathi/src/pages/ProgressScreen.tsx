import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, CalendarCheck, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Button, Card, EmptyState, ProgressBar, Section, Stat, Tag } from '../ui';
import { ACTIVITIES } from '../data/activities';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { gameSessionRepository } from '../database';

interface Props {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

interface DayBucket {
  key: string;
  label: string;
  count: number;
  accuracy: number;
}

export default function ProgressScreen({ onNavigate }: Props) {
  const { state, toggleTheme } = useApp();
  const { t, meta } = useI18n();
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  const [days, setDays] = useState<DayBucket[]>([]);
  const [totals, setTotals] = useState({ sessions: 0, accuracy: 0, streak: 0 });
  const [domain, setDomain] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<{ id: number; type: string; when: string; accuracy: number }[]>([]);

  const load = useCallback(async (uid: number) => {
    try {
      const sessions = await gameSessionRepository.getByUserId(uid);
      const stats = await gameSessionRepository.getStats(uid);

      const map = new Map<string, { count: number; acc: number }>();
      const dayFmt = new Intl.DateTimeFormat(meta.htmlLang, { weekday: 'short' });
      const buckets: DayBucket[] = [];
      for (let i = 13; i >= 0; i -= 1) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        map.set(key, { count: 0, acc: 0 });
        buckets.push({ key, label: dayFmt.format(d), count: 0, accuracy: 0 });
      }
      sessions.forEach((s) => {
        const d = new Date(s.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const b = map.get(key);
        if (b) {
          b.count += 1;
          b.acc += s.accuracy || 0;
        }
      });
      buckets.forEach((b) => {
        const v = map.get(b.key);
        if (v) {
          b.count = v.count;
          b.accuracy = v.count ? Math.round(v.acc / v.count) : 0;
        }
      });
      setDays(buckets);

      const weekAgo = Date.now() - 7 * 864e5;
      const weekSessions = sessions.filter((s) => s.createdAt >= weekAgo);
      setTotals({
        sessions: weekSessions.length,
        accuracy: stats.averageAccuracy ? Math.round(stats.averageAccuracy) : 0,
        streak: (() => {
          const set = new Set(
            sessions.map((s) => {
              const d = new Date(s.createdAt);
              return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            }),
          );
          let n = 0;
          const c = new Date();
          for (let i = 0; i < 400; i += 1) {
            const k = `${c.getFullYear()}-${c.getMonth()}-${c.getDate()}`;
            if (set.has(k)) {
              n += 1;
              c.setDate(c.getDate() - 1);
            } else if (i === 0) {
              c.setDate(c.getDate() - 1);
            } else break;
          }
          return n;
        })(),
      });

      const byDomain: Record<string, { total: number; n: number }> = {};
      sessions.forEach((s) => {
        const a = ACTIVITIES.find((x) => x.id === (s.gameType as string));
        if (!a) return;
        byDomain[a.domain] = byDomain[a.domain] || { total: 0, n: 0 };
        byDomain[a.domain].total += s.accuracy || 0;
        byDomain[a.domain].n += 1;
      });
      const domainOut: Record<string, number> = {};
      Object.entries(byDomain).forEach(([k, v]) => {
        domainOut[k] = v.n ? Math.round(v.total / v.n) : 0;
      });
      setDomain(domainOut);

      const whenFmt = new Intl.DateTimeFormat(meta.htmlLang, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
      setRecent(
        [...sessions]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 6)
          .map((s) => ({
            id: s.id ?? s.createdAt,
            type: s.gameType as string,
            when: whenFmt.format(new Date(s.createdAt)),
            accuracy: Math.round(s.accuracy || 0),
          })),
      );
    } catch {
      /* empty */
    }
  }, [meta.htmlLang]);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const maxCount = useMemo(() => Math.max(1, ...days.map((d) => d.count)), [days]);
  const domainRows = [
    { key: 'recall', label: t('prog.domainRecall') },
    { key: 'recognition', label: t('prog.domainRecognition') },
    { key: 'attention', label: t('prog.domainAttention') },
    { key: 'routine', label: t('prog.domainRoutine') },
  ];

  return (
    <AppShell
      persona="elder"
      activeTab="progress"
      onNavigate={onNavigate}
      onOpenSos={() => window.dispatchEvent(new Event('open-safe-return'))}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('prog.title')}
      subtitle={t('prog.subtitle')}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('prog.title') }}
    >
      {totals.sessions === 0 && Object.keys(domain).length === 0 ? (
        <Card className="rise-in">
          <EmptyState
            icon={<Sparkles />}
            title={t('prog.firstTitle')}
            body={t('prog.firstBody')}
            action={<Button size="lg" onClick={() => onNavigate('games')}>{t('home.myActivities')}</Button>}
          />
        </Card>
      ) : (
      <>
      <div className="rise-in grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Stat value={totals.streak} label={t('prog.streak')} icon={<Flame className="h-4 w-4" />} tone="saffron" />
        <Stat value={totals.sessions} label={t('prog.thisWeek')} icon={<Sparkles className="h-4 w-4" />} />
        <Stat value={totals.accuracy ? `${totals.accuracy}%` : '—'} label={t('prog.accuracy')} icon={<Target className="h-4 w-4" />} tone="teal" />
        <Stat value={`${Object.keys(domain).length}/4`} label={t('cg.domains')} icon={<Award className="h-4 w-4" />} />
      </div>

      {/* 14-day chart */}
      <Card className="mt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="t-h3">{t('prog.last14')}</h2>
            <p className="t-sm mt-0.5">{t('prog.subtitle')}</p>
          </div>
          <Tag tone="teal">
            <TrendingUp className="h-3 w-3" /> {days.reduce((a, b) => a + b.count, 0)} {t('prog.sessions').toLowerCase()}
          </Tag>
        </div>

        <div className="mt-5 flex h-[132px] items-end gap-1.5 sm:gap-2" role="img" aria-label={t('prog.last14')}>
          {days.map((d, i) => (
            <div key={d.key} className="group flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[6px] transition-all"
                  style={{
                    height: `${Math.max(4, (d.count / maxCount) * 100)}%`,
                    background:
                      d.count === 0
                        ? 'var(--surface-sunken)'
                        : i >= days.length - 3
                          ? 'linear-gradient(180deg, var(--brand-saffron), #B4711A)'
                          : 'linear-gradient(180deg, var(--brand-teal-bright), var(--brand-teal))',
                  }}
                  title={`${d.label}: ${d.count}`}
                />
              </div>
              <span className={`text-[0.62rem] font-bold uppercase ${i === days.length - 1 ? 'text-ink' : 'text-ink-4'}`}>
                {d.label.slice(0, 1)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card>
          <h2 className="t-h3">{t('cg.domains')}</h2>
          <div className="mt-3 flex flex-col gap-3">
            {domainRows.map((r) => (
              <ProgressBar
                key={r.key}
                label={r.label}
                value={domain[r.key] ?? 0}
                showValue
                tone={r.key === 'routine' ? 'saffron' : 'teal'}
              />
            ))}
            {Object.keys(domain).length === 0 && <p className="t-sm">{t('prog.noneBody')}</p>}
          </div>
        </Card>

        <Card>
          <h2 className="t-h3">{t('prog.recent')}</h2>
          {recent.length ? (
            <ul className="mt-2">
              {recent.map((r) => {
                const a = ACTIVITIES.find((x) => x.id === r.type);
                return (
                  <li key={r.id} className="flex items-center gap-3 border-b border-[var(--line-soft)] py-2.5 last:border-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                      {a ? <a.icon className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
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
            <EmptyState icon={<CalendarCheck />} title={t('prog.noneYet')} body={t('prog.noneBody')} />
          )}
        </Card>
      </div>

      </>
      )}

      <Card tone="sage" className="mt-4 flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--brand-teal)] text-white">
          <Award className="h-5 w-5" />
        </span>
        <p className="t-body !text-ink-2">{t('prog.encourage')}</p>
      </Card>
    </AppShell>
  );
}
