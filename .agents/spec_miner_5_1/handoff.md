# Handoff Report: Reference Screenshot Ground-Truth Specification

**Agent**: `spec_miner_5_1` (Reference Screenshot Spec Miner)  
**Working Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/spec_miner_5_1`  
**Date**: 2026-09-15T04:42:00Z  
**Target Milestone**: Reference Screenshot Spec Mining & Architectural Alignment  

---

## 1. Observation

1. **Reference Screenshot Visual Analysis (`view_file`)**:
   - `reference_slide1_cover.png`: Widescreen canvas, full-bleed Amer Fort/Taj Mahal sunset photo, deep dark gradient overlay on left, black letterbox bars at top/bottom. Top bar contains `IDEA FORGE 2026 — PITCH-A-THON` (gold, caps) and `27.1751° N · 78.0421° E · AGRA, IN` (muted). Supertitle `A MAP-FIRST DIGITAL HERITAGE EXPERIENCE`. Massive serif title `HERODOTUS` (~76pt white). Subtitle `EXPLORE INDIA'S MONUMENTS, ONE MAP AT A TIME`. Faint India map outline on right with glowing gold pin at Agra and label `TAJ MAHAL / AGRA / MONUMENT RECORD · IN-UP-001`. Bottom bar has `TEAM HERODOTUS` and `MAP · STORY · AUDIO · VISIT` with dashed gold line and target reticle `(o)` aligned with Agra.
   - `reference_slide2_problem.png`: Split layout (~58% left photo / 42% right dark canvas). Left shows Hawa Mahal with dark gradient overlay, gold header `02 — THE PROBLEM`, top-right GPS `26.9239° N · 75.8267° E JAIPUR, IN`. Dual-tone headline: `YOU'RE STANDING IN FRONT OF HISTORY.` (white) / `BUT WHERE'S THE STORY?` (gold). Sub-copy `THE HISTORY IS THERE. / THE DIGITAL EXPERIENCE IS FRAGMENTED.`. Bottom rule has 4 'X' markers `─────── X ─────── X ─────── X ─────── X ───────`. 3 gold pins on Hawa Mahal windows connect via horizontal leader lines to 3 dark stacked cards on right (`01 INFORMATION IS SCATTERED` with search icon, `02 VISITOR DETAILS ARE FRAGMENTED` with clock icon, `03 THE EXPERIENCE LACKS CONTEXT` with waveform icon).
   - `reference_slide3_solution.png`: Dark canvas (`0D0B09`) with faint coordinate grid. Header: `03 — THE SOLUTION`, headline `WHAT IF THE MAP / COULD TELL THE STORY?`, subhead `Explore India's monuments through one map-first experience.`. Top-right italic serif quote: `One map. / Every monument. / One tap away.`. Left column has framed National View container with India map, monument pins, Jaipur reticle, and 4-level vertical zoom stack (`01 INDIA`, `02 RAJASTHAN`, `03 JAIPUR`, `04 MONUMENT`). Dashed gold arcs connect Jaipur pin to zoom stack, and zoom stack to the right-side Amer Fort UI Card. UI card features Amer Fort photo, thumbnail strip, UNESCO badge, `AMER FORT` title, coordinates, dark audio player with waveform and `BROWSER TTS`, timings `08:00 — 18:00`, fees `₹200 IND / ₹1,000 INTL`, and buttons `VIEW TICKETS` and `GET DIRECTIONS ↗`.
   - `reference_slide4_product.png`: Dark canvas with grid. Header: `04 — PRODUCT EXPERIENCE`, headline `FROM MAP TO MONUMENT IN SECONDS.`, top-right breadcrumbs `MAP → MONUMENT → STORY / → AUDIO → VISITOR INFO`. Left column contains full browser mockup frame with 3 dots, URL pill `herodotus.app/explore`, app bar with `HERODOTUS` logo, search bar, filters (`ALL ERAS`, `FORTS`, `TEMPLES`), map canvas, and floating Amer Fort modal (matching Slide 3, with `BROWSER SPEECH API` tag). Right column has 4-step vertical journey (`01 ZOOM`, `02 TAP`, `03 LISTEN`, `04 PLAN`) with connector lines and gold icons, plus a bottom-right "Reserved Live Prototype" card.
   - `reference_slide5_tech.png`: Dark canvas with subtle stone jali lattice photo texture (`tech_architecture_warm_1789436115529.jpg`) across right half with ~90% transparency. Header: `05 — TECHNICAL FEASIBILITY`, headline `SIMPLE ARCHITECTURE.` (white) / `POWERFUL EXPERIENCE.` (gold). Top-right badge `MVP-FIRST ARCHITECTURE`. Center features 5-step horizontal flow (`01 USER` → `02 MAP` → `03 STORY` → `04 DATA` → `05 WEB`) linked by dashed gold arrows. Right side has `WHY IT SHIPS` card and `DEPLOY SURFACE` callout. Below nodes is an architecture circuit bus dropping to a baseline with label `EXISTING, PROVEN BUILDING BLOCKS — NO CUSTOM SERVER, NO DATABASE LAYER IN THE MVP`. Bottom section has `STRETCH / NEXT` with 3 bordered cards (`3D MAP EXPERIENCES`, `MULTI-LANGUAGE AUDIO`, `SEARCH & FILTERS`).
   - `reference_slide6_impact.png`: Dark canvas with subtle darkened heritage monument silhouette photo across right ~45% of background. Header: `06 — IMPACT & VALUE`, headline `THREE THINGS.` (white) / `ONE EXPERIENCE.` (gold). Top-right quote `Discovery, storytelling and / visitor planning in one flow.`. Center has 3-segment dashed timeline `(o) - - - -` above 3 equal-width dark cards (`01 DISCOVER`, `02 UNDERSTAND`, `03 PLAN`) with gold icons and subtitles. Directly below are 3 value pillar blocks (`TOURISM & HERITAGE`, `INDEPENDENCE`, `ACCESSIBILITY`). Bottom has synthesis statement `HERODOTUS CONNECTS DISCOVERY, STORYTELLING AND VISITOR PLANNING IN ONE MAP-FIRST EXPERIENCE.` and GPS coordinates `26.2967°N 73.0182°E`.
   - `reference_slide7_closing.png`: Asymmetric split composition. Right ~48% features macro photograph of the carved stone chariot wheel of Hampi with warm side-lighting; left ~52% has dark canvas. Letterbox bars top/bottom. Top bar has `IDEA FORGE 2026 — PITCH-A-THON` with gold rule. Massive headline: `HISTORY IS EVERYWHERE.` (white, 46pt serif) / `NOW, IT CAN SPEAK.` (gold, 46pt serif). Gold rule + brand block `HERODOTUS` / `EXPLORE. LISTEN. DISCOVER.`. Gold dashed curve trajectory arcs from bottom-left reticle `(o)` up to Hampi coordinates on the chariot wheel (`15.3350° N · 76.4600° E HAMPI, KARNATAKA`). Bottom-right has dashed gold square QR box with `SCAN · LIVE DEMO` and prompt `Try the prototype / from your phone.`. Bottom-left has `TEAM HERODOTUS` / `A MAP-FIRST DIGITAL HERITAGE EXPERIENCE`.

