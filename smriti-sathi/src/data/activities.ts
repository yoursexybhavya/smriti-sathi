import { Brain, CalendarClock, Eye, Image as Images } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ActivityDef {
  /** storage key used by game sessions */
  id: 'remember' | 'recognise' | 'memory_match' | 'daily_routine';
  route: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  /** design token used for the tile */
  tone: 'teal' | 'saffron' | 'info' | 'success';
  minutes: number;
  domain: 'recall' | 'recognition' | 'attention' | 'routine';
}

export const ACTIVITIES: ActivityDef[] = [
  {
    id: 'remember',
    route: 'remember-game',
    titleKey: 'games.remember',
    descKey: 'games.rememberDesc',
    icon: Brain,
    tone: 'teal',
    minutes: 3,
    domain: 'recall',
  },
  {
    id: 'recognise',
    route: 'recognise-game',
    titleKey: 'games.recognise',
    descKey: 'games.recogniseDesc',
    icon: Eye,
    tone: 'saffron',
    minutes: 3,
    domain: 'recognition',
  },
  {
    id: 'memory_match',
    route: 'memory-match',
    titleKey: 'games.match',
    descKey: 'games.matchDesc',
    icon: Images,
    tone: 'info',
    minutes: 4,
    domain: 'attention',
  },
  {
    id: 'daily_routine',
    route: 'daily-routine',
    titleKey: 'games.routine',
    descKey: 'games.routineDesc',
    icon: CalendarClock,
    tone: 'success',
    minutes: 4,
    domain: 'routine',
  },
];

export const TONE_STYLES: Record<
  ActivityDef['tone'],
  { bg: string; fg: string; border: string }
> = {
  teal: { bg: 'var(--brand-teal-soft)', fg: 'var(--brand-teal-deep)', border: 'var(--brand-teal-line)' },
  saffron: { bg: 'var(--brand-saffron-soft)', fg: 'var(--brand-saffron-ink)', border: 'var(--brand-saffron-line)' },
  info: { bg: 'var(--info-soft)', fg: 'var(--info)', border: 'var(--info-line)' },
  success: { bg: 'var(--success-soft)', fg: 'var(--success)', border: 'var(--success-line)' },
};
