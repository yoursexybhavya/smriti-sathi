# PPTX Skill Summary for worker_7_1

Summary of rules from /Users/krishnajangid/.gemini/config/skills/pptx/SKILL.md:
- pptxgenjs layout: WIDE (13.33 x 7.5) vs 16x9 (10 x 5.625).
- Hex colors: never `#`, never 8 digits (`color: "C69214"`).
- Object mutation in pptxgenjs: never reuse options objects across multiple add calls.
- `rectRadius` works on `ROUNDED_RECTANGLE`.
- `margin: 0` on text boxes when aligning.
- Speaker notes: `slide.addNotes("...")`.
- Validation via office/validate.py.
