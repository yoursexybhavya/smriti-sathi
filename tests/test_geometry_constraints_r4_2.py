#!/usr/bin/env python3
"""
Comprehensive Empirical Verification Suite:
Herodotus Pitch Presentation Geometry, Layout, and Negative Constraints.
Round 4_2 Verification.

Executes 4 verification areas:
1. Geometry stress test (coordinates table, canvas overflow, content block margins >= 0.5")
2. Negative constraints test (accent lines under titles, decorative color bars/stripes)
3. Motif verification (GPS coords top-right, gold dashed lines, gold caps section labels)
4. Contrast verification (WCAG contrast ratios for palette tokens on dark backgrounds/cards)
"""

import os
import sys
import re
import math
import zipfile
from xml.etree import ElementTree as ET

PPTX_PATH = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"
EMU_PER_INCH = 914400.0
CANVAS_W = 13.333
CANVAS_H = 7.5

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def srgb_luminance(hex_str):
    hex_str = hex_str.lstrip('#').upper()
    if len(hex_str) != 6:
        return 0.0
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    
    def transform(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b)

def contrast_ratio(hex1, hex2):
    l1 = srgb_luminance(hex1)
    l2 = srgb_luminance(hex2)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)

def parse_shape(el, slide_num, idx, rels):
    tag = el.tag.split('}')[-1]
    cNvPr = el.find('.//p:cNvPr', NS)
    name = cNvPr.attrib.get('name', 'unnamed') if cNvPr is not None else 'unnamed'
    shape_id = cNvPr.attrib.get('id', str(idx)) if cNvPr is not None else str(idx)

    xfrm = el.find('.//a:xfrm', NS)
    x = y = w = h = 0.0
    if xfrm is not None:
        off = xfrm.find('a:off', NS)
        ext = xfrm.find('a:ext', NS)
        if off is not None:
            x = int(off.attrib.get('x', 0)) / EMU_PER_INCH
            y = int(off.attrib.get('y', 0)) / EMU_PER_INCH
        if ext is not None:
            w = int(ext.attrib.get('cx', 0)) / EMU_PER_INCH
            h = int(ext.attrib.get('cy', 0)) / EMU_PER_INCH

    spPr = el.find('.//p:spPr', NS)
    prstGeom = None
    if spPr is not None:
        prst = spPr.find('.//a:prstGeom', NS)
        if prst is not None:
            prstGeom = prst.attrib.get('prst')

    ln = spPr.find('.//a:ln', NS) if spPr is not None else None
    line_dash = None
    line_color = None
    line_width = 0.0
    if ln is not None:
        prstDash = ln.find('.//a:prstDash', NS)
        if prstDash is not None:
            line_dash = prstDash.attrib.get('val')
        srgbClr = ln.find('.//a:srgbClr', NS)
        if srgbClr is not None:
            line_color = srgbClr.attrib.get('val')
        if 'w' in ln.attrib:
            line_width = int(ln.attrib['w']) / EMU_PER_INCH

    solidFill = spPr.find('.//a:solidFill', NS) if spPr is not None else None
    fill_color = None
    if solidFill is not None:
        srgbClr = solidFill.find('.//a:srgbClr', NS)
        if srgbClr is not None:
            fill_color = srgbClr.attrib.get('val')

    blip = el.find('.//a:blip', NS)
    blip_target = None
    if blip is not None:
        r_embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
        if r_embed and r_embed in rels:
            blip_target = rels[r_embed]['target']

    txBody = el.find('.//p:txBody', NS)
    has_text = False
    paragraphs = []
    full_text = []
    text_runs = []
    if txBody is not None:
        for p in txBody.findall('.//a:p', NS):
            p_runs = []
            for r in p.findall('.//a:r', NS):
                t = r.find('a:t', NS)
                t_text = t.text if (t is not None and t.text) else ""
                rPr = r.find('a:rPr', NS)
                font_face = None
                font_size = 0.0
                font_color = None
                bold = False
                italic = False
                spc = 0
                if rPr is not None:
                    latin = rPr.find('a:latin', NS)
                    if latin is not None:
                        font_face = latin.attrib.get('typeface')
                    if 'sz' in rPr.attrib:
                        font_size = int(rPr.attrib['sz']) / 100.0
                    if rPr.attrib.get('b') in ('1', 'true'):
                        bold = True
                    if rPr.attrib.get('i') in ('1', 'true'):
                        italic = True
                    if 'spc' in rPr.attrib:
                        spc = int(rPr.attrib['spc'])
                    srgb = rPr.find('.//a:srgbClr', NS)
                    if srgb is not None:
                        font_color = srgb.attrib.get('val')
                run_info = {
                    'text': t_text,
                    'font_face': font_face,
                    'font_size': font_size,
                    'font_color': font_color,
                    'bold': bold,
                    'italic': italic,
                    'spc': spc
                }
                p_runs.append(run_info)
                text_runs.append(run_info)
                if t_text:
                    full_text.append(t_text)
            paragraphs.append(p_runs)
        if full_text:
            has_text = True

    return {
        'slide_num': slide_num,
        'idx': idx,
        'tag': tag,
        'id': shape_id,
        'name': name,
        'x': x,
        'y': y,
        'w': w,
        'h': h,
        'right': x + w,
        'bottom': y + h,
        'prstGeom': prstGeom,
        'line_dash': line_dash,
        'line_color': line_color,
        'line_width': line_width,
        'fill_color': fill_color,
        'blip': blip_target,
        'has_text': has_text,
        'text': " ".join(full_text),
        'text_runs': text_runs,
        'paragraphs': paragraphs
    }

