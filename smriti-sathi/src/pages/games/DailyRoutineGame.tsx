import { useRef, useState } from 'react';
import { Check, Clock, Coffee, Footprints, Moon, Pill, RotateCcw, Sparkles, Sun, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button, Card, ProgressRing, Tag, GameFrame, LevelPicker } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { useVoice } from '../../hooks/useVoice';
import { GameSession } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';

interface Props {
  onBack: () => void;
}

interface Step {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  time: string;
}

const ALL_STEPS: Step[] = [
  { id: 'wake', icon: Sun, labelKey: 'rem.typeWalk', time: '6:00' },
  { id: 'breakfast', icon: Coffee, labelKey: 'rem.typeMeal', time: '8:00' },
  { id: 'medicine', icon: Pill, labelKey: 'rem.typeMedicine', time: '9:00' },
  { id: 'walk', icon: Footprints, labelKey: 'games.routineDesc', time: '11:00' },
  { id: 'lunch', icon: Utensils, labelKey: 'rem.typeMeal', time: '13:00' },
  { id: 'sleep', icon: Moon, labelKey: 'home.night', time: '21:00' },
];

const COUNT_FOR_LEVEL = [0, 3, 4, 5, 6, 6];

export default function DailyRoutineGame({ onBack }: Props) {
  const { state } = useApp();
  const { t } = useI18n();
  const { speak } = useVoice();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [level, setLevel] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [deck, setDeck] = useState<Step[]>([]);
  const [slots, setSlots] = useState<(Step | null)[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);

  const start = (lvl: number) => {
    const count = COUNT_FOR_LEVEL[lvl] ?? 3;
    const active = ALL_STEPS.slice(0, count);
    setSteps(active);
    setDeck([...active].sort(() => Math.random() - 0.5));
    setSlots(new Array(count).fill(null));
    setPicked(null);
    setAttempts(0);
    setLevel(lvl);
    setPhase('play');
    startedAt.current = Date.now();
    speak(t('games.orderBody'));
  };

  const place = async (slotIdx: number) => {
    if (!picked) return;
    if (slots[slotIdx] !== null) return;
    const card = steps.find((s) => s.id === picked);
    if (!card) return;

    setAttempts((a) => a + 1);

    // Errorless learning: only the correct slot accepts the card.
    if (card.id === steps[slotIdx].id) {
      const next = [...slots];
      next[slotIdx] = card;
      setSlots(next);
      setPicked(null);
      speak(card.id);

      if (next.every((s) => s !== null)) {
        const seconds = (Date.now() - startedAt.current) / 1000;
        setElapsed(seconds);
        const accuracy = Math.min(100, Math.round((steps.length / Math.max(steps.length, attempts + 1)) * 100));
        setPhase('result');
        const session: GameSession = {
          id: `routine_${Date.now()}`,
          patientId,
          gameType: 'daily_routine',
          difficulty: level,
          score: steps.length,
          totalObjects: steps.length,
          accuracy,
          responseTime: seconds,
          timestamp: Date.now(),
        };
        await GameStorage.saveSession(session).catch(() => undefined);
      }
    } else {
      speak(t('games.routineNudge'));
    }
  };

  const shell = (children: React.ReactNode, subtitle?: string, progress?: number) => (
    <GameFrame
      title={t('games.routine')}
      subtitle={subtitle}
      onBack={onBack}
      progress={progress}
      badge={<Tag tone="success">{t('games.levelN', { n: level })}</Tag>}
    >
      {children}
    </GameFrame>
  );

  if (phase === 'intro') {
    return shell(
      <div className="introgrid">
        <Card className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
            <Sun className="h-8 w-8" />
          </div>
          <h1 className="t-h1 mt-4">{t('games.routine')}</h1>
          <p className="t-body mx-auto mt-1.5 max-w-[40ch]">{t('games.orderBody')}</p>
          <p className="t-sm mt-3">{t('games.takeYourTime')}</p>
        </Card>

          <div>
          <div className="t-eyebrow mb-2">{t('games.pickLevel')}</div>
          <LevelPicker current={level} caption={(lvl) => `${COUNT_FOR_LEVEL[lvl]} ${t('c.of')} 6`} onPick={start} />
        </div>
      </div>,
      t('games.howToPlay'),
    );
  }

  if (phase === 'play') {
    return shell(
      <>
        <h2 className="t-h3">{t('games.putInOrder')}</h2>
        <p className="t-sm mt-0.5">{t('games.orderBody')}</p>
        <p className="t-sm mt-2 rounded-[var(--r-sm)] bg-[var(--surface-warm)] px-3 py-2 font-semibold text-[var(--ink-2)]">
          {picked ? t('games.placeHere') : t('games.selectAll')}
        </p>

        {/* timeline slots */}
        <div className="mt-4 flex flex-col gap-2.5">
          {slots.map((slot, i) => {
            const filled = slot !== null;
            // Scaffolding only: at the easier levels the slot shows which
            // routine step belongs there; from level 3 the times are the cue.
            const Icon = filled ? slot.icon : level <= 2 ? steps[i]?.icon : Clock;
            return (
              <button
                key={i}
                type="button"
                onClick={() => place(i)}
                className="flex items-center gap-3 rounded-[var(--r-md)] border-2 p-2.5 text-left transition-all"
                style={{
                  borderColor: filled ? 'var(--success-line)' : picked ? 'var(--brand-teal)' : 'var(--line)',
                  background: filled ? 'var(--success-soft)' : picked ? 'var(--brand-teal-soft)' : 'var(--surface)',
                  borderStyle: filled ? 'solid' : 'dashed',
                }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-[0.78rem] font-extrabold text-ink-2">
                  {i + 1}
                </span>
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)]"
                  style={{
                    background: filled ? 'var(--success)' : picked ? 'var(--brand-teal)' : 'var(--surface-sunken)',
                    color: filled ? '#fff' : picked ? '#fff' : 'var(--ink-4)',
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.95rem] font-bold text-ink">
                    {filled ? t(slot.labelKey) : picked ? t('games.placeHere') : t('games.emptySlot')}
                  </span>
                  <span className="t-xs block">{filled ? slot.time : '·'}</span>
                </span>
                {filled && <Check className="h-5 w-5 shrink-0 text-[var(--success)]" />}
              </button>
            );
          })}
        </div>

        {/* deck */}
        <div className="mt-4">
          <div className="t-eyebrow mb-2">{picked ? t('games.placeHere') : t('games.selectAll')}</div>
          <div className="flex flex-wrap gap-2">
            {deck.map((card) => {
              const used = slots.some((s) => s?.id === card.id);
              const isPicked = picked === card.id;
              const Icon = card.icon;
              if (used) return null;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setPicked(isPicked ? null : card.id)}
                  className="flex min-h-[52px] items-center gap-2 rounded-full border-2 px-3.5 py-2 transition-all"
                  style={{
                    borderColor: isPicked ? 'var(--brand-teal)' : 'var(--line)',
                    background: isPicked ? 'var(--brand-teal)' : 'var(--surface)',
                    color: isPicked ? '#fff' : 'var(--ink)',
                    transform: isPicked ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-[0.88rem] font-bold">{t(card.labelKey)}</span>
                  <span className={isPicked ? 'text-white/70' : 'text-ink-4'}>{card.time}</span>
                </button>
              );
            })}
          </div>
        </div>
      </>,
      `${slots.filter(Boolean).length} ${t('c.of')} ${slots.length}`,
      (slots.filter(Boolean).length / Math.max(1, slots.length)) * 100,
    );
  }

  return shell(
    <>
      <Card className="text-center">
        <ProgressRing value={100} size={110} stroke={9}>
          <Sparkles className="h-8 w-8 text-[var(--brand-teal)]" />
        </ProgressRing>
        <h1 className="t-h1 mt-4">{t('games.correctOrder')}</h1>
        <p className="t-body mt-1">{t('prog.encourage')}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="stat">
            <span className="stat__label">{t('games.attempts')}</span>
            <span className="stat__value">{attempts}</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t('games.timeTaken')}</span>
            <span className="stat__value">{Math.round(elapsed)}s</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {level < 5 && (
            <Button block size="lg" onClick={() => start(level + 1)} icon={<Sparkles className="h-[18px] w-[18px]" />}>
              {t('games.nextLevel')}
            </Button>
          )}
          <Button variant="secondary" block onClick={() => start(level)} icon={<RotateCcw className="h-[18px] w-[18px]" />}>
            {t('games.playAgain')}
          </Button>
          <Button variant="ghost" block onClick={onBack}>
            {t('games.backToGames')}
          </Button>
        </div>
      </Card>
    </>,
    t('games.sessionComplete'),
  );
}
