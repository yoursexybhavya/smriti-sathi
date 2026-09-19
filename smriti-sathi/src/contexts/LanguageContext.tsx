import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '../i18n/translations';
import { db } from '../db/database';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'smriti_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached && cached in translations) {
        return cached as Language;
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito/restricted)
    }
    return 'as'; // Default to Assamese for regional North East care pilot
  });

  useEffect(() => {
    // Also sync with Dexie database in case of fresh device migration
    db.settings.get('language').then((setting) => {
      if (setting && setting.value in translations) {
        setLanguageState(setting.value as Language);
        try {
          localStorage.setItem(STORAGE_KEY, setting.value);
        } catch {
          // ignore
        }
      }
    }).catch((err) => {
      console.warn('Could not load language from DB:', err);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    db.settings.put({ key: 'language', value: lang }).catch(() => {});
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (translations['en'] || translations['as'] || {}) as Translations,
    };
  }
  return context;
}
