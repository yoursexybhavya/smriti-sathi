import zipfile
import xml.etree.ElementTree as ET
import os
import sys
import hashlib

pptx_path = "Herodotus_Pitch_Presentation.pptx"

if not os.path.exists(pptx_path):
    print(f"ERROR: {pptx_path} does not exist!")
    sys.exit(1)

with open(pptx_path, "rb") as f:
    data = f.read()
    sha256 = hashlib.sha256(data).hexdigest()
    file_size = len(data)

print(f"=== PPTX PACKAGE INTEGRITY ===")
print(f"File: {pptx_path}")
print(f"Size: {file_size} bytes ({file_size / (1024*1024):.2f} MB)")
print(f"SHA256: {sha256}")

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

zf = zipfile.ZipFile(pptx_path, 'r')
namelist = zf.namelist()

slides = [n for n in namelist if n.startswith("ppt/slides/slide") and n.endswith(".xml")]
slides.sort(key=lambda s: int(s.replace("ppt/slides/slide", "").replace(".xml", "")))

notes = [n for n in namelist if n.startswith("ppt/notesSlides/notesSlide") and n.endswith(".xml")]
notes.sort(key=lambda s: int(s.replace("ppt/notesSlides/notesSlide", "").replace(".xml", "")))

media = [n for n in namelist if n.startswith("ppt/media/")]

print(f"Total Slides: {len(slides)}")
print(f"Total Notes Slides: {len(notes)}")
print(f"Total Media Files: {len(media)}")

# Check presentation dimensions
pres_xml = ET.fromstring(zf.read("ppt/presentation.xml"))
sldSz = pres_xml.find('.//p:sldSz', NS)
cx = int(sldSz.attrib.get('cx', 0))
cy = int(sldSz.attrib.get('cy', 0))
w_in = cx / 914400.0
h_in = cy / 914400.0
print(f"Slide Dimensions: {w_in:.3f}\" x {h_in:.3f}\" (LAYOUT_WIDE={w_in > 13.0 and h_in > 7.0})")

slide_details = []
all_fonts = set()
judging_criteria = {
    "Innovation & Originality": False,
    "Feasibility & Technical Viability": False,
    "Impact & Social Relevance": False,
    "Presentation & Clarity": False,
    "Business Model & Scalability": False
}

for idx, slide_path in enumerate(slides, 1):
    slide_xml_str = zf.read(slide_path)
    root = ET.fromstring(slide_xml_str)
    
    # 1. Background check
    bg = root.find('.//p:bg', NS)
    bg_color = None
    if bg is not None:
        srgb = bg.find('.//a:srgbClr', NS)
        if srgb is not None:
            bg_color = srgb.attrib.get('val')
    
    # 2. Shapes & Text Boxes
    sp_list = root.findall('.//p:sp', NS)
    pic_list = root.findall('.//p:pic', NS)
    cxn_list = root.findall('.//p:cxnSp', NS)
    grp_list = root.findall('.//p:grpSp', NS)
    
    # Extract text and fonts
    texts = []
    slide_fonts = set()
    for sp in sp_list:
        txBody = sp.find('.//p:txBody', NS)
        if txBody is not None:
            sp_text = []
            for p in txBody.findall('.//a:p', NS):
                para_text = "".join([t.text or "" for t in p.findall('.//a:t', NS)])
                if para_text.strip():
                    sp_text.append(para_text.strip())
                for rPr in p.findall('.//a:rPr', NS):
                    latin = rPr.find('.//a:latin', NS)
                    if latin is not None and 'typeface' in latin.attrib:
                        slide_fonts.add(latin.attrib['typeface'])
                        all_fonts.add(latin.attrib['typeface'])
            if sp_text:
                texts.append(" \n ".join(sp_text))
                
    full_slide_text = "\n".join(texts)
    
    # 3. Pictures check
    pic_info = []
    for pic in pic_list:
        spPr = pic.find('.//p:spPr', NS)
        xfrm = spPr.find('.//a:xfrm', NS) if spPr is not None else None
        if xfrm is not None:
            off = xfrm.find('.//a:off', NS)
            ext = xfrm.find('.//a:ext', NS)
            x = int(off.attrib.get('x', 0)) / 914400.0 if off is not None else 0
            y = int(off.attrib.get('y', 0)) / 914400.0 if off is not None else 0
            w = int(ext.attrib.get('cx', 0)) / 914400.0 if ext is not None else 0
            h = int(ext.attrib.get('cy', 0)) / 914400.0 if ext is not None else 0
            blip = pic.find('.//a:blip', NS)
            rEmbed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else None
            pic_info.append({'x': round(x, 2), 'y': round(y, 2), 'w': round(w, 2), 'h': round(h, 2), 'rel': rEmbed})
            
    # 4. Speaker Notes check
    notes_text = ""
    notes_file = f"ppt/notesSlides/notesSlide{idx}.xml"
    if notes_file in namelist:
        n_xml = ET.fromstring(zf.read(notes_file))
        n_sp_list = n_xml.findall('.//p:sp', NS)
        n_texts = []
        for n_sp in n_sp_list:
            txBody = n_sp.find('.//p:txBody', NS)
            if txBody is not None:
                for p in txBody.findall('.//a:p', NS):
                    t = "".join([el.text or "" for el in p.findall('.//a:t', NS)])
                    if t.strip() and not t.strip().isdigit() and "Herodotus" not in t[:15]: # skip page num / header
                        n_texts.append(t.strip())
        notes_text = " ".join(n_texts)
        
    combined_content = full_slide_text + "\n" + notes_text
    for crit in judging_criteria:
        if crit.lower() in combined_content.lower():
            judging_criteria[crit] = True
            
    slide_details.append({
        'slide_num': idx,
        'bg_color': bg_color,
        'shapes_count': len(sp_list),
        'text_boxes_count': len(texts),
        'pics_count': len(pic_list),
        'pics_info': pic_info,
        'cxn_count': len(cxn_list),
        'fonts': list(slide_fonts),
        'text_sample': texts[:3] if texts else [],
        'notes_char_count': len(notes_text),
        'notes_sample': notes_text[:120] + "..." if len(notes_text) > 120 else notes_text
    })

print("\n=== SLIDE-BY-SLIDE FORENSIC ANALYSIS ===")
for s in slide_details:
    print(f"\n--- SLIDE {s['slide_num']} ---")
    print(f"Background Color: {s['bg_color']} (Expected: 0D0B09)")
    print(f"Native Shapes: {s['shapes_count']} | Text Blocks: {s['text_boxes_count']} | Pics: {s['pics_count']} | Connectors: {s['cxn_count']}")
    print(f"Fonts Used: {s['fonts']}")
    print(f"Pictures details: {s['pics_info']}")
    print(f"Speaker Notes length: {s['notes_char_count']} chars")
    print(f"Speaker Notes sample: {s['notes_sample']}")
    print(f"Text snippets (first 2): {s['text_sample'][:2]}")

print("\n=== JUDGING CRITERIA COVERAGE ===")
for crit, covered in judging_criteria.items():
    print(f"Criteria: '{crit}' -> {'PASSED' if covered else 'MISSING'}")

print(f"\n=== GLOBAL FONTS DETECTED ===")
print(list(all_fonts))
