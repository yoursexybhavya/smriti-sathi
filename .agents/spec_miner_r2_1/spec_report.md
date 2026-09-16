# Specification Report: Herodotus Pitch Deck Redesign
**Author**: `spec_miner_r2_1`  
**Timestamp**: 2026-09-15T01:42:00Z  
**Project**: Herodotus — Historical Monument Virtual Audio & Fact Guide (IDEA FORGE 2026 Pitch-A-Thon)  
**Target File**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`  
**Generator Script**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`

---

## 1. Executive Summary & Context

### 1.1 Objective
Transform the existing native-editable pptxgenjs pitch deck for **Herodotus** from a sterile, AI-generated appearance into a **warm, human, editorial presentation** that feels crafted by an experienced editorial designer.

### 1.2 Evolution from Round 1 to Round 2
- **Round 1 (Initial Request — 2026-09-15T00:28:41Z)**: Solved the editability crisis by rebuilding rasterized PNG slides from scratch into native PowerPoint objects using `pptxgenjs` (widescreen 16:9, mixed sandwich theme, 5 judging criteria, speaker notes).
- **Round 2 (Follow-up Request — 2026-09-15T01:38:07Z)**: Fixes the "AI-generated look". The current deck suffers from:
  1. Content slides that are mostly flat white (`FFFFFF` / `F8F9FC`) with cold geometric shapes.
  2. Sparse photography (images on only 3–4 slides; slides 3, 5, 6 completely devoid of photos).
  3. Rigid, uniform rectangular grids and clinical symmetrical spacing.
  4. Lack of atmospheric depth, texture, and cultural warmth.
  5. Competent but soulless typography lacking editorial drama and scale contrast.

### 1.3 Core Mandate
1. **Photography on EVERY Slide**: All 8 slides must feature embedded heritage photography.
2. **Utilize ALL 9 Available Images**: Verify paths and distribute all 9 images across the deck.
3. **Warm, Human, Editorial Visual Design**: Warm heritage palette (`C69214`, `D4A574`, terracotta accents, `F5F3EF` subtle background), asymmetric layouts (60/40 splits, offset cards), serif headline warmth (`Cambria` 44–48pt), and dramatic typographic scale.
4. **Preserve Full Content & Editability**: Keep all 8 slides, all 5 official judging criteria, all speaker notes, stats, and ensure 100% native editable text boxes and shapes.
5. **Zero Technical Violations**: Comply with all pptxgenjs rules, zero accent lines under titles, zero decorative color bars/stripes, margins $\ge 0.5"$, and pass `office/validate.py` with zero errors.

---

## 2. Image Asset Catalog & Distribution Strategy

All 9 images have been physically inspected on disk in `.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48`. Every image is an RGB JPEG with dimensions $1376 \times 768$ (1.792 aspect ratio, natively widescreen compatible).

