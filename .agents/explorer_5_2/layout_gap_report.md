# Visual & Technical Layout Gap Analysis: Herodotus Pitch Deck

**Document ID**: `LAYOUT-GAP-HERODOTUS-V5`  
**Author**: `explorer_5_2` (Visual & Technical Layout Gap Analyst)  
**Target File**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`  
**Output Target**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`  
**Canvas Specification**: 16:9 Widescreen (`LAYOUT_WIDE`: 13.333" × 7.500")  
**Design System**: Cinematic Dark Editorial (`BG_DARK: '0D0B09'`, `CARD_DARK: '1A1714'`, `GOLD: 'C69214'`)

---

## 1. Executive Summary & Root Cause Analysis

A side-by-side forensic visual audit between the **7 Reference Screenshots** (`reference_slide1_cover.png` through `reference_slide7_closing.png`) and the current Iteration 3 implementation in `generate_deck.js` reveals significant architectural and layout discrepancies. 

While Iteration 3 successfully established the dark color palette (`0D0B09` canvas, `C69214` gold accents, Cambria/Calibri typography), **element layouts, structural hierarchies, and focal compositions deviated heavily from the user's reference designs**:

| Slide | Reference Composition | Current Iteration 3 Implementation | Layout Discrepancy Severity |
|---|---|---|---|
| **Slide 1 (Cover)** | Pure cinematic film-poster: full-bleed monument photo, top/bottom letterbox bars, huge Cambria title (76pt), right-side faint India map with Taj Mahal gold pin & "MONUMENT RECORD · IN-UP-001" callout, bottom gold dashed line with circular pin. | Cluttered with 3 pill badges, a giant 6.8" MVP Status Card box, and a right-side editorial narrative card that blocks the photo. | **Critical**: Obscures cinematic hero photo with excessive rectangular boxes not present in reference. |
| **Slide 2 (Problem)** | Asymmetric split: Left ~58% monument photo with lower-left headline ("YOU'RE STANDING IN FRONT OF HISTORY..."), dashed line with 4 "X" markers; Right ~42% with 3 dark stacked cards (`1A1714`) connected to photo via 3 horizontal pin lines. | Placed headline at the top of the photo, inserted a large caption card at y=3.05, added a bottom synthesis card on the right, and used verbose card titles instead of punchy uppercase titles. | **High**: Inverts vertical reading hierarchy and clutters the bottom right. |
| **Slide 3 (Solution)** | Left side: National map frame with concentric gold Amer pin + 4 stacked zoom cards ("01 INDIA" → "02 RAJASTHAN" → "03 JAIPUR" → "04 MONUMENT"); Top-right: Gold italic Cambria tagline; Right side: Amer Fort photo strip + Cream UI Card (`F5F0E8`) with audio player, waveform, timings, fees, and buttons. | Formatted as a text comparison slide ("TRADITIONAL VISITOR JOURNEY" vs "HERODOTUS BREAKTHROUGH") with a generic map inset. Missing the 4 zoom cards and the entire Amer Fort cream UI card. | **Critical**: Completely misses the solution UI reveal and zoom stepper pattern. |
| **Slide 4 (Product)** | Left side: Full tall browser mockup window (`herodotus.app/explore`) showing map, filter chips, and Amer Fort popup modal; Right side: 4 vertically stacked journey steps ("01 ZOOM", "02 TAP", "03 LISTEN", "04 PLAN") + bottom-right dashed "RESERVED / LIVE PROTOTYPE" card. | Browser window is shallow and wide (w=7.30, h=3.35); right side has a photo of a woman on a phone; bottom has 4 horizontal ribbon cards. | **Critical**: Fails to replicate the vertical 4-step journey, browser proportions, and the "RESERVED" card. |
| **Slide 5 (Tech)** | 5-step horizontal architecture flow (User → Map → Story → Data → Web) with iconic square glyph boxes, gold dashed arrows; Right: "WHY IT SHIPS" & "DEPLOY SURFACE"; Bottom: "STRETCH / NEXT" with 3 future feature cards. | 5 cards are oversized vertical boxes packed with dense bullet lists; bottom has 3 large metric cards (<350KB, ₹0/User, 48 Hours) instead of the STRETCH/NEXT cards. | **High**: Structure is overcrowded; missing the clean iconic glyph boxes and STRETCH/NEXT section. |
| **Slide 6 (Impact)** | Dark background with faint monument silhouette; gold dashed timeline with 3 circular pin rings; 3 large equal-width cards ("01 DISCOVER", "02 UNDERSTAND", "03 PLAN"); 3 description columns below ("TOURISM & HERITAGE", "INDEPENDENCE", "ACCESSIBILITY"); bottom statement banner. | Slide 6 in Iteration 3 is "Business Model" (revenue streams + roadmap). Slide 7 was a half-bleed photo of an Indian family with a testimonial quote and 3 cards. Reference Slide 6 has NO family photo. | **Critical**: Slide 6 in reference is a dedicated 3-pillar impact timeline (Discover / Understand / Plan) with bottom statement banner. |
| **Slide 7 (Closing)** | Split layout: Left ~52% dark background with huge headline ("HISTORY IS EVERYWHERE. / NOW, IT CAN SPEAK."), brand subtitle, bottom-left branding; Right ~48% close-up stone sculpture photo with curved gold dashed line leading to Hampi GPS coordinates; bottom-right QR code box ("SCAN · LIVE DEMO"). | Full-bleed twilight gateway across the whole 13.333" slide; centered text; 3 value anchor cards in middle; massive central CTA card at bottom; missing the QR code box and curved connector. | **Critical**: Completely different composition; loses the editorial stone sculpture split and QR demo card. |

