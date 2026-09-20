import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { RememberObject } from '../../models/GameSession';
import ObjectCardVisual from '../../components/ObjectCardVisual';

interface RememberMemorizeProps {
  objects: RememberObject[];
  memorizeTime: number;
  onComplete: () => void;
}

export default function RememberMemorize({ objects, memorizeTime, onComplete }: RememberMemorizeProps) {
  const [timeLeft, setTimeLeft] = useState(memorizeTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  // Determine grid columns based on object count
  const getGridCols = () => {
    if (objects.length <= 3) return 'grid-cols-3';
    if (objects.length <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={24} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-[var(--color-text)]">Look Carefully</h2>
            </div>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {timeLeft}s
            </div>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Remember these familiar everyday objects
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[var(--color-border)] h-2">
        <div 
          className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / memorizeTime) * 100}%` }}
        />
      </div>

      {/* Objects Grid */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-xl mx-auto w-full">
          <div className={`grid ${getGridCols()} gap-4 sm:gap-6`}>
            {objects.map((obj) => (
              <ObjectCard key={obj.id} object={obj} />
            ))}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-[var(--color-card)] border-t border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Look at each object and notice its colors and shapes
          </p>
        </div>
      </div>
    </div>
  );
}

function ObjectCard({ object }: { object: RememberObject }) {
  return (
    <div className="bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] p-4 sm:p-6 flex flex-col items-center justify-center aspect-square shadow-sm transition-all">
      <div className="mb-2.5 flex justify-center w-20 h-20 sm:w-28 sm:h-28 items-center bg-[var(--color-bg-subtle)] rounded-2xl p-2 border border-[var(--color-border)]/50">
        <ObjectCardVisual imageUrl={object.imageUrl} name={object.name} emoji={object.emoji} className="w-full h-full" />
      </div>
      <p className="text-base sm:text-lg font-bold text-[var(--color-text)] text-center truncate">
        {object.name}
      </p>
    </div>
  );
}
