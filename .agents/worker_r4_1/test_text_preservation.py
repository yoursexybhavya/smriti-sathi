import sys
import zipfile
import xml.etree.ElementTree as ET

pptx_path = 'Herodotus_Pitch_Presentation.pptx'

# Strings to check per slide from Section 1.2 of explorer_r4_2/handoff.md
EXPECTED = {
    1: [
        "IDEA FORGE 2026 · LIVE WORKING PWA READY",
        "HERODOTUS",
        "Giving India’s Living Stone a Voice in Every Pocket",
        "An interactive, map-first web companion putting 4,000 years of Indian heritage into every traveler's pocket — with instant multilingual audio, curated architectural stories, and verified on-site visitor facts.",
        "MAP-FIRST DISCOVERY",
        "WEB SPEECH AUDIO",
        "ZERO-FRICTION PWA",
        "★ LIVE WORKING MVP READY ON SMARTPHONES",
        "Next.js 14 · Mapbox GL · Browser Web Speech API · Vercel Edge",
        "herodotus-guide.vercel.app · 3,693 ASI Monuments Unified",
        "Amer Fort & Palace",
        "Jaipur, Rajasthan · UNESCO World Heritage Site #247",
        "Rajput-Mughal Architecture · Founded 1592 CE",
        "Perched high on the rugged Aravalli hills, Amer Fort witnessed four centuries of living history. Yet today, millions of domestic tourists walk through its monumental Sun Gate in silence without hearing its stories.",
        "400-Year Living Stone",
        "5 Indian Languages",
        "Zero App Download",
        "On-Site GPS Guide",
        "Cover Photography: Sunset over Amer Fort ramparts",
        "Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon · Free Public Access · Built for 1.4 Billion Citizens",
        "Respected judges, imagine standing before the 400-year-old Amer Fort in Jaipur"
    ],
    2: [
        "01 / THE VISITOR FRICTION",
        "Standing in Front of History",
        "Where’s the Story?",
        "India preserves 3,693 protected monuments, yet 98% offer zero native digital context on-site.",
        "THE ON-SITE REALITY: 300M+ domestic travelers walk past world-changing heritage in complete silence — facing weathered placards and fragmented information.",
        "01",
        "Scattered & Unverified Historical Context",
        "On-site tourists struggle to find verified stories. Critical historical narratives are buried in unverified blogs, fragmented search tabs, or eroded physical placards.",
        "02",
        "Dispersed Logistics & Outdated Tariffs",
        "Official opening hours, differential domestic vs. international tariffs, and ticketing portals are spread across disparate databases, causing visitor confusion and tout exploitation.",
        "03",
        "Expensive Guide Monopoly & Language Divide",
        "Tourists face an unfair choice: pay ₹300–₹500 for unverified touts or walk in silence. Audio guides exist at <1% of sites and are almost exclusively in English.",
        "THE CORE REALITY: The history exists. The information exists. But the digital connection is broken.",
        "India is blessed with 3,693 ASI-protected monuments, but for 98% of them, the visitor experience is completely broken."
    ],
    3: [
        "02 / JUDGING CRITERION: INNOVATION & ORIGINALITY",
        "Spatial-First Discovery",
        "Keyword Search",
        "Monuments are physical coordinates on earth, not search queries in a database.",
        "PARADIGM SHIFT: Replacing keyword search boxes with an interactive, 60 FPS spatial map covering 3,693 geocoded monuments.",
        "TRADITIONAL VISITOR JOURNEY (STATUS QUO)",
        "Keyword Search: ",
        "Must know exact monument spellings in advance; zero serendipity.",
        "Bulky 150MB Apps: ",
        "Heavy downloads that stall on 3G, or expensive hardware booths.",
        "English Monopoly: ",
        "Audio guides exist at <30 sites, costing ₹300+ in English only.",
        "★ HERODOTUS SPATIAL COMPANION (BREAKTHROUGH)",
        "Map-First Cartography: ",
        "Dynamic 60 FPS vector map across 3,693 geocoded ASI monuments.",
        "Zero-Friction PWA: ",
        "Sub-350KB payload, instant browser access, zero app downloads.",
        "Linguistic Inclusion: ",
        "Mother-tongue narration in 5+ Indian languages at ₹0 cost.",
        "DYNAMIC SPATIAL ENGINE: 3,693 monument coordinates clustered with Mapbox Supercluster. As travelers explore regions, clusters dynamically expand into verified cultural dossiers.",
        "Core Originality: Transforming static geo-coordinates into living, voice-narrated cultural dossiers at zero marginal server cost.",
        "We asked a fundamental question: Why are we searching for monuments using text boxes, when history lives on physical ground?"
    ],
    4: [
        "03 / JUDGING CRITERION: PRESENTATION & CLARITY",
        "From Map to Monument",
        "10 Seconds",
        "A seamless, zero-friction web flow taking travelers from national cartography to verified audio in 4 steps.",
        "ON-SITE EXPERIENCE: Zero download required. A traveler stands at Amer Fort, taps their browser, and listens to verified narratives in their mother tongue.",
        "herodotus-guide.vercel.app/explore/amer-fort",
        "Amer Fort & Palace · Rajput-Mughal Architecture (1592 CE)",
        "PLAYING AUDIO GUIDE · 01:24 / 03:42 · Web Speech (Hindi / English)",
        "01:24",
        "03:42",
        "Timings: 08:00 – 17:30",
        "Tariff: ₹100 (Ind) / ₹500 (Int)",
        "Verified Official ASI E-Ticket Portal",
        "Instant Audio in 5 Indian Languages",
        "GPS Proximity Sync · Offline Audio Cached locally in IndexedDB",
        "STEP 01",
        "01 · LOCATE",
        "Open browser, explore smooth Mapbox vector canvas with 3,693 dynamically clustered pins.",
        "STEP 02",
        "02 · CONTEXTUALIZE",
        "Tap any monument to open curated architectural highlights, dynasty timelines, and verified photography.",
        "STEP 03 · AUDIO",
        "03 · LISTEN",
        "Hit Play for instant Web Speech audio narration in your mother tongue — zero file downloads, zero latency.",
        "STEP 04",
        "04 · PLAN",
        "Access official ASI ticket booking portals, real-time hours, and direct turn-by-turn navigation.",
        "Here is our working MVP in action. A traveler opens herodotus-guide in any mobile browser"
    ],
    5: [
        "04 / JUDGING CRITERION: FEASIBILITY & TECHNICAL VIABILITY",
        "Lightweight MVP Architecture",
        "Infinite Scalability",
        "Engineered on modern browser standards for zero server streaming costs, sub-second loads, and offline reliability.",
        "LAYER 01",
        "Next.js 14 PWA",
        "Client Frontend",
        "Zero app-store friction or downloads",
        "Installable PWA with offline Service Worker",
        "Tailwind CSS for responsive budget mobile UI",
        "LAYER 02",
        "Mapbox GL JS",
        "Spatial Engine",
        "60 FPS vector map rendering canvas",
        "Supercluster pin clustering for 3,693 sites",
        "GeoJSON boundary overlays & terrain tilt",
        "LAYER 03 · CORE TECH",
        "Web Speech API",
        "Native Audio Engine",
        "Client device speech synthesis engine",
        "Zero audio streaming bandwidth or CDN costs",
        "5+ languages: Hindi, Tamil, Bengali, Telugu, EN",
        "LAYER 04",
        "GeoJSON Catalog",
        "Data Pipeline",
        "Unified schema for 3,693 ASI monuments",
        "Verified timings, entry tariffs & histories",
        "Cached locally in browser IndexedDB",
        "LAYER 05",
        "Vercel Edge Network",
        "Global Edge & DB",
        "Global Edge CDN with sub-100ms TTFB",
        "MongoDB Atlas for user bookmarks & cache",
        "99.99% uptime with zero server operations",
        "< 350 KB",
        "Initial Bundle Payload",
        "Loads in under 1.2s on standard 3G/4G networks across rural and remote monument sites in India.",
        "₹0 / User",
        "Marginal Audio Streaming Cost",
        "Client-side Web Speech eliminates expensive cloud audio storage, CDN media streaming, and bandwidth bills.",
        "48 Hours",
        "New Monument Onboarding Cycle",
        "Standardized GeoJSON monument data model enables instant verification and nationwide catalog rollout.",
        "Our technical feasibility stems from intentional simplicity. We didn't build expensive server farms"
    ],
    6: [
        "05 / JUDGING CRITERION: BUSINESS MODEL & SCALABILITY",
        "3-Tier Monetization &",
        "Phased National Expansion",
        "A financially sustainable model blending government partnerships, micro-transactions, and zero-cost scaling.",
        "STREAM 01 · B2G / B2B",
        "Tourism Boards & Ticketing",
        "Official State Partnerships & ASI Affiliate",
        "State Tourism Dept white-label contracts",
        "2%–3% affiliate commission on ASI e-tickets",
        "Sponsored heritage circuits licensing",
        "STREAM 02 · FREEMIUM (HERO)",
        "Deep-Dive Audio Walks",
        "₹49 – ₹99 UPI Micro-Payments",
        "Core 90s audio & facts are free forever",
        "Premium 25-min immersive narrative walks",
        "Instant UPI unlocks without subscriptions",
        "STREAM 03 · HYPERLOCAL",
        "Heritage Commerce",
        "Curated Artisans & Guided Walks",
        "Directory of verified local heritage guides",
        "10%–15% commission on GI-tagged craft",
        "Hyperlocal culinary & cultural trail tips",
        "SCALABILITY ROADMAP: FROM REGIONAL VALIDATION TO CONTINENTAL REACH",
        "PHASE 1 (Q1-Q2 2026)",
        "Golden Triangle Circuit",
        "50 premier monuments with audio",
        "Hindi + English Web Speech validation",
        "Target: 50,000 monthly active users",
        "PHASE 2 (Q3-Q4 2026)",
        "Pan-India Rollout",
        "500 high-footfall sites · 12 states",
        "Tamil, Telugu & Bengali voice rollout",
        "Target: ₹15L ARR via UPI & B2G pilots",
        "PHASE 3 (2027)",
        "Continental Scale",
        "All 3,693 ASI monuments nationwide",
        "Cross-border rollout in Nepal & Sri Lanka",
        "Target: 1M+ active cultural travelers",
        "Cultural Consumer: 300M annual domestic visitors",
        "Monumental Scale: 3,693 ASI sites nationwide",
        "How do we monetize and scale? Through three disciplined engines:"
    ],
    7: [
        "06 / JUDGING CRITERION: IMPACT & SOCIAL RELEVANCE",
        "Democratizing Heritage for",
        "1.4 Billion Citizens",
        "Transforming silent stone into living history, breaking linguistic barriers, and revitalizing 3,500 forgotten sites.",
        "For the first time, my grandfather could hear the history of our temples in his own language, Tamil, without paying ₹500 to a hurried guide.",
        "— Real Visitor Feedback · Brihadisvara Temple, Thanjavur",
        "★",
        "Revitalizing 3,500+ Forgotten Monuments",
        "90% of tourism footfall in India is concentrated in just 15 mega-sites. Herodotus provides digital visibility and spatial discovery for 3,500+ neglected stepwells, forts, and rock-cut temples across all 28 states.",
        "🌐",
        "Breaking the English-Only Tourist Divide",
        "Existing commercial audio guides cater almost exclusively to foreign or elite English-speaking tourists. Herodotus synthesizes audio in Hindi, Tamil, Bengali, Telugu, and English, restoring cultural heritage to everyday citizens.",
        "♿",
        "Universal Accessibility for Non-Readers & Visually Impaired",
        "An audio-first spatial interface ensures that citizens with visual impairments or low textual literacy can experience the full majesty of India’s historical narratives with complete independence.",
        "SOCIAL RELEVANCE: Giving every Indian citizen dignified, equal, mother-tongue access to 4,000 years of living heritage.",
        "Ninety percent of Indian tourists visit the same 15 famous monuments. Herodotus shines a digital spotlight on 3,500 forgotten stepwells and forts across all 28 states."
    ],
    8: [
        "IDEA FORGE 2026 · FINAL PITCH SUMMARY",
        "History is everywhere.",
        "Now, it can speak.",
        "HERODOTUS — GIVING INDIA'S LIVING STONE A VOICE IN EVERY POCKET",
        "✓ LIVE WORKING MVP",
        "Complete end-to-end PWA ready for live judge testing on mobile devices with Mapbox spatial clustering and Web Speech synthesis.",
        "✓ ZERO-COST MARGINAL SCALE",
        "Client-side browser architecture eliminates expensive streaming servers, allowing seamless nationwide expansion across 3,693 sites.",
        "✓ HIGH SOCIAL IMPACT",
        "Multilingual inclusion in 5+ Indian languages, revitalizing 3,500 neglected monuments and serving visually impaired citizens.",
        "EXPERIENCE THE LIVE MVP DEMO: https://herodotus-guide.vercel.app",
        "Thank You, Respected Judges! We are now open for Questions & Live Smartphone Demonstration.",
        "Fully responsive PWA · Testable right now on your smartphone in any modern browser",
        "Open-access unified catalog · 3,693 ASI monuments documented for public heritage education",
        "Team Herodotus · IDEA FORGE 2026 Pitch-A-Thon",
        "History is everywhere. Now, it can speak. We have a live working MVP ready on your phones right now at herodotus-guide.vercel.app."
    ]
}

