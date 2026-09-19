import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
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
  onBackToGames: () => void;
}

export default function RememberResult({
  targetObjects,
  selectedObjects,
  responseTime,
  difficulty,
  onPlayAgain,
  onBackToGames,
}: RememberResultProps) {
  const { score, accuracy } = DifficultyEngine.calculateScore(selectedObjects, targetObjects);
  const message = DifficultyEngine.getSupportiveMessage(accuracy, score, targetObjects.length);

  const targetIds = new Set(targetObjects.map(o => o.id));
  const selectedIds = new Set(selectedObjects.map(o => o.id));

  // Determine which objects were correctly/incorrectly selected
  const correctSelections = selectedObjects.filter(o => targetIds.has(o.id));
  const incorrectSelections = selectedObjects.filter(o => !targetIds.has(o.id));
  const missedObjects = targetObjects.filter(o => !selectedIds.has(o.id));

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Activity Complete</h2>
          <p className="text-sm text-[#7A7A7A]">Your results</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-10">
        {/* Success Icon */}
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center shadow-md">
            <CheckCircle size={48} className="text-[#1B5E20]" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <ProgressCard
            icon={<Target size={20} />}
            label="Score"
            value={`${score}/${targetObjects.length}`}
            color="#1B5E20"
          />
          <ProgressCard
            icon={<TrendingUp size={20} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="#E65100"
          />
          <ProgressCard
            icon={<Clock size={20} />}
            label="Time"
            value={`${Math.round(responseTime)}s`}
            color="#1565C0"
          />
        </div>

        {/* Difficulty */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-[#4A4A4A]">Difficulty Level</span>
            <span className="text-lg font-bold text-[#1B5E20]">Level {difficulty}</span>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5 space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Details</h3>
          
          {/* Correct selections */}
          {correctSelections.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#2E7D32] mb-2">
                ✓ Correctly remembered ({correctSelections.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {correctSelections.map(obj => (
                  <span key={obj.id} className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#1B5E20] px-3 py-1 rounded-full text-sm font-medium">
                    <span>{obj.emoji}</span>
                    <span>{obj.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Incorrect selections */}
          {incorrectSelections.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#C62828] mb-2">
                ✗ Not in the original set ({incorrectSelections.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {incorrectSelections.map(obj => (
                  <span key={obj.id} className="inline-flex items-center gap-1 bg-[#FFEBEE] text-[#C62828] px-3 py-1 rounded-full text-sm font-medium">
                    <span>{obj.emoji}</span>
                    <span>{obj.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missed objects */}
          {missedObjects.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#F57F17] mb-2">
                ○ Missed ({missedObjects.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {missedObjects.map(obj => (
                  <span key={obj.id} className="inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] px-3 py-1 rounded-full text-sm font-medium">
                    <span>{obj.emoji}</span>
                    <span>{obj.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed text-center">
            {accuracy >= 80 
              ? "Your memory is doing well. Keep practicing."
              : accuracy >= 50
              ? "Good effort. Practice helps improve memory."
              : "Every attempt helps. Let's try again when you're ready."
            }
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <LargeButton onPress={onPlayAgain}>
            Play Again
          </LargeButton>
          <LargeButton onPress={onBackToGames} variant="outline">
            Back to Games
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
