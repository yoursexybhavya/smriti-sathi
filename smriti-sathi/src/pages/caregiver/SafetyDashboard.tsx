import { Activity, ClipboardList, CreditCard, Info, LifeBuoy, Moon, PhoneCall, ShieldCheck, Siren, Stethoscope, Target } from 'lucide-react';
import { AppShell } from '../../shell/AppShell';
import { Alert, Button, Card, ProgressBar, Section, Stat, Tag } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';

interface Props {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

export default function SafetyDashboard({ onNavigate, onBack, persona = 'caregiver' }: Props) {
  const { state, toggleTheme } = useApp();
  const { t } = useI18n();
  const patient = state.currentPatient;

  const open = (event: string) => window.dispatchEvent(new Event(event));

  const tools = [
    {
      key: 'saf.safeReturn',
      body: 'saf.safeReturnBody',
      icon: LifeBuoy,
      tone: 'danger' as const,
      onClick: () => open('open-safe-return'),
      cta: t('c.viewAll'),
    },
    {
      key: 'saf.sundowning',
      body: 'saf.sundowningBody',
      icon: Moon,
      tone: 'warning' as const,
      onClick: () => open('open-sundowning'),
      cta: t('c.viewAll'),
    },
    {
      key: 'saf.triage',
      body: 'saf.triageBody',
      icon: Stethoscope,
      tone: 'info' as const,
      onClick: () => open('open-asha-triage'),
      cta: t('c.viewAll'),
    },
    {
      key: 'saf.badge',
      body: 'saf.badgeBody',
      icon: CreditCard,
      tone: 'success' as const,
      onClick: () => open('open-wearable-badge'),
      cta: t('c.print'),
    },
  ];

  const toneStyles = {
    danger: { bg: 'var(--danger-soft)', fg: 'var(--danger-strong)', border: 'var(--danger-line)' },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)', border: 'var(--warning-line)' },
    info: { bg: 'var(--info-soft)', fg: 'var(--info)', border: 'var(--info-line)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', border: 'var(--success-line)' },
  };

  return (
    <AppShell
      persona={persona}
      activeTab="safety-dashboard"
      onNavigate={onNavigate}
      onBack={onBack}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('saf.title')}
      subtitle={t('saf.subtitle')}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('saf.title') }}
    >
      {/* Emergency call-out */}
      <Card tone="danger" className="rise-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--danger)] text-white">
              <Siren className="h-6 w-6" />
            </span>
            <div>
              <div className="t-h3 !text-[var(--danger-strong)]">{t('home.imLost')}</div>
              <p className="t-sm mt-0.5 !text-[var(--danger-strong)] opacity-85">{t('saf.foundElderBody')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => open('open-safe-return')} icon={<LifeBuoy className="h-[18px] w-[18px]" />}>
              {t('saf.safeReturn')}
            </Button>
            <a href="tel:+919999999999" className="btn btn--secondary">
              <PhoneCall className="h-[18px] w-[18px]" />
              {t('saf.callGuardian')}
            </a>
          </div>
        </div>
      </Card>

      {/* Clinical snapshot (ASHA view) */}
      <Section className="mt-6" title={t('prog.stability')} subtitle={t('prog.stabilityBody')}>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <Stat value="82%" label={t('cg.stability')} tone="teal" icon={<ShieldCheck className="h-4 w-4" />} />
          <Stat value="14" label={t('prog.sessions')} icon={<Activity className="h-4 w-4" />} />
          <Stat value="84%" label={t('cg.accuracy')} tone="saffron" icon={<Target className="h-4 w-4" />} />
          <Stat value="—" label={t('cg.adherence')} />
        </div>
        <Card className="mt-3">
          <div className="flex flex-col gap-3">
            <ProgressBar label={t('prog.domainRecall')} value={82} showValue />
            <ProgressBar label={t('prog.domainRecognition')} value={76} showValue />
            <ProgressBar label={t('prog.domainAttention')} value={68} showValue />
            <ProgressBar label={t('prog.domainRoutine')} value={71} showValue tone="saffron" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => open('open-asha-triage')} icon={<ClipboardList className="h-4 w-4" />}>
              {t('cg.triage')}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => open('open-wearable-badge')} icon={<CreditCard className="h-4 w-4" />}>
              {t('cg.printBadge')}
            </Button>
          </div>
        </Card>
      </Section>

      {/* Tools */}
      <Section className="mt-6" title={t('cg.quickActions')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {tools.map(({ key, body, icon: Icon, tone, onClick, cta }) => {
            const s = toneStyles[tone];
            return (
              <Card key={key} className="flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-sm)]" style={{ background: s.bg, color: s.fg }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[1rem] font-bold text-ink">{t(key)}</div>
                    <div className="t-sm mt-0.5">{t(body)}</div>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="mt-3 self-start" onClick={onClick}>
                  {cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      <Alert tone="info" icon={<Info className="h-5 w-5" />} title={t('set.about')} className="mt-5">
        {t('saf.disclaimer')}
      </Alert>
      <p className="t-xs mt-3 text-center">
        <Tag>{t('app.name')} v3.1.0</Tag>
      </p>
    </AppShell>
  );
}
