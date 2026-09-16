# Handoff Report: Herodotus Pitch Presentation Specification Mining

**From**: `spec_miner_r2_1`  
**To**: Orchestrator (`parent`, ID `390eca83-5bc5-48d8-92ff-188452987fa0`)  
**Timestamp**: 2026-09-15T01:43:00Z  
**Type**: Hard Handoff (Task Complete)

---

## 1. Observation

1. **Original Request Content (`.agents/ORIGINAL_REQUEST.md`)**:
   - Initial Request (lines 1–119): Establishes the 8-slide structure, 16:9 widescreen layout (`LAYOUT_WIDE`: $13.333" \times 7.5"$), mixed sandwich theme (dark cover/closing, light interior), 5 official judging criteria (Innovation, Feasibility, Impact, Presentation, Business Model), and technical pptxgenjs constraints.
   - Follow-up Request (lines 120–238, timestamp `2026-09-15T01:38:07Z`): Identifies the core problem that the current deck looks sterile, minimal, and AI-generated with too much flat white space, images on only 3–4 slides, clinical geometric grids, and soulless typography.
   - Mandates a warm, human, editorial redesign where:
     - **Every slide must have photography** (all 8 slides).
     - **All 9 available images** must be utilized.
     - Photographic techniques include semi-transparent background images (`transparency: 85-92`), half-bleed compositions (40–50% width), inset photos ($3"-4"$ wide), photo strips, and full-bleed monument backgrounds with dark overlays for Cover and Closing.
     - Warm color palette: heritage gold `C69214`, sandstone `D4A574`, terracotta accents, warm subtle background `F5F3EF` (not pure white `FFFFFF`).
     - Asymmetric layouts: offset elements, varied column widths (60/40 splits), no clinical uniform grids (at least 2 asymmetric slides).
     - Typography: `Cambria` for headlines (big 44–48pt), `Calibri` for body, scale contrast with 10–12pt captions.
     - Strict prohibitions: NEVER accent lines under titles; NEVER decorative color bars or accent stripes; margins $\ge 0.5"$; no text overflow.

2. **Physical Asset Verification (Filesystem)**:
   - Executed verification script using `.venv/bin/python3` across the 9 image paths in `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/`:
     ```text
     hero_monument: EXISTS, size=919807 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     heritage_problem_scene: EXISTS, size=1009804 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     phone_audio_guide: EXISTS, size=721446 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     india_heritage_map: EXISTS, size=737662 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     tech_architecture_warm: EXISTS, size=1072597 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     human_traveler_heritage: EXISTS, size=832623 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     indian_family_heritage: EXISTS, size=911046 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     closing_monument: EXISTS, size=866216 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     visitor_monument: EXISTS, size=941679 bytes, dim=(1376, 768), ratio=1.792, format=JPEG
     ```
   - Every image exists, is uncorrupted, and matches the 16:9 widescreen ratio (1.792).

3. **Current Implementation Analysis (`generate_deck.js`)**:
   - `generate_deck.js` (1,890 lines, 53,430 bytes) constructs 8 slides with pptxgenjs v4.0.1.
   - Current deck uses only 4 images:
     - Line 325: `IMG_HERO_MONUMENT` (Slide 1, Cover — right inset picture)
     - Line 429: `IMG_VISITOR` (Slide 2, Problem — left inset picture)
     - Line 832: `IMG_HERITAGE_MAP` (Slide 4, Demo — app screen)
     - Line 1543: `IMG_FAMILY` (Slide 7, Impact — left inset picture)
     - Line 1780: `IMG_CLOSING` (Slide 8, Closing — right inset picture)
   - Slides 3, 5, and 6 contain ZERO photos.
   - Slides 1 and 8 use flat solid dark navy rectangles (`1E2761`) rather than full-bleed monument photos with dark overlays.
   - Content slides use cold light blue-white (`F8F9FC` / `FFFFFF`).

4. **Technical Feasibility Probing (`validate.py` & Node.js Execution)**:
   - Probed `slide.addImage({ ... transparency: 90 })` in Node.js and compiled `.pptx`. Verified via `.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py`. Result: `All validations PASSED!`.
   - Probed semi-transparent dark overlay rectangle over background image in Node.js. Result: `All validations PASSED!`.
   - Probed `slide.background = { color: 'F5F3EF' }`. Result: `All validations PASSED!`.
   - Tested baseline deck validation: `.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`. Result: `All validations PASSED!`.

---

## 2. Logic Chain

