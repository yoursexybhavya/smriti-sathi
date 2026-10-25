import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Delete,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { BrandMark, Button, Card, Field, Input, Tag } from '../../ui';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import type { AccountRole } from '../../services/account/AccountService';

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

const ROLES: { key: AccountRole; icon: typeof UserRound; tKey: string; dKey: string }[] = [
  { key: 'elder', icon: UserRound, tKey: 'signup.roleElder', dKey: 'signup.roleElderDesc' },
  { key: 'caregiver', icon: HeartHandshake, tKey: 'signup.roleFamily', dKey: 'signup.roleFamilyDesc' },
  { key: 'clinician', icon: Stethoscope, tKey: 'signup.roleClinician', dKey: 'signup.roleClinicianDesc' },
];

const STEPS = 4;

/**
 * First-run account creation. Nothing is pre-filled and nothing is preseeded:
 * the person picks who they are, gives their name, sets a PIN (required for
 * anyone who will see care data), and can add an emergency contact straight
 * away so the Safe Return card works from the very first day.
 */
export default function CreateAccountFlow({ onCreated, onCancel }: Props) {
  const { t } = useI18n();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<AccountRole>('elder');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const needsPin = role !== 'elder';
  const nameOk = name.trim().length >= 2;
  const pinOk = pin.length === 4 && pin === pinConfirm;

  const roleCopy = useMemo(
    () => ROLES.find((r) => r.key === role) ?? ROLES[0],
    [role],
  );

  const pressKey = (digit: string) => {
    setError('');
    const target = pin.length < 4 ? 'pin' : 'confirm';
    if (target === 'pin') setPin((p) => (p.length >= 4 ? p : p + digit));
    else setPinConfirm((p) => (p.length >= 4 ? p : p + digit));
  };

  const backspace = () => {
    setError('');
    if (pinConfirm) setPinConfirm((p) => p.slice(0, -1));
    else setPin((p) => p.slice(0, -1));
  };

  const next = () => {
    setError('');
    if (step === 2 && !nameOk) {
      setError(t('signup.nameError'));
      return;
    }
    if (step === 3 && (needsPin || pin.length > 0)) {
      if (pin.length !== 4) {
        setError(t('signup.pinShort'));
        return;
      }
      if (pin !== pinConfirm) {
        setError(t('signup.pinMismatch'));
        return;
      }
    }
    setStep((s) => Math.min(STEPS, s + 1));
  };

  const create = async () => {
    setBusy(true);
    setError('');
    const phone = contactPhone.replace(/[^0-9+]/g, '');
    const result = await register({
      role,
      name: name.trim(),
      pin: pin.length === 4 ? pin : undefined,
      guardianName: contactName.trim() || undefined,
      guardianPhone: phone || undefined,
    });
    setBusy(false);
    if (!result.success) {
      setError(t('c.somethingWrong'));
      return;
    }
    if (contactName.trim() && phone) {
      try {
        localStorage.setItem('smriti_linked_caregiver_name', contactName.trim());
        localStorage.setItem('smriti_linked_caregiver_phone', phone);
      } catch {
        /* ignore */
      }
    }
    onCreated();
  };

  return (
    <div className="min-h-[100dvh] w-full px-4 py-6 sm:px-6 sm:py-10" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div className="min-w-0">
              <div className="truncate text-[0.95rem] font-bold leading-tight text-ink">{t('app.name')}</div>
              <div className="truncate text-[0.7rem] text-ink-3">{t('app.shortTagline')}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => (step === 1 ? onCancel() : setStep((s) => s - 1))}
          >
            {step === 1 ? t('c.cancel') : t('c.back')}
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: STEPS }, (_, i) => i + 1).map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  background: i < step ? 'var(--brand-teal)' : i === step ? 'var(--brand-saffron)' : 'var(--line)',
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="t-eyebrow">{t('signup.step', { n: step, total: STEPS })}</span>
            <span className="t-xs font-bold text-ink-2">
              {step === 1
                ? t('signup.roleTitle')
                : step === 2
                  ? t('signup.nameTitle')
                  : step === 3
                    ? t('signup.pinTitle')
                    : t('signup.contactTitle')}
            </span>
          </div>
        </div>

        {/* ── 1 · who is this ─────────────────────────────────────────── */}
        {step === 1 && (
          <Card className="pop-in flex flex-col gap-4">
            <div>
              <h1 className="t-h1">{t('signup.roleTitle')}</h1>
              <p className="t-body mt-1.5">{t('signup.roleBody')}</p>
            </div>

            <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={t('signup.roleTitle')}>
              {ROLES.map(({ key, icon: Icon, tKey, dKey }) => {
                const active = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setRole(key);
                      setError('');
                    }}
                    className="flex w-full items-center gap-3.5 rounded-[var(--r-md)] border-2 p-3.5 text-left transition-all"
                    style={{
                      borderColor: active ? 'var(--brand-teal)' : 'var(--line)',
                      background: active ? 'var(--brand-teal-soft)' : 'var(--surface)',
                    }}
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-sm)]"
                      style={{
                        background: active ? 'var(--brand-teal)' : 'var(--surface-sunken)',
                        color: active ? '#fff' : 'var(--ink-3)',
                      }}
                    >
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1rem] font-bold text-ink">{t(tKey)}</span>
                      <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-3">{t(dKey)}</span>
                    </span>
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2"
                      style={{
                        borderColor: active ? 'var(--brand-teal)' : 'var(--line-strong)',
                        background: active ? 'var(--brand-teal)' : 'transparent',
                      }}
                    >
                      {active && <Check className="h-3.5 w-3.5 text-white" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button size="lg" block onClick={next} iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}>
              {t('c.next')}
            </Button>
          </Card>
        )}

        {/* ── 2 · name ────────────────────────────────────────────────── */}
        {step === 2 && (
          <Card className="pop-in flex flex-col gap-4">
            <div>
              <h1 className="t-h1">{t('signup.nameTitle')}</h1>
              <p className="t-body mt-1.5">{t('signup.nameBody')}</p>
            </div>

            <Field label={t('signup.yourName')} htmlFor="signup-name" error={error && !nameOk ? error : undefined}>
              <Input
                id="signup-name"
                value={name}
                autoFocus
                autoComplete="name"
                placeholder={t('signup.namePlaceholder')}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') next();
                }}
              />
            </Field>

            <div className="flex items-start gap-2 rounded-[var(--r-sm)] bg-[var(--surface-warm)] p-3">
              <Tag tone="teal">{t(roleCopy.tKey)}</Tag>
              <p className="t-xs m-0 min-w-0 leading-snug">{t('signup.roleHint')}</p>
            </div>

            <Button size="lg" block onClick={next} disabled={!nameOk} iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}>
              {t('c.next')}
            </Button>
          </Card>
        )}

        {/* ── 3 · PIN ─────────────────────────────────────────────────── */}
        {step === 3 && (
          <Card className="pop-in flex flex-col gap-4">
            <div>
              <h1 className="t-h1">{needsPin ? t('signup.pinTitle') : t('signup.pinTitleElder')}</h1>
              <p className="t-body mt-1.5">{needsPin ? t('signup.pinBody') : t('signup.pinBodyElder')}</p>
            </div>

            <div className="flex items-center justify-center gap-2.5" aria-hidden>
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
              <span className="mx-1 text-ink-4">·</span>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-3.5 w-3.5 rounded-full border-2 transition-all"
                  style={{
                    borderColor: pinConfirm.length > i ? 'var(--brand-saffron)' : 'var(--line-strong)',
                    background: pinConfirm.length > i ? 'var(--brand-saffron)' : 'transparent',
                  }}
                />
              ))}
            </div>

            <p className="t-xs text-center">
              {pin.length < 4 ? t('signup.pinEnter') : t('signup.pinConfirm')}
            </p>

            <div className="grid grid-cols-3 gap-2" aria-label={t('signup.pinTitle')}>
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
                onClick={() => {
                  setPin('');
                  setPinConfirm('');
                  setError('');
                }}
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
                onClick={backspace}
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

            <p className="t-xs flex items-start gap-1.5">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t('signup.pinPrivacy')}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                onClick={next}
                disabled={pin.length !== 4 || pinConfirm.length !== 4}
                iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}
              >
                {t('c.next')}
              </Button>
              {!needsPin && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setPin('');
                    setPinConfirm('');
                    setStep(4);
                  }}
                >
                  {t('ob.skip')}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* ── 4 · emergency contact ───────────────────────────────────── */}
        {step === 4 && (
          <Card className="pop-in flex flex-col gap-4">
            <div>
              <h1 className="t-h1">{t('signup.contactTitle')}</h1>
              <p className="t-body mt-1.5">{t('signup.contactBody')}</p>
            </div>

            <Field label={t('signup.contactName')} htmlFor="signup-contact-name">
              <Input
                id="signup-contact-name"
                value={contactName}
                autoComplete="name"
                placeholder={t('signup.contactNamePlaceholder')}
                onChange={(e) => setContactName(e.target.value)}
              />
            </Field>

            <Field label={t('signup.contactPhone')} htmlFor="signup-contact-phone" hint={t('signup.contactHint')}>
              <Input
                id="signup-contact-phone"
                type="tel"
                inputMode="tel"
                value={contactPhone}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </Field>

            <div className="flex items-center gap-2 rounded-[var(--r-sm)] bg-[var(--success-soft)] px-3 py-2 text-[0.8rem] font-semibold text-[var(--success)]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {t('signup.contactWhy')}
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

            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                loading={busy}
                onClick={create}
                icon={<Check className="h-[18px] w-[18px]" />}
              >
                {t('signup.create')}
              </Button>
              <Button variant="ghost" size="lg" loading={busy} onClick={create}>
                {t('ob.skip')}
              </Button>
            </div>
          </Card>
        )}

        <p className="t-xs flex items-center justify-center gap-1.5 text-center">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t('signup.localOnly')}
        </p>
      </div>
    </div>
  );
}