2. **Mathematical Geometry & Aspect Ratio**:
   - Python analysis (`.venv/bin/python3`) confirmed:
     - Image dimensions: 1024 × 665 px.
     - Letterbox / Window border: Top rows 0..54 (55px), bottom rows 632..664 (33px).
     - Active content area: Y = 55 to 631 (height = 576 px).
     - Ratio: `1024 / 576 = 1.7778` — **Exactly 16:9 Widescreen (`13.333" × 7.5"`)**.

3. **Current Codebase Discrepancies (`generate_deck.js`)**:
   - `generate_deck.js` currently generates 8 slides.
   - Slide 6 is currently a custom "Business Model & Scalability" slide that diverges from `reference_slide6_impact.png`.
   - Slide 7 is currently an impact slide with the family photo (`indian_family_heritage_1789408698290.jpg`), whereas in the reference screenshots, Slide 6 is `06 — IMPACT & VALUE` and Slide 7 is the Closing slide with the Hampi stone chariot wheel and live QR code.
   - Slide 8 in `generate_deck.js` is an outdated closing slide.

---

## 2. Logic Chain

1. **Step 1 (Ground-Truth Source Priority)**:
   - The user provided 7 high-resolution reference screenshots labeled `reference_slide1_cover.png` through `reference_slide7_closing.png`. Per dispatch instructions, these screenshots represent the absolute ground truth for layout, colors, typography, element positioning, and visual motifs.

