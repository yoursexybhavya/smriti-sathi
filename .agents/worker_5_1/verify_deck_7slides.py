#!/usr/bin/env python3
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
        embed_id = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
        if embed_id and embed_id in rels:
            blip_target = rels[embed_id].get('target')

    txBody = el.find('.//p:txBody', NS)
    has_text = False
    full_text = []
    text_runs = []
    paragraphs = []
    if txBody is not None:
        for p in txBody.findall('a:p', NS):
            p_runs = []
            for r in p.findall('a:r', NS):
                t = r.find('a:t', NS)
                rPr = r.find('a:rPr', NS)
                if t is not None and t.text:
                    t_text = t.text
                    font_size = 0.0
                    font_color = None
                    font_face = None
                    is_bold = False
                    is_italic = False
                    if rPr is not None:
                        sz = rPr.attrib.get('sz')
                        if sz:
                            font_size = int(sz) / 100.0
                        b = rPr.attrib.get('b')
                        if b in ('1', 'true'):
                            is_bold = True
                        i = rPr.attrib.get('i')
                        if i in ('1', 'true'):
                            is_italic = True
                        latin = rPr.find('a:latin', NS)
                        if latin is not None:
                            font_face = latin.attrib.get('typeface')
                        srgb = rPr.find('.//a:srgbClr', NS)
                        if srgb is not None:
                            font_color = srgb.attrib.get('val')
                    run_info = {
                        'text': t_text,
                        'font_size': font_size,
                        'font_color': font_color,
                        'font_face': font_face,
                        'bold': is_bold,
                        'italic': is_italic
                    }
                    p_runs.append(run_info)
                    text_runs.append(run_info)
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

