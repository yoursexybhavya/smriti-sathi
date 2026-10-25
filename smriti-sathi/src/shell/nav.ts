import { Bell, BookHeart, Home, LayoutDashboard, LifeBuoy, Settings, Sparkles, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Persona = 'elder' | 'caregiver' | 'clinician';

export interface NavItem {
  id: string;
  labelKey: string;
  icon: LucideIcon;
}

/** Elder: five big destinations, nothing hidden behind a "more" menu. */
export const ELDER_TABS: NavItem[] = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'games', labelKey: 'nav.play', icon: Sparkles },
  { id: 'reminders', labelKey: 'nav.reminders', icon: Bell },
  { id: 'progress', labelKey: 'nav.progress', icon: TrendingUp },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
];

export const ELDER_TABS_ALL = ELDER_TABS.map((t) => t.id);

/** Caregiver: dashboard-first, then the three things they actually do daily. */
export const CAREGIVER_TABS: NavItem[] = [
  { id: 'caregiver-home', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { id: 'caregiver-reminders', labelKey: 'nav.reminders', icon: Bell },
  { id: 'caregiver-memory', labelKey: 'nav.memory', icon: BookHeart },
  { id: 'caregiver-settings', labelKey: 'nav.settings', icon: Settings },
];

export const CAREGIVER_TABS_ALL = CAREGIVER_TABS.map((t) => t.id);

/** Clinician (ASHA / doctor): triage replaces the memory book in the dock. */
export const CLINICIAN_TABS: NavItem[] = [
  { id: 'caregiver-home', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { id: 'caregiver-reminders', labelKey: 'nav.reminders', icon: Bell },
  { id: 'safety-dashboard', labelKey: 'saf.triage', icon: LifeBuoy },
  { id: 'caregiver-settings', labelKey: 'nav.settings', icon: Settings },
];

export function tabsFor(persona: Persona): NavItem[] {
  if (persona === 'elder') return ELDER_TABS;
  if (persona === 'clinician') return CLINICIAN_TABS;
  return CAREGIVER_TABS;
}
