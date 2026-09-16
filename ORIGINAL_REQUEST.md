# Original User Request

## Initial Request — 2026-09-15T00:28:41Z

Rebuild an 8-slide hackathon pitch presentation for "Herodotus — Historical Monument Virtual Audio & Fact Guide" (IDEA FORGE 2026 Pitch-A-Thon). The current deck is broken — slides are rasterized PNG images, making nothing editable. Rebuild from scratch using **pptxgenjs** so every text box, shape, and element is a native, editable PowerPoint object.

Working directory: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`
Integrity mode: development
Output file: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`

## Project Context

**Herodotus** is an interactive, map-first web companion (PWA) that puts 4,000 years of Indian heritage into every traveler's pocket — with instant multilingual audio, curated stories, and verified visitor facts. Key stats:
- 3,693 ASI-protected monuments unified into one spatial platform
- 5+ regional Indian languages (Hindi, Tamil, Telugu, Bengali, English) via browser-native Web Speech API
- Zero-friction PWA — no app download, works on budget phones with 4G
- Free public access — democratizing heritage education
- Tech stack: Next.js 14 + Tailwind + React (PWA), Mapbox GL JS (spatial engine), Web Speech API (audio), Vercel Edge + MongoDB Atlas (hosting)

**5 Official Judging Criteria** (each must be explicitly addressed across slides):
1. Innovation & Originality
2. Feasibility & Technical Viability
3. Impact & Social Relevance
4. Presentation & Clarity
5. Business Model & Scalability

**Team tagline:** "Just as Herodotus documented ancient history for the world, we are giving India's living stone a voice in every pocket."

## Requirements

### R1. Native Editable PPTX via pptxgenjs

Build the entire presentation using a Node.js script with `require('pptxgenjs')`. Every slide element (titles, body text, stats, cards, icons, images) must be a native PowerPoint object — text boxes, shapes, and embedded images. No rasterized slide backgrounds. All text must be directly editable when opened in PowerPoint or Keynote.

Critical pptxgenjs rules to follow:
- Set `pres.layout = 'LAYOUT_WIDE'` (13.333" × 7.5") before adding slides
- Hex colors WITHOUT `#` prefix: `"1E2761"` not `"#1E2761"`
- Never share option objects between `add*` calls (pptxgenjs mutates them)
- Shadow `offset` must be >= 0
- Use `charSpacing` not `letterSpacing`
- Lists: `bullet: true` on each item, `breakLine: true` on every item except last
- `rectRadius` only works on `ROUNDED_RECTANGLE`
- Gradient fills aren't supported — use gradient images instead
- Set `margin: 0` on text boxes when aligning with shapes/icons
- Speaker notes via `slide.addNotes("...")` (once per slide)
- Never reuse a `new pptxgen()` instance

### R2. Visual Design — Mixed Sandwich Theme

Use a "mixed sandwich" structure:
- **Dark slides** (deep navy/charcoal `1E2761` or similar) for: Title/Cover, Closing
- **Light slides** (white `FFFFFF` or very light gray) for: All content slides in between
- One bold accent color used consistently (teal, gold, or coral — pick one that suits the heritage/history theme)

Design rules (from pptx skill):
- **NEVER use accent lines under titles** — whitespace or background color only
- **NEVER add decorative color bars or accent stripes** — no header/footer bars, no sidebar stripes, no edge stripes on cards. Use subtle background tint, drop shadow, or icons instead
- **Don't repeat the same layout** — vary columns, cards, callouts across slides
- **Every slide needs a visual element** — image, icon, chart, or shape
- Left-align body text; center only titles
- Title size: 36-44pt bold. Body: 14-16pt. Captions: 10-12pt
- 0.5" minimum margins, 0.3-0.5" between content blocks
- Safe fonts: **Calibri** (body), **Cambria** (headers) — these render reliably
- Icons in small colored circles next to section headers
- Don't default to cream/beige backgrounds
- Don't ship text that overflows its shape

### R3. Slide Content — Address All 5 Judging Criteria

Design 8 slides with the team deciding optimal flow based on the 5 judging criteria. Suggested structure (team may adjust):

1. **Cover** (dark) — Project name, tagline, event branding, "Live Working MVP Ready for Demo"
2. **The Problem** — India's 3,693 monuments with zero digital context; fragmented info, language barriers, guide monopoly
3. **Innovation & Originality** — Spatial-first discovery vs keyword search, zero-friction PWA, living audio narratives, linguistic inclusion
4. **Product Experience / Live Demo** — Mock UI showing map → monument → audio flow, 4-step user journey
5. **Feasibility & Technical Viability** — Architecture (PWA + Mapbox + Web Speech + Edge CDN), performance targets, zero-server-cost model
6. **Business Model & Scalability** — 3 revenue streams (B2G tourism partnerships, freemium deep-dive audio, local heritage commerce), scalability roadmap (Golden Triangle MVP → Pan-India → South Asia)
7. **Impact & Social Relevance** — Breaking elite tourist divide, revitalizing 3,500 forgotten sites, educational impact, accessibility for visually impaired
8. **Closing** (dark) — "History is everywhere. Now, it can speak." Thank you + Q&A invitation

