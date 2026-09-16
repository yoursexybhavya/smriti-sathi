# Code Fix Plan: Defect 1 & Defect 4 Remediation in `generate_deck.js`

**Author**: `explorer_r2_3`  
**Target File**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`  
**Date**: 2026-09-15T02:10:00Z  
**Status**: Ready for Implementation (Read-Only Analysis Complete)

---

## Executive Summary

This fix plan addresses two specific defects identified during the Adversarial Review Audit:
1. **Defect 1 [CRITICAL] Slide 1 Title Truncation**: `charSpacing: 150` on the cover title forces 150pt of extra tracking between each glyph (`spc="15000"` in DrawingML), expanding "HERODOTUS" to ~21.4 inches. Within the 7.2" container, only `"H   E   R"` renders before clipping.
2. **Defect 4 [MINOR] Slide 3 Bullet Run-In**: Comparison bullet points in Card 1 ("Traditional Visitor Journey") and Card 2 ("Herodotus Spatial Companion") lack `breakLine: true` in their text run options, causing distinct points to concatenate horizontally on the same line in PowerPoint and QuickLook.

Both fixes have been independently synthesized, prototyped, rendered, and verified via QuickLook (`qlmanage -t -s 1920`) and ECMA-376 schema validation (`validate.py`).

---

## Defect 1: Slide 1 Title Truncation

### 1. Location
- **File**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`
- **Lines**: 253–265 (specifically line 263)

### 2. Current Code
```javascript
    // Main Title in Cambria bold with tracking
    slide.addText('HERODOTUS', {
      x: 0.8,
      y: 1.25,
      w: 7.2,
      h: 1.15,
      fontFace: FONT.TITLE,
      fontSize: 54,
      bold: true,
      color: C.TEXT_LIGHT,
      charSpacing: 150,
      margin: 0
    });
```

### 3. Root Cause & Technical Mechanism
- **pptxgenjs Implementation**: In `node_modules/pptxgenjs/dist/pptxgen.cjs.js` line 5946:
  ```javascript
  runProps += opts.charSpacing ? ` spc="${Math.round(opts.charSpacing * 100)}" kern="0"` : '';
  ```
- **DrawingML Specification (`[ECMA-376-1:2016]` 21.1.2.3.9 `rPr`)**:
  The `spc` attribute represents character spacing in **hundredths of a point (1/100 pt)**.
- When `charSpacing: 150` is specified, pptxgenjs generates `<a:rPr spc="15000" kern="0">`, which applies **150.0 points** of extra space between every character.
- "HERODOTUS" consists of 9 characters with 8 inter-character intervals:
  - Tracking addition: `8 * 150 pt = 1,200 pt` (16.67 inches).
  - Base glyph width of Cambria 54pt bold: `~340 pt` (4.72 inches).
  - Total rendered text width: `1,540 pt ≈ 21.39 inches`.
- The container width is `w: 7.2` inches (`518.4 pt`). Because the first three glyphs ("H", "E", "R") and their tracking already consume `~560 pt`, the remaining letters (`"ODOTUS"`) are pushed outside the container and truncated by PowerPoint's layout engine.
- **Why this occurred**: In design tools (Figma, Photoshop) and CSS tracking conventions, tracking is often expressed in thousandths of an em (e.g. `+150 / 1000 em`). For a 54pt font, +150 tracking equals `0.15 * 54 = 8.1 pt` (or ~2–3 pt visual tracking). The developer mistakenly copied the integer `150` into pptxgenjs's `charSpacing` property, which expects absolute points.

### 4. Proposed Exact Code Fix
Replace line 263:
```javascript
<<<<
      charSpacing: 150,
====
      charSpacing: 2,
>>>>
```

