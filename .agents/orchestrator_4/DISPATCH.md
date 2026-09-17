## 2026-09-15T03:08:39Z

You are the Project Orchestrator for the visual redesign of the Herodotus pitch deck.

Working directory: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_4
Project root: /Users/krishnajangid/Documents/antigravity/peaceful-hertz
Authoritative Request: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/ORIGINAL_REQUEST.md (see the latest "Follow-up — 2026-09-15T03:07:13Z" section)
Existing generator: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js
Output presentation: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx

Your mission:
Restyle the existing Herodotus pitch deck to match the specific cinematic dark-editorial design system shown in 5 reference screenshots.
KEEP ALL EXISTING TEXT CONTENT UNCHANGED. This is purely a visual/UI redesign of generate_deck.js.

CRITICAL FIRST STEP:
View all 5 reference screenshots before doing implementation work:
- /Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide1_cover.png
- /Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide2_problem.png
- /Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide3_solution.png
- /Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide4_product.png
- /Users/krishnajangid/Documents/antigravity/peaceful-hertz/reference_slide5_tech.png

Core Design System:
1. ALL DARK — deep near-black backgrounds (BG_DARK: 0D0B09 or 12100E) across all 8 slides.
2. Color palette:
   - BG_DARK: 0D0B09
   - CARD_DARK: 1A1714
   - CARD_BORDER: 2E2A25
   - GOLD: C69214
   - GOLD_LIGHT: D4A856
   - TEXT_WHITE: FFFFFF
   - TEXT_CREAM: E8E0D4
   - TEXT_MUTED: 8A8279
   - UI_CREAM: F5F0E8 (for light UI mockup cards only)
3. Typography:
   - Section label: Calibri 10-11pt GOLD, ALL CAPS, letter-spaced (charSpacing: 3-4)
   - Headlines: Cambria 36-44pt TEXT_WHITE bold, left-aligned, dramatic, with gold accent on second or key line
   - Body: Calibri 12-14pt TEXT_CREAM
   - Card title: Calibri 14-16pt TEXT_WHITE bold
   - Card body: Calibri 11-12pt TEXT_MUTED
   - Coordinates/GPS: Calibri 9-10pt TEXT_MUTED ALL CAPS letter-spaced in top-right
   - Bottom nav/labels: Calibri 9pt TEXT_MUTED ALL CAPS
   - Gold italic tagline: Cambria 22-28pt GOLD italic right-aligned
4. Layout patterns:
   - Pattern A (Full-Bleed Photo Cover): Slide 1 and Slide 8 (Closing)
   - Pattern B (Half-Bleed Photo + Dark Cards): Slide 2 and Slide 7 (Impact)
   - Pattern C (Map + UI Mockup): Slides 3 and 4
   - Pattern D (Architecture Flow): Slide 5 and Slide 6 (Business Model)
5. Visual motifs:
   - Gold dashed/dotted lines
   - GPS coordinates in top-right corner of slides
   - Section numbering (e.g. "01 — THE PROBLEM") in gold caps
   - Gold accent on second headline line
   - Small icons in top-right of cards
   - Editorial proportions with generous margins
   - Darkened monument photo overlays
   - Subtle India map outlines
6. Strict pptxgenjs technical rules:
   - LAYOUT_WIDE (13.333" x 7.5")
   - Hex colors WITHOUT #
   - Never share option objects
   - Shadow offset >= 0
   - charSpacing not letterSpacing
   - Safe fonts: Calibri, Cambria
   - NO accent lines under titles; NO decorative color bars or accent stripes
   - Every text element must be a native PowerPoint text box (fully editable)
   - Speaker notes on all 8 slides

Maintain your plan.md, progress.md, context.md, and briefing in your working directory.
When complete, run validation and report completion to parent.
