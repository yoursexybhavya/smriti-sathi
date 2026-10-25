import { useMemo, useState } from 'react';
import { ArrowRight, Delete, Globe, HeartHandshake, LifeBuoy, Lock, Moon, ShieldCheck, Stethoscope, Sun, UserRound, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../models/Role';
import { SafeReturnModal } from '../../components/SafeReturnModal';
import { BrandLockup, Button, Card, IconButton, Tag } from '../../ui';
import { useI18n } from '../../i18n';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const PROFILE_ICON = {
  patient_primary: UserRound,
  caregiver_primary: HeartHandshake,
  asha_worker: Stethoscope,
} as const;

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, quickLogin, demoUsers } = useAuth();
  const { state, toggleTheme } = useApp();
  const { t, lang } = useI18n();

  const [selectedUser, setSelectedUser] = useState<string>('patient_primary');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSafeReturn, setShowSafeReturn] = useState(false);

  const selected = demoUsers.find((u) => u.id === selectedUser);
  const needsPin = selected?.role === UserRole.CAREGIVER;

  const profileCopy = useMemo(
    () => ({
      patient_primary: { title: t('auth.elderName'), role: t('auth.elder'), desc: t('auth.elderDesc') },
      caregiver_primary: { title: t('auth.guardianName'), role: t('auth.guardian'), desc: t('auth.guardianDesc') },
      asha_worker: { title: t('auth.clinicianName'), role: t('auth.clinician'), desc: t('auth.clinicianDesc') },
    }),
    [t],
  );

  const finish = () => {
    onLoginSuccess();
  };

  /** Elder entry is frictionless: one tap, no PIN, no keyboard. */
  const handleDirectElderLogin = async () => {
    setBusy(true);
    setError('');
    const result = await quickLogin('patient_primary');
    if (result.success) finish();
    else setError(result.error || t('c.somethingWrong'));
    setBusy(false);
  };

  const handleContinue = async () => {
    if (!needsPin) return handleDirectElderLogin();
    setBusy(true);
    setError('');
    const result = await login(selectedUser, pin);
    if (result.success) finish();
    else setError(t('auth.pinWrong'));
    setBusy(false);
  };

  const pressKey = (digit: string) => {
    setError('');
    setPin((p) => (p.length >= 4 ? p : p + digit));
  };

  const isDark = state.accessibility?.theme === 'dark';

  return (
    <div className="min-h-[100dvh] w-full" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1180px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Brand panel (desktop) ─────────────────────────────────────── */}
        <aside
          className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
          style={{
            background:
              'radial-gradient(120% 100% at 20% 0%, #12756A 0%, #0E5C50 42%, #083F38 100%)',
            borderRadius: '0 var(--r-2xl) var(--r-2xl) 0',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(232,169,78,0.4), transparent 60%)' }}
          />
          <BrandLockup size={46} name={t('app.name')} showTagline tagline={t('app.shortTagline')} />

          <div className="relative max-w-[26rem]">
            <h1
              className="text-[2.6rem] leading-[1.06] text-[#FBF6EE]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.03em' }}
            >
              {t('app.tagline')}
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-[#CFE3DD]">
              Memory games, gentle reminders, a family album and an emergency ID — designed with and for
              elders living with dementia, in their own language.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {[
                { icon: ShieldCheck, text: 'Works fully offline — no signal needed at home' },
                { icon: HeartHandshake, text: 'Family and ASHA worker stay in the loop' },
                { icon: LifeBuoy, text: 'Safe Return card for anyone who finds them' },
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

        {/* ── Selection panel ───────────────────────────────────────────── */}
        <main className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-[28rem]">
            <div className="mb-7 flex items-start justify-between gap-3 lg:hidden">
              <BrandLockup size={40} name={t('app.name')} showTagline tagline={t('app.shortTagline')} />
              <div className="flex shrink-0 items-center gap-1.5">
                <IconButton label={t('c.theme')} variant="ghost" size="sm" onClick={toggleTheme}>
                  {isDark ? <Sun /> : <Moon />}
                </IconButton>
              </div>
            </div>

            {/* Appearance control is reachable before sign-in: an elder who
                needs calm-night or large text should not have to log in first. */}
            <div className="mb-4 hidden items-center justify-end gap-1.5 lg:flex">
              <Tag tone="teal" icon={<Globe className="h-3 w-3" />}>{lang.toUpperCase()}</Tag>
              <IconButton label={t('c.theme')} variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun /> : <Moon />}
              </IconButton>
            </div>

            <h2 className="t-h2">{t('auth.chooseProfile')}</h2>
            <p className="t-body mt-1">{t('auth.chooseProfileBody')}</p>

            <div className="mt-5 flex flex-col gap-2.5" role="radiogroup" aria-label={t('auth.chooseProfile')}>
              {demoUsers.map((user) => {
                const Icon = PROFILE_ICON[user.id as keyof typeof PROFILE_ICON] ?? UserRound;
                const copy = profileCopy[user.id as keyof typeof profileCopy];
                const isSelected = selectedUser === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedUser(user.id);
                      setPin('');
                      setError('');
                    }}
                    className="flex w-full items-center gap-3.5 rounded-[var(--r-md)] border-2 p-3.5 text-left transition-all"
                    style={{
                      borderColor: isSelected ? 'var(--brand-teal)' : 'var(--line)',
                      background: isSelected ? 'var(--brand-teal-soft)' : 'var(--surface)',
                      boxShadow: isSelected ? 'var(--shadow-1)' : 'none',
                    }}
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)]"
                      style={{
                        background: isSelected ? 'var(--brand-teal)' : 'var(--surface-sunken)',
                        color: isSelected ? '#fff' : 'var(--ink-3)',
                      }}
                    >
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[1rem] font-bold text-ink">{copy?.title ?? user.displayName}</span>
                        <Tag tone={isSelected ? 'teal' : 'default'}>{copy?.role}</Tag>
                      </span>
                      <span className="mt-1 block text-[0.82rem] leading-snug text-ink-3">{copy?.desc}</span>
                    </span>
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2"
                      style={{
                        borderColor: isSelected ? 'var(--brand-teal)' : 'var(--line-strong)',
                        background: isSelected ? 'var(--brand-teal)' : 'transparent',
                      }}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* PIN pad */}
            {needsPin && (
              <Card tone="warm" className="mt-4 !rounded-[var(--r-md)] !p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[0.86rem] font-bold text-ink">
                    <Lock className="h-4 w-4" /> {t('auth.pin')}
                  </span>
                  <button
                    type="button"
                    className="text-[0.78rem] font-bold text-brand hover:underline"
                    onClick={() => {
                      setSelectedUser('patient_primary');
                      setPin('');
                      setError('');
                    }}
                  >
                    ← Back to Elder
                  </button>
                </div>

                <div className="my-3 flex justify-center gap-2.5" aria-hidden>
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

                <div className="grid grid-cols-3 gap-2" aria-label="Tactile Keypad for Caregiver PIN">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => pressKey(d)}
                      className="min-h-[52px] rounded-[var(--r-sm)] border border-line bg-surface text-[1.15rem] font-bold text-ink transition active:scale-95"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin('')}
                    className="min-h-[52px] rounded-[var(--r-sm)] border border-line bg-surface text-[0.78rem] font-bold text-ink-3 transition active:scale-95"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => pressKey('0')}
                    className="min-h-[52px] rounded-[var(--r-sm)] border border-line bg-surface text-[1.15rem] font-bold text-ink transition active:scale-95"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setPin((p) => p.slice(0, -1))}
                    aria-label="Delete last digit"
                    className="grid min-h-[52px] place-items-center rounded-[var(--r-sm)] border border-line bg-surface text-ink-3 transition active:scale-95"
                  >
                    <Delete className="h-[18px] w-[18px]" />
                  </button>
                </div>

                <p className="t-xs mt-2.5 text-center">
                  {t('auth.demoPin')}: <span className="t-num font-bold text-ink-2">{selectedUser === 'asha_worker' ? '0000' : '1234'}</span>
                </p>
              </Card>
            )}

            {error && (
              <p className="mt-3 rounded-[var(--r-sm)] px-3 py-2 text-[0.85rem] font-semibold" style={{ background: 'var(--danger-soft)', color: 'var(--danger-strong)' }}>
                {error}
              </p>
            )}

            <Button
              block
              size="lg"
              className="mt-5"
              loading={busy}
              disabled={needsPin && pin.length < 4}
              onClick={handleContinue}
              iconAfter={<ArrowRight className="h-5 w-5" />}
            >
              {needsPin ? t('auth.enter') : t('auth.enterAsElder')}
            </Button>

            <button
              type="button"
              onClick={() => setShowSafeReturn(true)}
              className="mt-4 flex w-full items-center gap-3 rounded-[var(--r-md)] border p-3 text-left transition"
              style={{ borderColor: 'var(--danger-line)', background: 'var(--danger-soft)' }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: 'var(--danger)', color: '#fff' }}>
                <LifeBuoy className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9rem] font-bold" style={{ color: 'var(--danger-strong)' }}>
                  {t('auth.needHelp')}
                </span>
                <span className="block text-[0.76rem] leading-snug" style={{ color: 'var(--danger-strong)', opacity: 0.8 }}>
                  {t('auth.needHelpBody')}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--danger-strong)' }} />
            </button>

            <p className="t-xs mt-5 flex items-center justify-center gap-1.5 text-center">
              <WifiOff className="h-3.5 w-3.5" />
              {isDark ? t('c.dark') : t('c.light')} · {t('c.savedOffline')}
            </p>
          </div>
        </main>
      </div>

      <SafeReturnModal isOpen={showSafeReturn} onClose={() => setShowSafeReturn(false)} />
    </div>
  );
}
