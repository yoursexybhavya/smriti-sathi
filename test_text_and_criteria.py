#!/usr/bin/env python3
"""
Empirical Test Harness: test_text_and_criteria.py
Author: challenger_5_2 (Text & Criteria Preservation Challenger)
Target: Herodotus_Pitch_Presentation.pptx

Verifies:
1. All 205 baseline text strings, numbers, bullets, metrics, and URLs from the
   established baseline catalog (worker_r4_1/test_text_preservation.py).
2. Explicit coverage of all 5 official judging criteria:
   - Innovation & Originality
   - Feasibility & Technical Viability
   - Impact & Social Relevance
   - Presentation & Clarity
   - Business Model & Scalability
3. Speaker notes exist on all 7 slides, are pitch-ready, and substantive (>50 words per slide).
4. Only approved fonts (Cambria and Calibri) are declared across all text runs.
"""

import os
import sys
import ast
import re
import zipfile
import xml.etree.ElementTree as ET

PPTX_PATH = "Herodotus_Pitch_Presentation.pptx"
BASELINE_PATH = ".agents/worker_r4_1/test_text_preservation.py"

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def normalize(text):
    return " ".join(text.replace("’", "'").replace("‘", "'").replace("—", "-").replace("–", "-").split()).lower()

def load_baseline_205():
    with open(BASELINE_PATH, 'r') as f:
        tree = ast.parse(f.read())
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and getattr(node.targets[0], 'id', None) == 'EXPECTED':
            return ast.literal_eval(node.value)
    raise RuntimeError("Failed to load EXPECTED dict from baseline")

