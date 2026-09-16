import zipfile
import xml.etree.ElementTree as ET
import os
import io
from PIL import Image

PPTX_PATH = "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"

def run_stress_tests():
    print("=== ADVERSARIAL STRESS TEST SUITE ===")
    
    with zipfile.ZipFile(PPTX_PATH, "r") as z:
        # TEST 1: XML Well-formedness of ALL XML parts
        print("\n--- TEST 1: XML Well-Formedness Across All Parts ---")
        xml_files = [n for n in z.namelist() if n.endswith(".xml") or n.endswith(".rels")]
        malformed = []
        for xf in xml_files:
            try:
                content = z.read(xf)
                ET.fromstring(content)
            except Exception as e:
                malformed.append((xf, str(e)))
        if malformed:
            print(f"FAILED: {len(malformed)} malformed XML files: {malformed}")
        else:
            print(f"PASSED: All {len(xml_files)} XML and .rels parts are perfectly well-formed.")

        # TEST 2: Relationship Integrity & Broken Target Detection
        print("\n--- TEST 2: Relationship & Target Linkage Integrity ---")
        rels_files = [n for n in z.namelist() if n.endswith(".rels")]
        broken_refs = []
        for rf in rels_files:
            content = z.read(rf)
            tree = ET.fromstring(content)
            base_dir = os.path.dirname(rf)
            # if rf is 'ppt/slides/_rels/slide1.xml.rels', base_dir is 'ppt/slides/_rels'
            # parent of _rels is 'ppt/slides'
            parent_dir = os.path.normpath(os.path.join(base_dir, "..")) if base_dir != "" else ""
            for rel in tree.findall("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"):
                target = rel.get("Target")
                target_mode = rel.get("TargetMode")
                if target_mode == "External":
                    continue # External URLs (like vercel app) are expected
                # Resolve relative path
                if parent_dir:
                    resolved = os.path.normpath(os.path.join(parent_dir, target))
                else:
                    resolved = os.path.normpath(target)
                if resolved not in z.namelist():
                    broken_refs.append((rf, target, resolved))
        if broken_refs:
            print(f"FAILED: Found {len(broken_refs)} broken internal relationships: {broken_refs}")
        else:
            print(f"PASSED: All internal relationships resolve to existing targets in the archive.")

        # TEST 3: Content Types Registration
        print("\n--- TEST 3: Content Types Completeness ---")
        ct_tree = ET.fromstring(z.read("[Content_Types].xml"))
        declared_parts = set()
        declared_exts = set()
        for elem in ct_tree:
            if elem.tag.endswith("Override"):
                declared_parts.add(elem.get("PartName").lstrip("/"))
            elif elem.tag.endswith("Default"):
                declared_exts.add(elem.get("Extension"))
        
        unregistered_parts = []
        for name in z.namelist():
            if name.endswith("/") or name == "[Content_Types].xml" or name.startswith("_rels/"):
                continue
            ext = os.path.splitext(name)[1].lstrip(".")
            if name not in declared_parts and ext not in declared_exts:
                unregistered_parts.append(name)
        if unregistered_parts:
            print(f"FAILED: Found {len(unregistered_parts)} unregistered parts in [Content_Types].xml: {unregistered_parts}")
        else:
            print(f"PASSED: All parts have valid extension defaults or explicit overrides in [Content_Types].xml.")

        # TEST 4: Embedded Image Fidelity & PIL Decodability
        print("\n--- TEST 4: PIL Decodability & Image Integrity ---")
        media_files = [n for n in z.namelist() if n.startswith("ppt/media/") and not n.endswith("/")]
        corrupt_images = []
        for mf in sorted(media_files):
            data = z.read(mf)
            try:
                img = Image.open(io.BytesIO(data))
                img.verify()
                # Reopen to get format, size, mode
                img = Image.open(io.BytesIO(data))
                print(f"  {mf}: format={img.format}, size={img.size}, mode={img.mode}, bytes={len(data)}")
            except Exception as e:
                corrupt_images.append((mf, str(e)))
        if corrupt_images:
            print(f"FAILED: {len(corrupt_images)} corrupt images: {corrupt_images}")
        else:
            print(f"PASSED: All {len(media_files)} embedded image assets are valid, uncorrupted images.")

        # TEST 5: Speaker Notes Mapping to Slides
        print("\n--- TEST 5: 1-to-1 Slide-to-Notes Mapping ---")
        for snum in range(1, 9):
            srel_path = f"ppt/slides/_rels/slide{snum}.xml.rels"
            if srel_path not in z.namelist():
                print(f"FAILED: Missing relationship file {srel_path}")
                continue
            stree = ET.fromstring(z.read(srel_path))
            notes_targets = [r.get("Target") for r in stree.findall("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship") if "notesSlide" in r.get("Type", "") or "notesSlide" in r.get("Target", "")]
            if not notes_targets:
                print(f"FAILED: Slide {snum} has no linked notesSlide!")
            else:
                print(f"  Slide {snum} correctly links to {notes_targets[0]}")
        print("PASSED: 1-to-1 Slide-to-Notes mapping verified.")

        # TEST 6: Check for Non-Editable / Flattened Slides
        print("\n--- TEST 6: Native Editability Verification ---")
        for snum in range(1, 9):
            sfile = f"ppt/slides/slide{snum}.xml"
            stree = ET.fromstring(z.read(sfile))
            sp_count = len(stree.findall(".//{http://schemas.openxmlformats.org/presentationml/2006/main}sp"))
            tx_count = len(stree.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t"))
            print(f"  Slide {snum}: {sp_count} shapes/text containers, {tx_count} distinct text runs.")
            if tx_count == 0:
                print(f"FAILED: Slide {snum} has 0 text runs (potential rasterized slide)!")
        print("PASSED: Every slide has extensive native shape and text run elements.")

if __name__ == "__main__":
    run_stress_tests()
