# Execution Plan: Fix Judging Criteria & Copy Preservation in Herodotus Pitch Deck

## Objective
Satisfy 100% of the independent challenger test suite `test_text_and_criteria.py` and OpenXML schema validation `validate.py`:
1. Fix 2 missing official judging criteria: "Business Model & Scalability" and "Impact & Social Relevance". All 5 criteria must be explicitly present.
2. Reconcile baseline narrative copy preservation across slides and speaker notes without changing the 7-slide reference visual structure.
3. Verify with OpenXML schema validation (`validate.py`) and DrawingML shape geometry (`test_openxml_geometry.py`).
4. Dispatch independent verification panel (Reviewer & Challenger).
5. Pass verification gate cleanly and report completion to Sentinel.

## Step-by-Step Milestones

### Phase 1: Workspace Initialization
- [x] Record incoming dispatch in `DISPATCH.md`
- [x] Create `BRIEFING.md`, `plan.md`, `progress.md`
- [ ] Initialize heartbeat cron (`schedule`)

### Phase 2: Implementation Worker Dispatch (worker_7_1)
- [ ] Dispatch `worker_7_1` (`teamwork_preview_worker`) to:
  - Inspect `test_text_and_criteria.py` and `.agents/worker_r4_1/test_text_preservation.py` to see the exact checks and strings.
  - Modify `generate_deck.js` to explicitly include "Business Model & Scalability" and "Impact & Social Relevance" in slide text and speaker notes.
  - Integrate baseline narrative strings into slide text and speaker notes where needed so `test_text_and_criteria.py` passes completely.
  - Run `node generate_deck.js`.
  - Run `validate.py` (ensure 0 errors).
  - Run `test_text_and_criteria.py` (ensure exit code 0, 0 failures).
  - Run `test_openxml_geometry.py` (ensure 0 errors).
  - Submit handoff report.

### Phase 3: Independent Verification Panel
- [ ] Dispatch `reviewer_7_1` (`teamwork_preview_reviewer`): Verify schema, notes word counts, fonts, visual consistency, and criteria coverage.
- [ ] Dispatch `challenger_7_1` (`teamwork_preview_challenger`): Run adversarial checks, test scripts, and verify all 5 criteria and text preservation.
- [ ] Record verdicts in `GATE_STATUS.md`.

### Phase 4: Final Gate & Sentinel Notification
- [ ] Check all pass criteria (Worker done, Reviewer APPROVE, Challenger APPROVE).
- [ ] Prepare synthesized report.
- [ ] Send completion message to Sentinel via `send_message`.
