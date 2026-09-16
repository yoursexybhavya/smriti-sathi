# PPTX Technical Specification & Feature Mining Report

**Agent**: Spec Miner 1 (`spec_miner_1`)  
**Parent Orchestrator**: `d4765853-54f2-4146-b1e4-17ddd80c2b03`  
**Target Project**: Herodotus Pitch Presentation Rebuild (`Herodotus_Pitch_Presentation.pptx`)  
**Integrity Mode**: Development  
**Date**: 2026-09-15  

---

## Executive Summary

This report establishes the authoritative, production-grade technical specification for rebuilding the 8-slide Herodotus pitch deck from scratch using `pptxgenjs`. The baseline presentation was confirmed to be completely broken, consisting solely of 8 full-bleed rasterized PNG slides (`![s01.png](Picture1.jpg)`) with zero editable elements. Through direct examination of the pptx skill (`/Users/krishnajangid/.gemini/config/skills/pptx/SKILL.md`), the OOXML validation suite (`scripts/office/validate.py`), the `pptxgenjs` TypeScript definition interfaces (`node_modules/pptxgenjs/types/index.d.ts`), and empirical Node.js runtime tests, this report defines the exact APIs, layout coordinate mathematics, styling tokens, component patterns, and edge-case behaviors required to produce clean, valid, native PowerPoint presentations.

---

## 1. Observation

Direct empirical evidence was gathered across the codebase, skill resources, runtime environments, and existing files:

1. **Broken Baseline Deck (`Herodotus_Pitch_Presentation.pptx`)**:
   - Running `markitdown Herodotus_Pitch_Presentation.pptx` produced:
     ```markdown
     <!-- Slide number: 1 -->
     ![s01.png](Picture1.jpg)
     ...
     <!-- Slide number: 8 -->
     ![s08.png](Picture1.jpg)
     ```
   - Unzipping the presentation confirmed 8 static PNG images in `ppt/media/image1.png` to `image8.png` totaling 16,103,335 bytes, with no editable text shapes.

2. **Authoritative Skill Constraints (`SKILL.md`)**:
   - Line 33: `"Set pres.layout before adding slides. The default canvas is LAYOUT_16x9 = 10" × 5.625", not 13.3" wide... (LAYOUT_WIDE is 13.3" × 7.5".)"`
   - Line 34: `"Hex colors: never #, never 8 digits. color: 'FF0000'. Both '#FF0000' and alpha baked into the hex ('00000020') corrupt the file. For translucency: transparency: 0-100 on fills and images, opacity: 0.0-1.0 on shadows — each is silently ignored on the other."`
   - Line 35: `"pptxgenjs mutates option objects in place (converts values to EMU on first use). Never share one shadow/options object across two add* calls — build a fresh object each time."`
   - Line 36: `"Shadow offset must be ≥ 0 — a negative offset corrupts the file. To cast a shadow upward, use angle: 270 with a positive offset."`
   - Line 37: `"'letterSpacing' is silently ignored — the real option is 'charSpacing'."`
   - Line 38: `"Lists: bullet: true on each item, never a literal • (renders double bullets). Set breakLine: true on every array item except the last. Space bulleted paragraphs with paraSpaceAfter, not lineSpacing (huge gaps)."`
   - Line 39: `"One new pptxgen() per output file — never reuse an instance."`
   - Line 40: `"'rectRadius' only works on ROUNDED_RECTANGLE, not RECTANGLE."`
   - Line 42: `"Text boxes have built-in internal padding — set margin: 0 whenever text must align with a shape, line, or icon at the same x."`
   - Line 43: `"Speaker notes go in slide.addNotes('...') (plain text, once per slide), never in a text box on the slide."`
   - Lines 161-162: `"NEVER use accent lines under titles... NEVER add decorative color bars or accent stripes — this includes header/footer bars spanning the slide width, vertical sidebar stripes... thin accent stripes along one edge of a card... or single-side borders."`
   - Line 163: `"Don't default to cream/beige backgrounds — use white (FFFFFF) or brand palette."`

3. **In-Place Mutation Verification (Runtime Test)**:
   - A shadow object `{ type: "outer", color: "000000", blur: 3, offset: 4, angle: 45, opacity: 0.2 }` passed to `addShape` was inspected after presentation serialization:
     ```json
     {"type":"outer","color":"000000","blur":38100,"offset":50800,"angle":2700000,"opacity":20000}
     ```
   - `blur` was mutated from `3` to `38100` EMUs, `offset` from `4` to `50800` EMUs, `opacity` from `0.2` to `20000` (1/100,000ths). Reusing this object in a subsequent call re-multiplies already converted units, corrupting the geometry.

