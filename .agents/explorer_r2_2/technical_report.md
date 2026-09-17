# Technical Investigation Report — Image Assets, pptxgenjs Capabilities, and Validation Environment

**Author**: `explorer_r2_2`  
**Date**: 2026-09-15T01:45:00Z  
**Project**: Herodotus Pitch Presentation (`peaceful-hertz`)  
**Integrity Mode**: Development / Read-Only Investigation  

---

## 1. Executive Summary

This investigation analyzed all 9 heritage image assets, decoded the underlying implementation of image transparency, overlays, and sizing in `pptxgenjs` 4.0.1, diagnosed the Python execution environment, and performed baseline validation of the existing `Herodotus_Pitch_Presentation.pptx`.

### Key Discoveries:
1. **All 9 image assets exist and are identical in geometry**: Every image is exactly **1376 × 768 pixels** (aspect ratio 1.7917, widescreen landscape). There are no portrait or square source images.
2. **Image transparency works via `addImage` with `transparency: 0-100`**: It generates `<a:alphaModFix amt="...">` in the OOXML `<a:blip>`. However, `slide.background = { path: ... }` does **NOT** support transparency. Full-bleed and background images requiring transparency or overlays MUST be added via `slide.addImage()`.
3. **Z-ordering preserves native text editability**: In `pptxgenjs`, objects are added sequentially to `<p:spTree>`. An image added first sits behind overlay shapes and text boxes. Foreground text boxes remain 100% native, selectable, and editable in PowerPoint.
4. **`sizing: { type: 'cover' }` mechanics**: pptxgenjs calculates `a:srcRect` cropping percentages by comparing `{ w: options.w, h: options.h }` against `{ w: sizing.w, h: sizing.h }`. To crop landscape images into portrait/half-bleed columns, `options.w` and `options.h` must reflect the source aspect ratio.
5. **Python validation environment nuance**: System `/usr/bin/python3` fails due to unaccepted Xcode licenses (exit code 69). The project virtual environment at `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3` (Python 3.11.16) runs cleanly and validates OOXML successfully with `validate.py`.
6. **Existing presentation baseline**: `Herodotus_Pitch_Presentation.pptx` passes `validate.py` XML schema checks, but suffers severe visual design defects: Slides 3, 5, and 6 have **zero photography**, and Slides 1 and 8 use flat solid navy backgrounds instead of full-bleed monument photos.

---

## 2. Image Assets Inspection & Analysis

All 9 images located at `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/` were verified on disk and analyzed using Python PIL and `ImageStat`.

### Asset Specifications Table

