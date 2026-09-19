export const APP = {
  name: 'Smriti Sathi',
  tagline: 'Memory care that speaks your language — online or offline.',
  version: '0.1.0',
  team: 'CtrlAltElite',
  hackathon: 'Smart India Hackathon 2026',
  problemStatement: 'SIH26003',
  region: 'North Eastern Region, India',
} as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi' },
  { code: 'mizo', name: 'Mizo', nativeName: 'Mizo ṭawng' },
] as const;

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'games', label: 'Games', icon: 'puzzle' },
  { id: 'reminders', label: 'Reminders', icon: 'bell' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
  { id: 'caregiver', label: 'Caregiver', icon: 'users' },
] as const;
