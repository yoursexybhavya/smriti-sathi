import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, Check, Clock, Droplets, Pill, Plus, Trash2, Utensils, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Button, Card, ConfirmDialog, EmptyState, Field, Input, Section, Segmented, Sheet, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { useVoice } from '../hooks/useVoice';
import { reminderService } from '../services/ReminderService';
import type { Reminder } from '../database/db';

interface Props {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

const TYPE_META: Record<Reminder['type'], { icon: LucideIcon; labelKey: string; tone: 'teal' | 'saffron' | 'info' | 'success' }> = {
  medicine: { icon: Pill, labelKey: 'rem.typeMedicine', tone: 'teal' },
  hydration: { icon: Droplets, labelKey: 'rem.typeWater', tone: 'info' },
  activity: { icon: Utensils, labelKey: 'rem.typeWalk', tone: 'success' },
  appointment: { icon: CalendarDays, labelKey: 'rem.typeAppointment', tone: 'saffron' },
};

const TONE_BG: Record<string, string> = {
  teal: 'var(--brand-teal-soft)',
  saffron: 'var(--brand-saffron-soft)',
  info: 'var(--info-soft)',
  success: 'var(--success-soft)',
};
const TONE_FG: Record<string, string> = {
  teal: 'var(--brand-teal-deep)',
  saffron: 'var(--brand-saffron-ink)',
  info: 'var(--info)',
  success: 'var(--success)',
};

export default function RemindersScreen({ onNavigate, persona = 'elder' }: Props) {
  const { state, toggleTheme } = useApp();
  const { t, meta } = useI18n();
  const { speak } = useVoice();
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;
  const isCaregiver = persona !== 'elder';

  const [items, setItems] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState<Reminder | null>(null);
  const [form, setForm] = useState({ type: 'medicine' as Reminder['type'], title: '', time: '08:00', repeat: 'daily' as NonNullable<Reminder['repeatPattern']> });

  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(meta.htmlLang, { hour: 'numeric', minute: '2-digit', hour12: true }),
    [meta.htmlLang],
  );

