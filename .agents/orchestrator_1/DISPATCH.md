## 2026-09-15T00:29:26Z

You are the Project Orchestrator for this project.

Your working directory is:
/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_1

Authoritative user request is located at:
/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/ORIGINAL_REQUEST.md

Workspace root:
/Users/krishnajangid/Documents/antigravity/peaceful-hertz

Target output:
/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx

Task Overview:
Rebuild an 8-slide hackathon pitch presentation for "Herodotus — Historical Monument Virtual Audio & Fact Guide" (IDEA FORGE 2026 Pitch-A-Thon) from scratch using pptxgenjs. Every slide element (titles, body text, stats, cards, icons, images) must be a native, editable PowerPoint object. No rasterized slide backgrounds. All text directly editable.

Requirements and constraints:
- Set pres.layout = 'LAYOUT_WIDE' (13.333" x 7.5")
- Hex colors without '#' prefix
- Never share option objects between add* calls
- Shadow offset >= 0
- charSpacing, not letterSpacing
- Lists: bullet: true on each item, breakLine: true on every item except last
- rectRadius only works on ROUNDED_RECTANGLE
- No gradient fills (use solid fills or gradient images)
- margin: 0 on text boxes when aligning
- Speaker notes via slide.addNotes("...") once per slide
- Never reuse a new pptxgen() instance
- Visual theme: Mixed sandwich (Dark cover/closing: 1E2761 or similar, Light content slides: FFFFFF / light tint, consistent bold accent like teal/gold/coral)
- Design rules: NEVER accent lines under titles; NEVER decorative color bars or accent stripes; vary layouts across slides (at least 3 different layout patterns); every slide has visual element; safe fonts Calibri/Cambria; 0.5" min margins.
- Address all 5 judging criteria (Innovation & Originality, Feasibility & Technical Viability, Impact & Social Relevance, Presentation & Clarity, Business Model & Scalability).
- Embed images from the provided paths (properly sized pictures, not full-bleed backgrounds).
- Validate using: python /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py /Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx (must report no critical errors).

Please create and maintain your progress in /Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/orchestrator_1/progress.md and BRIEFING.md.
When you complete the implementation and verification passes, report your victory/completion back to the Sentinel.