def main():
    print("=" * 80)
    print("CHALLENGER 5_2: INDEPENDENT EMPIRICAL TEXT & CRITERIA TEST SUITE")
    print("=" * 80)
    print(f"Target PPTX: {PPTX_PATH}")

    if not os.path.exists(PPTX_PATH):
        print(f"CRITICAL: PPTX file '{PPTX_PATH}' does not exist!")
        sys.exit(2)

    with zipfile.ZipFile(PPTX_PATH, 'r') as z:
        file_list = z.namelist()
        slide_files = sorted([f for f in file_list if re.match(r'^ppt/slides/slide\d+\.xml$', f)],
                             key=lambda x: int(re.search(r'\d+', x).group()))
        notes_files = sorted([f for f in file_list if re.match(r'^ppt/notesSlides/notesSlide\d+\.xml$', f)],
                             key=lambda x: int(re.search(r'\d+', x).group()))

        print(f"Slides Found ({len(slide_files)}): {slide_files}")
        print(f"Notes Found  ({len(notes_files)}): {notes_files}\n")

        # ---------------------------------------------------------------------
        # Extract text runs from slides and speaker notes
        # ---------------------------------------------------------------------
        slide_runs = {}
        notes_runs = {}
        all_runs = []

        for s_idx, sf in enumerate(slide_files, start=1):
            stree = ET.fromstring(z.read(sf))
            s_texts = [t.text for t in stree.findall('.//a:t', NS) if t.text]
            slide_runs[s_idx] = s_texts
            all_runs.extend(s_texts)

            # Extract speaker notes text
            nf = f"ppt/notesSlides/notesSlide{s_idx}.xml"
            if nf in file_list:
                ntree = ET.fromstring(z.read(nf))
                # Body notes shapes
                body_texts = []
                for sp in ntree.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}sp'):
                    ph = sp.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}ph')
                    if ph is not None and ph.attrib.get('type') == 'body':
                        body_texts.extend([t.text for t in sp.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if t.text])
                if not body_texts:
                    body_texts = [t.text for t in ntree.findall('.//a:t', NS) if t.text and t.text.strip() != str(s_idx)]
                notes_runs[s_idx] = body_texts
                all_runs.extend(body_texts)
            else:
                notes_runs[s_idx] = []

        full_raw_corpus = " ".join(all_runs)
        full_norm_corpus = normalize(full_raw_corpus)

        failures = []

        # =====================================================================
        # TEST 1: 205 BASELINE TEXT STRINGS PRESERVATION
        # =====================================================================
        print("-" * 80)
        print("TEST 1: 205 BASELINE TEXT STRINGS PRESERVATION")
        print("-" * 80)

        expected_dict = load_baseline_205()
        total_baseline = sum(len(v) for v in expected_dict.values())
        print(f"Baseline catalog loaded from {BASELINE_PATH}: {total_baseline} total strings across 8 origin slides.")

        found_baseline = 0
        missing_baseline = []

        for origin_slide, items in expected_dict.items():
            for item in items:
                norm_item = normalize(item)
                if norm_item in full_norm_corpus:
                    found_baseline += 1
                else:
                    missing_baseline.append((origin_slide, item))

        print(f"Result: {found_baseline} / {total_baseline} baseline strings found in presentation.")
        print(f"Missing: {len(missing_baseline)} / {total_baseline} strings missing.")

        if missing_baseline:
            print("\n[SAMPLE MISSING BASELINE STRINGS (First 15)]:")
            for s_num, exp in missing_baseline[:15]:
                print(f"  - [Origin Slide {s_num}]: '{exp}'")
            print(f"  ... and {len(missing_baseline) - 15} more missing baseline items.")
            failures.append(f"TEST 1 FAILED: Only {found_baseline}/{total_baseline} baseline strings preserved ({len(missing_baseline)} missing).")
        else:
            print("PASS: All 205 baseline strings preserved verbatim.")

        # =====================================================================
        # TEST 2: 5 OFFICIAL JUDGING CRITERIA EXPLICIT COVERAGE
        # =====================================================================
        print("\n" + "-" * 80)
        print("TEST 2: 5 OFFICIAL JUDGING CRITERIA EXPLICIT COVERAGE")
        print("-" * 80)

        criteria = [
            "Innovation & Originality",
            "Feasibility & Technical Viability",
            "Impact & Social Relevance",
            "Presentation & Clarity",
            "Business Model & Scalability"
        ]

        crit_missing = []
        for crit in criteria:
            norm_crit = normalize(crit)
            present = norm_crit in full_norm_corpus
            status = "FOUND" if present else "MISSING"
            print(f"  [{status}] '{crit}'")
            if not present:
                crit_missing.append(crit)

        if crit_missing:
            print(f"\nFAIL: {len(crit_missing)} of 5 official judging criteria NOT explicitly covered in presentation!")
            for cm in crit_missing:
                print(f"  - MISSING CRITERION: '{cm}'")
            failures.append(f"TEST 2 FAILED: {len(crit_missing)}/5 judging criteria missing: {crit_missing}")
        else:
            print("PASS: All 5 official judging criteria explicitly covered.")

        # =====================================================================
        # TEST 3: SPEAKER NOTES VERIFICATION (>50 WORDS PER SLIDE)
        # =====================================================================
        print("\n" + "-" * 80)
        print("TEST 3: SPEAKER NOTES AUDIT (>50 WORDS PER SLIDE)")
        print("-" * 80)

        notes_fail = []
        for s_idx in range(1, len(slide_files) + 1):
            n_list = notes_runs.get(s_idx, [])
            joined = " ".join(n_list)
            words = joined.split()
            count = len(words)
            status = "PASS" if count > 50 else "FAIL"
            print(f"  Slide {s_idx}: {count:3d} words -> {status} | Snippet: {joined[:65]}...")
            if count <= 50:
                notes_fail.append((s_idx, count))

        if notes_fail:
            failures.append(f"TEST 3 FAILED: {len(notes_fail)} slides have <= 50 words in speaker notes: {notes_fail}")
        else:
            print("PASS: Substantive speaker notes (>50 words) present on all slides.")

        # =====================================================================
        # TEST 4: FONT DECLARATION WHITELIST (CAMBRIA & CALIBRI ONLY)
        # =====================================================================
        print("\n" + "-" * 80)
        print("TEST 4: FONT DECLARATION WHITELIST (CAMBRIA & CALIBRI ONLY)")
        print("-" * 80)

        declared_fonts = set()
        disallowed_fonts = []
        allowed_fonts = {"Cambria", "Calibri"}

        for sf in slide_files:
            stree = ET.fromstring(z.read(sf))
            for elem in stree.iter():
                for attr in ['typeface']:
                    if attr in elem.attrib:
                        font_val = elem.attrib[attr]
                        declared_fonts.add(font_val)
                        if font_val not in allowed_fonts:
                            disallowed_fonts.append((sf, elem.tag, font_val))

        print(f"Declared fonts across all slides: {sorted(list(declared_fonts))}")
        if disallowed_fonts:
            print(f"FAIL: {len(disallowed_fonts)} non-approved font declarations found:")
            for item in disallowed_fonts:
                print(f"  - {item}")
            failures.append(f"TEST 4 FAILED: Disallowed fonts found: {disallowed_fonts}")
        else:
            print("PASS: Only approved fonts (Cambria, Calibri) declared across all text runs.")

        # =====================================================================
        # FINAL VERDICT
        # =====================================================================
        print("\n" + "=" * 80)
        print("FINAL EMPIRICAL VERDICT")
        print("=" * 80)

        if failures:
            print("VERDICT: REJECT")
            print(f"Summary of Failures ({len(failures)}):")
            for idx, f in enumerate(failures, 1):
                print(f"  {idx}. {f}")
            print("=" * 80)
            sys.exit(1)
        else:
            print("VERDICT: APPROVE")
            print("All empirical checks passed with 100% compliance!")
            print("=" * 80)
            sys.exit(0)

if __name__ == '__main__':
    main()
