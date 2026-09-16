import zipfile
import hashlib
import os
import glob
import re
import xml.etree.ElementTree as ET

PPTX_PATH = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"
BRAIN_DIR = "/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48"

EXPECTED_IMAGES = {
    "hero_monument_1789383083590.jpg": os.path.join(BRAIN_DIR, "hero_monument_1789383083590.jpg"),
    "heritage_problem_scene_1789435962154.jpg": os.path.join(BRAIN_DIR, "heritage_problem_scene_1789435962154.jpg"),
    "phone_audio_guide_1789436084142.jpg": os.path.join(BRAIN_DIR, "phone_audio_guide_1789436084142.jpg"),
    "india_heritage_map_1789407014836.jpg": os.path.join(BRAIN_DIR, "india_heritage_map_1789407014836.jpg"),
    "tech_architecture_warm_1789436115529.jpg": os.path.join(BRAIN_DIR, "tech_architecture_warm_1789436115529.jpg"),
    "human_traveler_heritage_1789408640689.jpg": os.path.join(BRAIN_DIR, "human_traveler_heritage_1789408640689.jpg"),
    "indian_family_heritage_1789408698290.jpg": os.path.join(BRAIN_DIR, "indian_family_heritage_1789408698290.jpg"),
    "closing_monument_1789403341798.jpg": os.path.join(BRAIN_DIR, "closing_monument_1789403341798.jpg"),
    "visitor_monument_1789383102153.jpg": os.path.join(BRAIN_DIR, "visitor_monument_1789383102153.jpg"),
}

JUDGING_CRITERIA = [
    "Innovation & Originality",
    "Feasibility & Technical Viability",
    "Impact & Social Relevance",
    "Presentation & Clarity",
    "Business Model & Scalability",
]