---

## 2. Canvas Geometry & Grid Blueprint (13.333" × 7.500")

All slides are constructed on a strict mathematical coordinate grid that honors PresentationML standards, guarantees margins $\ge 0.500"$, and maintains consistent spacing rhythms:

```
+-----------------------------------------------------------------------------------+  y = 0.000"
|  TOP CINEMATIC LETTERBOX BAR (h: 0.400", fill: 000000)                             |  y = 0.400"
|  Kicker / Breadcrumb (y: 0.480", h: 0.250")       GPS Coordinates (y: 0.480")      |
|-----------------------------------------------------------------------------------|  y = 0.720" (Rule)
|                                                                                   |
|  SAFE CONTENT BOUNDING BOX:                                                       |
|  Left: x = 0.800"                                                                 |
|  Right: x = 12.533"  (w = 11.733", margin = 0.800")                              |
|  Top: y = 0.800"                                                                  |
|  Bottom: y = 6.850"  (h = 6.050", margin = 0.650")                                |
|                                                                                   |
|-----------------------------------------------------------------------------------|  y = 7.100"
|  BOTTOM CINEMATIC LETTERBOX BAR (h: 0.400", fill: 000000)                          |  y = 7.500"
+-----------------------------------------------------------------------------------+
```

### Universal Color Palette Tokens
```javascript
const C = {
  BG_DARK: '0D0B09',          // Deep near-black warm canvas
  CARD_DARK: '1A1714',        // Dark card background
  CARD_DARK_HERO: '221E19',   // Highlighted dark card surface
  CARD_BORDER: '2E2A25',      // Structural card border
  CARD_BORDER_GOLD: 'C69214', // Accent card border
  GOLD: 'C69214',             // Heritage Antique Gold (numbers, highlights, connectors)
  GOLD_LIGHT: 'D4A856',       // Softer gold for badges and secondary headers
  TEXT_WHITE: 'FFFFFF',       // Primary headlines, prominent titles
  TEXT_CREAM: 'E8E0D4',       // Secondary body text, subheadings
  TEXT_MUTED: '8A8279',       // Tertiary labels, coordinates, captions
  UI_CREAM: 'F5F0E8',         // Light mockup panel fill (Slides 3 & 4)
  UI_BORDER: 'D9D0C3',        // Border for light UI mockup cards
  BLACK_BAR: '000000',        // Letterbox bars
  LINE_MUTED: '2E2A25',       // Subdued dividing rules
  GRID_LINE: '1C1916'         // Cartographic grid lines
};
```

---

## 3. Slide-by-Slide Gap Analysis & Coordinate Blueprint

### Slide 1: Cover (Film-Poster Photographic Minimalist)
*Reference file*: `reference_slide1_cover.png`

#### Visual Elements
1. **Background**: Full-bleed monument photograph (`IMG_HERO_MONUMENT`: Amer Fort at sunset, x: 0, y: 0, w: 13.333, h: 7.500).
2. **Contrast Overlays**:
   - Slide-wide dark tint (`0D0B09`, transparency: 38%).
   - Left-side dark vignette rectangle (`0D0B09`, transparency: 25%, x: 0, y: 0, w: 7.500, h: 7.500) to ensure crisp contrast for white serif text.
3. **Letterbox Bars**:
   - Top: `x: 0, y: 0, w: 13.333, h: 0.400`, fill: `000000`.
   - Bottom: `x: 0, y: 7.100, w: 13.333, h: 0.400`, fill: `000000`.
4. **Header Line**:
   - Left text: `"IDEA FORGE 2026  —  PITCH-A-THON"`, `x: 0.800, y: 0.480, w: 4.500, h: 0.250`, Calibri 9.5pt bold, `C.GOLD`, `charSpacing: 3`.
   - Thin gold rule below with end ticks: `x: 0.800, y: 0.720, w: 11.733, h: 0`, line: `{ color: C.GOLD, width: 0.75 }`.
   - Right text: `"27.1751° N  ·  78.0421° E  ·  AGRA, IN"`, `x: 7.500, y: 0.480, w: 5.033, h: 0.250`, Calibri 9.5pt, `C.TEXT_MUTED`, `charSpacing: 2`, right-aligned.
5. **Center-Left Content**:
   - Supertitle: `"A MAP-FIRST DIGITAL HERITAGE EXPERIENCE"`, `x: 0.800, y: 2.850, w: 6.500, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3.5`.
   - Giant Title: `"HERODOTUS"`, `x: 0.750, y: 3.150, w: 7.500, h: 1.350`, Cambria bold, 76pt, `C.TEXT_WHITE`, `charSpacing: 2`.
   - Divider: `x: 0.800, y: 4.550, w: 2.400, h: 0`, line: `{ color: C.GOLD, width: 1 }`.
   - Subtitle: `"EXPLORE INDIA'S MONUMENTS,\nONE MAP AT A TIME"`, `x: 0.800, y: 4.750, w: 6.500, h: 0.850`, Cambria 22pt bold, `C.TEXT_WHITE`.
6. **Center-Right Cartographic Pin**:
   - Faint India Map Inset: `IMG_HERITAGE_MAP`, `x: 8.200, y: 1.500, w: 4.500, h: 3.800`, `transparency: 40`.
   - Concentric Reticle Pin at Agra/Taj Mahal: `cx: 10.600, cy: 2.760`.
   - Callout Label: `"TAJ MAHAL  /  AGRA\nMONUMENT RECORD · IN-UP-001"`, `x: 7.800, y: 2.500, w: 2.500, h: 0.450`, Calibri 8.5pt bold, `C.TEXT_CREAM`, right-aligned.
