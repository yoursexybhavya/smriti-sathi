import os
import sys
import hashlib
import glob
import re
import xml.etree.ElementTree as ET

BASE_DIR = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz"
BRAIN_DIR = "/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48"
PPTX_PATH = os.path.join(BASE_DIR, "Herodotus_Pitch_Presentation.pptx")
GEN_DECK_JS = os.path.join(BASE_DIR, "generate_deck.js")
UNPACKED_DIR = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/auditor_5_1/unpacked"

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

print("=" * 80)
print("AUDIT CHECK 1: CODEBASE ANALYSIS OF generate_deck.js")
print("=" * 80)

with open(GEN_DECK_JS, "r", encoding="utf-8") as f:
    js_code = f.read()

total_lines = len(js_code.splitlines())
print(f"Total lines of code in generate_deck.js: {total_lines}")

# Check for procedural pptxgenjs calls
pptx_calls = {
    "pres.addSlide": len(re.findall(r'pres\.addSlide\(', js_code)),
    "slide.addText": len(re.findall(r'slide\.addText\(', js_code)),
    "slide.addShape": len(re.findall(r'slide\.addShape\(', js_code)),
    "slide.addImage": len(re.findall(r'slide\.addImage\(', js_code)),
    "slide.addNotes": len(re.findall(r'slide\.addNotes\(', js_code)),
    "addCard helper": len(re.findall(r'addCard\(', js_code)),
    "addCinematicBars": len(re.findall(r'addCinematicBars\(', js_code)),
    "addStandardHeader": len(re.findall(r'addStandardHeader\(', js_code)),
    "addTimelineTrack": len(re.findall(r'addTimelineTrack\(', js_code)),
}
for k, v in pptx_calls.items():
    print(f"  {k}: {v}")

# Suspicious keyword check
print("\nScanning for suspicious patterns (reference screenshots, mocks, dummy code):")
suspicious_terms = [
    "reference_slide", "mock", "dummy", "fake", "bypass",
    "TODO", "FIXME", "NotImplemented", "return true", "process.exit(0)"
]
for term in suspicious_terms:
    matches = re.findall(rf'\b{re.escape(term)}\b', js_code, re.IGNORECASE)
    print(f"  Term '{term}': {len(matches)} occurrences")
    if matches and term in ["reference_slide", "mock", "dummy", "fake"]:
        for i, line in enumerate(js_code.splitlines(), 1):
            if re.search(rf'\b{re.escape(term)}\b', line, re.IGNORECASE):
                print(f"    Line {i}: {line.strip()[:100]}")

print("\n" + "=" * 80)
print("AUDIT CHECK 2: MEDIA ASSET FORENSIC AUDIT (SHA-256 HASH VERIFICATION)")
print("=" * 80)

# Hash brain directory assets
brain_hashes = {}
for root, _, files in os.walk(BRAIN_DIR):
    for f in files:
        if f.startswith('.'):
            continue
        p = os.path.join(root, f)
        if os.path.isfile(p):
            h = sha256_file(p)
            brain_hashes[h] = p

print(f"Indexed {len(brain_hashes)} authoritative brain assets.")

# Hash reference screenshots
ref_hashes = {}
for ref_p in glob.glob(os.path.join(BASE_DIR, "reference_slide*.png")):
    h = sha256_file(ref_p)
    ref_hashes[h] = os.path.basename(ref_p)
    print(f"Reference Screenshot {os.path.basename(ref_p)}: SHA-256 = {h}")

# Hash ppt/media/ assets
media_dir = os.path.join(UNPACKED_DIR, "ppt", "media")
media_files = sorted(glob.glob(os.path.join(media_dir, "*")))
print(f"\nFound {len(media_files)} embedded files in ppt/media/:")

all_media_clean = True
for mf in media_files:
    m_name = os.path.basename(mf)
    m_size = os.path.getsize(mf)
    m_hash = sha256_file(mf)
    
    # Check if matches reference screenshots
    if m_hash in ref_hashes:
        print(f"  [CRITICAL VIOLATION] {m_name} matches reference screenshot {ref_hashes[m_hash]}!")
        all_media_clean = False
    elif m_hash in brain_hashes:
        brain_src = os.path.basename(brain_hashes[m_hash])
        print(f"  [MATCH AUTHENTIC] {m_name} ({m_size} bytes): matches brain asset '{brain_src}'")
        print(f"    SHA-256: {m_hash}")
    else:
        print(f"  [UNKNOWN ASSET] {m_name} ({m_size} bytes): not found in brain directory")
        print(f"    SHA-256: {m_hash}")
        all_media_clean = False

