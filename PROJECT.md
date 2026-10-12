# Project: Herodotus PWA Build (Phase 1 MVP)

## Architecture
- **Framework & Build**: React 19 + Vite 6 + TypeScript 5.9 + Tailwind CSS v4 + Lucide React.
- **Visual Design Identity**: Cinematic Dark-Editorial (`#0D0B09` / `#12100E`), antique gold accents (`#C69214`, `#D4A856`), weathered stone dark cards (`#1A1714`, `#2E2A25`), editorial serif headlines (`Playfair Display` / `Cinzel` / `Cambria`), legible sans body (`Inter` / `Plus Jakarta Sans` / `Calibri`).
- **Cartography Engine**: Leaflet.js with CartoDB Dark Matter tiles (`dark_all`), custom DOM glowing gold pin markers (`#C69214`) with category-specific SVG glyphs, dynamic clustering, floating preview card, slide-up bottom sheet drawer.
- **Audio Engine**: Zero-server browser-native Web Speech API (`window.speechSynthesis`) supporting 5 languages (`en-IN`, `hi-IN`, `ta-IN`, `te-IN`, `bn-IN`), playback controls (Play/Pause/Resume/Stop), speed selector (0.75x–1.5x), animated SVG/CSS waveform visualizer.
- **Spatial Catalog**: Curated dataset of 50 Indian heritage monuments across Delhi, Agra, Jaipur, and Marquee National Sites with 18 schema fields, verified Wikimedia 960px standard thumbnail images, and full 5-language scripts.
- **Discovery Engine**: Debounced fuzzy search across names/cities/dynasties, horizontal category filter chips, Haversine formula "Near Me" proximity calculator, and 4 curated heritage circuits.
- **Enterprise Analytics**: Dedicated `bigquery/` module containing production-grade SQL definitions for partitioned/clustered DDL (`01`), BigQuery ML vector embedding semantic search (`02`), ARIMA_PLUS visitor forecasting (`03`), and Vertex AI Gemini Pro narrative enrichment (`04`).

## Feature Inventory
Every feature from the Survey phase appears here with its assigned milestone.
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Cinematic Dark-Editorial Styling | Dark luxury aesthetic (`#0D0B09`), heritage gold accents (`#C69214`), stone cards (`#1A1714`) | M1 | Survey Spec Miner |
| 2 | High-Editorial Typography | Serif display headlines + clean sans body with dramatic hierarchy | M1 | Survey Spec Miner |
| 3 | Responsive Map-First Layout | Fullscreen map with collapsible top bar, floating preview, bottom sheet | M1 | Survey Spec Miner |
| 4 | PWA Manifest & App Shell | Installable web app manifest with standalone display, dark theme, icons | M1 | Survey Spec Miner |
| 5 | Service Worker Offline Caching | Service worker caching shell, scripts, CSS, and `monuments.json` | M1 | Survey Spec Miner |
| 6 | 50-Monument Spatial Catalog | Curated GeoJSON/JSON dataset of 50 monuments across Golden Triangle & India | M2 | Survey Spec Miner |
| 7 | Dual-Script Names & Aliases | Multi-script identification (English name, Hindi Devanagari, aliases) | M2 | Survey Spec Miner |
| 8 | Historical Narrative & Milestones | 2-sentence hook, 300-500 word narrative, highlights, timeline milestones | M2 | Survey Spec Miner |
| 9 | Official Visitor Logistics & Tariffs | Official timings, closed days, domestic/SAARC/foreign tariffs, ASI e-ticket link | M2 | Survey Spec Miner |
| 10 | 5-Language Audio Narrations | Pre-written localized scripts in English, Hindi, Tamil, Telugu, and Bengali | M2 | Survey Spec Miner |
| 11 | Interactive Leaflet Map Canvas | Dark-matter tiled map centered on India (lat: 22.97, lng: 78.65, zoom: 5) | M3 | Survey Spec Miner |
| 12 | Glowing Gold Pin Markers | Custom DOM markers with `#C69214` gold glow, pulsating aura, category glyphs | M3 | Survey Spec Miner |
| 13 | Dynamic Marker Clustering | Marker grouping using cluster badges with monument count | M3 | Survey Spec Miner |
| 14 | Floating Preview Card | On-map card with thumbnail, name, timings, category badge, and CTA | M3 | Survey Spec Miner |
| 15 | Smooth Fly-to Animation | Camera transitions smoothly to selected monument coordinates (`flyTo`) | M3 | Survey Spec Miner |
| 16 | Browser Web Speech Synthesis | Zero-server audio narration using `window.speechSynthesis` | M4 | Survey Spec Miner |
| 17 | 5-Language Voice Selection | Dynamic voice matcher for `en-IN`, `hi-IN`, `ta-IN`, `te-IN`, `bn-IN` with fallbacks | M4 | Survey Spec Miner |
| 18 | Audio Controls & Speed Modulation | Play, Pause, Resume, Stop controls and speed selectors (0.75x, 1.0x, 1.25x, 1.5x) | M4 | Survey Spec Miner |
| 19 | Animated Audio Waveform | Oscillating visualizer synchronized with active speech playback state | M4 | Survey Spec Miner |
| 20 | Unified Fuzzy Search Bar | Instant autocomplete multi-field search across names, cities, dynasties | M5 | Survey Spec Miner |
| 21 | Category Filter Chips | Chips: "All", "Forts & Palaces", "Temples", "UNESCO Sites", "Tombs & Mosques", "Stepwells" | M5 | Survey Spec Miner |
| 22 | Haversine "Near Me" Geolocation | Calculates Great-Circle distance using Haversine formula and sorts ascending | M5 | Survey Spec Miner |
| 23 | Curated Heritage Circuits | 4 thematic routes (Golden Triangle, UNESCO Trail, Sacred Temples, Desert Forts) | M5 | Survey Spec Miner |
| 24 | Partitioned DDL Schema (`01`) | DDL creating partitioned/clustered tables for monuments, telemetry, bookmarks | M6 | Survey Spec Miner |
| 25 | Vector Embedding & Search (`02`) | Vector search using `ML.GENERATE_EMBEDDING` and `VECTOR_SEARCH` (Cosine) | M6 | Survey Spec Miner |
| 26 | Time-Series Forecasting (`03`) | Footfall prediction using `ARIMA_PLUS` / `AI.FORECAST` with holiday calendar | M6 | Survey Spec Miner |
| 27 | GenAI Narrative Enrichment (`04`) | Narrative enhancement & Hindi translation using Gemini Pro via `AI.GENERATE` | M6 | Survey Spec Miner |
| 28 | Ultra-Lean Bundle Budget | Production bundle size under 500 KB gzipped initial JS/CSS payload | M7 | Survey Spec Miner |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Suite Track | Comprehensive opaque-box test runner & Tiers 1-4 test suite, publish TEST_READY.md | none | DONE |
| M1 | PWA Shell & Theme | Dependencies fix (@vitejs/plugin-react), Tailwind v4 setup, dark theme tokens, PWA manifest & sw.js | none | DONE |
| M2 | 50-Monument Spatial Catalog | `src/data/monuments.json`, 50 complete monuments, 5-language scripts, verified images | none | DONE |
| M3-M5 | Interactive Cartography, Audio & Discovery UI | Leaflet map, glowing pins, drawer, Web Speech audio player, waveform, search & filter | M1, M2 | IN_PROGRESS |
| M6 | BigQuery Analytics Suite | 4 SQL files in `herodotus/bigquery/` (`01_schema`, `02_semantic`, `03_forecast`, `04_genai`) | none | DONE |
| M7 | Final Milestone: 100% E2E Pass & Hardening | Pass 100% of E2E tests, < 500 KB gzipped bundle verification, adversarial hardening | M1-M6, E2E | PLANNED |

