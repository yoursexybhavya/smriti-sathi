import { useState } from 'react';
import { Check } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { RememberObject } from '../../models/GameSession';

interface RememberRecallProps {
  recallSet: RememberObject[];
  targetObjects: RememberObject[];
  onSubmit: (selected: RememberObject[]) => void;
}

export default function RememberRecall({ recallSet, targetObjects, onSubmit }: RememberRecallProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleObject = (obj: RememberObject) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(obj.id)) {
      newSet.delete(obj.id);
    } else {
      newSet.add(obj.id);
    }
    setSelectedIds(newSet);
  };

  const handleSubmit = () => {
    const selected = recallSet.filter(obj => selectedIds.has(obj.id));
    onSubmit(selected);
  };

  // Determine grid columns
  const getGridCols = () => {
    if (recallSet.length <= 6) return 'grid-cols-3';
    if (recallSet.length <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
            Which objects did you see?
          </h2>
          <p className="text-base text-[#4A4A4A]">
            Select the objects you remember
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-[#7A7A7A]">Selected:</span>
            <span className="text-lg font-bold text-[#1B5E20]">
              {selectedIds.size}
            </span>
          </div>
        </div>
      </div>

      {/* Recall Grid */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <div className={`grid ${getGridCols()} gap-3`}>
            {recallSet.map((obj) => {
              const isSelected = selectedIds.has(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => toggleObject(obj)}
                  className={`
                    relative bg-white rounded-2xl border-2 p-4 flex flex-col items-center justify-center aspect-square
                    transition-all active:scale-95
                    ${isSelected 
                      ? 'border-[#1B5E20] bg-[#E8F5E9] shadow-md' 
                      : 'border-[#E0D8CC] hover:border-[#C0B8A8]'
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`${obj.name} ${isSelected ? 'selected' : 'not selected'}`}
                >
                  <div className="text-5xl mb-2">{obj.emoji}</div>
                  <p className="text-base font-medium text-[#1A1A1A] text-center">
                    {obj.name}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1B5E20] flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white border-t border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <LargeButton 
            onPress={handleSubmit}
            disabled={selectedIds.size === 0}
          >
            Done
          </LargeButton>
          <p className="text-center text-sm text-[#7A7A7A] mt-2">
            Tap an object to select or deselect it
          </p>
        </div>
      </div>
    </div>
  );
}
