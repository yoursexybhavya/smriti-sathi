import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookHeart, Camera, ImagePlus, MapPin, Plus, Sparkles, Trash2, Users, Volume2 } from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Button, Card, ConfirmDialog, EmptyState, Field, Input, Section, Segmented, Sheet, Tag, Textarea } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { useVoice } from '../hooks/useVoice';
import { memoryBookService } from '../services/MemoryBookService';
import type { MemoryItem } from '../database/db';

interface Props {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  isOnline?: boolean;
  persona?: 'elder' | 'caregiver' | 'clinician';
}

type Filter = 'all' | 'family' | 'places' | 'memories';

export default function MemoryBookScreen({ onNavigate, persona = 'elder' }: Props) {
  const { state, toggleTheme } = useApp();
  const { t } = useI18n();
  const { speak, isSpeaking } = useVoice();
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;
  const isCaregiver = persona !== 'elder';

  const [items, setItems] = useState<MemoryItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState<MemoryItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    relation: '',
    description: '',
    imageData: '',
    category: 'family' as MemoryItem['category'],
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    async (uid: number) => {
      try {
        setItems(await memoryBookService.getAllMemoryItems(uid));
      } catch {
        /* ignore */
      }
    },
    [],
  );

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter || (filter === 'memories' && i.category === 'objects'))),
    [items, filter],
  );

  const pickImage = async (file: File) => {
    setBusy(true);
    try {
      const data = await memoryBookService.processImage(file, 900, 900);
      setForm((f) => ({ ...f, imageData: data }));
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    if (!userId || !form.subject.trim()) return;
    setBusy(true);
    try {
      await memoryBookService.createMemoryItem({
        userId,
        category: form.category,
        title: form.title.trim() || form.subject.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        relation: form.relation.trim(),
        imageData: form.imageData || undefined,
      });
      setShowAdd(false);
      setForm({ title: '', subject: '', relation: '', description: '', imageData: '', category: 'family' });
      await load(userId);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!toDelete?.id || !userId) return;
    await memoryBookService.deleteMemoryItem(toDelete.id);
    setToDelete(null);
    await load(userId);
  };

  const handleTapToHear = async (item: MemoryItem) => {
    setSpeakingId(item.id ?? null);
    const text = `${item.subject}. ${item.relation ? item.relation + '. ' : ''}${item.description}`;
    await speak(text);
    setSpeakingId(null);
  };

  const filters: { id: Filter; label: string; icon: typeof Users }[] = [
    { id: 'all', label: t('mem.all'), icon: BookHeart },
    { id: 'family', label: t('mem.people'), icon: Users },
    { id: 'places', label: t('mem.places'), icon: MapPin },
    { id: 'memories', label: t('mem.events'), icon: Sparkles },
  ];

  return (
    <AppShell
      persona={persona}
      activeTab={isCaregiver ? 'caregiver-memory' : 'memory-book'}
      onNavigate={onNavigate}
      onOpenSos={persona === 'elder' ? () => window.dispatchEvent(new Event('open-safe-return')) : undefined}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('mem.title')}
      subtitle={t('mem.subtitle')}
      identity={{ name: patient?.name ?? t('auth.elderName'), sub: t('mem.title') }}
    >
      <div className="rise-in flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={() => setShowAdd(true)} icon={<Plus className="h-[18px] w-[18px]" />}>
          {t('mem.add')}
        </Button>
        <Button variant="secondary" size="lg" onClick={() => onNavigate('memory-book-viewer')} icon={<BookHeart className="h-[18px] w-[18px]" />}>
          {t('mem.viewer')}
        </Button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {filters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.82rem] font-bold transition"
            style={{
              borderColor: filter === id ? 'transparent' : 'var(--line)',
              background: filter === id ? 'var(--brand-teal)' : 'var(--surface)',
              color: filter === id ? '#fff' : 'var(--ink-2)',
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className={filter === id ? 'text-white/70' : 'text-ink-4'}>
              {id === 'all' ? items.length : items.filter((i) => i.category === id).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-5">
          <EmptyState
            art={undefined}
            icon={<Camera />}
            title={t('mem.emptyTitle')}
            body={t('mem.emptyBody')}
            action={
              <Button onClick={() => setShowAdd(true)} icon={<ImagePlus className="h-4 w-4" />}>
                {t('mem.add')}
              </Button>
            }
          />
        </Card>
      ) : (
        <Section className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card key={item.id} pad={false} className="overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-[var(--surface-sunken)]">
                  {item.imageData ? (
                    <img src={item.imageData} alt={item.subject} className="h-full w-full object-cover" />
                  ) : (
                    <div className="memoryart" data-cat={item.category}>
                      <span className="memoryart__glyph" aria-hidden="true">
                        {item.category === 'places' ? '🏡' : item.category === 'objects' ? '🎁' : item.category === 'memories' ? '📖' : '👪'}
                      </span>
                      <span className="memoryart__initial" aria-hidden="true">
                        {item.subject?.trim().charAt(0).toUpperCase() || '♥'}
                      </span>
                    </div>
                  )}
                  {item.relation && (
                    <span className="absolute left-2.5 top-2.5">
                      <Tag tone="solid-teal">{item.relation}</Tag>
                    </span>
                  )}
                  {isCaregiver && (
                    <button
                      type="button"
                      onClick={() => setToDelete(item)}
                      aria-label={t('c.delete')}
                      className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-3.5">
                  <div className="text-[1rem] font-bold text-ink">{item.subject}</div>
                  {item.title && item.title !== item.subject && <div className="t-xs mt-0.5">{item.title}</div>}
                  {item.description && <p className="t-sm mt-1.5 line-clamp-2 leading-snug">{item.description}</p>}
                  <button
                    type="button"
                    onClick={() => handleTapToHear(item)}
                    className="mt-2.5 flex items-center gap-1.5 text-[0.82rem] font-bold text-brand hover:underline"
                  >
                    <Volume2 className={`h-3.5 w-3.5 ${speakingId === item.id && isSpeaking ? 'animate-pulse text-[var(--brand-saffron)]' : ''}`} />
                    {speakingId === item.id && isSpeaking ? 'Speaking...' : `${t('mem.tapToHear')} →`}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Add memory */}
      <Sheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={t('mem.add')}
        footer={
          <Button block size="lg" loading={busy} disabled={!form.subject.trim()} onClick={add}>
            {t('c.save')}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-[var(--r-md)] border-2 border-dashed transition active:scale-[0.99]"
            style={{ borderColor: 'var(--line-strong)', background: 'var(--surface-sunken)' }}
          >
            {form.imageData ? (
              <>
                <img src={form.imageData} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-3 py-1.5 text-[0.78rem] font-bold text-white">
                  {t('mem.changePhoto')}
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center gap-2 text-ink-3">
                <Camera className="h-8 w-8" />
                <span className="text-[0.85rem] font-bold">{t('mem.addPhoto')}</span>
                <span className="text-[0.74rem]">{t('mem.addPhotoHint')}</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pickImage(f);
            }}
          />

          <Field label={t('mem.category')} htmlFor="m-category">
            <Segmented
              ariaLabel={t('mem.category')}
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v as MemoryItem['category'] }))}
              options={[
                { value: 'family', label: t('mem.people') },
                { value: 'places', label: t('mem.places') },
                { value: 'objects', label: t('mem.things') },
              ]}
            />
          </Field>

          <Field label={t('mem.aboutPerson')} htmlFor="m-subject">
            <Input
              id="m-subject"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder={t('mem.subjectPlaceholder')}
              data-autofocus
            />
          </Field>

          <Field label={t('mem.relation')} htmlFor="m-relation" hint={t('mem.relationHint')}>
            <Input
              id="m-relation"
              value={form.relation}
              onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
              placeholder={t('mem.relationPlaceholder')}
            />
          </Field>

          <Field label={t('mem.story')} htmlFor="m-desc" hint={t('mem.storyHint')}>
            <Textarea
              id="m-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder={t('mem.storyPlaceholder')}
            />
          </Field>
        </div>
      </Sheet>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        title={t('mem.deleteTitle')}
        body={t('mem.deleteBody')}
        danger
      />
    </AppShell>
  );
}
