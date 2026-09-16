# Plan — orchestrator_6

## Objective
Remediate `generate_deck.js` to satisfy all 5 official judging criteria and all 205 baseline text strings, while strictly keeping the 7 reference slides visual structure, generating the PPTX, and passing independent challenger/reviewer verification.

## Steps
1. **Initialize State**: BRIEFING.md, progress.md, plan.md, DISPATCH.md, schedule heartbeat cron.
2. **Dispatch Remediation Worker**:
   - Update `generate_deck.js` to:
     - Include all 5 criteria verbatim: "Innovation & Originality", "Feasibility & Technical Viability", "Impact & Social Relevance", "Presentation & Clarity", "Business Model & Scalability".
     - Incorporate the missing baseline strings into the slide cards, subtitles, or speaker notes corresponding to origin slides, ensuring `test_text_and_criteria.py` passes 100% (205/205 strings, 5/5 criteria, notes >50 words, fonts Cambria & Calibri only).
     - Run `node generate_deck.js` to compile `Herodotus_Pitch_Presentation.pptx`.
     - Run `test_text_and_criteria.py` and `validate.py` to confirm zero defects.
3. **Dispatch Verification Panel**:
   - Dispatch Challenger to execute `test_text_and_criteria.py` independently.
   - Dispatch Reviewer to review PPTX visual layout, PPTX compliance, and validate script.
4. **Gate & Synthesis**:
   - Verify all pass.
   - Update state files and GATE_STATUS.md.
5. **Final Reporting**:
   - Send complete success report to parent Sentinel via `send_message`.
