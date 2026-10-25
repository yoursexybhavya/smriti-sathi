/**
 * Smriti Sathi — i18n contract
 * Every visible string in the product comes from a dictionary in ./locales.
 * A missing key falls back to English (never to a blank), and the active
 * <html lang> is always set so screen readers switch voice correctly.
 */

export type LanguageCode = 'en' | 'hi' | 'as' | 'brx' | 'mni';

export interface LanguageMeta {
  code: LanguageCode;
  /** English name, for the caregiver-facing list */
  label: string;
  /** Endonym — always shown first, elders recognise this */
  native: string;
  /** HTML lang attribute for correct font + screen-reader pronunciation */
  htmlLang: string;
  /** BCP-47 tag used for speech synthesis */
  speech: string;
  script: 'latin' | 'devanagari' | 'bengali';
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', native: 'English', htmlLang: 'en-IN', speech: 'en-IN', script: 'latin' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', htmlLang: 'hi', speech: 'hi-IN', script: 'devanagari' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', htmlLang: 'as', speech: 'as-IN', script: 'bengali' },
  { code: 'brx', label: 'Bodo', native: 'बर’', htmlLang: 'brx', speech: 'brx-IN', script: 'devanagari' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্', htmlLang: 'mni', speech: 'mni-IN', script: 'bengali' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export type Dict = Record<string, string>;
