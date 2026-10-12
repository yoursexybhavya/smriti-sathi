import React from 'react';
import { Monument } from '../../types/monument';

export interface CategoryOption {
  label: string;
  value: string;
  count?: number;
}

export interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  monuments?: Monument[];
  resultCount?: number;
  className?: string;
}

export const GOOGLE_CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: '🏰 Forts & Palaces', value: 'Fort & Palace' },
  { label: '🛕 Temples', value: 'Temple' },
  { label: '✨ UNESCO Sites', value: 'unesco' },
  { label: '🏛️ Tombs & Mosques', value: 'Tombs & Mosques' },
  { label: '🪜 Stepwells', value: 'Stepwell' },
  { label: '🗿 Caves', value: 'Caves & Rock-cut' },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  monuments = [],
  resultCount,
  className = '',
}) => {
  const getCategoryCount = (value: string): number => {
    if (!monuments || monuments.length === 0) return 0;
    if (value === 'all') return monuments.length;
    if (value === 'unesco') return monuments.filter((m) => m.unesco).length;
    if (value === 'Tombs & Mosques') {
      return monuments.filter(
        (m) => m.category === 'Tomb & Mausoleum' || m.category === 'Mosque'
      ).length;
    }
    return monuments.filter((m) => m.category === value).length;
  };

  const handleChipClick = (value: string) => {
    if (selectedCategory === value && value !== 'all') {
      onSelectCategory('all');
    } else {
      onSelectCategory(value);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pointer-events-auto ${className}`}
      role="tablist"
      aria-label="Filter monuments by category"
    >
      {GOOGLE_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        const count = monuments.length > 0 ? getCategoryCount(cat.value) : undefined;

        return (
          <button
            key={cat.value}
            onClick={() => handleChipClick(cat.value)}
            role="tab"
            aria-selected={isSelected}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm border ${
              isSelected
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-semibold shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <span>{cat.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-blue-200/70 text-blue-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}

      {resultCount !== undefined && (
        <span className="text-xs text-gray-500 font-medium px-2 whitespace-nowrap hidden md:inline">
          {resultCount} places
        </span>
      )}
    </div>
  );
};