### 2.1 Complete Image Inventory
| # | Image Asset Name | Full Path | Dim / Ratio | Description & Visual Tone | Recommended Placement & Technique |
|---|------------------|-----------|-------------|---------------------------|-----------------------------------|
| 1 | `hero_monument` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg` | 1376×768 (1.792) | Amer Fort at sunset, golden stone ramparts, warm dramatic sky | **Slide 1 (Cover)**: Full-bleed background ($13.333" \times 7.5"$) with dark navy/charcoal overlay shape (`transparency: 32`) |
| 2 | `heritage_problem_scene` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/heritage_problem_scene_1789435962154.jpg` | 1376×768 (1.792) | Frustrated tourist standing before faded, eroded ASI signboard | **Slide 2 (The Problem)**: Asymmetric half-bleed left ($5.6" \times 7.5"$) anchoring visitor friction |
| 3 | `phone_audio_guide` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/phone_audio_guide_1789436084142.jpg` | 1376×768 (1.792) | Woman holding smartphone with earbuds at ancient fort arcade | **Slide 3 (Innovation & Originality)**: Inset hero photo ($4.6" \times 3.2"$) showing human product usage alongside paradigm comparison |
| 4 | `india_heritage_map` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg` | 1376×768 (1.792) | Dark cartographic vector map of India with clustered glowing monument pins | **Slide 4 (Product Demo)**: Embedded mock UI screen ($4.8" \times 5.2"$) inside mobile PWA device container |
| 5 | `tech_architecture_warm` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/tech_architecture_warm_1789436115529.jpg` | 1376×768 (1.792) | Intricate Rajasthani stone jali lattice with warm sunlight filtering through | **Slide 5 (Feasibility & Tech)**: Full-bleed semi-transparent background ($13.333" \times 7.5"$, `transparency: 88`) providing architectural texture behind stack cards |
| 6 | `human_traveler_heritage` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg` | 1376×768 (1.792) | Solo traveler walking through grand palace courtyard with stone pillars | **Slide 4 (Product Demo)** or **Slide 6 (Business Model)**: Horizontal editorial photo strip ($11.73" \times 1.3"$) or inset card |
| 7 | `indian_family_heritage` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg` | 1376×768 (1.792) | Indian grandfather and grandson smiling together at ancient stone temple | **Slide 7 (Impact & Social Relevance)**: Asymmetric half-bleed left ($5.2" \times 7.5"$) with warm quote callout overlay |
| 8 | `closing_monument` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg` | 1376×768 (1.792) | Grand illuminated fort gateway at twilight with warm uplighting | **Slide 8 (Closing / Vision)**: Full-bleed background ($13.333" \times 7.5"$) with dark overlay shape (`transparency: 30`) |
| 9 | `visitor_monument` | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg` | 1376×768 (1.792) | Visitor dwarfed beneath soaring stone temple archway | **Slide 6 (Business Model & Scalability)**: Inset editorial visual ($4.2" \times 4.6"$) balancing 3 monetization tiers & scaling roadmap |

### 2.2 Slide-by-Slide Photo Distribution Matrix
| Slide # | Slide Title | Primary Image Asset | Integration Technique | Dimensions / Placement | Secondary Image (if applicable) |
|---|---|---|---|---|---|
| **1** | Cover / Title | `hero_monument` (Amer Fort) | Full-bleed background + dark overlay | $13.333" \times 7.5"$ at $(0,0)$ | — |
| **2** | The Problem | `heritage_problem_scene` (ASI Signboard) | Half-bleed left composition | $5.6" \times 7.5"$ at $(0,0)$ | — |
| **3** | Innovation & Originality | `phone_audio_guide` (Woman with phone) | Inset editorial photo | $4.4" \times 3.2"$ at $(8.1", 1.8")$ | — |
| **4** | Product Experience / Demo | `india_heritage_map` (Map screen) | Embedded mock app canvas | $4.8" \times 4.6"$ at $(0.8", 1.8")$ | `human_traveler_heritage` (Photo strip / contextual inset) |
| **5** | Feasibility & Tech Viability | `tech_architecture_warm` (Stone jali) | Semi-transparent background | $13.333" \times 7.5"$ at $(0,0)$, `transparency: 88` | — |
| **6** | Business Model & Scalability | `visitor_monument` (Temple archway) | Right-hand editorial inset | $4.2" \times 4.6"$ at $(8.3", 1.8")$ | — |
| **7** | Impact & Social Relevance | `indian_family_heritage` (Family) | Half-bleed left composition | $5.2" \times 7.5"$ at $(0,0)$ | — |
| **8** | Closing / Vision | `closing_monument` (Fort gateway) | Full-bleed background + dark overlay | $13.333" \times 7.5"$ at $(0,0)$ | — |

*Result: Every single one of the 8 slides has photography; all 9 images are meaningfully integrated.*

---

## 3. Visual Design System: Warm, Human, Editorial

### 3.1 Color Palette Tokens
All colors are strict 6-digit hex values without `#` prefix (per pptxgenjs rules).

