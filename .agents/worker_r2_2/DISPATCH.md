# Dispatch to Worker (worker_r2_2)

## Objective
Apply the exact, verified code fixes from Iteration 2 explorers into `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`, recompile `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`, and verify it passes validation cleanly.

## Exclusive File Ownership
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js` (Exclusive write ownership)
- Target output: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Fix Plans to Implement
1. **Fix 1: Slide 1 Title Tracking (Defect 1)**:
   - File: `generate_deck.js` (line 263).
   - Change `charSpacing: 150` to `charSpacing: 2`.
   - See detailed fix plan in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_3/fix_plan.md`.
2. **Fix 2: Slide 2 Header Collision (Defect 2)**:
   - File: `generate_deck.js` (lines 156–194 & 473).
   - Update `addStandardHeader` to accept `options = {}` with `titleFontSize = options.titleFontSize || (title.length > 52 ? 28 : 34)`.
   - Update Slide 2 title call to use `'Standing in Front of History. But Where’s the Story?'` (or pass `{ titleFontSize: 28 }`).
   - See detailed fix plan in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_4/fix_plan.md` and patch in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_4/slide_2_header_fix.patch`.
3. **Fix 3: Slide 5 Header Contrast on Stone Lattice (Defect 3)**:
   - File: `generate_deck.js` (lines 1072–1105).
   - Add full-slide warm scrim shape (`fill: { color: C.WARM_BG, transparency: 15 }`) over the lattice image.
   - Add protective header plate shape (`x: 0.65, y: 0.40, w: 12.033, h: 1.32`, `fill: { color: C.WARM_BG_LIGHT, transparency: 10 }`, `line: { color: C.WARM_CARD_BORDER, width: 0.8 }`, `rectRadius: 0.08`, `shadow: makeShadow(45, 2, 3, 0.04)`) placed immediately behind the Slide 5 header text.
   - See detailed fix plan in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_5/fix_plan.md`.
4. **Fix 4: Slide 3 Bullet Run-In (Defect 4)**:
   - File: `generate_deck.js` (lines 665–720).
   - Add `breakLine: true` and `paraSpaceAfter: 6` to the bullet description runs so items format as distinct paragraphs rather than running together horizontally.
   - See detailed fix plan in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_3/fix_plan.md`.

## Execution & Verification Commands
- `node generate_deck.js`
- `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.venv/bin/python3 /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py Herodotus_Pitch_Presentation.pptx`
- Verify it passes with 0 errors.

## Deliverables
- Update `generate_deck.js`.
- Write `implementation_report.md` and `handoff.md` in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/worker_r2_2/`.
- Notify parent via `send_message`.