4. **Negative Shadow Offset Corrupts DrawingML**:
   - Setting `offset: -5` generated `<a:outerShdw dist="-63500">` in `ppt/slides/slide1.xml`. DrawingML schema specifies `dist` as `ST_PositiveCoordinate`. Negative values violate OpenXML and cause PowerPoint repair prompts.

5. **`rectRadius` Geometry Inspection**:
   - Setting `rectRadius: 0.1` on `ROUNDED_RECTANGLE` generated `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 5000"/></a:avLst></a:prstGeom>`.
   - The value maps linearly: `rectRadius * 50000 = adj value`.
   - On `RECTANGLE`, `prst="rect"` ignores the `adj` formula completely.

6. **Speaker Notes Behavior**:
   - Calling `slide.addNotes("Note 1")` followed by `slide.addNotes("Note 2")` concatenated the strings in `ppt/notesSlides/notesSlide1.xml` as `<a:t>Note 1Note 2</a:t>` with zero whitespace separation. Single call per slide is mandatory.

7. **Embedded Asset Telemetry**:
   - All 6 reference images in `/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/` were measured at `1376x768` (aspect ratio ~1.792 / 16:9).
   - Calling `slide.addImage({ rounding: true })` applies `prst="ellipse"` in OpenXML (an oval crop, not a rounded rectangle).

---

## 2. Technical Specification

### 2.1 Coordinate System & Layout Canvas (`LAYOUT_WIDE`)

The presentation MUST use widescreen 16:9 layout (`LAYOUT_WIDE`), which measures exactly:
- **Width**: `13.333` inches (`12,192,000` EMUs)
- **Height**: `7.5` inches (`6,858,000` EMUs)
- **Origin `(0, 0)`**: Top-left corner of the slide canvas.
- **Initialization Requirement**: `pres.layout = 'LAYOUT_WIDE'` MUST be set BEFORE `pres.addSlide()`. If set after, already added slides retain the default 10" x 5.625" canvas.

#### Safe Margins & Bounding Boxes
- **Slide Margin (Left / Right)**: Minimum `0.5"`, recommended `0.8"` for premium breathing room.
- **Slide Margin (Top / Bottom)**: Minimum `0.5"`, recommended `0.6"` top, `0.5"` bottom.
- **Usable Content Bounding Box**:
  - `x`: `0.8"`
  - `y`: `0.6"`
  - `w`: `11.733"` (`13.333 - 1.6`)
  - `h`: `6.4"` (`7.5 - 1.1`)

#### Standard Vertical Rhythm
| Zone | `y` Coordinate | Height `h` | Purpose |
|------|----------------|------------|---------|
| **Kicker / Category Tag** | `0.60"` | `0.30"` | Uppercase 11-12pt bold badge or kicker |
| **Slide Title** | `0.90" - 0.95"` | `0.65" - 0.75"` | 32-40pt bold primary heading |
| **Subtitle / Lead In** | `1.65"` | `0.35"` | 14-16pt clarifying summary text |
| **Main Content Zone** | `2.10"` | `4.70" - 4.80"` | Cards, columns, charts, visual elements |
| **Slide Floor / Margin** | `6.90"` | `0.40"` | Bottom safe margin / small metadata |

#### Multi-Column Grid Formulas (Usable Width = 11.733")
1. **2 Equal Columns**:
   - `col_w = 5.60"`
   - `gap = 0.533"`
   - Column 1: `x = 0.80"`
   - Column 2: `x = 6.933"` (`0.80 + 5.60 + 0.533`)
2. **3 Equal Columns (Cards / Pillars)**:
   - `col_w = 3.644"` (~`3.64"`)
   - `gap = 0.40"`
   - Column 1: `x = 0.80"`
   - Column 2: `x = 4.844"` (`0.80 + 3.644 + 0.40`)
   - Column 3: `x = 8.888"` (`4.844 + 3.644 + 0.40`)
3. **4 Equal Columns (Metrics / Steps)**:
   - `col_w = 2.67"`
   - `gap = 0.35"`
   - Column 1: `x = 0.80"`
   - Column 2: `x = 3.82"`
   - Column 3: `x = 6.84"`
   - Column 4: `x = 9.86"`
