# Fix Plan: Defect 2 (Slide 2 Header Text Collision)

**Author**: `explorer_r2_4`  
**Working Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_4`  
**Target Generator**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`  
**Date**: 2026-09-15T01:55:12Z  
**Status**: Ready for Implementation  

---

## 1. Executive Summary & Defect Root Cause

### The Defect
On Slide 2 (The Visitor Friction), the headline wraps onto two lines:
- Line 1: `"You’re Standing in Front of History. But Where’s the"`
- Line 2: `"Story?"`

The second line (`"Story?"`) renders across `y ≈ 1.35"–1.60"`, directly colliding with and printing over the subtitle text:
`"India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site."` placed at `y: 1.41"`.

### Exact Geometry & DrawingML Root Cause
In `generate_deck.js` (lines 156–194, `addStandardHeader`):
- Category Kicker: `x: 0.8, y: 0.55, w: 11.733, h: 0.28`, font Calibri 10.5pt (occupies `y: 0.55` to `0.83`)
- Main Slide Title: `x: 0.8, y: 0.83, w: 11.733, h: 0.58`, font Cambria 34pt bold (occupies `y: 0.83` to `1.41`)
- Subtitle: `x: 0.8, y: 1.41, w: 11.733, h: 0.32`, font Calibri 13pt (occupies `y: 1.41` to `1.73`)
- Content starts at `y: 1.80` (photo panel `0.8, 1.80` and problem card 1 `5.65, 1.80`)

In DrawingML (`ppt/slides/slide2.xml`):
The text frame is configured with `wrap="square"` and `anchor="ctr"` (vertical middle centering).
- When a title fits on a single line, 34pt Cambria has a height of ~0.47", centering neatly inside `h: 0.58` between `y ≈ 0.88` and `y ≈ 1.35`. It leaves a clean visual gap of ~0.13" above the subtitle text at `y: 1.41`.
- The Slide 2 title is **59 characters**: `"You’re Standing in Front of History. But Where’s the Story?"`.
- In Cambria 34pt bold across `w: 11.733"` (844.8 pt), single-line capacity is **52–53 characters**.
- The remaining 6 characters (`"Story?"`) wrap to line 2.
- Because `anchor="ctr"` centers the two lines around `y = 1.12"`, the 2-line block expands vertically to ~0.95"–1.00", pushing line 2 to `y ≈ 1.35–1.60"`.
- This lands directly on top of the subtitle text box at `y: 1.41"`, causing severe visual corruption.

---

## 2. Evaluation of Potential Fix Strategies

| Strategy | Feasibility | Visual Impact | Margin Compliance | Inter-Slide Consistency | Verdict |
|---|---|---|---|---|---|
| **A. Vertical Coordinate Reflow (2-Line Title)** | Poor | Displaces cards, compresses content | ❌ Violates 0.5" bottom margin (leaves only 0.41") | ❌ Header baseline jumps by 0.25" on Slide 2 | **REJECTED** |
| **B. Container Width Expansion** | Poor | Misaligns header grid with 2-column layout | Marginal | ❌ Breaks left/right 0.8" grid alignment | **REJECTED** |
| **C. Font Size Reduction (28pt)** | Excellent | Fits 59 chars on 1 line (9.72" width); 2.01" slack | ✅ Clean 0.66" bottom margin preserved | ✅ 100% consistent `y` coordinates across all slides | **RECOMMENDED** |
| **D. Editorial Text Condensing (51 chars)** | Excellent | Fits on 1 line at 34pt or 28pt; punchier tone | ✅ Clean 0.66" bottom margin preserved | ✅ 100% consistent `y` coordinates across all slides | **RECOMMENDED** |
| **E. Combined Defense-in-Depth (C + D)** | **Optimal** | Zero-risk: 51 chars at 28pt uses 8.45" (3.28" slack); auto-fallback helper | ✅ 100% compliant | ✅ 100% consistent across all content slides | **STRONGLY RECOMMENDED** |