### 5. Rationale & Metrics
- With `charSpacing: 2`:
  - `spc="200"` in DrawingML (2.0 pt tracking per character).
  - 8 intervals * 2 pt = 16 pt added width.
  - Total rendered width: `~356 pt ≈ 4.94 inches`.
  - Comfortably fits within the 7.2" container (`518.4 pt`), leaving ~2.26" of margin and zero chance of line wrapping or clipping.
  - Preserves subtle, refined architectural tracking fitting an editorial pitch deck.

---

## Defect 4: Slide 3 Bullet Run-In

### 1. Location
- **File**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`
- **Lines**: 665–720

### 2. Current Code
```javascript
    const tradBullets = [
      { text: 'Keyword Search: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Must know exact monument spellings in advance; zero serendipity.\n', bold: false, color: C.TEXT_MUTED },
      { text: 'Bulky 150MB Apps: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Heavy downloads that stall on 3G, or expensive hardware booths.\n', bold: false, color: C.TEXT_MUTED },
      { text: 'English Monopoly: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Audio guides exist at <30 sites, costing ₹300+ in English only.', bold: false, color: C.TEXT_MUTED }
    ];
    slide.addText(tradBullets.map(b => ({
      text: b.text,
      options: { fontFace: FONT.BODY, fontSize: 10, bold: b.bold, color: b.color }
    })), {
      x: 1.0,
      y: 2.70,
      w: 5.5,
      h: 1.40,
      margin: 0
    });

    // Card 2: Herodotus Breakthrough (Highlighted)
    addCard(slide, pres, 0.8, 4.35, 5.9, 1.95, {
      fill: C.WHITE,
      line: { color: C.GOLD, width: 1.8 },
      rectRadius: 0.08,
      shadow: true
    });
    slide.addText('★ HERODOTUS SPATIAL COMPANION (BREAKTHROUGH)', {
      x: 1.0,
      y: 4.45,
      w: 5.5,
      h: 0.26,
      fontFace: FONT.TITLE,
      fontSize: 11.5,
      bold: true,
      color: C.GOLD_DARK,
      margin: 0
    });

    const heroBullets = [
      { text: 'Map-First Cartography: ', bold: true, color: C.GOLD_DARK },
      { text: 'Dynamic 60 FPS vector map across 3,693 geocoded ASI monuments.\n', bold: false, color: C.TEXT_BODY },
      { text: 'Zero-Friction PWA: ', bold: true, color: C.GOLD_DARK },
      { text: 'Sub-350KB payload, instant browser access, zero app downloads.\n', bold: false, color: C.TEXT_BODY },
      { text: 'Linguistic Inclusion: ', bold: true, color: C.GOLD_DARK },
      { text: 'Mother-tongue narration in 5+ Indian languages at ₹0 cost.', bold: false, color: C.TEXT_BODY }
    ];
    slide.addText(heroBullets.map(b => ({
      text: b.text,
      options: { fontFace: FONT.BODY, fontSize: 10, bold: b.bold, color: b.color }
    })), {
      x: 1.0,
      y: 4.77,
      w: 5.5,
      h: 1.40,
      margin: 0
    });
