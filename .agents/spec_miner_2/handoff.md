# Color Contrast Audit & DrawingML Specification Report

**Agent**: Spec Miner 2 (`spec_miner_2` / Contrast & DrawingML Spec Miner)  
**Parent Orchestrator**: `d4765853-54f2-4146-b1e4-17ddd80c2b03`  
**Working Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/spec_miner_2`  
**Target Analyzed**: `generate_deck.js` & `Herodotus_Pitch_Presentation.pptx`  
**Date**: 2026-09-15T01:35:00Z  
**Handoff Type**: Hard (Task Complete)  

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Palette Tokens | `C.GOLD_DARK` ('92400E') | Deep ochre gold token defined in `C` (line 40) designed for high contrast on light backgrounds | Hex code `'92400E'` | Relative Luminance = 0.0981 | None; properly used on Slide 3 (line 656) and Slide 6 (line 1358) | `generate_deck.js` source inspection |
| 2 | Palette Tokens | `C.GOLD` ('D4AF37') | Heritage gold accent token defined in `C` (line 39) intended for dark canvas backgrounds | Hex code `'D4AF37'` | Relative Luminance = 0.4493 | Contrast ratio on `WHITE` is 2.10:1 and on `LIGHT_BG` is 2.00:1 (fails WCAG AA) | `generate_deck.js` & contrast calculation |
| 3 | Metric Cards | Slide 5 Middle Stat Card | Middle technical metric card displaying `'₹0 / User'` on white card | `stat: '₹0 / User'`, `color: C.GOLD`, `fill: C.WHITE` | Rendered text in 32pt bold | Contrast ratio 2.10:1 (fails WCAG AA 3.0:1 threshold for large text) | Challenger 1 handoff & line 1139 |
| 4 | Section Headers | Slide 4 & Slide 6 Category Kickers | Category badge kickers in `addStandardHeader` for Slides 4 and 6 | `kickerColor = C.GOLD`, `background: C.LIGHT_BG` | 10.5pt bold text in `'D4AF37'` on `'F8F9FC'` | Contrast ratio 2.00:1 (fails WCAG AA 4.5:1 normal text threshold) | `generate_deck.js` lines 741 & 1214 |
| 5 | Dark Card Typography | Slide 8 Footer Attribution | Footer line `'Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon'` placed inside `C.DARK_CARD` container | `color: C.TEXT_MUTED` ('64748B'), `fill: C.DARK_CARD` ('151D48') | 9.5pt regular text | Contrast ratio 3.39:1 (fails WCAG AA 4.5:1 normal text threshold) | `generate_deck.js` line 1756 |
| 6 | Column Headers | Slide 3 Traditional Journey Strip | Header strip for traditional journey column placed on `C.CARD_HEADER_BG` ('F1F5F9') | `color: C.TEXT_MUTED` ('64748B'), `fill: C.CARD_HEADER_BG` ('F1F5F9') | 11.5pt bold text | Contrast ratio 4.34:1 (fails WCAG AA 4.5:1 normal text threshold by 0.16) | `generate_deck.js` line 578 |
| 7 | Accent Text | `C.TEAL` ('0D9488') Normal Text on Light Backgrounds | Teal text runs (kicker, tags, layer subtitles, pills) across Slides 1, 2, 3, 4, 5, 6, 7 | `color: C.TEAL` ('0D9488'), `bg`: `WHITE` / `LIGHT_BG` / `TEAL_TINT` / `SKY_TINT` / `DARK_CARD` | 8.5pt to 10.5pt bold text | Contrast ratios 3.26:1 to 3.74:1 on light backgrounds, 4.31:1 on dark card (fail WCAG AA 4.5:1) | DrawingML OpenXML scan of slide shapes |
| 8 | Accent Badges | `C.TERRACOTTA` ('C2410C') on `TERRACOTTA_TINT` ('FEE2E2') | Small circle badges and pills on Slides 2, 4, 7 | `color: C.TERRACOTTA` ('C2410C'), `fill: C.TERRACOTTA_TINT` ('FEE2E2') | 8.5pt to 12pt bold text | Contrast ratio 4.24:1 (near-miss for 4.5:1 normal text threshold) | DrawingML OpenXML scan of slide shapes |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Large Text Contrast Threshold | Text size >= 18pt or >= 14pt bold (`'₹0 / User'` at 32pt bold) with `C.GOLD` on `WHITE` | Requires 3.0:1 under WCAG AA; measured ratio is 2.10:1 (fails even the relaxed large text threshold) |
| 2 | Small Bold Kicker Threshold | Text size 10.5pt bold (`addStandardHeader` kickers) with `C.GOLD` on `LIGHT_BG` | Does NOT qualify as large text (< 14pt bold); requires 4.5:1; measured ratio is 2.00:1 (severe failure) |
| 3 | Small Regular Text on Dark Card | Text size 9.5pt regular (Slide 8 footer) with `C.TEXT_MUTED` on `DARK_CARD` | Requires 4.5:1; measured ratio is 3.39:1 (developer mistakenly used light-canvas token on dark card) |
| 4 | Subtle Background Shading | Text size 11.5pt bold with `C.TEXT_MUTED` on `CARD_HEADER_BG` ('F1F5F9') | Requires 4.5:1; measured ratio is 4.34:1 (fails by 0.16 because `F1F5F9` is slightly darker than pure white) |
| 5 | Tinted Badge Enclosures | Text size 8.5pt - 11pt bold with `C.TEAL` on `TEAL_TINT` ('CCFBF1') or `SKY_TINT` ('E0F2FE') | Requires 4.5:1; measured ratios are 3.32:1 and 3.26:1 (unfavorable interaction of middle-luminance tint and text) |
| 6 | Solution Validation: `C.GOLD_DARK` on `WHITE` | `C.GOLD_DARK` ('92400E') on `WHITE` ('FFFFFF') | Relative luminance 0.0981 on 1.0000 yields 7.09:1 (PASSES WCAG AAA >= 7.0:1) |
| 7 | Solution Validation: `C.GOLD_DARK` on `LIGHT_BG` | `C.GOLD_DARK` ('92400E') on `LIGHT_BG` ('F8F9FC') | Relative luminance 0.0981 on 0.9474 yields 6.73:1 (PASSES WCAG AA >= 4.5:1) |
| 8 | Solution Validation: `TEAL_DARK` on `WHITE` & Tints | Proposed `TEAL_DARK` ('0F766E') on `WHITE`, `LIGHT_BG`, `TEAL_TINT`, `SKY_TINT` | Yields 5.47:1, 5.20:1, 4.86:1, 4.77:1 (100% PASSES WCAG AA >= 4.5:1 across all light surfaces) |

---

## 1. Observation

A full forensic probe was conducted across `generate_deck.js` and all slide XML parts in `Herodotus_Pitch_Presentation.pptx` (slides 1 through 8).

### 1.1 Color Luminance Baseline (WCAG 2.1 Formula)
Relative luminance ($L$) calculated per WCAG 2.1:
- `DARK_CARD` (`151D48`): $L = 0.0151$
- `DARK_BG` (`1E2761`): $L = 0.0259$
- `TEXT_MAIN` (`1E2761`): $L = 0.0259$
- `DARK_BORDER` (`2A367B`): $L = 0.0456$
- `TEXT_BODY` (`334155`): $L = 0.0514$
- `GOLD_DARK` (`92400E`): $L = 0.0981$
- `TERRACOTTA` (`C2410C`): $L = 0.1528$
- `TEXT_MUTED` (`64748B`): $L = 0.1706$
- `TEAL` (`0D9488`): $L = 0.2304$
- `GOLD` (`D4AF37`): $L = 0.4493$
- `DARK_MUTED` (`CADCFC`): $L = 0.7077$
- `LIGHT_BORDER` (`E2E8F0`): $L = 0.8017$
- `TERRACOTTA_TINT` (`FEE2E2`): $L = 0.8095$
- `SKY_TINT` (`E0F2FE`): $L = 0.8651$
- `TEAL_TINT` (`CCFBF1`): $L = 0.8818$
- `GOLD_TINT` (`FEF3C7`): $L = 0.8930$
- `CARD_HEADER_BG` (`F1F5F9`): $L = 0.9085$
- `LIGHT_BG` (`F8F9FC`): $L = 0.9474$
- `WHITE` (`FFFFFF`): $L = 1.0000$

### 1.2 Verification of Slide 5 Issue
- **Source Location**: `generate_deck.js` lines 1137–1143:
  ```javascript
  {
    stat: '₹0 / User',
    color: C.GOLD, // 'D4AF37'
    label: 'Marginal Audio Streaming Cost',
    desc: 'Client-side Web Speech eliminates expensive cloud audio storage, CDN media streaming, and bandwidth bills.',
    x: 4.77
  }
  ```
- **Container**: Card background is `C.WHITE` (`FFFFFF`).
- **Contrast**: `(1.0000 + 0.05) / (0.4493 + 0.05) = 1.05 / 0.4993 = 2.10:1`.
- **Threshold**: WCAG AA Large Text (>= 18pt or >= 14pt bold) requires **3.0:1**. Normal text requires **4.5:1**.
- **Result**: Fails both criteria at **2.10:1**.
- **Test with `C.GOLD_DARK` ('92400E')**:
  `Contrast = (1.0000 + 0.05) / (0.0981 + 0.05) = 1.05 / 0.1481 = 7.09:1`.
  Exceeds WCAG AA Large (3.0:1), WCAG AA Normal (4.5:1), and WCAG AAA (7.0:1). Fully verified.

### 1.3 Systematic Audit of All 184 Text Runs Across All 8 Slides
A custom parser evaluated all 184 text runs across the 8 slides in `Herodotus_Pitch_Presentation.pptx`.
- Total Text Runs: 184
- Passing Runs: 160
- Failing Runs: 24

All 24 failures map to 6 discrete root cause patterns:

1. **Slide 5 Metric Card (1 run)**: `'₹0 / User'` in `C.GOLD` on `WHITE` (**2.10:1** vs req 3.0:1).
2. **Slide 4 & 6 Header Kickers (2 runs)**:
   - Slide 4 line 741: `'03 / JUDGING CRITERION: PRESENTATION & CLARITY'` in `C.GOLD` on `LIGHT_BG` (**2.00:1** vs req 4.5:1).
   - Slide 6 line 1214: `'05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY'` in `C.GOLD` on `LIGHT_BG` (**2.00:1** vs req 4.5:1).
3. **Slide 8 Footer Attribution (1 run)**:
   - Slide 8 line 1756: `'Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon'` in `C.TEXT_MUTED` on `DARK_CARD` (**3.39:1** vs req 4.5:1).
4. **Slide 3 Column 1 Header Strip (1 run)**:
   - Slide 3 line 578: `'TRADITIONAL VISITOR JOURNEY (STATUS QUO)'` in `C.TEXT_MUTED` on `CARD_HEADER_BG` (**4.34:1** vs req 4.5:1).
5. **`C.TEAL` Normal Text on Light Backgrounds / Tints (16 runs)**:
   - Slide 1 line 255: `'MAP-FIRST DISCOVERY'` on `DARK_CARD` (**4.31:1** vs req 4.5:1).
   - Slide 2 line 447: Badge `'03'` on `TEAL_TINT` (**3.32:1** vs req 4.5:1).
   - Slide 3 line 529: Kicker `'02 / JUDGING CRITERION: INNOVATION & ORIGINALITY'` on `LIGHT_BG` (**3.56:1** vs req 4.5:1).
   - Slide 3 line 547: Paradigm shift text on `SKY_TINT` (**3.26:1** vs req 4.5:1).
   - Slide 3 line 719: Bottom callout `'Core Originality...'` on `LIGHT_BG` (**3.56:1** vs req 4.5:1).
   - Slide 4 line 898: `'✓ GPS Navigation Ready...'` on `LIGHT_BG` (**3.56:1** vs req 4.5:1).
   - Slide 4 line 909: Step 01 pill `'STEP 01'` on `TEAL_TINT` (**3.32:1** vs req 4.5:1).
   - Slide 5 line 995: Kicker `'04 / JUDGING CRITERION: FEASIBILITY...'` on `LIGHT_BG` (**3.56:1** vs req 4.5:1).
   - Slide 5 line 1102: Subtitles `'Client Frontend'`, `'Spatial Engine'`, `'Data Pipeline'`, `'Global Edge & DB'` on `WHITE` (**3.74:1** vs req 4.5:1).
   - Slide 6 lines 1269 & 1297: Stream 01 label & sub on `WHITE` (**3.74:1** vs req 4.5:1).
   - Slide 6 line 1395: Phase 1 tag `'PHASE 1: MVP VALIDATION...'` on `LIGHT_BG` (**3.56:1** vs req 4.5:1).
   - Slide 7 line 1515: Badge symbol `'♿'` on `TEAL_TINT` (**3.32:1** vs req 4.5:1).
6. **`C.TERRACOTTA` Normal Text on `TERRACOTTA_TINT` (3 runs)**:
   - Slide 2 line 463: Badge `'01'` on `TERRACOTTA_TINT` (**4.24:1** vs req 4.5:1).
   - Slide 4 line 925: Pill `'STEP 03'` on `TERRACOTTA_TINT` (**4.24:1** vs req 4.5:1).
   - Slide 7 line 1528: Badge `'★'` on `TERRACOTTA_TINT` (**4.24:1** vs req 4.5:1).

---

## 2. Logic Chain

1. **Premise 1**: WCAG 2.1 Level AA establishes two distinct contrast thresholds:
   - Normal text (< 18pt, or < 14pt bold): minimum **4.5:1**.
   - Large text (>= 18pt, or >= 14pt bold): minimum **3.0:1**.
2. **Premise 2**: `C.GOLD` ('D4AF37') has a high relative luminance ($L = 0.4493$). When placed against white ($L = 1.0000$) or light canvas ($L = 0.9474$), the contrast is at most 2.10:1. This fails both normal text (4.5:1) and large text (3.0:1).
3. **Premise 3**: `C.GOLD_DARK` ('92400E') was already defined in `generate_deck.js` line 40 specifically to provide dark gold accents ($L = 0.0981$).
4. **Deduction 1**: Changing `C.GOLD` to `C.GOLD_DARK` on Slide 5 (line 1139) produces $CR = 7.09:1$, completely fixing the Slide 5 failure and satisfying WCAG AAA.
5. **Deduction 2**: Applying `C.GOLD_DARK` to the category kickers on Slide 4 (line 741) and Slide 6 (line 1214) elevates their contrast on `LIGHT_BG` from 2.00:1 to 6.73:1, eliminating two hidden severe WCAG failures.
6. **Deduction 3**: On Slide 8 (line 1756), the card background is `C.DARK_CARD` ('151D48'). `C.TEXT_MUTED` ('64748B') yields 3.39:1. The author already created `C.DARK_MUTED` ('CADCFC') for dark slides, which yields 11.65:1 (PASS AAA).
7. **Deduction 4**: On Slide 3 (line 578), `C.TEXT_MUTED` ('64748B') against `C.CARD_HEADER_BG` ('F1F5F9') yields 4.34:1 (misses 4.5:1). Switching to `C.TEXT_BODY` ('334155') yields 9.45:1 (PASS AAA).
8. **Deduction 5**: `C.TEAL` ('0D9488', $L = 0.2304$) is too light for small body text on white/tinted backgrounds (3.26:1–3.74:1). Introducing `TEAL_DARK: '0F766E'` ($L = 0.1417$) yields 4.77:1–5.47:1 (100% PASS AA across all light backgrounds). On dark cards (Slide 1 pill), introducing `TEAL_LIGHT: '2DD4BF'` yields 8.67:1.
9. **Deduction 6**: `C.TERRACOTTA` ('C2410C') on `TERRACOTTA_TINT` ('FEE2E2') yields 4.24:1. Introducing `TERRACOTTA_DARK: '9A3412'` yields 5.98:1 on `TERRACOTTA_TINT` and 7.31:1 on `WHITE` (100% PASS AA/AAA).

Simulation with these exact replacements resulted in **0 failures out of 184 text runs (100% pass rate)**.

---

## 3. Caveats

- **Visual Palette Consistency**: All recommended replacements (`GOLD_DARK: '92400E'`, `TEAL_DARK: '0F766E'`, `TERRACOTTA_DARK: '9A3412'`) stay within the exact same hue families as the existing tokens (warm gold, deep cyan/teal, rich terracotta), preserving the visual identity and pitch aesthetic.
- **Large Text Exemption**: Slide 5's metric `< 350 KB` uses `C.TEAL` at 32pt bold. Because it is 32pt bold, its contrast of 3.74:1 already passes the WCAG AA Large Text threshold of 3.0:1. It does not strictly require modification, though changing it to `TEAL_DARK` would elevate it to AAA (5.47:1).
- **Read-Only Constraint Followed**: In accordance with Specification Miner rules, no changes have been written to `generate_deck.js`. The specifications below are turnkey for the implementation worker.

---

## 4. Conclusion & Actionable Fix Specifications

### 4.1 Token Palette Enhancement in `generate_deck.js` (Lines 38–50)
Update `const C` in `generate_deck.js` to include the dark/light variants:
```javascript
  // Brand Accents
  GOLD: 'D4AF37',
  GOLD_DARK: '92400E',
  GOLD_TINT: 'FEF3C7',

  TEAL: '0D9488',
  TEAL_DARK: '0F766E',      // 5.47:1 on WHITE, 5.20:1 on LIGHT_BG, 4.86:1 on TEAL_TINT (WCAG AA)
  TEAL_LIGHT: '2DD4BF',     // 8.67:1 on DARK_CARD (for dark pill badges)
  TEAL_TINT: 'CCFBF1',

  TERRACOTTA: 'C2410C',
  TERRACOTTA_DARK: '9A3412',// 7.31:1 on WHITE, 6.94:1 on LIGHT_BG, 5.98:1 on TERRACOTTA_TINT (WCAG AA)
  TERRACOTTA_TINT: 'FEE2E2',

  SKY_TINT: 'E0F2FE'