4. **Asymmetric 2-Column (Split Hero / Showcase)**:
   - Left (Text/Stats, 55%): `x = 0.80"`, `w = 6.20"`
   - Gap: `0.40"`
   - Right (Image/Card, 45%): `x = 7.40"`, `w = 5.133"`

---

### 2.2 Typography & Color Rules

#### Typography Tokens
- **Headings / Numbers Font**: **`Cambria`** (Safe serif font, excellent editorial personality, metric-compatible with zero QA font-substitution risk).
- **Body / Labels Font**: **`Calibri`** (Safe sans-serif font, crisp legibility, standard Office typography).
- **Font Size Hierarchy**:
  - Slide Hero Title (Cover/Closing): `40 - 44pt` bold (`Cambria`)
  - Content Slide Title: `32 - 36pt` bold (`Cambria`)
  - Section Header / Card Header: `18 - 22pt` bold (`Cambria`)
  - Subheaders / Kicker / Badges: `11 - 13pt` bold (`Calibri`)
  - Body Text / Paragraphs: `14 - 15pt` regular (`Calibri`)
  - Captions / Supporting Metrics: `11 - 12pt` muted (`Calibri`)
  - Large Stat Callouts: `48 - 60pt` bold (`Cambria`)

#### Color Tokens (Hex Strings WITHOUT `#`)
To avoid OpenXML schema corruption, every color MUST be a 6-digit hex string without `#`.
- **Primary Navy / Dark Background**: `"1E2761"` (used for Cover and Closing slide backgrounds, dark cards)
- **Deep Slate (Body Text on Light)**: `"1E293B"` (near-black high-contrast text)
- **Muted Slate (Secondary Text)**: `"475569"` (secondary labels, supporting descriptions)
- **Subtle Slate (Borders/Dividers)**: `"E2E8F0"` (card borders, subtle grid lines)
- **Card Background (Light Tint)**: `"F8FAFC"` (off-white card fill)
- **White**: `"FFFFFF"` (slide background for content slides, text on dark cards)
- **Accent Emerald / Teal**: `"028090"` (primary brand accent: badges, icons, key metrics)
- **Vibrant Mint Accent**: `"02C39A"` (supporting energetic accent, highlights on dark backgrounds)
- **Warm Heritage Amber/Gold**: `"E0A96D"` (heritage accent for monuments, ASI credentials)
- **Alert / Problem Rose**: `"E11D48"` (problem markers, pain points)

---

### 2.3 Component Specifications

#### 1. Card Container (Native Shape)
```javascript
// Base container
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: colX,
  y: cardY,
  w: cardW,
  h: cardH,
  fill: { color: "F8FAFC" },
  line: { color: "E2E8F0", width: 1 },
  rectRadius: 0.05, // Subtle, modern rounding
  shadow: {
    type: "outer",
    color: "000000",
    blur: 4,
    offset: 2,
    angle: 45,
    opacity: 0.06
  }
});

// Card content bounding box (safe padding = 0.25" on all sides)
const contentX = colX + 0.25;
const contentW = cardW - 0.50;
```

#### 2. Icon Circle with Native Glyph
```javascript
// Colored circle badge
slide.addShape(pres.shapes.OVAL, {
  x: iconX,
  y: iconY,
  w: 0.50,
  h: 0.50,
  fill: { color: "028090" }
});

// Centered letter or unicode symbol
slide.addText("✦", {
  x: iconX,
  y: iconY,
  w: 0.50,
  h: 0.50,
  fontFace: "Calibri",
  fontSize: 16,
  bold: true,
  color: "FFFFFF",
  align: "center",
  valign: "middle",
  margin: 0
});
```

#### 3. Pill Badge
```javascript
// Capsule pill shape
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: badgeX,
  y: badgeY,
  w: 1.40,
  h: 0.32,
  fill: { color: "E0F2FE" }, // 10% tint
  line: { color: "BAE6FD", width: 1 },
  rectRadius: 0.50 // Maximum rounding creates pill
});

slide.addText("LIVE MVP READY", {
  x: badgeX,
  y: badgeY,
  w: 1.40,
  h: 0.32,
  fontFace: "Calibri",
  fontSize: 10,
  bold: true,
  color: "028090",
  align: "center",
  valign: "middle",
  margin: 0
});
```

