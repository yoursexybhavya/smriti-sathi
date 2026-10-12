# Herodotus (हेरोडोटस) — Historical Monument Virtual Audio & Fact Guide

> **IDEA FORGE 2026 Pitch-A-Thon Project**  
> *Explore India's Monuments, One Map at a Time.*  
> 100% Client-Side Progressive Web App (PWA) · Zero Server Streaming Costs · Multilingual Web Speech Audio Engine · BigQuery AI/ML Intelligence Pipeline

---

## 🌟 Overview

**Herodotus** is an interactive, map-first digital heritage guide connecting travelers to India's 3,693+ ASI-protected ancient monuments. Combining 60 FPS spatial cartography, zero-latency browser-native speech synthesis in 5 Indian languages, verified logistical data, and an enterprise BigQuery AI/ML architecture, Herodotus turns every phone into an immersive personal guide.

---

## 🚀 Key Capabilities

### 1. 🗺️ Interactive Spatial Cartography
- **Dark-Matter Carto Tiles**: High-contrast, cinematic dark canvas (`#0D0B09`) showcasing India's architectural monuments with zero visual clutter.
- **Custom Glowing Gold Pins**: Distinctive glowing pins with category-specific glyphs (Forts 🏰, Temples 🛕, Tombs 🏛️, Stepwells 🪜, Caves 🗿, Ancient Universities 📜).
- **Smooth Navigation**: One-tap camera flyTo animations, responsive zoom controls, and geolocation proximity sorting.

### 2. 🎙️ Browser-Native Multilingual Audio Narration
- **Zero Cloud Streaming Costs**: Utilizes the device's native `SpeechSynthesis` Web Speech API.
- **5 Indian Languages**: Instant toggle between English (`en-IN`), Hindi (`hi-IN`), Tamil (`ta-IN`), Telugu (`te-IN`), and Bengali (`bn-IN`).
- **Interactive Audio Waveform**: Animated visualizer reacting to playback state.
- **Full Playback Controls**: Play, Pause, Resume, Stop, and Playback Speed selectors (0.75x, 1.0x, 1.25x, 1.5x).

### 3. 🔍 Discovery, Search & Heritage Circuits
- **Instant Autocomplete Search**: Fuzzy search by monument name, Hindi name, city, state, or dynasty.
- **Category Filter Chips**: Quick filtering for Forts, Temples, UNESCO World Heritage Sites, Stepwells, and Caves.
- **Near-Me Geolocation**: Uses the Haversine formula to compute great-circle distance in real time from the user's GPS coordinates.
- **Curated Heritage Circuits**: One-tap routes for:
  - *Golden Triangle Circuit* (Delhi · Agra · Jaipur)
  - *UNESCO World Heritage Trail* (Pan-India Masterpieces)
  - *Hill Forts & Stepwells of Rajasthan*
  - *Deccan & Chola Sacred Trail* (Hampi · Thanjavur · Mamallapuram)

### 4. 📋 Verified Visitor Logistics & Ticketing
- **Live Timings & Best Hours**: Official opening hours and day closures (e.g. Taj Mahal closed on Fridays).
- **Dual Tariffs**: Clear breakdown of domestic (₹ Indian) vs. international (₹ Foreign / SAARC) entry fees with free entry notice for children under 15.
- **Direct ASI Portal Links**: 1-click button to book official ASI e-tickets.
- **Turn-by-Turn Navigation**: Direct Google Maps routing integration.

### 5. 🤖 BigQuery AI & ML Intelligence Module
Located in `bigquery/`:
- `01_schema_monuments.sql`: DDL for partitioned and clustered BigQuery warehouse tables.
- `02_semantic_search.sql`: Vector Search pipeline with `text-embedding-004` and `VECTOR_SEARCH` for natural-language historical exploration.
- `03_visitor_forecasting.sql`: `ARIMA_PLUS` footfall predictive model with Indian holiday integration for crowd control.
- `04_multilingual_narrative_gen.sql`: Gemini 1.5 Pro `AI.GENERATE` pipeline for automatic storytelling from archaeological gazetteers.

---

## 🏗️ Technical Architecture

```text
herodotus/
├── bigquery/                     # Enterprise BigQuery AI/ML pipeline
│   ├── 01_schema_monuments.sql
│   ├── 02_semantic_search.sql
│   ├── 03_visitor_forecasting.sql
│   └── 04_multilingual_narrative_gen.sql
├── public/
│   ├── data/monuments.json       # Static cached monument catalog
│   ├── images/                   # High-resolution heritage photos
│   ├── manifest.json             # PWA installable manifest
│   └── sw.js                     # Offline-first Service Worker
├── src/
│   ├── components/               # React UI components
│   │   ├── Header.tsx            # Branding, language & circuit indicators
│   │   ├── SearchBar.tsx         # Search & filter chips
│   │   ├── MapCanvas.tsx         # Leaflet spatial map engine
│   │   ├── MonumentPreviewCard.tsx # Floating map preview card
│   │   ├── MonumentDetailDrawer.tsx # Slide-in historical narrative drawer
│   │   └── CircuitsModal.tsx     # Curated travel routes dialog
│   ├── data/
│   │   ├── monuments.json        # 65 verified ASI monuments
│   │   └── circuits.ts           # Curated travel circuits
│   ├── hooks/
│   │   ├── useSpeech.ts          # Web Speech API synthesizer
│   │   └── useGeolocation.ts     # GPS location detection
│   ├── lib/
│   │   └── geo.ts                # Haversine distance calculations
│   ├── types/
│   │   └── monument.ts           # TypeScript domain models
│   ├── App.tsx                   # Main state & view controller
│   ├── index.css                 # Tailwind CSS & custom dark theme
│   └── main.tsx                  # Application entry point
├── scripts/
│   ├── generate_monuments.js     # Data ingestion & audio generator
│   └── verify_herodotus.js       # 14-point automated test suite
├── package.json
└── vite.config.ts
```

---

## 💻 Developer Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Verification Test Suite
```bash
npm test
```

### 4. Build for Production (PWA)
```bash
npm run build
npm run preview
```

---

## 📱 Offline PWA Testing

1. Open in Google Chrome or Android Chrome.
2. In the URL bar, tap the **Install Herodotus** icon to install directly to home screen / desktop.
3. Open DevTools &rarr; **Application** &rarr; **Service Workers** (or toggle Offline mode in Network tab).
4. The map shell and all 65 monuments continue to work seamlessly offline!

---

## 📄 License & Attribution
- Built for **IDEA FORGE 2026 Pitch-A-Thon**.
- Monument records curated from the **Archaeological Survey of India (ASI)** public records.
- Map tiles provided by **CartoDB & OpenStreetMap**.
