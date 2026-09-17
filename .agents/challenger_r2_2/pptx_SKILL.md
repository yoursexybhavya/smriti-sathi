# PPTX Skill Copy for Challenger
See original at: /Users/krishnajangid/.gemini/config/skills/pptx/SKILL.md

Core Methodology:
Empirical inspection and validation of .pptx archives using OOXML inspection, markitdown, python validate.py, LibreOffice rendering (soffice.py), and image verification.
Key checks:
- markitdown text extraction for content, judging criteria, and placeholder detection (grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert|this.*(page|slide).*layout")
- Schema validation via scripts/office/validate.py
- XML inspection: ppt/slides/slideN.xml for fonts, sizes, shapes, relationships
- Media extraction & checksum comparison against source assets
- Speaker notes extraction from ppt/notesSlides/