## Interface Contracts
### Monument Catalog (`src/types/monument.ts` ↔ Components)
- `Monument`: Contains `id`, `name`, `hindiName`, `alternateNames`, `category`, `coordinates: { lat, lng }`, `state`, `city`, `district`, `asiCircle`, `unesco`, `dynasty`, `era`, `foundedYear`, `shortDescription`, `fullNarrative`, `architecturalHighlights`, `timeline`, `timings`, `tariffs`, `eTicketUrl`, `heroImage`, `galleryImages`, `audioNarrations: Record<'en'|'hi'|'ta'|'te'|'bn', MonumentAudio>`.
- `Circuit`: Contains `id`, `name`, `subtitle`, `monumentIds`, `description`, `approxDays`.

### Audio Engine Contract (`src/lib/speech.ts` ↔ `AudioPlayer.tsx`)
- `playNarration(text: string, lang: 'en'|'hi'|'ta'|'te'|'bn', rate: number, callbacks: { onStart, onEnd, onError, onPause, onResume })`: Controls `window.speechSynthesis`.
- `stopNarration()`: Cancels active utterance cleanly.
- `getAvailableVoice(lang: string)`: Returns best-matching system voice with regional fallbacks.

### Distance / Geolocation Contract (`src/lib/haversine.ts`)
- `calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number`: Great-circle Haversine formula.
- `formatDistance(km: number): string`: Returns formatted string (`"X.X km away"` or `"XXX m away"`).

## Code Layout
```
herodotus/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── vite.svg
│   ├── data/
│   │   └── monuments.json
│   └── images/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── monument.ts
│   ├── data/
│   │   ├── monuments.json
│   │   ├── circuits.json
│   │   └── circuits.ts
│   ├── lib/
│   │   ├── speech.ts
│   │   ├── haversine.ts
│   │   └── search.ts
│   └── components/
│       ├── Header/
│       │   └── Header.tsx
│       ├── Map/
│       │   └── MapView.tsx
│       ├── PreviewCard/
│       │   └── PreviewCard.tsx
│       ├── Drawer/
│       │   └── StoryDrawer.tsx
│       ├── AudioPlayer/
│       │   ├── AudioPlayer.tsx
│       │   └── WaveformVisualizer.tsx
│       └── Discovery/
│           ├── SearchBar.tsx
│           ├── CategoryChips.tsx
│           └── CircuitSelector.tsx
├── bigquery/
│   ├── 01_schema_monuments.sql
│   ├── 02_semantic_search.sql
│   ├── 03_visitor_forecasting.sql
│   ├── 04_multilingual_narrative_gen.sql
│   └── README.md
└── scripts/
    └── verify_herodotus.js
```