```

### 4.2 Exact Callout Replacements Across Slides

#### 1. Slide 5 Metric Card (Mandatory Fix from Challenger 1)
- **File**: `generate_deck.js` line 1139
- **Current**:
  ```javascript
  {
    stat: '₹0 / User',
    color: C.GOLD,
    label: 'Marginal Audio Streaming Cost',
  ```
- **Replacement**:
  ```javascript
  {
    stat: '₹0 / User',
    color: C.GOLD_DARK,
    label: 'Marginal Audio Streaming Cost',
  ```
- **Result**: Contrast improves from **2.10:1 (FAIL)** to **7.09:1 (PASS WCAG AAA)**.

#### 2. Slide 4 Kicker (Hidden Critical Fix)
- **File**: `generate_deck.js` line 741
- **Current**:
  ```javascript
  addStandardHeader(
    slide,
    '03 / JUDGING CRITERION: PRESENTATION & CLARITY',
    'From Map to Monument in 10 Seconds',
    'A seamless, zero-friction web flow taking travelers from national cartography to verified audio in 4 steps.',
    C.GOLD
  );
  ```
- **Replacement**:
  ```javascript
  addStandardHeader(
    slide,
    '03 / JUDGING CRITERION: PRESENTATION & CLARITY',
    'From Map to Monument in 10 Seconds',
    'A seamless, zero-friction web flow taking travelers from national cartography to verified audio in 4 steps.',
    C.GOLD_DARK
  );
  ```
- **Result**: Contrast improves from **2.00:1 (FAIL)** to **6.73:1 (PASS WCAG AA)**.

#### 3. Slide 6 Kicker (Hidden Critical Fix)
- **File**: `generate_deck.js` line 1214
- **Current**:
  ```javascript
  addStandardHeader(
    slide,
    '05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY',
    '3-Tier Monetization & Phased National Expansion',
    'A financially sustainable model blending government partnerships, micro-transactions, and zero-cost scaling.',
    C.GOLD
  );
  ```
- **Replacement**:
  ```javascript
  addStandardHeader(
    slide,
    '05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY',
    '3-Tier Monetization & Phased National Expansion',
    'A financially sustainable model blending government partnerships, micro-transactions, and zero-cost scaling.',
    C.GOLD_DARK
  );
  ```
- **Result**: Contrast improves from **2.00:1 (FAIL)** to **6.73:1 (PASS WCAG AA)**.

#### 4. Slide 8 Footer Attribution (Hidden Fix)
- **File**: `generate_deck.js` line 1756
- **Current**: `color: C.TEXT_MUTED`
- **Replacement**: `color: C.DARK_MUTED`
- **Result**: Contrast improves from **3.39:1 (FAIL)** to **11.65:1 (PASS WCAG AAA)**.

#### 5. Slide 3 Traditional Journey Column Header
- **File**: `generate_deck.js` line 578
- **Current**: `color: C.TEXT_MUTED`
- **Replacement**: `color: C.TEXT_BODY`
- **Result**: Contrast improves from **4.34:1 (FAIL)** to **9.45:1 (PASS WCAG AAA)**.

#### 6. Teal & Terracotta Text Runs on Light Backgrounds
- **Slide 1 (line 255)**: MAP-FIRST DISCOVERY pill: change `textColor: C.TEAL` to `textColor: C.TEAL_LIGHT` (8.67:1) and `line: C.TEAL_LIGHT`.
- **Slide 2 (line 431, 463)**: Badge '01': change `textColor: C.TERRACOTTA` to `textColor: C.TERRACOTTA_DARK` (5.98:1).
- **Slide 2 (line 447, 463)**: Badge '03': change `textColor: C.TEAL` to `textColor: C.TEAL_DARK` (4.86:1).
- **Slide 3 (line 529)**: Kicker: pass `C.TEAL_DARK` instead of default `C.TEAL` (5.20:1).
- **Slide 3 (line 547)**: Paradigm shift text: change `color: C.TEAL` to `color: C.TEAL_DARK` (4.77:1).
- **Slide 3 (line 719)**: Bottom callout: change `color: C.TEAL` to `color: C.TEAL_DARK` (5.20:1).
- **Slide 4 (line 898)**: GPS Navigation ready: change `color: C.TEAL` to `color: C.TEAL_DARK` (5.20:1).
- **Slide 4 (line 909)**: Step 01 pill: change `badgeColor: C.TEAL` to `badgeColor: C.TEAL_DARK` (4.86:1).
- **Slide 4 (line 925)**: Step 03 pill: change `badgeColor: C.TERRACOTTA` to `badgeColor: C.TERRACOTTA_DARK` (5.98:1).
- **Slide 5 (line 995)**: Kicker: pass `C.TEAL_DARK` (5.20:1).
- **Slide 5 (line 1102)**: Layer subtitles: change `color: l.isHighlight ? C.GOLD_DARK : C.TEAL` to `color: l.isHighlight ? C.GOLD_DARK : C.TEAL_DARK` (5.47:1).
- **Slide 6 (lines 1223, 1269, 1297)**: Pillar 1 accent: change `accent: C.TEAL` to `accent: C.TEAL_DARK` (5.47:1).
- **Slide 6 (line 1347, 1395)**: Phase 1 tag: change `color: C.TEAL` to `color: C.TEAL_DARK` (5.20:1).
- **Slide 7 (line 1499, 1531)**: Badge '★': change `accent: C.TERRACOTTA` to `accent: C.TERRACOTTA_DARK` (5.98:1).
- **Slide 7 (line 1515, 1531)**: Badge '♿': change `accent: C.TEAL` to `accent: C.TEAL_DARK` (4.86:1).

---

## 5. Verification Method

To independently verify the contrast math and reproduce these findings:

1. **Verify Slide 5 `C.GOLD` Failure and `C.GOLD_DARK` Fix**:
   ```bash
   .venv/bin/python3 -c "
   def rel_lum(hex_c):
       c = [int(hex_c[i:i+2], 16)/255.0 for i in (0, 2, 4)]
       c = [x/12.92 if x <= 0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
       return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]
   l_white = rel_lum('FFFFFF')
   l_gold = rel_lum('D4AF37')
   l_gold_dark = rel_lum('92400E')
   print(f'Current C.GOLD on WHITE: {(l_white + 0.05) / (l_gold + 0.05):.2f}:1 (FAILS AA Large 3.0:1)')
   print(f'Proposed C.GOLD_DARK on WHITE: {(l_white + 0.05) / (l_gold_dark + 0.05):.2f}:1 (PASSES AAA 7.0:1)')
   "
   ```
   *Expected Output*:
   - Current `C.GOLD` on `WHITE`: `2.10:1`
   - Proposed `C.GOLD_DARK` on `WHITE`: `7.09:1`

2. **Verify Slide 4 & 6 Kicker Contrast**:
   ```bash
   .venv/bin/python3 -c "
   def rel_lum(hex_c):
       c = [int(hex_c[i:i+2], 16)/255.0 for i in (0, 2, 4)]
       c = [x/12.92 if x <= 0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
       return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]
   l_bg = rel_lum('F8F9FC')
   l_gold = rel_lum('D4AF37')
   l_gold_dark = rel_lum('92400E')
   print(f'Kicker with C.GOLD on LIGHT_BG: {(l_bg + 0.05) / (l_gold + 0.05):.2f}:1 (FAILS AA Normal 4.5:1)')
   print(f'Kicker with C.GOLD_DARK on LIGHT_BG: {(l_bg + 0.05) / (l_gold_dark + 0.05):.2f}:1 (PASSES AA Normal 4.5:1)')
   "
   ```
   *Expected Output*:
   - Kicker with `C.GOLD`: `2.00:1`
   - Kicker with `C.GOLD_DARK`: `6.73:1`

3. **Verify Full Deck 100% Pass Post-Fix Simulation**:
   ```bash
   .venv/bin/python3 -c "
   import zipfile, xml.etree.ElementTree as ET
   A_NS = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
   P_NS = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
   def rel_lum(hex_c):
       c = [int(hex_c[i:i+2], 16)/255.0 for i in (0, 2, 4)]
       c = [x/12.92 if x <= 0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
       return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]
   def cr(c1, c2):
       l1, l2 = rel_lum(c1), rel_lum(c2)
       return (max(l1,l2) + 0.05) / (min(l1,l2) + 0.05)
   def sim(s, txt, c, bg):
       if s == 5 and '₹0 / User' in txt: return '92400E'
       if s in (4, 6) and 'JUDGING CRITERION' in txt and c == 'D4AF37': return '92400E'
       if s == 8 and 'Team Herodotus' in txt: return 'CADCFC'
       if s == 1 and 'MAP-FIRST DISCOVERY' in txt: return '2DD4BF'
       if c == '0D9488' and bg in ('FFFFFF', 'F8F9FC', 'CCFBF1', 'E0F2FE'): return '0F766E'
       if c == 'C2410C' and bg == 'FEE2E2': return '9A3412'
       if s == 3 and 'TRADITIONAL VISITOR' in txt: return '334155'
       return c
   fails = 0
   with zipfile.ZipFile('Herodotus_Pitch_Presentation.pptx') as z:
       for s in range(1, 9):
           root = ET.fromstring(z.read(f'ppt/slides/slide{s}.xml'))
           bg_clr = '1E2761' if s in (1, 8) else 'F8F9FC'
           shapes = []
           for sp in root.findall(f'.//{P_NS}sp'):
               xf = sp.find(f'.//{A_NS}xfrm')
               if xf is None: continue
               x, y = int(xf.find(f'{A_NS}off').attrib['x'])/914400.0, int(xf.find(f'{A_NS}off').attrib['y'])/914400.0
               w, h = int(xf.find(f'{A_NS}ext').attrib['cx'])/914400.0, int(xf.find(f'{A_NS}ext').attrib['cy'])/914400.0
               spPr = sp.find(f'{P_NS}spPr')
               fill = None
               if spPr is not None and spPr.find(f'{A_NS}solidFill') is not None:
                   fill = spPr.find(f'{A_NS}solidFill').find(f'{A_NS}srgbClr').attrib.get('val')
               runs = []
               txBody = sp.find(f'{P_NS}txBody')
               if txBody is not None:
                   for r in txBody.findall(f'.//{A_NS}r'):
                       t = r.find(f'{A_NS}t')
                       rPr = r.find(f'{A_NS}rPr')
                       if t is not None and rPr is not None and rPr.find(f'{A_NS}solidFill') is not None:
                           runs.append((t.text, float(rPr.attrib.get('sz', '1000'))/100.0, rPr.attrib.get('b')=='1', rPr.find(f'{A_NS}solidFill').find(f'{A_NS}srgbClr').attrib.get('val')))
               shapes.append((x, y, w, h, fill, runs))
           for i, (x, y, w, h, fill, runs) in enumerate(shapes):
               eff_bg = fill
               if not eff_bg:
                   cx, cy = x + w/2.0, y + h/2.0
                   for px, py, pw, ph, pfill, _ in reversed(shapes[:i]):
                       if pfill and px <= cx <= px+pw and py <= cy <= py+ph:
                           eff_bg = pfill; break
               if not eff_bg: eff_bg = bg_clr
               for txt, sz, b, clr in runs:
                   nc = sim(s, txt, clr, eff_bg)
                   req = 3.0 if (sz >= 18.0 or (sz >= 14.0 and b)) else 4.5
                   if cr(nc, eff_bg) < req: fails += 1
   print(f'Simulated Failures Remaining: {fails}')
   "
   ```
   *Expected Output*:
   - `Simulated Failures Remaining: 0`
