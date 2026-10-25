import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, Eye, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import ObjectCardVisual from '../../components/ObjectCardVisual';
import { Button, Card, ProgressRing, Tag, GameFrame, LevelPicker } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { useVoice } from '../../hooks/useVoice';
import { GameSession, RememberObject } from '../../models/GameSession';
import { DifficultyEngine } from '../../services/adaptive_engine/DifficultyEngine';
import { GameStorage } from '../../services/storage/GameStorage';

interface Props {
  onBack: () => void;
}

type Phase = 'intro' | 'memorise' | 'recall' | 'result';

export default function RememberGame({ onBack }: Props) {
  const { state } = useApp();
  const { t } = useI18n();
  const { speak } = useVoice();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<Phase>('intro');
  const [level, setLevel] = useState(1);
  const [targets, setTargets] = useState<RememberObject[]>([]);
  const [recallSet, setRecallSet] = useState<RememberObject[]>([]);
  const [selected, setSelected] = useState<RememberObject[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState({ score: 0, accuracy: 0, seconds: 0 });
  const startTime = useRef(0);

  const config = useMemo(() => DifficultyEngine.getConfig(level), [level]);

  const begin = (lvl: number) => {
    const cfg = DifficultyEngine.getConfig(lvl);
    const objects = DifficultyEngine.selectObjects(cfg.objectCount);
    setTargets(objects);
    setRecallSet(DifficultyEngine.createRecallSet(objects, cfg.distractorCount));
    setSelected([]);
    setLevel(lvl);
    setSecondsLeft(cfg.memorizeTime);
    setPhase('memorise');
    speak(t('games.memoriseBody'));
  };

  /* countdown */
  useEffect(() => {
    if (phase !== 'memorise') return;
    if (secondsLeft <= 0) {
      startTime.current = Date.now();
      setPhase('recall');
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, secondsLeft]);

  const toggle = (obj: RememberObject) => {
    setSelected((prev) => (prev.some((o) => o.id === obj.id) ? prev.filter((o) => o.id !== obj.id) : [...prev, obj]));
  };

  const submit = async () => {
    const seconds = (Date.now() - startTime.current) / 1000;
    const { score, accuracy } = DifficultyEngine.calculateScore(selected, targets);
    setResult({ score, accuracy, seconds });
    setPhase('result');

    const session: GameSession = {
      id: `session_${Date.now()}`,
      patientId,
      gameType: 'remember',
      difficulty: level,
      score,
      totalObjects: targets.length,
      accuracy,
      responseTime: seconds,
      timestamp: Date.now(),
    };
    await GameStorage.saveSession(session).catch(() => undefined);
  };

  const shell = (children: React.ReactNode, title: string, subtitle?: string, progress?: number) => (
    <GameFrame
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      progress={progress}
      badge={<Tag tone="teal">{t('games.levelN', { n: level })}</Tag>}
    >
      {children}
    </GameFrame>
  );

  /* ── Intro ─────────────────────────────────────────────────────────── */
  if (phase === 'intro') {
    return shell(
      <div className="introgrid">
        <Card className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
            <Eye className="h-8 w-8" />
          </div>
          <h1 className="t-h1 mt-4">{t('games.remember')}</h1>
          <p className="t-body mx-auto mt-1.5 max-w-[40ch]">{t('games.rememberDesc')}</p>

          <ol className="mt-5 flex flex-col gap-2 text-left">
            {[t('games.step1'), t('games.step2'), t('games.step3')].map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-[var(--r-md)] bg-[var(--surface-warm)] p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-teal)] text-[0.72rem] font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="text-[0.92rem] leading-snug text-ink-2">{s}</span>
              </li>
            ))}
          </ol>
        </Card>

          <div>
          <div className="t-eyebrow mb-2">{t('games.pickLevel')}</div>
          <LevelPicker
          current={1}
          caption={(lvl) => `${DifficultyEngine.getConfig(lvl).objectCount} · ${DifficultyEngine.getConfig(lvl).memorizeTime}s`}
          onPick={begin}
        />
        </div>
      </div>,
      t('games.remember'),
      t('games.howToPlay'),
    );
  }

  /* ── Memorise ──────────────────────────────────────────────────────── */
  if (phase === 'memorise') {
    return shell(
      <>
        <div className="flex items-center justify-between gap-3">
          <p className="t-sm max-w-[26ch]">{t('games.memoriseHint')}</p>
          <ProgressRing value={(secondsLeft / Math.max(1, config.memorizeTime)) * 100} size={72} stroke={6}>
            <span className="t-num text-[0.82rem] font-extrabold text-ink">{secondsLeft}s</span>
          </ProgressRing>
        </div>

        <div
          className="memorise-grid"
          style={{ '--mg-cols': targets.length <= 2 ? targets.length : targets.length >= 5 ? 3 : 2 } as React.CSSProperties}
        >
          {targets.map((obj) => (
            <Card key={obj.id} pad={false} className="pop-in overflow-hidden !border-transparent !bg-transparent !shadow-none">
              <ObjectCardVisual emoji={obj.emoji} name={obj.name} className="h-full w-full" />
            </Card>
          ))}
        </div>

        <Button variant="secondary" block className="mt-auto" onClick={() => { startTime.current = Date.now(); setPhase('recall'); }} iconAfter={<Check className="h-[18px] w-[18px]" />}>
          {t('c.done')}
        </Button>
      </>,
      t('games.memorise'),
      t('games.memoriseBody'),
      (1 - secondsLeft / Math.max(1, config.memorizeTime)) * 100,
    );
  }

  /* ── Recall ────────────────────────────────────────────────────────── */
  if (phase === 'recall') {
    return shell(
      <>
        <div>
          <div className="t-h3">{t('games.recall')}</div>
          <p className="t-sm mt-0.5">{t('games.recallBody')}</p>
        </div>

        <div className="object-grid" data-n={3}>
          {recallSet.map((obj) => {
            const isOn = selected.some((o) => o.id === obj.id);
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => toggle(obj)}
                aria-pressed={isOn}
                className="relative aspect-square overflow-hidden rounded-[var(--r-md)] border-2 transition-all"
                style={{
                  borderColor: isOn ? 'var(--brand-teal)' : 'var(--line)',
                  boxShadow: isOn ? '0 0 0 4px var(--brand-teal-soft)' : 'var(--shadow-1)',
                  transform: isOn ? 'translateY(-2px)' : 'none',
                }}
              >
                <ObjectCardVisual emoji={obj.emoji} name={obj.name} className="h-full w-full" />
                {isOn && (
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-teal)] text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Button block size="xl" className="mt-auto" onClick={submit} disabled={selected.length === 0}>
          {t('games.checkCount', { n: selected.length })}
        </Button>
      </>,
      t('games.remember'),
      t('games.pickedOf', { n: selected.length, total: targets.length }),
      (selected.length / Math.max(1, targets.length)) * 100,
    );
  }

  /* ── Result ────────────────────────────────────────────────────────── */
  return shell(
    <>
      <Card className="text-center">
        <ProgressRing value={result.accuracy} size={120} stroke={10}>
          <div>
            <div className="t-num text-[1.6rem] font-extrabold text-ink">{Math.round(result.accuracy)}%</div>
            <div className="text-[0.62rem] font-bold uppercase tracking-wider text-ink-3">{t('games.accuracy')}</div>
          </div>
        </ProgressRing>

        <h1 className="t-h1 mt-4">{result.accuracy >= 60 ? t('games.wellDone') : t('games.niceTry')}</h1>
        <p className="t-body mx-auto mt-1 max-w-[40ch]">{t('games.niceTryBody')}</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="stat">
            <span className="stat__label">{t('games.score')}</span>
            <span className="stat__value">{result.score}</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t('games.accuracy')}</span>
            <span className="stat__value">{Math.round(result.accuracy)}%</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t('games.timeTaken')}</span>
            <span className="stat__value">{Math.round(result.seconds)}s</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {level < 5 && (
            <Button block size="lg" onClick={() => begin(level + 1)} icon={<Sparkles className="h-[18px] w-[18px]" />}>
              {t('games.nextLevel')}
            </Button>
          )}
          <Button variant="secondary" block onClick={() => begin(level)} icon={<RotateCcw className="h-[18px] w-[18px]" />}>
            {t('games.playAgain')}
          </Button>
          <Button variant="ghost" block onClick={onBack}>
            {t('games.backToGames')}
          </Button>
        </div>
      </Card>

      <Button
        variant="ghost"
        block
        className="mt-3"
        onClick={() => speak(`${t('games.yourScore')} ${result.score}. ${result.accuracy >= 60 ? t('games.wellDone') : t('games.niceTry')}`, undefined)}
        icon={<Volume2 className="h-[18px] w-[18px]" />}
      >
        {t('home.hearThis')}
      </Button>
    </>,
    t('games.sessionComplete'),
    t('games.remember'),
  );
}
