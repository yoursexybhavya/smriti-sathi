#!/usr/bin/env python3
"""
Empirical OpenXML and Geometry Verification Suite for Herodotus Pitch Presentation
Author: challenger_5_1 (Geometry & OpenXML Empirical Challenger)
Target: Herodotus_Pitch_Presentation.pptx

Verifies:
1. Slide count is exactly 7.
2. Canvas dimensions are 13.333" x 7.500" (LAYOUT_WIDE, 16:9 widescreen).
3. Bounds checking: x >= 0, y >= 0, x + w <= 13.333", y + h <= 7.500" for all elements.
4. Margin checking: x >= 0.50", y >= 0.50", x + w <= 12.833", y + h <= 7.000" for all content elements
   (excluding deliberate letterbox bars and full-bleed background photos/overlays).
5. Negative constraint: verify 0 title underlines (no horizontal line/rectangle placed immediately beneath any slide headline).
6. Native editability: count native shapes (p:sp, p:pic), ensuring >250 native elements across the presentation.
"""

import sys
import os
import zipfile
import subprocess
from xml.etree import ElementTree as ET

PPTX_PATH = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"
VALIDATE_SCRIPT = "/Users/krishnajangid/.gemini/config/skills/pptx/scripts/office/validate.py"
PYTHON_BIN = sys.executable

EMU_PER_INCH = 914400.0
CANVAS_W_IN = 13.333333
CANVAS_H_IN = 7.500000
MARGIN_LEFT = 0.50
MARGIN_TOP = 0.50
MARGIN_RIGHT = 12.833333
MARGIN_BOTTOM = 7.000000
EPSILON = 0.015

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}


def parse_element_geometry(el):
    """Extract coordinates (x, y, w, h, right, bottom) from a shape or pic in inches."""
    xfrm = el.find('.//a:xfrm', NS)
    if xfrm is None:
        return None
    off = xfrm.find('a:off', NS)
    ext = xfrm.find('a:ext', NS)
    if off is None or ext is None:
        return None

    x = int(off.get('x', 0)) / EMU_PER_INCH
    y = int(off.get('y', 0)) / EMU_PER_INCH
    w = int(ext.get('cx', 0)) / EMU_PER_INCH
    h = int(ext.get('cy', 0)) / EMU_PER_INCH

    return {
        'x': x,
        'y': y,
        'w': w,
        'h': h,
        'right': x + w,
        'bottom': y + h,
    }


def parse_shape_details(el, idx):
    """Extract detailed information from a shape/pic element."""
    tag = el.tag.split('}')[-1]
    cNvPr = el.find('.//p:cNvPr', NS)
    name = cNvPr.get('name', f'unnamed_{idx}') if cNvPr is not None else f'unnamed_{idx}'
    shape_id = cNvPr.get('id', str(idx)) if cNvPr is not None else str(idx)

    geom = parse_element_geometry(el)
    if geom is None:
        return None

    # Shape preset geometry
    prst_geom = None
    spPr = el.find('.//p:spPr', NS)
    if spPr is not None:
        prst = spPr.find('.//a:prstGeom', NS)
        if prst is not None:
            prst_geom = prst.get('prst')

    # Line properties
    ln = spPr.find('.//a:ln', NS) if spPr is not None else None
    line_dash = None
    if ln is not None:
        prstDash = ln.find('.//a:prstDash', NS)
        if prstDash is not None:
            line_dash = prstDash.get('val')

    # Text extraction
    text_runs = []
    for r_el in el.findall('.//a:r', NS):
        t = r_el.find('a:t', NS)
        rPr = r_el.find('a:rPr', NS)
        font_sz = int(rPr.get('sz', 0)) / 100.0 if (rPr is not None and 'sz' in rPr.attrib) else 0.0
        typeface = ''
        bold = False
        if rPr is not None:
            bold = rPr.get('b', '0') in ('1', 'true')
            latin = rPr.find('a:latin', NS)
            if latin is not None:
                typeface = latin.get('typeface', '')
        if t is not None and t.text:
            text_runs.append({
                'text': t.text,
                'size': font_sz,
                'font': typeface,
                'bold': bold
            })

    full_text = ' '.join([tr['text'] for tr in text_runs])
    has_text = len(text_runs) > 0
    max_font_sz = max([tr['size'] for tr in text_runs], default=0.0)

    return {
        'id': shape_id,
        'tag': tag,
        'name': name,
        'x': geom['x'],
        'y': geom['y'],
        'w': geom['w'],
        'h': geom['h'],
        'right': geom['right'],
        'bottom': geom['bottom'],
        'prst_geom': prst_geom,
        'line_dash': line_dash,
        'has_text': has_text,
        'text': full_text,
        'text_runs': text_runs,
        'max_font_sz': max_font_sz,
    }


