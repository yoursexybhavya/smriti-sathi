import {
  ArrowRight,
  Cpu,
  Database,
  FlaskConical,
  GitBranch,
  Mic,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '../../shell/AppShell';
import { Alert, Card, Section, Tag } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';

interface Props {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

/**
 * Diagnostics hub — every engineering/debug surface lives here, behind the
 * caregiver PIN, so the product itself never reads like a test harness.
 */
export default function DemoHubScreen({ onNavigate, onBack, persona = 'caregiver' }: Props) {
  const { state, toggleTheme } = useApp();
  const { t } = useI18n();

  const items = [
    { key: 'demo.sync', route: 'diagnostics', icon: GitBranch, desc: 'Offline queue, conflict resolution and cloud round-trip' },
    { key: 'demo.security', route: 'diagnostics', icon: ShieldAlert, desc: 'PIN hashing, session expiry and role guard' },
    { key: 'demo.adaptive', route: 'diagnostics', icon: Cpu, desc: 'Difficulty clamping, errorless scaffolding, level promotion' },
    { key: 'demo.database', route: 'diagnostics', icon: Database, desc: 'IndexedDB tables, migrations and foreign keys' },
    { key: 'demo.reminder', route: 'diagnostics', icon: Sparkles, desc: 'Scheduling, recurrence, snooze and adherence logging' },
    { key: 'demo.voice', route: 'diagnostics', icon: Mic, desc: 'Speech synthesis, translation coverage, Bhashini hook' },
  ];

  return (
    <AppShell
      persona={persona}
      activeTab="demo"
      onNavigate={onNavigate}
      onBack={onBack}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('demo.title')}
      subtitle={t('demo.subtitle')}
      identity={{ name: state.currentPatient?.name ?? t('auth.elderName'), sub: t('demo.title') }}
    >
      <Alert tone="info" icon={<FlaskConical className="h-5 w-5" />} title={t('demo.title')}>
        {t('demo.note')}
      </Alert>

      <Section className="mt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(({ key, route, icon: Icon, desc }) => (
            <button key={key} type="button" onClick={() => onNavigate(route)} className="card card--pad card--interactive flex items-start gap-3.5 text-left">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--surface-sunken)] text-ink-2">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.98rem] font-bold text-ink">{t(key)}</span>
                <span className="t-xs mt-0.5 block leading-snug">{desc}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-4" />
            </button>
          ))}
        </div>
      </Section>

      <Card className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="teal">React 18</Tag>
          <Tag tone="saffron">Vite 6</Tag>
          <Tag tone="info">Dexie / IndexedDB</Tag>
          <Tag tone="success">Capacitor 8</Tag>
          <Tag>{t('app.name')} v3.0.0</Tag>
        </div>
      </Card>
    </AppShell>
  );
}
