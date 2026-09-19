import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { RememberObject } from '../../models/GameSession';

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
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={24} className="text-[#1B5E20]" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Look Carefully</h2>
            </div>
            <div className="text-2xl font-bold text-[#E65100]">
              {timeLeft}s
            </div>
          </div>
          <p className="text-base text-[#4A4A4A]">
            Remember these objects
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#E0D8CC] h-2">
        <div 
          className="h-full bg-[#1B5E20] transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / memorizeTime) * 100}%` }}
        />
      </div>

      {/* Objects Grid */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="max-w-lg mx-auto w-full">
          <div className={`grid ${getGridCols()} gap-4`}>
            {objects.map((obj) => (
              <ObjectCard key={obj.id} object={obj} />
            ))}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-white border-t border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-base text-[#4A4A4A]">
            Look at each object carefully
          </p>
        </div>
      </div>
    </div>
  );
}

function ObjectCard({ object }: { object: RememberObject }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#E0D8CC] p-6 flex flex-col items-center justify-center aspect-square shadow-sm">
      <div className="text-6xl mb-3">{object.emoji}</div>
      <p className="text-lg font-semibold text-[#1A1A1A] text-center">
        {object.name}
      </p>
    </div>
  );
}