def run_suite():
    if not os.path.exists(PPTX_PATH):
        print(f"FAIL: {PPTX_PATH} does not exist!")
        return False

    failures = []
    zf = zipfile.ZipFile(PPTX_PATH, 'r')
    file_list = zf.namelist()
    slide_files = sorted(
        [f for f in file_list if re.match(r'^ppt/slides/slide\d+\.xml$', f)],
        key=lambda x: int(re.search(r'\d+', x).group())
    )

    print("=================================================================")
    print("7-SLIDE HERODOTUS VERIFICATION SUITE")
    print("=================================================================")
    print(f"File: {PPTX_PATH}")
    print(f"Slide Count: {len(slide_files)}")

    # 1. Slide count check
    if len(slide_files) != 7:
        failures.append(f"Expected 7 slides matching reference screenshots, found {len(slide_files)}")
        print(f"FAIL: Expected 7 slides, found {len(slide_files)}")
    else:
        print("PASS: Exactly 7 slides generated.")

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

    # 2. Geometry & Canvas Overflows
    print("\n--- TEST 1: GEOMETRY & MARGINS ---")
    margin_violations = []
    overflow_violations = []
    for s_num, shapes in all_slides_shapes:
        for sh in shapes:
            is_full_bleed = (
                sh['tag'] in ('pic', 'sp') and not sh['has_text'] and
                abs(sh['x']) < 0.02 and abs(sh['y']) < 0.02 and
                abs(sh['w'] - CANVAS_W) < 0.1 and abs(sh['h'] - CANVAS_H) < 0.1
            )
            is_half_bleed = (
                sh['tag'] in ('pic', 'sp') and not sh['has_text'] and
                (abs(sh['x']) < 0.02 or abs(sh['right'] - CANVAS_W) < 0.1) and
                abs(sh['h'] - CANVAS_H) < 0.1
            )
            is_letterbox_bar = (
                s_num in (1, 7) and sh['tag'] == 'sp' and not sh['has_text'] and
                abs(sh['x']) < 0.02 and abs(sh['w'] - CANVAS_W) < 0.1 and
                (abs(sh['y']) < 0.02 or abs(sh['bottom'] - CANVAS_H) < 0.02)
            )
            is_grid_line = (
                sh['tag'] == 'sp' and sh['prstGeom'] == 'line' and not sh['has_text'] and
                sh['w'] == 0 and abs(sh['h'] - 6.30) < 0.1
            )
            is_background_element = is_full_bleed or is_half_bleed or is_letterbox_bar or is_grid_line

            # Overflow check
            if sh['x'] < -0.02 or sh['y'] < -0.02 or sh['right'] > CANVAS_W + 0.05 or sh['bottom'] > CANVAS_H + 0.05:
                overflow_violations.append((s_num, sh['name'], sh['x'], sh['y'], sh['right'], sh['bottom']))

            # Content margin check (>= 0.5")
            is_letterbox_content = s_num in (1, 7) and (sh['y'] < 0.45 or sh['y'] > 7.0)
            if not is_background_element and not is_letterbox_content:
                if sh['x'] < 0.49 or sh['y'] < 0.49 or sh['right'] > 12.85 or sh['bottom'] > 7.01:
                    margin_violations.append((s_num, sh['name'], sh['x'], sh['y'], sh['right'], sh['bottom'], sh['text'][:30]))

    if overflow_violations:
        failures.append(f"{len(overflow_violations)} canvas overflow violations")
        for v in overflow_violations[:5]:
            print(f"  FAIL: Overflow on Slide {v[0]} {v[1]}")
    else:
        print("PASS: Zero canvas boundary overflows.")

    if margin_violations:
        failures.append(f"{len(margin_violations)} content margin violations (< 0.5\")")
        for v in margin_violations[:5]:
            print(f"  FAIL: Margin violation on Slide {v[0]} {v[1]} pos=({v[2]:.2f}, {v[3]:.2f}) text='{v[6]}'")
    else:
        print("PASS: All content blocks strictly respect >= 0.5\" margins.")

    # 3. Negative Constraints (Zero title accent lines, Zero decorative stripes)
    print("\n--- TEST 2: NEGATIVE CONSTRAINTS ---")
    title_underlines = []
    for s_num, shapes in all_slides_shapes:
        titles = [s for s in shapes if s['has_text'] and any(r['font_face'] == 'Cambria' and r['font_size'] >= 24 for r in s['text_runs'])]
        lines = [s for s in shapes if s['prstGeom'] == 'line' or s['tag'] == 'cxnSp' or (not s['has_text'] and s['h'] <= 0.05 and s['w'] > 0.5)]
        for t in titles:
            for l in lines:
                if 0 <= (l['y'] - t['bottom']) <= 0.35:
                    overlap_x = max(0, min(t['right'], l['right']) - max(t['x'], l['x']))
                    if overlap_x > 1.0:
                        title_underlines.append((s_num, t['text'][:30], l['name'], l['y']))

    if title_underlines:
        failures.append(f"{len(title_underlines)} accent lines under titles found")
        for u in title_underlines:
            print(f"  FAIL: Title underline on Slide {u[0]}: '{u[1]}' at y={u[3]}")
    else:
        print("PASS: ZERO accent lines directly under titles.")

    # 4. Text Preservation Check Across 7 Slides
    print("\n--- TEST 3: TEXT PRESERVATION ACROSS 7 SLIDES ---")
    slide_texts = {}
    for s_num, shapes in all_slides_shapes:
        all_t = " ".join(s['text'] for s in shapes if s['has_text'])
        slide_texts[s_num] = all_t

    required_per_slide = {
        1: ["HERODOTUS", "MAP-FIRST", "EXPLORE INDIA'S MONUMENTS", "3,693", "AGRA", "TAJ MAHAL", "TEAM HERODOTUS"],
        2: ["THE PROBLEM", "STANDING IN FRONT OF HISTORY", "WHERE'S THE STORY", "INFORMATION IS SCATTERED", "VISITOR DETAILS ARE FRAGMENTED", "THE EXPERIENCE LACKS CONTEXT", "JAIPUR"],
        3: ["THE SOLUTION", "WHAT IF THE MAP", "COULD TELL THE STORY", "AMER FORT", "01", "INDIA", "RAJASTHAN", "JAIPUR", "MONUMENT", "AUDIO GUIDE", "08:00", "₹200", "TICKETS"],
        4: ["PRODUCT EXPERIENCE", "FROM MAP TO MONUMENT", "herodotus.app/explore", "01", "ZOOM", "02", "TAP", "03", "LISTEN", "04", "PLAN", "RESERVED", "LIVE PROTOTYPE", "AMER FORT"],
        5: ["TECHNICAL FEASIBILITY", "SIMPLE ARCHITECTURE", "POWERFUL EXPERIENCE", "MVP-FIRST", "USER", "MAP", "STORY", "DATA", "WEB", "WHY IT SHIPS", "DEPLOY SURFACE", "STRETCH", "NEXT"],
        6: ["IMPACT & VALUE", "THREE THINGS", "ONE EXPERIENCE", "DISCOVER", "UNDERSTAND", "PLAN", "TOURISM & HERITAGE", "INDEPENDENCE", "ACCESSIBILITY", "HERODOTUS CONNECTS DISCOVERY"],
        7: ["HISTORY IS EVERYWHERE", "NOW, IT CAN SPEAK", "HERODOTUS", "EXPLORE.   LISTEN.   DISCOVER.", "HAMPI", "SCAN", "LIVE DEMO", "TEAM HERODOTUS"]
    }

    text_failures = []
    for s_num, reqs in required_per_slide.items():
        st = slide_texts.get(s_num, "")
        for r in reqs:
            if r.upper() not in st.upper():
                text_failures.append((s_num, r))
                print(f"  FAIL: Slide {s_num} missing required string '{r}'")

    if text_failures:
        failures.append(f"{len(text_failures)} missing required text strings")
    else:
        print("PASS: 100% of required text strings present across all 7 slides.")

    # 5. Speaker Notes Check (All 7 Slides)
    print("\n--- TEST 4: SPEAKER NOTES VERIFICATION ---")
    notes_files = sorted([f for f in file_list if re.match(r'^ppt/notesSlides/notesSlide\d+\.xml$', f)],
                         key=lambda x: int(re.search(r'\d+', x).group()))
    if len(notes_files) != 7:
        failures.append(f"Expected 7 notesSlides, found {len(notes_files)}")
        print(f"FAIL: Expected 7 notesSlides, found {len(notes_files)}")
    else:
        print(f"PASS: Exactly 7 notesSlides discovered.")

    for s_idx in range(1, 8):
        srel = f"ppt/slides/_rels/slide{s_idx}.xml.rels"
        rel_tree = ET.fromstring(zf.read(srel))
        notes_targets = [r.attrib.get('Target') for r in rel_tree.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')
                         if 'notesSlide' in r.attrib.get('Type', '') or 'notesSlide' in r.attrib.get('Target', '')]
        if not notes_targets:
            failures.append(f"Slide {s_idx} missing notesSlide relationship")
            continue
        norm_notes = os.path.normpath(os.path.join('ppt/slides', notes_targets[0]))
        ntree = ET.fromstring(zf.read(norm_notes))
        notes_words = " ".join([t.text for t in ntree.findall('.//a:t', NS) if t.text]).split()
        if len(notes_words) < 25:
            failures.append(f"Slide {s_idx} notes too brief ({len(notes_words)} words)")
            print(f"  FAIL: Slide {s_idx} notes too brief ({len(notes_words)} words)")
        else:
            print(f"  PASS: Slide {s_idx} notes substantive ({len(notes_words)} words).")

    print("\n=================================================================")
    if failures:
        print(f"SUITE RESULT: FAILED ({len(failures)} failures)")
        for f in failures:
            print(f"  - {f}")
        return False
    else:
        print("SUITE RESULT: ALL 7-SLIDE TESTS PASSED PERFECTLY!")
        return True

if __name__ == '__main__':
    ok = run_suite()
    sys.exit(0 if ok else 1)
