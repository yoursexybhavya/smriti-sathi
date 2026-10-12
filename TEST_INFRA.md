# Herodotus Test Infrastructure Specification (`TEST_INFRA.md`)

**Document Version:** 1.0.0  
**Architect:** `orchestrator_14_e2e_test_writer`  
**Target Application:** Herodotus — Historical Monument Virtual Audio & Fact Guide PWA  
**Codebase Location:** `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/herodotus`  
**Primary Test Runner:** `herodotus/scripts/verify_herodotus.js`  
**Execution Command:** `npm test` or `node scripts/verify_herodotus.js`  

---

## 1. Executive Summary

This document establishes the production-grade automated verification architecture for the Herodotus Heritage Guide PWA. The testing framework is constructed according to the **4-Tier Test Methodology**, providing exhaustive opaque-box validation of catalog data integrity, geographic and boundary limits, cross-feature state interactions, and real-world mobile traveler workload scenarios.

The runner operates without external runtime testing dependencies, using native Node.js ES modules (`node:fs`, `node:path`, `node:zlib`, `node:performance`) to guarantee high-performance execution (< 50ms) across any standard Node.js runtime environment (v18+).

---

## 2. 4-Tier Test Architecture & Taxonomy

```
+---------------------------------------------------------------------------------+
|                        HERODOTUS 4-TIER TEST SUITE                              |
+---------------------------------------------------------------------------------+
|  TIER 1: FEATURE COVERAGE (R1-R6 SPECIFICATION CONFORMANCE)                     |
|  - R1: Design Tokens, PWA Manifest, Service Worker Caching                      |
|  - R2: 50+ Monument Catalog, 23 Schema Fields, 5-Language Audio                 |
|  - R3: Leaflet Cartography, Coordinates, Glyphs, Golden Triangle Anchors        |
|  - R4: Web Speech Locales, Unicode Script Validation, Narration Timing          |
|  - R5: Curated Circuits, Referential Integrity, Search Indexing                 |
|  - R6: BigQuery Partitioned DDL, Vector Search, ARIMA_PLUS, Gemini Pro GenAI    |
+---------------------------------------------------------------------------------+
|  TIER 2: BOUNDARY & CORNER CASES (LIMITS, INVARIANTS & STRESS)                  |
|  - Strict Indian Geopolitical Bounding Box (Lat [6°, 36°], Lng [68°, 98°])      |
|  - Audio Narrative Word Count Thresholds & Realistic Speaking Tempos            |
|  - Timings Format (HH:MM), Chronological Validity, Tariff Non-Negativity        |
|  - Haversine Great-Circle Unit Tests against Ground Truth Geodesics             |
|  - Search Normalization: Case, Devanagari, Diacritics, Punctuation & Aliases    |
+---------------------------------------------------------------------------------+
|  TIER 3: CROSS-FEATURE COMBINATIONS (PAIRWISE & INTEGRATION)                    |
|  - Architectural Category Filtering & Partitioning Completeness                 |
|  - Circuit Referential Integrity, Sequence Length, Multi-State Coverage         |
|  - Audio Voice Matcher Fallback Logic: Exact, Prefix, Default, and Normalized   |
+---------------------------------------------------------------------------------+
|  TIER 4: REAL-WORLD APPLICATION WORKLOAD SCENARIOS                              |
|  - Golden Triangle Tour Simulation (Delhi -> Agra -> Jaipur Route Logistics)    |
|  - Offline PWA Cache Manifest Verification against Physical Disk Assets         |
|  - Production Bundle Budget & Analyzer Check (< 500 KB Gzipped Budget)          |
+---------------------------------------------------------------------------------+
```

---

## 3. Test Suite Inventory Matrix (96 Tests)

### Tier 1: Feature Coverage (39 Tests)

