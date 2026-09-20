import { useState } from 'react';
import { Check } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { RememberObject } from '../../models/GameSession';
import ObjectCardVisual from '../../components/ObjectCardVisual';

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
    if (recallSet.length <= 6) return 'grid-cols-2 sm:grid-cols-3';
    if (recallSet.length <= 9) return 'grid-cols-3';
    return 'grid-cols-3 sm:grid-cols-4';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
              Which objects did you see?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
              Select the objects you remember seeing
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--color-bg-subtle)] px-3.5 py-1.5 rounded-full border border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Selected:</span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              {selectedIds.size}
            </span>
          </div>
        </div>
      </div>

      {/* Recall Grid */}
      <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <div className={`grid ${getGridCols()} gap-3 sm:gap-4`}>
            {recallSet.map((obj) => {
              const isSelected = selectedIds.has(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => toggleObject(obj)}
                  className={`
                    relative bg-[var(--color-card)] rounded-3xl border-2 p-4 flex flex-col items-center justify-center aspect-square
                    transition-all active:scale-95 shadow-sm cursor-pointer
                    ${isSelected 
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-4 ring-indigo-500/20 scale-102' 
                      : 'border-[var(--color-border)] hover:border-indigo-300 dark:hover:border-indigo-700'
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`${obj.name} ${isSelected ? 'selected' : 'not selected'}`}
                >
                  <div className="mb-2 flex justify-center w-16 h-16 sm:w-20 sm:h-20 items-center bg-[var(--color-bg-subtle)] rounded-2xl p-1.5 border border-[var(--color-border)]/50">
                    <ObjectCardVisual imageUrl={obj.imageUrl} name={obj.name} emoji={obj.emoji} className="w-full h-full" />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[var(--color-text)] text-center truncate w-full px-1">
                    {obj.name}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm animate-in fade-in zoom-in duration-150">
                      <Check size={16} className="text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-[var(--color-card)] border-t border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto space-y-2">
          <LargeButton 
            onPress={handleSubmit}
            disabled={selectedIds.size === 0}
            variant={selectedIds.size > 0 ? 'primary' : 'secondary'}
          >
            {selectedIds.size > 0 ? `Confirm Selection (${selectedIds.size})` : 'Tap objects to select'}
          </LargeButton>
          <p className="text-center text-xs text-[var(--color-text-muted)]">
            Tap an object to select or deselect it. Take all the time you need.
          </p>
        </div>
      </div>
    </div>
  );
}