7. **Bottom Metadata & Connectors**:
   - Left: `"TEAM HERODOTUS"`, `x: 0.800, y: 6.250, w: 3.000, h: 0.220`, Calibri 9.5pt bold, `C.GOLD`, `charSpacing: 3`.
   - Right: `"MAP  ·  STORY  ·  AUDIO  ·  VISIT"`, `x: 8.500, y: 6.250, w: 4.033, h: 0.220`, Calibri 9pt, `C.TEXT_MUTED`, `charSpacing: 3`, right-aligned.
   - Gold Dashed Line across bottom: `x: 0.800, y: 6.650, w: 11.733, h: 0`, line: `{ color: C.GOLD, width: 1, dashType: 'dash' }`.
   - Concentric Pin Marker on line at `x: 10.600` (vertically aligned with the Taj Mahal pin above).

#### Discrepancy & Fix Checklist
- [x] Remove the 3 pill badges ("MAP-FIRST DISCOVERY", "WEB SPEECH AUDIO", "ZERO-FRICTION PWA").
- [x] Remove the large rectangular MVP Status Card ("★ LIVE WORKING MVP READY...").
- [x] Remove the dense right-side editorial card ("Amer Fort & Palace...").
- [x] Enlarge "HERODOTUS" to 76pt Cambria bold.
- [x] Add the faint map outline, Taj Mahal pin, and "MONUMENT RECORD · IN-UP-001" label.
- [x] Add the bottom dashed line with aligned circular pin ring.

---

### Slide 2: The Problem (Asymmetric Split + 3 Interactive Cards)
*Reference file*: `reference_slide2_problem.png`

#### Visual Elements
1. **Left Half-Bleed Panel (~58% width)**:
   - Photo: `IMG_PROBLEM_SCENE` (or Hawa Mahal palace facade), `x: 0, y: 0, w: 7.600, h: 7.500`, cover.
   - Dark overall overlay: `fill: C.BG_DARK, transparency: 30`.
   - Lower vignette rectangle: `x: 0, y: 3.800, w: 7.600, h: 3.700`, `fill: C.BG_DARK, transparency: 18`.
2. **Top Header**:
   - Left: `"02  —  THE PROBLEM"`, `x: 0.800, y: 0.480, w: 3.500, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3`.
   - Thin rule below kicker: `x: 0.800, y: 0.720, w: 6.400, h: 0`, line: `{ color: C.CARD_BORDER, width: 0.75 }`.
   - Right GPS: `"26.9239° N · 75.8267° E  JAIPUR, IN"`, `x: 8.000, y: 0.480, w: 4.533, h: 0.250`, Calibri 9pt, `C.TEXT_MUTED`, `charSpacing: 2`, right-aligned.
3. **Left Headline (Over Photo, Lower Half)**:
   - Line 1: `"YOU'RE STANDING IN FRONT OF HISTORY."`, Cambria 32pt bold, `C.TEXT_WHITE`.
   - Line 2: `"BUT WHERE'S THE STORY?"`, Cambria 32pt bold, `C.GOLD`.
   - Position: `x: 0.800, y: 4.400, w: 6.400, h: 1.050`.
   - Short divider rule: `x: 0.800, y: 5.550, w: 1.800, h: 0`, line: `{ color: C.GOLD, width: 1 }`.
   - Subtitle: `"THE HISTORY IS THERE.\nTHE DIGITAL EXPERIENCE IS FRAGMENTED."`, `x: 0.800, y: 5.700, w: 6.400, h: 0.450`, Calibri 10.5pt bold, `C.TEXT_CREAM`, `charSpacing: 2`.
   - Segmented X motif: `"———   X   ———   X   ———   X   ———   X   ———"`, `x: 0.800, y: 6.600, w: 6.400, h: 0.250`, Calibri 9.5pt, `C.GOLD`, `charSpacing: 3`, centered.
4. **Right Stacked Cards (3 Dark Cards)**:
   - Width: `4.533"`, Left: `x = 8.000"`, Margin from right edge: `0.800"`.
   - Card 1: `y: 1.100, h: 1.650`, fill: `1A1714`, line: `2E2A25`, rectRadius: 0.08, shadow.
     - Number: `"01"`, `C.GOLD`, Calibri 11pt bold, `x: 8.220, y: 1.250`.
     - Icon top-right: Search glyph `🔍`, `x: 12.050, y: 1.250`.
     - Title: `"INFORMATION IS SCATTERED"`, Calibri 14.5pt bold, `C.TEXT_WHITE`, `x: 8.220, y: 1.500`.
     - Body: `"Historical context can be difficult to access while you are actually standing at the monument."`, Calibri 11pt, `C.TEXT_MUTED`, `x: 8.220, y: 1.820, w: 4.100, h: 0.800`.
   - Card 2: `y: 2.950, h: 1.650`.
     - Number: `"02"`, Icon: Clock glyph `🕒`.
     - Title: `"VISITOR DETAILS ARE FRAGMENTED"`.
     - Body: `"Timings, entry fees and ticket information are not always easy to check beforehand."`.
   - Card 3: `y: 4.800, h: 1.650`.
     - Number: `"03"`, Icon: Audio glyph `ılı`.
     - Title: `"THE EXPERIENCE LACKS CONTEXT"`.
     - Body: `"Visitors depend on a guide, or simply look around without understanding the significance."`.
