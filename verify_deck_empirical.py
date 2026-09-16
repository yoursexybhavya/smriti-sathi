#!/usr/bin/env python3
import sys
import zipfile
import re
from xml.etree import ElementTree as ET

PPTX_PATH = "Herodotus_Pitch_Presentation.pptx"
EMU_PER_INCH = 914400.0

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def analyze_presentation():
    zf = zipfile.ZipFile(PPTX_PATH, 'r')
    file_list = zf.namelist()
    
    # Identify slide xml files
    slide_files = sorted(
        [f for f in file_list if re.match(r'^ppt/slides/slide\d+\.xml$', f)],
        key=lambda x: int(re.search(r'\d+', x).group())
    )
    
    print(f"=== Presentation Analysis: {PPTX_PATH} ===")
    print(f"Total Slides Found: {len(slide_files)}\n")
    
    slide_results = []
    all_passed = True
    
    for slide_idx, slide_file in enumerate(slide_files, start=1):
        print(f"--------------------------------------------------")
        print(f"Slide {slide_idx}: {slide_file}")
        
        slide_xml = zf.read(slide_file)
        root = ET.fromstring(slide_xml)
        
        # Relationships for this slide to inspect images
        rel_file = f"ppt/slides/_rels/{slide_file.split('/')[-1]}.rels"
        rels = {}
        if rel_file in file_list:
            rel_xml = zf.read(rel_file)
            rel_root = ET.fromstring(rel_xml)
            for r in rel_root:
                r_id = r.attrib.get('Id')
                target = r.attrib.get('Target')
                r_type = r.attrib.get('Type')
                rels[r_id] = {'target': target, 'type': r_type}
        
        spTree = root.find('.//p:spTree', NS)
        if spTree is None:
            print("ERROR: No spTree found in slide!")
            all_passed = False
            continue
            
        elements = list(spTree)
        print(f"Total elements in spTree: {len(elements)}")
        
        # Collect element info
        parsed_elements = []
        text_boxes = []
        pictures = []
        connectors = []
        thin_shapes = []
        margin_violations = []
        
        first_textbox_idx = None
        last_background_idx = None
        
        for idx, el in enumerate(elements):
            tag = el.tag.split('}')[-1]
            if tag in ('nvGrpSpPr', 'grpSpPr'):
                continue
                
            # Name and shape properties
            cNvPr = el.find('.//p:cNvPr', NS)
            name = cNvPr.attrib.get('name', 'unnamed') if cNvPr is not None else 'unnamed'
            el_id = cNvPr.attrib.get('id', str(idx)) if cNvPr is not None else str(idx)
            
            # Position & Extent
            xfrm = el.find('.//a:xfrm', NS)
            x_in = y_in = w_in = h_in = 0.0
            if xfrm is not None:
                off = xfrm.find('a:off', NS)
                ext = xfrm.find('a:ext', NS)
                if off is not None:
                    x_in = int(off.attrib.get('x', 0)) / EMU_PER_INCH
                    y_in = int(off.attrib.get('y', 0)) / EMU_PER_INCH
                if ext is not None:
                    w_in = int(ext.attrib.get('cx', 0)) / EMU_PER_INCH
                    h_in = int(ext.attrib.get('cy', 0)) / EMU_PER_INCH
            
            # Check text body
            txBody = el.find('.//p:txBody', NS)
            has_text = False
            text_content = ""
            if txBody is not None:
                text_runs = [t.text for t in txBody.findall('.//a:t', NS) if t.text]
                if text_runs:
                    has_text = True
                    text_content = " ".join(text_runs)
            
            # Check picture blip
            blip = el.find('.//a:blip', NS)
            blip_target = ""
            if blip is not None:
                r_embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                if r_embed and r_embed in rels:
                    blip_target = rels[r_embed]['target']
            
            # Categorize background / overlay vs content element:
            # Full slide background image, full slide overlay, or vertical vignette overlay (y=0, h=7.5)
            is_bg_image = (tag == 'pic' and abs(x_in - 0.0) < 0.01 and abs(y_in - 0.0) < 0.01 and 
                           abs(w_in - 13.333) < 0.1 and abs(h_in - 7.5) < 0.1)
            is_bg_overlay = (tag == 'sp' and not has_text and abs(y_in - 0.0) < 0.01 and abs(h_in - 7.5) < 0.1)
            is_bleed = is_bg_image or is_bg_overlay
            
            elem_info = {
                'idx': idx,
                'tag': tag,
                'id': el_id,
                'name': name,
                'x': x_in,
                'y': y_in,
                'w': w_in,
                'h': h_in,
                'right': x_in + w_in,
                'bottom': y_in + h_in,
                'has_text': has_text,
                'text': text_content[:50] + ("..." if len(text_content) > 50 else ""),
                'blip': blip_target,
                'is_bleed': is_bleed
            }
            parsed_elements.append(elem_info)
            
            if tag == 'sp' and has_text:
                text_boxes.append(elem_info)
                if first_textbox_idx is None:
                    first_textbox_idx = idx
            
            if tag == 'pic':
                pictures.append(elem_info)
            
            if tag == 'cxnSp':
                connectors.append(elem_info)
                
            if is_bleed:
                last_background_idx = idx
            
            # Check for thin decorative rectangles (<0.08" thick)
            if tag == 'sp' and not has_text:
                if (0 < w_in < 0.08 and h_in > 0.5) or (0 < h_in < 0.08 and w_in > 0.5):
                    thin_shapes.append(elem_info)
            
            # Margin checks (only for content elements, NOT full/half-bleed backgrounds)
            if not is_bleed:
                # Check min x, y >= 0.5", max right <= 12.833", max bottom <= 7.0"
                viol = []
                if x_in < 0.499:
                    viol.append(f"min_x ({x_in:.3f}\" < 0.5\")")
                if y_in < 0.499:
                    viol.append(f"min_y ({y_in:.3f}\" < 0.5\")")
                if (x_in + w_in) > 12.840:
                    viol.append(f"max_right ({(x_in+w_in):.3f}\" > 12.833\")")
                if (y_in + h_in) > 7.010:
                    viol.append(f"max_bottom ({(y_in+h_in):.3f}\" > 7.0\")")
                if viol:
                    elem_info['violations'] = viol
                    margin_violations.append(elem_info)

        print(f"  Native Text Boxes (<p:sp><p:txBody>): {len(text_boxes)}")
        print(f"  Embedded Pictures (<p:pic>): {len(pictures)}")
        for pic in pictures:
            print(f"    - Pic '{pic['name']}': target={pic['blip']}, pos=({pic['x']:.2f}, {pic['y']:.2f}), size=({pic['w']:.2f} x {pic['h']:.2f})")
        print(f"  Connector Shapes (<p:cxnSp>): {len(connectors)}")
        print(f"  Thin Decorative Shapes (<0.08\"): {len(thin_shapes)}")
        
        # Z-order check
        z_order_ok = True
        if last_background_idx is not None and first_textbox_idx is not None:
            if last_background_idx > first_textbox_idx:
                print(f"  FAIL: Z-order violation! Background element at index {last_background_idx} appears AFTER first text box at index {first_textbox_idx}!")
                z_order_ok = False
                all_passed = False
            else:
                print(f"  PASS: Z-order verified. Bleed backgrounds/overlays (up to index {last_background_idx}) precede text boxes (starting index {first_textbox_idx}).")
        else:
            print("  PASS: Z-order normal (no background bleed conflict).")
            
        # Check margin violations
        if margin_violations:
            print(f"  FAIL: Found {len(margin_violations)} margin violations on content elements:")
            for mv in margin_violations:
                print(f"    - {mv['tag']} '{mv['name']}' [id={mv['id']}]: x={mv['x']:.3f}, y={mv['y']:.3f}, w={mv['w']:.3f}, h={mv['h']:.3f}, right={mv['right']:.3f}, bottom={mv['bottom']:.3f} | {', '.join(mv['violations'])}")
            all_passed = False
        else:
            print("  PASS: All content elements satisfy margins (x >= 0.5\", y >= 0.5\", x+w <= 12.833\", y+h <= 7.0\").")
            
        # Check decorative lines/stripes
        if connectors:
            print(f"  FAIL: Found {len(connectors)} connector lines (<p:cxnSp>)!")
            all_passed = False
        else:
            print("  PASS: No connector lines (<p:cxnSp>) found.")
            
        if thin_shapes:
            print(f"  FAIL: Found {len(thin_shapes)} thin decorative shapes (<0.08\" thick)!")
            for ts in thin_shapes:
                print(f"    - Shape '{ts['name']}': w={ts['w']:.3f}\", h={ts['h']:.3f}\"")
            all_passed = False
        else:
            print("  PASS: No thin decorative shapes (<0.08\" thick) found.")
            
        # Check speaker notes
        notes_file = f"ppt/notesSlides/notesSlide{slide_idx}.xml"
        has_notes = False
        notes_preview = ""
        if notes_file in file_list:
            notes_xml = zf.read(notes_file)
            notes_root = ET.fromstring(notes_xml)
            note_texts = [t.text for t in notes_root.findall('.//a:t', NS) if t.text]
            full_notes = " ".join(note_texts)
            if len(full_notes) > 20:
                has_notes = True
                notes_preview = full_notes[:80]
        print(f"  Speaker Notes: {'PRESENT' if has_notes else 'MISSING'} ({notes_preview}...)")
        if not has_notes:
            all_passed = False

    print("\n==================================================")
    print(f"OVERALL VERDICT: {'APPROVE' if all_passed else 'REJECT'}")
    print("==================================================")

if __name__ == '__main__':
    analyze_presentation()
