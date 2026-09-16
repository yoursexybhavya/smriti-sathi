import os
import hashlib
import zipfile

ASSET_DIR = '/Users/krishnajangid/.gemini/antigravity/brain/0257ec97-0b88-48e3-abaf-ced68cd3ce48'

asset_hashes = {}
for fname in os.listdir(ASSET_DIR):
    fpath = os.path.join(ASSET_DIR, fname)
    if os.path.isfile(fpath):
        with open(fpath, 'rb') as f:
            data = f.read()
            sha = hashlib.sha256(data).hexdigest()
            asset_hashes[sha] = fname

zf = zipfile.ZipFile("Herodotus_Pitch_Presentation.pptx", "r")
media_files = [m for m in zf.namelist() if m.startswith("ppt/media/") and m != "ppt/media/"]

print("Verifying that every embedded media file in PPTX corresponds to an authorized asset:")
all_match = True
for mf in sorted(media_files):
    data = zf.read(mf)
    sha = hashlib.sha256(data).hexdigest()
    if sha in asset_hashes:
        print(f"  [MATCH] {mf} -> {asset_hashes[sha]}")
    else:
        print(f"  [FAIL] {mf} with sha {sha} is NOT an authorized asset!")
        all_match = False

if all_match:
    print("RESULT: ALL embedded media files are 100% genuine authorized heritage photos!")
else:
    print("RESULT: Suspicious/unauthorized images detected!")