Each slide should include speaker notes covering what to say during the 3-4 minute pitch.

### R4. Embedded Images

Use these existing images as properly embedded pictures (not full-bleed backgrounds — sized appropriately within layouts):

| Image | Path | Use on |
|-------|------|--------|
| Traveler at palace | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg` | Cover or Problem slide |
| Grandfather & grandson at heritage site | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg` | Impact slide |
| India heritage map (dark) | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg` | Innovation or Demo slide |
| Amer Fort at sunset | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg` | Cover or Closing |
| Illuminated fort gateway | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg` | Closing slide |
| Visitor at temple archway | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg` | Problem slide |

The team decides which images to use where. Not all need to be used.

## Acceptance Criteria

### Editability
- [ ] Every text element on every slide is a native PowerPoint text box that can be selected and edited directly in PowerPoint
- [ ] No slide uses a full-bleed rasterized image as its only content (images are embedded alongside editable elements)

### Visual Quality
- [ ] No accent lines under titles on any slide
- [ ] No decorative color bars, sidebar stripes, or edge stripes on any card or content block
- [ ] At least 3 different layout patterns used across the 8 slides (not all identical)
- [ ] Every slide has at least one visual element (image, icon circle, or shape) beyond text
- [ ] No text overflow — all content fits within its container
- [ ] Minimum 0.5" margins from all slide edges

### Content Completeness
- [ ] All 5 judging criteria (Innovation, Feasibility, Impact, Presentation, Business Model) are explicitly addressed
- [ ] Every slide has speaker notes
- [ ] The deck opens without errors in PowerPoint

### File Validation
- [ ] `python /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py <output.pptx>` reports no critical errors

## Follow-up — 2026-09-15T01:38:07Z

Improve the existing native-editable pptxgenjs pitch deck for "Herodotus — Historical Monument Virtual Audio & Fact Guide" (IDEA FORGE 2026 Pitch-A-Thon). The current deck has proper editable PowerPoint objects but looks too sterile, minimal, and AI-generated — too much white space, not enough photography, clinical geometric layouts. Make it feel **warm, human, and editorial** — like a pitch deck designed by a real human designer, not generated by AI.

Working directory: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`
Integrity mode: development
Output file: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`

The existing generator is at `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`. Modify this file or rewrite it — the output must remain a native editable `.pptx` built with pptxgenjs.

## The Core Problem to Fix

The current deck screams "AI-generated" because:
1. **Content slides are mostly white with geometric shape grids** — no photographic warmth
2. **Images only appear on 3-4 slides** — the rest are pure text + shapes
3. **Every card/block is a perfect rectangle with uniform spacing** — too orderly, too clinical
4. **No texture, no atmospheric depth** — flat white backgrounds everywhere
5. **Typography is competent but soulless** — no personality, no editorial flair

## Requirements

### R1. Every Slide Must Have Photography

Use heritage photographs on EVERY slide — not just cover and closing. Techniques to integrate photos across content slides while keeping text editable:

- **Semi-transparent background images** (set image `transparency: 85-92` in pptxgenjs) behind content on 3-4 content slides — this adds warmth and texture without making text unreadable. Place a semi-transparent white/dark overlay shape on top if needed for contrast.
- **Half-bleed compositions** — image fills left/right 40-50% of slide, content on the other side (not just on cover/closing)
- **Smaller inset photos** (3-4" wide) placed alongside content to break up text-heavy areas
- **Image-as-section-divider** — a thin horizontal photo strip across the top or bottom of a slide

Every element must remain an editable native PowerPoint object. Images are embedded pictures. Text stays in text boxes. The user can click and edit anything.

### R2. Humanize the Visual Design

Make the deck feel like it was designed by a thoughtful human, not generated by AI:

- **Warm color palette** — use warm tones (heritage gold `C69214`, sandstone `D4A574`, terracotta accents) throughout, not cold clinical whites and blues
- **Asymmetric layouts** — not everything centered or in perfect grids. Shift content slightly off-center. Use varied column widths (60/40 splits, not 50/50).
- **Typography with personality** — use **Cambria** for big emotional headlines (it has serif warmth), **Calibri** for body. Mix font weights more boldly — big 44-48pt headlines with small 12pt captions creates visual drama.
- **Breathing room done right** — white space should feel intentional (like a magazine spread), not empty (like an unfinished slide). Anchor white space with a photo or subtle element nearby.
- **No perfect symmetry** — offset elements, vary card sizes, let some items be bigger than others to create visual hierarchy
- **Dark slides with photographic backgrounds** — the cover and closing should use full-bleed monument photos with dark overlays and white/gold text on top (not solid navy backgrounds)
- **Light content slides with warm texture** — instead of pure `FFFFFF` white, use a very subtle warm-gray `F5F3EF` or embed a highly transparent heritage texture photo as background

### R3. Content Structure (Keep Existing)

Keep the same 8-slide structure and content from the current deck — all 5 judging criteria, speaker notes, product details. This is a visual/design improvement, not a content rewrite.

The 8 slides are:
1. **Cover** (dark) — Project name, tagline, event branding, "Live Working MVP Ready for Demo"
2. **The Problem** — India's 3,693 monuments with zero digital context; fragmented info, language barriers, guide monopoly
3. **Innovation & Originality** — Spatial-first discovery vs keyword search, zero-friction PWA, living audio narratives, linguistic inclusion
4. **Product Experience / Live Demo** — Mock UI showing map → monument → audio flow, 4-step user journey
5. **Feasibility & Technical Viability** — Architecture (PWA + Mapbox + Web Speech + Edge CDN), performance targets, zero-server-cost model
6. **Business Model & Scalability** — 3 revenue streams (B2G tourism partnerships, freemium deep-dive audio, local heritage commerce), scalability roadmap
7. **Impact & Social Relevance** — Breaking elite tourist divide, revitalizing 3,500 forgotten sites, educational impact, accessibility
8. **Closing** (dark) — "History is everywhere. Now, it can speak." Thank you + Q&A invitation

**Team tagline:** "Just as Herodotus documented ancient history for the world, we are giving India's living stone a voice in every pocket."

### R4. pptxgenjs Technical Rules

All previous pptxgenjs rules apply:
- `pres.layout = 'LAYOUT_WIDE'` (13.333" × 7.5")
- Hex colors WITHOUT `#`: `"C69214"` not `"#C69214"`
- Never share option objects between `add*` calls
- Shadow `offset` >= 0
- `charSpacing` not `letterSpacing`
- Speaker notes via `slide.addNotes("...")`
- Safe fonts: Calibri (body), Cambria (headers)
- **NEVER accent lines under titles**
- **NEVER decorative color bars or accent stripes**
- Margins >= 0.5" from all edges
- `rectRadius` only works on `ROUNDED_RECTANGLE`
- Gradient fills aren't supported — use gradient images instead
- Set `margin: 0` on text boxes when aligning with shapes/icons
- Lists: `bullet: true` on each item, `breakLine: true` on every item except last

## Available Images

Use ALL of these across the 8 slides (every slide should have at least one photo):

| # | Image | Path | Suggested Use |
|---|-------|------|---------------|
| 1 | Amer Fort sunset (hero shot) | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg` | Cover full-bleed background |
| 2 | Frustrated tourist at ASI signboard | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/heritage_problem_scene_1789435962154.jpg` | Problem slide — half-bleed left |
| 3 | Woman using phone at fort (product in use) | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/phone_audio_guide_1789436084142.jpg` | Innovation or Demo slide |
| 4 | Dark India heritage map | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg` | Innovation slide background or inset |
| 5 | Stone jali lattice with light | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/tech_architecture_warm_1789436115529.jpg` | Tech slide — semi-transparent background |
| 6 | Traveler at palace courtyard | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg` | Demo slide or Business Model |
| 7 | Grandfather & grandson at heritage | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg` | Impact slide — half-bleed |
| 8 | Illuminated fort gateway twilight | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg` | Closing full-bleed background |
| 9 | Visitor dwarfed by temple archway | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg` | Problem or Business Model slide |

## Acceptance Criteria

### Editability (must preserve from previous version)
- [ ] Every text element is a native PowerPoint text box — selectable and editable
- [ ] Images are embedded as picture objects alongside editable text/shapes

### Human Feel (the key improvement)
- [ ] Every one of the 8 slides contains at least one photograph (embedded image)
- [ ] At least 3 slides use a photo as background with transparency (semi-transparent background technique) or as a half-bleed composition
- [ ] No slide has a plain solid-white background with nothing but text boxes and geometric shapes — every slide has photographic warmth
- [ ] At least 2 slides use asymmetric layouts (not centered grids)

### Design Rules
- [ ] No accent lines under titles
- [ ] No decorative color bars or accent stripes
- [ ] Margins >= 0.5" from all edges
- [ ] No text overflow

### Content Completeness
- [ ] All 5 judging criteria still explicitly addressed
- [ ] Speaker notes on all 8 slides

### File Validation
- [ ] `python /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py <output.pptx>` reports no critical errors

## Follow-up — 2026-09-15T03:07:13Z

Restyle the existing Herodotus pitch deck to match a specific cinematic dark-editorial design system. The user provided 5 reference screenshots showing the exact visual style they want. **Keep all existing text content unchanged** — this is purely a visual/UI redesign of the `generate_deck.js` pptxgenjs script.

Working directory: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`
Integrity mode: development
Output file: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
Existing generator: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`

**5 reference screenshots** are saved at:
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide1_cover.png`
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide2_problem.png`
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide3_solution.png`
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide4_product.png`
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide5_tech.png`

**IMPORTANT: View all 5 reference screenshots before writing any code.** These are the ground truth for the visual design.

## The Design System to Match (Extracted from Reference Screenshots)

### Overall Philosophy
Every slide is **ALL DARK** — deep near-black backgrounds (`0D0B09` or `12100E`). No white backgrounds, no light backgrounds, no mixed sandwich. This is a cinematic, film-poster aesthetic. Think Criterion Collection meets luxury travel brand.

### Color Palette (exact values to use)

| Token | Hex | Usage |
|-------|-----|-------|
| `BG_DARK` | `0D0B09` | Primary slide background (near-black warm) |
| `CARD_DARK` | `1A1714` | Dark card/panel backgrounds |
| `CARD_BORDER` | `2E2A25` | Subtle warm border on cards |
| `GOLD` | `C69214` | Section numbers, highlight text, accent lines, dashed connectors |
| `GOLD_LIGHT` | `D4A856` | Softer gold for secondary labels |
| `TEXT_WHITE` | `FFFFFF` | Primary headlines and body text |
| `TEXT_CREAM` | `E8E0D4` | Secondary body text, descriptions |
| `TEXT_MUTED` | `8A8279` | Tertiary labels, captions, coordinates |
| `UI_CREAM` | `F5F0E8` | Light card backgrounds for UI mockup panels only |

### Typography System

| Element | Font | Size | Color | Style |
|---------|------|------|-------|-------|
| Section label | Calibri | 10-11pt | `GOLD` | ALL CAPS, letter-spaced (`charSpacing: 3-4`), e.g. "02 — THE PROBLEM" |
| Main headline | Cambria | 36-44pt | `TEXT_WHITE` | Bold, left-aligned, dramatic |
| Headline gold accent | Cambria | 36-44pt | `GOLD` | Bold, used for the second or key line of a headline |
| Body text | Calibri | 12-14pt | `TEXT_CREAM` | Regular, left-aligned |
| Card title | Calibri | 14-16pt | `TEXT_WHITE` | Bold |
| Card body | Calibri | 11-12pt | `TEXT_MUTED` | Regular |
| Coordinate/GPS labels | Calibri | 9-10pt | `TEXT_MUTED` | ALL CAPS, letter-spaced, placed in top-right corner of slides |
| Bottom nav/labels | Calibri | 9pt | `TEXT_MUTED` | ALL CAPS, letter-spaced |
| Gold italic tagline | Cambria | 22-28pt | `GOLD` | Italic, right-aligned — used for emotional callouts like "One map. Every monument. One tap away." |

### Layout Patterns (from the 5 reference slides)

**Pattern A — Full-Bleed Photo Cover (Slide 1):**
- Full-bleed monument photo as background
- Dark semi-transparent overlay on top (black rectangle, transparency ~35-45%)
- Cinematic letterbox: thin black bars (~0.4" tall) at top and bottom edges
- Top bar: "IDEA FORGE 2026 — PITCH-A-THON" (left, gold, caps), GPS coordinates (right, muted, caps)
- Supertitle: "A MAP-FIRST DIGITAL HERITAGE EXPERIENCE" (gold, caps, spaced)
- Giant title: "HERODOTUS" (white, Cambria, ~72-80pt, dramatic serif)
- Subtitle: "EXPLORE INDIA'S MONUMENTS, ONE MAP AT A TIME" (white, bold, ~20pt)
- Bottom: "TEAM HERODOTUS" (left, gold), "MAP · STORY · AUDIO · VISIT" (right, muted)
- Gold dashed horizontal line near bottom
- Faint India map outline visible on right side

**Pattern B — Half-Bleed Photo + Dark Cards (Slide 2):**
- Left ~55%: monument photo with dark overlay, large serif headline over it
- Right ~45%: solid dark background with 3 stacked cards
- Section label top-left: "02 — THE PROBLEM" (gold, caps)
- GPS coordinates top-right
- Cards: dark background (`1A1714`), subtle border, gold number ("01", "02", "03"), bold white title, muted body text, small icon top-right
- Gold dashed line with X markers at bottom of left panel
- Headline has second line in gold for emphasis

**Pattern C — Map + UI Mockup (Slides 3 & 4):**
- Dark background
- Left side: India map outline (thin lines, light gray/gold on dark) with pin markers and dashed gold path
- Right side: UI mockup card with cream/light background showing monument detail, audio player, buttons
- Zoom-level stepping indicators (01 India → 02 Rajasthan → 03 Jaipur → 04 Monument)
- Gold italic serif tagline on right side
- Section label + headline top-left

**Pattern D — Architecture Flow (Slide 5):**
- Dark background
- Headline: "SIMPLE ARCHITECTURE. / POWERFUL EXPERIENCE." (second line in gold)
- Horizontal 5-step flow: icons in rounded-square boxes connected by gold dashed arrows
- Each step: number, name (bold), tech description (muted)
- Right side: "MVP-FIRST ARCHITECTURE" badge, explanation text
- Bottom: "EXISTING, PROVEN BUILDING BLOCKS" label
- Bottom section: "STRETCH / NEXT" with 3 bordered cards (future features)
- Gold decorative corner elements

### Visual Motifs to Replicate
1. **Gold dashed/dotted lines** — horizontal dividers, path connectors, progress indicators
2. **GPS coordinates** in top-right corner of each slide (e.g. "26.9239° N · 75.8267° E  JAIPUR, IN")
3. **Section numbering** — "01 — THE PROBLEM", "02 — THE SOLUTION" etc. in gold caps
4. **Gold accent on second headline line** — first line white, second line gold for emphasis
5. **Small icons** in top-right of cards (search icon, clock icon, waveform icon)
6. **Cinematic proportions** — generous margins, breathing room, editorial feel
7. **Monument photo overlays** — photos visible but darkened, never competing with text
8. **India map outline** as a recurring subtle element

## Requirements

### R1. Match the Reference Design Exactly

Study the 5 reference screenshots and replicate their exact visual system using pptxgenjs. Every slide must use the dark background, gold accent, serif headline, GPS coordinate, and card styling patterns described above. The goal is that the output PPTX looks like it came from the same designer who made the reference screenshots.

### R2. Keep All Existing Text Content

Do NOT change the text content, slide titles, body copy, stats, speaker notes, or judging criteria coverage from the current `generate_deck.js`. The user explicitly likes the existing text and section structure. Only the visual styling changes.

### R3. Apply the Design to All 8 Slides

The reference screenshots cover slides 1-5. For slides 6-8 (Business Model, Impact, Closing), extrapolate from the established design system:
- Slide 6 (Business Model): Use Pattern D style (horizontal flow + cards)
- Slide 7 (Impact): Use Pattern B style (photo + cards)
- Slide 8 (Closing): Use Pattern A style (full-bleed photo with dark overlay)

### R4. pptxgenjs Technical Rules (Same as Before)

- `pres.layout = 'LAYOUT_WIDE'` (13.333" × 7.5")
- Hex colors WITHOUT `#`: `"C69214"` not `"#C69214"`
- Never share option objects between `add*` calls (pptxgenjs mutates them)
- Shadow `offset` >= 0
- `charSpacing` not `letterSpacing`
- Speaker notes via `slide.addNotes("...")`
- Safe fonts: **Calibri** (body/labels), **Cambria** (headlines/taglines)
- **NEVER accent lines under titles** — use whitespace
- **NEVER decorative color bars or accent stripes**
- Margins >= 0.5" from all edges
- `rectRadius` only on `ROUNDED_RECTANGLE`
- Gradient fills not supported — use images
- `margin: 0` on text boxes when aligning with shapes/icons

### R5. All Elements Must Be Editable

Every text element, shape, and image must be a native editable PowerPoint object. No rasterized slide backgrounds. The user must be able to click on any text and edit it directly in PowerPoint.

## Available Images

| # | Image | Path |
|---|-------|------|
| 1 | Amer Fort sunset | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg` |
| 2 | Frustrated tourist at ASI signboard | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/heritage_problem_scene_1789435962154.jpg` |
| 3 | Woman using phone at fort | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/phone_audio_guide_1789436084142.jpg` |
| 4 | Dark India heritage map | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg` |
| 5 | Stone jali lattice | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/tech_architecture_warm_1789436115529.jpg` |
| 6 | Traveler at palace | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg` |
| 7 | Grandfather & grandson | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg` |
| 8 | Fort gateway twilight | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg` |
| 9 | Visitor at temple archway | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg` |
| 10 | Audio waveform | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/audio_waveform.png` |

## Acceptance Criteria

### Visual Match to Reference
- [ ] All 8 slides use a dark background (`0D0B09` or similar near-black) — no white or light backgrounds
- [ ] Gold accent color (`C69214`) used consistently for: section numbers, highlight text, dashed lines, and key labels
- [ ] Every slide has a section label in gold caps format (e.g. "02 — THE PROBLEM")
- [ ] Headlines use Cambria serif with at least one line in gold for emphasis
- [ ] At least 3 slides have GPS-style coordinate text in the top-right corner
- [ ] Cards/panels use dark backgrounds (`1A1714`) with subtle borders — not white cards on dark background
- [ ] At least 2 slides have gold dashed lines as visual elements (dividers, connectors, or path indicators)

### Editability
- [ ] Every text element is a native PowerPoint text box — selectable and editable
- [ ] Images are embedded as picture objects alongside editable text/shapes

### Content Preservation
- [ ] All 5 judging criteria still explicitly addressed
- [ ] Speaker notes on all 8 slides
- [ ] Core text content unchanged from the current version

### File Validation
- [ ] The deck compiles without errors from `generate_deck.js`
- [ ] The PPTX opens cleanly in PowerPoint

## 2026-09-15T04:30:34Z

Fix the Herodotus pitch deck to precisely match 7 reference screenshots the user provided. The current `generate_deck.js` (Iteration 3) has the right color palette (`0D0B09` dark bg, `C69214` gold accent) but the slide layouts and element placement don't match the reference screenshots closely enough. Rewrite `generate_deck.js` to match each reference slide's exact layout, element positioning, typography hierarchy, and visual motifs.

Working directory: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`
Integrity mode: development
Output file: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
Existing generator: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`

## 7 Reference Screenshots (VIEW ALL BEFORE CODING)

- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide1_cover.png` — Slide 1: Cover
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide2_problem.png` — Slide 2: Problem
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide3_solution.png` — Slide 3: Solution
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide4_product.png` — Slide 4: Product Experience
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide5_tech.png` — Slide 5: Technical Feasibility
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide6_impact.png` — Slide 6: Impact & Value
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide7_closing.png` — Slide 7/8: Closing

**CRITICAL: View every screenshot and compare against the current `generate_deck.js` output before writing code. The screenshots are the ground truth.**

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `BG_DARK` | `0D0B09` | Slide background |
| `CARD_DARK` | `1A1714` | Card backgrounds |
| `CARD_BORDER` | `2E2A25` | Subtle borders |
| `GOLD` | `C69214` | Accents, highlights, section labels |
| `GOLD_LIGHT` | `D4A856` | Softer gold |
| `TEXT_WHITE` | `FFFFFF` | Primary text |
| `TEXT_CREAM` | `E8E0D4` | Body text |
| `TEXT_MUTED` | `8A8279` | Captions, coords |
| `UI_CREAM` | `F5F0E8` | UI mockup panels |

## Per-Slide Layout Specifications (from reference screenshots)

### SLIDE 1 — COVER (reference_slide1_cover.png)
- Full-bleed monument photo (Amer Fort sunset) covering entire slide
- Dark semi-transparent overlay rectangle on top (~40% opacity black)
- **Cinematic letterbox bars**: solid black bars ~0.4" at top and bottom edges
- Top bar on letterbox: "IDEA FORGE 2026 — PITCH-A-THON" (left, gold, 9pt caps spaced) | "27.1751° N · 78.0421° E · AGRA, IN" (right, muted, 9pt caps)
- Center-left content (left 60% of slide):
  - "A MAP-FIRST DIGITAL HERITAGE EXPERIENCE" (gold, 10pt caps, letter-spaced)
  - "HERODOTUS" (white, Cambria, ~72-80pt, dramatic serif — THIS IS THE BIGGEST TEXT)
  - "EXPLORE INDIA'S MONUMENTS, ONE MAP AT A TIME" (white, bold, ~18-20pt)
- Right side: faint India map outline with pin marker and label "TAJ MAHAL / AGRA / MONUMENT RECORD · IN-UP-001"
- Bottom bar on letterbox: "TEAM HERODOTUS" (left, gold, 9pt) | "MAP · STORY · AUDIO · VISIT" (right, muted, 9pt caps spaced)
- Gold dashed horizontal line just above bottom bar with circle pin marker

### SLIDE 2 — THE PROBLEM (reference_slide2_problem.png)
- **Split layout**: left ~55% monument photo (use heritage_problem_scene or similar) with dark overlay; right ~45% dark bg
- Section label top-left: "02 — THE PROBLEM" (gold, 10pt caps spaced)
- GPS coords top-right: "26.9239° N · 75.8267° E  JAIPUR, IN" (muted, 9pt)
- LEFT SIDE (over photo):
  - Large headline: "YOU'RE STANDING IN FRONT OF HISTORY." (white, Cambria, ~32pt bold)
  - Second line: "BUT WHERE'S THE STORY?" (gold, Cambria, ~32pt bold)
  - Below: "THE HISTORY IS THERE. / THE DIGITAL EXPERIENCE IS FRAGMENTED." (cream, 10pt caps spaced)
  - Gold dashed line with X markers at very bottom of left panel
- RIGHT SIDE — 3 stacked cards (dark bg `1A1714`, subtle border):
  - Card 1: gold "01" label, white bold "INFORMATION IS SCATTERED", muted body text, search icon top-right
  - Card 2: gold "02", "VISITOR DETAILS ARE FRAGMENTED", clock icon
  - Card 3: gold "03", "THE EXPERIENCE LACKS CONTEXT", waveform icon
  - Cards evenly spaced vertically

### SLIDE 3 — THE SOLUTION (reference_slide3_solution.png)
- Dark background
- Section label: "03 — THE SOLUTION" (gold, caps)
- Headline: "WHAT IF THE MAP / COULD TELL THE STORY?" (white, Cambria, ~36pt bold, left-aligned)
- Below headline: "Explore India's monuments through one map-first experience." (cream, 13pt)
- **LEFT HALF** — India map outline (thin gray/gold lines on dark) with:
  - Small gold pin markers with dashed gold connecting path
  - "HERODOTUS / NATIONAL VIEW" label top-left of map
  - "ZOOM LV 04 · 26.59°N 78.96°E" label top-right of map
  - 4 zoom-level cards stacked vertically right of map: "01 INDIA" → "02 RAJASTHAN" → "03 JAIPUR" → "04 MONUMENT"
  - "MONUMENT PINS · SELECTED: AMER FORT" label at bottom
- **RIGHT SIDE TOP** — Gold italic Cambria tagline: "One map. / Every monument. / One tap away." (~24pt)
- **RIGHT SIDE** — Amer Fort photo strip (landscape photo, ~3" wide)
- **RIGHT SIDE BELOW** — Cream-bg UI card showing:
  - "UNESCO · HILL FORTS OF RAJASTHAN" label
  - "AMER FORT" (black, bold, ~24pt)
  - "AMER, JAIPUR · RAJASTHAN | 26.9855°N 75.8513°E"
  - Description text
  - Play button + "PLAY AUDIO GUIDE" + waveform visualization + "00:42 / 02:14"
  - Timings: "08:00 — 18:00" | Entry Fee: "₹200 IND / ₹1,000 INTL"
  - "VIEW TICKETS" and "GET DIRECTIONS ›" buttons

### SLIDE 4 — PRODUCT EXPERIENCE (reference_slide4_product.png)
- Dark background
- Section label: "04 — PRODUCT EXPERIENCE" (gold)
- Headline: "FROM MAP TO MONUMENT IN SECONDS." (white, Cambria, ~36pt bold)
- Top-right: "MAP → MONUMENT → STORY / → AUDIO → VISITOR INFO" (muted, caps)
- **LEFT SIDE** — Browser mockup frame:
  - Browser chrome bar with 3 dots + URL "herodotus.app/explore"
  - Dark UI inside: "HERODOTUS" logo, search bar, filter chips (ALL ERAS, FORTS, TEMPLES)
  - India map with pin markers and dashed path
  - Zoom controls (+/- and slider)
  - Amer Fort photo popup card with detail panel (same UI as slide 3)
- **RIGHT SIDE** — 4-step vertical journey:
  - "01 ZOOM" — "Explore India and locate a monument." + search icon
  - "02 TAP" — "Open its story, photos and visitor information." + info icon
  - "03 LISTEN" — "Hear its history through browser-based narration." + waveform icon
  - "04 PLAN" — "Check timings, fees, tickets and directions." + route icon
- **BOTTOM-RIGHT** — Card: "RESERVED / LIVE PROTOTYPE" + "ACTUAL HERODOTUS APP SCREENSHOT" + description

### SLIDE 5 — TECHNICAL FEASIBILITY (reference_slide5_tech.png)
- Dark background
- Section label: "05 — TECHNICAL FEASIBILITY" (gold)
- Headline: "SIMPLE ARCHITECTURE." (white) / "POWERFUL EXPERIENCE." (gold) — ~36pt Cambria
- Top-right: "MVP-FIRST ARCHITECTURE" badge (cream border, cream text) + "No complicated backend is required for the MVP."
- **CENTER** — 5-step horizontal architecture flow:
  - Each step: icon in rounded-square box (~1" wide), gold number, bold white name, muted tech description
  - Steps: 01 USER (Mobile browser) → 02 MAP (Google Maps JavaScript API) → 03 STORY (Browser Web Speech API) → 04 DATA (Lightweight JSON monument data) → 05 WEB (Vercel / GitHub Pages)
  - Gold dashed arrows connecting steps
- Right of flow: "WHY IT SHIPS" + body text + "DEPLOY SURFACE" + "Static site, any modern browser"
- Bottom: "EXISTING, PROVEN BUILDING BLOCKS — NO CUSTOM SERVER, NO DATABASE LAYER IN THE MVP"
- Bottom section: "STRETCH / NEXT" with "Not implemented. Explored after MVP." + 3 bordered cards (3D MAP EXPERIENCES, MULTI-LANGUAGE AUDIO, SEARCH & FILTERS)
- Gold corner decorations top-right

### SLIDE 6 — IMPACT & VALUE (reference_slide6_impact.png)
- Dark background, NO PHOTO on this slide
- Section label: "06 — IMPACT & VALUE" (gold)
- Headline: "THREE THINGS." (white) / "ONE EXPERIENCE." (gold) — ~36pt Cambria
- Top-right: Gold italic Cambria: "Discovery, storytelling and / visitor planning in one flow." (~18pt)
- **CENTER** — Gold dashed horizontal timeline with circle-pin connectors
- **3 LARGE CARDS** below timeline (dark bg, subtle border, equal width):
  - Card 1: gold "01", bold "DISCOVER" (~28pt), "See where history is." (cream), gold map-pin icon top-right, "MAP · LOCATION PIN" (muted, 8pt, bottom)
  - Card 2: gold "02", bold "UNDERSTAND" (~28pt), "Hear why it matters." (cream), gold waveform icon, "AUDIO NARRATION · LISTEN" (muted, bottom)
  - Card 3: gold "03", bold "PLAN" (~28pt), "Know what to do next." (cream), gold chart icon, "ROUTE · TICKETS · VISITOR INFO" (muted, bottom)
- **3 DESCRIPTION BLOCKS** below cards (with gold title labels):
  - "TOURISM & HERITAGE" (gold, caps) + description text (cream)
  - "INDEPENDENCE" (gold, caps) + description text
  - "ACCESSIBILITY" (gold, caps) + description text
- **BOTTOM STATEMENT**: "HERODOTUS CONNECTS DISCOVERY, STORYTELLING AND VISITOR PLANNING IN ONE MAP-FIRST EXPERIENCE." (white, bold, ~14pt)
- GPS coordinates bottom-right

### SLIDE 7/8 — CLOSING (reference_slide7_closing.png)
- **Split layout**: left ~55% dark bg, right ~45% close-up stone sculpture photo (use closing_monument or visitor image) with dark overlay
- Cinematic letterbox bars top/bottom
- Top letterbox: "IDEA FORGE 2026 — PITCH-A-THON" (gold, caps)
- Gold horizontal line below top bar
- **LEFT SIDE**:
  - "HISTORY IS EVERYWHERE." (white, Cambria, very large ~48-54pt bold)
  - "NOW, IT CAN SPEAK." (gold, Cambria, same size, bold)
  - Short gold horizontal rule line (~2" wide)
  - "HERODOTUS" (white, bold, ~28pt)
  - "EXPLORE.  LISTEN.  DISCOVER." (cream, caps, letter-spaced, ~12pt)
  - Gold dashed line with circle pin connector
- **RIGHT SIDE** (over/near photo):
  - GPS coordinates: "15.3350° N / 76.4600° E / HAMPI, KARNATAKA" (muted)
  - Gold dashed diagonal line across photo
- **BOTTOM-RIGHT**: QR code placeholder box (gold border, gold fill pattern) with "Try the prototype from your phone." + "SCAN · LIVE DEMO"
- **BOTTOM-LEFT**: "TEAM HERODOTUS" (gold) / "A MAP-FIRST DIGITAL HERITAGE EXPERIENCE" (muted)

## Requirements

### R1. Match ALL 7 Reference Screenshots

View every screenshot. Compare against the current output. Fix every visual mismatch in layout, element placement, typography size, spacing, and motifs. The output deck must look like it was designed by the same person who created the reference screenshots.

### R2. Preserve Text Content

Keep all existing text content, speaker notes, and judging criteria coverage from the current `generate_deck.js`. Only the visual styling and layout changes.

### R3. pptxgenjs Technical Rules

- `pres.layout = 'LAYOUT_WIDE'` (13.333" × 7.5")
- Hex colors WITHOUT `#`
- Never share option objects between `add*` calls
- Shadow `offset` >= 0; `charSpacing` not `letterSpacing`
- Speaker notes via `slide.addNotes("...")`; safe fonts: Calibri + Cambria
- NEVER accent lines under titles; NEVER decorative color bars/stripes
- Margins >= 0.5"; `rectRadius` only on `ROUNDED_RECTANGLE`

### R4. All Elements Must Be Editable

Every text, shape, and image must be a native editable PowerPoint object. No rasterized slides.

## Available Images

| # | Path |
|---|------|
| 1 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg` |
| 2 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/heritage_problem_scene_1789435962154.jpg` |
| 3 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/phone_audio_guide_1789436084142.jpg` |
| 4 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg` |
| 5 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/tech_architecture_warm_1789436115529.jpg` |
| 6 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg` |
| 7 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg` |
| 8 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg` |
| 9 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg` |
| 10 | `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/audio_waveform.png` |

## Acceptance Criteria

### Visual Match
- [ ] Every slide layout matches its reference screenshot in element placement, relative sizing, and visual hierarchy
- [ ] All 8 slides use dark `0D0B09` backgrounds
- [ ] Gold `C69214` used for section labels, headline accent lines, dashed connectors, and key labels
- [ ] Cover and closing slides have cinematic letterbox bars (solid black ~0.4" at top/bottom)
- [ ] Closing slide has a QR code placeholder box with "SCAN · LIVE DEMO" label
- [ ] Slide 6 (Impact) has the 3-card DISCOVER/UNDERSTAND/PLAN layout with gold dashed timeline
- [ ] Gold dashed lines appear on at least 4 slides as dividers or connectors
- [ ] GPS coordinates appear on at least 5 slides

### Editability
- [ ] Every text element is a native PowerPoint text box
- [ ] Images are embedded picture objects

### Content
- [ ] All 5 judging criteria addressed
- [ ] Speaker notes on all slides
- [ ] Core text unchanged