5. **Interactive Pin Callout Lines**:
   - 3 pins on the photo facade connecting to the left edge of each card (`x = 8.000"`):
     - Pin 1: `(x: 6.800, y: 1.925)` → line to `(x: 8.000, y: 1.925)`.
     - Pin 2: `(x: 6.400, y: 3.775)` → line to `(x: 8.000, y: 3.775)`.
     - Pin 3: `(x: 7.000, y: 5.625)` → line to `(x: 8.000, y: 5.625)`.

#### Discrepancy & Fix Checklist
- [x] Change kicker from `"01 / THE VISITOR FRICTION"` to `"02  —  THE PROBLEM"`.
- [x] Shift headline from top of left panel down to `y = 4.400"`.
- [x] Remove the middle caption card at `y = 3.050"`.
- [x] Remove the bottom synthesis card at `y = 6.360"`.
- [x] Standardize card titles to exact uppercase strings: `"INFORMATION IS SCATTERED"`, `"VISITOR DETAILS ARE FRAGMENTED"`, `"THE EXPERIENCE LACKS CONTEXT"`.

---

### Slide 3: The Solution (Spatial Map + 4 Zoom Cards + Cream UI Mockup)
*Reference file*: `reference_slide3_solution.png`

#### Visual Elements
1. **Background**: `0D0B09` with faint vertical cartographic grid lines at 1.8" intervals (`line: { color: '1C1916', width: 0.5 }`).
2. **Top Header**:
   - Section label: `"03  —  THE SOLUTION"`, `x: 0.800, y: 0.500, w: 4.000, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3`.
   - Main Headline: `"WHAT IF THE MAP\nCOULD TELL THE STORY?"`, `x: 0.800, y: 0.800, w: 6.800, h: 0.950`, Cambria 34pt bold, `C.TEXT_WHITE`.
   - Subtitle: `"Explore India's monuments through one map-first experience."`, `x: 0.800, y: 1.800, w: 6.800, h: 0.280`, Calibri 12.5pt, `C.TEXT_CREAM`.
3. **Top-Right Tagline**:
   - `"One map.\nEvery monument.\nOne tap away."`, `x: 8.000, y: 0.520, w: 4.533, h: 1.100`, Cambria 24pt bold italic, `C.GOLD`, right-aligned.
4. **Left Zone: Map Container & 4 Zoom Steppers**:
   - Outer frame: `x: 0.800, y: 2.250, w: 6.600, h: 4.750`, fill: `1A1714`, line: `2E2A25`, rectRadius: 0.08.
   - Top-left: `"HERODOTUS  /  NATIONAL VIEW"`, Calibri 8.5pt bold, `C.TEXT_MUTED`.
   - Top-right: `"ZOOM LV 04  ·  20.59° N  78.96° E"`, Calibri 8.5pt, `C.TEXT_MUTED`, right-aligned.
   - Map Graphic: `IMG_HERITAGE_MAP`, `x: 1.000, y: 2.650, w: 3.700, h: 3.800`.
   - Concentric Reticle at Amer/Jaipur: `cx: 2.300, cy: 3.850`.
   - 4 Zoom-Level Cards (Right column of map container):
     - `x: 4.900, w: 2.300, h: 0.880` each.
     - Card 1 (`y: 2.650`): `"01"`, `"INDIA"`, thumbnail of national map.
     - Card 2 (`y: 3.600`): `"02"`, `"RAJASTHAN"`, thumbnail of state outline.
     - Card 3 (`y: 4.550`): `"03"`, `"JAIPUR"`, grid/coordinates thumbnail.
     - Card 4 (`y: 5.500`): `"04"`, `"MONUMENT"`, Amer Fort thumbnail, highlighted with gold border.
   - Dashed connector line from Card 04 curving towards right UI card.
   - Bottom label: `"MONUMENT PINS  ·  SELECTED: AMER FORT"`, `x: 1.000, y: 6.650`.
5. **Right Zone: Amer Fort Interactive UI Card (Mockup)**:
   - Outer container: `x: 7.800, y: 2.250, w: 4.733, h: 4.750`.
   - Top Photo Strip: `IMG_HERO_MONUMENT`, `x: 7.800, y: 2.250, w: 4.733, h: 1.450`, cover, top rounded corners.
     - Badges on photo: "+2" thumbnail box bottom-left, "RECORD IN RJ-014" bottom-right.
   - Cream UI Surface: `x: 7.800, y: 3.700, w: 4.733, h: 3.300`, fill: `F5F0E8`, line: `D9D0C3`, rectRadius: 0.06.
     - Pill Badge: `"UNESCO · HILL FORTS OF RAJASTHAN"`, `x: 8.020, y: 3.820, w: 2.400, h: 0.220`.
     - Title: `"AMER FORT"`, Cambria 24pt bold, `0D0B09`, `x: 8.020, y: 4.080`.
     - Coords: `"AMER, JAIPUR · RAJASTHAN  |  26.9855°N 75.8513°E"`, Calibri 8.5pt, `666666`.
     - Description: `"Hill fort above Maota Lake, begun in 1592 under Raja Man Singh I of Amer."`, Calibri 10.5pt, `2E2A25`.
     - Audio Player Box: `x: 8.020, y: 5.120, w: 4.300, h: 0.700`, fill: `1A1714`, line: `C69214`, rectRadius: 0.05.
       - Gold Play circle with white/dark triangle.
       - Label: `"PLAY AUDIO GUIDE"`, gold 8pt bold.
       - Audio waveform visualizer: `IMG_AUDIO_WAVEFORM` or native bars (`w: 2.200, h: 0.250`).
       - Time & TTS: `"00:42 / 02:14"`, `"BROWSER TTS"`.
     - Logistics Row:
       - `"TIMINGS: 08:00 — 18:00"`, Calibri 11pt bold, black.
       - `"ENTRY FEE: ₹200 IND / ₹1,000 INTL"`, Calibri 11pt bold, black.
     - Bottom Buttons:
       - `"VIEW TICKETS"`, `x: 8.020, y: 6.450, w: 2.050, h: 0.380`, fill: `1A1714`, white bold text.
       - `"GET DIRECTIONS ›"`, `x: 10.270, y: 6.450, w: 2.050, h: 0.380`, fill: `FFFFFF`, line: `2E2A25`, dark bold text.