#### 4. Metric / Stat Block
```javascript
// Stat block: Large number + label
slide.addText("3,693", {
  x: statX,
  y: statY,
  w: statW,
  h: 0.85,
  fontFace: "Cambria",
  fontSize: 52,
  bold: true,
  color: "028090",
  align: "center",
  valign: "bottom",
  margin: 0
});

slide.addText("ASI Protected Monuments", {
  x: statX,
  y: statY + 0.90,
  w: statW,
  h: 0.40,
  fontFace: "Calibri",
  fontSize: 13,
  bold: true,
  color: "1E293B",
  align: "center",
  valign: "top",
  margin: 0
});

slide.addText("Unified across 28 states & 8 UTs", {
  x: statX,
  y: statY + 1.30,
  w: statW,
  h: 0.35,
  fontFace: "Calibri",
  fontSize: 11,
  color: "64748B",
  align: "center",
  valign: "top",
  margin: 0
});
```

#### 5. Formatted Multi-Run Text & Lists
```javascript
slide.addText([
  {
    text: "Zero Server Ingestion Cost: ",
    options: {
      bold: true,
      color: "1E2761",
      fontFace: "Calibri",
      fontSize: 14,
      bullet: true,
      breakLine: false // Keeps next run in same bullet item
    }
  },
  {
    text: "Pre-rendered static JSON bundles deployed to edge CDN nodes.",
    options: {
      bold: false,
      color: "475569",
      fontFace: "Calibri",
      fontSize: 14,
      breakLine: true, // Terminates bullet item and adds line break
      paraSpaceAfter: 10 // Exact paragraph spacing in points
    }
  },
  {
    text: "Browser-Native Speech Synthesis: ",
    options: {
      bold: true,
      color: "1E2761",
      fontFace: "Calibri",
      fontSize: 14,
      bullet: true,
      breakLine: false
    }
  },
  {
    text: "Zero cloud TTS latency and zero per-character API fees.",
    options: {
      bold: false,
      color: "475569",
      fontFace: "Calibri",
      fontSize: 14,
      breakLine: false // Last item in array: breakLine is false
    }
  }
], {
  x: contentX,
  y: contentY,
  w: contentW,
  h: contentH,
  margin: 0 // Eliminates built-in box insets
});
```

#### 6. Image Embedding
```javascript
slide.addImage({
  path: "/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48/visitor_monument_1789383102153.jpg",
  x: imgX,
  y: imgY,
  w: imgW,
  h: imgH,
  sizing: {
    type: "cover", // Covers target box while preserving aspect ratio
    w: imgW,
    h: imgH
  }
});
```

