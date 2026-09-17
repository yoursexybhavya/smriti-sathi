# Execution Plan: Herodotus Pitch Deck 7-Slide Reference Match

## Objective
Rewrite `generate_deck.js` to produce `Herodotus_Pitch_Presentation.pptx` that precisely matches all 7 reference screenshots (`reference_slide1_cover.png` to `reference_slide7_closing.png`) while preserving all existing text content, speaker notes, and judging criteria coverage.

## Ground Truth References
1. `reference_slide1_cover.png` — Cover (Letterbox, Taj Mahal pin, Amer Fort sunset hero, giant HERODOTUS title)
2. `reference_slide2_problem.png` — Problem (Split ~55/45, 3 stacked dark cards, GPS coords, two-tone Cambria headline)
3. `reference_slide3_solution.png` — Solution (India map outline with zoom hierarchy, Amer Fort photo strip, cream UI audio card)
4. `reference_slide4_product.png` — Product Experience (Browser mockup chrome, interactive map, 4-step vertical journey)
5. `reference_slide5_tech.png` — Technical Feasibility (5-step horizontal flow, MVP-first badge, stretch cards)
6. `reference_slide6_impact.png` — Impact & Value (Timeline connectors, 3 large cards DISCOVER/UNDERSTAND/PLAN, 3 description blocks)
7. `reference_slide7_closing.png` — Closing (Split layout, stone sculpture photo, QR code placeholder, two-tone headline)

## Milestones & Phases

### Phase 1: Survey & Ground Truth Extraction
- **teamwork_preview_spec_miner (spec_miner_1)**: Inspect all 7 reference screenshots using view_file, map precise element layouts, positions, colors, and typography hierarchy. Verify slide count (7 reference slides) vs prior 8 slides and how content maps.
- **teamwork_preview_explorer (explorer_1)**: Deep-dive into current `generate_deck.js` and test suites to catalog text strings, speaker notes, judging criteria, and pptxgenjs implementation gaps.
- **teamwork_preview_explorer (explorer_2)**: Detailed visual comparison of current compiled slides vs the 7 reference screenshots, identifying exact mismatches in shapes, icons, cards, and coordinates.

### Phase 2: Implementation
- **teamwork_preview_worker (worker_1)**: Rewrite `generate_deck.js` to produce the presentation matching all 7 reference screenshots with exact coordinates, native PresentationML objects, safe fonts, proper margins (>=0.5"), and compile the PPTX.

### Phase 3: Independent Verification & Audit
- **teamwork_preview_reviewer (reviewer_1, reviewer_2)**: Slide-by-slide visual match verification against reference screenshots, layout inspection, and criteria check.
- **teamwork_preview_challenger (challenger_1, challenger_2)**: Empirical verification with automated scripts (OpenXML parsing, geometry constraints, text preservation, margin checks).
- **teamwork_preview_auditor (auditor_1)**: Forensic integrity audit (authenticity, no rasterization shortcuts, genuine PresentationML).

### Phase 4: Gate Check & Completion Report
- Strictly enforce gate conditions (Build passes, 2x APPROVE, 2x CONFIRM, CLEAN audit).
- Synthesize findings and report completion to Sentinel via `send_message`.
