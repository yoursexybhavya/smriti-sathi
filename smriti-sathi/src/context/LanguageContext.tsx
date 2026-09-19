import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { languageService, SupportedLanguage } from '../services/language/LanguageService';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  translate: (key: string, params?: Record<string, string>) => string;
  isLanguageAvailable: (language: SupportedLanguage) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    languageService.getLanguage()
  );

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('smriti_sathi_language') as SupportedLanguage;
    if (savedLanguage && languageService.isLanguageAvailable(savedLanguage)) {
      languageService.setLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: SupportedLanguage) => {
    languageService.setLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('smriti_sathi_language', language);
  };

  const translate = (key: string, params?: Record<string, string>) => {
    return languageService.translate(key, params);
  };

  const isLanguageAvailable = (language: SupportedLanguage) => {
    return languageService.isLanguageAvailable(language);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        isLanguageAvailable,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
