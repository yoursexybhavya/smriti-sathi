# Dispatch to Explorer (explorer_r2_4)

## Objective
Analyze and formulate exact code fixes for Defect 2 (Slide 2 Header Text Collision) in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/generate_deck.js`.

## Review Feedback from Reviewer 1 (Gate Failure)
- **Defect 2 [CRITICAL] Slide 2 Header Text Collision**:
  The 59-character title ("You’re Standing in Front of History. But Where’s the Story?") wraps onto two lines in Cambria 34pt, causing line 2 ("Story?") to render directly on top of the subtitle text ("India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.") at `y: 1.41"`, clipping into the photo below.
  In `generate_deck.js`, lines 171–193 & 473: Title text box is fixed at `y: 0.83, h: 0.58`, and subtitle is fixed at `y: 1.41`.

## Instructions
1. Inspect `generate_deck.js` around lines 171–193 and line 473.
2. Determine the best fix:
   - Either adjust font size (e.g. 26–28pt) or rephrase the headline slightly or adjust container width/height so it fits cleanly on one line, OR adjust the subtitle `y` coordinate and height so that a two-line title has plenty of clearance without colliding with the subtitle or content below.
3. Detail the exact fix recommendations in `fix_plan.md` and `handoff.md` in `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/explorer_r2_4/`.

## 2026-09-15T01:55:12Z
Follow DISPATCH.md. Analyze Defect 2 (Slide 2 Header Text Collision where line 2 'Story?' collides with subtitle at y: 1.41).
Formulate the exact coordinate, font size, or text adjustment fix for generate_deck.js so the title and subtitle have clean breathing room and zero overlap. Write fix_plan.md and handoff.md in your working directory and notify parent via send_message.

