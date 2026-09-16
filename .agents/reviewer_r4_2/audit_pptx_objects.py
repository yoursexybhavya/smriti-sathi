import zipfile
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

print("=" * 70)
print("DEEP ADVERSARIAL AUDIT: OBJECT INTEGRITY & SLIDE ARCHITECTURE")
print("=" * 70)

with zipfile.ZipFile(pptx_path, 'r') as z:
    for slide_idx in range(1, 9):
        slide_xml = f"ppt/slides/slide{slide_idx}.xml"
        root = ET.fromstring(z.read(slide_xml))
        
        shapes = root.findall('.//p:sp', NS)
        pics = root.findall('.//p:pic', NS)
        text_nodes = [elem.text for elem in root.iter() if elem.text and elem.text.strip()]
        
        # Check fonts used
        fonts = set()
        for typeface in root.findall('.//a:rPr/a:latin', NS):
            fonts.add(typeface.attrib.get('typeface'))
            
        # Check background fill
        bg = root.find('.//p:bg', NS)
        bg_color = None
        if bg is not None:
            srgb = bg.find('.//a:srgbClr', NS)
            if srgb is not None:
                bg_color = srgb.attrib.get('val')
                
        # Check for rasterized full slide facade
        # A rasterized facade would have 1 picture covering the entire 13.333 x 7.5 canvas with few or 0 editable shapes
        is_facade = False
        if len(pics) == 1 and len(shapes) < 5:
            is_facade = True
            
        # Check bounding boxes for off-canvas elements
        # pptxgenjs uses EMU (English Metric Units): 1 inch = 914400 EMUs
        # 13.333 inches = 12192000 EMUs, 7.5 inches = 6858000 EMUs
        canvas_w_emu = int(13.333333 * 914400)
        canvas_h_emu = int(7.5 * 914400)
        
        overflows = 0
        for sp in root.findall('.//p:sp', NS):
            xfrm = sp.find('.//p:spPr/a:xfrm', NS)
            if xfrm is not None:
                off = xfrm.find('a:off', NS)
                ext = xfrm.find('a:ext', NS)
                if off is not None and ext is not None:
                    x = int(off.attrib.get('x', 0))
                    y = int(off.attrib.get('y', 0))
                    cx = int(ext.attrib.get('cx', 0))
                    cy = int(ext.attrib.get('cy', 0))
                    # Allow slight tolerance (0.1")
                    if (x + cx) > canvas_w_emu + 91440 or (y + cy) > canvas_h_emu + 91440:
                        overflows += 1
                        
        print(f"Slide {slide_idx}:")
        print(f"  - Background Color: {bg_color} (Expected: 0D0B09)")
        print(f"  - Native Shapes (<p:sp>): {len(shapes)}")
        print(f"  - Embedded Pictures (<p:pic>): {len(pics)}")
        print(f"  - Text Nodes: {len(text_nodes)}")
        print(f"  - Fonts detected: {sorted(list(fonts))}")
        print(f"  - Rasterized Facade Detected: {'YES (VIOLATION)' if is_facade else 'NO (Native Objects)'}")
        print(f"  - Canvas Overflows (> 13.33\" x 7.5\"): {overflows}")
        
        assert bg_color == '0D0B09', f"Slide {slide_idx} background is not 0D0B09!"
        assert not is_facade, f"Slide {slide_idx} appears to be a rasterized facade!"
        assert len(shapes) >= 15, f"Slide {slide_idx} has too few native shapes ({len(shapes)})!"
        assert len(text_nodes) >= 15, f"Slide {slide_idx} has too few text nodes ({len(text_nodes)})!"
        assert overflows == 0, f"Slide {slide_idx} has {overflows} overflowing elements!"
        
print("\nALL ADVERSARIAL CHECKS PASSED: ZERO INTEGRITY VIOLATIONS DETECTED.")