```

### 3. Root Cause & Technical Mechanism
- **pptxgenjs Paragraph Grouping Logic**:
  In `node_modules/pptxgenjs/dist/pptxgen.cjs.js` lines 6176–6216:
  1. If `itext.text` ends with a newline (`text.match(/\n$/g) !== null`), pptxgenjs explicitly skips splitting the text object and does NOT set `breakLine: true`.
  2. In Step 5, pptxgenjs groups text runs into paragraph lines (`arrLines`) solely when `textObj.options.breakLine` is true or when alignment/bullets change.
  3. Because `breakLine: true` was not provided in `options`, pptxgenjs placed all 6 text runs into a **single paragraph** (`<a:p>`).
  4. In OpenXML DrawingML, literal `\n` characters embedded in `<a:t>` are not paragraph breaks. In PowerPoint and macOS QuickLook rendering, embedded newlines are either collapsed to spaces or ignored, causing all three comparison points to concatenate into one continuous run of text.

### 4. Proposed Exact Code Fix

There are two equally clean ways to implement this fix. **Option A** is the direct in-place update; **Option B** is a structured pairs refactoring.

#### Option A: Direct In-Place Property Update (Recommended)

In `generate_deck.js` lines 665–720:
1. Strip trailing `\n` from the text strings.
2. Mark `breakLine: true` on items ending a paragraph (indices 1 and 3 in each 6-item array).
3. Forward `breakLine: !!b.breakLine` into `options`.
4. Add `paraSpaceAfter: 6` to the text container options for vertical paragraph spacing.

```javascript
<<<<
    const tradBullets = [
      { text: 'Keyword Search: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Must know exact monument spellings in advance; zero serendipity.\n', bold: false, color: C.TEXT_MUTED },
      { text: 'Bulky 150MB Apps: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Heavy downloads that stall on 3G, or expensive hardware booths.\n', bold: false, color: C.TEXT_MUTED },
      { text: 'English Monopoly: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Audio guides exist at <30 sites, costing ₹300+ in English only.', bold: false, color: C.TEXT_MUTED }
    ];
    slide.addText(tradBullets.map(b => ({
      text: b.text,
      options: { fontFace: FONT.BODY, fontSize: 10, bold: b.bold, color: b.color }
    })), {
      x: 1.0,
      y: 2.70,
      w: 5.5,
      h: 1.40,
      margin: 0
    });

    // Card 2: Herodotus Breakthrough (Highlighted)
    addCard(slide, pres, 0.8, 4.35, 5.9, 1.95, {
      fill: C.WHITE,
      line: { color: C.GOLD, width: 1.8 },
      rectRadius: 0.08,
      shadow: true
    });
    slide.addText('★ HERODOTUS SPATIAL COMPANION (BREAKTHROUGH)', {
      x: 1.0,
      y: 4.45,
      w: 5.5,
      h: 0.26,
      fontFace: FONT.TITLE,
      fontSize: 11.5,
      bold: true,
      color: C.GOLD_DARK,
      margin: 0
    });

    const heroBullets = [
      { text: 'Map-First Cartography: ', bold: true, color: C.GOLD_DARK },
      { text: 'Dynamic 60 FPS vector map across 3,693 geocoded ASI monuments.\n', bold: false, color: C.TEXT_BODY },
      { text: 'Zero-Friction PWA: ', bold: true, color: C.GOLD_DARK },
      { text: 'Sub-350KB payload, instant browser access, zero app downloads.\n', bold: false, color: C.TEXT_BODY },
      { text: 'Linguistic Inclusion: ', bold: true, color: C.GOLD_DARK },
      { text: 'Mother-tongue narration in 5+ Indian languages at ₹0 cost.', bold: false, color: C.TEXT_BODY }
    ];
    slide.addText(heroBullets.map(b => ({
      text: b.text,
      options: { fontFace: FONT.BODY, fontSize: 10, bold: b.bold, color: b.color }
    })), {
      x: 1.0,
      y: 4.77,
      w: 5.5,
      h: 1.40,
      margin: 0
    });