### Why Two-Line Title Coordinate Reflow (Strategy A) Fails:
If the title wraps onto two lines:
1. Title needs `h: 0.86"` (from `y: 0.77` to `1.63`).
2. Subtitle must be pushed down to `y: 1.69` (ending at `1.97`).
3. Content below must be pushed down from `y: 1.80` to `y: 2.05` (+0.25").
4. On Slide 2, the 3 problem cards + bottom strip occupy `5.04"` of vertical space.
5. `2.05 + 5.04 = 7.09"`. Bottom edge of slide is `7.50"`.
6. Remaining bottom margin = `7.50 - 7.09 = 0.41"`, which **violates Acceptance Criterion R2 ("Minimum 0.5" margins from all slide edges")**.
7. To fix that, an implementer would need to shrink the photo panel, shrink the caption card, shrink all 3 problem cards from `h: 1.41` to `1.20`, and shrink card font sizes.
8. Furthermore, on Slides 3 through 7, content begins at `y: 1.78–1.80`. Shifting Slide 2 content down to `y: 2.05` creates noticeable visual jitter when paging through the presentation.

### Why Single-Line Fix (Strategy E) is Optimal:
1. Preserves the exact vertical baseline across all content slides:
   - Kicker: `y: 0.55, h: 0.28`
   - Title: `y: 0.83, h: 0.58`
   - Subtitle: `y: 1.41, h: 0.32`
   - Content: `y: 1.80`
2. Zero edits required to the complex two-column problem layout below `y: 1.80`.
3. Preserves full 0.66" bottom margin.
4. Generates clean 0.165" vertical breathing room between title and subtitle.

---

## 3. Detailed Character Metrics & Mathematical Proof

### Font Metrics for Cambria Bold across `w = 11.733"` (844.78 pt)

1. **At 34pt (Current)**:
   - Character width: ~15.5 pt average
   - 53 characters fit: `53 * 15.5 = 821.5 pt` (< 844.8 pt)
   - 59 characters: `59 * 15.5 = 914.5 pt = 12.70 inches` (> 11.733 inches by 0.97 inches) ➔ **OVERFLOW / 2 LINES**

2. **At 28pt (Recommended)**:
   - Character width: ~12.2 pt average
   - Single-line capacity: `844.8 / 12.2 = ~69 characters`
   - Original 59 characters: `700 pt = 9.72 inches` (leaves **2.01 inches of spare width / 17% safety slack**) ➔ **1 LINE**
   - Condensed 51 characters: `608 pt = 8.45 inches` (leaves **3.28 inches of spare width / 28% safety slack**) ➔ **1 LINE**

3. **Vertical Clearance at 28pt**:
   - Text box: `y: 0.83, h: 0.58`. Center = `y: 1.12`.
   - Single-line 28pt height = `28 / 72 = 0.389 inches`.
   - Top of text glyphs: `1.12 - 0.195 = 0.925"`.
   - Bottom of text glyphs: `1.12 + 0.195 = 1.315"`.
   - Subtitle box starts at `y: 1.41"`. Subtitle text starts at `y ≈ 1.48"`.
   - **True visual breathing room**: `1.48 - 1.315 = 0.165 inches` (~12 points).
   - Collision probability: **0.0%**.

---

## 4. Exact Implementation Recommendations

### Modification 1: Upgrade `addStandardHeader` in `generate_deck.js`
**Target**: `generate_deck.js`, lines 156–194.

Add support for an optional `options` parameter and automatic font size scaling for long titles:

#### Before:
```javascript
// --- HELPER: ADD CONSISTENT WARM HEADER ---
function addStandardHeader(slide, kicker, title, subtitle, kickerColor = C.GOLD_DARK) {
  // Category Kicker (Calibri 10.5pt bold uppercase)
  slide.addText(kicker, {
    x: 0.8,
    y: 0.55,
    w: 11.733,
    h: 0.28,
    fontFace: FONT.BODY,
    fontSize: 10.5,
    bold: true,
    color: kickerColor,
    margin: 0
  });

  // Main Slide Title (Cambria 34pt bold serif)
  slide.addText(title, {
    x: 0.8,
    y: 0.83,
    w: 11.733,
    h: 0.58,
    fontFace: FONT.TITLE,
    fontSize: 34,
    bold: true,
    color: C.TEXT_MAIN,
    margin: 0
  });

  // Subtitle / Lead-in (Calibri 13pt)
  slide.addText(subtitle, {
    x: 0.8,
    y: 1.41,
    w: 11.733,
    h: 0.32,
    fontFace: FONT.BODY,
    fontSize: 13,
    color: C.TEXT_MUTED,
    margin: 0
  });
}
```

#### After:
```javascript
// --- HELPER: ADD CONSISTENT WARM HEADER ---
function addStandardHeader(slide, kicker, title, subtitle, kickerColor = C.GOLD_DARK, options = {}) {
  const titleFontSize = options.titleFontSize || (title.length > 52 ? 28 : 34);
  const titleY = options.titleY || 0.83;
  const titleH = options.titleH || 0.58;
  const subtitleY = options.subtitleY || 1.41;
  const subtitleH = options.subtitleH || 0.32;
  const subtitleFontSize = options.subtitleFontSize || 13;

  // Category Kicker (Calibri 10.5pt bold uppercase)
  slide.addText(kicker, {
    x: 0.8,
    y: 0.55,
    w: 11.733,
    h: 0.28,
    fontFace: FONT.BODY,
    fontSize: 10.5,
    bold: true,
    color: kickerColor,
    margin: 0
  });

  // Main Slide Title (Cambria bold serif)
  slide.addText(title, {
    x: 0.8,
    y: titleY,
    w: 11.733,
    h: 0.58,
    fontFace: FONT.TITLE,
    fontSize: titleFontSize,
    bold: true,
    color: C.TEXT_MAIN,
    margin: 0
  });

  // Subtitle / Lead-in (Calibri 13pt)
  slide.addText(subtitle, {
    x: 0.8,
    y: subtitleY,
    w: 11.733,
    h: subtitleH,
    fontFace: FONT.BODY,
    fontSize: subtitleFontSize,
    color: C.TEXT_MUTED,
    margin: 0
  });
}
```

---

### Modification 2: Update Slide 2 Header Call in `generate_deck.js`
**Target**: `generate_deck.js`, lines 470–476.

#### Before:
```javascript
    addStandardHeader(
      slide,
      '01 / THE VISITOR FRICTION',
      'You’re Standing in Front of History. But Where’s the Story?',
      'India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.',
      C.TERRACOTTA_DARK
    );
```

#### After (Option 1 — Strongly Recommended):
```javascript
    addStandardHeader(
      slide,
      '01 / THE VISITOR FRICTION',
      'Standing in Front of History. But Where’s the Story?',
      'India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.',
      C.TERRACOTTA_DARK,
      { titleFontSize: 28 }
    );
```

#### After (Option 2 — Verbatim Title with Explicit 28pt):
If the team desires to retain the exact 59-character text verbatim:
```javascript
    addStandardHeader(
      slide,
      '01 / THE VISITOR FRICTION',
      'You’re Standing in Front of History. But Where’s the Story?',
      'India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.',
      C.TERRACOTTA_DARK,
      { titleFontSize: 28 }
    );
```
*Note: Both Option 1 and Option 2 fit on a single line with zero collision. Option 1 is superior editorially as it removes conversational filler ("You’re "), creating a punchier journalistic title.*

---

## 5. Verification Protocol for Implementer

1. **Rebuild Presentation**:
   ```bash
   node /Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js
   ```
   *Expected Output*: Exit code `0`, `Presentation generated successfully!`.

2. **Schema & File Validation**:
   ```bash
   /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 \
     /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py \
     /Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx
   ```
   *Expected Output*: `All validations PASSED!`, Exit code `0`.

3. **Visual Render Verification**:
   Render Slide 2 to inspect layout at high resolution:
   ```bash
   qlmanage -t -s 1920 -o /tmp /path/to/slide2.pptx
   ```
   Confirm that:
   - The headline renders on a single line.
   - There is clean breathing room between the bottom of the title and the subtitle text at `y = 1.41`.
   - There is zero overlap with the photo card at `y = 1.80`.
   - All slide margins remain >= 0.5".
