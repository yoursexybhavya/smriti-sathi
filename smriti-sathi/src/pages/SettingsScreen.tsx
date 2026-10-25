import { useState } from 'react';
import {
  Type as ALargeSmall,
  ArrowRight,
  BookOpen,
  Contrast,
  Database,
  Eye,
  FlaskConical,
  Globe,
  Info,
  LogOut,
  Moon,
  RefreshCw,
  Sun,
  UserRound,
  Volume2,
} from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Alert, Button, Card, ChoiceRow, Field, Input, Section, Segmented, Sheet, Switch, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import { UserRole } from '../models/Role';

interface Props {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

export default function SettingsScreen({ onNavigate, persona = 'elder' }: Props) {
  const { state, updateAccessibility, updatePatient, toggleTheme } = useApp();
  const { role, logout, switchRole } = useAuth();
  const { t, lang, setLanguage, languages } = useI18n();

  const isCaregiver = role === UserRole.CAREGIVER;
  const [showLang, setShowLang] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoPin, setDemoPin] = useState('');
  const [demoError, setDemoError] = useState('');
  const [name, setName] = useState(state.currentPatient?.name ?? '');
  const [age, setAge] = useState(String(state.currentPatient?.age ?? 72));
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');

  const a11y = state.accessibility;

  const saveProfile = async () => {
    if (!state.currentPatient) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(t('ob.nameRequired'));
      return;
    }
    const trimmedAge = age.trim();
    const numAge = Number(trimmedAge);
    if (!trimmedAge || isNaN(numAge)) {
      setAgeError(t('ob.ageRequired'));
      return;
    }
    if (numAge < 40) {
      setAgeError(t('ob.ageTooLow'));
      return;
    }
    if (numAge > 120) {
      setAgeError(t('ob.ageTooHigh'));
      return;
    }

