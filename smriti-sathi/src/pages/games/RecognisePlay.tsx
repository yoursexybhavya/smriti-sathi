import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { RecogniseActivity } from '../../models/RecogniseGame';

interface RecognisePlayProps {
  activity: RecogniseActivity;
  onSubmit: (selected: string, timeSpent: number) => void;
}

export default function RecognisePlay({ activity, onSubmit }: RecognisePlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  const handleSubmit = () => {
    if (selectedOption) {
      const timeSpent = (Date.now() - startTime) / 1000;
      onSubmit(selectedOption, timeSpent);
    }
  };

  // Render the pattern/sequence display based on activity type
  const renderDisplay = () => {
    if (activity.type === 'pattern') {
      // Show the pattern with a gap at the end
      const patternObjects = activity.objects;
      const patternLength = patternObjects.length;
      
      return (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Show pattern twice */}
          {[...patternObjects, ...patternObjects].map((obj, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 h-20 bg-white rounded-2xl border-2 border-[#E0D8CC] flex items-center justify-center text-4xl shadow-sm overflow-hidden">
                <img src={obj.imageUrl} alt={obj.name} className="w-16 h-16 object-contain" />
              </div>
              {i < patternObjects.length * 2 - 1 && (
                <span className="text-2xl text-[#7A7A7A]">→</span>
              )}
            </div>
          ))}
          <span className="text-2xl text-[#7A7A7A]">→</span>
          <div className="w-20 h-20 bg-[#FFF3E0] rounded-2xl border-2 border-[#E65100] flex items-center justify-center text-3xl font-bold text-[#E65100] shadow-sm">
            ?
          </div>
        </div>
      );
    }

    if (activity.type === 'odd-one-out') {
      // Show all objects in a grid
      return (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {activity.objects.map((obj, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-white rounded-2xl border-2 border-[#E0D8CC] flex items-center justify-center text-5xl shadow-sm"
            >
              <img src={obj.imageUrl} alt={obj.name} className="w-16 h-16 object-contain" />
            </div>
          ))}
        </div>
      );
    }

    if (activity.type === 'sequence') {
      // Show sequence with a gap
      const sequenceObjects = activity.objects;
      const removeIndex = Math.floor(sequenceObjects.length / 2);
      
      return (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {sequenceObjects.map((obj, i) => (
            <div key={i} className="flex items-center gap-3">
              {i === removeIndex ? (
                <div className="w-20 h-20 bg-[#FFF3E0] rounded-2xl border-2 border-[#E65100] flex items-center justify-center text-3xl font-bold text-[#E65100] shadow-sm">
                  ?
                </div>
              ) : (
                <div className="w-20 h-20 bg-white rounded-2xl border-2 border-[#E0D8CC] flex items-center justify-center text-4xl shadow-sm overflow-hidden">
                  <img src={obj.imageUrl} alt={obj.name} className="w-16 h-16 object-contain" />
                </div>
              )}
              {i < sequenceObjects.length - 1 && (
                <span className="text-2xl text-[#7A7A7A]">→</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
            {activity.question}
          </h2>
          <p className="text-base text-[#4A4A4A]">
            Choose the correct answer
          </p>
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 px-5 py-6 flex items-center justify-center">
        <div className="max-w-lg mx-auto w-full">
          {renderDisplay()}
        </div>
      </div>

      {/* Options */}
      <div className="bg-white border-t border-[#E0D8CC] px-5 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          <p className="text-base font-medium text-[#1A1A1A] text-center">
            Select your answer:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {activity.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(option)}
                className={`
                  relative bg-white rounded-2xl border-2 p-6 flex items-center justify-center
                  transition-all active:scale-95 text-4xl
                  ${selectedOption === option
                    ? 'border-[#E65100] bg-[#FFF3E0] shadow-md'
                    : 'border-[#E0D8CC] hover:border-[#C0B8A8]'
                  }
                `}
                aria-pressed={selectedOption === option}
                aria-label={`Option ${i + 1}: ${option === '?' ? '?' : <img src={option} alt="" className="w-16 h-16 object-contain" />}`}
              >
                {option === '?' ? '?' : <img src={option} alt="" className="w-16 h-16 object-contain" />}
                {selectedOption === option && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#E65100] flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <LargeButton
            onPress={handleSubmit}
            disabled={!selectedOption}
          >
            Confirm Answer
          </LargeButton>

          <p className="text-center text-sm text-[#7A7A7A]">
            Tap an option to select it
          </p>
        </div>
      </div>
    </div>
  );
}