```javascript
const PALETTE = {
  // Heritage Warm Accent Tones
  GOLD: 'C69214',           // Primary heritage gold (warm, refined, not neon yellow)
  GOLD_DEEP: 'A1730B',      // Darker gold for text emphasis / borders
  GOLD_LIGHT: 'F4E6C3',     // Muted gold tint for pill fills and subtle tags
  SANDSTONE: 'D4A574',      // Warm architectural sandstone (secondary tone)
  SANDSTONE_LIGHT: 'F7F0E6',// Ultra-soft sandstone card fill
  
  // Earth & Terracotta Accents
  TERRACOTTA: 'C2410C',     // Rich terracotta for critical alerts/stats
  TERRACOTTA_DARK: '9A3412',// Dark terracotta for high-contrast text
  TERRACOTTA_TINT: 'FEE2E2',// Soft terracotta highlight
  
  // Neutral Canvas & Surface Colors
  WARM_CANVAS: 'F5F3EF',    // Editorial off-white / warm subtle gray (REPLACES pure FFFFFF)
  CARD_BG: 'FAF8F5',        // Warm card background (distinct from canvas)
  CARD_BORDER: 'E6DFD5',    // Soft warm border line
  
  // Dark Slides (Cover & Closing)
  DARK_BG: '161A30',        // Deep nocturnal navy/charcoal base
  DARK_OVERLAY: '121629',   // Overlay color for full-bleed photos (transparency: 28-35)
  DARK_CARD: '1F243E',      // Translucent or dark container card
  DARK_BORDER: '31385C',    // Dark card border
  DARK_MUTED: 'D6D9E6',     // Off-white muted text for dark slides
  
  // Typography Neutral Tones
  TEXT_HEADLINE: '1B223C',  // Deep charcoal/navy for maximum headline contrast
  TEXT_BODY: '3D4351',      // Warm slate/charcoal for body reading
  TEXT_MUTED: '6E7587',     // Secondary captions and metadata
  WHITE: 'FFFFFF'           // Clean white for dark slide text & select cards
};
```

### 3.2 Typography Rules
| Hierarchy Level | Font Face | Size | Weight | Line Spacing / Margin | Purpose |
|---|---|---|---|---|---|
| **Slide Title (Hero / Editorial)** | `Cambria` | 40–48pt | Bold | `margin: 0` | Emotional serif headline; magazine editorial feel |
| **Slide Subtitle / Kicker** | `Calibri` | 13–15pt | Regular / Semibold | `charSpacing: 1.5` | Contextual sub-heading or category tag |
| **Section / Card Header** | `Cambria` or `Calibri` | 18–22pt | Bold | `margin: 0` | Pillar titles, layer names, stream headers |
| **Body Text** | `Calibri` | 13–15pt | Regular | `margin: 0` | Narrative prose, bullet descriptions |
| **Stat Callout Number** | `Cambria` | 44–64pt | Bold | `margin: 0` | Big impactful metrics (<350KB, 3,693, ₹0) |
| **Captions / Meta / Source** | `Calibri` | 10–12pt | Regular / Muted | `margin: 0` | Direct quotes, URLs, disclaimers, micro-labels |

### 3.3 Layout & Composition Rules
1. **Asymmetric 60/40 & 45/55 Splits**:
   - Replace symmetrical 50/50 or uniform 3-column equal boxes with offset proportions.
   - Slide 2: 42% left image half-bleed, 58% right content stack.
   - Slide 6: 62% left 3-tier monetization cards, 38% right vertical roadmap with photo inset.
   - Slide 7: 40% left family portrait with floating quote card, 60% right social impact pillars.
2. **Intentional Magazine White Space**:
   - Generous breathing room ($0.5"–0.8"$ edge margins, $0.3"–0.5"$ card gaps).
   - Anchor white space with photographic textures or warm background tint (`F5F3EF`).
3. **No Clinical AI Grids**:
   - Vary card heights and widths.
   - Use soft drop shadows (`blur: 4`, `offset: 2`, `opacity: 0.06`).
   - `rectRadius: 0.08` on rounded rectangles for tactile card edges.

---

## 4. Content Structure & Official Criteria Mapping

The deck strictly maintains all 8 slides and explicitly features all 5 official judging criteria:

```
Slide 1: Cover & Vision 
         [IDEA FORGE 2026 Pitch-A-Thon · Live Working MVP Ready]
Slide 2: The Visitor Friction 
         [The Problem: 3,693 Silent Monuments, Language Divide, Guide Monopoly]
Slide 3: Criterion 1 — Innovation & Originality 
         [Spatial-First Discovery vs Keyword Search, Zero-Friction PWA, Web Speech Audio]
Slide 4: Criterion 4 — Presentation & Clarity 
         [Interactive Product Experience: 4-Step Flow, Live Vercel Demo]
Slide 5: Criterion 2 — Feasibility & Technical Viability 
         [Lightweight Edge Architecture, Zero Server Audio Streaming Costs, <350KB Payload]
Slide 6: Criterion 5 — Business Model & Scalability 
         [3-Tier Monetization: B2G Partnerships, ₹49 Micro-Trans, Hyperlocal Commerce & Roadmap]
Slide 7: Criterion 3 — Impact & Social Relevance 
         [Democratizing Heritage for 1.4B Citizens, 3,500 Forgotten Sites, Accessibility]
Slide 8: Closing & Call to Action 
         ["History is everywhere. Now, it can speak." · Live Demo URL & Q&A Invitation]
```