| Test ID | Requirement | Test Description | Target Artifact |
|---|---|---|---|
| `T1.1` | R1 App Shell | `public/manifest.json` exists and is valid JSON | `public/manifest.json` |
| `T1.2` | R1 App Shell | PWA manifest defines app identity and start URL (`/`) | `public/manifest.json` |
| `T1.3` | R1 App Shell | PWA manifest specifies standalone display and portrait orientation | `public/manifest.json` |
| `T1.4` | R1 App Shell | PWA manifest adheres to authentic theme tokens (`#C69214`, `#0D0B09`) | `public/manifest.json` |
| `T1.5` | R1 App Shell | PWA manifest specifies icon assets for 192x192 and 512x512 | `public/manifest.json` |
| `T1.6` | R1 App Shell | Service worker `public/sw.js` exists and defines `herodotus-v1` cache | `public/sw.js` |
| `T1.7` | R1 App Shell | Service worker defines static caching array and implements `fetch` interception | `public/sw.js` |
| `T1.8` | R2 Catalog | `src/data/monuments.json` exists and parses as a valid array | `src/data/monuments.json` |
| `T1.9` | R2 Catalog | Monument catalog contains at least 50 monuments (verifies count $\ge 50$) | `src/data/monuments.json` |
| `T1.10` | R2 Catalog | Every monument contains all 23 required schema fields | `src/data/monuments.json` |
| `T1.11` | R2 Catalog | Dual-script naming (English `name` and Devanagari `hindiName`) is complete | `src/data/monuments.json` |
| `T1.12` | R2 Catalog | Rich storytelling fields (`shortDescription`, `fullNarrative`, highlights, timeline) exist | `src/data/monuments.json` |
| `T1.13` | R2 Catalog | Official visitor logistics (`timings.open`, `timings.close`, tariffs, eTicketUrl) populated | `src/data/monuments.json` |
| `T1.14` | R2 Catalog | Audio narrations present for all 5 official languages (`en`, `hi`, `ta`, `te`, `bn`) | `src/data/monuments.json` |
| `T1.15` | R3 Cartography | Every monument has numeric `coordinates.lat` and `coordinates.lng` | `src/data/monuments.json` |
| `T1.16` | R3 Cartography | Monument coordinates are non-zero and non-NaN | `src/data/monuments.json` |
| `T1.17` | R3 Cartography | Every monument category belongs to recognized 8-category taxonomy | `src/data/monuments.json` |
| `T1.18` | R3 Cartography | Monument IDs are unique non-empty strings | `src/data/monuments.json` |
| `T1.19` | R3 Cartography | Core Golden Triangle anchors exist (Taj Mahal, Amer Fort, Qutub Minar, Red Fort) | `src/data/monuments.json` |
| `T1.20` | R3 Cartography | Every monument has verified `heroImage` and `galleryImages` non-empty arrays | `src/data/monuments.json` |
| `T1.21` | R4 Audio | Audio narration titles defined and non-empty for all languages | `src/data/monuments.json` |
| `T1.22` | R4 Audio | Audio narration durations are positive numbers (`durationSeconds > 0`) | `src/data/monuments.json` |
| `T1.23` | R4 Audio | English audio narrations contain valid non-empty English prose | `src/data/monuments.json` |
| `T1.24` | R4 Audio | Hindi audio narrations contain valid Devanagari script Unicode characters | `src/data/monuments.json` |
| `T1.25` | R4 Audio | Tamil audio narrations contain valid Tamil script Unicode characters | `src/data/monuments.json` |
| `T1.26` | R4 Audio | Telugu audio narrations contain valid Telugu script Unicode characters | `src/data/monuments.json` |
| `T1.27` | R4 Audio | Bengali audio narrations contain valid Bengali script Unicode characters | `src/data/monuments.json` |
| `T1.28` | R5 Discovery | Curated circuits dataset `src/data/circuits.ts` exists | `src/data/circuits.ts` |
| `T1.29` | R5 Discovery | Curated circuits define at least 4 thematic heritage routes | `src/data/circuits.ts` |
| `T1.30` | R5 Discovery | Every circuit defines `id`, `name`, `subtitle`, `description`, `monumentIds`, `approxDays` | `src/data/circuits.ts` |
| `T1.31` | R5 Discovery | All monument references in circuits resolve to existing IDs in `monuments.json` | `src/data/circuits.ts` |
| `T1.32` | R5 Discovery | Search indexing fields (`name`, `hindiName`, `city`, `state`, `dynasty`, `category`) are strings | `src/data/monuments.json` |
| `T1.33` | R5 Discovery | Category filter chip values match monument dataset categories | `src/data/monuments.json` |
| `T1.34` | R6 Analytics | `bigquery/` directory exists and contains all 4 required SQL scripts | `bigquery/` |
| `T1.35` | R6 Analytics | `01_schema_monuments.sql` defines `monuments_master` clustered table | `bigquery/01_schema_monuments.sql` |
| `T1.36` | R6 Analytics | `01_schema_monuments.sql` defines `visitor_telemetry_daily` partitioned by date | `bigquery/01_schema_monuments.sql` |
| `T1.37` | R6 Analytics | `02_semantic_search.sql` creates `text-embedding-004` model and calls `VECTOR_SEARCH` | `bigquery/02_semantic_search.sql` |
| `T1.38` | R6 Analytics | `03_visitor_forecasting.sql` defines `ARIMA_PLUS` model with `HOLIDAY_REGION = 'IN'` | `bigquery/03_visitor_forecasting.sql` |
| `T1.39` | R6 Analytics | `04_multilingual_narrative_gen.sql` defines `gemini-1.5-pro` and calls `ML.GENERATE_TEXT` | `bigquery/04_multilingual_narrative_gen.sql` |

