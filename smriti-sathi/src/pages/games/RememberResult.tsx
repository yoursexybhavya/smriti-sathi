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
          <span className="text-sm font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
            Level {difficulty} of 5
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-12">
        {/* Success Icon */}
        <div className="flex justify-center py-2">
          <div className="w-24 h-24 rounded-full bg-[#10B981]/15 flex items-center justify-center shadow-lg border-4 border-[#10B981]/30 animate-in zoom-in-75 duration-200">
            <CheckCircle size={52} className="text-[#10B981]" />
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
            color="#10B981"
          />
          <ProgressCard
            icon={<TrendingUp size={22} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="#E65100"
          />
          <ProgressCard
            icon={<Clock size={22} />}
            label="Time"
            value={`${Math.round(responseTime)}s`}
            color="#0EA5E9"
          />
        </div>

        {/* Level Progression Selector */}
        <div className="bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[var(--color-text)]">Select Memory Level:</span>
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">1 (2 Objects) → 5 (6 Objects)</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isCurrent = difficulty === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSelectLevel ? onSelectLevel(lvl) : onPlayAgain()}
                  className={`py-3 rounded-2xl font-bold text-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#10B981] text-white border-[#059669] shadow-md scale-105'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[#10B981]'
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
            <button
              type="button"
              onClick={onNextLevel || onPlayAgain}
              className="w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <span>Advance to Level {difficulty + 1}</span>
              <ArrowRight size={24} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw size={22} />
              <span>Practice Level {difficulty} Again</span>
            </button>
          )}

          {canAdvance && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full py-3 px-6 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] text-base font-semibold rounded-xl border border-[var(--color-border)] transition-colors"
            >
              Replay Level {difficulty}
            </button>
          )}

          <LargeButton onPress={onBackToGames} variant="outline">
            Back to Games Hub
          </LargeButton>
        </div>
      </main>
    </div>
  );
}