def main():
    print("=" * 80)
    print("EMPIRICAL OPENXML & GEOMETRY CHALLENGER TEST SUITE")
    print(f"Target PPTX: {PPTX_PATH}")
    print("=" * 80)

    if not os.path.exists(PPTX_PATH):
        print(f"CRITICAL ERROR: Presentation file not found at {PPTX_PATH}")
        sys.exit(1)

    file_size_bytes = os.path.getsize(PPTX_PATH)
    print(f"File Size: {file_size_bytes:,} bytes ({file_size_bytes / (1024*1024):.2f} MB)")

    z = zipfile.ZipFile(PPTX_PATH, 'r')
    failures = []

    # -------------------------------------------------------------------------
    # TEST 1: Slide Count Verification
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 1: Slide Count Verification (Required: Exactly 7 Slides)")
    print("-" * 80)

    pres_xml = z.read('ppt/presentation.xml')
    pres_tree = ET.fromstring(pres_xml)
    sld_ids = pres_tree.findall('.//p:sldId', NS)
    slide_count_pres = len(sld_ids)

    slide_xml_parts = [n for n in z.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')]
    slide_count_parts = len(slide_xml_parts)

    print(f"Slides registered in ppt/presentation.xml: {slide_count_pres}")
    print(f"Slide XML parts in archive: {slide_count_parts}")

    if slide_count_pres == 7 and slide_count_parts == 7:
        print("PASS: Slide count is exactly 7.")
    else:
        msg = f"FAIL: Expected 7 slides, found {slide_count_pres} registered and {slide_count_parts} parts."
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # TEST 2: Canvas Dimensions Verification (LAYOUT_WIDE, 16:9)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 2: Canvas Dimensions (Required: 13.333\" x 7.500\" / LAYOUT_WIDE)")
    print("-" * 80)

    sldSz = pres_tree.find('.//p:sldSz', NS)
    if sldSz is None:
        msg = "FAIL: <p:sldSz> element missing from ppt/presentation.xml"
        print(msg)
        failures.append(msg)
    else:
        cx = int(sldSz.get('cx', 0))
        cy = int(sldSz.get('cy', 0))
        w_in = cx / EMU_PER_INCH
        h_in = cy / EMU_PER_INCH
        print(f"Canvas size in EMU: cx={cx}, cy={cy}")
        print(f"Canvas dimensions in inches: {w_in:.4f}\" x {h_in:.4f}\"")

        w_err = abs(w_in - 13.333333)
        h_err = abs(h_in - 7.500000)

        if w_err <= EPSILON and h_err <= EPSILON:
            print(f"PASS: Canvas dimensions conform to LAYOUT_WIDE 16:9 (13.333\" x 7.500\").")
        else:
            msg = f"FAIL: Canvas dimension error: width error {w_err:.4f}\", height error {h_err:.4f}\""
            print(msg)
            failures.append(msg)

    # -------------------------------------------------------------------------
    # Collect Shapes and Elements across all 7 slides
    # -------------------------------------------------------------------------
    all_slides = []
    total_sp = 0
    total_pic = 0

    for s_idx in range(1, 8):
        slide_part = f'ppt/slides/slide{s_idx}.xml'
        slide_xml = z.read(slide_part)
        slide_root = ET.fromstring(slide_xml)

        elements = []
        raw_sp = slide_root.findall('.//p:sp', NS)
        raw_pic = slide_root.findall('.//p:pic', NS)
        total_sp += len(raw_sp)
        total_pic += len(raw_pic)

        for idx, el in enumerate(raw_sp + raw_pic):
            details = parse_shape_details(el, idx)
            if details is not None:
                elements.append(details)

        all_slides.append((s_idx, elements, len(raw_sp), len(raw_pic)))

    # -------------------------------------------------------------------------
    # TEST 3: Canvas Boundary (Bounds) Checking
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 3: Bounds Checking (0 <= x, 0 <= y, x + w <= 13.333\", y + h <= 7.500\")")
    print("-" * 80)

    bounds_violations = []
    total_elements = 0

    for s_idx, elements, n_sp, n_pic in all_slides:
        for el in elements:
            total_elements += 1
            viol = []
            if el['x'] < -EPSILON:
                viol.append(f"x={el['x']:.3f}\" < 0")
            if el['y'] < -EPSILON:
                viol.append(f"y={el['y']:.3f}\" < 0")
            if el['right'] > CANVAS_W_IN + EPSILON:
                viol.append(f"right={el['right']:.3f}\" > 13.333\"")
            if el['bottom'] > CANVAS_H_IN + EPSILON:
                viol.append(f"bottom={el['bottom']:.3f}\" > 7.500\"")

            if viol:
                bounds_violations.append((s_idx, el, viol))
                print(f"  [BOUNDS VIOLATION] Slide {s_idx} Shape '{el['name']}': {', '.join(viol)}")

    print(f"Total elements inspected: {total_elements}")
    print(f"Total bounds violations: {len(bounds_violations)}")

    if len(bounds_violations) == 0:
        print("PASS: 100% of shapes, text boxes, and images lie strictly within slide canvas bounds.")
    else:
        msg = f"FAIL: {len(bounds_violations)} elements violate canvas bounds [0, 13.333] x [0, 7.500]."
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # TEST 4: Margin Checking (>= 0.50" content margins)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 4: Content Margin Checking (x >= 0.50\", y >= 0.50\", right <= 12.833\", bottom <= 7.000\")")
    print("        (Excluding deliberate letterbox bars and full-bleed background photos/overlays)")
    print("-" * 80)

    content_margin_violations = []
    excluded_elements = []

    for s_idx, elements, n_sp, n_pic in all_slides:
        for el in elements:
            # Check if this is an excluded background element:
            # 1. Full-bleed background photos & full-bleed backdrop overlays
            is_full_bleed = (el['w'] >= 13.0 and el['h'] >= 7.4) or (el['x'] <= 0.01 and el['y'] <= 0.01 and el['h'] >= 7.4)
            # 2. Letterbox bars (solid black bars at y=0 or y>=7.0 across width >= 13.0)
            is_letterbox_bar = (el['w'] >= 13.0 and (el['y'] <= 0.01 or el['y'] >= 7.0))
            # 3. Letterbox text/rule/ticks (elements intentionally placed inside the cinematic letterbox band)
            is_letterbox_element = (s_idx in (1, 7)) and (el['y'] < 0.45 or el['y'] > 7.05)

            if is_full_bleed or is_letterbox_bar or is_letterbox_element:
                excluded_elements.append((s_idx, el, "Letterbox / Full-bleed Background"))
                continue

            # This is a content element: verify it respects margins
            m_viol = []
            if el['x'] < MARGIN_LEFT - EPSILON:
                m_viol.append(f"left={el['x']:.3f}\" < 0.50\"")
            if el['y'] < MARGIN_TOP - EPSILON:
                m_viol.append(f"top={el['y']:.3f}\" < 0.50\"")
            if el['right'] > MARGIN_RIGHT + EPSILON:
                m_viol.append(f"right={el['right']:.3f}\" > 12.833\"")
            if el['bottom'] > MARGIN_BOTTOM + EPSILON:
                m_viol.append(f"bottom={el['bottom']:.3f}\" > 7.000\"")

            if m_viol:
                content_margin_violations.append((s_idx, el, m_viol))
                print(f"  [MARGIN VIOLATION] Slide {s_idx} [{el['tag']}] '{el['name']}': {', '.join(m_viol)} pos=({el['x']:.2f}, {el['y']:.2f}, {el['w']:.2f}, {el['h']:.2f}) text='{el['text'][:35]}'")

    print(f"Content elements inspected: {total_elements - len(excluded_elements)}")
    print(f"Deliberate background/letterbox elements excluded: {len(excluded_elements)}")
    print(f"Content margin violations: {len(content_margin_violations)}")

    if len(content_margin_violations) == 0:
        print("PASS: 100% of content elements respect the >= 0.50\" margin constraint.")
    else:
        msg = f"FAIL: {len(content_margin_violations)} content elements violate 0.50\" margin constraint."
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # TEST 5: Negative Constraint (0 Title Underlines)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 5: Negative Constraint (Verify 0 Title Underlines)")
    print("        (No horizontal line/rectangle placed immediately beneath any slide headline)")
    print("-" * 80)

    title_underlines = []

    for s_idx, elements, n_sp, n_pic in all_slides:
        # Identify slide headlines: large primary titles (Cambria >= 24pt or bold headline text)
        headlines = [
            el for el in elements
            if el['has_text'] and (
                any(tr['font'] == 'Cambria' and tr['size'] >= 24 for tr in el['text_runs']) or
                (el['max_font_sz'] >= 28)
            )
        ]

        # Identify horizontal lines or thin horizontal rectangles (height <= 0.08" and width >= 0.50")
        lines = [
            el for el in elements
            if (el['prst_geom'] == 'line') or
               (not el['has_text'] and el['h'] <= 0.08 and el['w'] >= 0.50)
        ]

        for h in headlines:
            for l in lines:
                # Check if line is immediately underneath headline:
                # Vertical gap between headline bottom and line y is between 0.0 and 0.35 inches
                vert_gap = l['y'] - h['bottom']
                if 0.0 <= vert_gap <= 0.35:
                    # Check horizontal overlap with headline
                    x_overlap = max(0.0, min(h['right'], l['right']) - max(h['x'], l['x']))
                    if x_overlap > 1.0:
                        title_underlines.append((s_idx, h, l, vert_gap, x_overlap))
                        print(f"  [TITLE UNDERLINE] Slide {s_idx}: Title '{h['text'][:30]}' (y={h['y']:.2f}..{h['bottom']:.2f}) "
                              f"has underline '{l['name']}' at y={l['y']:.2f} (gap={vert_gap:.3f}\", overlap={x_overlap:.2f}\")")

    print(f"Title underlines detected across deck: {len(title_underlines)}")

    if len(title_underlines) == 0:
        print("PASS: Zero title underlines detected across all 7 slides.")
    else:
        msg = f"FAIL: {len(title_underlines)} forbidden title underline(s) detected."
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # TEST 6: Native Editability (>250 Native Shapes p:sp, p:pic)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 6: Native Editability (>250 Native Elements p:sp, p:pic)")
    print("-" * 80)

    print(f"{'Slide':<10} | {'p:sp (Shapes/Text)':<20} | {'p:pic (Pictures)':<18} | {'Total Native Elements':<22}")
    print("-" * 76)
    for s_idx, elements, n_sp, n_pic in all_slides:
        print(f"{f'Slide {s_idx}':<10} | {n_sp:<20} | {n_pic:<18} | {n_sp + n_pic:<22}")
    print("-" * 76)
    total_native = total_sp + total_pic
    print(f"{'Total':<10} | {total_sp:<20} | {total_pic:<18} | {total_native:<22}")

    if total_native > 250:
        print(f"PASS: Presentation contains {total_native} native elements (>250 requirement satisfied).")
    else:
        msg = f"FAIL: Total native elements {total_native} is not > 250."
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # TEST 7: ECMA-376 Schema Validation via validate.py
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("TEST 7: ECMA-376 Schema Validation (validate.py)")
    print("-" * 80)

    val_cmd = [PYTHON_BIN, VALIDATE_SCRIPT, PPTX_PATH]
    print(f"Executing: {' '.join(val_cmd)}")
    proc = subprocess.run(val_cmd, capture_output=True, text=True)
    print(f"Exit code: {proc.returncode}")
    print(f"Stdout:\n{proc.stdout.strip()}")
    if proc.stderr:
        print(f"Stderr:\n{proc.stderr.strip()}")

    if proc.returncode == 0 and "All validations PASSED!" in proc.stdout:
        print("PASS: ECMA-376 schema validation passed with zero errors.")
    else:
        msg = f"FAIL: ECMA-376 schema validation returned code {proc.returncode}"
        print(msg)
        failures.append(msg)

    # -------------------------------------------------------------------------
    # FINAL VERDICT
    # -------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print("CHALLENGER FINAL VERDICT")
    print("=" * 80)

    if failures:
        print(f"STATUS: REJECT ({len(failures)} failures)")
        for f in failures:
            print(f" - {f}")
        return 1
    else:
        print("STATUS: APPROVE")
        print("All empirical tests (Slide Count, LAYOUT_WIDE canvas, Bounds, Margins,")
        print("Zero Title Underlines, Native Editability >250, and ECMA-376 Schema) PASSED 100%.")
        return 0


if __name__ == '__main__':
    sys.exit(main())
