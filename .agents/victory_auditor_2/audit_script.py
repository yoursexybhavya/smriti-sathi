#!/usr/bin/env python3
import sys
import zipfile
import re
import xml.etree.ElementTree as ET
from pathlib import Path

pptx_path = Path("/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx")
if not pptx_path.exists():
    print(f"ERROR: {pptx_path} does not exist!")
    sys.exit(1)

z = zipfile.ZipFile(pptx_path)

# Namespaces
NAMESPACES = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

# 1. Slide Count
slide_files = sorted([f for f in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml', f)], key=lambda x: int(re.search(r'\d+', x).group()))
print(f"Total slides found: {len(slide_files)}")
for s in slide_files:
    print(f"  - {s}")

# Presentation dimensions
pres_xml = ET.fromstring(z.read('ppt/presentation.xml'))
sldSz = pres_xml.find('.//p:sldSz', NAMESPACES)
cx = int(sldSz.attrib['cx']) / 914400.0 if sldSz is not None else 0
cy = int(sldSz.attrib['cy']) / 914400.0 if sldSz is not None else 0
print(f"Canvas size: {cx:.3f}\" x {cy:.3f}\" (LAYOUT_WIDE expected ~13.333\" x 7.500\")")

print("\n" + "="*50)
print("PHASE B: CHEATING & FACADE DETECTION")
print("="*50)

# Check each slide
slides_data = []

for idx, sf in enumerate(slide_files, 1):
    tree = ET.fromstring(z.read(sf))
    shapes = tree.findall('.//p:sp', NAMESPACES)
    pics = tree.findall('.//p:pic', NAMESPACES)
    graphicFrames = tree.findall('.//p:graphicFrame', NAMESPACES)
    
    # Extract all text paragraphs and runs
    text_boxes = []
    all_text = []
    cambria_headlines = []
    gold_headlines = []
    section_labels = []
    gps_coords = []
    dashed_lines = []
    underlines = []
    margin_violations = []
    
    # Check background fill
    bg = tree.find('.//p:bg', NAMESPACES)
    bg_color = None
    if bg is not None:
        srgb = bg.find('.//a:srgbClr', NAMESPACES)
        if srgb is not None:
            bg_color = srgb.attrib.get('val')
    
    # Analyze shapes
    for sp in shapes:
        spPr = sp.find('p:spPr', NAMESPACES)
        txBody = sp.find('p:txBody', NAMESPACES)
        
        # Check coordinates and bounds
        xfrm = spPr.find('a:xfrm', NAMESPACES) if spPr is not None else None
        x, y, w, h = None, None, None, None
        if xfrm is not None:
            off = xfrm.find('a:off', NAMESPACES)
            ext = xfrm.find('a:ext', NAMESPACES)
            if off is not None and ext is not None:
                x = int(off.attrib.get('x', 0)) / 914400.0
                y = int(off.attrib.get('y', 0)) / 914400.0
                w = int(ext.attrib.get('cx', 0)) / 914400.0
                h = int(ext.attrib.get('cy', 0)) / 914400.0
        
        # Check text
        if txBody is not None:
            paras = txBody.findall('a:p', NAMESPACES)
            for p in paras:
                p_text = "".join([t.text for t in p.findall('.//a:t', NAMESPACES) if t.text])
                if p_text.strip():
                    all_text.append(p_text.strip())
                    
                    # Check for section label format (e.g., "02 — THE PROBLEM" or "01 — COVER")
                    if re.match(r'^\d{2}\s*[-—–]\s*[A-Z\s&]+$', p_text.strip()):
                        section_labels.append(p_text.strip())
                    
                    # Check for GPS coordinates
                    if '° N' in p_text or '° E' in p_text or 'JAIPUR' in p_text or 'AMER' in p_text:
                        gps_coords.append(p_text.strip())
                    
                    # Check font and color
                    for r in p.findall('a:r', NAMESPACES):
                        rPr = r.find('a:rPr', NAMESPACES)
                        if rPr is not None:
                            latin = rPr.find('a:latin', NAMESPACES)
                            font_name = latin.attrib.get('typeface') if latin is not None else ""
                            sz = int(rPr.attrib.get('sz', 0)) / 100.0 if 'sz' in rPr.attrib else 0
                            srgb = rPr.find('.//a:srgbClr', NAMESPACES)
                            color_val = srgb.attrib.get('val') if srgb is not None else ""
                            
                            r_text = "".join([t.text for t in r.findall('a:t', NAMESPACES) if t.text])
                            if 'Cambria' in font_name and sz >= 24:
                                cambria_headlines.append((r_text, sz, color_val))
                                if color_val.upper() in ['C69214', 'D4A856']:
                                    gold_headlines.append((r_text, color_val))
        
        # Check if line or dashed line
        if spPr is not None:
            ln = spPr.find('a:ln', NAMESPACES)
            if ln is not None:
                custDash = ln.find('a:custDash', NAMESPACES)
                prstDash = ln.find('a:prstDash', NAMESPACES)
                dash_val = prstDash.attrib.get('val') if prstDash is not None else None
                if custDash is not None or (dash_val and dash_val != 'solid'):
                    dashed_lines.append((x, y, w, h, dash_val))
        
        # Check margin compliance (excluding full-slide background cards/shapes at x=0, y=0, w>=13)
        if x is not None and y is not None and w is not None and h is not None:
            is_full_bg = (x == 0 and y == 0 and w >= 13.0)
            is_letterbox_bar = (x == 0 and (y == 0 or y >= 7.0))
            if not is_full_bg and not is_letterbox_bar:
                # Margin boundaries: left >= 0.5, top >= 0.5, right <= 12.833, bottom <= 7.000
                # Allow tolerance of 0.05"
                if x < 0.45 or y < 0.45 or (x + w) > 12.88 or (y + h) > 7.05:
                    margin_violations.append((sp.attrib.get('id', 'sp'), x, y, w, h))

    # Check pictures
    pic_info = []
    for pic in pics:
        spPr = pic.find('p:spPr', NAMESPACES)
        xfrm = spPr.find('a:xfrm', NAMESPACES) if spPr is not None else None
        x, y, w, h = None, None, None, None
        if xfrm is not None:
            off = xfrm.find('a:off', NAMESPACES)
            ext = xfrm.find('a:ext', NAMESPACES)
            if off is not None and ext is not None:
                x = int(off.attrib.get('x', 0)) / 914400.0
                y = int(off.attrib.get('y', 0)) / 914400.0
                w = int(ext.attrib.get('cx', 0)) / 914400.0
                h = int(ext.attrib.get('cy', 0)) / 914400.0
        
        # Rel ID
        blip = pic.find('.//a:blip', NAMESPACES)
        rId = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else None
        pic_info.append({'x': x, 'y': y, 'w': w, 'h': h, 'rId': rId})

    # Notes slide
    notes_file = f"ppt/notesSlides/notesSlide{idx}.xml"
    notes_text = ""
    if notes_file in z.namelist():
        ntree = ET.fromstring(z.read(notes_file))
        n_paras = ntree.findall('.//a:p', NAMESPACES)
        notes_text = "\n".join(["".join([t.text for t in p.findall('.//a:t', NAMESPACES) if t.text]) for p in n_paras]).strip()
    
    slides_data.append({
        'slide_num': idx,
        'shape_count': len(shapes),
        'pic_count': len(pics),
        'graphicFrame_count': len(graphicFrames),
        'bg_color': bg_color,
        'text_count': len(all_text),
        'section_labels': section_labels,
        'gps_coords': gps_coords,
        'cambria_headlines': cambria_headlines,
        'gold_headlines': gold_headlines,
        'dashed_lines': dashed_lines,
        'margin_violations': margin_violations,
        'pics': pic_info,
        'notes_text': notes_text,
        'all_text': all_text
    })

print(f"Analyzed {len(slides_data)} slides successfully.")
for s in slides_data:
    print(f"\nSlide {s['slide_num']}:")
    print(f"  Native Shapes: {s['shape_count']}, Native Pics: {s['pic_count']}, GraphicFrames: {s['graphicFrame_count']}")
    print(f"  Bg Color: {s['bg_color']}")
    print(f"  Section Labels: {s['section_labels']}")
    print(f"  GPS Coords: {s['gps_coords']}")
    print(f"  Cambria Headlines: {len(s['cambria_headlines'])} (Gold lines: {len(s['gold_headlines'])})")
    print(f"  Dashed Lines: {len(s['dashed_lines'])}")
    print(f"  Margin Violations: {len(s['margin_violations'])}")
    print(f"  Has Speaker Notes: {bool(s['notes_text'])} (Length: {len(s['notes_text'])} chars)")
    print(f"  Sample Text: {s['all_text'][:3]}")

print("\n" + "="*50)
print("JUDGING CRITERIA VERIFICATION")
print("="*50)

all_combined_text = " ".join([" ".join(s['all_text']) for s in slides_data])
all_combined_notes = " ".join([s['notes_text'] for s in slides_data])
full_corpus = all_combined_text + " " + all_combined_notes

criteria = [
    ("Innovation & Originality", ["Innovation", "Originality"]),
    ("Feasibility & Technical Viability", ["Feasibility", "Technical Viability", "Technical"]),
    ("Impact & Social Relevance", ["Impact", "Social Relevance"]),
    ("Presentation & Clarity", ["Presentation", "Clarity"]),
    ("Business Model & Scalability", ["Business Model", "Scalability"])
]

for name, keywords in criteria:
    found_slide = [s['slide_num'] for s in slides_data if any(kw.lower() in " ".join(s['all_text']).lower() for kw in keywords)]
    found_notes = [s['slide_num'] for s in slides_data if any(kw.lower() in s['notes_text'].lower() for kw in keywords)]
    print(f"Criterion '{name}':")
    print(f"  Found in slide text on slides: {found_slide}")
    print(f"  Found in speaker notes on slides: {found_notes}")

print("\n" + "="*50)
print("KEY PHRASES VERIFICATION")
print("="*50)
key_phrases = [
    "3,693",
    "ASI",
    "Herodotus",
    "living stone a voice",
    "Web Speech",
    "Mapbox"
]
for kp in key_phrases:
    found = kp.lower() in full_corpus.lower()
    print(f"  Phrase '{kp}': {'FOUND' if found else 'MISSING'}")

