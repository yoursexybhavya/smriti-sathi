# Dispatch to Worker (worker_r2_1)

## Objective
Implement the warm, human, editorial redesign of the Herodotus pitch deck in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`, compile `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`, and verify it passes validation cleanly.

## Exclusive File Ownership
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js` (Exclusive write ownership)
- Target output: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. Read `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/ORIGINAL_REQUEST.md`.
2. Read the synthesized plan in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_2/SCOPE.md`.
3. Read the analysis in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_1/analysis.md` and technical report in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_2/technical_report.md`.

## Detailed Redesign Specifications
1. **Warm Palette**:
   - Canvas background for interior slides (2–7): `F5F3EF` (warm limestone/parchment)
   - Dark slide base / overlay: `12100E` (rich umber)
   - Heritage Gold: `C69214`
   - Sandstone: `D4A574`
   - Sandstone Border: `E8E2D8`
   - Terracotta Accent: `B85042` / `C2410C`
   - Card background: `FAF8F5` or `FFFFFF` with sandstone borders
   - Body Text: `2C241D` / `4A3E36` (warm dark charcoal)
   - White / Light Text: `FFFFFF` / `FDFBF7`

2. **Typography**:
   - Headlines: `Cambria` (bold serif) 34–46pt
   - Kickers / Subtitles: `Calibri` (bold uppercase) 11–13pt
   - Body: `Calibri` 13–15pt
   - Badges / Captions: `Calibri` 10–12pt
   - Ensure ample bounding box width and height to prevent wrapping or overflow.

3. **All 9 Heritage Photographs Across All 8 Slides**:
   - **Slide 1 (Cover)**: Full-bleed `hero_monument_1789383083590.jpg` (`x: 0, y: 0, w: 13.333, h: 7.5`), followed by dark umber overlay shape (`fill: { color: '12100E', transparency: 25 }`), with gold/white native text boxes and MVP ready badge on top.
   - **Slide 2 (The Problem)**: Asymmetric 42% half-bleed left panel `heritage_problem_scene_1789435962154.jpg` (`x: 0.8, y: 1.4, w: 5.0, h: 5.4`, `sizing: { type: 'cover' }`) with caption; right side (60/40 feel) with 3 warm stacked problem cards.
   - **Slide 3 (Innovation & Originality)**: Criterion 1 badge, asymmetric layout with left comparative cards, right side photo panel `india_heritage_map_1789407014836.jpg` showing spatial discovery engine.
   - **Slide 4 (Product Experience / Demo)**: Criterion 4 badge, human photo inset `phone_audio_guide_1789436084142.jpg` (woman with audio guide on-site) breaking up the demo + PWA live workflow cards.
   - **Slide 5 (Feasibility & Technical Viability)**: Full-bleed background image `tech_architecture_warm_1789436115529.jpg` (stone jali lattice) with `transparency: 90` added first, followed by 5 modular architecture cards, 3 key metrics, and Criterion 2 badge.
   - **Slide 6 (Business Model & Scalability)**: Criterion 5 badge, 3 monetization pillars, 3-stage scalability roadmap, featuring BOTH `human_traveler_heritage_1789408640689.jpg` and `visitor_monument_1789383102153.jpg` as visual anchors.
   - **Slide 7 (Impact & Social Relevance)**: Criterion 3 badge, asymmetric 42% half-bleed left photo panel `indian_family_heritage_1789408698290.jpg` (`x: 0.8, y: 1.4, w: 5.0, h: 5.4`), right side with 3 warm impact cards.
   - **Slide 8 (Closing & Vision)**: Full-bleed `closing_monument_1789403341798.jpg` (`x: 0, y: 0, w: 13.333, h: 7.5`), dark umber overlay shape (`fill: { color: '12100E', transparency: 25 }`), gold/white typography, 3 readiness pillars, demo URL, Q&A invitation.

4. **Critical pptxgenjs Rules**:
   - `pres.layout = 'LAYOUT_WIDE'` (13.333" × 7.5")
   - Fresh option objects for every `add*` call (pptxgenjs mutates objects).
   - Hex colors WITHOUT `#` prefix.
   - Margins >= 0.5" from all slide edges.
   - NO accent lines under titles.
   - NO decorative color bars or accent stripes.
   - NO text overflow.
   - Every text element is a native PowerPoint textbox.
   - Speaker notes on all 8 slides via `slide.addNotes("...")`.

5. **Validation Commands to Run**:
   - `node generate_deck.js`
   - `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`
   - Must pass with 0 errors.

6. **Deliverables**:
   - Write updated `generate_deck.js`.
   - Run compilation and validation.
   - Write `implementation_report.md` and `handoff.md` in your working directory `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/worker_r2_1/`.
   - Notify parent via `send_message`.

## 2026-09-15T01:44:21Z
Received dispatch invocation:
Implement the complete warm, editorial redesign of generate_deck.js.
- Warm color palette (F5F3EF, 12100E, C69214, D4A574, E8E2D8, B85042, etc.)
- Typography: Cambria headlines (34-46pt), Calibri body (13-15pt), uppercase kickers (11-13pt), captions (10-12pt)
- All 9 heritage photos across all 8 slides
- Critical pptxgenjs technical rules
- Validate with validate.py, ensure 0 errors.
- Write implementation_report.md and handoff.md, notify parent.