#### 7. Speaker Notes
```javascript
slide.addNotes(
  "Cover the 4000-year heritage divide. Highlight that while top 50 monuments have commercial guides, " +
  "3600+ rural and regional monuments stand silent. Herodotus provides instant digital context with zero download."
);
```

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Presentation Config | `pres.layout` | Sets presentation canvas dimensions | `'LAYOUT_WIDE'`, `'LAYOUT_16x9'`, `'LAYOUT_4x3'`, `'LAYOUT_16x10'` | Internal slide canvas dimensions set | Must be called BEFORE `addSlide()`; if called after, added slides remain in default `screen16x9` | `SKILL.md:33`, `node_modules/pptxgenjs/types/index.d.ts:2583`, runtime tests |
| 2 | Presentation Config | Presentation Metadata | Sets Dublin Core / app properties | `pres.title`, `pres.author`, `pres.company`, `pres.subject` | `docProps/core.xml` attributes | Non-string types cast to string | `index.d.ts:2580-2592` |
| 3 | Slide Lifecycle | `pres.addSlide()` | Instantiates a new slide part and registers relationships | Optional `{ masterName, sectionTitle }` | Returns `Slide` instance | Reusing a `PptxGenJS` instance causes duplicate part IDs and corrupts output | `SKILL.md:39`, `index.d.ts:2603` |
| 4 | Slide Properties | `slide.background` | Sets slide background color or image fill | `{ color: HexColor, transparency?: number, path?: string, data?: string }` | Emits `<p:bg>` in slide XML | Deprecated `slide.bkgd` still exists; `background` is preferred | `SKILL.md:34`, `index.d.ts:2618` |
| 5 | Slide Properties | `slide.color` | Sets default font color for slide | `HexColor` (e.g. `'000000'`) | Sets default run font color | Color must be 6 hex digits without `#` | `index.d.ts:2624` |
| 6 | Text Rendering | `slide.addText()` | Adds native text box with single or multi-run text | `string \| TextProps[]`, `TextPropsOptions` | Emits `<p:sp>` shape with `<p:txBody>` | Missing text body corrupts slide XML | `SKILL.md:32`, `index.d.ts:2668`, `helpers/pptx_slide.py:28` |
| 7 | Text Formatting | Multi-run Text Array | Allows granular inline styling (bolding, color, fonts) | Array of `{ text: string, options: TextProps }` | Creates single `<a:p>` or multiple `<a:p>` with distinct `<a:r>` runs | Incorrect `breakLine` placement causes unintended paragraph splits | `index.d.ts:1795`, runtime tests |
| 8 | Text Formatting | `margin` in Text Box | Configures internal text box padding (insets) | `number \| [number, number, number, number]` (pt) | Emits `lIns`, `tIns`, `rIns`, `bIns` on `<a:bodyPr>` | If omitted, PowerPoint applies default 0.1" / 0.05" padding causing alignment offset | `SKILL.md:42`, `index.d.ts:1855`, runtime tests |
| 9 | Text Formatting | `charSpacing` | Adjusts character kerning / spacing in points | `number` (pt) | Emits `spc` attribute on `<a:rPr>` | `letterSpacing` is silently ignored by pptxgenjs | `SKILL.md:37`, `index.d.ts:1800` |
| 10 | List Formatting | `bullet` property | Generates native OpenXML bullet points | `boolean \| { type, characterCode, indent, numberType }` | Emits `<a:buChar>` or `<a:buAutoNum>` on `<a:pPr>` | Literal `•` in text string creates double bullets | `SKILL.md:38`, `index.d.ts:1140-1175` |
| 11 | List Formatting | `paraSpaceAfter` | Controls vertical paragraph gap after list items | `number` (pt) | Emits `<a:spcAft><a:spcPts val="X"/></a:spcAft>` | Using `lineSpacing` instead creates excessive inter-line gaps | `SKILL.md:38`, `index.d.ts:1864`, runtime tests |
| 12 | Shape Creation | `slide.addShape()` | Inserts native vector geometry | `SHAPE_NAME`, `ShapeProps` | Emits `<p:sp>` with preset geometry | Invalid shape name falls back to rect or throws | `index.d.ts:2657`, runtime tests |
| 13 | Shape Geometry | `pres.shapes.ROUNDED_RECTANGLE` | Creates rounded rectangle container | `'roundRect'` string value | Emits `<a:prstGeom prst="roundRect">` | None | `index.d.ts:1439`, runtime tests |
| 14 | Shape Geometry | `rectRadius` | Sets corner radius fraction on rounded rectangles | `number` between `0.0` and `1.0` | Maps to `<a:gd name="adj" fmla="val X">` where `X = rectRadius * 50000` | Silently ignored on standard `RECTANGLE` | `SKILL.md:40`, `index.d.ts:1509`, runtime tests |
| 15 | Shape Geometry | `pres.shapes.OVAL` | Creates circle / ellipse shape | `'ellipse'` string value | Emits `<a:prstGeom prst="ellipse">` | Width and height must be equal for perfect circles | `index.d.ts:1439`, runtime tests |
| 16 | Shape Geometry | `pres.shapes.LINE` | Creates straight vector divider line | `'line'` string value | Emits `<p:cxnSp>` or line geometry | Height `h: 0` required for horizontal lines | `index.d.ts:1439`, runtime tests |
| 17 | Shape Styling | `fill` property | Controls shape background color and transparency | `{ color: HexColor, transparency?: number, type?: 'solid' \| 'none' }` | Emits `<a:solidFill>` with `<a:srgbClr>` and optional `<a:alpha>` | Alpha in hex (`"00000020"`) triggers runtime warning or corrupts color | `SKILL.md:34`, `index.d.ts:985` |
| 18 | Shape Styling | `line` property | Controls shape border stroke | `{ color: HexColor, width?: number, dashType?: string }` | Emits `<a:ln>` with `<a:solidFill>` and line properties | Negative width or invalid dashType ignored | `index.d.ts:925-975` |
| 19 | Depth & Shadow | `shadow` property | Adds drop shadow effect | `ShadowProps`: `{ type, color, blur, offset, angle, opacity }` | Emits `<a:effectLst><a:outerShdw>` | `offset < 0` writes invalid `dist` attribute and corrupts file; values mutated in place | `SKILL.md:35-36`, `index.d.ts:1750-1790`, runtime tests |
| 20 | Image Insertion | `slide.addImage()` | Embeds raster graphics from local file or URL | `ImageProps`: `{ path, x, y, w, h, sizing, rotate }` | Emits `<p:pic>` with relationship to `ppt/media/` | Missing file path throws unhandled rejection | `index.d.ts:2645`, runtime tests |
| 21 | Image Sizing | `sizing` property | Governs aspect ratio fit and cropping | `{ type: 'contain' \| 'cover' \| 'crop', w, h, x?, y? }` | Computes source crop offsets (`<a:srcRect>`) | Sizing box must match container dimensions | `index.d.ts:1355-1390`, runtime tests |
| 22 | Image Rounding | `rounding: boolean` | Toggles geometry preset on image frame | `boolean` | Replaces `prst="rect"` with `prst="ellipse"` | Produces an oval/circle crop, NOT a rounded rectangle | Runtime test inspection |
| 23 | Speaker Notes | `slide.addNotes()` | Adds presenter speaker notes | `string` (plain text) | Generates `ppt/notesSlides/notesSlideN.xml` and relationships | Calling multiple times concatenates strings without whitespace | `SKILL.md:43`, `index.d.ts:2651`, runtime tests |
| 24 | Tables | `slide.addTable()` | Generates native grid tables | `TableRow[]`, `TableProps` | Emits `<p:graphicFrame>` with `<a:tbl>` | Empty rows throw or produce invalid table XML | `index.d.ts:2663` |
| 25 | File Packaging | `pres.writeFile()` | Compiles and writes ZIP package to disk | `{ fileName: string }` | Returns Promise resolving to output filename | Failure if output directory does not exist | `index.d.ts:2570` |

