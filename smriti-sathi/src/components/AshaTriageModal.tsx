import { useState } from 'react';
import { ClipboardList, Download, MessageCircle, Printer, Stethoscope } from 'lucide-react';
import { Alert, Button, ProgressBar, Segmented, Sheet, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SESSIONS = [
  { day: 'Day 1', score: 78 },
  { day: 'Day 3', score: 80 },
  { day: 'Day 5', score: 84 },
  { day: 'Day 7', score: 83 },
  { day: 'Day 9', score: 86 },
  { day: 'Day 11', score: 85 },
  { day: 'Day 13', score: 88 },
  { day: 'Day 14', score: 86 },
];

const DOMAINS = [
  { key: 'prog.domainRecall', score: 88, note: 'Consistent recall of family faces across 5 sessions' },
  { key: 'prog.domainRecognition', score: 84, note: 'Stable pattern recognition; occasional cue needed' },
  { key: 'prog.domainAttention', score: 79, note: 'Attention drops after 6 minutes — short sessions advised' },
  { key: 'prog.domainRoutine', score: 91, note: 'Strong routine sequencing; morning routine best' },
];

export const AshaTriageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState<'overview' | 'domains' | 'guidelines'>('overview');

  const elderName = state.currentPatient?.name ?? t('auth.elderName');
  const elderAge = state.currentPatient?.age ?? 72;

  const median = 86;
  const stability = median >= 80 ? t('prog.stable') : median >= 65 ? t('prog.watch') : t('prog.declining');

  const waMessage = `*SMRITI SATHI — ASHA COGNITIVE TRIAGE*\n\nPatient: ${elderName}, ${elderAge}\nSessions reviewed: 14\nSPI (14-session median): ${median}\nStatus: ${stability}\n\nDomain scores:\n${DOMAINS.map((d) => `• ${d.key.split('.').pop()}: ${d.score}`).join('\n')}\n\nNote: This is a screening summary from a cognitive-stimulation app. It is not a diagnosis.`;

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      eyebrow={t('saf.triage')}
      title={`${elderName} · ${elderAge}`}
      wide
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" block onClick={() => window.print()} icon={<Printer className="h-[18px] w-[18px]" />}>
            {t('c.print')}
          </Button>
          <Button
            block
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
        <Tag tone={median >= 80 ? 'success' : 'saffron'}>{stability}</Tag>
        <Tag>{t('prog.sessions')}: 14</Tag>
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
          <div className="grid grid-cols-3 gap-2.5">
            <div className="stat">
              <span className="stat__label">SPI</span>
              <span className="stat__value text-brand">{median}</span>
            </div>
            <div className="stat">
              <span className="stat__label">{t('prog.adherence')}</span>
              <span className="stat__value">94%</span>
            </div>
            <div className="stat">
              <span className="stat__label">{t('prog.sessions')}</span>
              <span className="stat__value">14</span>
            </div>
          </div>

          <div className="mt-4 flex h-[130px] items-stretch gap-1.5">
            {SESSIONS.map((s) => (
              <div key={s.day} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-[5px]"
                    style={{
                      height: `${Math.max(6, ((s.score - 50) / 50) * 100)}%`,
                      background: 'linear-gradient(180deg, var(--brand-teal-bright), var(--brand-teal))',
                    }}
                    title={`${s.day}: ${s.score}`}
                  />
                </div>
                <span className="text-[0.6rem] font-bold text-ink-4">{s.day.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <p className="t-xs mt-2">{t('prog.stabilityBody')}</p>
        </div>
      )}

      {tab === 'domains' && (
        <div className="mt-4 flex flex-col gap-3.5">
          {DOMAINS.map((d) => (
            <div key={d.key}>
              <ProgressBar label={t(d.key)} value={d.score} showValue />
              <p className="t-xs mt-1">{d.note}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'guidelines' && (
        <div className="mt-4 flex flex-col gap-2.5">
          <Alert tone="info" icon={<ClipboardList className="h-4 w-4" />} title={t('cg.triage')}>
            {t('saf.triageBody')}
          </Alert>
          <ul className="flex flex-col gap-2 text-[0.86rem] leading-snug text-ink-2">
            <li>• Keep sessions under 8 minutes; attention drops after 6.</li>
            <li>• Prefer morning sessions for this patient.</li>
            <li>• Escalate to PHC if SPI drops below 65 across 3 sessions.</li>
            <li>• Use the family album daily — recognition scores are the strongest.</li>
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
