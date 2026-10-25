import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, Layers, RotateCcw, Sparkles } from 'lucide-react';
import ObjectCardVisual from '../../components/ObjectCardVisual';
import { Button, Card, ProgressRing, Tag, GameFrame, LevelPicker } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { useVoice } from '../../hooks/useVoice';
import { GameSession, REMEMBER_OBJECTS, RememberObject } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';

interface Props {
  onBack: () => void;
}

interface CardItem {
  id: string;
  objectId: string;
  object: RememberObject;
  flipped: boolean;
  matched: boolean;
}

const PAIRS_FOR_LEVEL = [0, 2, 3, 4, 6, 8];

export default function MemoryMatchGame({ onBack }: Props) {
  const { state } = useApp();
  const { t } = useI18n();
  const { speak } = useVoice();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);
  const saved = useRef(false);

  const start = (lvl: number) => {
    const pairs = PAIRS_FOR_LEVEL[lvl] ?? 2;
    const objects = [...REMEMBER_OBJECTS].sort(() => Math.random() - 0.5).slice(0, pairs);
    const deck: CardItem[] = [];
    objects.forEach((o) => {
      deck.push({ id: `${o.id}-a-${Math.random()}`, objectId: o.id, object: o, flipped: false, matched: false });
      deck.push({ id: `${o.id}-b-${Math.random()}`, objectId: o.id, object: o, flipped: false, matched: false });
    });
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setLevel(lvl);
    setPhase('play');
    startedAt.current = Date.now();
    saved.current = false;
  };

  const flip = (id: string) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = next.map((cid) => cards.find((c) => c.id === cid));
      const isPair = a && b && a.objectId === b.objectId;
      window.setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a?.id || c.id === b?.id ? { ...c, matched: !!isPair, flipped: !!isPair } : c,
          ),
        );
        if (isPair) speak(t('games.wellDone'));
        setFlipped([]);
        setLocked(false);
      }, isPair ? 420 : 900);
    }
  };

  const totalPairs = cards.length / 2;
  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const done = cards.length > 0 && cards.every((c) => c.matched);

  useEffect(() => {
    if (!done || saved.current) return;
    saved.current = true;
    const seconds = (Date.now() - startedAt.current) / 1000;
    setElapsed(seconds);
    const accuracy = Math.min(100, Math.round((totalPairs / Math.max(1, moves)) * 100));
    setPhase('result');
    const session: GameSession = {
      id: `match_${Date.now()}`,
      patientId,
      gameType: 'memory_match',
      difficulty: level,
      score: totalPairs,
      totalObjects: cards.length,
      accuracy,
      responseTime: seconds,
      timestamp: Date.now(),
    };
    GameStorage.saveSession(session).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const shell = (children: React.ReactNode, title: string, subtitle?: string, progress?: number) => (
    <GameFrame
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      progress={progress}
      badge={<Tag tone="info">{t('games.levelN', { n: level })}</Tag>}
    >
      {children}
    </GameFrame>
  );

  if (phase === 'intro') {
    return shell(
      <div className="introgrid">
        <Card className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--info-soft)] text-[var(--info)]">
            <Layers className="h-8 w-8" />
          </div>
          <h1 className="t-h1 mt-4">{t('games.match')}</h1>
          <p className="t-body mx-auto mt-1.5 max-w-[40ch]">{t('games.matchDesc')}</p>
          <p className="t-sm mt-3">{t('games.takeYourTime')}</p>
        </Card>

          <div>
          <div className="t-eyebrow mb-2">{t('games.pickLevel')}</div>
          <LevelPicker current={level} caption={(lvl) => `${PAIRS_FOR_LEVEL[lvl]} ${t('games.pairsFound')}`} onPick={start} />
        </div>
      </div>,
      t('games.match'),
      t('games.howToPlay'),
    );
  }

  if (phase === 'play') {
    return shell(
      <>
        <div className="flex items-center justify-between gap-2">
          <span className="t-sm font-bold text-ink-2">
            {matchedPairs} / {totalPairs} {t('games.pairsFound')}
          </span>
          <span className="t-sm">
            {t('games.attempts')}: <b className="t-num">{moves}</b>
          </span>
        </div>

        <div
          className="mx-auto grid w-full flex-1 content-center gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${cards.length <= 4 ? 2 : cards.length <= 9 ? 3 : 4}, minmax(0, 1fr))`,
            maxWidth: `${(cards.length <= 4 ? 2 : cards.length <= 9 ? 3 : 4) * 132}px`,
          }}
        >
          {cards.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => flip(c.id)}
              aria-label={c.flipped || c.matched ? c.object.name : 'Hidden card'}
              className="relative grid aspect-square place-items-center rounded-[var(--r-md)] border-2 transition-all"
              style={{
                borderColor: c.matched ? 'var(--success)' : c.flipped ? 'var(--brand-teal)' : 'var(--line)',
                background: c.matched
                  ? 'var(--success-soft)'
                  : c.flipped
                    ? 'var(--surface)'
                    : 'linear-gradient(150deg, var(--brand-teal-soft), var(--surface-sunken))',
                boxShadow: c.flipped || c.matched ? 'var(--shadow-1)' : 'none',
                transform: c.flipped || c.matched ? 'rotateY(0deg)' : 'none',
              }}
            >
              {c.flipped || c.matched ? (
                <ObjectCardVisual
                  imageUrl={c.object.imageUrl}
                  name={c.object.name}
                  emoji={c.object.emoji}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="cardback-glyph" aria-hidden="true">
                  ❁
                </span>
              )}
              {c.matched && (
                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[var(--success)] text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      </>,
      t('games.match'),
      `${matchedPairs} ${t('c.of')} ${totalPairs}`,
      (matchedPairs / Math.max(1, totalPairs)) * 100,
    );
  }

  const accuracy = Math.min(100, Math.round((totalPairs / Math.max(1, moves)) * 100));
  return shell(
    <>
      <Card className="text-center">
        <ProgressRing value={accuracy} size={120} stroke={10}>
          <div>
            <div className="t-num text-[1.6rem] font-extrabold text-ink">{totalPairs}</div>
            <div className="text-[0.62rem] font-bold uppercase tracking-wider text-ink-3">{t('games.pairsFound')}</div>
          </div>
        </ProgressRing>
        <h1 className="t-h1 mt-4">{t('games.wellDone')}</h1>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="stat">
            <span className="stat__label">{t('games.attempts')}</span>
            <span className="stat__value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t('games.accuracy')}</span>
            <span className="stat__value">{accuracy}%</span>
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
    t('games.match'),
  );
}