1. **Starting Point**: The user and follow-up prompt demand that the presentation abandon its sterile, AI-generated look and adopt a warm, human, editorial aesthetic while strictly preserving its native-editable PowerPoint architecture, 8 slides, 5 judging criteria, and speaker notes.
2. **Asset Allocation Logic**:
   - There are 9 unique images on disk and 8 slides in the deck.
   - Slide 1 (Cover) requires a grand architectural hook $\rightarrow$ `hero_monument` (Amer Fort sunset) as full bleed with dark overlay.
   - Slide 2 (The Problem) focuses on tourist disorientation at monuments $\rightarrow$ `heritage_problem_scene` (frustrated tourist at eroded ASI sign) as a 45% half-bleed left.
   - Slide 3 (Innovation & Originality) highlights spatial paradigm shift and audio guide usage $\rightarrow$ `phone_audio_guide` (woman with phone/earbuds at fort) as an editorial inset.
   - Slide 4 (Demo & Experience) showcases the live PWA UI $\rightarrow$ `india_heritage_map` (dark vector map) inside the phone frame + `human_traveler_heritage` (traveler at palace courtyard) as an editorial visual strip.
   - Slide 5 (Feasibility & Tech) requires architectural texture behind complex stack layers $\rightarrow$ `tech_architecture_warm` (stone jali lattice) full-bleed with `transparency: 88`.
   - Slide 6 (Business Model & Scalability) addresses scaling across vast heritage sites $\rightarrow$ `visitor_monument` (visitor dwarfed by giant temple archway) as an inset photo balancing monetization pillars.
   - Slide 7 (Impact & Social Relevance) focuses on generational connection and heritage inclusion $\rightarrow$ `indian_family_heritage` (grandfather & grandson) as a 42% half-bleed left.
   - Slide 8 (Closing / Vision) requires a lasting, illuminated monument impression $\rightarrow$ `closing_monument` (illuminated fort gateway at twilight) as full bleed with dark overlay.
   - *Deduction*: This 1:1 and 2:1 distribution ensures 100% asset utilization (all 9 images) and guarantees that every single slide has photography, with 5 slides using background/half-bleed compositions (exceeding the $\ge 3$ requirement).
3. **Stylistic Transformation Logic**:
   - Transitioning from `FFFFFF` / `F8F9FC` to `F5F3EF` replaces the sterile, hospital-grade white with a tactile, editorial paper tone.
   - Injecting Heritage Gold `C69214`, Sandstone `D4A574`, and Terracotta `C2410C` establishes immediate cultural resonance with Indian sandstone and Mughal/Rajput architecture.
   - Asymmetric layouts (45/55 on Slide 2, 60/40 on Slide 6, 42/58 on Slide 7) break the rigid, predictable box-grid rhythm that signals automated generation.
   - Elevating headlines to 44–48pt `Cambria` (bold serif) introduces human editorial drama, supported by clean `Calibri` body and 10–12pt metadata captions.
4. **DrawingML & OpenXML Compliance Logic**:
   - Because pptxgenjs mutates options in place into EMU units, immutable factory functions must instantiate fresh option objects for every single shape, image, and text box call.
   - Negative shadow offsets, hex hashes (`#`), and literal bullets (`•`) are confirmed schema corruptors and must be systematically avoided.
   - Native editable text boxes must never be replaced with pre-rendered raster text cards.

---

## 3. Caveats

1. **Font Rendering Slack**: `Cambria` and `Calibri` are Office safe-list fonts that render true-to-width in LibreOffice and PowerPoint. However, because headlines are expanded to 44–48pt, container widths must include 10–15% breathing slack to prevent unexpected wrapping on different OS DPI scalings.
2. **Z-Order Layering Discipline**: DrawingML has no explicit CSS-style `z-index`. Stacking order is strictly determined by insertion sequence. On slides utilizing semi-transparent background images or full-bleed photos, `slide.addImage()` must execute first, followed by overlay shapes/cards, followed by text boxes and badges last.
3. **Asset Directory Permanence**: Image paths are grounded in `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/`. The generator must reference these absolute paths directly.

---

## 4. Conclusion

1. The specification has been thoroughly mined, verified against the filesystem and execution runtime, and formalized in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/spec_miner_r2_1/spec_report.md`.
2. All 9 heritage photograph assets exist on disk and have been mapped to specific roles across all 8 slides.
3. Complete technical design constraints, color tokens, typography parameters, asymmetric layout schemas, and acceptance criteria have been established to guide the redesign implementation.
4. The plan is actionable, scoped, and fully compliant with the project constraints.

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Asset Filesystem Status**:
   ```bash
   .venv/bin/python3 -c "
   import os
   paths = [
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/hero_monument_1789383083590.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/heritage_problem_scene_1789435962154.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/phone_audio_guide_1789436084142.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/india_heritage_map_1789407014836.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/tech_architecture_warm_1789436115529.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/human_traveler_heritage_1789408640689.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/indian_family_heritage_1789408698290.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/closing_monument_1789403341798.jpg',
     '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg'
   ]
   for p in paths:
     assert os.path.exists(p), f'Missing: {p}'
   print('All 9 images verified!')
   "
   ```

2. **Inspect Specification Report**:
   - Inspect `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/spec_miner_r2_1/spec_report.md` for complete feature enumeration and edge case tables.

3. **Verify Baseline Presentation Schema**:
   ```bash
   .venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx
   ```
