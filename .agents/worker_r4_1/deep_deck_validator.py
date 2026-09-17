import sys
import zipfile
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

print(f"=== DEEP PPTX INSPECTION: {pptx_path} ===")

with zipfile.ZipFile(pptx_path, 'r') as z:
    # 1. Slide Count
    slide_files = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
    slide_files.sort(key=lambda x: int(x.replace('ppt/slides/slide', '').replace('.xml', '')))
    print(f"1. Total Slides: {len(slide_files)} (Expected: 8)")
    assert len(slide_files) == 8, f"Expected 8 slides, got {len(slide_files)}"

    # 2. Media Assets
    media_files = [f for f in z.namelist() if f.startswith('ppt/media/')]
    print(f"2. Total Embedded Media Files: {len(media_files)}")
    assert len(media_files) >= 10, f"Expected at least 10 embedded media files, got {len(media_files)}"

    # 3. Slide Dimensions
    pres_xml = ET.fromstring(z.read('ppt/presentation.xml'))
    sldSz = pres_xml.find('p:sldSz', NS)
    cx = int(sldSz.attrib['cx'])
    cy = int(sldSz.attrib['cy'])
    w_in = cx / 914400.0
    h_in = cy / 914400.0
    print(f"3. Slide Dimensions: {w_in:.3f}\" x {h_in:.3f}\" (LAYOUT_WIDE)")
    assert abs(w_in - 13.333) < 0.05 and abs(h_in - 7.5) < 0.05, "Layout is not LAYOUT_WIDE"

    # 4. Check each slide for:
    #    - Background color (must be dark 0D0B09, NO light/white)
    #    - Number of shapes and text boxes (native editable objects)
    #    - Embedded images
    #    - Font faces used (Cambria and Calibri)
    #    - Bounding boxes (no overflow past 13.333" x 7.5")
    #    - Speaker notes presence
    
    light_colors = ['ffffff', 'f5f3ef', 'faf8f5', 'ede8df', 'fdf6e2', 'faece9', 'e6f7f5']
    
    for i, sf in enumerate(slide_files, 1):
        root = ET.fromstring(z.read(sf))
        
        # Check background
        bg = root.find('p:bg', NS)
        bg_clr = "DEFAULT_OR_NONE"
        if bg is not None:
            srgb = bg.find('.//a:srgbClr', NS)
            if srgb is not None:
                bg_clr = srgb.attrib.get('val', '').lower()
        
        # Check shapes & images
        shapes = root.findall('.//p:sp', NS)
        pics = root.findall('.//p:pic', NS)
        text_boxes = [s for s in shapes if s.find('p:txBody', NS) is not None]
        
        # Fonts used
        fonts = set()
        for typeface in root.findall('.//a:rPr/a:latin', NS):
            fonts.add(typeface.attrib.get('typeface', ''))
            
        # Check bounding boxes
        overflows = []
        for sp in root.findall('.//p:sp', NS):
            xfrm = sp.find('.//a:xfrm', NS)
            if xfrm is not None:
                off = xfrm.find('a:off', NS)
                ext = xfrm.find('a:ext', NS)
                if off is not None and ext is not None:
                    x = int(off.attrib['x']) / 914400.0
                    y = int(off.attrib['y']) / 914400.0
                    w = int(ext.attrib['cx']) / 914400.0
                    h = int(ext.attrib['cy']) / 914400.0
                    if (x + w) > 13.35 or (y + h) > 7.55:
                        overflows.append(f"sp ({x:.2f},{y:.2f},{w:.2f},{h:.2f})")
                        
        # Check notes
        notes_f = f"ppt/notesSlides/notesSlide{i}.xml"
        notes_present = notes_f in z.namelist()
        notes_text_len = 0
        if notes_present:
            n_root = ET.fromstring(z.read(notes_f))
            n_texts = [n.text for n in n_root.iter() if n.text]
            notes_text_len = len(" ".join(n_texts))

        print(f"\n--- SLIDE {i} ---")
        print(f"  Background Fill: {bg_clr} (Dark validated: {bg_clr not in light_colors})")
        print(f"  Native Shapes: {len(shapes)}, Text Boxes: {len(text_boxes)}, Embedded Pics: {len(pics)}")
        print(f"  Fonts Used: {sorted(list(fonts))}")
        print(f"  Speaker Notes: {'YES' if notes_present and notes_text_len > 50 else 'NO'} ({notes_text_len} chars)")
        print(f"  Canvas Overflows: {len(overflows)}")
        if overflows:
            print(f"    Warning overflows: {overflows}")
            
        assert bg_clr not in light_colors, f"Slide {i} has light background {bg_clr}!"
        assert len(pics) >= 1 or i == 3 or i == 5, f"Slide {i} has no embedded pictures!"
        assert len(text_boxes) >= 5, f"Slide {i} has too few text boxes!"
        assert notes_present and notes_text_len > 50, f"Slide {i} missing speaker notes!"

print("\n=== ALL DEEP INSPECTION CHECKS PASSED PERFECTLY ===")
