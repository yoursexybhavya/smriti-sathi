import { CheckCircle, Clock, Target, TrendingUp, ArrowRight, RotateCcw } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import ProgressCard from '../../components/ProgressCard';
import { RememberObject } from '../../models/GameSession';
import { DifficultyEngine } from '../../services/adaptive_engine/DifficultyEngine';

interface RememberResultProps {
  targetObjects: RememberObject[];
  selectedObjects: RememberObject[];
  responseTime: number;
  difficulty: number;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
  onSelectLevel?: (level: number) => void;
  onBackToGames: () => void;
}

export default function RememberResult({
  targetObjects,
  selectedObjects,
  responseTime,
  difficulty,
  onPlayAgain,
  onNextLevel,
  onSelectLevel,
  onBackToGames,
}: RememberResultProps) {
  const { score, accuracy } = DifficultyEngine.calculateScore(selectedObjects, targetObjects);
  const message = DifficultyEngine.getSupportiveMessage(accuracy, score, targetObjects.length);
  const canAdvance = accuracy >= 80 && difficulty < 5;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Header */}
      <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Activity Complete</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Memory Recall Results & Progression</p>
          </div>
          <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Level {difficulty} of 5
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-12">
        {/* Success Icon */}
        <div className="flex justify-center py-2">
          <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shadow-lg border-4 border-emerald-200 dark:border-emerald-800 animate-in zoom-in-75 duration-200">
            <CheckCircle size={52} className="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-lg mx-auto">
          <p className="text-2xl text-[var(--color-text)] font-extrabold leading-tight">
            {message}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <ProgressCard
            icon={<Target size={22} />}
            label="Score"
            value={`${score}/${targetObjects.length}`}
            color="#4F46E5"
          />
          <ProgressCard
            icon={<TrendingUp size={22} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="#10B981"
          />
          <ProgressCard
            icon={<Clock size={22} />}
            label="Time"
            value={`${Math.round(responseTime)}s`}
            color="#0EA5E9"
          />
        </div>

        {/* Level Progression Selector */}
        <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[var(--color-text)]">Select Memory Level:</span>
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">1 (2 Objects) to 5 (6 Objects)</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isCurrent = difficulty === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSelectLevel ? onSelectLevel(lvl) : onPlayAgain()}
                  className={`py-3 rounded-2xl font-bold text-center border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 ring-2 ring-indigo-500/25'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <span className="block text-lg">L{lvl}</span>
                  <span className="text-[10px] uppercase opacity-80">
                    {lvl === 1 ? 'Start' : lvl === 5 ? 'Master' : `Tier ${lvl}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {canAdvance ? (
            <LargeButton
              variant="primary"
              onPress={onNextLevel || onPlayAgain}
              icon={<ArrowRight size={22} />}
            >
              Advance to Level {difficulty + 1}
            </LargeButton>
          ) : (
            <LargeButton
              variant="primary"
              onPress={onPlayAgain}
              icon={<RotateCcw size={22} />}
            >
              Practice Level {difficulty} Again
            </LargeButton>
          )}

          {canAdvance && (
            <LargeButton
              variant="secondary"
              onPress={onPlayAgain}
            >
              Replay Level {difficulty}
            </LargeButton>
          )}

          <LargeButton onPress={onBackToGames} variant="outline">
            Back to Games Hub
          </LargeButton>
        </div>
      </main>
    </div>
  );
}