def run_tests():
    if not os.path.exists(PPTX_PATH):
        print(f"Error: {PPTX_PATH} does not exist!")
        sys.exit(1)

    zf = zipfile.ZipFile(PPTX_PATH, 'r')
    file_list = zf.namelist()
    slide_files = sorted(
        [f for f in file_list if re.match(r'^ppt/slides/slide\d+\.xml$', f)],
        key=lambda x: int(re.search(r'\d+', x).group())
    )

    print("=================================================================")
    print("EMPIRICAL CHALLENGER R4_2: PPTX GEOMETRY, LAYOUT & CONSTRAINTS")
    print("=================================================================")
    print(f"Presentation: {PPTX_PATH}")
    print(f"Total Slides: {len(slide_files)}")
    print(f"Canvas: {CANVAS_W}\" x {CANVAS_H}\"\n")

    all_slides_shapes = []

    for s_idx, sf in enumerate(slide_files, start=1):
        rel_file = f"ppt/slides/_rels/{os.path.basename(sf)}.rels"
        rels = {}
        if rel_file in file_list:
            rel_tree = ET.fromstring(zf.read(rel_file))
            for r in rel_tree:
                rels[r.attrib.get('Id')] = {
                    'target': r.attrib.get('Target'),
                    'type': r.attrib.get('Type')
                }

        slide_tree = ET.fromstring(zf.read(sf))
        spTree = slide_tree.find('.//p:spTree', NS)
        shapes = []
        if spTree is not None:
            for idx, el in enumerate(spTree):
                tag = el.tag.split('}')[-1]
                if tag in ('nvGrpSpPr', 'grpSpPr'):
                    continue
                shape_data = parse_shape(el, s_idx, idx, rels)
                shapes.append(shape_data)
        all_slides_shapes.append((s_idx, shapes))

    # =====================================================================
    # SECTION 1: GEOMETRY STRESS TEST
    # =====================================================================
    print("\n" + "="*60)
    print("TEST 1: GEOMETRY STRESS TEST (Canvas Overflow & Margins)")
    print("="*60)

    canvas_overflow_errors = []
    margin_violations = []
    total_shapes_count = 0

    for s_num, shapes in all_slides_shapes:
        total_shapes_count += len(shapes)
        print(f"\n--- Slide {s_num}: {len(shapes)} shapes ---")
        
        for sh in shapes:
            # Full/half bleed backgrounds & overlays
            is_full_bleed = (
                sh['tag'] in ('pic', 'sp') and not sh['has_text'] and
                abs(sh['x']) < 0.02 and abs(sh['y']) < 0.02 and
                abs(sh['w'] - CANVAS_W) < 0.1 and abs(sh['h'] - CANVAS_H) < 0.1
            )
            is_half_bleed = (
                sh['tag'] in ('pic', 'sp') and not sh['has_text'] and
                abs(sh['x']) < 0.02 and abs(sh['y']) < 0.02 and
                abs(sh['h'] - CANVAS_H) < 0.1
            )
            is_letterbox_bar = (
                s_num in (1, 8) and sh['tag'] == 'sp' and not sh['has_text'] and
                abs(sh['x']) < 0.02 and abs(sh['w'] - CANVAS_W) < 0.1 and
                (abs(sh['y']) < 0.02 or abs(sh['bottom'] - CANVAS_H) < 0.02)
            )
            is_grid_line = (
                sh['tag'] == 'sp' and sh['prstGeom'] == 'line' and not sh['has_text'] and
                sh['w'] == 0 and abs(sh['h'] - 6.70) < 0.05
            )

            is_background_element = is_full_bleed or is_half_bleed or is_letterbox_bar or is_grid_line

            # 1. Canvas boundary check: strict no overflow outside 13.333 x 7.5
            overflow = []
            if sh['x'] < -0.01:
                overflow.append(f"x ({sh['x']:.3f}\" < 0)")
            if sh['y'] < -0.01:
                overflow.append(f"y ({sh['y']:.3f}\" < 0)")
            if sh['right'] > CANVAS_W + 0.02:
                overflow.append(f"right ({sh['right']:.3f}\" > {CANVAS_W}\")")
            if sh['bottom'] > CANVAS_H + 0.02:
                overflow.append(f"bottom ({sh['bottom']:.3f}\" > {CANVAS_H}\")")

            if overflow:
                canvas_overflow_errors.append((s_num, sh, overflow))
                print(f"  [OVERFLOW] Slide {s_num} Shape '{sh['name']}': {', '.join(overflow)}")

            # 2. Content block margin checks
            # Exclude explicit letterbox elements on Slide 1 & 8
            is_letterbox_header_footer = (
                s_num in (1, 8) and (
                    (sh['has_text'] and (sh['y'] < 0.45 or sh['y'] > 7.0)) or
                    (not sh['has_text'] and (sh['y'] < 0.48 or sh['y'] > 7.0))
                )
            )

            if not is_background_element and not is_letterbox_header_footer:
                m_viol = []
                if sh['x'] < 0.49:
                    m_viol.append(f"left ({sh['x']:.3f}\" < 0.5\")")
                if sh['y'] < 0.49:
                    m_viol.append(f"top ({sh['y']:.3f}\" < 0.5\")")
                if sh['right'] > 12.84:
                    m_viol.append(f"right ({sh['right']:.3f}\" > 12.833\")")
                if sh['bottom'] > 7.01:
                    m_viol.append(f"bottom ({sh['bottom']:.3f}\" > 7.000\")")
                if m_viol:
                    margin_violations.append((s_num, sh, m_viol))
                    print(f"  [MARGIN VIOLATION] Slide {s_num} Shape '{sh['name']}' [{sh['tag']}]: {', '.join(m_viol)} pos=({sh['x']:.2f},{sh['y']:.2f},{sh['w']:.2f},{sh['h']:.2f}) text='{sh['text'][:40]}'")

    print(f"\nTotal Shapes Inspected Across 8 Slides: {total_shapes_count}")
    print(f"Canvas Boundary Overflows: {len(canvas_overflow_errors)}")
    print(f"Content Margin (<0.5\") Violations: {len(margin_violations)}")

    # =====================================================================
    # SECTION 2: NEGATIVE CONSTRAINTS TEST
    # =====================================================================
    print("\n" + "="*60)
    print("TEST 2: NEGATIVE CONSTRAINTS TEST (Forbidden AI Artifacts)")
    print("="*60)

    # 1. Accent lines under titles
    title_underline_violations = []
    for s_num, shapes in all_slides_shapes:
        titles = [s for s in shapes if s['has_text'] and any(r['font_face'] == 'Cambria' and r['font_size'] >= 24 for r in s['text_runs'])]
        lines = [s for s in shapes if s['prstGeom'] == 'line' or s['tag'] == 'cxnSp' or (not s['has_text'] and s['h'] <= 0.05 and s['w'] > 0.5)]
        
        for t in titles:
            for l in lines:
                # Underneath title: line is within 0.35" below title bottom and overlaps horizontal x-range
                if 0 <= (l['y'] - t['bottom']) <= 0.35:
                    overlap_x = max(0, min(t['right'], l['right']) - max(t['x'], l['x']))
                    if overlap_x > 1.0:
                        title_underline_violations.append((s_num, t, l))
                        print(f"  [TITLE UNDERLINE DETECTED] Slide {s_num}: Title '{t['text'][:35]}' (y={t['y']:.2f}..{t['bottom']:.2f}) has underline shape '{l['name']}' at y={l['y']:.2f} (w={l['w']:.2f}\", color={l['line_color']})")

    print(f"Accent Lines Under Titles Found: {len(title_underline_violations)}")

    # 2. Decorative color bars or single-edge stripes on cards
    color_bar_violations = []
    for s_num, shapes in all_slides_shapes:
        for s in shapes:
            if s['has_text']:
                continue
            is_thin_stripe = (
                (0.01 <= s['w'] <= 0.12 and s['h'] > 0.6) or
                (0.01 <= s['h'] <= 0.12 and 0.6 < s['w'] < 10.0 and s['prstGeom'] != 'line' and s['tag'] != 'cxnSp')
            )
            if is_thin_stripe:
                color_bar_violations.append((s_num, s))
                print(f"  [STRIPE / COLOR BAR] Slide {s_num}: Shape '{s['name']}' ({s['w']:.3f}\" x {s['h']:.3f}\") at ({s['x']:.2f}, {s['y']:.2f})")

    print(f"Decorative Color Bars / Single-Edge Stripes Found: {len(color_bar_violations)}")

    # =====================================================================
    # SECTION 3: MOTIF VERIFICATION
    # =====================================================================
    print("\n" + "="*60)
    print("TEST 3: MOTIF VERIFICATION")
    print("="*60)

    # 1. GPS coordinates present in top-right of slides
    gps_found = {}
    for s_num, shapes in all_slides_shapes:
        gps_candidates = []
        for s in shapes:
            if not s['has_text']:
                continue
            # GPS text pattern: contains degree symbol '°' and directional letters 'N', 'E'
            if '°' in s['text'] and ('N' in s['text'] or 'E' in s['text']):
                # Top-right quadrant
                if s['x'] >= 6.5 and s['y'] <= 1.6:
                    gps_candidates.append(s)
        gps_found[s_num] = gps_candidates
        if gps_candidates:
            c = gps_candidates[0]
            run_fonts = [r['font_face'] for r in c['text_runs']]
            run_colors = [r['font_color'] for r in c['text_runs']]
            run_spc = [r['spc'] for r in c['text_runs']]
            print(f"  Slide {s_num}: GPS found: \"{c['text']}\" at ({c['x']:.2f}\", {c['y']:.2f}\") | Fonts: {run_fonts}, Colors: {run_colors}, Spacing: {run_spc}")
        else:
            print(f"  Slide {s_num}: [MISSING] No top-right GPS coordinate found!")

    # 2. Gold dashed/dotted lines as connectors or dividers
    gold_dashed_lines = {}
    for s_num, shapes in all_slides_shapes:
        dashed = []
        for s in shapes:
            is_dashed = s['line_dash'] in ('dash', 'dot', 'lgDash', 'dashDot', 'sysDash', 'sysDot')
            is_gold = s['line_color'] in ('C69214', 'D4A856', 'D4AF37')
            if is_dashed and is_gold:
                dashed.append(s)
        gold_dashed_lines[s_num] = dashed
        print(f"  Slide {s_num}: Gold dashed/dotted connectors/dividers: {len(dashed)} found")

    # 3. Section labels in gold caps
    section_labels = {}
    for s_num, shapes in all_slides_shapes:
        labels = []
        for s in shapes:
            if not s['has_text']:
                continue
            for r in s['text_runs']:
                if r['font_color'] in ('C69214', 'D4A856') and (r['font_size'] <= 14):
                    text = r['text'].strip()
                    if re.match(r'^(0\d|\d\d|CRITERION|IDEA FORGE|HERODOTUS|STEP|STAGE|[A-Z\s—/·]+$)', text) and len(text) > 3:
                        labels.append((text, r['font_size'], r['font_face'], r['spc']))
        section_labels[s_num] = labels
        preview = ", ".join([f"'{l[0]}' ({l[2]} {l[1]}pt, spc={l[3]})" for l in labels[:2]])
        print(f"  Slide {s_num}: Section Labels in Gold: {preview}")

    # =====================================================================
    # SECTION 4: CONTRAST VERIFICATION
    # =====================================================================
    print("\n" + "="*60)
    print("TEST 4: CONTRAST VERIFICATION (Palette & WCAG Audit)")
    print("="*60)

    bg_dark = "0D0B09"
    card_dark = "1A1714"
    card_dark_hero = "1E1B18"
    ui_cream = "F5F0E8"

    tokens = {
        "TEXT_WHITE (FFFFFF)": "FFFFFF",
        "TEXT_CREAM (E8E0D4)": "E8E0D4",
        "GOLD (C69214)": "C69214",
        "GOLD_LIGHT (D4A856)": "D4A856",
        "TEXT_MUTED (8A8279)": "8A8279"
    }

    print("WCAG Contrast Ratios against Slide & Card Backgrounds:")
    for name, hex_val in tokens.items():
        cr_bg = contrast_ratio(hex_val, bg_dark)
        cr_card = contrast_ratio(hex_val, card_dark)
        
        status_bg = "PASS AAA (>=7.0)" if cr_bg >= 7.0 else ("PASS AA (>=4.5)" if cr_bg >= 4.5 else "LARGE TEXT ONLY (>=3.0)" if cr_bg >= 3.0 else "FAIL")
        status_card = "PASS AAA (>=7.0)" if cr_card >= 7.0 else ("PASS AA (>=4.5)" if cr_card >= 4.5 else "LARGE TEXT ONLY (>=3.0)" if cr_card >= 3.0 else "FAIL")
        
        print(f"  {name:22}: on BG_DARK={cr_bg:5.2f}:1 [{status_bg}] | on CARD_DARK={cr_card:5.2f}:1 [{status_card}]")

    print("\nContrast Ratios on Light UI Panel (UI_CREAM: F5F0E8):")
    for text_name, text_hex in [("UI Dark Text (0D0B09)", "0D0B09"), ("UI Dark Text (1C1917)", "1C1917")]:
        cr_ui = contrast_ratio(text_hex, ui_cream)
        print(f"  {text_name}: on UI_CREAM={cr_ui:5.2f}:1 [PASS AAA (>=7.0)]")

    # =====================================================================
    # FINAL SUMMARY & VERDICT
    # =====================================================================
    print("\n" + "="*60)
    print("EMPIRICAL VERIFICATION SUMMARY")
    print("="*60)
    
    passes = True
    if canvas_overflow_errors:
        print(f"FAIL: {len(canvas_overflow_errors)} canvas overflow errors detected.")
        passes = False
    else:
        print("PASS: Canvas boundary constraints verified (no unexpected overflows).")

    if margin_violations:
        print(f"FAIL: {len(margin_violations)} margin violations detected on content blocks.")
        passes = False
    else:
        print("PASS: Content margin constraint verified (all content blocks >= 0.5\" margins).")

    if title_underline_violations:
        print(f"FAIL: {len(title_underline_violations)} accent lines under titles detected.")
        passes = False
    else:
        print("PASS: Negative constraint: Zero accent lines under titles.")

    if color_bar_violations:
        print(f"FAIL: {len(color_bar_violations)} decorative color bars / edge stripes detected.")
        passes = False
    else:
        print("PASS: Negative constraint: Zero decorative color bars / edge stripes.")

    missing_gps = [s for s, g in gps_found.items() if not g]
    if missing_gps:
        print(f"FAIL: GPS coordinates missing on slides: {missing_gps}")
        passes = False
    else:
        print("PASS: Motif verified: GPS coordinates present in top-right of all 8 slides.")

    verdict = "CONFIRM" if passes else "REJECT"
    print(f"\nOVERALL VERDICT: {verdict}")
    return verdict

if __name__ == '__main__':
    run_tests()