print("\n" + "=" * 80)
print("AUDIT CHECK 3: OPENXML PRESENTATIONML DEEP AUDIT")
print("=" * 80)

# Namespaces
NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

# Presentation properties
pres_xml_path = os.path.join(UNPACKED_DIR, "ppt", "presentation.xml")
pres_tree = ET.parse(pres_xml_path)
pres_root = pres_tree.getroot()

sldSz = pres_root.find('.//p:sldSz', NS)
if sldSz is not None:
    cx = int(sldSz.attrib.get('cx', 0))
    cy = int(sldSz.attrib.get('cy', 0))
    print(f"Slide Size: cx={cx} ({cx/914400:.3f}\"), cy={cy} ({cy/914400:.3f}\")")

sldIdLst = pres_root.findall('.//p:sldIdLst/p:sldId', NS)
print(f"Total slides registered in presentation.xml: {len(sldIdLst)}")

# Inspect each slide XML
slides_dir = os.path.join(UNPACKED_DIR, "ppt", "slides")
slide_files = sorted(glob.glob(os.path.join(slides_dir, "slide[0-9]*.xml")), key=lambda x: int(re.search(r'slide(\d+)\.xml', x).group(1)))

slide_stats = []
for sf in slide_files:
    s_name = os.path.basename(sf)
    tree = ET.parse(sf)
    root = tree.getroot()
    
    shapes = root.findall('.//p:sp', NS)
    pics = root.findall('.//p:pic', NS)
    graphic_frames = root.findall('.//p:graphicFrame', NS)
    tx_bodies = root.findall('.//a:txBody', NS)
    paras = root.findall('.//a:p', NS)
    runs = root.findall('.//a:r', NS)
    texts = root.findall('.//a:t', NS)
    
    text_content = [t.text for t in texts if t.text]
    full_text_sample = " | ".join(text_content[:6])
    total_chars = sum(len(t) for t in text_content)
    
    # Check if full-bleed raster fake
    is_raster_only = False
    if len(shapes) == 0 and len(tx_bodies) == 0 and len(pics) >= 1:
        is_raster_only = True
    
    slide_stats.append({
        "slide": s_name,
        "shapes": len(shapes),
        "pics": len(pics),
        "graphic_frames": len(graphic_frames),
        "tx_bodies": len(tx_bodies),
        "paras": len(paras),
        "runs": len(runs),
        "texts": len(texts),
        "chars": total_chars,
        "is_raster_only": is_raster_only,
        "sample": full_text_sample[:120]
    })

print("\nPer-Slide Element Density & PresentationML Audit:")
print(f"{'Slide':<12} | {'Shapes':<7} | {'Pics':<5} | {'TxBody':<7} | {'Runs':<6} | {'Chars':<6} | {'Raster-Only?':<12} | {'Text Sample'}")
print("-" * 120)
for st in slide_stats:
    print(f"{st['slide']:<12} | {st['shapes']:<7} | {st['pics']:<5} | {st['tx_bodies']:<7} | {st['runs']:<6} | {st['chars']:<6} | {str(st['is_raster_only']):<12} | {st['sample']}")

# Inspect Notes Slides
notes_dir = os.path.join(UNPACKED_DIR, "ppt", "notesSlides")
notes_files = sorted(glob.glob(os.path.join(notes_dir, "notesSlide[0-9]*.xml")), key=lambda x: int(re.search(r'notesSlide(\d+)\.xml', x).group(1))) if os.path.exists(notes_dir) else []
print(f"\nSpeaker Notes Audit: Found {len(notes_files)} notes slides.")
for nf in notes_files:
    tree = ET.parse(nf)
    root = tree.getroot()
    texts = [t.text for t in root.findall('.//a:t', NS) if t.text]
    note_text = " ".join(texts)
    print(f"  {os.path.basename(nf)}: {len(note_text)} chars — \"{note_text[:90]}...\"")

print("\n" + "=" * 80)
print("AUDIT CHECK 4: TEST HARNESS & INTEGRITY SCAN")
print("=" * 80)
test_files = glob.glob(os.path.join(BASE_DIR, "*test*.py")) + glob.glob(os.path.join(BASE_DIR, "verify*.py"))
for tf in test_files:
    tf_name = os.path.basename(tf)
    with open(tf, "r", encoding="utf-8") as f:
        t_content = f.read()
    # Check for suspicious mock returns or bypasses
    has_assert = "assert" in t_content
    has_mock = "mock" in t_content.lower() or "unittest.mock" in t_content
    print(f"  Test file '{tf_name}': {len(t_content.splitlines())} lines | asserts={has_assert} | mock_detected={has_mock}")

print("\nAUDIT DATA EXTRACTION COMPLETE.")
