import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, Eye, RotateCcw, Sparkles, X } from 'lucide-react';
import ObjectCardVisual from '../../components/ObjectCardVisual';
import { Button, Card, ProgressRing, Tag, GameFrame, LevelPicker } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { useVoice } from '../../hooks/useVoice';
import { GameSession, REMEMBER_OBJECTS } from '../../models/GameSession';
import { RecogniseActivity, RecogniseGameEngine } from '../../models/RecogniseGame';
import { AdaptiveDifficultyService } from '../../services/adaptive_engine/AdaptiveDifficultyService';
import { GameStorage } from '../../services/storage/GameStorage';

interface Props {
  onBack: () => void;
}

const TOTAL = 5;

export default function RecogniseGame({ onBack }: Props) {
  const { state } = useApp();
  const { t } = useI18n();
  const { speak } = useVoice();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [level, setLevel] = useState(1);
  const [activity, setActivity] = useState<RecogniseActivity | null>(null);
  const [q, setQ] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<null | { picked: string; ok: boolean }>(null);
  const [elapsed, setElapsed] = useState(0);
  const [hint, setHint] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    if (phase !== 'intro') return;
    AdaptiveDifficultyService.calculateSuggestedDifficulty(patientId, 'recognise', 1)
      .then((adj) => setLevel(adj.suggestedDifficulty || 1))
      .catch(() => undefined);
  }, [phase, patientId]);

  const nextQuestion = (lvl: number, index: number) => {
    setActivity(RecogniseGameEngine.generateActivity(lvl));
    setQ(index);
    setFeedback(null);
    setHint(false);
  };

  const start = (lvl: number) => {
    setLevel(lvl);
    setCorrect(0);
    setElapsed(0);
    startedAt.current = Date.now();
    setPhase('play');
    nextQuestion(lvl, 1);
  };

  const answer = async (option: string) => {
    if (!activity || feedback) return;
    const ok = option === activity.correctAnswer;
    setFeedback({ picked: option, ok });
    if (ok) setCorrect((c) => c + 1);
    speak(ok ? t('games.wellDone') : t('games.niceTry'));

    window.setTimeout(async () => {
      if (q >= TOTAL) {
        const seconds = (Date.now() - startedAt.current) / 1000;
        setElapsed(seconds);
        const accuracy = Math.round(((ok ? correct + 1 : correct) / TOTAL) * 100);
        setPhase('result');
        const session: GameSession = {
          id: `recognise_${Date.now()}`,
          patientId,
          gameType: 'recognise',
          difficulty: level,
          score: ok ? correct + 1 : correct,
          totalObjects: TOTAL,
          accuracy,
          responseTime: seconds,
          timestamp: Date.now(),
        };
        await GameStorage.saveSession(session).catch(() => undefined);
      } else {
        nextQuestion(level, q + 1);
      }
    }, 820);
  };

  const shell = (children: React.ReactNode, title: string, subtitle?: string, progress?: number) => (
    <GameFrame
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      progress={progress}
      badge={<Tag tone="saffron">{t('games.levelN', { n: level })}</Tag>}
    >
      {children}
    </GameFrame>
  );

  if (phase === 'intro') {
    return shell(
      <div className="introgrid">
        <Card className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-saffron-soft)] text-[var(--brand-saffron-ink)]">
            <Eye className="h-8 w-8" />
          </div>
          <h1 className="t-h1 mt-4">{t('games.recognise')}</h1>
          <p className="t-body mx-auto mt-1.5 max-w-[40ch]">{t('games.recogniseDesc')}</p>
          <p className="t-sm mt-3">{t('games.takeYourTime')}</p>
        </Card>

          <div>
          <div className="t-eyebrow mb-2">{t('games.pickLevel')}</div>
          <LevelPicker current={level} caption={() => `${TOTAL} ${t('prog.sessions').toLowerCase()}`} onPick={start} />
        </div>
      </div>,
      t('games.recognise'),
      t('games.howToPlay'),
    );
  }

  if (phase === 'play' && activity) {
    const sequence = activity.objects;
    return shell(
      <>
        <Card>
          <div className="t-eyebrow text-center">{t('games.exampleSequence')}</div>
          <div className="mt-3 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
            {sequence.map((o, i) => (
              <div key={`${o.id}-${i}`} className="h-[58px] w-[58px] shrink overflow-hidden rounded-[var(--r-sm)] sm:h-[68px] sm:w-[68px]">
                <ObjectCardVisual emoji={o.emoji} name={o.name} showLabel={false} className="h-full w-full" />
              </div>
            ))}
            <span className="grid h-[52px] w-[34px] shrink-0 place-items-center rounded-[var(--r-sm)] border-2 border-dashed border-[var(--brand-saffron-line)] text-[1.3rem] font-extrabold text-[var(--brand-saffron-ink)]">
              ?
            </span>
          </div>

          <h2 className="t-h2 mt-4 text-center">{t('games.whatComesNext')}</h2>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {activity.options.map((opt) => {
            const obj = REMEMBER_OBJECTS.find((o) => o.imageUrl === opt);
            const picked = feedback?.picked === opt;
            const isCorrect = opt === activity.correctAnswer;
            const showState = !!feedback;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className="relative aspect-square overflow-hidden rounded-[var(--r-md)] border-2 transition-all active:scale-[0.985]"
                style={{
                  borderColor: showState
                    ? isCorrect
                      ? 'var(--success)'
                      : picked
                        ? 'var(--danger)'
                        : 'var(--line)'
                    : 'var(--line)',
                  boxShadow: showState && isCorrect ? '0 0 0 4px var(--success-soft)' : 'var(--shadow-1)',
                }}
              >
                <ObjectCardVisual emoji={obj?.emoji} name={obj?.name} className="h-full w-full" />
                {showState && (picked || isCorrect) && (
                  <span
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-white"
                    style={{ background: isCorrect ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hint && (
          <p className="t-sm mt-3 text-center font-semibold text-[var(--brand-teal-deep)]">
            {activity.patternHint || t('games.step1')}
          </p>
        )}
        <Button
          variant="ghost"
          block
          className="mt-auto"
          onClick={() => {
            setHint(true);
            if (activity.patternHint) speak(activity.patternHint);
          }}
        >
          {t('games.hint')}
        </Button>
      </>,
      t('games.recognise'),
      `${q} ${t('c.of')} ${TOTAL}`,
      ((q - 1) / TOTAL) * 100,
    );
  }

  const accuracy = Math.round((correct / TOTAL) * 100);
  return shell(
    <>
      <Card className="text-center">
        <ProgressRing value={accuracy} size={120} stroke={10}>
          <div>
            <div className="t-num text-[1.6rem] font-extrabold text-ink">{accuracy}%</div>
            <div className="text-[0.62rem] font-bold uppercase tracking-wider text-ink-3">{t('games.accuracy')}</div>
          </div>
        </ProgressRing>
        <h1 className="t-h1 mt-4">{accuracy >= 60 ? t('games.wellDone') : t('games.niceTry')}</h1>
        <p className="t-body mx-auto mt-1 max-w-[40ch]">{t('games.niceTryBody')}</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="stat">
            <span className="stat__label">{t('games.score')}</span>
            <span className="stat__value">{correct}/{TOTAL}</span>
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
    t('games.recognise'),
  );
}