  const load = useCallback(async (uid: number) => {
    try {
      setItems(await reminderService.getAllReminders(uid));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const { upcoming, done, missed } = useMemo(() => {
    const s = [...items].sort((a, b) => a.scheduledTime - b.scheduledTime);
    return {
      upcoming: s.filter((r) => r.status === 'pending'),
      done: s.filter((r) => r.status === 'completed'),
      missed: s.filter((r) => r.status === 'missed'),
    };
  }, [items]);

  const complete = async (r: Reminder) => {
    if (!userId || !r.id) return;
    await reminderService.completeReminder(r.id, userId);
    await load(userId);
  };
  const snooze = async (r: Reminder) => {
    if (!userId || !r.id) return;
    await reminderService.snoozeReminder(r.id, 15);
    await load(userId);
  };
  const remove = async () => {
    if (!toDelete?.id) return;
    await reminderService.deleteReminder(toDelete.id);
    setToDelete(null);
    if (userId) await load(userId);
  };

  const add = async () => {
    if (!userId || !form.title.trim()) return;
    const [h, m] = form.time.split(':').map(Number);
    const when = new Date();
    when.setHours(h, m, 0, 0);
    if (when.getTime() < Date.now()) when.setDate(when.getDate() + 1);
    await reminderService.createReminder(userId, form.type, form.title.trim(), when.getTime(), undefined, form.repeat);
    setShowAdd(false);
    setForm({ type: 'medicine', title: '', time: '08:00', repeat: 'daily' });
    await load(userId);
  };

  const speakList = async () => {
    const parts = upcoming.length
      ? upcoming.map((r) => `${r.title}, ${timeFmt.format(new Date(r.scheduledTime))}`)
      : [t('rem.emptyTitle')];
    await speak(parts.join('. '));
  };

  const renderRow = (r: Reminder, kind: 'upcoming' | 'done' | 'missed') => {
    const m = TYPE_META[r.type] ?? TYPE_META.medicine;
    const Icon = m.icon;
    return (
      <div key={r.id} className="flex items-center gap-3 border-b border-[var(--line-soft)] py-3 last:border-0">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-sm)]"
          style={{ background: TONE_BG[m.tone], color: TONE_FG[m.tone] }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className={`truncate text-[0.98rem] font-bold ${kind === 'done' ? 'text-ink-3 line-through' : 'text-ink'}`}>
            {r.title}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8rem] text-ink-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {timeFmt.format(new Date(r.scheduledTime))}
            </span>
            {r.repeatPattern === 'daily' && (
              <>
                <span>·</span>
                <span>{t('rem.everyDay')}</span>
              </>
            )}
          </div>
        </div>

        {kind === 'upcoming' && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Button size="sm" onClick={() => complete(r)} icon={<Check className="h-4 w-4" />}>
              {t('home.taken')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => snooze(r)} className="hidden sm:inline-flex">
              {t('home.snooze')}
            </Button>
          </div>
        )}
        {kind === 'done' && <Tag tone="success" icon={<Check className="h-3 w-3" />}>{t('c.done')}</Tag>}
        {kind === 'missed' && <Tag tone="danger">{t('rem.missed')}</Tag>}
        {isCaregiver && (
          <button
            type="button"
            onClick={() => setToDelete(r)}
            aria-label={t('c.delete')}
            className="ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-4 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <AppShell
      persona={persona}
      activeTab={isCaregiver ? 'caregiver-reminders' : 'reminders'}
      onNavigate={onNavigate}
      onOpenSos={persona === 'elder' ? () => window.dispatchEvent(new Event('open-safe-return')) : undefined}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('rem.title')}
      subtitle={t('rem.subtitle')}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('rem.title') }}
    >
      <div className="rise-in flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={() => setShowAdd(true)} icon={<Plus className="h-[18px] w-[18px]" />}>
          {t('rem.add')}
        </Button>
        <Button variant="secondary" size="lg" onClick={speakList} icon={<Volume2 className="h-[18px] w-[18px]" />}>
          {t('home.hearThis')}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="mt-5">
          <EmptyState
            icon={<Bell />}
            title={t('rem.emptyTitle')}
            body={t('rem.emptyBody')}
            action={<Button onClick={() => setShowAdd(true)} icon={<Plus className="h-4 w-4" />}>{t('rem.add')}</Button>}
          />
        </Card>
      ) : (
        <>
          <Section className="mt-6" title={t('rem.upcoming')} subtitle={`${upcoming.length} ${t('c.of')} ${items.length}`}>
            <Card>
              {upcoming.length ? upcoming.map((r) => renderRow(r, 'upcoming')) : <p className="t-sm py-3">{t('home.noReminderToday')}</p>}
            </Card>
          </Section>

          {done.length > 0 && (
            <Section className="mt-6" title={t('rem.completed')}>
              <Card>{done.map((r) => renderRow(r, 'done'))}</Card>
            </Section>
          )}

          {missed.length > 0 && (
            <Section className="mt-6" title={t('rem.missed')}>
              <Card>{missed.map((r) => renderRow(r, 'missed'))}</Card>
            </Section>
          )}
        </>
      )}

      {/* Add reminder sheet */}
      <Sheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={t('rem.newTitle')}
        footer={
          <Button block size="lg" onClick={add} disabled={!form.title.trim()} icon={<Check className="h-[18px] w-[18px]" />}>
            {t('rem.saveReminder')}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label={t('rem.kind')} htmlFor="rem-type">
            <Segmented
              ariaLabel={t('rem.kind')}
              value={form.type}
              onChange={(v) => setForm((f) => ({ ...f, type: v as Reminder['type'] }))}
              options={[
                { value: 'medicine', label: t('rem.typeMedicine') },
                { value: 'hydration', label: t('rem.typeWater') },
                { value: 'activity', label: t('rem.typeMeal') },
                { value: 'appointment', label: t('rem.typeAppointment') },
              ]}
            />
          </Field>

          <Field label={t('rem.whatFor')} htmlFor="rem-title" hint={t('rem.whatForHint')}>
            <Input
              id="rem-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={t('rem.titlePlaceholder')}
              data-autofocus
            />
          </Field>

          <Field label={t('rem.atWhatTime')} htmlFor="rem-time">
            <Input id="rem-time" type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </Field>

          <Field label={t('rem.frequency')} htmlFor="rem-repeat">
            <Segmented
              ariaLabel={t('rem.frequency')}
              value={form.repeat}
              onChange={(v) => setForm((f) => ({ ...f, repeat: v as NonNullable<Reminder['repeatPattern']> }))}
              options={[
                { value: 'daily', label: t('rem.repeatDaily') },
                { value: 'weekly', label: t('rem.repeatWeekly') },
                { value: 'none', label: t('rem.repeatOnce') },
              ]}
            />
          </Field>
        </div>
      </Sheet>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={t('rem.deleteTitle')}
        body={t('rem.deleteBody')}
        danger
      />
    </AppShell>
  );
}
