# Dispatch to Challenger 1 (challenger_r2_1)

## Objective
Empirically challenge and stress-test the DrawingML structure, native editability, z-ordering, and coordinate geometry of `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`.

## Inputs
1. `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/ORIGINAL_REQUEST.md`
2. `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_2/SCOPE.md`
3. Target Artifact: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx`
4. Generator: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`

## Challenger Verification Steps
1. Unzip the presentation package and inspect `ppt/slides/slide*.xml`:
   - Verify each slide contains native `<p:sp><p:txBody>` text box elements.
   - Verify each slide contains genuine `<p:pic>` embedded pictures.
   - Verify that on slides with full-bleed backgrounds or overlay shapes, the `<p:pic>` and `<p:sp>` overlay shapes precede text boxes in the XML `<p:spTree>` sequence (ensuring foreground text boxes are selectable and editable).
2. Coordinate Bounds & Margin Stress-Test:
   - Parse all shape positions (`<a:off x="..." y="...">`) and extents (`<a:ext cx="..." cy="...">`).
   - Convert EMUs to inches (`1 inch = 914400 EMUs`).
   - Verify every element satisfies margins: min x >= 0.5", max x + w <= 12.833", min y >= 0.5", max y + h <= 7.0".
3. Verify Design Rule Violations:
   - Check if any connector lines `<p:cxnSp>` exist that could be accent lines under titles.
   - Check for thin decorative color rectangles (<0.08" thick) at edges or under headers.
4. Deliver your empirical challenge report and verdict (`APPROVE` or `REJECT`) in `challenge_report.md` and `handoff.md` in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/challenger_r2_1/`.

## 2026-09-15T01:49:22Z
<USER_REQUEST>
You are challenger_r2_1.
Working directory: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/challenger_r2_1
Project root: /Users/krishnajangid/Documents/antigravity/peaceful-hertz
Original request: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/ORIGINAL_REQUEST.md
Your dispatch instructions: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/challenger_r2_1/DISPATCH.md
Scope document: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_2/SCOPE.md
Generator code: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js
Target artifact: /Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx

Follow DISPATCH.md. Empirically challenge and stress-test the DrawingML structure, native editability, z-ordering in slide XML, coordinate geometry and margins (min x, y >= 0.5", max bounds <= 12.833" x 7.0"). Check for forbidden accent lines or decorative stripes.
Write challenge_report.md and handoff.md in your working directory with an explicit verdict (APPROVE or REJECT), and notify parent via send_message.
</USER_REQUEST>
