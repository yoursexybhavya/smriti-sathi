import zipfile
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

EXTRA_ELEMENTS = {
    1: [
        "27.1751° N · 78.0421° E · AGRA, IN",
        "A MAP-FIRST DIGITAL HERITAGE EXPERIENCE",
        "TEAM HERODOTUS",
        "MAP · STORY · AUDIO · VISIT"
    ],
    2: [
        "26.9239° N · 75.8267° E  JAIPUR, IN",
        "———   X   ———   X   ———   X   ———   X   ———"
    ],
    3: [
        "20.59° N · 78.96° E  NATIONAL MAP",
        "One map.\nEvery monument.\nOne tap away.",
        "HERODOTUS / NATIONAL VIEW",
        "ZOOM LV 04 · 20.59°N 78.96°E"
    ],
    4: [
        "26.9855° N · 75.8513° E  AMER FORT",
        "MAP → MONUMENT → STORY\n→ AUDIO → VISITOR INFO",
        "VIEW TICKETS",
        "GET DIRECTIONS ↗"
    ],
    5: [
        "28.6139° N · 77.2090° E  EDGE CDN",
        "MVP-FIRST ARCHITECTURE",
        "No complicated backend is required for the MVP.",
        "EXISTING, PROVEN BUILDING BLOCKS — NO CUSTOM SERVER, NO DATABASE LAYER IN THE MVP"
    ],
    6: [
        "28.6139° N · 77.2090° E  DELHI, IN",
        "UNIT ECONOMICS ENGINE",
        "Zero Server Overhead · Near-100% Gross Margins"
    ],
    7: [
        "10.7828° N · 79.1318° E · THANJAVUR, IN",
        "———   X   ———   X   ———   X   ———   X   ———"
    ],
    8: [
        "28.6562° N · 77.2410° E · NEW DELHI, IN",
        "TEAM HERODOTUS",
        "MAP · STORY · AUDIO · VISIT · DEMO"
    ]
}

def clean(s):
    return " ".join(s.replace('’', "'").replace('—', '-').replace('–', '-').split()).lower()

with zipfile.ZipFile(pptx_path, 'r') as z:
    for s_idx, elements in EXTRA_ELEMENTS.items():
        slide_xml = f"ppt/slides/slide{s_idx}.xml"
        root = ET.fromstring(z.read(slide_xml))
        txts = clean(" ".join([elem.text for elem in root.iter() if elem.text]))
        print(f"\nChecking Slide {s_idx} extra elements:")
        for el in elements:
            c_el = clean(el)
            if c_el in txts:
                print(f"  [PASS] '{el}'")
            else:
                print(f"  [FAIL] '{el}' not found!")
