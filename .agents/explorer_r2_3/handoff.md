# Handoff Report: Investigation & Exact Code Fix Formulation for Defect 1 & Defect 4

**Author**: `explorer_r2_3`  
**Working Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_3`  
**Target Code**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`  
**Date**: 2026-09-15T02:15:00Z  
**Type**: Hard Handoff (Investigation Complete & Fixes Formulated)

---

## 1. Observation

1. **Defect 1: Cover Title Truncation ("H   E   R")**:
   - In `generate_deck.js:263`:
     ```javascript
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
   - In `node_modules/pptxgenjs/dist/pptxgen.cjs.js:5946`:
     ```javascript
     runProps += opts.charSpacing ? ` spc="${Math.round(opts.charSpacing * 100)}" kern="0"` : '';
     ```
   - In `ppt/slides/slide1.xml` of `Herodotus_Pitch_Presentation.pptx`:
     ```xml
     <a:rPr lang="en-US" sz="5400" b="1" spc="15000" kern="0" dirty="0">
     ```
   - In visual render `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/reviewer_r2_1/slide_1.pptx.png`:
     The main title renders verbatim as `H   E   R`. Letters "O", "D", "O", "T", "U", "S" are clipped and completely invisible.
   - Isolated prototype test with `charSpacing: 2` rendered via `qlmanage -t -s 1920 -o /tmp /tmp/test_slide1_full.pptx`:
     Rendered image `/tmp/test_slide1_full.pptx.png` confirms `"HERODOTUS"` displays all 9 characters completely across 4.94" of the 7.2" container with zero truncation.

2. **Defect 4: Slide 3 Bullet Run-In**:
   - In `generate_deck.js:665–720`:
     ```javascript
     const tradBullets = [
       { text: 'Keyword Search: ', bold: true, color: C.TEXT_MAIN },
       { text: 'Must know exact monument spellings in advance; zero serendipity.\n', bold: false, color: C.TEXT_MUTED },
       ...
     ];
     slide.addText(tradBullets.map(b => ({
       text: b.text,
       options: { fontFace: FONT.BODY, fontSize: 10, bold: b.bold, color: b.color }
     })), { x: 1.0, y: 2.70, w: 5.5, h: 1.40, margin: 0 });
     ```
   - In `node_modules/pptxgenjs/dist/pptxgen.cjs.js:6176`:
     ```javascript
     if (itext.text.includes(CRLF) && itext.text.match(/\n$/g) === null) {
         itext.text.split(CRLF).forEach(line => {
             itext.options.breakLine = true;
             arrTextObjects.push({ text: line, options: itext.options });
         });
     }
     else {
         arrTextObjects.push(itext);
     }
     ```
     Because `itext.text` ends with `\n` (`text.match(/\n$/g) !== null`), pptxgenjs explicitly skips splitting and does not set `breakLine: true`.
   - In `node_modules/pptxgenjs/dist/pptxgen.cjs.js:6206`:
     pptxgenjs groups runs into paragraph lines only if `textObj.options.breakLine` is true. Because `breakLine` was omitted from options, all 6 text objects were placed into a single `<a:p>`.
   - In `ppt/slides/slide3.xml`:
     Paragraph 5 and Paragraph 7 contain all 6 text runs inside a single `<a:p>` element.
   - In visual render `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/reviewer_r2_1/slide_3.pptx.png`:
     Items concatenate horizontally onto one line: `"Keyword Search: Must know... Bulky 150MB Apps: Heavy downloads... English Monopoly: Audio guides..."`.
   - Isolated prototype test with `breakLine: true` on description runs and `paraSpaceAfter: 6`:
     Rendered image `/tmp/test_slide3_only.pptx.png` confirms each of the 3 points starts on its own line with distinct bold colored headings and clean vertical paragraph spacing.

---

## 2. Logic Chain

1. **Premise 1**: ECMA-376 OpenXML DrawingML specifies that character tracking `spc` is stored in hundredths of a point (1/100 pt).
2. **Inference 1**: When `charSpacing: 150` is passed to pptxgenjs, it emits `spc="15000"`, adding 150 pt of tracking per character. Across 8 intervals in "HERODOTUS", this adds 1,200 pt (16.67") to the 340 pt font glyph width, creating a total width of 1,540 pt (~21.39"). In a 7.2" container (518.4 pt), only "H   E   R" (~373 pt) fits before hitting the boundary.
3. **Inference 2**: Changing `charSpacing: 150` to `charSpacing: 2` emits `spc="200"`, adding 16 pt of tracking total. The total text width becomes ~356 pt (4.94"), fitting comfortably within 7.2" (518.4 pt) with 2.26" of margin and zero clipping.
4. **Premise 2**: In pptxgenjs, paragraph separation within a multi-run `slide.addText()` call requires `breakLine: true` on the run that terminates the line. Literal `\n` characters at the end of text strings are skipped by pptxgenjs line 6176 and ignored by DrawingML text layout engines.
5. **Inference 3**: In `generate_deck.js:665–720`, `breakLine: true` was omitted from the text options and `\n` was placed inside the strings. pptxgenjs consequently emitted all runs into a single `<a:p>` paragraph, resulting in horizontal bullet concatenation.
6. **Inference 4**: Removing `\n` from the text strings, adding `breakLine: true` to the description runs (indices 1 and 3 in each 6-item array), forwarding `breakLine: !!b.breakLine` in `.map()`, and setting `paraSpaceAfter: 6` causes pptxgenjs to emit 3 distinct `<a:p>` paragraphs per card with clean line breaks and vertical spacing.

---

## 3. Caveats

1. **Read-Only Investigation Scope**: As an explorer subagent, source code in `generate_deck.js` was analyzed, prototyped in isolation, and visually verified, but has not yet been overwritten in place in `generate_deck.js`. The exact drop-in diff is provided in `fix_plan.md` for the worker/implementer.
2. **Defect 2 and Defect 3 Separation**: Defect 2 (Slide 2 headline wrap collision with subtitle) and Defect 3 (Slide 5 header contrast over jali lattice) are handled under separate dispatches and are not modified by this plan.
3. **Font Rendering Fidelity**: macOS QuickLook thumbnail renders reflect Apple's Quartz text rendering engine; final PowerPoint rendering on Windows/Office365 may have sub-pixel kerning differences, but Cambria at 54pt with 4.94" width provides ample clearance (>2.2 inches) against any cross-platform font metric variance.

---

## 4. Conclusion

The exact technical root causes of Defect 1 and Defect 4 are fully verified and solved.

### Exact Drop-In Fix for Implementer:

#### 1. Defect 1 Fix (`generate_deck.js:263`):
```javascript
// Change line 263 from:
charSpacing: 150,
// to:
charSpacing: 2,
```

#### 2. Defect 4 Fix (`generate_deck.js:665–720`):
Replace `tradBullets` and `heroBullets` blocks in `generate_deck.js`:
```javascript
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
```

---

## 5. Verification Method

To independently verify these fixes once applied to `generate_deck.js`:

1. **Re-compile Presentation**:
   ```bash
   node /Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js
   ```
2. **Run Package & Schema Validation**:
   ```bash
   /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 \
     /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py \
     /Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx
   ```
   Must return: `All validations PASSED!`.
3. **Verify DrawingML Structure via Python**:
   ```bash
   /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 -c '
   import zipfile, re
   with zipfile.ZipFile("Herodotus_Pitch_Presentation.pptx") as z:
       s1 = z.read("ppt/slides/slide1.xml").decode("utf-8")
       assert "spc=\"200\"" in s1, "Slide 1 charSpacing failed"
       s3 = z.read("ppt/slides/slide3.xml").decode("utf-8")
       p_count = len(re.findall(r"<a:p(?: [^>]*)?>.*?</a:p>", s3, re.DOTALL))
       print(f"Slide 3 total paragraphs: {p_count}")
       assert p_count >= 10, "Slide 3 paragraphs not split"
   print("XML checks PASSED!")
   '
   ```
4. **Invalidation Conditions**:
   - Slide 1 title shows truncation or clips any letter of "HERODOTUS".
   - Slide 3 comparison points concatenate on the same horizontal line.
   - Any schema validation error reported by `validate.py`.