| # | Filename | Dimensions | Aspect Ratio | Orientation | File Size | Mean RGB | Brightness (0-255) | Warmth (R-B) | Visual Tone & Subject |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `hero_monument_1789383083590.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 898.2 KB | (93.8, 80.3, 66.2) | 80.1 | +27.6 | Moody golden-hour sunset over Amer Fort; warm sandstone glow, deep shadows. |
| 2 | `heritage_problem_scene_1789435962154.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 986.1 KB | (112.9, 96.1, 72.8) | 93.9 | +40.1 | Frustrated tourist examining dense, weathered ASI signboard; direct problem storytelling. |
| 3 | `phone_audio_guide_1789436084142.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 704.5 KB | (132.4, 102.2, 76.5) | 103.7 | +55.9 | Modern traveler listening to smartphone audio guide at fort rampart; product-in-use. |
| 4 | `india_heritage_map_1789407014836.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 720.4 KB | (32.7, 35.7, 37.9) | 35.4 | -5.3 | High-tech dark cartographic map of India with glowing spatial clusters and pins. |
| 5 | `tech_architecture_warm_1789436115529.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 1047.5 KB | (104.0, 74.0, 43.9) | 74.0 | +60.1 | Intricate carved stone jali lattice screen with sunlight streaming through geometric voids. |
| 6 | `human_traveler_heritage_1789408640689.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 813.1 KB | (127.4, 86.4, 55.8) | 89.9 | +71.7 | Solo traveler standing in sandstone palace courtyard among carved stone pillars. |
| 7 | `indian_family_heritage_1789408698290.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 889.7 KB | (132.8, 104.8, 84.6) | 107.4 | +48.2 | Grandfather and grandson smiling together at temple carving; high warmth, intergenerational connection. |
| 8 | `closing_monument_1789403341798.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 845.9 KB | (77.4, 55.3, 49.9) | 60.9 | +27.5 | Grand illuminated fort gateway at twilight; deep indigo sky meets warm stone lighting. |
| 9 | `visitor_monument_1789383102153.jpg` | 1376 × 768 | 1.7917 (~16:9) | Landscape | 919.6 KB | (119.8, 102.1, 87.9) | 103.3 | +31.9 | Visitor dwarfed by massive carved stone temple gateway; conveys monumental scale. |

### Recommended 8-Slide Image Pairing Plan

To satisfy the requirement that **every single slide contains photography** with warmth, varied layouts, and no solid white/navy voids:

| Slide # | Slide Title / Criterion | Primary Image Assigned | Secondary / Inset Image | Recommended Layout & Technique |
|---|---|---|---|---|
| **Slide 1** | **Cover** (Live MVP Ready) | `hero_monument_1789383083590.jpg` | — | **Full-bleed background** (`13.333" × 7.5"`), dark overlay shape (`fill: { color: '1E2761', transparency: 28 }`), bold Cambria headline + gold pill badge. |
| **Slide 2** | **The Problem** (Visitor Friction) | `heritage_problem_scene_1789435962154.jpg` | — | **Asymmetric half-bleed left** (`w: 5.2", h: 7.5"` or large panel `w: 5.0", h: 5.4"`), pairing human tourist frustration with problem metrics on the right. |
| **Slide 3** | **Innovation & Originality** (Spatial Discovery) | `india_heritage_map_1789407014836.jpg` | `visitor_monument_1789383102153.jpg` (or subtle texture) | **Asymmetric right visual panel** (`w: 5.4", h: 5.4"`), showcasing the glowing spatial clustering engine vs flat keyword search. |
| **Slide 4** | **Product Experience / Live Demo** | `phone_audio_guide_1789436084142.jpg` | Existing waveform graphic | **Hero product-in-use photo** (`w: 5.2", h: 3.6"`), showing the actual visitor experience anchored alongside the 4-step UX journey. |
| **Slide 5** | **Feasibility & Technical Viability** (Architecture) | `tech_architecture_warm_1789436115529.jpg` | — | **Full-slide semi-transparent background texture** (`transparency: 90%`) or left architectural panel, providing rich stone lattice depth beneath the 5-layer tech stack cards. |
| **Slide 6** | **Business Model & Scalability** | `human_traveler_heritage_1789408640689.jpg` | `visitor_monument_1789383102153.jpg` | **Right-side tourism anchor panel** (`w: 4.8", h: 4.8"`), connecting the 3 revenue streams (B2G, freemium, commerce) to real monument footfall. |
| **Slide 7** | **Impact & Social Relevance** | `indian_family_heritage_1789408698290.jpg` | — | **Asymmetric left photo panel** (`w: 5.2", h: 5.4"`), grounding multilingual access and generational connection in the grandfather-grandson photo. |
| **Slide 8** | **Closing** (Final Pitch Summary) | `closing_monument_1789403341798.jpg` | — | **Full-bleed background** (`13.333" × 7.5"`), dark overlay shape (`fill: { color: '1E2761', transparency: 30 }`), live demo URL callout and closing tagline. |

---

## 3. pptxgenjs Capabilities & Implementation Mechanics

### 3.1 Installed Library Details
- **Package**: `pptxgenjs`
- **Installed Version**: `4.0.1` (verified via `node_modules/pptxgenjs/package.json`)
- **Module format**: CommonJS / ES Modules supported

### 3.2 Image Transparency (`transparency: 0-100`)
- **OOXML Emission**: Lines 5556–5558 of `node_modules/pptxgenjs/dist/pptxgen.cjs.js`:
  ```javascript
  strSlideXml += `<a:blip r:embed="rId${slideItemObj.imageRid}">`;
  strSlideXml += slideItemObj.options.transparency ? `<a:alphaModFix amt="${Math.round((100 - slideItemObj.options.transparency) * 1000)}"/>` : '';
  strSlideXml += '</a:blip>';
  ```
- **Formula**: `amt = (100 - transparency) * 1000`.
  - For `transparency: 85`, `amt = 15000` (15% opacity).
  - For `transparency: 90`, `amt = 10000` (10% opacity).
  - For `transparency: 92`, `amt = 8000` (8% opacity).
- **Critical Limitation of `slide.background`**: When setting `slide.background = { path: '...' }`, pptxgenjs writes to `<p:bg>` which has **NO** `transparency` or `alphaModFix` support in pptxgenjs. Therefore:
  > **RULE**: Never use `slide.background = { path: ... }` for transparent backgrounds. Always use `slide.addImage({ x: 0, y: 0, w: '100%', h: '100%', transparency: 88-92 })` inserted as the first element on the slide.

### 3.3 Overlays and Native Text Box Editability (Z-Ordering)
- PPTX renders objects in the document order of `<p:spTree>`.
- In `pptxgenjs`, `slide._slideObjects` preserves insertion order:
  1. `slide.addImage(...)` (Layer 0: bottom background / photo)
  2. `slide.addShape(...)` (Layer 1: translucent contrast overlay or cards)
  3. `slide.addText(...)` (Layer 2: top native editable text boxes)
- Runtime inspection of generated OOXML confirms:
  ```xml
  <p:spTree>
    <p:pic> <!-- Image at bottom -->
      <p:blipFill><a:blip r:embed="rId1"><a:alphaModFix amt="15000"/></a:blip></p:blipFill>
    </p:pic>
    <p:sp> <!-- Translucent Overlay Shape -->
      <p:spPr><a:solidFill><a:srgbClr val="1E2761"><a:alpha val="70000"/></a:srgbClr></a:solidFill></p:spPr>
    </p:sp>
    <p:sp> <!-- Native Editable Text Box -->
      <p:txBody><a:p><a:r><a:t>Editable Title</a:t></a:r></a:p></p:txBody>
    </p:sp>
  </p:spTree>
  ```
- Result: Native PowerPoint text boxes are in the foreground. Users in PowerPoint or Keynote can click, highlight, and edit text directly without the background image or overlay blocking selection.

### 3.4 Sizing Mechanics (`sizing: { type: 'cover' | 'contain' | 'crop' }`)
- In `pptxgenjs` (lines 5056–5088 and 5560–5568):
  - `ImageSizingXml.cover` calculates horizontal crop (`hzPerc`) and vertical crop (`vzPerc`) for `<a:srcRect>`.
  - The ratio comparison uses `{ w: imgWidth, h: imgHeight }` where `imgWidth` comes from `options.w` and `imgHeight` comes from `options.h`.
  - If a user sets `w: 5.5, h: 7.5, sizing: { type: 'cover', w: 5.5, h: 7.5 }`, pptxgenjs assumes the source image has an aspect ratio of 5.5:7.5, resulting in `srcRect l="0" r="0" t="0" b="0"` (no cropping).
  - To properly crop a landscape photo (`1376 × 768`, aspect ratio 1.7917) into a 5.5" × 7.5" container:
    ```javascript
    slide.addImage({
      path: IMG_PATH,
      x: 0,
      y: 0,
      w: 13.438, // 7.5 * 1.7917 (source aspect ratio)
      h: 7.5,
      sizing: { type: 'cover', w: 5.5, h: 7.5, x: 0, y: 0 }
    });
    ```
    This produces `<a:srcRect l="27674" r="27674" t="0" b="0"/>` and sets the final container extension to `5.5" × 7.5"`.
- For full-bleed (13.333" × 7.5"):
  - `13.333 / 7.5 = 1.7778`.
  - `1376 / 768 = 1.7917`.
  - The aspect ratio difference is **0.77%**.
  - Direct assignment `x: 0, y: 0, w: 13.333, h: 7.5` is visually flawless, or `sizing: { type: 'cover', w: 13.333, h: 7.5 }` can be specified.

### 3.5 Shape Fill Transparency
- `fill: { color: '1E2761', transparency: 30 }` produces `<a:solidFill><a:srgbClr val="1E2761"><a:alpha val="70000"/></a:srgbClr></a:solidFill>`.
- Note the difference in units: `transparency: 30` in pptxgenjs means 30% transparent / 70% opaque, emitting `alpha val="70000"`.
- Tested and verified 100% compliant with ECMA-376 OOXML schema.

---

## 4. Python Validation Environment Verification

### 4.1 Python Executables Assessment
- **`/usr/bin/python3` (System)**:
  - Exits with code 69: `You have not agreed to the Xcode license agreements. Please run 'sudo xcodebuild -license' from within a Terminal window to review and agree to the Xcode and Apple SDKs license.`
  - **Verdict**: Unusable in this sandbox.
- **`/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3` (Virtualenv)**:
  - Python 3.11.16 (Apple Silicon arm64).
  - Preinstalled libraries verified: `defusedxml`, `lxml`, `PIL` (Pillow), `zipfile`, `markitdown`.
  - **Verdict**: 100% operational, fast, and stable.

### 4.2 Validation Script Assessment
- **Path**: `/Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py`
- **Validators bundled**: `DOCXSchemaValidator`, `PPTXSchemaValidator`, `RedliningValidator`.
- **Validation Checks executed**:
  1. Package relationship integrity (`_rels/.rels`, `ppt/_rels/presentation.xml.rels`).
  2. Content type declarations (`[Content_Types].xml`).
  3. PPTX slide XML validation against XSD schemas (`p:sld`, `p:spTree`, `p:pic`, `p:sp`, `p:txBody`).
  4. Native chart XML structure and axis definitions.

### 4.3 Baseline Run on Existing Presentation
- Command executed:
  `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`
- Output: `All validations PASSED!`
- Exit code: `0`

### 4.4 Missing External Tools Note
- `soffice` (LibreOffice) is **not installed** on this machine.
- `pdftoppm` is **not installed** on this machine.
- Direct PDF / JPG rasterization scripts cannot be run. Quality assurance must rely on:
  1. `validate.py` schema verification.
  2. `markitdown` text and notes extraction.
  3. Programmatic bounds and layout margin verification.

---

## 5. Architectural Recommendations for the Implementation Team

1. **Adopt Warm Color Palette Tokens**:
   - Replace cold background `F8F9FC` with warm sandstone off-white `F5F3EF` or `FAF8F5`.
   - Use warm heritage gold `C69214`, terracotta `C2410C` / `B85042`, and deep heritage navy `1E2761`.
2. **Apply Full-Bleed Photographic Backgrounds on Slides 1 & 8**:
   - Slide 1 (Cover): `hero_monument_1789383083590.jpg` with a 28% transparent `1E2761` overlay.
   - Slide 8 (Closing): `closing_monument_1789403341798.jpg` with a 30% transparent `1E2761` overlay.
3. **Embed Semi-Transparent Texture on Slide 5**:
   - Slide 5 (Architecture): Insert `tech_architecture_warm_1789436115529.jpg` at `x: 0, y: 0, w: '100%', h: '100%', transparency: 90` before adding the 5 layer cards.
4. **Implement Asymmetric Photo Panels on Slides 2, 3, 4, 6, 7**:
   - Slide 2: Asymmetric left photo panel (`heritage_problem_scene_1789435962154.jpg`).
   - Slide 3: Asymmetric right spatial panel (`india_heritage_map_1789407014836.jpg`).
   - Slide 4: Real-world in-use photo (`phone_audio_guide_1789436084142.jpg`).
   - Slide 6: Solitary palace traveler photo (`human_traveler_heritage_1789408640689.jpg`).
   - Slide 7: Emotional grandfather-grandson photo (`indian_family_heritage_1789408698290.jpg`).
5. **Always Set `margin: 0` on Text Boxes**:
   - Ensures exact alignment with card borders and icons.
6. **Ensure Clean Z-Order**:
   - In every slide generator function:
     `slide.addImage(...)` (background / texture) → `slide.addShape(...)` (overlay / cards) → `slide.addText(...)` (editable content).
