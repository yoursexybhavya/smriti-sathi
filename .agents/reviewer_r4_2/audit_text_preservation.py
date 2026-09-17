import sys
import zipfile
import re
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

# Exhaustive catalog of every text block from Section 1.2 of explorer_r4_2/handoff.md
CATALOG = {
    1: {
        "Category Pill": "IDEA FORGE 2026 · LIVE WORKING PWA READY",
        "Main Title": "HERODOTUS",
        "Subtitle": "Giving India’s Living Stone a Voice in Every Pocket",
        "Project Narrative": "An interactive, map-first web companion putting 4,000 years of Indian heritage into every traveler's pocket — with instant multilingual audio, curated architectural stories, and verified on-site visitor facts.",
        "Feature Pill 1": "MAP-FIRST DISCOVERY",
        "Feature Pill 2": "WEB SPEECH AUDIO",
        "Feature Pill 3": "ZERO-FRICTION PWA",
        "MVP Card Heading": "★ LIVE WORKING MVP READY ON SMARTPHONES",
        "MVP Card Line 2": "Next.js 14 · Mapbox GL · Browser Web Speech API · Vercel Edge",
        "MVP Card Line 3": "herodotus-guide.vercel.app · 3,693 ASI Monuments Unified",
        "Amer Fort Title": "Amer Fort & Palace",
        "Amer Fort Subtitle 1": "Jaipur, Rajasthan · UNESCO World Heritage Site #247",
        "Amer Fort Subtitle 2": "Rajput-Mughal Architecture · Founded 1592 CE",
        "Amer Fort Narrative": "Perched high on the rugged Aravalli hills, Amer Fort witnessed four centuries of living history. Yet today, millions of domestic tourists walk through its monumental Sun Gate in silence without hearing its stories.",
        "Amer Fort Banner Item 1": "400-Year Living Stone",
        "Amer Fort Banner Item 2": "5 Indian Languages",
        "Amer Fort Banner Item 3": "Zero App Download",
        "Amer Fort Banner Item 4": "On-Site GPS Guide",
        "Amer Fort Caption": "Cover Photography: Sunset over Amer Fort ramparts",
        "Slide Footer": "Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon · Free Public Access · Built for 1.4 Billion Citizens",
        "Speaker Notes": "Respected judges, imagine standing before the 400-year-old Amer Fort in Jaipur. You look up at the massive ramparts, but you don't know who built them, what they witnessed, or even where to buy a verified ticket. Just as Herodotus chronicled ancient history for posterity, we built Herodotus to give India’s living stone a voice in every pocket. Our working MVP is live today on modern smartphones."
    },
    2: {
        "Category Kicker": "01 / THE VISITOR FRICTION",
        "Main Title Component 1": "Standing in Front of History",
        "Main Title Component 2": "Where’s the Story?",
        "Subtitle": "India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.",
        "Left Caption": "THE ON-SITE REALITY: 300M+ domestic travelers walk past world-changing heritage in complete silence — facing weathered placards and fragmented information.",
        "Problem Card 01 ID": "01",
        "Problem Card 01 Heading": "Scattered & Unverified Historical Context",
        "Problem Card 01 Desc": "On-site tourists struggle to find verified stories. Critical historical narratives are buried in unverified blogs, fragmented search tabs, or eroded physical placards.",
        "Problem Card 02 ID": "02",
        "Problem Card 02 Heading": "Dispersed Logistics & Outdated Tariffs",
        "Problem Card 02 Desc": "Official opening hours, differential domestic vs. international tariffs, and ticketing portals are spread across disparate databases, causing visitor confusion and tout exploitation.",
        "Problem Card 03 ID": "03",
        "Problem Card 03 Heading": "Expensive Guide Monopoly & Language Divide",
        "Problem Card 03 Desc": "Tourists face an unfair choice: pay ₹300–₹500 for unverified touts or walk in silence. Audio guides exist at <1% of sites and are almost exclusively in English.",
        "Bottom Synthesis Strip": "THE CORE REALITY: The history exists. The information exists. But the digital connection is broken.",
        "Speaker Notes": "India is blessed with 3,693 ASI-protected monuments, but for 98% of them, the visitor experience is completely broken. On-site context is fragmented across unverified blogs; visiting hours and tariffs are scattered across outdated portals; and audio guides exist at fewer than 1% of sites, almost exclusively in English. Visitors either pay ₹500 for unverified guides or walk through world-changing history in complete silence."
    },
    3: {
        "Category Kicker (Criterion 1)": "02 / JUDGING CRITERION: INNOVATION & ORIGINALITY",
        "Main Title Line 1": "SPATIAL-FIRST DISCOVERY",
        "Main Title Line 2": "VS. KEYWORD SEARCH",
        "Subtitle": "Monuments are physical coordinates on earth, not search queries in a database.",
        "Top Paradigm Shift": "PARADIGM SHIFT: Replacing keyword search boxes with an interactive, 60 FPS spatial map covering 3,693 geocoded monuments.",
        "Status Quo Header": "TRADITIONAL VISITOR JOURNEY (STATUS QUO)",
        "Status Quo Bullet 1 Label": "Keyword Search: ",
        "Status Quo Bullet 1 Text": "Must know exact monument spellings in advance; zero serendipity.",
        "Status Quo Bullet 2 Label": "Bulky 150MB Apps: ",
        "Status Quo Bullet 2 Text": "Heavy downloads that stall on 3G, or expensive hardware booths.",
        "Status Quo Bullet 3 Label": "English Monopoly: ",
        "Status Quo Bullet 3 Text": "Audio guides exist at <30 sites, costing ₹300+ in English only.",
        "Breakthrough Header": "★ HERODOTUS SPATIAL COMPANION (BREAKTHROUGH)",
        "Breakthrough Bullet 1 Label": "Map-First Cartography: ",
        "Breakthrough Bullet 1 Text": "Dynamic 60 FPS vector map across 3,693 geocoded ASI monuments.",
        "Breakthrough Bullet 2 Label": "Zero-Friction PWA: ",
        "Breakthrough Bullet 2 Text": "Sub-350KB payload, instant browser access, zero app downloads.",
        "Breakthrough Bullet 3 Label": "Linguistic Inclusion: ",
        "Breakthrough Bullet 3 Text": "Mother-tongue narration in 5+ Indian languages at ₹0 cost.",
        "Right Map Caption": "DYNAMIC SPATIAL ENGINE: 3,693 monument coordinates clustered with Mapbox Supercluster. As travelers explore regions, clusters dynamically expand into verified cultural dossiers.",
        "Bottom Callout": "Core Originality: Transforming static geo-coordinates into living, voice-narrated cultural dossiers at zero marginal server cost.",
        "Speaker Notes": "We asked a fundamental question: Why are we searching for monuments using text boxes, when history lives on physical ground? Herodotus replaces keyword searches with a spatial-first discovery journey. You explore India visually on a dynamic map. Unlike traditional audio apps requiring 150-megabyte downloads and heavy MP3 streaming servers, Herodotus uses a zero-friction PWA and native browser speech synthesis. It delivers instant, mother-tongue audio in Hindi, Tamil, and Bengali with zero latency."
    },
    4: {
        "Category Kicker (Criterion 4)": "03 / JUDGING CRITERION: PRESENTATION & CLARITY",
        "Main Title Line 1": "FROM MAP TO MONUMENT",
        "Main Title Line 2": "IN 10 SECONDS",
        "Subtitle": "A seamless, zero-friction web flow taking travelers from national cartography to verified audio in 4 steps.",
        "Photo Inset Caption": "ON-SITE EXPERIENCE: Zero download required. A traveler stands at Amer Fort, taps their browser, and listens to verified narratives in their mother tongue.",
        "Browser URL": "herodotus-guide.vercel.app/explore/amer-fort",
        "Monument Title": "Amer Fort & Palace · Rajput-Mughal Architecture (1592 CE)",
        "Audio Header": "PLAYING AUDIO GUIDE · 01:24 / 03:42 · Web Speech (Hindi / English)",
        "Player Counter 1": "01:24",
        "Player Counter 2": "03:42",
        "Logistics 1": "Timings: 08:00 – 17:30\n🎟 Tariff: ₹100 (Ind) / ₹500 (Int)",
        "Logistics 2": "Verified Official ASI E-Ticket Portal\n🗣 Instant Audio in 5 Indian Languages",
        "Sync Feature": "GPS Proximity Sync · Offline Audio Cached locally in IndexedDB",
        "Step 01 Tag": "STEP 01",
        "Step 01 Title": "01 · LOCATE",
        "Step 01 Desc": "Open browser, explore smooth Mapbox vector canvas with 3,693 dynamically clustered pins.",
        "Step 02 Tag": "STEP 02",
        "Step 02 Title": "02 · CONTEXTUALIZE",
        "Step 02 Desc": "Tap any monument to open curated architectural highlights, dynasty timelines, and verified photography.",
        "Step 03 Tag": "STEP 03 · AUDIO",
        "Step 03 Title": "03 · LISTEN",
        "Step 03 Desc": "Hit Play for instant Web Speech audio narration in your mother tongue — zero file downloads, zero latency.",
        "Step 04 Tag": "STEP 04",
        "Step 04 Title": "04 · PLAN",
        "Step 04 Desc": "Access official ASI ticket booking portals, real-time hours, and direct turn-by-turn navigation.",
        "Speaker Notes": "Here is our working MVP in action. A traveler opens herodotus-guide in any mobile browser—no app install, no sign-up. Step one: zoom into Rajasthan and watch 3,693 monuments cluster dynamically. Step two: tap Amer Fort to open a curated dossier with verified architecture and history. Step three: hit Play, and the browser’s Web Speech API instantly narrates the story through your earbuds. Step four: verify official hours, tariffs, and direct ASI ticket booking links before you arrive. Map to monument in ten seconds."
    },
    5: {
        "Category Kicker (Criterion 2)": "04 / JUDGING CRITERION: FEASIBILITY & TECHNICAL VIABILITY",
        "Main Title Line 1": "LIGHTWEIGHT MVP ARCHITECTURE",
        "Main Title Line 2": "INFINITE SCALABILITY",
        "Subtitle": "Engineered on modern browser standards for zero server streaming costs, sub-second loads, and offline reliability.",
        "Layer 01 Tag": "LAYER 01",
        "Layer 01 Title": "Next.js 14 PWA",
        "Layer 01 Subtitle": "Client Frontend",
        "Layer 01 Bullet 1": "Zero app-store friction or downloads",
        "Layer 01 Bullet 2": "Installable PWA with offline Service Worker",
        "Layer 01 Bullet 3": "Tailwind CSS for responsive budget mobile UI",
        "Layer 02 Tag": "LAYER 02",
        "Layer 02 Title": "Mapbox GL JS",
        "Layer 02 Subtitle": "Spatial Engine",
        "Layer 02 Bullet 1": "60 FPS vector map rendering canvas",
        "Layer 02 Bullet 2": "Supercluster pin clustering for 3,693 sites",
        "Layer 02 Bullet 3": "GeoJSON boundary overlays & terrain tilt",
        "Layer 03 Tag": "LAYER 03 · CORE TECH",
        "Layer 03 Title": "Web Speech API",
        "Layer 03 Subtitle": "Native Audio Engine",
        "Layer 03 Bullet 1": "Client device speech synthesis engine",
        "Layer 03 Bullet 2": "Zero audio streaming bandwidth or CDN costs",
        "Layer 03 Bullet 3": "5+ languages: Hindi, Tamil, Bengali, Telugu, EN",
        "Layer 04 Tag": "LAYER 04",
        "Layer 04 Title": "GeoJSON Catalog",
        "Layer 04 Subtitle": "Data Pipeline",
        "Layer 04 Bullet 1": "Unified schema for 3,693 ASI monuments",
        "Layer 04 Bullet 2": "Verified timings, entry tariffs & histories",
        "Layer 04 Bullet 3": "Cached locally in browser IndexedDB",
        "Layer 05 Tag": "LAYER 05",
        "Layer 05 Title": "Vercel Edge Network",
        "Layer 05 Subtitle": "Global Edge & DB",
        "Layer 05 Bullet 1": "Global Edge CDN with sub-100ms TTFB",
        "Layer 05 Bullet 2": "MongoDB Atlas for user bookmarks & cache",
        "Layer 05 Bullet 3": "99.99% uptime with zero server operations",
        "Metric 1 Stat": "< 350 KB",
        "Metric 1 Label": "Initial Bundle Payload",
        "Metric 1 Desc": "Loads in under 1.2s on standard 3G/4G networks across rural and remote monument sites in India.",
        "Metric 2 Stat": "₹0 / User",
        "Metric 2 Label": "Marginal Audio Streaming Cost",
        "Metric 2 Desc": "Client-side Web Speech eliminates expensive cloud audio storage, CDN media streaming, and bandwidth bills.",
        "Metric 3 Stat": "48 Hours",
        "Metric 3 Label": "New Monument Onboarding Cycle",
        "Metric 3 Desc": "Standardized GeoJSON monument data model enables instant verification and nationwide catalog rollout.",
        "Speaker Notes": "Our technical feasibility stems from intentional simplicity. We didn't build expensive server farms or heavy AI pipelines. We combined Next.js 14, Mapbox GL vector clustering, client-side Web Speech, and static GeoJSON cached on Vercel's global edge. The result? A sub-350-kilobyte payload that loads in 1.2 seconds on rural 4G, zero marginal server cost per audio listener, and an onboarding pipeline that catalogs new monuments in just 48 hours."
    },
    6: {
        "Category Kicker (Criterion 5)": "05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY",
        "Main Title Line 1": "3-TIER MONETIZATION",
        "Main Title Line 2": "PHASED NATIONAL EXPANSION",
        "Subtitle": "A financially sustainable model blending government partnerships, micro-transactions, and zero-cost scaling.",
        "Stream 01 Tag": "STREAM 01 · B2G / B2B",
        "Stream 01 Title": "Tourism Boards & Ticketing",
        "Stream 01 Subtitle": "Official State Partnerships & ASI Affiliate",
        "Stream 01 Bullet 1": "State Tourism Dept white-label contracts",
        "Stream 01 Bullet 2": "2%–3% affiliate commission on ASI e-tickets",
        "Stream 01 Bullet 3": "Sponsored heritage circuits licensing",
        "Stream 02 Tag": "STREAM 02 · FREEMIUM (HERO)",
        "Stream 02 Title": "Deep-Dive Audio Walks",
        "Stream 02 Subtitle": "₹49 – ₹99 UPI Micro-Payments",
        "Stream 02 Bullet 1": "Core 90s audio & facts are free forever",
        "Stream 02 Bullet 2": "Premium 25-min immersive narrative walks",
        "Stream 02 Bullet 3": "Instant UPI unlocks without subscriptions",
        "Stream 03 Tag": "STREAM 03 · HYPERLOCAL",
        "Stream 03 Title": "Heritage Commerce",
        "Stream 03 Subtitle": "Curated Artisans & Guided Walks",
        "Stream 03 Bullet 1": "Directory of verified local heritage guides",
        "Stream 03 Bullet 2": "10%–15% commission on GI-tagged craft",
        "Stream 03 Bullet 3": "Hyperlocal culinary & cultural trail tips",
        "Roadmap Header": "SCALABILITY ROADMAP: FROM REGIONAL VALIDATION TO CONTINENTAL REACH",
        "Phase 1 Tag": "PHASE 1 (Q1-Q2 2026)",
        "Phase 1 Title": "Golden Triangle Circuit",
        "Phase 1 Bullet 1": "50 premier monuments with audio",
        "Phase 1 Bullet 2": "Hindi + English Web Speech validation",
        "Phase 1 Bullet 3": "Target: 50,000 monthly active users",
        "Phase 2 Tag": "PHASE 2 (Q3-Q4 2026)",
        "Phase 2 Title": "Pan-India Rollout",
        "Phase 2 Bullet 1": "500 high-footfall sites · 12 states",
        "Phase 2 Bullet 2": "Tamil, Telugu & Bengali voice rollout",
        "Phase 2 Bullet 3": "Target: ₹15L ARR via UPI & B2G pilots",
        "Phase 3 Tag": "PHASE 3 (2027)",
        "Phase 3 Title": "Continental Scale",
        "Phase 3 Bullet 1": "All 3,693 ASI monuments nationwide",
        "Phase 3 Bullet 2": "Cross-border rollout in Nepal & Sri Lanka",
        "Phase 3 Bullet 3": "Target: 1M+ active cultural travelers",
        "Photo 1 Caption": "Cultural Consumer: 300M annual domestic visitors",
        "Photo 2 Caption": "Monumental Scale: 3,693 ASI sites nationwide",
        "Speaker Notes": "How do we monetize and scale? Through three disciplined engines: First, B2G partnerships with State Tourism boards and 2-3% affiliate commissions on official ASI e-tickets. Second, freemium micro-transactions—basic 90-second audio is free forever, with ₹49 UPI unlocks for 25-minute deep-dive walks. Third, hyperlocal commerce commissions with certified local guides and GI-tagged artisans. We scale from the Golden Triangle MVP to all 3,693 monuments nationwide with near-zero added server overhead."
    },
    7: {
        "Category Kicker (Criterion 3)": "06 / JUDGING CRITERION: IMPACT & SOCIAL RELEVANCE",
        "Main Title Line 1": "DEMOCRATIZING HERITAGE FOR",
        "Main Title Line 2": "1.4 BILLION CITIZENS",
        "Subtitle": "Transforming silent stone into living history, breaking linguistic barriers, and revitalizing 3,500 forgotten sites.",
        "Quote": "For the first time, my grandfather could hear the history of our temples in his own language, Tamil, without paying ₹500 to a hurried guide.",
        "Attribution": "— Real Visitor Feedback · Brihadisvara Temple, Thanjavur",
        "Impact Card 1 Symbol": "★",
        "Impact Card 1 Title": "Revitalizing 3,500+ Forgotten Monuments",
        "Impact Card 1 Desc": "90% of tourism footfall in India is concentrated in just 15 mega-sites. Herodotus provides digital visibility and spatial discovery for 3,500+ neglected stepwells, forts, and rock-cut temples across all 28 states.",
        "Impact Card 2 Symbol": "🌐",
        "Impact Card 2 Title": "Breaking the English-Only Tourist Divide",
        "Impact Card 2 Desc": "Existing commercial audio guides cater almost exclusively to foreign or elite English-speaking tourists. Herodotus synthesizes audio in Hindi, Tamil, Bengali, Telugu, and English, restoring cultural heritage to everyday citizens.",
        "Impact Card 3 Symbol": "♿",
        "Impact Card 3 Title": "Universal Accessibility for Non-Readers & Visually Impaired",
        "Impact Card 3 Desc": "An audio-first spatial interface ensures that citizens with visual impairments or low textual literacy can experience the full majesty of India’s historical narratives with complete independence.",
        "Bottom Synthesis Strip": "SOCIAL RELEVANCE: Giving every Indian citizen dignified, equal, mother-tongue access to 4,000 years of living heritage.",
        "Speaker Notes": "Ninety percent of Indian tourists visit the same 15 famous monuments. Herodotus shines a digital spotlight on 3,500 forgotten stepwells and forts across all 28 states. More importantly, by synthesizing audio in regional Indian languages and providing an audio-first interface, we break the elite English-only tourist guide monopoly and give visually impaired citizens and non-readers equal, dignified access to their own heritage."
    },
    8: {
        "Category Badge": "IDEA FORGE 2026 · FINAL PITCH SUMMARY",
        "Headline Line 1": "History is everywhere.",
        "Headline Line 2": "Now, it can speak.",
        "Supertitle / Tagline": "HERODOTUS — GIVING INDIA'S LIVING STONE A VOICE IN EVERY POCKET",
        "Anchor 1 Title": "✓ LIVE WORKING MVP",
        "Anchor 1 Desc": "Complete end-to-end PWA ready for live judge testing on mobile devices with Mapbox spatial clustering and Web Speech synthesis.",
        "Anchor 2 Title": "✓ ZERO-COST MARGINAL SCALE",
        "Anchor 2 Desc": "Client-side browser architecture eliminates expensive streaming servers, allowing seamless nationwide expansion across 3,693 sites.",
        "Anchor 3 Title": "✓ HIGH SOCIAL IMPACT",
        "Anchor 3 Desc": "Multilingual inclusion in 5+ Indian languages, revitalizing 3,500 neglected monuments and serving visually impaired citizens.",
        "CTA Banner": "EXPERIENCE THE LIVE MVP DEMO: https://herodotus-guide.vercel.app",
        "Thank You Header": "Thank You, Respected Judges! We are now open for Questions & Live Smartphone Demonstration.",
        "Bullet 1": "Fully responsive PWA · Testable right now on your smartphone in any modern browser",
        "Bullet 2": "Open-access unified catalog · 3,693 ASI monuments documented for public heritage education",
        "Sub-footer": "Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon",
        "Speaker Notes": "History is everywhere. Now, it can speak. We have a live working MVP ready on your phones right now at herodotus-guide.vercel.app. Thank you, judges. We are excited to take your questions and demonstrate the product live."
    }
}

