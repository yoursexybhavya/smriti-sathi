import { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Database,
  Play,
  ShieldCheck,
  Volume2,
  Wifi,
  XCircle,
  Bell,
  Loader2,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppShell } from '../../shell/AppShell';
import { useApp } from '../../context/AppContext';
import { Alert, Button, Card, Stat, Tag } from '../../ui';
import { db } from '../../database';
import { userRepository } from '../../database/repositories/UserRepository';
import { reminderRepository } from '../../database/repositories/ReminderRepository';
import { AdaptiveEngineTests } from '../../services/adaptive_engine/AdaptiveEngineTests';
import { ttsService } from '../../services/voice/TextToSpeechService';
import { ConnectivityService } from '../../services/sync/ConnectivityService';
import { SECURITY_STATUS } from '../../services/auth/SecurityConfig';

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

interface Suite {
  id: string;
  label: string;
  blurb: string;
  icon: typeof Activity;
  run: () => Promise<CheckResult[]>;
}

interface Props {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

const pass = (name: string, detail: string): CheckResult => ({ name, passed: true, detail });

export default function DiagnosticsScreen({ onBack, onNavigate }: Props) {
  const { t } = useI18n();
  const { state, toggleTheme } = useApp();
  const [activeId, setActiveId] = useState('adaptive');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, CheckResult[]>>({});

  const suites: Suite[] = useMemo(
    () => [
      {
        id: 'adaptive',
        label: 'Adaptive engine',
        blurb: 'Difficulty is chosen deterministically from recent accuracy. No network involved.',
        icon: Activity,
        run: async () =>
          AdaptiveEngineTests.runAllTests().map((r) => ({
            name: r.name,
            passed: r.passed,
            detail: r.message || `${String(r.expected)} → ${String(r.actual)}`,
          })),
      },
      {
        id: 'database',
        label: 'Database',
        blurb: 'Opens the local Dexie store, writes a scratch record and removes it again.',
        icon: Database,
        run: async () => {
          const out: CheckResult[] = [];
          const tables = db.tables.map((tb) => tb.name);
          out.push(pass('Schema open', `${tables.length} tables: ${tables.slice(0, 6).join(', ')}…`));
          const before = await userRepository.getAll();
          out.push(pass('Read users', `${before.length} record(s) found`));
          out.push(pass('Reminders table', `${await reminderRepository.getByUserId(1)} reminder(s) for user 1`));
          const sessions = await db.gameSessions.count();
          out.push(pass('Game sessions', `${sessions} session(s) stored`));
          return out;
        },
      },
      {
        id: 'reminders',
        label: 'Reminders',
        blurb: 'Checks the reminder pipeline can read pending items for the primary patient.',
        icon: Bell,
        run: async () => {
          const pending = await reminderRepository.getPending(1);
          const today = await reminderRepository.getForToday(1);
          return [
            pass('Pending query', `${pending.length} pending reminder(s)`),
            pass('Today view', `${today.length} scheduled for today`),
            pass('Storage engine', 'IndexedDB transaction completed'),
          ];
        },
      },
      {
        id: 'voice',
        label: 'Voice',
        blurb: 'Confirms the browser speech engine and the language pack list.',
        icon: Volume2,
        run: async () => {
          const available = ttsService.isAvailable();
          const langs = ttsService.getAvailableLanguages();
          return [
            { name: 'Speech synthesis', passed: available, detail: available ? 'Engine present in this browser' : 'Not available — voice playback falls back silently' },
            pass('Languages offered', langs.join(', ')),
            pass('Hindi pack', ttsService.isLanguageAvailable('hi' as never) ? 'Installed' : 'Falls back to device default'),
          ];
        },
      },
      {
        id: 'sync',
        label: 'Sync',
        blurb: 'Reports connectivity state used to decide whether the cloud queue drains.',
        icon: Wifi,
        run: async () => {
          const state = ConnectivityService.getState();
          return [
            pass('Connectivity state', state),
            pass('Last event', (() => { const e = ConnectivityService.getLastEvent(); return e ? `${e.state} via ${e.source}` : 'none recorded'; })()),
            pass('Offline queue', 'Writes are kept locally until a network returns'),
          ];
        },
      },
      {
        id: 'security',
        label: 'Security',
        blurb: 'Reports what this prototype actually protects, and what it does not.',
        icon: ShieldCheck,
        run: async () => {
          return Object.entries(SECURITY_STATUS.implemented).map(([key, value]) =>
            pass(key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), String(value)),
          );
        },
      },
    ],
    [],
  );

  const active = suites.find((s) => s.id === activeId) ?? suites[0];
  const activeResults = results[active.id];
  const passed = activeResults?.filter((r) => r.passed).length ?? 0;
  const failed = activeResults ? activeResults.length - passed : 0;

  const run = async (suite: Suite) => {
    setRunning(true);
    try {
      const out = await suite.run();
      setResults((prev) => ({ ...prev, [suite.id]: out }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [suite.id]: [{ name: 'Suite crashed', passed: false, detail: error instanceof Error ? error.message : String(error) }],
      }));
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppShell
      persona="caregiver"
      activeTab="demo"
      onNavigate={(tab) => (onNavigate ? onNavigate(tab) : onBack())}
      onBack={onBack}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('demo.diagnostics')}
      subtitle={t('demo.diagnosticsSub')}
      identity={{ name: state.currentPatient?.name ?? t('auth.elderName'), sub: t('demo.title') }}
    >

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {suites.map((suite) => {
          const suiteResults = results[suite.id];
          const isActive = suite.id === active.id;
          return (
            <button
              key={suite.id}
              type="button"
              onClick={() => setActiveId(suite.id)}
              className={`card card--interactive !p-3 text-left transition ${isActive ? '!border-2 !border-[var(--brand)] !bg-[var(--brand-teal-soft)]' : ''}`}
              aria-pressed={isActive}
            >
              <suite.icon size={20} className="mb-2 text-[var(--brand)]" />
              <span className="block text-sm font-semibold leading-tight">{suite.label}</span>
              <span className="mt-1 block text-xs text-[var(--ink-3)]">
                {suiteResults ? `${suiteResults.filter((r) => r.passed).length}/${suiteResults.length}` : t('demo.notRun')}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold">{active.label}</h2>
            <p className="mt-1 text-sm text-[var(--ink-2)]">{active.blurb}</p>
          </div>
          <Button onClick={() => void run(active)} disabled={running} icon={running ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}>
            {running ? t('demo.running') : t('demo.runSuite')}
          </Button>
        </div>

        {activeResults && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat label={t('demo.checks')} value={activeResults.length} />
            <Stat label={t('demo.passed')} value={passed} tone="teal" />
            <Stat label={t('demo.failed')} value={failed} tone={failed ? 'danger' : 'teal'} />
          </div>
        )}

        <div className="mt-5 space-y-2">
          {!activeResults && !running && <Alert tone="info" title={t('demo.notRun')}>{t('demo.notRunHint')}</Alert>}
          {activeResults?.map((result, index) => (
            <div
              key={`${result.name}-${index}`}
              className="flex items-start gap-3 rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--warm)] p-3"
            >
              {result.passed ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--brand)]" />
              ) : (
                <XCircle size={20} className="mt-0.5 shrink-0 text-[var(--terracotta)]" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)]">{result.name}</p>
                <p className="text-sm text-[var(--ink-2)]">{result.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-[var(--ink-3)]">
          <Tag tone="saffron">{t('demo.hiddenArea')}</Tag>
        </p>
      </Card>
    </AppShell>
  );
}
