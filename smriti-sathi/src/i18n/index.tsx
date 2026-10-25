import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE, type Dict, type LanguageCode, type LanguageMeta } from './types';
import en from './locales/en';
import hi from './locales/hi';
import as from './locales/as';
import brx from './locales/brx';
import mni from './locales/mni';

const DICTS: Record<LanguageCode, Dict> = { en, hi, as, brx, mni };
const STORAGE_KEY = 'smriti_lang';

export type TranslateParams = Record<string, string | number>;

interface I18nContextValue {
  lang: LanguageCode;
  meta: LanguageMeta;
  languages: LanguageMeta[];
  setLanguage: (code: LanguageCode) => void;
  /** Translate a key. `{name}` style placeholders are interpolated. */
  t: (key: string, params?: TranslateParams) => string;
  /** Speech-synthesis tag for the active language. */
  speechLang: string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function readInitialLang(): LanguageCode {
  try {
    const url = new URLSearchParams(window.location.search).get('lang') as LanguageCode | null;
    if (url && url in DICTS) return url;
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && stored in DICTS) return stored;
  } catch {
    /* private mode / SSR */
  }
  return DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>(readInitialLang);

  const meta = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0],
    [lang],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dataset.lang = lang;
    document.documentElement.dataset.script = meta.script;
  }, [lang, meta]);

  const t = useCallback(
    (key: string, params?: TranslateParams) => {
      const raw = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
      if (!params) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
        params[name] !== undefined ? String(params[name]) : `{${name}}`,
      );
    },
    [lang],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      meta,
      languages: LANGUAGES,
      setLanguage: setLang,
      t,
      speechLang: meta.speech,
    }),
    [lang, meta, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside <I18nProvider>');
  }
  return ctx;
}

/** Convenience: just the translator. */
export function useT() {
  return useI18n().t;
}

export { LANGUAGES, DEFAULT_LANGUAGE };
export type { LanguageCode, LanguageMeta };
