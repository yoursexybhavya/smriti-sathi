# Plan: Herodotus Pitch Deck Dark-Editorial Redesign

## Objective
Visually restyle the Herodotus pitch deck (`generate_deck.js` -> `Herodotus_Pitch_Presentation.pptx`) to match the cinematic dark-editorial design system shown in the 5 reference screenshots, while keeping 100% of existing text content, speaker notes, and judging criteria coverage completely intact.

## Design System Specifications
- **Colors**:
  - `BG_DARK`: `0D0B09` (all 8 slides use dark background)
  - `CARD_DARK`: `1A1714`
  - `CARD_BORDER`: `2E2A25`
  - `GOLD`: `C69214`
  - `GOLD_LIGHT`: `D4A856`
  - `TEXT_WHITE`: `FFFFFF`
  - `TEXT_CREAM`: `E8E0D4`
  - `TEXT_MUTED`: `8A8279`
  - `UI_CREAM`: `F5F0E8` (for UI mockup card on Slides 3 & 4)
- **Typography**:
  - Headlines: Cambria 36-44pt TEXT_WHITE bold, left-aligned; gold accent on second or key line
  - Section label: Calibri 10-11pt GOLD, ALL CAPS, letter-spaced (`charSpacing: 3-4`)
  - Body: Calibri 12-14pt TEXT_CREAM
  - Card title: Calibri 14-16pt TEXT_WHITE bold
  - Card body: Calibri 11-12pt TEXT_MUTED
  - Coordinates/GPS: Calibri 9-10pt TEXT_MUTED ALL CAPS in top-right
  - Gold italic tagline: Cambria 22-28pt GOLD italic right-aligned
- **Layout Patterns**:
  - Pattern A (Full-Bleed Photo Cover): Slide 1 (Cover) and Slide 8 (Closing)
  - Pattern B (Half-Bleed Photo + Dark Cards): Slide 2 (Problem) and Slide 7 (Impact)
  - Pattern C (Map + UI Mockup): Slide 3 (Solution) and Slide 4 (Product Experience)
  - Pattern D (Architecture Flow): Slide 5 (Technical Feasibility) and Slide 6 (Business Model)
- **Visual Motifs**:
  - Gold dashed/dotted lines
  - GPS coordinates in top-right of slides
  - Section numbering in gold caps (e.g., "01 — THE PROBLEM")
  - Darkened monument photo overlays
  - Native PowerPoint shapes and text boxes (100% editable)
  - NO accent lines under titles; NO decorative color bars

## Phases

### Phase 1: Survey & Technical Analysis (Parallel Explorers)
- **Explorer 1 (Spec Miner)**: Analyze the 5 reference screenshots and map exact visual layout coordinates, component hierarchies, card styles, and motif specs for pptxgenjs.
- **Explorer 2 (Code Delta)**: Inspect existing `generate_deck.js` to catalog every text block, speaker note, and structure, detailing exact visual replacements needed.
- **Explorer 3 (Extrapolation & Assets)**: Synthesize patterns for Slides 6, 7, 8 (Business Model, Impact, Closing) and map asset images.

### Phase 2: Synthesis & Worker Implementation
- Synthesize explorer findings into concrete implementation instructions.
- Dispatch Worker to refactor `generate_deck.js`, execute generation, and run office validation.

### Phase 3: Independent Review & Adversarial Challenge
- **Reviewer 1**: PPTX technical rules, ECMA-376 schema validation, DrawingML compliance, native editability.
- **Reviewer 2**: Text content preservation verification (verbatim check against original deck text).
- **Challenger 1**: Visual comparison against 5 reference screenshots via rendered slide images.
- **Challenger 2**: Layout stress testing (margins, contrast, text wrapping, absence of disallowed decorations).
- **Forensic Auditor**: Integrity verification (authentic implementation, no fake or bypassed checks).

### Phase 4: Gate Evaluation & Delivery
- Collect all handoffs and verdicts in `GATE_STATUS.md`.
- Ensure strict ALL-PASS criteria before reporting completion to parent agent.
