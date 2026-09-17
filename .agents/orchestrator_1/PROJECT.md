# Project: Herodotus Pitch Presentation Rebuild

## Architecture
- **Generator Core**: Single executable Node.js script (`generate_deck.js`) utilizing `pptxgenjs` v4.0.1.
- **Canvas & Dimensions**: 16:9 Widescreen (`LAYOUT_WIDE`: 13.333" × 7.5"), bounding box `x: 0.8"`, `y: 0.6"`, `w: 11.733"`, `h: 6.4"`.
- **Theme**: "Mixed Sandwich" pattern:
  - Dark Canvas (`1E2761`) for Cover (Slide 1) and Closing (Slide 8).
  - Light Canvas (`FFFFFF` / `F8F9FC`) for Content Slides (Slides 2–7).
  - Consistent bold heritage accents: Warm Gold (`D4AF37`), Emerald/Teal (`0D9488`), Terracotta (`C2410C`).
- **Typography**: Safe Office pairings (`Cambria` 32-44pt for headings, `Calibri` 10-15pt for body/labels).
- **Validation Engine**: Python 3.11 with `defusedxml`, `lxml`, `Pillow`, `markitdown` executing `validate.py`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Widescreen Canvas Setup | `pres.layout = 'LAYOUT_WIDE'` (13.333" x 7.5") set before any slide instantiation | M1 | Survey (Spec Miner 1) |
| 2 | Hex Color Integrity | Strict 6-digit hex without `#` prefix across all shapes, texts, and lines | M1 | Survey (Spec Miner 1) |
| 3 | Immutable Option Objects | Dedicated fresh options for every `add*` call to prevent EMU mutation | M1 | Survey (Spec Miner 1) |
| 4 | Safe Shadow Offsets | All shadows have `offset >= 0` with proper `angle` to ensure DrawingML compliance | M1 | Survey (Spec Miner 1) |
| 5 | Text Box Alignment & Kerning | `margin: 0` for aligned shapes; `charSpacing` instead of `letterSpacing` | M1 | Survey (Spec Miner 1) |
| 6 | Bullet List Formatting | `bullet: true`, `breakLine: true` (false on last item), `paraSpaceAfter` spacing | M1 | Survey (Spec Miner 1) |
| 7 | Rounded Shape Styling | `pres.shapes.ROUNDED_RECTANGLE` with `rectRadius` for cards and badges | M1 | Survey (Spec Miner 1) |
| 8 | Aspect-Preserved Picture Embedding | Embedded images using `sizing: { type: 'cover' }` preserving 1.792 aspect ratio | M1 | Survey (Explorer 1) |
| 9 | Speaker Notes Integration | Single `slide.addNotes()` call per slide with 3-4 min calibrated pitch script | M1 | Survey (Explorer 2) |
| 10 | Slide 1: Cover (Dark) | Hero Amer Fort image, title, subtitle, live MVP status card, category kicker | M1 | Survey (Explorer 2) |
| 11 | Slide 2: The Problem (Light) | Asymmetric split, visitor photo, 3 stacked problem cards, bottom reality callout | M1 | Survey (Explorer 2) |
| 12 | Slide 3: Innovation & Originality | Criterion 1 badge, 2-column comparative matrix (Traditional vs Herodotus) | M1 | Survey (Explorer 2) |
| 13 | Slide 4: Product Experience & Demo | Criterion 4 badge, app mockup with India heritage map, 4-step process cards | M1 | Survey (Explorer 2) |
| 14 | Slide 5: Feasibility & Tech Viability | Criterion 2 badge, 5-column architecture stack + 3 technical metric cards | M1 | Survey (Explorer 2) |
| 15 | Slide 6: Business Model & Scalability | Criterion 5 badge, 3 monetization pillars + 3-stage scalability roadmap | M1 | Survey (Explorer 2) |
| 16 | Slide 7: Impact & Social Relevance | Criterion 3 badge, grandfather/grandson photo + 3 social impact cards | M1 | Survey (Explorer 2) |
| 17 | Slide 8: Closing & Vision (Dark) | Visionary statement, 3 readiness anchor cards, live URL, Q&A invitation | M1 | Survey (Explorer 2) |
| 18 | Office Schema & Text Validation | Clean validation via `validate.py` and `markitdown` extraction verification | M2 | Survey (Explorer 1 & Spec Miner 1) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Presentation Generator Implementation | Implement `generate_deck.js` to build all 8 slides with native PowerPoint objects, embedded pictures, mixed sandwich styling, and speaker notes | none | IN_PROGRESS |
| M2 | Verification & E2E Acceptance | Run office validation (`validate.py`), content extraction (`markitdown`), criteria audit, and forensic integrity audit | M1 | PLANNED |

## Interface Contracts
### `generate_deck.js` ↔ PowerPoint / Office Runtime
- Entry point: `node generate_deck.js`
- Output path: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
- Exit code: 0 on successful compilation.
- OpenXML Schema: Strict compliance with ECMA-376 PresentationML and DrawingML.

### Presentation ↔ Validation Suite
- Command: `.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`
- Expected: All validations pass with 0 critical errors.

## Code Layout
- Generator: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`
- Target Output: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
- Test / Validation Environment: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv`
- Agent Metadata & Logs: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/`