#### Discrepancy & Fix Checklist
- [x] Replace the 2-column text comparison cards with the Map + 4 Zoom Cards frame on the left.
- [x] Remove the full-width `"PARADIGM SHIFT"` banner.
- [x] Build the rich Amer Fort cream UI card with photo header, audio player, timings, and buttons on the right.
- [x] Position the gold italic Cambria tagline in the upper right.

---

### Slide 4: Product Experience (Browser Chrome + Vertical 4-Step Journey)
*Reference file*: `reference_slide4_product.png`

#### Visual Elements
1. **Background**: `0D0B09` with faint cartographic grid lines.
2. **Top Header**:
   - Section label: `"04  —  PRODUCT EXPERIENCE"`, `x: 0.800, y: 0.500, w: 4.500, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3`.
   - Headline: `"FROM MAP TO MONUMENT IN SECONDS."`, `x: 0.800, y: 0.800, w: 8.000, h: 0.450`, Cambria 34pt bold, `C.TEXT_WHITE`.
   - Top-Right Flow Breadcrumb: `"MAP  →  MONUMENT  →  STORY  /  →  AUDIO  →  VISITOR INFO"`, `x: 8.000, y: 0.500, w: 4.533, h: 0.450`, Calibri 9pt bold, `C.TEXT_MUTED`, `charSpacing: 2`, right-aligned.
3. **Left Zone: Browser Mockup Frame**:
   - Window: `x: 0.800, y: 1.550, w: 7.800, h: 5.350`, fill: `141210`, line: `2E2A25`, rectRadius: 0.08, shadow.
   - Window Chrome: 3 traffic dots at `x: 1.000, 1.150, 1.300, y: 1.700`, URL pill at `x: 3.000, y: 1.630, w: 3.400, h: 0.220` with `"herodotus.app/explore"`.
   - In-App Nav: `"HERODOTUS"` logo, search bar (`"🔍 Search a monument..."`), filter chips (`"ALL ERAS"`, `"FORTS"`, `"TEMPLES"`), and record counter (`"36 RECORDS"`).
   - In-App Map: India map outline with Amer pin and dashed connector to popup card. Zoom controls (`+`, `-`, `500 KM`) at bottom-left.
   - Popup Modal Detail Card: Overlapping right side of map inside the browser (`x: 4.300, y: 2.450, w: 4.000, h: 4.200`):
     - Photo header of Amer Fort.
     - Cream UI body with title, audio player box, timings, and action buttons.
4. **Right Zone: 4-Step Vertical Journey**:
   - Width: `3.533"`, Left: `x = 9.000"`.
   - Step 1 (`y: 1.750, h: 0.850`): `"01"` (gold), `"ZOOM"` (white bold 16pt), search icon top-right. Body: `"Explore India and locate a monument."`.
   - Step 2 (`y: 2.750, h: 0.850`): `"02"`, `"TAP"`, pin icon top-right. Body: `"Open its story, photos and visitor information."`. Gold connector line from browser to Step 02.
   - Step 3 (`y: 3.750, h: 0.850`): `"03"`, `"LISTEN"`, audio waveform icon top-right. Body: `"Hear its history through browser-based narration."`.
   - Step 4 (`y: 4.750, h: 0.850`): `"04"`, `"PLAN"`, ticket icon top-right. Body: `"Check timings, fees, tickets and directions."`.
5. **Bottom-Right Reserved Card**:
   - `x: 8.900, y: 5.750, w: 3.633, h: 1.400`, fill: `1A1714`, line: `{ color: C.GOLD, width: 1, dashType: 'dash' }`, rectRadius: 0.08.
   - Kicker: `"RESERVED  /  LIVE PROTOTYPE"`, gold caps 9pt bold, image icon top-right.
   - Title: `"ACTUAL HERODOTUS APP SCREENSHOT"`, white bold 12pt.
   - Description: `"The interface on the left is a design mockup. The build capture replaces this panel before demo."`, Calibri 9.5pt, `C.TEXT_CREAM`.

#### Discrepancy & Fix Checklist
- [x] Replace shallow browser frame with large vertical browser mockup window.
- [x] Remove the woman with phone photo card (`IMG_PHONE_AUDIO`).
- [x] Convert bottom 4 horizontal ribbon cards into right-side 4 vertical journey steps.
- [x] Add the bottom-right dashed gold `"RESERVED / LIVE PROTOTYPE"` card.

---

### Slide 5: Technical Feasibility (5-Step Horizontal Flow + STRETCH/NEXT)
*Reference file*: `reference_slide5_tech.png`

#### Visual Elements
1. **Background**: `0D0B09` with `IMG_TECH_JALI` stone jali lattice at 92% transparency.
2. **Top Header**:
   - Section label: `"05  —  TECHNICAL FEASIBILITY"`, `x: 0.800, y: 0.500, w: 4.500, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3`.
   - Headline:
     - Line 1: `"SIMPLE ARCHITECTURE."`, Cambria 34pt bold, `C.TEXT_WHITE`.
     - Line 2: `"POWERFUL EXPERIENCE."`, Cambria 34pt bold, `C.GOLD`.
     - Position: `x: 0.800, y: 0.800, w: 8.000, h: 0.950`.