### Tier 2: Boundary & Corner Cases (30 Tests)

| Test ID | Area | Test Description | Invariant / Boundary |
|---|---|---|---|
| `T2.1` | GPS Bounds | Latitude strict lower bound: Every monument `lat >= 6.0° N` | $6.0 \le \text{lat}$ |
| `T2.2` | GPS Bounds | Latitude strict upper bound: Every monument `lat <= 36.0° N` | $\text{lat} \le 36.0$ |
| `T2.3` | GPS Bounds | Longitude strict lower bound: Every monument `lng >= 68.0° E` | $68.0 \le \text{lng}$ |
| `T2.4` | GPS Bounds | Longitude strict upper bound: Every monument `lng <= 98.0° E` | $\text{lng} \le 98.0$ |
| `T2.5` | GPS Bounds | Coordinate precision: Coordinates are decimal numbers with fractional precision | `!Number.isInteger(c)` |
| `T2.6` | GPS Bounds | Geographic dispersion: Bounding box spans $\ge 15^\circ$ latitude & longitude | $\Delta\text{lat} \ge 15^\circ, \Delta\text{lng} \ge 15^\circ$ |
| `T2.7` | Audio Length | English audio narrative minimum length: Every `en` script $\ge 40$ words | $\text{wordCount}(\text{en}) \ge 40$ |
| `T2.8` | Audio Length | Absolute non-triviality guard: No script has $< 8$ words or $< 40$ characters | $\text{wordCount} \ge 8, \text{length} \ge 40$ |
| `T2.9` | Audio Timing | Audio duration realism boundary: Estimated duration between 30s and 300s | $30 \le \text{duration} \le 300$ |
| `T2.10` | Audio Tempo | Audio speech tempo ratio: Word count to duration ratio between 0.05 and 2.0 wps | $0.05 \le \text{wps} \le 2.0$ |
| `T2.11` | Audio Titles | Audio title length bounds: Titles between 5 and 100 characters | $5 \le \text{length} \le 100$ |
| `T2.12` | Audio Length | Multilingual regional script length validation: Asserts `hi, ta, te, bn` scripts $\ge 40$ words | $\text{wordCount} \ge 40$ *(Escalated Defect)* |
| `T2.13` | Timings | Time format validation: Every `open` and `close` time conforms to `HH:MM` | `^([01]\d\|2[0-3]):[0-5]\d$` |
| `T2.14` | Timings | Chronological order: Daily opening time is earlier than closing time | $\text{open} < \text{close}$ |
| `T2.15` | Tariffs | Tariff non-negativity: Domestic, SAARC, Foreign fees $\ge 0$ | $\text{tariff} \ge 0$ |
| `T2.16` | Tariffs | Tariff equity boundary: Foreign visitor fee $\ge$ Domestic fee | $\text{foreign} \ge \text{domestic}$ |
| `T2.17` | Tariffs | Statutory Child Exemption: Explicitly defines `entryFreeUnder15 === true` | `entryFreeUnder15 === true` |
| `T2.18` | Timings | Closed days array boundary: When defined, contains valid weekdays | $\text{day} \in \text{Weekdays}$ |
| `T2.19` | Haversine | Delhi (28.6139, 77.2090) to Agra (27.1751, 78.0421) distance ~180 km | $175 \le d \le 210$ km |
| `T2.20` | Haversine | Delhi (28.6139, 77.2090) to Jaipur (26.9124, 75.7873) distance ~235 km | $230 \le d \le 270$ km |
| `T2.21` | Haversine | Agra (27.1751, 78.0421) to Jaipur (26.9124, 75.7873) distance ~225 km | $220 \le d \le 250$ km |
| `T2.22` | Haversine | Zero-distance boundary: Distance from a coordinate to itself is strictly 0.0 km | $d(P, P) = 0.0$ |
| `T2.23` | Haversine | Global distance boundary: Long-range calculations produce finite numbers | $6500 \le d(\text{Delhi, London}) \le 7000$ |
| `T2.24` | Geolocation | Distance format boundary: $< 1$ km formats in meters, $\ge 1$ km in km | `"X m away"` vs `"X.X km away"` |
| `T2.25` | Search | Case-insensitivity: `TAJ MAHAL` matches identically to `taj mahal` | `search('TAJ') === search('taj')` |
| `T2.26` | Search | Devanagari script matching: Devanagari query `ताज` matches `Taj Mahal` | `match(hindiName, query)` |
| `T2.27` | Search | Alternate alias resolution: `Baby Taj` resolves `Tomb of I'timad-ud-Daulah` | `match(alternateNames, query)` |
| `T2.28` | Search | Substring token matching: Single-word query `Fort` matches multiple monuments | $\ge 5$ matches |
| `T2.29` | Search | Empty and whitespace query tolerance: Query `""` returns complete dataset | `results.length === 65` |
| `T2.30` | Search | Diacritic and apostrophe normalization: `Itimad` matches `I'timad-ud-Daulah` | Diacritic stripping |

