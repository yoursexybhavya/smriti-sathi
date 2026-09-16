import zipfile
import hashlib
import os

zf = zipfile.ZipFile("Herodotus_Pitch_Presentation.pptx", "r")
media_files = [m for m in zf.namelist() if m.startswith("ppt/media/")]

print(f"Total media files in package: {len(media_files)}")
for mf in sorted(media_files):
    data = zf.read(mf)
    sha = hashlib.sha256(data).hexdigest()
    print(f"{mf}: size={len(data)} bytes, sha256={sha[:16]}...")

