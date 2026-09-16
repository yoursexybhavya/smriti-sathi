# PPTX creation, editing, and analysis
(Dump of /Users/krishnajangid/.gemini/config/skills/pptx/SKILL.md)
Core principles:
- pres.layout = 'LAYOUT_WIDE' (13.333" x 7.5") before adding slides
- Hex colors: NO '#' prefix, 6 digits
- Fresh option objects for every add* call (mutation avoidance)
- Shadow offset >= 0
- charSpacing instead of letterSpacing
- NEVER use accent lines under titles
- NEVER use decorative color bars or accent stripes
- Margins >= 0.5" from all slide edges
- Safe fonts: Calibri (body), Cambria (headers)
- Validate with validate.py
