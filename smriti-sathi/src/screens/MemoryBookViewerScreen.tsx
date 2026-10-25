import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookHeart, Phone, Volume2, X } from 'lucide-react';
import { AppShell } from '../shell/AppShell';
import { Button, Card, EmptyState, IconButton, Tag } from '../ui';
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

/**
 * The elder-facing album player: one memory at a time, enormous type,
 * "hear this" reads the story aloud, swipe/arrow to move on.
 */
export default function MemoryBookViewerScreen({ onNavigate, onBack, persona = 'elder' }: Props) {
  const { state, toggleTheme } = useApp();
  const { t } = useI18n();
  const { speak, isSpeaking } = useVoice();
  const patient = state.currentPatient;
  const userId = patient?.id ? parseInt(patient.id, 10) : undefined;

  const [items, setItems] = useState<MemoryItem[]>([]);
  const [index, setIndex] = useState(0);

  const load = useCallback(async (uid: number) => {
    try {
      setItems(await memoryBookService.getAllMemoryItems(uid));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  const current = items[index];

  const read = async () => {
    if (!current) return;
    await speak(`${current.subject}. ${current.relation ? current.relation + '. ' : ''}${current.description}`);
  };

  const next = () => setIndex((i) => Math.min(items.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <AppShell
      persona={persona}
      activeTab={persona === 'elder' ? 'memory-book' : 'caregiver-memory'}
      onNavigate={onNavigate}
      onBack={onBack}
      onToggleTheme={toggleTheme}
      theme={state.accessibility?.theme}
      title={t('mem.viewer')}
      subtitle={t('mem.subtitle')}
      hideDock
    >
      {!current ? (
        <Card>
          <EmptyState
            icon={<BookHeart />}
            title={t('mem.emptyTitle')}
            body={t('mem.emptyBody')}
            action={<Button onClick={() => onNavigate('memory-book')}>{t('mem.add')}</Button>}
          />
        </Card>
      ) : (
        <div className="mx-auto w-full max-w-[720px]">
          <Card pad={false} className="overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-[var(--surface-sunken)] sm:aspect-[16/10]">
              {current.imageData ? (
                <img src={current.imageData} alt={current.subject} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
                  <BookHeart className="h-16 w-16 opacity-50" />
                </div>
              )}
              <div className="absolute left-3 top-3 flex gap-2">
                <Tag tone="solid-teal">
                  {index + 1} / {items.length}
                </Tag>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('memory-book')}
                aria-label={t('c.close')}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {current.relation && <div className="t-eyebrow">{current.relation}</div>}
              <h1 className="t-h1 mt-1 text-ink">{current.subject}</h1>
              {current.description && (
                <p className="mt-2 text-[1.12rem] leading-relaxed text-ink-2">{current.description}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="lg" onClick={read} loading={isSpeaking} icon={<Volume2 className="h-[18px] w-[18px]" />}>
                  {t('mem.tapToHear')}
                </Button>
                {current.phoneNumber && (
                  <a href={`tel:${current.phoneNumber}`} className="btn btn--secondary btn--lg">
                    <Phone className="h-[18px] w-[18px]" />
                    {current.phoneNumber}
                  </a>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={prev} disabled={index === 0} icon={<ArrowLeft className="h-[18px] w-[18px]" />}>
              {t('c.back')}
            </Button>
            <div className="flex gap-1.5">
              {items.slice(0, 12).map((it, i) => (
                <button
                  key={it.id ?? i}
                  type="button"
                  aria-label={`${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: i === index ? 22 : 10,
                    background: i === index ? 'var(--brand-teal)' : 'var(--line-strong)',
                  }}
                />
              ))}
            </div>
            <Button onClick={next} disabled={index >= items.length - 1} iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}>
              {t('c.next')}
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
