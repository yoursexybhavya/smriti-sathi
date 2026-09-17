import zipfile
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

EXPECTED_NOTES = {
    1: "Respected judges, imagine standing before the 400-year-old Amer Fort in Jaipur. You look up at the massive ramparts, but you don't know who built them, what they witnessed, or even where to buy a verified ticket. Just as Herodotus chronicled ancient history for posterity, we built Herodotus to give India’s living stone a voice in every pocket. Our working MVP is live today on modern smartphones.",
    2: "India is blessed with 3,693 ASI-protected monuments, but for 98% of them, the visitor experience is completely broken. On-site context is fragmented across unverified blogs; visiting hours and tariffs are scattered across outdated portals; and audio guides exist at fewer than 1% of sites, almost exclusively in English. Visitors either pay ₹500 for unverified guides or walk through world-changing history in complete silence.",
    3: "We asked a fundamental question: Why are we searching for monuments using text boxes, when history lives on physical ground? Herodotus replaces keyword searches with a spatial-first discovery journey. You explore India visually on a dynamic map. Unlike traditional audio apps requiring 150-megabyte downloads and heavy MP3 streaming servers, Herodotus uses a zero-friction PWA and native browser speech synthesis. It delivers instant, mother-tongue audio in Hindi, Tamil, and Bengali with zero latency.",
    4: "Here is our working MVP in action. A traveler opens herodotus-guide in any mobile browser—no app install, no sign-up. Step one: zoom into Rajasthan and watch 3,693 monuments cluster dynamically. Step two: tap Amer Fort to open a curated dossier with verified architecture and history. Step three: hit Play, and the browser’s Web Speech API instantly narrates the story through your earbuds. Step four: verify official hours, tariffs, and direct ASI ticket booking links before you arrive. Map to monument in ten seconds.",
    5: "Our technical feasibility stems from intentional simplicity. We didn't build expensive server farms or heavy AI pipelines. We combined Next.js 14, Mapbox GL vector clustering, client-side Web Speech, and static GeoJSON cached on Vercel's global edge. The result? A sub-350-kilobyte payload that loads in 1.2 seconds on rural 4G, zero marginal server cost per audio listener, and an onboarding pipeline that catalogs new monuments in just 48 hours.",
    6: "How do we monetize and scale? Through three disciplined engines: First, B2G partnerships with State Tourism boards and 2-3% affiliate commissions on official ASI e-tickets. Second, freemium micro-transactions—basic 90-second audio is free forever, with ₹49 UPI unlocks for 25-minute deep-dive walks. Third, hyperlocal commerce commissions with certified local guides and GI-tagged artisans. We scale from the Golden Triangle MVP to all 3,693 monuments nationwide with near-zero added server overhead.",
    7: "Ninety percent of Indian tourists visit the same 15 famous monuments. Herodotus shines a digital spotlight on 3,500 forgotten stepwells and forts across all 28 states. More importantly, by synthesizing audio in regional Indian languages and providing an audio-first interface, we break the elite English-only tourist guide monopoly and give visually impaired citizens and non-readers equal, dignified access to their own heritage.",
    8: "History is everywhere. Now, it can speak. We have a live working MVP ready on your phones right now at herodotus-guide.vercel.app. Thank you, judges. We are excited to take your questions and demonstrate the product live."
}

def normalize_ws(s):
    return " ".join(s.split())

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

print("=" * 70)
print("EXACT VERBATIM SPEAKER NOTES AUDIT ACROSS ALL 8 SLIDES")
print("=" * 70)

all_match = True

with zipfile.ZipFile(pptx_path, 'r') as z:
    for s_idx in range(1, 9):
        xml_path = f"ppt/notesSlides/notesSlide{s_idx}.xml"
        if xml_path not in z.namelist():
            print(f"Slide {s_idx}: [FAIL] Missing notesSlide XML!")
            all_match = False
            continue
            
        root = ET.fromstring(z.read(xml_path))
        
        # pptxgenjs puts notes in the second shape or a body shape
        # Let's extract all text paragraphs
        para_texts = []
        for p in root.findall('.//a:p', NS):
            t_nodes = [t.text for t in p.findall('.//a:t', NS) if t.text]
            if t_nodes:
                para_texts.append("".join(t_nodes))
                
        actual_note = "\n".join(para_texts).strip()
        expected_note = EXPECTED_NOTES[s_idx].strip()
        
        # Check if expected note text is exactly inside actual_note
        if normalize_ws(expected_note) in normalize_ws(actual_note):
            print(f"Slide {s_idx}: [PASS] Exact verbatim match ({len(expected_note)} chars)")
        else:
            print(f"Slide {s_idx}: [FAIL] Mismatch!")
            print(f"  Expected: '{expected_note}'")
            print(f"  Actual:   '{actual_note}'")
            all_match = False

if all_match:
    print("\nALL 8 SPEAKER NOTES MATCH 100% VERBATIM!")
else:
    print("\nSPEAKER NOTES MISMATCH DETECTED!")
