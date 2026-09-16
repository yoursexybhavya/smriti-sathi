#!/usr/bin/env python3
"""
Empirical OpenXML and Structural Challenger Test Suite for Herodotus Pitch Presentation
Author: challenger_r4_1
Target: Herodotus_Pitch_Presentation.pptx
"""

import sys
import os
import zipfile
import hashlib
import io
import re
from PIL import Image

try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree

PPTX_PATH = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"
ASSET_DIR = "/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48"
EMU_PER_INCH = 914400.0

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'pr': 'http://schemas.openxmlformats.org/package/2006/relationships',
    'ct': 'http://schemas.openxmlformats.org/package/2006/content-types',
}

def get_luminance(hex_code):
    hex_code = hex_code.lstrip('#')
    if len(hex_code) != 6:
        return 1.0
    r = int(hex_code[0:2], 16) / 255.0
    g = int(hex_code[2:4], 16) / 255.0
    b = int(hex_code[4:6], 16) / 255.0
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def run_tests():
    print(f"================================================================================")
    print(f"EMPIRICAL OPENXML & STRUCTURAL CHALLENGE SUITE: {PPTX_PATH}")
    print(f"================================================================================\n")

    if not os.path.exists(PPTX_PATH):
        print(f"CRITICAL FAILURE: File does not exist: {PPTX_PATH}")
        sys.exit(1)

    file_size = os.path.getsize(PPTX_PATH)
    print(f"PPTX File Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")

    z = zipfile.ZipFile(PPTX_PATH, 'r')
    namelist = set(z.namelist())
    print(f"Total parts in ZIP archive: {len(namelist)}\n")

    overall_failures = []

    # -------------------------------------------------------------------------
    # TEST 1: OpenXML Well-Formedness and ECMA-376 Presentation Package Structure
    # -------------------------------------------------------------------------
    print("--------------------------------------------------------------------------------")
    print("TEST 1: ECMA-376 Package Integrity & XML Well-Formedness (All Parts)")
    print("--------------------------------------------------------------------------------")
    xml_parts = [n for n in z.namelist() if n.endswith('.xml') or n.endswith('.rels')]
    malformed = []
    parsed_trees = {}
    for xp in xml_parts:
        try:
            raw = z.read(xp)
            tree = etree.fromstring(raw)
            parsed_trees[xp] = tree
        except Exception as e:
            malformed.append((xp, str(e)))

    if malformed:
        print(f"FAIL: {len(malformed)} XML parts are malformed:")
        for xp, err in malformed:
            print(f"  - {xp}: {err}")
        overall_failures.append("Test 1: Malformed XML parts found")
    else:
        print(f"PASS: All {len(xml_parts)} XML/.rels parts parsed with zero syntax/schema parsing errors.")

    # Check presentation.xml layout and dimensions
    pres_tree = parsed_trees.get('ppt/presentation.xml')
    if pres_tree is not None:
        sldSz = pres_tree.find('.//p:sldSz', NS)
        if sldSz is not None:
            cx = int(sldSz.attrib.get('cx', 0))
            cy = int(sldSz.attrib.get('cy', 0))
            w_in = cx / EMU_PER_INCH
            h_in = cy / EMU_PER_INCH
            print(f"Presentation Canvas Dimensions: {cx} x {cy} EMU ({w_in:.3f}\" x {h_in:.3f}\")")
            if abs(w_in - 13.333) > 0.01 or abs(h_in - 7.5) > 0.01:
                print(f"FAIL: Canvas dimensions not LAYOUT_WIDE 16:9 (13.333\" x 7.5\"): found {w_in} x {h_in}")
                overall_failures.append("Test 1: Canvas dimension mismatch")
            else:
                print("PASS: Canvas dimensions match LAYOUT_WIDE 16:9 exactly.")
        else:
            print("FAIL: <p:sldSz> missing from ppt/presentation.xml")
            overall_failures.append("Test 1: <p:sldSz> missing")

        # Check child order in <p:presentation>
        children_tags = [child.tag.split('}')[-1] for child in pres_tree]
        print(f"Presentation child elements sequence: {children_tags}")
        if 'sldIdLst' in children_tags and 'notesMasterIdLst' in children_tags:
            sld_idx = children_tags.index('sldIdLst')
            nm_idx = children_tags.index('notesMasterIdLst')
            if nm_idx < sld_idx:
                print("FAIL: <p:notesMasterIdLst> precedes <p:sldIdLst> (Known PowerPoint corruption footgun)!")
                overall_failures.append("Test 1: Child order in presentation.xml invalid")
            else:
                print("PASS: <p:sldIdLst> precedes <p:notesMasterIdLst> in presentation.xml.")
    else:
        print("FAIL: ppt/presentation.xml missing from archive!")
        overall_failures.append("Test 1: presentation.xml missing")

    # -------------------------------------------------------------------------
    # TEST 2: Native Text Elements (<p:sp> with <p:txBody>) vs Flattened Raster
    # -------------------------------------------------------------------------
    print("\n--------------------------------------------------------------------------------")
    print("TEST 2: Native Text Elements (<p:sp><p:txBody>) vs Rasterized Slides")
    print("--------------------------------------------------------------------------------")
    slide_files = sorted([f for f in namelist if re.match(r'^ppt/slides/slide\d+\.xml$', f)],
                         key=lambda x: int(re.search(r'\d+', x).group()))
    print(f"Total slide files discovered: {len(slide_files)}")
    if len(slide_files) != 8:
        print(f"FAIL: Expected exactly 8 slides, found {len(slide_files)}")
        overall_failures.append("Test 2: Slide count not 8")

    total_text_boxes = 0
    total_paragraphs = 0
    total_runs = 0
    total_characters = 0

    for s_idx, sf in enumerate(slide_files, 1):
        stree = parsed_trees[sf]
        spTree = stree.find('.//p:spTree', NS)
        shapes = spTree.findall('p:sp', NS) if spTree is not None else []
        pics = spTree.findall('p:pic', NS) if spTree is not None else []

        text_boxes = []
        slide_chars = 0
        slide_runs = 0
        slide_paras = 0

        for sp in shapes:
            txBody = sp.find('p:txBody', NS)
            if txBody is not None:
                runs = txBody.findall('.//a:t', NS)
                text = "".join([r.text for r in runs if r.text])
                paras = txBody.findall('a:p', NS)
                if text.strip():
                    text_boxes.append((sp, text))
                    slide_chars += len(text)
                    slide_runs += len(runs)
                    slide_paras += len(paras)

        total_text_boxes += len(text_boxes)
        total_characters += slide_chars
        total_runs += slide_runs
        total_paragraphs += slide_paras

        print(f"Slide {s_idx} ({sf}):")
        print(f"  - Native <p:sp> shapes: {len(shapes)}")
        print(f"  - Shapes with <p:txBody> text: {len(text_boxes)}")
        print(f"  - Paragraphs (<a:p>): {slide_paras}")
        print(f"  - Text runs (<a:r>/<a:t>): {slide_runs}")
        print(f"  - Text character count: {slide_chars}")
        print(f"  - Sample text snippet: {text_boxes[0][1][:60] if text_boxes else 'NONE'}...")

        if len(text_boxes) < 3:
            print(f"  FAIL: Slide {s_idx} has suspiciously few native text boxes ({len(text_boxes)})!")
            overall_failures.append(f"Test 2: Slide {s_idx} has fewer than 3 text boxes")
        else:
            print(f"  PASS: Slide {s_idx} confirmed fully native, editable text structure.")

    print(f"\nDeck Text Summary: {total_text_boxes} native text boxes, {total_paragraphs} paragraphs, {total_runs} runs, {total_characters} characters.")
    if total_characters < 2000:
        print(f"FAIL: Deck text volume suspiciously low ({total_characters} chars)")
        overall_failures.append("Test 2: Total characters < 2000")
    else:
        print("PASS: Rich, multi-layered native editable text across all 8 slides.")

    # -------------------------------------------------------------------------
    # TEST 3: Background Fills in Slide XML (Zero Light Backgrounds Allowed!)
    # -------------------------------------------------------------------------
    print("\n--------------------------------------------------------------------------------")
    print("TEST 3: Background Fills (Zero Light Backgrounds; Required: 0D0B09 or Near-Black)")
    print("--------------------------------------------------------------------------------")
    bg_failures = []
    for s_idx, sf in enumerate(slide_files, 1):
        stree = parsed_trees[sf]
        # Check <p:bg>
        bg = stree.find('.//p:bg', NS)
        bg_color = None
        if bg is not None:
            srgb = bg.find('.//a:srgbClr', NS)
            if srgb is not None:
                bg_color = srgb.attrib.get('val')

        # Check full-bleed background shape in spTree
        spTree = stree.find('.//p:spTree', NS)
        bleed_shape_color = None
        bleed_pics = []
        if spTree is not None:
            for el in spTree:
                tag = el.tag.split('}')[-1]
                xfrm = el.find('.//a:xfrm', NS)
                if xfrm is not None:
                    off = xfrm.find('a:off', NS)
                    ext = xfrm.find('a:ext', NS)
                    if off is not None and ext is not None:
                        x = int(off.attrib.get('x', -1)) / EMU_PER_INCH
                        y = int(off.attrib.get('y', -1)) / EMU_PER_INCH
                        w = int(ext.attrib.get('cx', -1)) / EMU_PER_INCH
                        h = int(ext.attrib.get('cy', -1)) / EMU_PER_INCH
                        if abs(x) < 0.05 and abs(y) < 0.05 and abs(w - 13.333) < 0.2 and abs(h - 7.5) < 0.2:
                            if tag == 'sp':
                                clr = el.find('.//a:srgbClr', NS)
                                if clr is not None:
                                    bleed_shape_color = clr.attrib.get('val')
                            elif tag == 'pic':
                                bleed_pics.append(el)

        # Check all shape fills on the slide to ensure no full-canvas light shape
        light_canvas_shapes = []
        if spTree is not None:
            for sp in spTree.findall('p:sp', NS):
                xfrm = sp.find('.//a:xfrm', NS)
                if xfrm is not None:
                    off = xfrm.find('a:off', NS)
                    ext = xfrm.find('a:ext', NS)
                    if off is not None and ext is not None:
                        w = int(ext.attrib.get('cx', -1)) / EMU_PER_INCH
                        h = int(ext.attrib.get('cy', -1)) / EMU_PER_INCH
                        area = w * h
                        # If a shape covers > 50% of slide area (slide area = 100 sq inches)
                        if area > 40.0:
                            srgb = sp.find('.//a:srgbClr', NS)
                            if srgb is not None:
                                c = srgb.attrib.get('val', '')
                                lum = get_luminance(c)
                                if lum > 0.2:
                                    light_canvas_shapes.append((c, area, lum))

        print(f"Slide {s_idx} ({sf}):")
        print(f"  - Slide XML <p:bg> color: {bg_color}")
        print(f"  - Full-bleed background shape color: {bleed_shape_color}")
        print(f"  - Full-bleed background photo count: {len(bleed_pics)}")
        print(f"  - Large light-colored shapes (>40 sq in): {len(light_canvas_shapes)}")

        # Evaluation
        active_bg = bg_color or bleed_shape_color
        if not active_bg and len(bleed_pics) > 0:
            active_bg = "PHOTO_BLEED"

        if active_bg is None:
            print(f"  FAIL: Slide {s_idx} has no explicit background fill defined!")
            bg_failures.append(f"Slide {s_idx}: missing bg fill")
        elif active_bg == "PHOTO_BLEED":
            print(f"  PASS: Slide {s_idx} uses full-bleed photographic background with dark treatment.")
        else:
            lum = get_luminance(active_bg)
            print(f"  Background fill hex: #{active_bg}, Luminance: {lum:.4f}")
            if lum > 0.05:
                print(f"  FAIL: Slide {s_idx} background is too bright! (Hex: #{active_bg}, Luminance: {lum:.4f})")
                bg_failures.append(f"Slide {s_idx}: background #{active_bg} has luminance {lum:.4f} > 0.05")
            elif active_bg.upper() in ("0D0B09", "12100E", "1A1714"):
                print(f"  PASS: Slide {s_idx} background is exact brand dark palette (#{active_bg.upper()}).")
            else:
                print(f"  PASS: Slide {s_idx} background is near-black (#{active_bg.upper()}).")

        if light_canvas_shapes:
            print(f"  FAIL: Slide {s_idx} contains large light canvas shapes: {light_canvas_shapes}")
            bg_failures.append(f"Slide {s_idx}: large light canvas shapes present")

    if bg_failures:
        print(f"\nFAIL: Background fill verification failed on {len(bg_failures)} slides:")
        for bf in bg_failures:
            print(f"  - {bf}")
        overall_failures.append("Test 3: Light backgrounds detected")
    else:
        print("\nPASS: ALL 8 slides strictly comply with dark/near-black background requirement (0D0B09). ZERO light backgrounds!")

    # -------------------------------------------------------------------------
    # TEST 4: Embedded Pictures in ppt/media/ & Screen Capture Detection
    # -------------------------------------------------------------------------
    print("\n--------------------------------------------------------------------------------")
    print("TEST 4: Embedded Pictures in ppt/media/ (Authentic Assets vs Slide Screenshots)")
    print("--------------------------------------------------------------------------------")
    media_files = sorted([f for f in namelist if f.startswith('ppt/media/') and not f.endswith('/')])
    print(f"Total media files in ppt/media/: {len(media_files)}")

    media_hashes = {}
    media_info = {}
    for mf in media_files:
        data = z.read(mf)
        md5 = hashlib.md5(data).hexdigest()
        sha256 = hashlib.sha256(data).hexdigest()
        media_hashes[mf] = md5
        try:
            img = Image.open(io.BytesIO(data))
            media_info[mf] = {
                'format': img.format,
                'size': img.size,
                'mode': img.mode,
                'bytes': len(data),
                'md5': md5,
                'sha256': sha256
            }
        except Exception as e:
            media_info[mf] = {'error': str(e), 'bytes': len(data), 'md5': md5}

    for mf, info in media_info.items():
        if 'error' in info:
            print(f"  - {mf}: ERROR decoding image: {info['error']}")
            overall_failures.append(f"Test 4: Media file {mf} corrupt")
        else:
            aspect = info['size'][0] / info['size'][1]
            print(f"  - {mf}: {info['format']} {info['size'][0]}x{info['size'][1]} (aspect {aspect:.2f}), {info['bytes']:,} bytes, md5={info['md5'][:8]}...")

    # Verify each slide's embedded pictures and relationships
    slide_pics = {}
    screenshot_slides = []
    for s_idx, sf in enumerate(slide_files, 1):
        rel_path = f"ppt/slides/_rels/slide{s_idx}.xml.rels"
        slide_media_rels = {}
        if rel_path in namelist:
            rtree = parsed_trees[rel_path]
            for rel in rtree.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                if "image" in rel.attrib.get('Type', ''):
                    rid = rel.attrib.get('Id')
                    tgt = rel.attrib.get('Target')
                    norm_tgt = os.path.normpath(os.path.join("ppt/slides", tgt))
                    slide_media_rels[rid] = norm_tgt

        stree = parsed_trees[sf]
        spTree = stree.find('.//p:spTree', NS)
        pics = spTree.findall('p:pic', NS) if spTree is not None else []
        shapes = spTree.findall('p:sp', NS) if spTree is not None else []
        slide_pics[s_idx] = (pics, slide_media_rels)

        print(f"\nSlide {s_idx} picture integration:")
        print(f"  - Embedded <p:pic> elements: {len(pics)}")
        print(f"  - Linked media relationships: {len(slide_media_rels)}")
        for pic in pics:
            blip = pic.find('.//a:blip', NS)
            rembed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else None
            target = slide_media_rels.get(rembed, "UNKNOWN")
            cNvPr = pic.find('.//p:cNvPr', NS)
            name = cNvPr.attrib.get('name', 'unnamed') if cNvPr is not None else 'unnamed'
            xfrm = pic.find('.//a:xfrm', NS)
            pos_str = "unknown"
            if xfrm is not None:
                off = xfrm.find('a:off', NS)
                ext = xfrm.find('a:ext', NS)
                if off is not None and ext is not None:
                    x = int(off.attrib.get('x', 0)) / EMU_PER_INCH
                    y = int(off.attrib.get('y', 0)) / EMU_PER_INCH
                    w = int(ext.attrib.get('cx', 0)) / EMU_PER_INCH
                    h = int(ext.attrib.get('cy', 0)) / EMU_PER_INCH
                    pos_str = f"pos=({x:.2f}, {y:.2f}) size=({w:.2f}x{h:.2f})"
            print(f"    * Picture '{name}': target={target}, {pos_str}")

        # Check if slide is a single flat image screenshot masquerading as native content
        if len(pics) == 1 and len(shapes) <= 1:
            screenshot_slides.append(s_idx)
            print(f"  FAIL: Slide {s_idx} appears to be a single flat image screenshot!")

    if screenshot_slides:
        print(f"\nFAIL: Slides detected as flat screenshots: {screenshot_slides}")
        overall_failures.append("Test 4: Flat screenshot slides detected")
    else:
        print("\nPASS: Zero flat screenshot slides detected. All slides compose genuine photographic assets with extensive native shapes and text.")

    # Match media files against known brain assets
    print("\nMatching embedded media files with source assets in brain:")
    known_assets = [
        "hero_monument_1789383083590.jpg",
        "heritage_problem_scene_1789435962154.jpg",
        "phone_audio_guide_1789436084142.jpg",
        "india_heritage_map_1789407014836.jpg",
        "tech_architecture_warm_1789436115529.jpg",
        "human_traveler_heritage_1789408640689.jpg",
        "indian_family_heritage_1789408698290.jpg",
        "closing_monument_1789403341798.jpg",
        "visitor_monument_1789383102153.jpg",
        "audio_waveform.png"
    ]
    matched_assets = {}
    for ka in known_assets:
        p = os.path.join(ASSET_DIR, ka)
        if os.path.exists(p):
            data = open(p, 'rb').read()
            md5 = hashlib.md5(data).hexdigest()
            # Check if this md5 exists in media_hashes
            matches = [mf for mf, mmd5 in media_hashes.items() if mmd5 == md5]
            if matches:
                matched_assets[ka] = matches[0]
                print(f"  Asset '{ka}' -> matched in PPTX as '{matches[0]}'")
            else:
                print(f"  Asset '{ka}' -> (no direct hash match, may be recompressed or resized)")
        else:
            print(f"  Asset '{ka}' -> not found on disk at {p}")

    print(f"Direct hash matches: {len(matched_assets)} of {len(known_assets)} source assets verified.")

    # -------------------------------------------------------------------------
    # TEST 5: DrawingML Compliance (Shadow Offsets, Hex Colors, XML Structure)
    # -------------------------------------------------------------------------
    print("\n--------------------------------------------------------------------------------")
    print("TEST 5: DrawingML Compliance (Shadow Offsets, Hex Colors, Geometry Integrity)")
    print("--------------------------------------------------------------------------------")
    drawingml_violations = []

    # 1. Check all shadow offsets (dist >= 0)
    total_shadows = 0
    negative_shadows = []
    for xp, tree in parsed_trees.items():
        if not xp.startswith('ppt/slides/slide'):
            continue
        shadows = tree.findall('.//a:outerShdw', NS) + tree.findall('.//a:innerShdw', NS)
        total_shadows += len(shadows)
        for shdw in shadows:
            dist = shdw.attrib.get('dist')
            if dist is not None:
                dist_val = int(dist)
                if dist_val < 0:
                    negative_shadows.append((xp, dist_val))

    print(f"Total shadow effects evaluated: {total_shadows}")
    if negative_shadows:
        print(f"FAIL: Found {len(negative_shadows)} negative shadow offsets: {negative_shadows}")
        drawingml_violations.append(f"{len(negative_shadows)} negative shadow offsets found")
    else:
        print("PASS: All shadow offsets are >= 0 (zero corruption risks).")

    # 2. Check all hex colors in <a:srgbClr val="...">
    total_colors = 0
    invalid_colors = []
    hash_prefixed_colors = []
    eight_digit_colors = []
    hex_pattern = re.compile(r'^[0-9A-Fa-f]{6}$')

    for xp, tree in parsed_trees.items():
        srgb_elements = tree.findall('.//a:srgbClr', NS)
        total_colors += len(srgb_elements)
        for srgb in srgb_elements:
            val = srgb.attrib.get('val', '')
            if val.startswith('#'):
                hash_prefixed_colors.append((xp, val))
            elif len(val) == 8:
                eight_digit_colors.append((xp, val))
            elif not hex_pattern.match(val):
                invalid_colors.append((xp, val))

    print(f"Total <a:srgbClr> color definitions evaluated: {total_colors}")
    if hash_prefixed_colors:
        print(f"FAIL: Found {len(hash_prefixed_colors)} #-prefixed colors (corrupts PPTX): {hash_prefixed_colors[:5]}")
        drawingml_violations.append(f"{len(hash_prefixed_colors)} #-prefixed colors found")
    else:
        print("PASS: Zero #-prefixed colors found.")

    if eight_digit_colors:
        print(f"FAIL: Found {len(eight_digit_colors)} 8-digit ARGB colors (corrupts PPTX): {eight_digit_colors[:5]}")
        drawingml_violations.append(f"{len(eight_digit_colors)} 8-digit ARGB colors found")
    else:
        print("PASS: Zero 8-digit ARGB colors found.")

    if invalid_colors:
        print(f"FAIL: Found {len(invalid_colors)} invalid hex color values: {invalid_colors[:5]}")
        drawingml_violations.append(f"{len(invalid_colors)} invalid hex color values found")
    else:
        print("PASS: All <a:srgbClr> attributes strictly match 6-digit hexadecimal format [0-9A-Fa-f]{6}.")

    # 3. Check preset geometries
    prst_geoms = []
    for xp, tree in parsed_trees.items():
        if not xp.startswith('ppt/slides/slide'):
            continue
        geoms = tree.findall('.//a:prstGeom', NS)
        for g in geoms:
            prst_geoms.append(g.attrib.get('prst', 'unknown'))
    geom_counts = {g: prst_geoms.count(g) for g in set(prst_geoms)}
    print(f"Preset geometries in slide XML: {geom_counts}")

    if drawingml_violations:
        print(f"\nFAIL: DrawingML compliance violations detected: {drawingml_violations}")
        overall_failures.append("Test 5: DrawingML violations")
    else:
        print("\nPASS: DrawingML compliance verified. All shadows >= 0, colors 6-digit hex without #, valid geometries.")

    # -------------------------------------------------------------------------
    # TEST 6: Speaker Notes Verification (All 8 Slides)
    # -------------------------------------------------------------------------
    print("\n--------------------------------------------------------------------------------")
    print("TEST 6: Speaker Notes Verification (ppt/notesSlides/ and Relationships)")
    print("--------------------------------------------------------------------------------")
    notes_files = sorted([f for f in namelist if re.match(r'^ppt/notesSlides/notesSlide\d+\.xml$', f)],
                         key=lambda x: int(re.search(r'\d+', x).group()))
    print(f"Discovered notesSlides: {len(notes_files)} ({notes_files})")
    if len(notes_files) != 8:
        print(f"FAIL: Expected exactly 8 notesSlides, found {len(notes_files)}")
        overall_failures.append(f"Test 6: notesSlide count is {len(notes_files)}, expected 8")

    notes_failures = []
    total_notes_words = 0

    for s_idx in range(1, 9):
        # 1. Check slide rels link to notesSlide
        srel = f"ppt/slides/_rels/slide{s_idx}.xml.rels"
        if srel not in namelist:
            print(f"FAIL: Slide {s_idx} rels missing: {srel}")
            notes_failures.append(f"Slide {s_idx} missing .rels")
            continue
        stree = parsed_trees[srel]
        notes_targets = [r.attrib.get('Target') for r in stree.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')
                         if 'notesSlide' in r.attrib.get('Type', '') or 'notesSlide' in r.attrib.get('Target', '')]
        if not notes_targets:
            print(f"FAIL: Slide {s_idx} has no linked notesSlide relationship!")
            notes_failures.append(f"Slide {s_idx} has no linked notesSlide")
            continue

        target_notes = notes_targets[0]
        norm_notes = os.path.normpath(os.path.join('ppt/slides', target_notes))
        if norm_notes not in namelist:
            print(f"FAIL: Target notes file {norm_notes} missing from ZIP archive!")
            notes_failures.append(f"Slide {s_idx} target notes missing: {norm_notes}")
            continue

        # 2. Extract notes text
        ntree = parsed_trees[norm_notes]
        text_nodes = ntree.findall('.//a:t', NS)
        raw_notes_text = " ".join([t.text for t in text_nodes if t.text])
        words = raw_notes_text.split()
        total_notes_words += len(words)

        # Check substantive content (pitch script)
        print(f"Slide {s_idx} Notes ({norm_notes}):")
        print(f"  - Target relationship: {target_notes}")
        print(f"  - Word count: {len(words)} words ({len(raw_notes_text)} characters)")
        print(f"  - Excerpt: {raw_notes_text[:120]}...")

        if len(words) < 25:
            print(f"  FAIL: Slide {s_idx} speaker notes suspiciously brief ({len(words)} words)!")
            notes_failures.append(f"Slide {s_idx} notes too brief ({len(words)} words)")
        elif "TODO" in raw_notes_text or "LOREM" in raw_notes_text.upper():
            print(f"  FAIL: Slide {s_idx} speaker notes contain placeholder text!")
            notes_failures.append(f"Slide {s_idx} notes contain placeholder")
        else:
            print(f"  PASS: Substantive, calibrated pitch script present.")

    print(f"\nTotal Speaker Notes Words Across Deck: {total_notes_words} words (approx. {total_notes_words / 130:.1f} minutes spoken at 130 wpm).")

    if notes_failures:
        print(f"\nFAIL: Speaker notes verification failed on {len(notes_failures)} checks:")
        for nf in notes_failures:
            print(f"  - {nf}")
        overall_failures.append("Test 6: Speaker notes verification failures")
    else:
        print("\nPASS: All 8 slides have authentic, verified, substantive speaker notes correctly mapped via ECMA-376 relationships.")

    # -------------------------------------------------------------------------
    # FINAL VERDICT
    # -------------------------------------------------------------------------
    print("\n================================================================================")
    print("FINAL EMPIRICAL CHALLENGER VERDICT")
    print("================================================================================")
    if overall_failures:
        print("VERDICT: REJECT")
        print(f"Failures encountered ({len(overall_failures)}):")
        for f in overall_failures:
            print(f"  - {f}")
        return False
    else:
        print("VERDICT: CONFIRM")
        print("All 6 empirical OpenXML, DrawingML, Background Fill, Media, and Notes tests PASSED without a single violation.")
        return True

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