### 4.1 Required Speaker Notes (Verbatim Pitch Delivery)
Every slide must feature a calibrated, timing-accurate speaker notes block attached via `slide.addNotes(...)`:
- **Slide 1**: Hook the judges with Amer Fort's 400-year history and introduce Herodotus' mission to give living stone a voice in every pocket.
- **Slide 2**: Emphasize the broken reality across 3,693 monuments—fragmented blogs, outdated tariffs, and guide monopolies.
- **Slide 3**: Explain the paradigm shift from keyword text boxes to spatial cartography and browser-native speech synthesis in mother tongues.
- **Slide 4**: Walk through the 10-second user journey from map zoom to instant audio playback.
- **Slide 5**: Highlight the technical brilliance: sub-350KB payload, zero server streaming bills, and 48-hour monument onboarding.
- **Slide 6**: Outline the 3 monetization engines (B2G affiliate, freemium micro-transactions, hyperlocal commerce) and expansion from Golden Triangle to 3,693 sites.
- **Slide 7**: Deliver the emotional punch: revitalizing 3,500 forgotten sites, generational cultural connection, and accessibility for non-readers and the visually impaired.
- **Slide 8**: Close strongly with the project vision, invite judges to test the live PWA on their own phones, and transition to Q&A.

---

## 5. pptxgenjs Technical Constraints & Prohibitions

| Constraint | Rule | Violation Consequence | Verification Method |
|---|---|---|---|
| **Canvas Layout** | `pres.layout = 'LAYOUT_WIDE'` before `addSlide()` | Defaults to 10"×5.625", clips elements past 10" | Code review & XML inspect |
| **Hex Code Format** | Strict 6-digit hex without `#` (e.g. `'C69214'`) | Hex `#` or 8-digit alpha corrupts PPTX archive | `validate.py` |
| **Option Object Immutability** | Fresh object per `add*` call; never reuse | PPTXGenJS mutates numbers into EMU in-place | Code review |
| **Image Transparency** | `slide.addImage({ transparency: 85-92 })` | None; native DrawingML alpha channel | Visual QA & `validate.py` |
| **Shape Transparency** | `slide.addShape(RECTANGLE, { fill: { color, transparency } })` | Negative or invalid format breaks DrawingML | `validate.py` |
| **Shadow Configuration** | `offset >= 0`, `opacity: 0.0-1.0` | Negative offset corrupts file | `validate.py` |
| **Kerning & Spacing** | Use `charSpacing`, never `letterSpacing` | `letterSpacing` silently ignored | Code review |
| **List Formatting** | `bullet: true`, `breakLine: true` (omit on last) | Missing breakLine runs together; literal bullet double-renders | Markitdown QA |
| **Rounded Rectangles** | `rectRadius` only on `ROUNDED_RECTANGLE` | Ignored on regular RECTANGLE | Schema validation |
| **Prohibited Decoration** | **NO accent lines under titles** | Flags presentation as "AI-generated" | Visual QA |
| **Prohibited Decoration** | **NO decorative color bars or accent stripes** | Hallmark AI filler; violates human editorial rule | Visual QA |
| **Slide Margins** | Minimum $0.5"$ from all outer edges | Cluttered, unprofessional edges | Visual QA |
| **Text Overflow** | Containers must provide 10-15% expansion slack | Text truncates or spills past shapes | Visual QA |

---

