export type MonumentCategory = 
  | 'Fort & Palace' 
  | 'Temple' 
  | 'Tomb & Mausoleum' 
  | 'Mosque' 
  | 'Stepwell' 
  | 'Caves & Rock-cut' 
  | 'Memorial & Gate' 
  | 'Ancient University';

export interface TimelineMilestone {
  year: string;
  event: string;
}

export interface MonumentAudio {
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn';
  title: string;
  durationSeconds: number;
  narrationText: string;
}

export interface Monument {
  id: string;
  name: string;
  hindiName: string;
  alternateNames: string[];
  category: MonumentCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
  state: string;
  city: string;
  district: string;
  asiCircle: string;
  unesco: boolean;
  unescoSiteName?: string;
  dynasty: string;
  era: string;
  foundedYear: number;
  shortDescription: string;
  fullNarrative: string;
  architecturalHighlights: string[];
  timeline: TimelineMilestone[];
  timings: {
    open: string;
    close: string;
    closedDays?: string[];
    bestTimeToVisit: string;
  };
  tariffs: {
    indianRupees: number;
    saarcRupees: number;
    foreignRupees: number;
    entryFreeUnder15: boolean;
  };
  eTicketUrl: string;
  heroImage: string;
  galleryImages: string[];
  audioNarrations: Record<'en' | 'hi' | 'ta' | 'te' | 'bn', MonumentAudio>;
}

export interface Circuit {
  id: string;
  name: string;
  subtitle: string;
  monumentIds: string[];
  description: string;
  approxDays: number;
}