def clean(s):
    if not s:
        return ""
    # Normalize smart quotes, dashes, whitespace
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = s.replace('—', '-').replace('–', '-').replace('…', '...')
    s = " ".join(s.split())
    return s.lower()

print("=" * 70)
print("AUDITING HERODOTUS DECK FOR VERBATIM TEXT PRESERVATION")
print("=" * 70)

total_items = 0
passed_items = 0
failed_items = []
speaker_note_results = []

with zipfile.ZipFile(pptx_path, 'r') as z:
    for slide_idx in range(1, 9):
        slide_xml = f"ppt/slides/slide{slide_idx}.xml"
        notes_xml = f"ppt/notesSlides/notesSlide{slide_idx}.xml"
        
        # Read slide texts
        root_slide = ET.fromstring(z.read(slide_xml))
        slide_text_nodes = [elem.text for elem in root_slide.iter() if elem.text]
        slide_full = " ".join(slide_text_nodes)
        clean_slide = clean(slide_full)
        
        # Read notes texts
        notes_full = ""
        clean_notes = ""
        if notes_xml in z.namelist():
            root_notes = ET.fromstring(z.read(notes_xml))
            notes_text_nodes = [elem.text for elem in root_notes.iter() if elem.text]
            notes_full = " ".join(notes_text_nodes)
            clean_notes = clean(notes_full)
        
        combined_clean = clean_slide + " " + clean_notes
        
        print(f"\n--- AUDITING SLIDE {slide_idx} ({len(CATALOG[slide_idx])} items) ---")
        
        for label, text in CATALOG[slide_idx].items():
            total_items += 1
            c_text = clean(text)
            
            # If this is speaker notes, test against clean_notes directly
            if label == "Speaker Notes":
                if c_text in clean_notes:
                    passed_items += 1
                    speaker_note_results.append((slide_idx, True, len(text)))
                    print(f"  [PASS] {label} (Exact verbatim match, {len(text)} chars)")
                else:
                    failed_items.append((slide_idx, label, text, "Not found in notesSlide XML"))
                    speaker_note_results.append((slide_idx, False, len(text)))
                    print(f"  [FAIL] {label}")
            else:
                if c_text in combined_clean:
                    passed_items += 1
                    print(f"  [PASS] {label}")
                else:
                    failed_items.append((slide_idx, label, text, "Text missing from slide XML"))
                    print(f"  [FAIL] {label} -> Target: '{text[:60]}...'")