## 6. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Visual Architecture | Mixed Sandwich Theme with Photography | Cover and Closing slides use dark full-bleed photographic backgrounds with dark overlays; Content slides use warm off-white canvas (`F5F3EF`) with photographic depth | Widescreen slide definitions, image paths, overlay shapes | 8-slide structured PowerPoint presentation | Fails if solid flat navy or clinical pure white used | Follow-up spec § R2 |
| 2 | Asset Management | 9-Image Physical Asset Integration | Integration of all 9 verified heritage photographs across the 8 slides without omission | 9 local JPEG image paths ($1376 \times 768$) | Embedded DrawingML picture parts in PPTX | Missing images or broken paths crash build | Follow-up spec § Available Images & disk inspection |
| 3 | Visual Technique | Semi-Transparent Background Imagery | Embedding monument photos behind content slides using `transparency: 85-92` to provide subtle architectural texture | Image path, $x=0, y=0, w=13.333, h=7.5$, `transparency: 88` | Low-opacity background image layer behind text/cards | Transparency $>100$ or $<0$ breaks DrawingML | Follow-up spec § R1 & node test |
| 4 | Visual Technique | Half-Bleed Photographic Compositions | Images filling 40–50% of the slide width (left or right) alongside asymmetric content stacks | Image path, $w=5.2"-5.6", h=7.5"$, content card coordinates | High-impact split editorial layout | Improper width causes text overlap | Follow-up spec § R1 |
| 5 | Visual Technique | Full-Bleed Dark Monument Overlay | Full-bleed hero image covered with a semi-transparent dark rectangle (`transparency: 28-35`) to ensure high-contrast white/gold text readability | Image path, RECTANGLE shape, `fill: { color: '161A30', transparency: 32 }` | Atmospheric dark backdrop with crisp legible text | Overlay too dark hides photo; too light destroys text contrast | Follow-up spec § R2 & node test |
| 6 | Visual Technique | Editorial Inset Photos | Compact $3"-4.5"$ wide photograph cards placed alongside text or cards to eliminate clinical text density | Image path, $w=4.2", h=3.2"$, rounded border or card frame | Tactile editorial photo placement | Sizing without aspect lock distorts image | Follow-up spec § R1 |
| 7 | Color System | Warm Heritage Color Palette | Cohesive palette anchored in Heritage Gold (`C69214`), Sandstone (`D4A574`), Terracotta (`C2410C`), and Warm Canvas (`F5F3EF`) | 6-digit hex strings without `#` | Warm, human editorial visual tone | Hex with `#` corrupts PPTX archive | Follow-up spec § R2 |
| 8 | Typography | Serif Headline Warmth (`Cambria`) | Large 40–48pt `Cambria` headlines paired with 13–15pt `Calibri` body and 10–12pt captions for editorial personality | `fontFace: 'Cambria'`, `fontSize: 44`, `bold: true` | Human editorial typographic hierarchy | Missing system font falls back unreliably | Follow-up spec § R2 & pptx skill |
| 9 | Layout Design | Asymmetric Editorial Grid | Replacing uniform 50/50 grids with 60/40 and 45/55 splits and varied card heights | Calculated coordinates with unequal column widths | Organic, human-designed page rhythm | Miscalculated offsets cause container collision | Follow-up spec § R2 |
| 10 | Content Integrity | 5 Official Judging Criteria Badges | Explicit inclusion and prominent highlighting of all 5 hackathon judging criteria across slides 3–7 | Criteria names, numbering, pill shapes, gold/sandstone fills | Verifiable judging criteria compliance | Omitting any criterion violates hackathon rubrics | Original Request § R3 & markitdown audit |
| 11 | Content Integrity | 4-Step Interactive User Flow | Demonstration of PWA experience from national map to instant mother-tongue audio guide (Locate, Contextualize, Listen, Plan) | Step cards, app UI container, map image, waveform visual | Intuitive product demonstration | Text overflow on mobile mockup | Original Request § R3 & markitdown |
| 12 | Content Integrity | 3-Tier Monetization & Roadmap | Clear articulation of B2G partnerships, B2C freemium micro-transactions (₹49), and hyperlocal commerce with 3-phase national rollout | 3 stream cards + 3 roadmap phase blocks | Complete business viability demonstration | Text overcrowding in roadmap blocks | Original Request § R3 |
| 13 | Content Integrity | Social Impact & Accessibility Dossier | Explicit documentation of 3,500 forgotten monuments, mother-tongue audio inclusion, and accessibility for visually impaired citizens | Impact metrics, quote box, family photo | Emotional and social relevance proof | Cramped quote text box | Original Request § R3 |
| 14 | Pitch Delivery | Synchronized Speaker Notes | Complete, calibrated 3–4 minute pitch script attached to each slide via `slide.addNotes()` | Plain text speech narrative per slide | PowerPoint presenter view notes | Re-declaring `addNotes` overwrites previous notes | pptx skill & generate_deck.js baseline |
| 15 | Engineering Quality | Strict DrawingML Office Validation | Automated inspection of package relationships, slide XML, schemas, and content types using `validate.py` | Generated `.pptx` file | Clean validation report (0 errors) | Uncaught schema defects crash Microsoft PowerPoint | pptx skill & validate.py |

