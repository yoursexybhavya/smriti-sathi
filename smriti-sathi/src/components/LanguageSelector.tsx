import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { languageService, SUPPORTED_LANGUAGES, SupportedLanguage } from '../services/language/LanguageService';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export default function LanguageSelector({ compact = false, className = '' }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
  };

  if (compact) {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
        className={`
          px-3 py-2
          bg-white border border-gray-300 rounded-lg
          text-sm font-medium text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-3 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isSelected = currentLanguage === lang.code;
        const isAvailable = languageService.isLanguageAvailable(lang.code);
        
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              p-4 rounded-lg border-2
              flex items-center gap-3
              transition-all duration-200
              ${isSelected 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${!isAvailable ? 'opacity-50' : ''}
            `}
          >
            <span className="text-3xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">{lang.nativeName}</div>
              <div className="text-sm text-gray-600">{lang.name}</div>
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
