import { useCallback, useEffect, useState } from 'react';
import { ClipboardList, Download, MessageCircle, Printer, Stethoscope } from 'lucide-react';
import { Alert, Button, EmptyState, ProgressBar, Segmented, Sheet, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { db, gameSessionRepository, reminderRepository } from '../database';
import { calculateMedian } from '../engine/spiBaseline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface TrendPoint {
  label: string;
  score: number;
}

interface DomainRow {
  key: string;
  score: number;
  sessions: number;
}

const DOMAIN_BY_GAME: Record<string, string> = {
  remember: 'prog.domainRecall',
  family_quiz: 'prog.domainRecognition',
  recognise: 'prog.domainRecognition',
  memory_match: 'prog.domainAttention',
  daily_routine: 'prog.domainRoutine',
  test: 'prog.domainAttention',
};

/**
 * ASHA / PHC triage sheet.
 *
 * Everything here is computed from the sessions this elder actually played and
 * the reminders they actually acknowledged. Before seven sessions there is
 * nothing honest to report, so the sheet says the baseline is calibrating
 * instead of showing a score.
 */
export const AshaTriageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { t, meta } = useI18n();
  const [tab, setTab] = useState<'overview' | 'domains' | 'guidelines'>('overview');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [median, setMedian] = useState(0);
  const [adherence, setAdherence] = useState<number | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [domains, setDomains] = useState<DomainRow[]>([]);

  const elderName = state.currentPatient?.name ?? t('saf.unknownElder');
  const elderAge = state.currentPatient?.age ?? null;

  const load = useCallback(async () => {
    const rawId = state.currentPatient?.id;
    const userId = rawId ? parseInt(rawId, 10) : NaN;
    if (isNaN(userId)) {
      setSessions(0);
      setMedian(0);
      setAdherence(null);
      setTrend([]);
      setDomains([]);
      return;
    }

    setLoading(true);
    try {
      const all = await gameSessionRepository.getByUserId(userId);
      const ordered = [...all].sort((a, b) => a.createdAt - b.createdAt);
      const recent = ordered.slice(-14);
      setSessions(ordered.length);
      setMedian(recent.length ? Math.round(calculateMedian(recent.map((s) => s.score))) : 0);

      const dayFmt = new Intl.DateTimeFormat(meta.htmlLang, { day: 'numeric' });
      setTrend(
        ordered.slice(-8).map((s) => ({
          label: dayFmt.format(new Date(s.createdAt)),
          score: s.score,
        })),
      );

      const byDomain = new Map<string, number[]>();
      ordered.forEach((s) => {
        const key = DOMAIN_BY_GAME[s.gameType];
        if (!key) return;
        byDomain.set(key, [...(byDomain.get(key) ?? []), s.score]);
      });
      setDomains(
        Array.from(byDomain.entries()).map(([key, scores]) => ({
          key,
          score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          sessions: scores.length,
        })),
      );

      const [reminders, completions] = await Promise.all([
        reminderRepository.getByUserId(userId),
        db.reminderCompletions.where('userId').equals(userId).toArray(),
      ]);
      const total = reminders.length;
      if (total === 0) {
        setAdherence(null);
      } else {
        const doneIds = new Set(completions.map((c) => c.reminderId));
        const done = reminders.filter((r) => r.status === 'completed' || doneIds.has(r.id!)).length;
        setAdherence(Math.round((done / total) * 100));
      }
    } catch {
      setSessions(0);
      setMedian(0);
      setAdherence(null);
      setTrend([]);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  }, [state.currentPatient?.id, meta.htmlLang]);

  useEffect(() => {
    if (isOpen) void load();
  }, [isOpen, load]);

  const status = median >= 80 ? t('prog.stable') : median >= 65 ? t('prog.watch') : t('prog.declining');
  const calibrated = sessions >= 7;

  const waMessage = [
    '*SMRITI SATHI — ASHA COGNITIVE TRIAGE*',
    '',
    `${t('ob.nameLabel')}: ${elderName}${elderAge ? `, ${elderAge}` : ''}`,
    `${t('prog.sessions')}: ${sessions}`,
    calibrated ? `SPI (14-session median): ${median} · ${status}` : t('saf.calibrating'),
    adherence !== null ? `${t('prog.adherence')}: ${adherence}%` : '',
    '',
    ...domains.map((d) => `• ${t(d.key)}: ${d.score} (${d.sessions})`),
    '',
    t('saf.disclaimer'),
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      eyebrow={t('saf.triage')}
      title={elderAge ? `${elderName} · ${elderAge}` : elderName}
      wide
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" block onClick={() => window.print()} icon={<Printer className="h-[18px] w-[18px]" />}>
            {t('c.print')}
          </Button>
          <Button
            block
            disabled={!calibrated}
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(waMessage)}`, '_blank')}
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
          >
            {t('cg.triage')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="teal" icon={<Stethoscope className="h-3 w-3" />}>
          {t('prog.stability')}
        </Tag>
        <Tag tone={!calibrated ? 'saffron' : median >= 80 ? 'success' : 'saffron'}>
          {calibrated ? status : t('saf.calibrating')}
        </Tag>
        <Tag>
          {t('prog.sessions')}: {sessions}
        </Tag>
      </div>

      <div className="mt-4">
        <Segmented
          ariaLabel={t('saf.triage')}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'overview', label: t('cg.overview') },
            { value: 'domains', label: t('cg.domains') },
            { value: 'guidelines', label: t('set.about') },
          ]}
        />
      </div>

      {tab === 'overview' && (
        <div className="mt-4">
          {!calibrated ? (
            <EmptyState
              icon={<ClipboardList />}
              title={t('saf.calibrating')}
              body={t('saf.calibratingBody')}
            />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="stat">
                  <span className="stat__label">SPI</span>
                  <span className="stat__value text-brand">{median}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">{t('prog.adherence')}</span>
                  <span className="stat__value">{adherence === null ? '—' : `${adherence}%`}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">{t('prog.sessions')}</span>
                  <span className="stat__value">{sessions}</span>
                </div>
              </div>

              <div className="mt-4 flex h-[130px] items-stretch gap-1.5">
                {trend.map((s, i) => (
                  <div key={`${s.label}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-[5px]"
                        style={{
                          height: `${Math.max(6, Math.min(100, s.score))}%`,
                          background: 'linear-gradient(180deg, var(--brand-teal-bright), var(--brand-teal))',
                        }}
                        title={`${s.label}: ${s.score}`}
                      />
                    </div>
                    <span className="text-[0.6rem] font-bold text-ink-4">{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="t-xs mt-2">{t('prog.stabilityBody')}</p>
            </>
          )}
          {loading && <p className="t-xs mt-2">{t('c.loading')}</p>}
        </div>
      )}

      {tab === 'domains' && (
        <div className="mt-4 flex flex-col gap-3.5">
          {domains.length === 0 ? (
            <EmptyState icon={<ClipboardList />} title={t('saf.noDomains')} body={t('saf.noDomainsBody')} />
          ) : (
            domains.map((d) => (
              <div key={d.key}>
                <ProgressBar label={t(d.key)} value={d.score} showValue />
                <p className="t-xs mt-1">
                  {d.sessions} {t('prog.sessions').toLowerCase()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'guidelines' && (
        <div className="mt-4 flex flex-col gap-2.5">
          <Alert tone="info" icon={<ClipboardList className="h-4 w-4" />} title={t('cg.triage')}>
            {t('saf.triageBody')}
          </Alert>
          <ul className="flex flex-col gap-2 text-[0.86rem] leading-snug text-ink-2">
            <li>• {t('saf.guide1')}</li>
            <li>• {t('saf.guide2')}</li>
            <li>• {t('saf.guide3')}</li>
            <li>• {t('saf.guide4')}</li>
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => window.print()} icon={<Download className="h-4 w-4" />}>
          {t('c.print')}
        </Button>
        <span className="t-xs">{t('saf.disclaimer')}</span>
      </div>
    </Sheet>
  );
};

export default AshaTriageModal;