---

## 7. Edge Cases & Boundary Conditions

| # | Feature | Input / Condition | Observed Behavior & Handling |
|---|---------|-------------------|------------------------------|
| 1 | Image Transparency | `slide.addImage({ transparency: 90 })` | Verified via node script and `validate.py`. Successfully generates DrawingML `a:alpha val="10000"` element. Slide passes all XSD schema validations without defect. |
| 2 | Dark Overlay Layering | `slide.addImage()` full bleed followed by `slide.addShape(RECTANGLE, { fill: { color: '161A30', transparency: 32 } })` | Generates a darkened photographic backdrop. Text placed afterwards at $z$-order level 3 renders with perfect contrast and passes `validate.py`. |
| 3 | Hex Color with Hash | `color: '#C69214'` | Corrupts OpenXML drawing definitions. MUST strip `#` and enforce strict 6-digit hex string `'C69214'`. |
| 4 | Option Object EMU Mutation | Reusing single options object `{ x: 1, y: 1, w: 2, h: 2 }` across two `addShape` calls | PPTXGenJS converts inches to EMU ($1" = 914,400$ EMU) during the first call; the second call treats EMU as inches, throwing coordinates hundreds of inches off screen. MUST instantiate a fresh options object for every single call. |
| 5 | Shadow Offset Boundary | `shadow: { offset: -2 }` | DrawingML schema forbids negative shadow offsets. Corrupts PowerPoint file. MUST clamp with `Math.max(0, offset)` and adjust `angle` (e.g. $270^\circ$ for upward cast). |
| 6 | Shape Corner Radius | `rectRadius: 0.1` passed to `pres.shapes.RECTANGLE` | PPTXGenJS ignores `rectRadius` on standard rectangles. Only takes effect when shape is `pres.shapes.ROUNDED_RECTANGLE`. |
| 7 | List Item Line Breaks | Array of text runs without `breakLine: true` | All list items run together on a single line. MUST set `bullet: true` and `breakLine: true` on every item except the final item. |
| 8 | Multiple Speaker Notes Calls | Calling `slide.addNotes("...")` twice on the same slide | Second call overwrites the first. MUST combine all slide notes into a single string argument. |
| 9 | Editorial Headline Wrapping | 44–48pt `Cambria` title with 2–3 words wrapping | A narrow container wraps awkwardly or clips. Containers for titles must be allocated $w \ge 10.5"$ (or full right column width $w \ge 6.8"$) with height $h \ge 1.2"$ and vertical slack. |
| 10 | Half-Bleed Margin Collision | Content card placed at $x=5.2"$ when half-bleed image ends at $x=5.2"$ | Card edge directly touches image border without visual gutter. MUST provide at least $0.35"–0.5"$ gutter between the image boundary and content containers. |

---

## 8. Acceptance Criteria Checklist

### 8.1 Editability
- [ ] Every text element on every slide is a native PowerPoint text box selectable and directly editable in PowerPoint.
- [ ] Images are embedded as native picture objects alongside editable text and shapes.
- [ ] Zero rasterized slide background images containing burnt-in text.

### 8.2 Human Feel & Photography
- [ ] Every one of the 8 slides contains at least one embedded photograph.
- [ ] ALL 9 available heritage photographs are integrated across the presentation.
- [ ] At least 3 slides use a photo as background with transparency (`transparency: 85-92`) or as a half-bleed composition (Cover, Problem, Feasibility, Impact, Closing achieve 5 slides).
- [ ] No slide has a plain solid-white background (`FFFFFF`) with nothing but text boxes and geometric shapes — warm canvas (`F5F3EF`) and photographic textures used throughout.
- [ ] At least 2 slides feature distinct asymmetric layouts (e.g. 45/55 and 60/40 splits).

### 8.3 Design Rules
- [ ] NEVER use accent lines under titles on any slide.
- [ ] NEVER add decorative color bars, header/footer bars, or card edge stripes.
- [ ] Minimum $0.5"$ margins maintained from all outer slide edges.
- [ ] No text overflow or container clipping.

### 8.4 Content Completeness
- [ ] All 5 official judging criteria explicitly addressed and badged across slides 3–7.
- [ ] Complete, calibrated speaker notes present on all 8 slides.
- [ ] Live MVP status, team tagline, and technical architecture specs fully preserved.

### 8.5 File Validation
- [ ] `.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx` passes with 0 critical errors.
