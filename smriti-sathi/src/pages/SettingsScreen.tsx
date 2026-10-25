import { useState } from 'react';
import {
  Type as ALargeSmall,
  ArrowRight,
  Contrast,
  Database,
  Eye,
  Globe,
  HeartHandshake,
  Info,
  LifeBuoy,
  LogOut,
  Pill,
  Moon,
  ShieldCheck,
  Sun,
  Trash2,
  UserRound,
  Volume2,
} from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Alert, Button, Card, ChoiceRow, Field, Input, Section, Segmented, Sheet, Switch, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import { UserRole } from '../models/Role';
import { medicalCardService, type MedicalCard } from '../services/care/MedicalCardService';

interface Props {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

export default function SettingsScreen({ onNavigate, persona = 'elder' }: Props) {
  const { state, updateAccessibility, updatePatient, updateEmergencyContact, toggleTheme, eraseEverything } = useApp();
  const { role, logout } = useAuth();
  const { t, lang, setLanguage, languages } = useI18n();

  const isCaregiver = role === UserRole.CAREGIVER;
  const [showLang, setShowLang] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const [showErase, setShowErase] = useState(false);
  const [eraseConfirm, setEraseConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [contactName, setContactName] = useState(state.emergencyContact?.name ?? '');
  const [contactPhone, setContactPhone] = useState(state.emergencyContact?.phone ?? '');
  const [contactError, setContactError] = useState('');
  const [showMed, setShowMed] = useState(false);
  const [med, setMed] = useState<MedicalCard>(() => medicalCardService.get());
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

  const saveContact = async () => {
    const phone = contactPhone.replace(/[^0-9+]/g, '');
    if (!contactName.trim() && !phone) {
      await updateEmergencyContact(null);
      setShowCare(false);
      return;
    }
    if (contactName.trim().length < 2 || phone.replace(/\D/g, '').length < 8) {
      setContactError(t('set.contactError'));
      return;
    }
    setContactError('');
    await updateEmergencyContact({ name: contactName.trim(), phone });
    setShowCare(false);
  };

  const saveMedical = () => {
    medicalCardService.save(med);
    setShowMed(false);
  };

  const doErase = async () => {
    if (eraseConfirm.trim().toUpperCase() !== 'ERASE') {
      return;
    }
    setBusy(true);
    await eraseEverything();
    setBusy(false);
    window.location.href = window.location.pathname;
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

            <button type="button" onClick={logout} className="row row--tap">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-saffron-soft)] text-[var(--brand-saffron-ink)]">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{t('set.switchProfile')}</span>
                <span className="t-xs block">{t('set.switchProfileBody')}</span>
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

            <button
              type="button"
              onClick={() => {
                setContactName(state.emergencyContact?.name ?? '');
                setContactPhone(state.emergencyContact?.phone ?? '');
                setContactError('');
                setShowCare(true);
              }}
              className="row row--tap"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--danger-soft)] text-[var(--danger-strong)]">
                <LifeBuoy className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{t('set.careCircle')}</span>
                <span className="t-xs block">
                  {state.emergencyContact
                    ? `${state.emergencyContact.name} · ${state.emergencyContact.phone}`
                    : t('set.careCircleEmpty')}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMed(medicalCardService.get());
                setShowMed(true);
              }}
              className="row row--tap"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--info-soft)] text-[var(--info)]">
                <Pill className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-bold text-ink">{t('set.medicalCard')}</span>
                <span className="t-xs block">
                  {medicalCardService.isEmpty(med) ? t('set.medicalCardEmpty') : t('set.medicalCardBody')}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-4" />
            </button>

            {isCaregiver && (
              <button type="button" onClick={() => onNavigate('diagnostics')} className="row row--tap">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-ink-3">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-bold text-ink">{t('set.systemCheck')}</span>
                  <span className="t-xs block">{t('set.systemCheckBody')}</span>
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
              <Tag>{t('set.version')} 3.1.0</Tag>
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
          <Button
            variant="ghost"
            block
            size="lg"
            className="mt-2"
            onClick={() => {
              setEraseConfirm('');
              setShowErase(true);
            }}
            icon={<Trash2 className="h-[18px] w-[18px]" />}
          >
            {t('set.erase')}
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
            hint={!ageError ? t('ob.ageRange') : undefined}
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

      {/* Care circle — the number printed on the Safe Return card */}
      <Sheet
        open={showCare}
        onClose={() => setShowCare(false)}
        title={t('set.careCircle')}
        footer={
          <Button block size="lg" onClick={saveContact} icon={<ShieldCheck className="h-[18px] w-[18px]" />}>
            {t('c.save')}
          </Button>
        }
      >
        <p className="t-body">{t('set.careCircleBody')}</p>
        <div className="mt-4 flex flex-col gap-3">
          <Field label={t('ob.contactName')} htmlFor="care-name" error={contactError ? contactError : undefined}>
            <Input
              id="care-name"
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                if (contactError) setContactError('');
              }}
              placeholder={t('ob.contactNamePlaceholder')}
            />
          </Field>
          <Field label={t('ob.contactPhone')} htmlFor="care-phone" hint={t('ob.contactHint')}>
            <Input
              id="care-phone"
              type="tel"
              inputMode="tel"
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (contactError) setContactError('');
              }}
              placeholder="+91 98765 43210"
            />
          </Field>
        </div>
        <p className="t-xs mt-3">{t('ob.contactStays')}</p>
      </Sheet>

      {/* Medical card — printed on the Safe Return screen for a stranger */}
      <Sheet
        open={showMed}
        onClose={() => setShowMed(false)}
        title={t('set.medicalCard')}
        footer={
          <Button block size="lg" onClick={saveMedical} icon={<ShieldCheck className="h-[18px] w-[18px]" />}>
            {t('c.save')}
          </Button>
        }
      >
        <p className="t-body">{t('set.medicalCardBody')}</p>
        <div className="mt-4 flex flex-col gap-3">
          <Field label={t('saf.bloodGroup')} htmlFor="med-blood">
            <Input
              id="med-blood"
              value={med.bloodGroup}
              onChange={(e) => setMed((m) => ({ ...m, bloodGroup: e.target.value.toUpperCase().slice(0, 4) }))}
              placeholder="O+"
            />
          </Field>
          <Field label={t('saf.conditions')} htmlFor="med-conditions" hint={t('set.medicalCardHint')}>
            <Input
              id="med-conditions"
              value={med.conditions.join(', ')}
              onChange={(e) =>
                setMed((m) => ({ ...m, conditions: e.target.value.split(',').map((v) => v.trimStart()) }))
              }
              placeholder={t('set.medicalCardConditionsPlaceholder')}
            />
          </Field>
          <Field label={t('saf.medicines')} htmlFor="med-medicines" hint={t('set.medicalCardHint')}>
            <Input
              id="med-medicines"
              value={med.medicines.join(', ')}
              onChange={(e) =>
                setMed((m) => ({ ...m, medicines: e.target.value.split(',').map((v) => v.trimStart()) }))
              }
              placeholder={t('set.medicalCardMedicinesPlaceholder')}
            />
          </Field>
          <Field label={t('saf.allergies')} htmlFor="med-allergies" hint={t('set.medicalCardHint')}>
            <Input
              id="med-allergies"
              value={med.allergies.join(', ')}
              onChange={(e) =>
                setMed((m) => ({ ...m, allergies: e.target.value.split(',').map((v) => v.trimStart()) }))
              }
              placeholder={t('set.medicalCardAllergiesPlaceholder')}
            />
          </Field>
        </div>
      </Sheet>

      {/* Erase everything — the only way back to a blank install */}
      <Sheet
        open={showErase}
        onClose={() => setShowErase(false)}
        title={t('set.eraseTitle')}
        footer={
          <Button
            block
            size="lg"
            variant="danger"
            loading={busy}
            disabled={eraseConfirm.trim().toUpperCase() !== 'ERASE'}
            onClick={doErase}
            icon={<Trash2 className="h-[18px] w-[18px]" />}
          >
            {t('set.eraseConfirm')}
          </Button>
        }
      >
        <Alert tone="danger" title={t('set.eraseTitle')}>
          {t('set.eraseBody')}
        </Alert>
        <Field className="mt-4" label={t('set.eraseType')} htmlFor="erase-confirm">
          <Input
            id="erase-confirm"
            value={eraseConfirm}
            onChange={(e) => setEraseConfirm(e.target.value)}
            placeholder="ERASE"
            autoComplete="off"
          />
        </Field>
      </Sheet>
    </AppShell>
  );
}