print("\n" + "=" * 70)
print(f"AUDIT SUMMARY: {passed_items}/{total_items} items PASSED ({passed_items/total_items*100:.1f}%)")
print("=" * 70)

if failed_items:
    print("\nFAILED ITEMS:")
    for s_idx, lbl, txt, reason in failed_items:
        print(f"  Slide {s_idx} | {lbl} | {reason} | Text: '{txt}'")
    sys.exit(1)
else:
    print("\nALL VERBATIM TEXT CATALOG ITEMS CONFIRMED 100% PRESERVED!")

# Verify judging criteria explicitly
print("\n" + "=" * 70)
print("VERIFYING 5 HACKATHON JUDGING CRITERIA COVERAGE")
print("=" * 70)

CRITERIA = {
    1: ("Criterion 1: Innovation & Originality", 3, "02 / JUDGING CRITERION: INNOVATION & ORIGINALITY"),
    2: ("Criterion 2: Feasibility & Technical Viability", 5, "04 / JUDGING CRITERION: FEASIBILITY & TECHNICAL VIABILITY"),
    3: ("Criterion 3: Impact & Social Relevance", 7, "06 / JUDGING CRITERION: IMPACT & SOCIAL RELEVANCE"),
    4: ("Criterion 4: Product Experience & Demo (Presentation & Clarity)", 4, "03 / JUDGING CRITERION: PRESENTATION & CLARITY"),
    5: ("Criterion 5: Business Model & Scalability", 6, "05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY")
}

with zipfile.ZipFile(pptx_path, 'r') as z:
    for crit_num, (name, target_slide, kicker_str) in CRITERIA.items():
        slide_xml = f"ppt/slides/slide{target_slide}.xml"
        root = ET.fromstring(z.read(slide_xml))
        txts = " ".join([elem.text for elem in root.iter() if elem.text])
        if clean(kicker_str) in clean(txts):
            print(f"  [PASS] {name} -> Present on Slide {target_slide} (Kicker: '{kicker_str}')")
        else:
            print(f"  [FAIL] {name} -> Missing on Slide {target_slide}")
            sys.exit(2)

print("\nALL 5 JUDGING CRITERIA FULLY ADDRESSED & VERIFIED!")