def hash_file(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest(), os.path.getsize(filepath)

def hash_bytes(data):
    h = hashlib.sha256()
    h.update(data)
    return h.hexdigest(), len(data)

def main():
    print("=== 1. IMAGE ASSET VERIFICATION ===")
    source_hashes = {}
    for name, path in EXPECTED_IMAGES.items():
        if os.path.exists(path):
            sha, sz = hash_file(path)
            source_hashes[name] = {"sha256": sha, "size": sz, "path": path}
            print(f"Source Image: {name} | Size: {sz} | SHA256: {sha[:16]}...")
        else:
            print(f"ERROR: Source image missing: {path}")

    with zipfile.ZipFile(PPTX_PATH, "r") as z:
        media_files = [n for n in z.namelist() if n.startswith("ppt/media/")]
        print(f"\nFound {len(media_files)} files in ppt/media/:")
        embedded_hashes = {}
        for m in sorted(media_files):
            data = z.read(m)
            sha, sz = hash_bytes(data)
            embedded_hashes[m] = {"sha256": sha, "size": sz}
            print(f"  {m}: Size={sz}, SHA256={sha[:16]}...")

        # Match embedded against source
        matched_sources = set()
        for m, edata in embedded_hashes.items():
            matched = False
            for sname, sdata in source_hashes.items():
                if edata["sha256"] == sdata["sha256"]:
                    print(f"MATCH: {m} is identical to source {sname}")
                    matched_sources.add(sname)
                    matched = True
                    break
            if not matched:
                print(f"WARNING: {m} did not match any source image hash!")

        missing_sources = set(source_hashes.keys()) - matched_sources
        if not missing_sources:
            print(f"\nSUCCESS: All {len(EXPECTED_IMAGES)} expected source images are present and byte-identical in ppt/media/!")
        else:
            print(f"\nFAILURE: Missing source images in ppt/media/: {missing_sources}")

        print("\n=== SLIDE TO IMAGE MAPPINGS ===")
        # Check slide rels to see which slide links to which media
        slide_rels = [n for n in z.namelist() if n.startswith("ppt/slides/_rels/slide") and n.endswith(".xml.rels")]
        # Sort by slide number
        slide_rels = sorted(slide_rels, key=lambda x: int(re.search(r'slide(\d+)\.xml\.rels', x).group(1)))
        
        slide_media_map = {}
        for srel in slide_rels:
            slide_num = re.search(r'slide(\d+)\.xml\.rels', srel).group(1)
            rel_xml = z.read(srel).decode("utf-8")
            tree = ET.fromstring(rel_xml)
            targets = []
            for elem in tree.findall("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"):
                target = elem.get("Target")
                if "media/" in target:
                    media_name = os.path.basename(target)
                    # find which source matches
                    full_media_path = f"ppt/media/{media_name}"
                    msha = embedded_hashes.get(full_media_path, {}).get("sha256")
                    src_match = "Unknown"
                    for sname, sdata in source_hashes.items():
                        if sdata["sha256"] == msha:
                            src_match = sname
                            break
                    targets.append((media_name, src_match))
            slide_media_map[slide_num] = targets
            print(f"Slide {slide_num}: {len(targets)} image(s) embedded -> {targets}")

        print("\n=== 2. TEXT EXTRACTION & CRITERIA COVERAGE ===")
        slide_files = [n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml', n)]
        slide_files = sorted(slide_files, key=lambda x: int(re.search(r'slide(\d+)\.xml', x).group(1)))
        
        all_deck_text = ""
        slide_texts = {}
        for sfile in slide_files:
            slide_num = re.search(r'slide(\d+)\.xml', sfile).group(1)
            sxml = z.read(sfile).decode("utf-8")
            stree = ET.fromstring(sxml)
            # Find all <a:t>
            texts = [node.text for node in stree.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}t") if node.text]
            full_text = " ".join(texts)
            slide_texts[slide_num] = full_text
            all_deck_text += f"\n--- SLIDE {slide_num} ---\n" + full_text

        print("Checking for 5 Judging Criteria in deck text:")
        for crit in JUDGING_CRITERIA:
            found = False
            # Check direct or split
            crit_regex = re.compile(re.escape(crit), re.IGNORECASE)
            # Also check individual words
            crit_parts = [p.strip() for p in crit.split("&")]
            found_slides = []
            for snum, stext in slide_texts.items():
                if crit_regex.search(stext):
                    found_slides.append(snum)
                elif all(re.search(re.escape(p), stext, re.IGNORECASE) for p in crit_parts):
                    found_slides.append(snum)
            if found_slides:
                print(f"  [PASS] '{crit}' found on slide(s): {', '.join(found_slides)}")
            else:
                print(f"  [FAIL] '{crit}' NOT found in slide texts!")

        print("\n=== 3. SPEAKER NOTES VERIFICATION ===")
        notes_files = [n for n in z.namelist() if re.match(r'ppt/notesSlides/notesSlide\d+\.xml', n)]
        notes_files = sorted(notes_files, key=lambda x: int(re.search(r'notesSlide(\d+)\.xml', x).group(1)))
        print(f"Found {len(notes_files)} speaker note files:")
        for nfile in notes_files:
            nnum = re.search(r'notesSlide(\d+)\.xml', nfile).group(1)
            nxml = z.read(nfile).decode("utf-8")
            ntree = ET.fromstring(nxml)
            ntexts = [node.text for node in ntree.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}t") if node.text]
            note_content = " ".join(ntexts)
            # Filter out slide number if present
            words = note_content.split()
            print(f"  Note {nnum}: {len(words)} words | Preview: {note_content[:120]}...")

        print("\n=== 4. PLACEHOLDER / DUMMY TEXT SCAN ===")
        bad_patterns = [
            r'\bTODO\b',
            r'\bLorem\b',
            r'\bipsum\b',
            r'\bx{3,}\b',
            r'\[insert',
            r'this.*(page|slide).*layout'
        ]
        deck_lower = all_deck_text.lower()
        found_bad = False
        for pat in bad_patterns:
            matches = re.findall(pat, all_deck_text, re.IGNORECASE)
            if matches:
                print(f"  [WARNING] Found placeholder pattern '{pat}': {matches}")
                found_bad = True
        if not found_bad:
            print("  [PASS] No placeholder or dummy text found in slide contents.")

        print("\n=== 5. TYPOGRAPHY & FONT USAGE ===")
        font_names = set()
        font_sizes = []
        for sfile in slide_files:
            sxml = z.read(sfile).decode("utf-8")
            stree = ET.fromstring(sxml)
            for rpr in stree.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}rPr"):
                sz = rpr.get("sz")
                if sz:
                    font_sizes.append(int(sz) / 100.0)
                for latin in rpr.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}latin"):
                    typeface = latin.get("typeface")
                    if typeface:
                        font_names.add(typeface)
            for defrpr in stree.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}defRPr"):
                sz = defrpr.get("sz")
                if sz:
                    font_sizes.append(int(sz) / 100.0)
                for latin in defrpr.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}latin"):
                    typeface = latin.get("typeface")
                    if typeface:
                        font_names.add(typeface)

        print(f"Unique typefaces declared across all slides: {sorted(list(font_names))}")
        disallowed_fonts = [f for f in font_names if f not in ["Cambria", "Calibri"]]
        if disallowed_fonts:
            print(f"  [FAIL] Disallowed fonts found: {disallowed_fonts}")
        else:
            print("  [PASS] Typeface usage is strictly Cambria and Calibri exclusively.")

        if font_sizes:
            print(f"Font sizes range: min={min(font_sizes)}pt, max={max(font_sizes)}pt")
            print(f"All unique font sizes: {sorted(list(set(font_sizes)))}")

if __name__ == "__main__":
    main()
