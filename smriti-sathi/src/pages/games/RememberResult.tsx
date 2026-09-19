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
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Activity Complete</h2>
            <p className="text-sm text-[#7A7A7A]">Memory Recall Results & Progression</p>
          </div>
          <span className="text-sm font-bold text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#1B5E20]/20">
            Level {difficulty} of 5
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6 space-y-6 pb-12">
        {/* Success Icon */}
        <div className="flex justify-center py-2">
          <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center shadow-lg border-4 border-[#1B5E20]/20 animate-in zoom-in-75 duration-200">
            <CheckCircle size={52} className="text-[#1B5E20]" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-lg mx-auto">
          <p className="text-2xl text-[#1A1A1A] font-extrabold leading-tight">
            {message}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <ProgressCard
            icon={<Target size={22} />}
            label="Score"
            value={`${score}/${targetObjects.length}`}
            color="#1B5E20"
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
            color="#1565C0"
          />
        </div>

        {/* Level Progression Selector */}
        <div className="bg-white rounded-3xl border-2 border-[#E0D8CC] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[#1A1A1A]">Select Memory Level:</span>
            <span className="text-sm font-semibold text-[#7A7A7A]">1 (2 Objects) → 5 (6 Objects)</span>
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
                      ? 'bg-[#1B5E20] text-white border-[#144718] shadow-md scale-105'
                      : 'bg-[#FDF8F0] text-[#4A4A4A] border-[#E0D8CC] hover:border-[#1B5E20]'
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
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#144718] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <span>Advance to Level {difficulty + 1}</span>
              <ArrowRight size={24} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#144718] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw size={22} />
              <span>Practice Level {difficulty} Again</span>
            </button>
          )}

          {canAdvance && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full py-3 px-6 bg-[#FDF8F0] hover:bg-[#E0D8CC] text-[#4A4A4A] text-base font-semibold rounded-xl border border-[#E0D8CC] transition-colors"
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