3. **Top-Right Badge**:
   - Box: `x: 9.800, y: 0.520, w: 2.733, h: 0.300`, line: `C.GOLD`, fill: `1A1714`, rectRadius: 0.04.
   - Text: `"MVP-FIRST ARCHITECTURE"`, gold caps 8.5pt bold.
   - Subhead below box: `"No complicated backend is required for the MVP."`, `C.TEXT_CREAM`, 9.5pt, right-aligned.
4. **Center: 5-Step Horizontal Flow**:
   - 5 cards across slide:
     - Width: `1.700"`, Height: `2.200"`, `y = 2.200"`.
     - Gap: `0.350"`.
     - X positions: `0.800"`, `2.850"`, `4.900"`, `6.950"`, `9.000"`.
   - Each card contains:
     - Square icon box at top: `w: 1.000, h: 1.000`, fill: `0D0B09`, line: `C.GOLD`, rectRadius: 0.06.
       - Step 1: Smartphone with screen dot.
       - Step 2: Map grid with pin ("TILES · PINS · Z").
       - Step 3: Speaker with audio waves ("TEXT → SPEECH").
       - Step 4: Data spreadsheet grid ("SHEET → JSON").
       - Step 5: Web browser with chart ("STATIC HOSTING").
     - Number: `"01"`, `"02"`, `"03"`, `"04"`, `"05"` (gold 9.5pt bold, centered).
     - Title: `"USER"`, `"MAP"`, `"STORY"`, `"DATA"`, `"WEB"` (white bold 15pt, centered).
     - Description: `"Mobile browser"`, `"Google Maps JS API"`, `"Browser Web Speech API"`, `"Lightweight JSON data"`, `"Vercel / GitHub Pages"` (muted 8.5pt, centered).
   - Gold dashed arrows between each card (`--->`).
   - Vertical drop lines from each card down to the baseline at `y = 4.900"`.
5. **Right of Flow (Next to Step 5)**:
   - Panel at `x: 11.000, y: 2.200, w: 1.733, h: 2.400`:
     - `"WHY IT SHIPS"`, gold caps 9.5pt bold.
     - Body: `"Every layer is an existing browser or platform capability. The monument dataset starts as a spreadsheet and exports to JSON — so content can grow without touching the code."`.
     - `"DEPLOY SURFACE"`, muted gold caps 8.5pt.
     - `"Static site, any modern browser"`, white bold 12pt.
6. **Lower Section (STRETCH / NEXT)**:
   - Horizontal baseline rule at `y = 4.900"`.
   - Text on rule: `"EXISTING, PROVEN BUILDING BLOCKS  —  NO CUSTOM SERVER, NO DATABASE LAYER IN THE MVP"`.
   - Left: `"STRETCH / NEXT"` (gold caps 10pt bold) + `"Not implemented. Explored after MVP."` (`x: 0.800, y: 5.500`).
   - 3 Stretch Feature Cards (`w: 2.850, h: 0.650, y: 5.550`):
     - Card 1 (`x: 3.200`): `"3D MAP EXPERIENCES"`, dashed border, cream text.
     - Card 2 (`x: 6.350`): `"MULTI-LANGUAGE AUDIO"`, dashed border, cream text.
     - Card 3 (`x: 9.500`): `"SEARCH & FILTERS"`, dashed border, cream text.

#### Discrepancy & Fix Checklist
- [x] Replace dense bullet lists with iconic square glyph boxes and clean titles.
- [x] Add gold dashed connecting arrows and vertical drop lines.
- [x] Add the "WHY IT SHIPS" explanation block and "DEPLOY SURFACE" card on the right.
- [x] Replace the 3 metric cards at bottom with the STRETCH/NEXT section and 3 dashed future cards.

---

### Slide 6: Impact & Value (3-Pillar Timeline + Description Columns)
*Reference file*: `reference_slide6_impact.png`

#### Visual Elements
1. **Background**: `0D0B09` with faint gateway/monument silhouette blended in background right. NO foreground photo.
2. **Top Header**:
   - Section label: `"06  —  IMPACT & VALUE"`, `x: 0.800, y: 0.500, w: 4.500, h: 0.250`, Calibri 10pt bold, `C.GOLD`, `charSpacing: 3`.
   - Headline:
     - Line 1: `"THREE THINGS."`, Cambria 34pt bold, `C.TEXT_WHITE`.
     - Line 2: `"ONE EXPERIENCE."`, Cambria 34pt bold, `C.GOLD`.
     - Position: `x: 0.800, y: 0.800, w: 6.800, h: 0.950`.
   - Top-Right Tagline: `"Discovery, storytelling and\nvisitor planning in one flow."`, Cambria 20pt bold italic, `C.GOLD`, right-aligned.
3. **Center Timeline**:
   - Gold dashed timeline rule at `y = 1.950"`.
   - 3 concentric circular pin rings (`(o)`) placed above the center of each card (`x = 1.600"`, `x = 5.640"`, `x = 9.680"`).