2. **Step 2 (Slide Count & Architecture Reconciliation)**:
   - The reference screenshots contain explicit, verbatim section labels:
     - Slide 2: `02 — THE PROBLEM`
     - Slide 3: `03 — THE SOLUTION`
     - Slide 4: `04 — PRODUCT EXPERIENCE`
     - Slide 5: `05 — TECHNICAL FEASIBILITY`
     - Slide 6: `06 — IMPACT & VALUE`
     - Slide 7: Closing / Vision & CTA
   - There are exactly 7 slides in the reference deck. Slide 6 unifies Value Proposition, Business Model, and Social Impact into three pillars (`DISCOVER`, `UNDERSTAND`, `PLAN`) with three domain blocks (`TOURISM & HERITAGE`, `INDEPENDENCE`, `ACCESSIBILITY`).
   - Consequently, rewriting `generate_deck.js` to produce the 7 slides matching the reference screenshots 1:1 resolves all visual divergence.

3. **Step 3 (Color & Contrast Logic)**:
   - All slides utilize `BG_DARK: '0D0B09'` with warm dark cards (`1A1714`) and borders (`2E2A25`).
   - Heritage Gold (`C69214`) is used as a functional accent: section numbers, headline emphasis (Line 2), dashed connector lines, target reticles, and key badge borders.
   - Light Cream UI Card (`UI_CREAM: 'F5F0E8'`) on Slides 3 and 4 provides sharp visual contrast for the product mockup while retaining dark background coherence across the deck.

4. **Step 4 (Validation Compatibility)**:
   - The reference design features letterbox bars, top text at `y ≈ 0.32"–0.35"`, and fine decorative lines (0.75pt–1.2pt).
   - In pptxgenjs, all elements must be created as native PowerPoint shapes (`pres.shapes.RECTANGLE`, `pres.shapes.LINE`, `pres.shapes.OVAL`) with fresh option objects, preventing DrawingML mutations and ensuring clean ECMA-376 schema validation.

---

## 3. Caveats

- **Photo on Slide 6**: `ORIGINAL_REQUEST.md` § 437 previously stated "Dark background, NO PHOTO on this slide". However, empirical inspection of `reference_slide6_impact.png` confirms a subtle heritage monument silhouette photograph is present on the right half. The visual artifact takes precedence, and the photo should be included with high transparency (~85–90%) or dark overlay.
- **Hampi Stone Chariot Asset**: In `reference_slide7_closing.png`, the background photo is the stone chariot wheel of Hampi. In local assets, `closing_monument_1789403341798.jpg` or `visitor_monument_1789383102153.jpg` serves as the closest local match.
- **Legacy Margin Tests**: Any old automated test scripts that strictly enforce `y >= 0.5"` will flag the letterbox text at `y ≈ 0.35"`. The test assertions should accommodate letterbox banner elements at `y >= 0.12"`.

---

## 4. Conclusion

1. The authoritative pitch presentation architecture consists of **7 cohesive slides** matching `reference_slide1_cover.png` through `reference_slide7_closing.png`.
2. All 5 judging criteria are thoroughly addressed across these 7 slides.
3. Every slide element (text boxes, cards, connector rules, reticles, icons, browser mockup, and QR box) can be synthesized cleanly as native, editable PowerPoint objects in `generate_deck.js` using `pptxgenjs`.
4. Detailed specifications for all 7 slides, color tokens, typography scales, and coordinate mappings have been committed to `.agents/spec_miner_5_1/spec_report.md`.

---

## 5. Verification Method

To independently verify these findings:
1. **Inspect Reference Screenshots**:
   - Run `view_file` on `reference_slide1_cover.png` through `reference_slide7_closing.png`.
2. **Inspect Specification Document**:
   - View `.agents/spec_miner_5_1/spec_report.md` to review the exhaustive element tables and layout coordinates.
3. **Verify Geometry via Python**:
   - Run:
     ```bash
     .venv/bin/python3 -c "
     from PIL import Image
     import glob
     for f in sorted(glob.glob('reference_slide*.png')):
         im = Image.open(f)
         print(f, im.size)
     "
     ```
   - Confirms all 7 images are 1024 × 665 px with 16:9 active content areas.