### Tier 3: Cross-Feature Combinations (16 Tests)

| Test ID | Area | Test Description | Verification Criteria |
|---|---|---|---|
| `T3.1` | Categories | "Fort & Palace" filter isolates only forts and palaces | Category exact equality ($\ge 10$ records) |
| `T3.2` | Categories | "Temple" filter isolates only temple monuments | Category exact equality ($\ge 8$ records) |
| `T3.3` | Categories | "UNESCO Sites" filter isolates only monuments with `unesco === true` | `unesco === true` ($\ge 20$ records) |
| `T3.4` | Categories | "Stepwell" filter isolates ancient stepwells | Category exact equality ($\ge 3$ records) |
| `T3.5` | Categories | "Tomb & Mausoleum / Mosque" filter isolates funerary & Islamic monuments | Combined category equality ($\ge 6$ records) |
| `T3.6` | Categories | Exhaustive category coverage: Sum of all categories equals catalog size | $\sum \text{category counts} \equiv N$ |
| `T3.7` | Circuits | Golden Triangle Circuit: All 15 referenced monuments exist, span DL, UP, RJ | Multi-state presence verified |
| `T3.8` | Circuits | UNESCO Trail: All 20 monuments exist, span $\ge 6$ states, 100% `unesco: true` | Pan-India UNESCO consistency |
| `T3.9` | Circuits | Royal Rajput Forts: All 6 referenced monuments exist, 100% in Rajasthan | State homogeneity verified |
| `T3.10` | Circuits | Southern Dynasties: All 5 referenced monuments exist in Karnataka & Tamil Nadu | Regional integrity verified |
| `T3.11` | Circuits | Circuit duration realism: Every circuit specifies `approxDays` between 1 and 21 | $1 \le \text{days} \le 21$ |
| `T3.12` | Voice Match | Exact locale match: When voice with `en-IN` present, selects `en-IN` | Exact BCP 47 matching |
| `T3.13` | Voice Match | Language prefix match: When voice with `hi-IN` present, matches `hi` | Prefix matching logic |
| `T3.14` | Voice Match | Missing regional voice fallback: When requested voice absent, uses default | Fallback voice resilience |
| `T3.15` | Voice Match | Dialect code normalization: Locales with underscores (`te_IN`) are matched | Underscore-to-hyphen normalization |
| `T3.16` | Voice Match | Empty system voices array handling: Returns null gracefully without throwing | Zero-length array resilience |

### Tier 4: Real-World Workload Scenarios (11 Tests)