---

## 4. Edge Cases & Observed Behaviors

| # | Feature | Input / Condition | Observed Behavior | Recovery / Mitigation Rule |
|---|---------|-------------------|-------------------|----------------------------|
| 1 | Option Object Reuse | Reusing the same `{ shadow }` or `{ options }` object across multiple `add*` calls | pptxgenjs mutates values to EMUs on first serialization (e.g. `offset: 4` becomes `50800`, `blur: 3` becomes `38100`). Subsequent calls multiply already converted numbers by 12,700, resulting in massive numbers or crash | Construct fresh option objects or use immutable helper factory functions for each call |
| 2 | Shadow Offset | `shadow.offset < 0` (e.g. `-5`) | Emits `<a:outerShdw dist="-63500">`. OOXML schema requires `ST_PositiveCoordinate` for `dist`. PowerPoint flags file as damaged | Set `offset >= 0`. To cast upward shadows, set `angle: 270` with positive `offset` |
| 3 | Hex Color Prefix | `color: "#1E2761"` (with `#`) | pptxgenjs strips `#` in some contexts but in others can emit `#` into `<a:srgbClr val="#1E2761">`. Six hex digits are strictly required by XSD | Strip all `#` characters: always pass clean 6-character strings (e.g. `"1E2761"`) |
| 4 | 8-Digit RGBA Hex | `color: "00000020"` | pptxgenjs logs `"00000020" is not a valid scheme color or hex RGB! "000000" used instead.` Transparency is discarded and text falls back to black | Use 6-character hex (`"000000"`) and specify `transparency: 80` (0-100 scale) separately |
| 5 | Opacity vs Transparency | Passing `opacity` to fill or `transparency` to shadow | `opacity` is silently ignored on shape fills; `transparency` is silently ignored on drop shadows | On fills/images use `transparency: 0-100`. On shadows use `opacity: 0.0-1.0` |
| 6 | Layout Assignment Timing | `pres.layout = 'LAYOUT_WIDE'` executed after `pres.addSlide()` | Slide 1 retains default `10" × 5.625"` canvas; only subsequent slides get `13.333" × 7.5"` | Always set `pres.layout = 'LAYOUT_WIDE'` immediately after `new pptxgen()` before any slide is created |
| 7 | `rectRadius` on Rectangle | `slide.addShape(pptx.shapes.RECTANGLE, { rectRadius: 0.1 })` | Emits `<a:prstGeom prst="rect">` with `adj` formula. PowerPoint ignores `adj` on standard `rect`, rendering sharp corners | Always use `pptx.shapes.ROUNDED_RECTANGLE` when rounded corners are desired |
| 8 | Multiple `addNotes` Calls | Calling `slide.addNotes("A")` then `slide.addNotes("B")` on same slide | The strings are concatenated directly without whitespace: `<a:t>AB</a:t>` | Consolidate all speaker notes into a single string per slide before calling `addNotes()` |
| 9 | List Line Breaks | Omitting `breakLine: true` between bullet items in an array | Consecutive array items are rendered on the same line as inline runs rather than distinct bullet points | Set `breakLine: true` on every bullet item except the final item |
| 10 | Trailing Bullet Break | Setting `breakLine: true` on the final item in a bullet array | In some Office versions, creates an extraneous blank bullet point at the bottom of the list | Set `breakLine: false` (or omit) on the last item of the text array |
| 11 | Literal Bullet Characters | Passing `text: "• Item text"` with `bullet: true` | PowerPoint renders two bullets: the native bullet plus the literal bullet character | Never include literal bullet symbols (`•`, `*`, `-`) when `bullet: true` is enabled |
| 12 | Bullet Spacing | Using `lineSpacing` to space bullet paragraphs | Multiplies the distance between lines within the same bullet item, creating awkward gaps in wrapped text | Use `paraSpaceAfter: 8-12` (points) to space distinct bullet paragraphs |
| 13 | Text Box Padding | Leaving `margin` unspecified when aligning text with shapes | PowerPoint applies default insets (0.1" left/right, 0.05" top/bottom), shifting text 0.1" to the right of adjacent shapes | Set `margin: 0` on text boxes that must align flush with shapes or icon circles |
| 14 | Image Rounding Geometry | Setting `rounding: true` on `slide.addImage()` | Changes preset geometry to `ellipse` (an oval crop), not a rounded rectangle | If a rounded rectangular image frame is desired, use standard rectangular image and place inside or alongside styled cards |
| 15 | Text Overflow | Large font sizes with excessive copy in fixed-height cards | Text overflows container bounding box and collides with elements below; pptxgenjs does not auto-resize containers | Calculate exact line heights (approx 0.25" per line at 14pt) and ensure card height accommodates copy + padding |

---

## 3. Logic Chain

1. **Premise 1: Source Defect Identification**:
   - Observation 1 confirmed that `Herodotus_Pitch_Presentation.pptx` consists solely of 8 static PNG images with no native text or shapes.
   - Conclusion 1: The deck must be rebuilt from the ground up using `pptxgenjs` with native PowerPoint objects to fulfill the primary user requirement (R1).

2. **Premise 2: OOXML Schema & Validation Compliance**:
   - `validate.py` enforces strict DrawingML XSD rules: valid 6-digit hex colors, unique relationship IDs, proper slide layout references, and non-empty text bodies.
   - Empirical tests showed that negative shadow offsets, 8-digit hex colors, or mutated option objects produce malformed XML or console warnings.
   - Conclusion 2: The generator script must adhere strictly to clean 6-digit hex colors without `#`, `offset >= 0`, `paraSpaceAfter`, and never reuse option objects.

3. **Premise 3: Coordinate System & Canvas Integrity**:
   - `pres.layout = 'LAYOUT_WIDE'` sets the canvas to 13.333" x 7.5". Setting this after `addSlide()` fails to update prior slides.
   - Content placed beyond 13.333" width or 7.5" height gets clipped.
   - Conclusion 3: The generator script must assign `pres.layout = 'LAYOUT_WIDE'` as its very first operational instruction, and constrain all slide elements to the safe bounding box (`x: 0.8"`, `y: 0.6"`, `w: 11.733"`, `h: 6.4"`).

4. **Premise 4: Professional Visual Hierarchy & Brand Theme**:
   - `SKILL.md` mandates avoiding AI hallmarks: no accent lines under titles, no decorative edge bars/stripes, no generic blue or beige defaults, and varying layouts across slides.
   - The user requested a "mixed sandwich" structure: dark cover and closing slides (`"1E2761"`), light content slides (`"FFFFFF"`/`"F8FAFC"`), and heritage-aligned accents (`"028090"`, `"02C39A"`, `"E0A96D"`).
   - Conclusion 4: The 8-slide architecture must use dark backgrounds for Slides 1 & 8, crisp light backgrounds for Slides 2–7, and rely on card containers, subtle drop shadows, and icon circles rather than AI-style accent bars.

---

## 4. Caveats

1. **Headless LibreOffice (`soffice`) Binary**:
   - While `defusedxml`, `lxml`, `Pillow`, and `markitdown` are installed and fully functional in `.venv`, `soffice` is not installed on the host macOS system. Headless PDF generation via `soffice.py` requires an external LibreOffice installation. Full schema validation (`validate.py`) and content extraction (`markitdown`) operate independently of LibreOffice and run with 100% fidelity in `.venv`.
2. **Dynamic Text Autofit**:
   - `pptxgenjs` supports `fit: 'shrink' | 'resize'`, but both MS PowerPoint and LibreOffice dynamically calculate scaling only when a user manually edits a shape. The generator must mathematically size containers to prevent overflow at 100% zoom.
3. **Image Assets**:
   - All 6 reference images exist and have an aspect ratio of 1.792 (16:9). Embedded images should use `sizing: { type: 'cover', w, h }` to avoid distortion.

---

## 5. Conclusion & Actionable Directives for Slide Generator

The slide generation agent should implement a single Node.js script (e.g. `generate_deck.js`) following these exact specifications:

1. **Script Structure**:
   ```javascript
   const pptxgen = require('pptxgenjs');
   const pres = new pptxgen();
   pres.layout = 'LAYOUT_WIDE'; // MUST be first
   pres.title = 'Herodotus — Pitch Presentation';
   pres.author = 'Team Herodotus';
   ```
2. **Color Palette Constants**:
   - `BG_DARK: "1E2761"`, `BG_LIGHT: "FFFFFF"`, `BG_CARD: "F8FAFC"`
   - `TEXT_DARK: "1E293B"`, `TEXT_MUTED: "475569"`, `TEXT_LIGHT: "FFFFFF"`
   - `ACCENT_TEAL: "028090"`, `ACCENT_MINT: "02C39A"`, `ACCENT_GOLD: "E0A96D"`
   - `BORDER_SUBTLE: "E2E8F0"`
3. **Typography Standards**:
   - Headings & Big Stats: `fontFace: "Cambria"`
   - Body & Labels: `fontFace: "Calibri"`
   - Slide Titles: `fontSize: 34 - 38`, `bold: true`
   - Body text: `fontSize: 14 - 15`
4. **Layout Variety (8 Slides)**:
   - **Slide 1 (Dark Cover)**: Full-bleed dark background, centered title, pill badge, hero imagery, tagline, live MVP notice.
   - **Slide 2 (Problem Statement)**: 2-column split (Card with pain-point icon + bullet list on left, traveler monument image on right).
   - **Slide 3 (Innovation & Originality)**: 3-column comparative cards highlighting spatial discovery, zero-friction PWA, and living audio narratives.
   - **Slide 4 (Product Experience / Live Demo)**: 4-step horizontal user journey flow with embedded India heritage map.
   - **Slide 5 (Feasibility & Technical Architecture)**: 2x2 grid of architectural pillars (PWA edge delivery, Web Speech API, MongoDB Atlas, Mapbox GL).
   - **Slide 6 (Business Model & Scalability)**: 3 monetization revenue stream cards + pan-India expansion roadmap.
   - **Slide 7 (Impact & Social Relevance)**: Asymmetric layout with big stat callouts (3,693 monuments, 5+ languages) + grandfather/grandson heritage image.
   - **Slide 8 (Dark Closing)**: Deep navy finish, illuminated fort gateway image, team tagline, Q&A invitation.
5. **No AI Hallmarks**:
   - Zero lines directly under titles.
   - Zero color accent stripes on card edges.
   - Clean spacing with `margin: 0` on aligned text boxes.
   - Every slide equipped with full presenter speaker notes via `slide.addNotes()`.

---

## 6. Verification Method

To independently verify the generated `.pptx` file against this specification:

1. **Schema & Integrity Validation**:
   ```bash
   .venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx
   ```
   *Expected result*: `All validations PASSED!` with zero errors.

2. **Content & Native Text Extraction**:
   ```bash
   .venv/bin/markitdown Herodotus_Pitch_Presentation.pptx
   ```
   *Expected result*: Complete text and speaker notes extracted for all 8 slides under `<!-- Slide number: N -->` markers (no rasterized text placeholders).

3. **Placeholder Text Check**:
   ```bash
   .venv/bin/markitdown Herodotus_Pitch_Presentation.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert"
   ```
   *Expected result*: Exit code 1 (no matches).