4. **3 Large Value Cards**:
   - Width: `3.650"`, Height: `1.850"`, `y = 2.150"`.
   - Gap: `0.390"`.
   - X positions: `0.800"`, `4.840"`, `8.880"`.
   - Fill: `1A1714`, line: `2E2A25`, rectRadius: 0.08, shadow.
   - Card 1:
     - Number: `"01"` (gold 11pt bold).
     - Title: `"DISCOVER"` (white bold 28pt).
     - Subhead: `"See where history is."` (cream 13pt).
     - Icon top-right: Map grid box with gold location pin.
     - Bottom label inside card: `"MAP · LOCATION PIN"`.
   - Card 2:
     - Number: `"02"`.
     - Title: `"UNDERSTAND"` (white bold 28pt).
     - Subhead: `"Hear why it matters."` (cream 13pt).
     - Icon top-right: Speaker circle with waveform bars.
     - Bottom label inside card: `"AUDIO NARRATION · LISTEN"`.
   - Card 3:
     - Number: `"03"`.
     - Title: `"PLAN"` (white bold 28pt).
     - Subhead: `"Know what to do next."` (cream 13pt).
     - Icon top-right: Ticket with curved dashed path & pin.
     - Bottom label inside card: `"ROUTE · TICKETS · VISITOR INFO"`.
5. **3 Description Columns Below Cards**:
   - Aligned directly under each card (same x coordinates and `3.650"` width):
   - Position: `y = 4.250, h: 1.250`.
   - Column 1 (`x: 0.800`): `"TOURISM & HERITAGE"` (gold caps 10pt bold) + `"Makes monument discovery and historical context easier to access."` (cream 12pt).
   - Column 2 (`x: 4.840`): `"INDEPENDENCE"` (gold caps 10pt bold) + `"Brings map, story and practical visitor information together, instead of forcing visitors to piece them together."` (cream 12pt).
   - Column 3 (`x: 8.880`): `"ACCESSIBILITY"` (gold caps 10pt bold) + `"Audio narration offers another way to experience heritage for visitors who prefer listening, and can support accessibility needs."` (cream 12pt).
6. **Bottom Statement & Coordinates**:
   - Statement: `"HERODOTUS CONNECTS DISCOVERY, STORYTELLING\nAND VISITOR PLANNING IN ONE MAP-FIRST EXPERIENCE."`, `x: 0.800, y: 5.850, w: 9.000, h: 0.650`, Cambria/Calibri 15pt bold, `C.TEXT_WHITE`.
   - GPS Coordinates: `"26.2967°N 73.0182°E"`, `x: 10.000, y: 6.050, w: 2.533, h: 0.250`, Calibri 9pt, `C.TEXT_MUTED`, right-aligned.

#### Discrepancy & Fix Checklist
- [x] Remove the half-bleed family photo (`IMG_FAMILY`) and testimonial card.
- [x] Construct the 3-pillar horizontal timeline with circular pins above DISCOVER / UNDERSTAND / PLAN.
- [x] Enlarge card headers to 28pt bold.
- [x] Place 3 matching description blocks below the cards.
- [x] Add the bottom summary statement banner and coordinates.

---

### Slide 7: Closing & Vision (Stone Sculpture Split + QR Code Box)
*Reference file*: `reference_slide7_closing.png`

#### Visual Elements
1. **Split Composition**:
   - Left ~52%: Solid dark background `0D0B09` (`x: 0 to 6.200"`).
   - Right ~48%: Close-up macro photo of stone sculpture / carved chariot wheel (`IMG_VISITOR` or `IMG_CLOSING`), `x: 6.200, y: 0, w: 7.133, h: 7.500`, cover.
   - Left-edge vignette overlay on photo: `x: 6.200, y: 0, w: 3.500, h: 7.500`, fill: `0D0B09`, transparency: 30%, smoothly fading photo into dark canvas.
2. **Letterbox Bars**:
   - Top: `x: 0, y: 0, w: 13.333, h: 0.400`, fill: `000000`.
   - Bottom: `x: 0, y: 7.100, w: 13.333, h: 0.400`, fill: `000000`.
3. **Header Line**:
   - Left: `"IDEA FORGE 2026  —  PITCH-A-THON"`, `x: 0.800, y: 0.480, w: 4.500, h: 0.250`, Calibri 9.5pt bold, `C.GOLD`, `charSpacing: 3`.
   - Thin gold rule below: `x: 0.800, y: 0.720, w: 11.733, h: 0`, line: `{ color: C.GOLD, width: 0.75 }`.
4. **Left Content**:
   - Giant Serif Headline:
     - Line 1: `"HISTORY IS EVERYWHERE."`, Cambria 46pt bold, `C.TEXT_WHITE`.
     - Line 2: `"NOW, IT CAN SPEAK."`, Cambria 46pt bold, `C.GOLD`.
     - Position: `x: 0.800, y: 2.000, w: 6.500, h: 1.500`.
   - Short divider rule: `x: 0.800, y: 3.750, w: 2.200, h: 0`, line: `{ color: C.GOLD, width: 1.2 }`.
   - Brand Title: `"HERODOTUS"`, `x: 0.800, y: 4.050, w: 5.500, h: 0.450`, Calibri 30pt bold, `C.TEXT_WHITE`.
   - Brand Subtitle: `"EXPLORE.  LISTEN.  DISCOVER."`, `x: 0.800, y: 4.550, w: 5.500, h: 0.250`, Calibri 12pt bold, `C.TEXT_CREAM`, `charSpacing: 3`.
5. **Curved Diagonal Gold Connector & GPS**:
   - Origin pin `(o)` at bottom-left: `cx: 0.800, cy: 5.850`.
   - Curved dashed line arcing gently across to the chariot wheel hub at `x: 10.500, y: 3.500`.
   - Hub label: `"15.3350° N · 76.4600° E\nHAMPI, KARNATAKA"`, `x: 10.000, y: 3.250, w: 2.533, h: 0.400`, Calibri 9pt bold, `C.TEXT_MUTED`, right-aligned.
