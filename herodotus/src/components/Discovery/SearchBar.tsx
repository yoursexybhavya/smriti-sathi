import React from 'react';
import { Search, X, Navigation, Menu, ArrowRight } from 'lucide-react';
import { Monument } from '../../types/monument';
import { CategoryChips } from './CategoryChips';

export interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onLocateNearMe: () => void;
  isLocating: boolean;
  nearMeActive: boolean;
  monuments?: Monument[];
  resultCount: number;
  onOpenCircuits: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onLocateNearMe,
  isLocating,
  nearMeActive,
  monuments = [],
  resultCount,
  onOpenCircuits,
}) => {
  return (
    <div className="absolute top-3 left-3 sm:left-4 z-[900] pointer-events-none flex flex-col gap-2.5 max-w-[calc(100vw-24px)]">
      {/* Google Maps White Floating Search Box (Matching Image 1) */}
      <div className="pointer-events-auto flex items-center bg-white rounded-lg shadow-md border border-gray-200/80 px-3 py-2 w-full sm:w-[392px] transition-shadow hover:shadow-lg focus-within:shadow-lg">
        {/* Hamburger Menu */}
        <button
          onClick={onOpenCircuits}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition"
          title="Curated Heritage Circuits"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search Herodotus monuments, cities, dynasties..."
          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none px-2"
          aria-label="Search monuments"
        />

        {/* Clear query button */}
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search icon */}
        <div className="p-1.5 text-gray-500">
          <Search className="w-4 h-4" />
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-5 bg-gray-200 mx-1.5" />

        {/* Directions / Near Me Action (Google Blue circle button) */}
        <button
          onClick={onLocateNearMe}
          disabled={isLocating}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 shrink-0 ${
            nearMeActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
          }`}
          title={nearMeActive ? 'Near Me Active (Sorted by distance)' : 'Sort monuments near me'}
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Google Maps Top Filter Pills (Matching Image 4) */}
      <div className="max-w-[calc(100vw-24px)] overflow-x-auto scrollbar-none">
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={onCategoryChange}
          monuments={monuments}
          resultCount={resultCount}
        />
      </div>
    </div>
  );
};