    setNameError('');
    setAgeError('');
    await updatePatient({ ...state.currentPatient, name: trimmedName, age: numAge });
    setShowProfile(false);
  };

  const unlockDemo = () => {
    if (demoPin === '1234' || demoPin === '0000') {
      setShowDemo(false);
      setDemoPin('');
      setDemoError('');
      onNavigate('demo');
    } else {
      setDemoError(t('auth.pinWrong'));
    }
  };

  return (
    <AppShell
      persona={persona}
      activeTab={isCaregiver ? 'caregiver-settings' : 'settings'}
      onNavigate={onNavigate}
      onOpenSos={persona === 'elder' ? () => window.dispatchEvent(new Event('open-safe-return')) : undefined}
      theme={a11y?.theme}
      onToggleTheme={toggleTheme}
      title={t('set.title')}
      subtitle={t('set.subtitle')}
      identity={{ name: state.currentPatient?.name ?? t('auth.elderName'), sub: t('set.title') }}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Appearance ─────────────────────────────────────────────── */}
        <Section title={t('set.appearance')}>
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                <ALargeSmall className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[0.95rem] font-bold text-ink">{t('set.textSize')}</div>
                <div className="t-xs">{t('set.previewText')}</div>
              </div>
            </div>
            <div className="mt-3">
              <Segmented
                ariaLabel={t('set.textSize')}
                value={a11y?.textSize ?? 'large'}
                onChange={(v) => updateAccessibility({ ...a11y, textSize: v })}
                options={[
                  { value: 'normal', label: t('set.comfort') },
                  { value: 'large', label: t('set.large') },
                  { value: 'extra-large', label: t('set.extraLarge') },
                ]}
              />
            </div>

            <div className="mt-4 border-t border-[var(--line-soft)] pt-3">
              <div className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex min-w-0 items-center gap-3">
                  <Contrast className="h-5 w-5 shrink-0 text-ink-3" />
                  <div>
                    <div className="text-[0.92rem] font-bold text-ink">{t('set.contrast')}</div>
                    <div className="t-xs">{t('set.contrastBody')}</div>
                  </div>
                </div>
                <Switch
                  label={t('set.contrast')}
                  checked={!!a11y?.highContrast}
                  onChange={(v) => updateAccessibility({ ...a11y, highContrast: v })}
                />
              </div>

              <div className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex min-w-0 items-center gap-3">
                  {a11y?.theme === 'dark' ? (
                    <Moon className="h-5 w-5 shrink-0 text-ink-3" />
                  ) : (
                    <Sun className="h-5 w-5 shrink-0 text-ink-3" />
                  )}
                  <div>
                    <div className="text-[0.92rem] font-bold text-ink">{t('set.darkMode')}</div>
                    <div className="t-xs">{t('set.darkModeBody')}</div>
                  </div>
                </div>
                <Switch label={t('set.darkMode')} checked={a11y?.theme === 'dark'} onChange={() => toggleTheme()} />
              </div>

              <div className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex min-w-0 items-center gap-3">
                  <Volume2 className="h-5 w-5 shrink-0 text-ink-3" />
                  <div>
                    <div className="text-[0.92rem] font-bold text-ink">{t('set.voiceOn')}</div>
                    <div className="t-xs">{t('set.voice')}</div>
                  </div>
                </div>
                <Switch
                  label={t('set.voiceOn')}
                  checked={!!a11y?.voiceGuidance}
                  onChange={(v) => updateAccessibility({ ...a11y, voiceGuidance: v })}
                />
              </div>
            </div>
          </Card>
        </Section>

        {/* ── Language ───────────────────────────────────────────────── */}
        <Section title={t('set.language')}>
          <Card>
            <div className="flex flex-col gap-2">
              {languages.map((l) => (
                <ChoiceRow
                  key={l.code}
                  selected={lang === l.code}
                  onSelect={() => setLanguage(l.code)}
                  title={l.native}
                  subtitle={l.label}
                  leading={
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-sunken)] text-[0.72rem] font-extrabold uppercase text-ink-2">
                      {l.code}
                    </span>
                  }
                />
              ))}
            </div>
            <Alert tone="info" icon={<Globe className="h-4 w-4" />} className="mt-3">
              {t('ob.langBody')}
            </Alert>
          </Card>
        </Section>

        {/* ── Profile ────────────────────────────────────────────────── */}
        <Section title={t('set.profile')}>
          <Card>
            <button type="button" onClick={() => setShowProfile(true)} className="row row--tap">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                <UserRound className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{state.currentPatient?.name ?? t('auth.elderName')}</span>
                <span className="t-xs block">
                  {state.currentPatient?.age ?? 72} · {t('set.editProfile')}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
            </button>

            {isCaregiver && (
              <button type="button" onClick={() => onNavigate('safety-dashboard')} className="row row--tap">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
                  <Eye className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-bold text-ink">{t('saf.title')}</span>
                  <span className="t-xs block">{t('saf.subtitle')}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => switchRole(role === UserRole.CAREGIVER ? 'patient_primary' : 'caregiver_primary')}
              className="row row--tap"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-saffron-soft)] text-[var(--brand-saffron-ink)]">
                <RefreshCw className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{t('set.switchProfile')}</span>
                <span className="t-xs block">{role === UserRole.CAREGIVER ? t('cg.elderView') : t('auth.guardian')}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
            </button>
          </Card>
        </Section>

        {/* ── Data / about ───────────────────────────────────────────── */}
        <Section title={t('set.data')}>
          <Card>
            <button type="button" onClick={() => onNavigate('caregiver-memory')} className="row row--tap">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--info-soft)] text-[var(--info)]">
                <Database className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{t('c.savedOffline')}</span>
                <span className="t-xs block">{t('c.offlineBody')}</span>
              </span>
              <Tag tone="success">v3</Tag>
            </button>

            {isCaregiver && (
              <button type="button" onClick={() => setShowDemo(true)} className="row row--tap">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-ink-3">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-bold text-ink">{t('demo.title')}</span>
                  <span className="t-xs block">{t('demo.note')}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
              </button>
            )}

            <div className="row">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-ink-3">
                <Info className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[0.95rem] font-bold text-ink">{t('set.about')}</div>
                <div className="t-xs">{t('set.aboutBody')}</div>
              </div>
              <Tag>{t('set.version')} 3.0.0</Tag>
            </div>
          </Card>

          <Button
            variant="outline-danger"
            block
            size="lg"
            className="mt-3"
            onClick={logout}
            icon={<LogOut className="h-[18px] w-[18px]" />}
          >
            {t('set.signOut')}
          </Button>
          <p className="t-xs mt-2 text-center">{t('saf.disclaimer')}</p>
        </Section>
      </div>

      {/* Language sheet (mobile shortcut) */}
      <Sheet open={showLang} onClose={() => setShowLang(false)} title={t('set.language')}>
        <div className="flex flex-col gap-2">
          {languages.map((l) => (
            <ChoiceRow
              key={l.code}
              selected={lang === l.code}
              onSelect={() => {
                setLanguage(l.code);
                setShowLang(false);
              }}
              title={l.native}
              subtitle={l.label}
            />
          ))}
        </div>
      </Sheet>

      {/* Profile sheet */}
      <Sheet
        open={showProfile}
        onClose={() => setShowProfile(false)}
        title={t('set.editProfile')}
        footer={
          <Button block size="lg" onClick={saveProfile}>
            {t('c.save')}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label={t('ob.nameLabel')} htmlFor="p-name" error={nameError}>
            <Input
              id="p-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              data-autofocus
            />
          </Field>
          <Field
            label={t('ob.ageLabel')}
            htmlFor="p-age"
            error={ageError}
            hint={!ageError ? 'Valid elder care range: 40–120 years' : undefined}
          >
            <Input
              id="p-age"
              type="number"
              inputMode="numeric"
              min={40}
              max={120}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (ageError) setAgeError('');
              }}
            />
          </Field>
        </div>
      </Sheet>

      {/* Demo gate */}
      <Sheet
        open={showDemo}
        onClose={() => setShowDemo(false)}
        title={t('demo.pinTitle')}
        footer={
          <Button block size="lg" onClick={unlockDemo} disabled={demoPin.length < 4} icon={<BookOpen className="h-[18px] w-[18px]" />}>
            {t('auth.enter')}
          </Button>
        }
      >
        <p className="t-body">{t('demo.pinBody')}</p>
        <Field className="mt-4" label={t('auth.pin')} htmlFor="demo-pin" error={demoError}>
          <Input
            id="demo-pin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={demoPin}
            onChange={(e) => {
              setDemoError('');
              setDemoPin(e.target.value.replace(/\D/g, ''));
            }}
            data-autofocus
          />
        </Field>
        <p className="t-xs mt-2">
          {t('auth.demoPin')}: <span className="t-num font-bold">1234</span>
        </p>
      </Sheet>
    </AppShell>
  );
}