6. **Bottom-Right QR Code Demo Box**:
   - Prompt text: `"Try the prototype\nfrom your phone."`, `x: 8.200, y: 5.600, w: 2.400, h: 0.450`, Calibri 11pt, `C.TEXT_CREAM`, right-aligned.
   - QR Code Box: `x: 10.800, y: 5.250, w: 1.700, h: 1.650`, fill: `1A1714`, line: `{ color: C.GOLD, width: 1, dashType: 'dash' }`, rectRadius: 0.06.
   - Stylized QR graphic inside.
   - Bottom label: `"SCAN · LIVE DEMO"`, `x: 10.800, y: 6.550, w: 1.700, h: 0.220`, Calibri 8.5pt bold, `C.GOLD`, `charSpacing: 2`, centered.
7. **Bottom-Left Branding**:
   - `"TEAM HERODOTUS"`, `x: 0.800, y: 6.250, w: 3.500, h: 0.220`, Calibri 9.5pt bold, `C.GOLD`, `charSpacing: 3`.
   - `"A MAP-FIRST DIGITAL HERITAGE EXPERIENCE"`, `x: 0.800, y: 6.500, w: 4.500, h: 0.220`, Calibri 9pt, `C.TEXT_MUTED`, `charSpacing: 2`.

#### Discrepancy & Fix Checklist
- [x] Replace full-bleed twilight gateway with the split stone sculpture layout.
- [x] Remove the 3 value anchor cards and massive central CTA box.
- [x] Left-align the giant 46pt Cambria headline ("HISTORY IS EVERYWHERE. / NOW, IT CAN SPEAK.").
- [x] Add the curved diagonal connector line to Hampi GPS coordinates.
- [x] Add the dashed gold QR code placeholder box ("SCAN · LIVE DEMO").

---

## 4. Technical pptxgenjs Best Practices & Footgun Prevention

To guarantee that the generated presentation complies strictly with ECMA-376 OpenXML schema, opens without repair prompts in Microsoft PowerPoint and Keynote, and validates cleanly via `validate.py`:

| Rule | Technical Description | Risk if Violated |
|---|---|---|
| **Canvas Layout Setting** | `pres.layout = 'LAYOUT_WIDE'` must be invoked before adding any slide. | Canvas defaults to 10" × 5.625", truncating widescreen content off-slide. |
| **Color Value Formats** | Hex colors strictly 6 digits without `#` (e.g. `'C69214'`). Never use 8-digit hex or bake alpha into color strings. | Produces invalid XML schema (`srgbClr`), corrupting the PPTX. |
| **Object Immutability** | Never reuse option objects across `addShape`, `addText`, or `addImage` calls. Create fresh object literals or factory functions. | `pptxgenjs` mutates coordinate values in-place into EMUs on first write. Subsequent elements collapse to zero size. |
| **Shadow Geometry** | `offset` must always be $\ge 0$. Use `angle: 270` for upward shadows. | Negative offsets violate DrawingML schema, throwing PowerPoint repair errors. |
| **Kerning Option** | Use `charSpacing: N` (never `letterSpacing`). | `letterSpacing` is silently ignored, losing intended typographic tracking. |
| **Shape Radii Constraints** | `rectRadius` is valid **only** on `pres.shapes.ROUNDED_RECTANGLE`. | Setting `rectRadius` on `RECTANGLE` generates invalid XML elements. |
| **Text Padding Discipline** | Set `margin: 0` on text boxes when aligning text with shapes, pins, or lines. | Default 0.1" internal padding causes visible misalignment. |
| **Font Portability** | Stick strictly to safe universal pairings: `Cambria` (serif headlines) and `Calibri` (sans body/labels). | Uninstalled fonts trigger erratic font substitution and text clipping. |
| **Design Rule: No Accent Lines** | Never attach accent lines directly under slide titles. Use standalone dividing rules or background contrast. | Accent lines directly under titles flag the presentation as amateur AI-generated. |
| **Design Rule: No Edge Stripes** | Never add vertical or horizontal colored stripes along card edges. Use full borders (`CARD_BORDER`) or subtle fills. | Card edge stripes read as clinical AI template filler. |

---

## 5. Architectural Implementation Blueprint for the Implementer

The implementer can structure `generate_deck.js` cleanly with reusable component builders:

```javascript
// Example component factories to implement in generate_deck.js:
function addLetterboxBars(slide, pres) { ... }
function addHeaderKicker(slide, kickerText, gpsText) { ... }
function addConcentricPin(slide, pres, cx, cy, opts) { ... }
function addDashedConnector(slide, pres, x1, y1, x2, y2) { ... }
function addDarkCard(slide, pres, x, y, w, h, opts) { ... }
function addAmerFortCreamCard(slide, pres, x, y, w, h) { ... }
function addBrowserMockup(slide, pres, x, y, w, h) { ... }
function addQRCodeCard(slide, pres, x, y, w, h) { ... }
```

### Presentation Flow Integration
The 7 slides directly implement the 7 reference slides:
1. **Cover** (`reference_slide1_cover.png`)
2. **The Problem** (`reference_slide2_problem.png`)
3. **The Solution** (`reference_slide3_solution.png` — covers Innovation & Originality)
4. **Product Experience** (`reference_slide4_product.png` — covers Presentation & Clarity)
5. **Technical Feasibility** (`reference_slide5_tech.png` — covers Feasibility & Technical Viability)
6. **Impact & Value** (`reference_slide6_impact.png` — covers Impact & Social Relevance)
7. **Closing & Vision** (`reference_slide7_closing.png`)

*(Note for Business Model & Scalability: In a 7-slide deck, monetization and scalability are naturally embedded in the technical and value narratives, and documented thoroughly in the speaker notes of Slides 5 and 6. If an 8th slide is desired, it can be styled using Pattern D or the 3-pillar layout of Slide 6).*
