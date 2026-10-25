import { useEffect, useState } from 'react';
import { Check, ChevronLeft, Heart, RotateCcw, Users } from 'lucide-react';
import { Button, Card, ProgressBar, Tag } from '../../ui';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { useVoice } from '../../hooks/useVoice';
import { memoryBookService, type FamilyQuizQuestion } from '../../services/MemoryBookService';
import { GameSession } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';

interface Props {
  onBack: () => void;
}

export default function FamilyMemoryGame({ onBack }: Props) {
  const { state } = useApp();
  const { t } = useI18n();
  const { speak } = useVoice();
  const patientId = state.currentPatient?.id || 'default';
  const userId = patientId ? parseInt(patientId, 10) : undefined;

  const [questions, setQuestions] = useState<FamilyQuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!userId) return;
    memoryBookService
      .getFamilyQuizQuestions(userId)
      .then((qs) => setQuestions(qs.slice(0, 6)))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const current = questions[index];

  const choose = async (optionId: string, isCorrect: boolean) => {
    if (picked) return;
    setPicked(optionId);
    if (isCorrect) setScore((s) => s + 1);
    speak(isCorrect ? t('games.wellDone') : t('games.niceTry'));

    window.setTimeout(async () => {
      if (index + 1 >= questions.length) {
        setFinished(true);
        const accuracy = Math.round(((isCorrect ? score + 1 : score) / Math.max(1, questions.length)) * 100);
        const session: GameSession = {
          id: `family_${Date.now()}`,
          patientId,
          gameType: 'family_quiz',
          difficulty: 1,
          score: isCorrect ? score + 1 : score,
          totalObjects: questions.length,
          accuracy,
          responseTime: 0,
          timestamp: Date.now(),
        };
        await GameStorage.saveSession(session).catch(() => undefined);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 900);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[720px] flex-col px-4 pb-8 pt-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label={t('c.back')} className="iconbtn">
          <ChevronLeft />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[1rem] font-bold text-ink">{t('games.familyQuiz')}</div>
          <div className="truncate text-[0.76rem] text-ink-3">{t('games.familyQuizDesc')}</div>
        </div>
        <Tag tone="saffron">
          <Heart className="h-3 w-3" /> {score}
        </Tag>
      </div>

      <div className="mt-4">
        {loading ? (
          <Card>
            <div className="skeleton h-5 w-32" />
            <div className="skeleton mt-3 h-24 w-full" />
          </Card>
        ) : questions.length === 0 ? (
          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-ink-4" />
            <p className="t-body mt-3">{t('mem.emptyBody')}</p>
            <Button className="mt-3" onClick={onBack}>
              {t('games.backToGames')}
            </Button>
          </Card>
        ) : finished ? (
          <Card className="text-center">
            <Check className="mx-auto h-12 w-12 text-[var(--success)]" />
            <h1 className="t-h1 mt-3">{t('games.sessionComplete')}</h1>
            <p className="t-body mt-1">
              {score} / {questions.length}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button block size="lg" onClick={restart} icon={<RotateCcw className="h-[18px] w-[18px]" />}>
                {t('games.playAgain')}
              </Button>
              <Button variant="ghost" block onClick={onBack}>
                {t('games.backToGames')}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <ProgressBar value={index} max={questions.length} label={`${index + 1} ${t('c.of')} ${questions.length}`} showValue />

            <Card className="mt-4 text-center">
              {current.relative.imageData ? (
                <img
                  src={current.relative.imageData}
                  alt={current.relative.title}
                  className="mx-auto h-[176px] w-[176px] rounded-full object-cover shadow-[var(--shadow-2)] ring-4 ring-[var(--surface-sunken)]"
                />
              ) : (
                <div className="portrait-fallback mx-auto">
                  <span aria-hidden="true">👵</span>
                </div>
              )}
              <h2 className="t-h2 mt-4">{current.promptText}</h2>
            </Card>

            <div className="mt-3 flex flex-col gap-2.5">
              {current.options.map((o) => {
                const isPicked = picked === o.id;
                const showState = !!picked;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o.id, o.isCorrect)}
                    disabled={showState}
                    className="quizopt flex min-h-[68px] items-center gap-3 rounded-[var(--r-md)] border-2 px-3.5 py-3 text-left transition-all"
                    style={{
                      borderColor: showState
                        ? o.isCorrect
                          ? 'var(--success)'
                          : isPicked
                            ? 'var(--danger)'
                            : 'var(--line)'
                        : 'var(--line)',
                      background: showState && o.isCorrect ? 'var(--success-soft)' : 'var(--surface)',
                    }}
                  >
                    <span className="quizopt__icon" aria-hidden="true">
                      {o.icon ?? '•'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1rem] font-bold text-ink">{o.label}</span>
                      {o.sublabel && <span className="t-xs block">{o.sublabel}</span>}
                    </span>
                    {showState && o.isCorrect && <Check className="h-5 w-5 shrink-0 text-[var(--success)]" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