| Test ID | Scenario | Test Description | Verification Criteria |
|---|---|---|---|
| `T4.1` | Golden Triangle | Tour itinerary resolution: Successfully loads Delhi, Agra, Jaipur anchors | All 3 anchor monuments resolved |
| `T4.2` | Golden Triangle | Step-by-step traveler flow: Verifies timings, Friday closure, and ticketing URLs | Timings, closed day rules verified |
| `T4.3` | Golden Triangle | Cumulative travel distance: Calculates total loop (Delhi -> Agra -> Jaipur -> Delhi) | $590 \le \text{totalLoop} \le 640$ km |
| `T4.4` | Golden Triangle | Storytelling availability: Narrative, milestones, audio guides exist for all stops | Narratives and audio guides populated |
| `T4.5` | Offline PWA | Static assets manifest verification: All assets in `sw.js` exist on disk | Physical disk presence verified |
| `T4.6` | Offline PWA | High-resolution image assets: All icons and preview images exist ($\ge 500$ bytes) | Image assets non-empty |
| `T4.7` | Offline PWA | Service worker caching strategies: Implements install, activate, fetch listeners | Event handler architecture verified |
| `T4.8` | Bundle Budget | Production build artifacts exist: `dist/index.html` and `dist/assets/` present | Build artifacts present |
| `T4.9` | Bundle Budget | Production asset enumeration: At least one JS and one CSS bundle present | JS and CSS assets identified |
| `T4.10` | Bundle Budget | Individual bundle budget: Core JS $< 350$ KB gzipped, CSS $< 50$ KB gzipped | Component bundle limits verified |
| `T4.11` | Bundle Budget | Total gzipped payload budget: Total JS + CSS strictly $< 500$ KB (512,000 bytes) | Budget compliance (Actual: 182.7 KB) |

---

## 4. Authoritative Output Derivation

For every test case in the suite, expected values are derived strictly from authoritative sources:

1. **Dataset Schema & Required Fields**:
   - Source: `PROJECT.md` § Interface Contracts and `spec_report.md` § 1.1.
   - Required fields (23): `id, name, hindiName, alternateNames, category, coordinates, state, city, district, asiCircle, unesco, dynasty, era, foundedYear, shortDescription, fullNarrative, architecturalHighlights, timeline, timings, tariffs, eTicketUrl, heroImage, galleryImages, audioNarrations`.

2. **Geographical Coordinates & Bounding Box**:
   - Source: Survey of India and ASI Geographic Coordinate Standards.
   - Strict Indian Geopolitical Bounding Box: Latitude $[6.0^\circ\text{ N}, 36.0^\circ\text{ N}]$, Longitude $[68.0^\circ\text{ E}, 98.0^\circ\text{ E}]$.

3. **Haversine Geodesic Distance Ground Truth**:
   - Source: Spherical Earth model ($R = 6371\text{ km}$):
     $$\Delta\phi = \frac{(\text{lat}_2 - \text{lat}_1)\pi}{180}, \quad \Delta\lambda = \frac{(\text{lng}_2 - \text{lng}_1)\pi}{180}$$
     $$a = \sin^2(\Delta\phi/2) + \cos(\text{lat}_1\pi/180)\cos(\text{lat}_2\pi/180)\sin^2(\Delta\lambda/2)$$
     $$d = 2 \cdot R \cdot \arctan2(\sqrt{a}, \sqrt{1-a})$$
   - Ground Truth Geodesics:
     - Delhi (28.6139, 77.2090) to Agra (27.1751, 78.0421) = 179.72 km (Tolerance: $[175, 210]$ km).
     - Delhi (28.6139, 77.2090) to Jaipur (26.9124, 75.7873) = 235.29 km (Tolerance: $[230, 270]$ km).
     - Agra (27.1751, 78.0421) to Jaipur (26.9124, 75.7873) = 225.21 km (Tolerance: $[220, 250]$ km).

4. **Production Bundle Size Budget**:
   - Source: `ORIGINAL_REQUEST.md` § Acceptance Criteria & `spec_report.md` § 7.1.
   - Target: Total initial JS + CSS gzipped $< 500\text{ KB}$ ($512,000\text{ bytes}$).
   - Measurement: `zlib.gzipSync()` over production build chunks in `dist/assets/`.
   - Current measured bundle: **182.70 KB gzipped** (36.5% of budget).

---

## 5. Defect Escalation & QA Audit Protocol

When `node scripts/verify_herodotus.js` discovers an implementation defect, the runner:
1. Records the failure with exact file path, monument ID, language code, and observation.
2. Continues running the remaining test suites to maintain exhaustive coverage.
3. Compiles an **Escalation Log** summarizing each defect.
4. Exits with non-zero exit code (`1`) to prevent silent promotion until fixed in Milestone M7.

---
