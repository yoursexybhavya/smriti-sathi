# PPTX skill reference copy
Loaded from: /Users/krishnajangid/.gemini/config/skills/pptx/SKILL.md

Key pptxgenjs rules:
- Set pres.layout = 'LAYOUT_WIDE' (13.333" x 7.5") before adding slides
- Hex colors: never '#', never 8 digits (e.g. 'C69214', not '#C69214')
- Never share option objects across add* calls (mutated in place)
- Shadow offset >= 0
- charSpacing not letterSpacing
- Lists: bullet: true on each item, breakLine: true on every array item except last
- One new pptxgen() per output file
- rectRadius only works on ROUNDED_RECTANGLE
- Gradient fills not supported - use gradient image
- Text boxes internal padding: margin: 0 when aligning with shapes/icons
- Speaker notes: slide.addNotes("...")
- Never accent lines under titles
- Never decorative color bars or accent stripes (no header/footer bars, no sidebar stripes, no card edge stripes)
- Margins >= 0.5" from edges
- Safe fonts: Calibri (body), Cambria (headers)
- Validate: python /Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py output.pptx
