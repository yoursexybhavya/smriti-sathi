import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, Sparkles, Heart, Award, RefreshCw, CheckCircle2, Star, User } from 'lucide-react';
import Card from '../../components/Card';
import LargeButton from '../../components/LargeButton';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../hooks/useVoice';
import { memoryBookService, FamilyQuizQuestion, FamilyQuizOption } from '../../services/MemoryBookService';
import { gameSessionRepository } from '../../database/repositories/GameSessionRepository';

interface Props {
  onBack: () => void;
}

export default function FamilyMemoryGame({ onBack }: Props) {
  const { state } = useApp();
  const { language } = useLanguage();
  const userId = Number(state.currentPatient?.id) || 1;
  const patientName = state.currentPatient?.name || 'Grandma';

  const { speak, stopSpeaking, isSpeaking, playSuccessChime, playCardFlip } = useVoice();

  const [questions, setQuestions] = useState<FamilyQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions on mount
  useEffect(() => {
    let mounted = true;
    async function loadQuiz() {
      setLoading(true);
      try {
        const generated = await memoryBookService.getFamilyQuizQuestions(userId);
        if (mounted) {
          // Limit to 4-5 serene questions per session so elder is not overwhelmed
          setQuestions(generated.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load family quiz questions:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadQuiz();
    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      stopSpeaking();
    };
  }, [userId]);

  // Read question prompt aloud whenever a new question appears
  const currentQ = questions[currentIndex];
  useEffect(() => {
    if (!currentQ || isFinished) return;
    setSelectedOptionId(null);
    setAnswered(false);
    setIsCorrect(false);

    // Give a short serene pause before speaking the question
    const speechTimer = setTimeout(() => {
      const promptToRead = language === 'as' ? currentQ.promptTextRegional : currentQ.audioPrompt;
      speak(promptToRead, language === 'as' ? 'as' : 'en');
    }, 450);

    return () => clearTimeout(speechTimer);
  }, [currentIndex, currentQ, isFinished, language, speak]);

  const handleSpeakQuestion = () => {
    if (!currentQ) return;
    const promptToRead = language === 'as' ? currentQ.promptTextRegional : currentQ.audioPrompt;
    speak(promptToRead, language === 'as' ? 'as' : 'en');
  };

  const handleSelectOption = (option: FamilyQuizOption) => {
    if (answered) return;

    playCardFlip();
    setSelectedOptionId(option.id);
    setAnswered(true);

    const correct = option.isCorrect;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      playSuccessChime();
      const feedbackText = language === 'as'
        ? `উত্তম! এইয়া হৈছে ${currentQ.targetAnswer}!`
        : `Wonderful! That is ${currentQ.targetAnswer}!`;
      speak(feedbackText, language === 'as' ? 'as' : 'en');
    } else {
      // Non-punitive errorless learning: explain the correct relative gently
      const gentleText = language === 'as'
        ? `এইয়া হৈছে ${currentQ.targetAnswer}।`
        : `This is ${currentQ.targetAnswer}.`;
      speak(gentleText, language === 'as' ? 'as' : 'en');
    }

    // Advance to next question after pleasant interval
    timerRef.current = setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleFinishGame(correct ? score + 1 : score);
      }
    }, 2400);
  };

  const handleFinishGame = async (finalScore: number) => {
    setIsFinished(true);
    playSuccessChime();

    const celebrationAudio = language === 'as'
      ? `অভিনন্দন! আপুনি আজি আপোনাৰ মৰমৰ পৰিয়ালক মনত পেলালে!`
      : `Congratulations ${patientName}! You remembered your lovely family today!`;
    speak(celebrationAudio, language === 'as' ? 'as' : 'en');

    // Persist session to IndexedDB
    try {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      const totalQ = questions.length || 1;
      const accuracy = Math.round((finalScore / totalQ) * 100);

      await gameSessionRepository.create({
        userId,
        gameType: 'family_quiz',
        difficulty: 1,
        score: finalScore * 10,
        totalObjects: totalQ,
        accuracy,
        responseTime: elapsedSeconds,
      });
    } catch (e) {
      console.warn('Failed to record family quiz session:', e);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOptionId(null);
    setAnswered(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[var(--color-text)]">Opening Family Memory Book...</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">পৰিয়ালৰ স্মৃতিবোৰ প্ৰস্তুত কৰি থকা হৈছে...</p>
      </div>
    );
  }

  // Completion screen
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between p-4 sm:p-8">
        <header className="flex items-center justify-between max-w-2xl mx-auto w-full pt-4">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[52px] min-w-[52px] flex items-center justify-center p-3 bg-[var(--color-card)] rounded-2xl border-2 border-[var(--color-border)] shadow-sm"
            aria-label="Back to Games"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
          </button>
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
            Family Memories • সম্পূৰ্ণ হ'ল
          </span>
        </header>

        <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
              <Award className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="absolute -top-1 -right-1 text-2xl">✨</div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)]">
              {score === questions.length ? 'Wonderful Memory!' : 'Good Effort!'}
            </h1>
            <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
              অভিনন্দন! আপুনি পৰিয়ালক চিনাক্ত কৰিলে
            </p>
            <p className="text-base text-[var(--color-text-muted)] max-w-md mx-auto pt-2">
              You recognized your loving family members and remembered their special moments.
            </p>
          </div>

          <Card elevated className="p-6 max-w-md mx-auto bg-[var(--color-card)] border-2 border-[var(--color-border)]">
            <div className="flex items-center justify-around">
              <div>
                <p className="text-3xl font-extrabold text-[var(--color-primary)]">{score} / {questions.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Relatives</p>
              </div>
              <div className="h-10 w-px bg-[var(--color-border)]" />
              <div>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {Math.round((score / (questions.length || 1)) * 100)}%
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Accuracy</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 min-h-[58px] flex items-center justify-center gap-2 px-6 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] font-bold rounded-2xl border-2 border-[var(--color-border)] shadow-sm active:translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              <span>Play Again / আকৌ খেলক</span>
            </button>
            <LargeButton
              variant="primary"
              size="lg"
              onPress={onBack}
              className="flex-1 min-h-[58px]"
            >
              Return Home
            </LargeButton>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-[var(--color-text-muted)]">
          Smriti Sathi Dementia Care • Clinical Memory Anchor
        </footer>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[52px] min-w-[52px] flex items-center justify-center p-3 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] rounded-2xl border-2 border-[var(--color-border)] shadow-sm active:translate-y-0.5"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                Family Memory Quiz
              </h2>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">পৰিয়াল চিনাক্তকৰণ খেল</p>
          </div>
        </div>

        {/* Progress Tracker Pills */}
        <div className="flex items-center gap-1.5 bg-[var(--color-card)] border-2 border-[var(--color-border)] px-3 py-2 rounded-2xl shadow-sm">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-rose-500 scale-125 ring-2 ring-rose-300'
                  : idx < currentIndex
                  ? 'bg-emerald-500'
                  : 'bg-[var(--color-border)]'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-[var(--color-text-muted)] ml-2">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </header>

      {/* Main Interactive Screen */}
      <main className="max-w-3xl mx-auto w-full my-auto space-y-6">
        {/* Relative Portrait Card & Spoken Question */}
        <Card elevated className="p-6 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-3xl shadow-md text-center">
          {/* Family Portrait or Illustrated Avatar */}
          <div className="relative inline-flex mb-4">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-rose-300 dark:border-rose-900 shadow-xl bg-gradient-to-br from-rose-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              {currentQ.relative.imageData ? (
                <img
                  src={currentQ.relative.imageData}
                  alt={currentQ.relative.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-2">
                    <User className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-xs font-extrabold text-[var(--color-text)]">
                    {currentQ.relative.title}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Bilingual Question & Tap-to-Speak Prompt */}
          <div className="space-y-2 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
                {currentQ.promptText}
              </h3>
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className={`min-h-[50px] min-w-[50px] p-2.5 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:scale-105 active:scale-95'
                }`}
                aria-label="Listen to Question"
                title="Tap to listen"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
              {currentQ.promptTextRegional}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] italic">
              Tap the speaker button to hear the question aloud. Tap any option below to answer.
            </p>
          </div>
        </Card>

        {/* 3 Large Tactile Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.isCorrect;

            let cardStyle = 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-indigo-400';
            if (answered) {
              if (isCorrectOption) {
                cardStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-4 ring-emerald-400/30 text-emerald-900 dark:text-emerald-100';
              } else if (isSelected && !isCorrectOption) {
                cardStyle = 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200';
              } else {
                cardStyle = 'opacity-50 border-[var(--color-border)]';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={answered}
                className={`min-h-[92px] sm:min-h-[110px] p-5 rounded-3xl border-3 shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 ${cardStyle}`}
              >
                <span className="text-3xl mb-1.5">{option.icon || '🌸'}</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)]">
                  {option.label}
                </span>
                {option.sublabel && (
                  <span className="text-sm font-semibold text-[var(--color-text-muted)] mt-0.5">
                    {option.sublabel}
                  </span>
                )}
                {answered && isCorrectOption && (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct / সঠিক</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Reassuring Feedback Banner */}
        {answered && (
          <div className={`p-4 rounded-2xl border-2 text-center transition-all animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
              : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 text-indigo-900 dark:text-indigo-200'
          }`}>
            <p className="text-base sm:text-lg font-bold">
              {isCorrect ? '🌟 ' + currentQ.explanationText : '💡 ' + currentQ.explanationText}
            </p>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="max-w-4xl mx-auto w-full pt-4 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>Elder Care Cognitive Anchor</span>
        <span>স্মৃতি সাথী • পৰিয়ালৰ আত্মবিশ্বাস</span>
      </footer>
    </div>
  );
}
