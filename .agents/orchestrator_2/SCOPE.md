# Scope: Herodotus Pitch Deck Warm Editorial Redesign

## Architecture & Visual System
- **Generator Core**: Single executable Node.js script (`generate_deck.js`) utilizing `pptxgenjs` v4.0.1.
- **Canvas & Dimensions**: 16:9 Widescreen (`LAYOUT_WIDE`: 13.333" × 7.5"), minimum 0.5" margins (`x >= 0.5"`, `y >= 0.5"`, `w <= 12.333"`, `h <= 6.5"`).
- **Theme**: "Warm Editorial Heritage"
  - Dark Slides (Cover Slide 1, Closing Slide 8): Full-bleed monument photograph (`13.333" × 7.5"`) with dark umber overlay rectangle (`12100E`, 25–30% transparency) and gold/white typography.
  - Light Content Slides (Slides 2–7): Warm limestone parchment canvas (`F5F3EF`), sandstone borders (`E8E2D8`), card backgrounds (`FAF8F5` or `FFFFFF` with warm tint).
  - Accent Colors: Heritage Gold (`C69214`), Sandstone (`D4A574`), Terracotta (`B85042` / `C2410C`), Deep Umber (`12100E`).
- **Typography Hierarchy**:
  - Headlines: `Cambria` (bold serif) 34–46pt for human, editorial presence.
  - Category Kickers / Subtitles: `Calibri` (bold uppercase) 11–13pt in Heritage Gold / Sandstone.
  - Body Copy: `Calibri` 13–15pt for legibility.
  - Captions / Metadata / Badges: `Calibri` 10–12pt.
- **Photography on Every Slide (All 9 Images Utilized)**:
  1. Slide 1 (Cover): `hero_monument_1789383083590.jpg` (Full-bleed + dark overlay)
  2. Slide 2 (The Problem): `heritage_problem_scene_1789435962154.jpg` (42% half-bleed left panel)
  3. Slide 3 (Innovation & Originality): `india_heritage_map_1789407014836.jpg` (Asymmetric spatial engine panel)
  4. Slide 4 (Product Demo): `phone_audio_guide_1789436084142.jpg` (Product in use hero inset)
  5. Slide 5 (Feasibility & Tech): `tech_architecture_warm_1789436115529.jpg` (Stone jali lattice, full-bleed semi-transparent background, transparency: 90%)
  6. Slide 6 (Business Model): `human_traveler_heritage_1789408640689.jpg` (Palace traveler commercial inset) AND `visitor_monument_1789383102153.jpg` (Monumental scale scaling inset)
  7. Slide 7 (Impact & Social Relevance): `indian_family_heritage_1789408698290.jpg` (42% half-bleed left panel)
  8. Slide 8 (Closing & Vision): `closing_monument_1789403341798.jpg` (Full-bleed gateway twilight + dark overlay)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Full-Bleed Dark Cover with Photo & Overlay | Slide 1: `hero_monument` full bleed + dark umber overlay + Cambria gold title + MVP badge | M1 | Survey Synthesized |
| 2 | Asymmetric Half-Bleed Problem Layout | Slide 2: `heritage_problem_scene` 42% left bleed + 3 warm stacked problem cards on right | M1 | Survey Synthesized |
| 3 | Spatial Map Visual & Comparative Matrix | Slide 3: `india_heritage_map` inset + Criterion 1 badge + asymmetric comparison cards | M1 | Survey Synthesized |
| 4 | Human Inset & Live PWA Journey Demo | Slide 4: `phone_audio_guide` photo inset + PWA workflow + 4-step progressive ribbon + Criterion 4 | M1 | Survey Synthesized |
| 5 | Semi-Transparent Lattice Tech Architecture | Slide 5: `tech_architecture_warm` jali lattice (transparency 90) + 5 modular stack cards + 3 metrics + Criterion 2 | M1 | Survey Synthesized |
| 6 | Double Photo Inset Business & Scale Layout | Slide 6: `human_traveler` & `visitor_monument` photos + 3 monetization cards + 3-stage roadmap + Criterion 5 | M1 | Survey Synthesized |
| 7 | Asymmetric Half-Bleed Generational Impact | Slide 7: `indian_family_heritage` 42% left bleed + 3 warm impact cards + Criterion 3 | M1 | Survey Synthesized |
| 8 | Full-Bleed Twilight Closing & Live CTA | Slide 8: `closing_monument` full bleed + dark overlay + vision statement + 3 readiness pillars + demo CTA | M1 | Survey Synthesized |
| 9 | Native Editable Textbox Guarantee | Every text element is a native PowerPoint textbox; no rasterized slide text | M1 | Survey Synthesized |
| 10 | Strict Design Rule Enforcement | No accent lines under titles, no decorative bars/stripes, margins >= 0.5", no text overflow | M1 | Survey Synthesized |
| 11 | Complete Speaker Notes on All 8 Slides | 3-4 minute pitch script preserved on every slide via `slide.addNotes()` | M1 | Survey Synthesized |
| 12 | ECMA-376 OpenXML & Schema Validation | `.venv/bin/python3 .../validate.py` passes with 0 errors | M2 | Survey Synthesized |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Implementation of Warm Editorial Deck | Rewrite/update `generate_deck.js` to implement all 8 slides with warm palette, all 9 photos, asymmetric layouts, Cambria/Calibri, and compile `Herodotus_Pitch_Presentation.pptx` | Survey (DONE) | IN_PROGRESS |
| M2 | Review, Adversarial Challenge & Forensic Integrity Audit | Reviewers verify design & content; Challengers verify native editability, layout geometry & margins; Auditor verifies zero cheating/authenticity | M1 | PLANNED |

## Interface Contracts
### `generate_deck.js` ↔ PPTX Runtime
- Command: `node generate_deck.js`
- Output path: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
- Success exit code: 0

### Presentation ↔ Validation Suite
- Command: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`
- Success exit code: 0, "All validations PASSED!"