def normalize(text):
    return " ".join(text.replace("’", "'").replace("—", "-").replace("–", "-").split()).lower()

with zipfile.ZipFile(pptx_path, 'r') as z:
    total_checks = 0
    passed_checks = 0
    failed_checks = []

    for slide_num in range(1, 9):
        slide_xml_path = f"ppt/slides/slide{slide_num}.xml"
        slide_root = ET.fromstring(z.read(slide_xml_path))
        slide_texts = [node.text for node in slide_root.iter() if node.text]
        
        notes_xml_path = f"ppt/notesSlides/notesSlide{slide_num}.xml"
        notes_texts = []
        if notes_xml_path in z.namelist():
            notes_root = ET.fromstring(z.read(notes_xml_path))
            notes_texts = [node.text for node in notes_root.iter() if node.text]
        
        combined_text = " ".join(slide_texts + notes_texts)
        norm_combined = normalize(combined_text)

        for expected_str in EXPECTED[slide_num]:
            total_checks += 1
            norm_exp = normalize(expected_str)
            if norm_exp in norm_combined:
                passed_checks += 1
            else:
                failed_checks.append((slide_num, expected_str))

    print(f"Total Text Checks: {total_checks}")
    print(f"Passed Checks: {passed_checks}")
    if failed_checks:
        print(f"FAILED CHECKS ({len(failed_checks)}):")
        for s_num, exp in failed_checks:
            print(f"  Slide {s_num}: '{exp}'")
        sys.exit(1)
    else:
        print("ALL VERBATIM TEXT CHECKS PASSED WITH 100% ACCURACY!")
        sys.exit(0)
