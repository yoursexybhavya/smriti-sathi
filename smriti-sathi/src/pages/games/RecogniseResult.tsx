import { CheckCircle, XCircle, Clock, Target, TrendingUp } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import ProgressCard from '../../components/ProgressCard';

interface RecogniseResultProps {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  responseTime: number;
  difficulty: number;
  totalQuestions: number;
  correctCount: number;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export default function RecogniseResult({
  isCorrect,
  correctAnswer,
  selectedAnswer,
  responseTime,
  difficulty,
  totalQuestions,
  correctCount,
  onPlayAgain,
  onBackToGames,
}: RecogniseResultProps) {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const getMessage = () => {
    if (accuracy === 100) {
      return 'Well done. You answered all questions correctly.';
    } else if (accuracy >= 80) {
      return `Well done. You answered ${correctCount} out of ${totalQuestions} correctly.`;
    } else if (accuracy >= 60) {
      return `Good effort. You answered ${correctCount} out of ${totalQuestions} correctly.`;
    } else if (accuracy >= 40) {
      return `You answered ${correctCount} out of ${totalQuestions} correctly. Let's try again.`;
    } else {
      return `You answered ${correctCount} out of ${totalQuestions} correctly. Practice makes progress.`;
    }
  };

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
        {/* Success/Failure Icon */}
        <div className="flex justify-center py-4">
          {isCorrect ? (
            <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center shadow-md">
              <CheckCircle size={48} className="text-[#2E7D32]" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#FFEBEE] flex items-center justify-center shadow-md">
              <XCircle size={48} className="text-[#C62828]" />
            </div>
          )}
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed">
            {getMessage()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <ProgressCard
            icon={<Target size={20} />}
            label="Score"
            value={`${correctCount}/${totalQuestions}`}
            color="#E65100"
          />
          <ProgressCard
            icon={<TrendingUp size={20} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="#1B5E20"
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
            <span className="text-lg font-bold text-[#E65100]">Level {difficulty}</span>
          </div>
        </div>

        {/* Last Answer Details */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-5 space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Last Question</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7A7A7A]">Your answer:</span>
              <span className="text-2xl">{selectedAnswer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7A7A7A]">Correct answer:</span>
              <span className="text-2xl">{correctAnswer}</span>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed text-center">
            {accuracy >= 80 
              ? "Your pattern recognition is doing well. Keep practicing."
              : accuracy >= 50
              ? "Good effort. Practice helps improve recognition."
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