====
    const tradBullets = [
      { text: 'Keyword Search: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Must know exact monument spellings in advance; zero serendipity.', bold: false, color: C.TEXT_MUTED, breakLine: true },
      { text: 'Bulky 150MB Apps: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Heavy downloads that stall on 3G, or expensive hardware booths.', bold: false, color: C.TEXT_MUTED, breakLine: true },
      { text: 'English Monopoly: ', bold: true, color: C.TEXT_MAIN },
      { text: 'Audio guides exist at <30 sites, costing ₹300+ in English only.', bold: false, color: C.TEXT_MUTED }
    ];
    slide.addText(tradBullets.map(b => ({
      text: b.text,
      options: {
        fontFace: FONT.BODY,
        fontSize: 10,
        bold: b.bold,
        color: b.color,
        breakLine: !!b.breakLine
      }
    })), {
      x: 1.0,
      y: 2.70,
      w: 5.5,
      h: 1.40,
      margin: 0,
      paraSpaceAfter: 6
    });

    // Card 2: Herodotus Breakthrough (Highlighted)
    addCard(slide, pres, 0.8, 4.35, 5.9, 1.95, {
      fill: C.WHITE,
      line: { color: C.GOLD, width: 1.8 },
      rectRadius: 0.08,
      shadow: true
    });
    slide.addText('★ HERODOTUS SPATIAL COMPANION (BREAKTHROUGH)', {
      x: 1.0,
      y: 4.45,
      w: 5.5,
      h: 0.26,
      fontFace: FONT.TITLE,
      fontSize: 11.5,
      bold: true,
      color: C.GOLD_DARK,
      margin: 0
    });

    const heroBullets = [
      { text: 'Map-First Cartography: ', bold: true, color: C.GOLD_DARK },
      { text: 'Dynamic 60 FPS vector map across 3,693 geocoded ASI monuments.', bold: false, color: C.TEXT_BODY, breakLine: true },
      { text: 'Zero-Friction PWA: ', bold: true, color: C.GOLD_DARK },
      { text: 'Sub-350KB payload, instant browser access, zero app downloads.', bold: false, color: C.TEXT_BODY, breakLine: true },
      { text: 'Linguistic Inclusion: ', bold: true, color: C.GOLD_DARK },
      { text: 'Mother-tongue narration in 5+ Indian languages at ₹0 cost.', bold: false, color: C.TEXT_BODY }
    ];
    slide.addText(heroBullets.map(b => ({
      text: b.text,
      options: {
        fontFace: FONT.BODY,
        fontSize: 10,
        bold: b.bold,
        color: b.color,
        breakLine: !!b.breakLine
      }
    })), {
      x: 1.0,
      y: 4.77,
      w: 5.5,
      h: 1.40,
      margin: 0,
      paraSpaceAfter: 6
    });
>>>>
```

#### Option B: Structured Key-Value Pairs Refactoring (Alternative)

For enhanced maintainability:
```javascript
    const tradItems = [
      { label: 'Keyword Search: ', desc: 'Must know exact monument spellings in advance; zero serendipity.' },
      { label: 'Bulky 150MB Apps: ', desc: 'Heavy downloads that stall on 3G, or expensive hardware booths.' },
      { label: 'English Monopoly: ', desc: 'Audio guides exist at <30 sites, costing ₹300+ in English only.' }
    ];
    const tradRuns = [];
    tradItems.forEach((item, idx) => {
      tradRuns.push(
        { text: item.label, options: { fontFace: FONT.BODY, fontSize: 10, bold: true, color: C.TEXT_MAIN } },
        { text: item.desc, options: { fontFace: FONT.BODY, fontSize: 10, bold: false, color: C.TEXT_MUTED, breakLine: idx !== tradItems.length - 1 } }
      );
    });
    slide.addText(tradRuns, {
      x: 1.0,
      y: 2.70,
      w: 5.5,
      h: 1.40,
      margin: 0,
      paraSpaceAfter: 6
    });
```

---

## Verification & Independent Validation

1. **Compilation & Generation**:
   ```bash
   node /Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js
   ```
2. **Schema & Package Validation**:
   ```bash
   /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 \
     /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py \
     Herodotus_Pitch_Presentation.pptx
   ```
   *Expected Result*: `All validations PASSED!`, exit code 0.
3. **OpenXML Verification**:
   - Slide 1: `<a:rPr spc="200" kern="0">` inside `ppt/slides/slide1.xml`.
   - Slide 3: Exactly 3 `<a:p>` elements per comparison card in `ppt/slides/slide3.xml`.
4. **Visual Render Inspection**:
   Execute QuickLook render:
   - Slide 1: Full word `"HERODOTUS"` visible with all 9 characters.
   - Slide 3: Three clearly separated lines/paragraphs per comparison card with bold prefixes.
