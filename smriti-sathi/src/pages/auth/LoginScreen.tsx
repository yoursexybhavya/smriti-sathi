import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Globe,
  HeartHandshake,
  LifeBuoy,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  UserRound,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SafeReturnModal } from '../../components/SafeReturnModal';
import { BrandLockup, Button, Card, IconButton, Tag } from '../../ui';
import { useI18n } from '../../i18n';
import CreateAccountFlow from './CreateAccountFlow';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const ROLE_ICON = {
  elder: UserRound,
  caregiver: HeartHandshake,
  clinician: Stethoscope,
} as const;

/**
 * The front door.
 *
 * A fresh install has no accounts at all, so the screen is an invitation to set
 * the device up. Once somebody lives here, it becomes a profile picker with a
 * PIN for the people who can see care data. The emergency card is reachable
 * without signing in — a stranger who finds a lost elder does not have a PIN.
 */
export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { profiles, login } = useAuth();
  const { state, toggleTheme } = useApp();
  const { t, lang, setLanguage, languages } = useI18n();

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSafeReturn, setShowSafeReturn] = useState(false);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;
  const isDark = state.accessibility?.theme === 'dark';

  if (creating) {
    return (
      <CreateAccountFlow
        onCreated={onLoginSuccess}
        onCancel={() => {
          setCreating(false);
          setSelectedId(null);
        }}
      />
    );
  }

  const signIn = async (accountId: string, withPin?: string) => {
    setBusy(true);
    setError('');
    const result = await login(accountId, withPin ?? '');
    setBusy(false);
    if (result.success) {
      onLoginSuccess();
      return;
    }
    setError(result.error === 'pin' ? t('auth.pinWrong') : t('c.somethingWrong'));
    setPin('');
  };

  const choose = (id: string, hasPin: boolean) => {
    setError('');
    setPin('');
    if (!hasPin) {
      void signIn(id);
      return;
    }
    setSelectedId(id);
  };

  const pressKey = (digit: string) => {
    setError('');
    const next = (pin + digit).slice(0, 4);
    setPin(next);
    if (next.length === 4 && selected) void signIn(selected.id, next);
  };

  const languagePicker = (
    <div
      className="mb-6 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface-warm)] p-3"
      style={{ boxShadow: 'var(--shadow-1)' }}
    >
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <span className="flex items-center gap-1.5 text-[0.82rem] font-bold tracking-wide text-ink">
          <Globe className="h-4 w-4 text-[var(--brand-teal)]" />
          {t('set.language')}
        </span>
        <span className="text-[0.72rem] font-medium text-ink-3">
          {languages.find((l) => l.code === lang)?.label}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5" role="radiogroup" aria-label={t('set.language')}>
        {languages.map((l) => {
          const isActive = lang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setLanguage(l.code)}
              className="flex flex-col items-center justify-center rounded-[var(--r-sm)] px-1 py-2 text-center transition-all"
              style={{
                background: isActive ? 'var(--brand-teal)' : 'var(--surface)',
                color: isActive ? '#FFFFFF' : 'var(--ink)',
                border: `1.5px solid ${isActive ? 'var(--brand-teal)' : 'var(--line-soft)'}`,
                minHeight: '48px',
              }}
            >
              <span className="max-w-full truncate text-[0.88rem] font-bold leading-tight">{l.native}</span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-wide opacity-75">{l.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1180px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Brand panel (desktop) ─────────────────────────────────────── */}
        <aside
          className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
          style={{
            background: 'radial-gradient(120% 100% at 20% 0%, #12756A 0%, #0E5C50 42%, #083F38 100%)',
            borderRadius: '0 var(--r-2xl) var(--r-2xl) 0',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(232,169,78,0.4), transparent 60%)' }}
          />
          <BrandLockup size={46} name={t('app.name')} showTagline tagline={t('app.shortTagline')} onDark />

          <div className="relative max-w-[26rem]" style={{ color: '#FBF6EE' }}>
            <h1
              className="text-[2.6rem] leading-[1.06] text-[#FBF6EE]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.03em' }}
            >
              {t('app.tagline')}
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-[#CFE3DD]">{t('auth.brandBody')}</p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {[
                { icon: ShieldCheck, text: t('auth.pointOffline') },
                { icon: HeartHandshake, text: t('auth.pointFamily') },
                { icon: LifeBuoy, text: t('auth.pointSafe') },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[0.94rem] text-[#DCEBE6]">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/12">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#9FC4BB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8A94E]" />
            Smart India Hackathon · SIH26003
          </div>
        </aside>

        {/* ── Entry panel ───────────────────────────────────────────────── */}
        <main className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-[28rem]">
            <div className="mb-7 flex items-start justify-between gap-3 lg:hidden">
              <BrandLockup size={40} name={t('app.name')} showTagline tagline={t('app.shortTagline')} />
              <IconButton label={t('c.theme')} variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun /> : <Moon />}
              </IconButton>
            </div>

            <div className="mb-4 hidden items-center justify-end gap-1.5 lg:flex">
              <IconButton label={t('c.theme')} variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun /> : <Moon />}
              </IconButton>
            </div>

            {languagePicker}

            {/* ── First run: nothing exists yet ─────────────────────────── */}
            {profiles.length === 0 && (
              <Card className="pop-in flex flex-col gap-4">
                <div>
                  <Tag tone="saffron">{t('auth.firstRunTag')}</Tag>
                  <h2 className="t-h2 mt-2">{t('auth.firstRunTitle')}</h2>
                  <p className="t-body mt-1.5">{t('auth.firstRunBody')}</p>
                </div>

                <ol className="flex flex-col gap-2">
                  {[t('auth.firstRunStep1'), t('auth.firstRunStep2'), t('auth.firstRunStep3')].map((line, i) => (
                    <li
                      key={line}
                      className="flex items-start gap-3 rounded-[var(--r-md)] bg-[var(--surface-warm)] p-3"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-teal)] text-[0.72rem] font-extrabold text-white">
                        {i + 1}
                      </span>
                      <span className="text-[0.9rem] leading-snug text-ink-2">{line}</span>
                    </li>
                  ))}
                </ol>

                <Button
                  block
                  size="xl"
                  onClick={() => setCreating(true)}
                  icon={<Sparkles className="h-[18px] w-[18px]" />}
                  iconAfter={<ArrowRight className="h-5 w-5" />}
                >
                  {t('auth.getStarted')}
                </Button>

                <p className="t-xs text-center">{t('auth.firstRunFoot')}</p>
              </Card>
            )}

            {/* ── Returning: real profiles ──────────────────────────────── */}
            {profiles.length > 0 && !selected && (
              <div className="pop-in">
                <h2 className="t-h2">{t('auth.chooseProfile')}</h2>
                <p className="t-body mt-1">{t('auth.chooseProfileBody')}</p>

                <div className="mt-5 flex flex-col gap-2.5" role="list">
                  {profiles.map((p) => {
                    const Icon = ROLE_ICON[p.persona] ?? UserRound;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="listitem"
                        onClick={() => choose(p.id, p.hasPin)}
                        className="flex w-full items-center gap-3.5 rounded-[var(--r-md)] border-2 border-[var(--line)] bg-[var(--surface)] p-3.5 text-left transition-all hover:border-[var(--brand-teal)]"
                      >
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                          <Icon className="h-[22px] w-[22px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[1rem] font-bold text-ink">{p.name}</span>
                            <Tag tone={p.persona === 'elder' ? 'saffron' : 'teal'}>
                              {p.persona === 'elder'
                                ? t('auth.elder')
                                : p.persona === 'caregiver'
                                  ? t('auth.guardian')
                                  : t('auth.clinician')}
                            </Tag>
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 text-[0.8rem] leading-snug text-ink-3">
                            {p.hasPin && <Lock className="h-3 w-3 shrink-0" />}
                            {p.hasPin ? t('auth.pinNeeded') : t('auth.noPinNeeded')}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
                      </button>
                    );
                  })}
                </div>

                <Button variant="soft" block size="lg" className="mt-4" onClick={() => setCreating(true)}>
                  {t('auth.addProfile')}
                </Button>
              </div>
            )}

            {/* ── PIN pad for a protected profile ───────────────────────── */}
            {selected && (
              <Card className="pop-in flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="t-eyebrow">{t('auth.signingInAs')}</span>
                    <h2 className="t-h2 mt-0.5 truncate">{selected.name}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    onClick={() => {
                      setSelectedId(null);
                      setPin('');
                      setError('');
                    }}
                  >
                    {t('c.back')}
                  </Button>
                </div>

                <div className="flex justify-center gap-2.5" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-3.5 w-3.5 rounded-full border-2 transition-all"
                      style={{
                        borderColor: pin.length > i ? 'var(--brand-teal)' : 'var(--line-strong)',
                        background: pin.length > i ? 'var(--brand-teal)' : 'transparent',
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2" aria-label={t('auth.pin')}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => pressKey(d)}
                      className="min-h-[54px] rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--surface)] text-[1.18rem] font-bold text-ink transition active:scale-95"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin('')}
                    className="min-h-[54px] rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--surface)] text-[0.78rem] font-bold text-ink-3 transition active:scale-95"
                  >
                    {t('c.clear')}
                  </button>
                  <button
                    type="button"
                    onClick={() => pressKey('0')}
                    className="min-h-[54px] rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--surface)] text-[1.18rem] font-bold text-ink transition active:scale-95"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setPin((p) => p.slice(0, -1))}
                    aria-label={t('c.delete')}
                    className="grid min-h-[54px] place-items-center rounded-[var(--r-sm)] border border-[var(--line)] bg-[var(--surface)] text-ink-3 transition active:scale-95"
                  >
                    <Delete className="h-[18px] w-[18px]" />
                  </button>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-[var(--r-sm)] px-3 py-2 text-[0.85rem] font-semibold"
                    style={{ background: 'var(--danger-soft)', color: 'var(--danger-strong)' }}
                  >
                    {error}
                  </p>
                )}

                <p className="t-xs text-center">{t('auth.forgotPin')}</p>
              </Card>
            )}

            {/* ── Always available: the stranger's door ─────────────────── */}
            <button
              type="button"
              onClick={() => setShowSafeReturn(true)}
              className="mt-4 flex w-full items-center gap-3 rounded-[var(--r-md)] border p-3 text-left transition"
              style={{ borderColor: 'var(--danger-line)', background: 'var(--danger-soft)' }}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                <LifeBuoy className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9rem] font-bold" style={{ color: 'var(--danger-strong)' }}>
                  {t('auth.needHelp')}
                </span>
                <span
                  className="block text-[0.76rem] leading-snug"
                  style={{ color: 'var(--danger-strong)', opacity: 0.8 }}
                >
                  {t('auth.needHelpBody')}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--danger-strong)' }} />
            </button>

            <p className="t-xs mt-5 flex items-center justify-center gap-1.5 text-center">
              <WifiOff className="h-3.5 w-3.5" />
              {t('c.savedOffline')}
            </p>
          </div>
        </main>
      </div>

      <SafeReturnModal isOpen={showSafeReturn} onClose={() => setShowSafeReturn(false)} />
    </div>
  );
}
