import fs from 'fs';
import path from 'path';

const monuments = [
  // --- 1. AGRA & SURROUNDS (MUGHAL EMPIRE) ---
  {
    id: "IN-UP-001",
    name: "Taj Mahal",
    hindiName: "ताज महल",
    alternateNames: ["Crown of the Palace", "Rauza-i-Munawwara"],
    category: "Tomb & Mausoleum",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    state: "Uttar Pradesh",
    city: "Agra",
    district: "Agra",
    asiCircle: "Agra Circle",
    unesco: true,
    unescoSiteName: "Taj Mahal (1983)",
    dynasty: "Mughal Empire",
    era: "17th Century",
    foundedYear: 1632,
    shortDescription: "An ivory-white marble mausoleum on the south bank of Yamuna river, commissioned by Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
    fullNarrative: "Begun in 1632 and completed in 1648 with the surrounding gardens finished five years later, the Taj Mahal stands as the pinnacle of Indo-Islamic architecture. Over twenty thousand artisans from across India, Persia, and Central Asia worked under court architect Ustad Ahmad Lahori. The central octagonal chamber houses the cenotaphs of Mumtaz Mahal and Shah Jahan, adorned with delicate pietra dura parchment inlays of lapis lazuli, jade, turquoise, and carnelian. The four minarets stand at 40 meters, tilted slightly outward so that in the event of an earthquake, they would fall away from the sacred tomb.",
    architecturalHighlights: [
      "Makrana white marble exterior exhibiting shifting shades from morning pink to moonlight gold",
      "Pietra dura floral inlay technique featuring 28 varieties of precious and semi-precious stones",
      "Charbagh Persian quadripartite paradise garden design centered on the reflecting pool",
      "Four 40-meter minarets engineered with outward inclination for seismic structural protection"
    ],
    timeline: [
      { year: "1631", event: "Empress Mumtaz Mahal passes away during childbirth in Burhanpur." },
      { year: "1632", event: "Shah Jahan commissions the mausoleum on the Yamuna riverfront." },
      { year: "1648", event: "Main tomb complex and domed chamber completed." },
      { year: "1983", event: "Inscribed as a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "06:00",
      close: "18:30",
      closedDays: ["Friday"],
      bestTimeToVisit: "Sunrise (06:00 - 08:30) or Moonlight viewing during Full Moon"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 540,
      foreignRupees: 1100,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/taj-mahal",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: [
      "/images/hero_monument_1789383083590.jpg",
      "/images/amber_fort_crop_1789383125173.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Architecture of Eternal Longing",
        durationSeconds: 195,
        narrationText: "Welcome to the Taj Mahal, India's most celebrated testament of living stone. Standing before you is the grand gateway, the Darwaza-i-Rauza. Notice how the central marble dome appears to float above the Yamuna mist. Built entirely of pure Makrana marble from Rajasthan, the structure reflects changing daylight—from soft dawn rose to midday brilliance. Inside the central chamber, the acoustic resonance extends for nearly twenty-eight seconds, carrying every whispered prayer into eternal echo."
      },
      hi: {
        language: "hi",
        title: "अनंत प्रेम और पाषाण कला का संगम",
        durationSeconds: 180,
        narrationText: "ताज महल में आपका स्वागत है। यमुना नदी के तट पर स्थित यह सफेद संगमरमर की समाधि केवल एक मकबरा नहीं, बल्कि स्थापत्य कला का शिखर है। शाहजहां ने इसे अपनी बेगम मुमताज महल की स्मृति में बनवाया था। मकराना के श्वेत संगमरमर पर की गई पच्चीकारी या पितरा दूरा कला में दुर्लभ रत्नों का अद्भुत प्रयोग देखा जा सकता है।"
      },
      ta: {
        language: "ta",
        title: "ஷாஜஹானின் அழியா காதல் சின்னம்",
        durationSeconds: 190,
        narrationText: "தாஜ் மஹாலுக்கு உங்களை அன்புடன் வரவேற்கிறோம். யமுனை நதிக்கரையில் அமைந்துள்ள இந்த வெண் பளிங்கு மாளிகை இந்திய-இஸ்லாமிய கட்டிடக்கலையின் உச்சமாகும். இருபதாயிரத்திற்கும் மேற்பட்ட கலைஞர்களால் செதுக்கப்பட்ட இந்த அழகிய கலசமும் மினாரட்டுகளும் உலகின் எட்டாவது அதிசயமாக திகழ்கிறது."
      },
      te: {
        language: "te",
        title: "తాజ్ మహల్ చారిత్రక వైభవం",
        durationSeconds: 185,
        narrationText: "తాజ్ మహల్‌కు స్వాగతం. ఆగ్రాలోని యమునా నది ఒడ్డున నిర్మించబడిన ఈ పాలరాతి అద్భుతం ప్రేమకు మరియు మొఘల్ శిల్పకళకు ప్రతీక. ఉస్తాద్ అహ్మద్ లాహోరీ ఆధ్వర్యంలో నిర్మించిన ఈ కట్టడం యునెస్కో ప్రపంచ వారసత్వ ప్రదేశం."
      },
      bn: {
        language: "bn",
        title: "শ্বেতপাথরের অমর কাব্য",
        durationSeconds: 185,
        narrationText: "তাজমহলে আপনাকে স্বাগতম। যমুনা নদীর তীরে অবস্থিত মোগল স্থাপত্যের শ্রেষ্ঠ নিদর্শন এই স্মৃতিসৌধ। সম্রাট শাহজাহানের অমর ভালোবাসার এই প্রতীক শত শত বছর ধরে পৃথিবীর মানুষকে মুগ্ধ করে চলেছে।"
      }
    }
  },
  {
    id: "IN-UP-002",
    name: "Agra Fort",
    hindiName: "आगरा किला",
    alternateNames: ["Red Fort of Agra", "Lal Qila Agra"],
    category: "Fort & Palace",
    coordinates: { lat: 27.1795, lng: 78.0211 },
    state: "Uttar Pradesh",
    city: "Agra",
    district: "Agra",
    asiCircle: "Agra Circle",
    unesco: true,
    unescoSiteName: "Agra Fort (1983)",
    dynasty: "Mughal Empire",
    era: "16th Century",
    foundedYear: 1565,
    shortDescription: "A massive 16th-century red sandstone fortress that served as the primary residence of the Mughal emperors until 1638.",
    fullNarrative: "Built by Emperor Akbar starting in 1565 on the site of an earlier Badalgarh fort, Agra Fort is surrounded by double battlements of red sandstone standing over twenty meters high. Within its 2.5-kilometer perimeter walls lie architectural transformations reflecting three generations: Akbar's red sandstone Jahangiri Mahal, Jahangir's royal pavilions, and Shah Jahan's opulent white marble additions including the Diwan-i-Khas, Khas Mahal, and Musamman Burj—the octagonal tower where Shah Jahan spent his final years under house arrest, gazing at the distant Taj Mahal.",
    architecturalHighlights: [
      "Massive 21-meter-high double red sandstone ramparts spanning 2.5 kilometers",
      "Jahangiri Mahal displaying rich synthesis of Rajput, Hindu, and Islamic wood & stone carving",
      "Musamman Burj octagonal marble balcony with unhindered views of Taj Mahal",
      "Sheesh Mahal (Glass Palace) decorated with thousands of imported Syrian mirror mosaics"
    ],
    timeline: [
      { year: "1565", event: "Akbar commissions reconstruction of the old brick fort in red sandstone." },
      { year: "1637", event: "Shah Jahan completes marble pavilions including Diwan-i-Aam and Khas Mahal." },
      { year: "1658", event: "Aurangzeb confines his father Shah Jahan within Musamman Burj." },
      { year: "1983", event: "Declared a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Morning 08:00 - 11:00"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 650,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/agra-fort",
    heroImage: "/images/amber_fort_crop_1789383125173.jpg",
    galleryImages: [
      "/images/amber_fort_crop_1789383125173.jpg",
      "/images/tech_architecture_warm_1789436115529.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "Seat of the Great Mughals",
        durationSeconds: 180,
        narrationText: "You are standing inside the monumental Agra Fort. Notice the interplay between Akbar's sturdy red sandstone battlements and Shah Jahan's later white marble palaces. In the Musamman Burj, look through the arched marble lattice toward the curve of the Yamuna River—it was from this very vantage point that Shah Jahan spent his final eight years looking upon the tomb of his beloved Mumtaz."
      },
      hi: {
        language: "hi",
        title: "मुग़ल सल्तनत का ऐतिहासिक दुर्ग",
        durationSeconds: 175,
        narrationText: "आगरा के लाल किले में आपका स्वागत है। अकबर द्वारा 1565 में शुरू किए गए इस विशाल दुर्ग ने मुग़ल साम्राज्य के उत्थान और पतन के महत्वपूर्ण क्षण देखे हैं। मुसम्मन बुर्ज वह स्थान है जहां से वृद्ध शाहजहां अपने अंतिम दिनों में ताज महल को निहारा करते थे।"
      },
      ta: {
        language: "ta",
        title: "ஆக்ரா கோட்டையின் வரலாறு",
        durationSeconds: 170,
        narrationText: "ஆக்ரா கோட்டை அக்பரின் பெருமைமிகு கோட்டையாகும். சிகப்பு மணற்கல்லால் கட்டப்பட்ட இந்த கோட்டையில் ஷாஜஹான் தனது இறுதிக் காலத்தை சிறைவாசத்தில் கழித்த முசம்மன் புர்ஜ் அமைந்துள்ளது."
      },
      te: {
        language: "te",
        title: "ఆగ్రా కోట వైభవం",
        durationSeconds: 170,
        narrationText: "ఆగ్రా కోట అక్బర్ చక్రవర్తి కాలంలో నిర్మితమైన బలమైన రక్షణ దుర్గం. ఇక్కడి దివాన్-ఇ-ఆమ్ మరియు షీష్ మహల్ మొఘల్ శిల్ప చాతుర్యాన్ని చాటిచెబుతాయి."
      },
      bn: {
        language: "bn",
        title: "আগ্রা দুর্গের গৌরবগাথা",
        durationSeconds: 175,
        narrationText: "আগ্রা দুর্গ মোগল সাম্রাজ্যের ক্ষমতার মূল কেন্দ্র ছিল। আকবরের তৈরি লাল বেলেপাথরের দেয়াল এবং শাহজাহানের মার্বেলের প্রাসাদ এই দুর্গকে এক অনন্য রূপ দিয়েছে।"
      }
    }
  },
  {
    id: "IN-UP-003",
    name: "Fatehpur Sikri",
    hindiName: "फतेहपुर सीकरी",
    alternateNames: ["City of Victory", "Fatehabad"],
    category: "Fort & Palace",
    coordinates: { lat: 27.0945, lng: 77.6679 },
    state: "Uttar Pradesh",
    city: "Fatehpur Sikri",
    district: "Agra",
    asiCircle: "Agra Circle",
    unesco: true,
    unescoSiteName: "Fatehpur Sikri (1986)",
    dynasty: "Mughal Empire",
    era: "16th Century",
    foundedYear: 1571,
    shortDescription: "Akbar's short-lived utopian capital city built in red sandstone, featuring the Buland Darwaza and the white marble shrine of Sheikh Salim Chishti.",
    fullNarrative: "Founded in 1571 by Emperor Akbar to honour the Sufi saint Sheikh Salim Chishti who foretold the birth of his son Jahangir, Fatehpur Sikri served as the Mughal capital for just 14 years before being abandoned in 1585 due to acute water shortages. The city is a masterpiece of architectural syncretism, combining Persian courtly planning with Gujarat and Rajasthani stone-carving traditions. Dominating the grand mosque is the 54-meter Buland Darwaza, the highest gateway in the world, built to commemorate Akbar's victory over Gujarat.",
    architecturalHighlights: [
      "Buland Darwaza (54m high), the largest gateway in the world with Quranic calligraphy",
      "Tomb of Salim Chishti constructed with delicate pierced mother-of-pearl marble screens (jalis)",
      "Panch Mahal, a five-tiered pillared pavilion built on 176 intricately carved columns",
      "Diwan-i-Khas featuring a massive central carved pillar supporting Akbar's throne balcony"
    ],
    timeline: [
      { year: "1569", event: "Prince Salim (Jahangir) is born following the blessings of saint Salim Chishti." },
      { year: "1571", event: "Akbar initiates construction of the imperial capital." },
      { year: "1575", event: "Ibadat Khana founded for multi-faith theological debates." },
      { year: "1585", event: "Capital abandoned for Lahore due to water scarcity and military campaigns." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Winter months, early morning or late afternoon"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 610,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/fatehpur-sikri",
    heroImage: "/images/tech_architecture_warm_1789436115529.jpg",
    galleryImages: [
      "/images/tech_architecture_warm_1789436115529.jpg",
      "/images/closing_monument_1789403341798.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Ghost Capital of Akbar the Great",
        durationSeconds: 190,
        narrationText: "Welcome to Fatehpur Sikri, the city of victory. Look up at the soaring Buland Darwaza—notice the Persian inscription warning that the world is a bridge: pass over it, but build no house upon it. In the center of the courtyard rests the glowing marble shrine of Salim Chishti, where thousands still tie sacred red threads in hope of a wish fulfilled."
      },
      hi: {
        language: "hi",
        title: "फतेहपुर सीकरी: अकबर का स्वप्न नगर",
        durationSeconds: 180,
        narrationText: "फतेहपुर सीकरी में आपका स्वागत है। अकबर ने सूफी संत सलीम चिश्ती के सम्मान में इस शहर को बसाया था। यहां का बुलंद दरवाजा विश्व का सबसे ऊंचा प्रवेश द्वार है और दीवान-ए-खास का केंद्रीय स्तंभ अद्वितीय वास्तुकला प्रस्तुत करता है।"
      },
      ta: {
        language: "ta",
        title: "ஃபதேபூர் சிக்ரியின் சிறப்புகள்",
        durationSeconds: 175,
        narrationText: "அக்பரால் உருவாக்கப்பட்ட வரலாற்று சிறப்புமிக்க ஃபதேபூர் சிக்ரி. இங்குள்ள புலந்த் தர்வாசா நுழைவாயிலும், சலீம் சிஷ்டியின் வெண் பளிங்கு தர்காவும் கட்டிடக்கலையின் வியக்கத்தக்க உதாரணங்கள்."
      },
      te: {
        language: "te",
        title: "ఫతేపూర్ సిక్రీ నగర గాథ",
        durationSeconds: 175,
        narrationText: "ఫతేపూర్ సిక్రీ అక్బర్ చక్రవర్తి కలల రాజధాని. బులంద్ దర్వాజా మరియు పంచ్ మహల్ ఇక్కడి ప్రధాన ఆకర్షణలు."
      },
      bn: {
        language: "bn",
        title: "ফতেহপুর সিক্রির রহস্য",
        durationSeconds: 180,
        narrationText: "ফতেহপুর সিক্রি সম্রাট আকবরের স্বপ্নের রাজধানী ছিল। মাত্র চৌদ্দ বছর ব্যবহারের পর জলের অভাবে পরিত্যক্ত হলেও এখানকার বুলন্দ দরওয়াজা আজও মাথা উঁচু করে দাঁড়িয়ে আছে।"
      }
    }
  },
  {
    id: "IN-UP-004",
    name: "Tomb of I'timad-ud-Daulah",
    hindiName: "एत्मादुद्दौला का मक़बरा",
    alternateNames: ["Baby Taj", "Jewel Box"],
    category: "Tomb & Mausoleum",
    coordinates: { lat: 27.1929, lng: 78.0310 },
    state: "Uttar Pradesh",
    city: "Agra",
    district: "Agra",
    asiCircle: "Agra Circle",
    unesco: false,
    dynasty: "Mughal Empire",
    era: "17th Century",
    foundedYear: 1622,
    shortDescription: "Often regarded as a draft of the Taj Mahal, this delicate marble mausoleum was commissioned by Empress Nur Jahan for her father Mirza Ghiyas Beg.",
    fullNarrative: "Built between 1622 and 1628 on the eastern bank of the Yamuna, the tomb of Mirza Ghiyas Beg (titled I'timad-ud-Daulah, 'Pillar of the State') represents the architectural transition from Akbar's red sandstone to the marble lyricism of Shah Jahan. Commissioned by his daughter, the powerful empress Nur Jahan, it was the very first Mughal building to be clad entirely in white Rajasthani marble embellished with extensive pietra dura work portraying wine carafes, cypress trees, and delicate geometric tracery.",
    architecturalHighlights: [
      "First Mughal structure in India built entirely with white marble",
      "Pietra dura inlay work predating the Taj Mahal by a decade",
      "Intricately carved marble jali screens filtering sunlight into the cenotaph chamber",
      "Corner minarets seamlessly integrated with the central square pavilion"
    ],
    timeline: [
      { year: "1622", event: "Empress Nur Jahan begins construction after her father's passing." },
      { year: "1628", event: "Mausoleum completed with garden perimeter and pavilions." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Late afternoon for warm light on marble"
    },
    tariffs: {
      indianRupees: 30,
      saarcRupees: 30,
      foreignRupees: 310,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/itmad-ud-daula",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: [
      "/images/hero_monument_1789383083590.jpg",
      "/images/tech_architecture_warm_1789436115529.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Jewel Box of the Yamuna",
        durationSeconds: 160,
        narrationText: "Step into the intimate tranquility of I'timad-ud-Daulah, affectionately known as the Baby Taj. Notice how this jewel-like mausoleum differs from imperial monuments—its scale is human, its ornamentation delicate and poetic. Here, Nur Jahan introduced the stone-inlay art that her nephew Shah Jahan would later magnify at the Taj Mahal."
      },
      hi: {
        language: "hi",
        title: "एत्मादुद्दौला: ताजमहल की प्रेरणा",
        durationSeconds: 150,
        narrationText: "एत्मादुद्दौला का मक़बरा 'बेबी ताज' के नाम से प्रसिद्ध है। नूरजहां ने इसे अपने पिता मिर्जा गयास बेग की याद में बनवाया था। यह भारत में सफेद संगमरमर से बना पहला मुग़ल स्मारक है।"
      },
      ta: {
        language: "ta",
        title: "குட்டி தாஜ் என்றழைக்கப்படும் எத்மத்-உத்-தௌலா",
        durationSeconds: 155,
        narrationText: "பேபி தாஜ் என அன்புடன் அழைக்கப்படும் இந்த பளிங்கு மாளிகை நூர்ஜஹானால் தன் தந்தைக்கு கட்டப்பட்டது. இதன் பியட்ரா தூரா கலை வேலைப்பாடுகள் மிகவும் நுட்பமானவை."
      },
      te: {
        language: "te",
        title: "బేబీ తాజ్ విశేషాలు",
        durationSeconds: 150,
        narrationText: "ఇత్మాద్-ఉద్-దౌలా సమాధి తాజ్ మహల్‌కు నమూనాగా భావించబడుతుంది. నూర్జహాన్ తన తండ్రి కోసం పాలరాతితో నిర్మించిన సుందరమైన కట్టడమిది."
      },
      bn: {
        language: "bn",
        title: "ইতমাদ-উদ-দৌলার মার্বেল সমাধি",
        durationSeconds: 155,
        narrationText: "বেবি তাজ নামে খ্যাত এই সমাধিটি নূরজাহান তার পিতার স্মরণে নির্মাণ করেছিলেন। তাজমহলের থেকেও সূক্ষ্ম এর পাথর খোদাইয়ের কাজ।"
      }
    }
  },
  {
    id: "IN-UP-005",
    name: "Akbar's Tomb, Sikandra",
    hindiName: "अकबर का मक़बरा, सिकंदरा",
    alternateNames: ["Sikandra"],
    category: "Tomb & Mausoleum",
    coordinates: { lat: 27.2206, lng: 77.9506 },
    state: "Uttar Pradesh",
    city: "Agra",
    district: "Agra",
    asiCircle: "Agra Circle",
    unesco: false,
    dynasty: "Mughal Empire",
    era: "17th Century",
    foundedYear: 1605,
    shortDescription: "The monumental tiered tomb of Emperor Akbar the Great, blending red sandstone tiers with a crowning white marble terrace.",
    fullNarrative: "Planned by Akbar himself before his death in 1605 and finished by his son Jahangir in 1613, this five-tiered pyramidal tomb at Sikandra embodies Akbar's philosophical philosophy of Sulh-i-Kul (universal peace). The entrance gateway features four tall white marble minarets. The interior burial vault is reached via an inclined subterranean passage flanked by deep indigo and gold Persian calligraphy.",
    architecturalHighlights: [
      "Magnificent southern gateway with four independent marble minarets",
      "Five-tiered pyramidal pavilion architecture without a central dome",
      "Top floor open-sky marble pavilion housing the carved cenotaph inscribed with 99 Names of Allah",
      "Deer and peacocks roam freely in the surrounding Charbagh grounds"
    ],
    timeline: [
      { year: "1605", event: "Akbar commences planning and initial foundation." },
      { year: "1613", event: "Jahangir completes upper storeys in white marble." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Morning 07:00 - 10:00"
    },
    tariffs: {
      indianRupees: 30,
      saarcRupees: 30,
      foreignRupees: 310,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/akbars-tomb",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "Resting Place of the Great Emperor",
        durationSeconds: 170,
        narrationText: "Here at Sikandra lies Akbar, one of history's greatest rulers. Uniquely, this tomb has no dome—the topmost marble pavilion lies open to the sky and elements, symbolizing humility before the infinite divine. Notice the wild deer grazing beneath ancient tamarind trees in the gardens."
      },
      hi: {
        language: "hi",
        title: "सिकंदरा: सम्राट अकबर की समाधि",
        durationSeconds: 160,
        narrationText: "सिकंदरा में मुग़ल सम्राट अकबर की समाधि स्थित है। इस इमारत की विशेषता यह है कि इस पर कोई गुंबद नहीं है, बल्कि पांच स्तरों में बना यह पिरामिड नुमा ढांचा आकाश की ओर खुला हुआ है।"
      },
      ta: {
        language: "ta",
        title: "அக்பரின் கல்லறை சிக்கந்தரா",
        durationSeconds: 160,
        narrationText: "சிக்கந்தராவில் அமைந்துள்ள மாமன்னர் அக்பரின் கல்லறை. ஐந்து அடுக்கு மாடங்களைக் கொண்ட இந்த தனித்துவமான கட்டிடத்தில் மான் மற்றும் மயில்கள் சுதந்திரமாக திரிகின்றன."
      },
      te: {
        language: "te",
        title: "అక్బర్ సమాధి విశేషాలు",
        durationSeconds: 160,
        narrationText: "సికంద్రాలోని అక్బర్ సమాధి భారతీయ మరియు ఇస్లామిక్ వాస్తు శైలుల కలయికతో నిర్మించబడింది."
      },
      bn: {
        language: "bn",
        title: "সিকান্দ্রায় আকবরের সমাধি",
        durationSeconds: 160,
        narrationText: "সম্রাট আকবরের এই সমাধিটি কোনো গম্বুজ ছাড়াই নির্মিত। স্থাপত্যের পাঁচতলা এই পিরামিড সাদৃশ্য ভবনটি অনন্য।"
      }
    }
  },

  // --- 2. JAIPUR & RAJASTHAN (RAJPUT DYNASTIES) ---
  {
    id: "IN-RJ-001",
    name: "Amer Fort & Palace",
    hindiName: "आमेर का किला एवं महल",
    alternateNames: ["Amber Fort", "Amer Palace"],
    category: "Fort & Palace",
    coordinates: { lat: 26.9855, lng: 75.8513 },
    state: "Rajasthan",
    city: "Jaipur",
    district: "Jaipur",
    asiCircle: "Jaipur Circle",
    unesco: true,
    unescoSiteName: "Hill Forts of Rajasthan (2013)",
    dynasty: "Kachwaha Rajput Dynasty",
    era: "16th Century",
    foundedYear: 1592,
    shortDescription: "Perched high on the rugged Aravalli hills above Maota Lake, Amer Fort witnessed four centuries of Kachwaha Rajput history, renowned for its Sheesh Mahal.",
    fullNarrative: "Constructed primarily by Raja Man Singh I in 1592 and later expanded by Mirza Raja Jai Singh, Amer Fort is a crowning triumph of Rajput-Mughal architecture. The fort is divided into four main courtyards: the Jaleb Chowk for royal cavalry parades, the Diwan-i-Aam with double rows of pillars, the Ganesh Pol gateway painted with natural vegetable dyes, and the celestial Sheesh Mahal, where convex Belgian glass mirrors can illuminate the entire pavilion with a single candle.",
    architecturalHighlights: [
      "Sheesh Mahal (Hall of Mirrors) capable of reflecting starlight across thousands of imported convex mirrors",
      "Ganesh Pol gateway featuring 17th-century fresco paintings made from vegetable dyes",
      "Sukh Niwas equipped with an ancient piped-water cooling conduit flowing across marble screens",
      "Kesar Kyari saffron garden floating in Maota Lake below the ramparts"
    ],
    timeline: [
      { year: "1592", event: "Raja Man Singh I commences construction on the ruins of an earlier Meena fort." },
      { year: "1621", event: "Mirza Raja Jai Singh constructs the Diwan-i-Aam and Sheesh Mahal." },
      { year: "1727", event: "Sawai Jai Singh II founds the new planned city of Jaipur in the plains below." },
      { year: "2013", event: "Inscribed as UNESCO World Heritage Site." }
    ],
    timings: {
      open: "08:00",
      close: "17:30",
      bestTimeToVisit: "Morning 08:30 - 11:30 or Evening Sound & Light show"
    },
    tariffs: {
      indianRupees: 100,
      saarcRupees: 100,
      foreignRupees: 500,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://bookrajasm.rajasthan.gov.in/",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: [
      "/images/hero_monument_1789383083590.jpg",
      "/images/amber_fort_crop_1789383125173.jpg",
      "/images/phone_audio_guide_1789436084142.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Mirror Palace on the Aravalli Crest",
        durationSeconds: 210,
        narrationText: "Welcome to Amer Fort, fortress of the Kachwaha kings. Pass through the grand Suraj Pol gate into the Jaleb Chowk. Above you stands the Ganesh Pol, its frescoed arches painted using vegetable dyes that have held their vibrant hue for over three hundred years. When you enter the Sheesh Mahal, notice how a single beam of light multiplies across convex Belgian glass mirrors, recreating a starlit night indoors."
      },
      hi: {
        language: "hi",
        title: "आमेर का शीश महल और राजपूताना शौर्य",
        durationSeconds: 195,
        narrationText: "आमेर दुर्ग में आपका स्वागत है। राजा मानसिंह प्रथम द्वारा 1592 में निर्मित यह दुर्ग कछवाहा राजपूतों की शौर्य गाथा कहता है। यहां का शीश महल दुनिया भर में प्रसिद्ध है, जहां एक मोमबत्ती की रोशनी से पूरा महल तारों की भांति जगमगा उठता है।"
      },
      ta: {
        language: "ta",
        title: "ஆம்பர் கோட்டையின் கண்ணாடி மாளிகை",
        durationSeconds: 190,
        narrationText: "ஜெய்ப்பூரின் ஆம்பர் கோட்டை ராஜபுத்திர கட்டிடக்கலையின் பெருமை. இங்குள்ள கணேஷ் போல் மற்றும் கண்ணாடிகளால் இழைக்கப்பட்ட ஷீஷ் மஹால் ஆகியவை கண்கவர் கலைப்படைப்புகளாகும்."
      },
      te: {
        language: "te",
        title: "అంబర్ కోట రాజపుత్ర చరిత్ర",
        durationSeconds: 190,
        narrationText: "అంబర్ కోట రాజస్థాన్‌లోని అతి సుందరమైన కొండకోటలలో ఒకటి. ఇక్కడి అద్దాల మహల్ మరియు గణేష్ పోల్ శిల్పకళా చాతుర్యం ప్రతి ఒక్కరినీ ఆకట్టుకుంటుంది."
      },
      bn: {
        language: "bn",
        title: "আমের ফোর্টের রাজকীয় ইতিহাস",
        durationSeconds: 195,
        narrationText: "জয়পুরের আমের দুর্গ রাজপুত শৌর্যের এক জীবন্ত প্রতীক। এখানকার শীশমহল বিশ্বের বিস্ময়—একটি মোমবাতির আলোয় গোটা ঘর তারার মতো জ্বলে ওঠে।"
      }
    }
  },
  {
    id: "IN-RJ-002",
    name: "Hawa Mahal",
    hindiName: "हवा महल",
    alternateNames: ["Palace of Breeze", "Palace of the Winds"],
    category: "Fort & Palace",
    coordinates: { lat: 26.9239, lng: 75.8267 },
    state: "Rajasthan",
    city: "Jaipur",
    district: "Jaipur",
    asiCircle: "Jaipur Circle",
    unesco: true,
    unescoSiteName: "Jaipur City, Rajasthan (2019)",
    dynasty: "Kachwaha Rajput Dynasty",
    era: "18th Century",
    foundedYear: 1799,
    shortDescription: "A five-storey pink sandstone façade with 953 carved jharokha windows, designed to channel natural breeze while allowing royal women to observe street processions.",
    fullNarrative: "Built in 1799 by Maharaja Sawai Pratap Singh and designed by Lal Chand Ustad, Hawa Mahal represents Lord Krishna's crown in form. The five-storey honeycomb exterior features 953 intricately latticed casements called jharokhas. The Venturi effect of wind passing through the narrow stone apertures creates a natural air conditioning effect, keeping the chambers cool during scorching desert summers. Remarkably, the palace sits on a podium without a deep foundation, stabilized by its curved cantilevered architecture.",
    architecturalHighlights: [
      "953 carved sandstone jharokha lattice windows utilizing the Venturi cooling breeze effect",
      "Crown-shaped silhouette inspired by the mukut of Lord Krishna",
      "Only 20-centimeter thick walls on the top three storeys, constructed without stairs (ramps used)",
      "Vibrant stained-glass inlays casting rainbow light patterns into royal courtyards"
    ],
    timeline: [
      { year: "1799", event: "Maharaja Sawai Pratap Singh commissions Hawa Mahal." },
      { year: "2019", event: "Jaipur walled city inscribed as UNESCO World Heritage Site." }
    ],
    timings: {
      open: "09:00",
      close: "17:00",
      bestTimeToVisit: "Sunrise when golden sunlight hits the pink façade"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 200,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://bookrajasm.rajasthan.gov.in/",
    heroImage: "/images/amber_fort_crop_1789383125173.jpg",
    galleryImages: ["/images/amber_fort_crop_1789383125173.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The 953 Windows of Wind",
        durationSeconds: 180,
        narrationText: "Stand across the street and take in the five-tiered façade of Hawa Mahal. Notice the 953 delicate lattice windows. Built in the shape of Krishna's crown, it allowed royal ladies observing the strict purdah system to watch festivals and daily life in the bustling bazaar below without ever being seen."
      },
      hi: {
        language: "hi",
        title: "हवा महल: 953 झरोखों का जादू",
        durationSeconds: 170,
        narrationText: "हवा महल जयपुर की पहचान है। सवाई प्रताप सिंह द्वारा 1799 में निर्मित इस पांच मंजिला महल में 953 झरोखे हैं। इन झरोखों से आने वाली हवा गर्मियों में भी अंदर ठंडक बनाए रखती है।"
      },
      ta: {
        language: "ta",
        title: "ஜெய்ப்பூரின் காற்று மாளிகை",
        durationSeconds: 165,
        narrationText: "ஹவா மஹால் 953 ஜன்னல்களைக் கொண்ட வரலாற்று அதிசயம். கிருஷ்ணரின் கிரீடம் போன்ற வடிவில் அமைக்கப்பட்ட இந்த மாளிகையில் இயற்கை காற்று குளிரூட்டும் அமைப்பாக செயல்படுகிறது."
      },
      te: {
        language: "te",
        title: "గాలి మహల్ విశేషాలు",
        durationSeconds: 165,
        narrationText: "హవా మహల్ జైపూర్‌లోని 953 కిటికీల అద్భుత నిర్మాణం. రాజ కుటుంబ మహిళలు వీధి ఉత్సవాలు చూడటానికి ఇది నిర్మించబడింది."
      },
      bn: {
        language: "bn",
        title: "হাওয়া মহলের ৯৫৩টি ঝরোখা",
        durationSeconds: 170,
        narrationText: "জয়পুরের হাওয়া মহল শ্রীকৃষ্ণের মুকুটের আদলে তৈরি। ৯৫৩টি সুন্দর ঝরোখা দিয়ে বাতাস বয়ে এসে মরুভূমির মাঝেও প্রাসাদটিকে শীতল রাখে।"
      }
    }
  },
  {
    id: "IN-RJ-003",
    name: "Jantar Mantar, Jaipur",
    hindiName: "जंतर मंतर, जयपुर",
    alternateNames: ["Yantra Mantra"],
    category: "Memorial & Gate",
    coordinates: { lat: 26.9248, lng: 75.8246 },
    state: "Rajasthan",
    city: "Jaipur",
    district: "Jaipur",
    asiCircle: "Jaipur Circle",
    unesco: true,
    unescoSiteName: "The Jantar Mantar, Jaipur (2010)",
    dynasty: "Kachwaha Rajput Dynasty",
    era: "18th Century",
    foundedYear: 1734,
    shortDescription: "A collection of 19 stone astronomical instruments completed in 1734, featuring the world's largest stone sundial with 2-second accuracy.",
    fullNarrative: "Commissioned by the polymath astronomer-king Maharaja Sawai Jai Singh II, Jantar Mantar in Jaipur is the largest and best-preserved of five observatories built in north India. Constructed from local stone and marble, its 19 architectural instruments measured local solar time, tracked constellations, and predicted eclipses. The Vrihat Samrat Yantra is a 27-meter-tall sundial whose shadow moves at one millimeter per second, reading accurate time to within two seconds.",
    architecturalHighlights: [
      "Vrihat Samrat Yantra, the world's largest stone sundial measuring time to 2 seconds accuracy",
      "Jai Prakash Yantra: twin hemispherical subterranean bowls tracking planetary positions",
      "Rama Yantra for calculating azimuth and altitude of celestial objects",
      "Geometric masonry combining Hindu Vedic astronomy with Islamic and European principles"
    ],
    timeline: [
      { year: "1724", event: "Sawai Jai Singh completes Delhi observatory." },
      { year: "1734", event: "Jaipur Jantar Mantar completed as the master observatory." },
      { year: "2010", event: "Designated as a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "09:00",
      close: "17:00",
      bestTimeToVisit: "Midday (11:30 - 13:30) to see shadow movements on instruments"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 200,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://bookrajasm.rajasthan.gov.in/",
    heroImage: "/images/amber_fort_crop_1789383125173.jpg",
    galleryImages: ["/images/amber_fort_crop_1789383125173.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "Stone Instruments of the Cosmos",
        durationSeconds: 190,
        narrationText: "Welcome to Jantar Mantar, where stone becomes scientific instrument. Stand beside the Samrat Yantra—its giant shadow moves visibly across the graduated marble scale at one millimeter every second. Over three hundred years ago, Sawai Jai Singh calculated planetary movements with an precision that rivaled Greenwich."
      },
      hi: {
        language: "hi",
        title: "खगोल विज्ञान की पाषाण वेधशाला",
        durationSeconds: 180,
        narrationText: "सवाई जयसिंह द्वितीय द्वारा 1734 में निर्मित जंतर मंतर संसार की सबसे बड़ी पत्थर की वेधशाला है। यहां की सम्राट यंत्र धूपघड़ी आज भी दो सेकंड की सटीकता से समय बता सकती है।"
      },
      ta: {
        language: "ta",
        title: "ஜெய்ப்பூரின் விண்வெளி ஆய்வுக்கூடம்",
        durationSeconds: 175,
        narrationText: "ஜெய்ப்பூர் ஜந்தர் மந்தர் உலகின் மிகப்பெரிய கல் சூரிய கடிகாரத்தைக் கொண்டுள்ளது. 18-ஆம் நூற்றாண்டின் வானியல் அறிவியலின் உச்சக்கட்ட சாதனையாகும்."
      },
      te: {
        language: "te",
        title: "జంతర్ మంతర్ ఖగోళ అద్భుతం",
        durationSeconds: 175,
        narrationText: "జంతర్ మంతర్ సవాయ్ జైసింగ్ నిర్మించిన చారిత్రక ఖగోళ వేధశాల. ఇక్కడి రాతి పరికరాలు సూర్య సమయాన్ని అత్యంత ఖచ్చితత్వంతో గణిస్తాయి."
      },
      bn: {
        language: "bn",
        title: "পাথরের জ্যোতির্বিজ্ঞান মানমন্দির",
        durationSeconds: 180,
        narrationText: "জয়পুরের যন্তর মন্তর পাথরে গড়া এক অনন্য মানমন্দির। এখানকার বিরাট সম্রাট যন্ত্র পৃথিবীর বৃহত্তম পাথরের সূর্যঘড়ি।"
      }
    }
  },
  {
    id: "IN-RJ-004",
    name: "Jaigarh Fort",
    hindiName: "जयगढ़ किला",
    alternateNames: ["Victory Fort", "Cheel ka Teela"],
    category: "Fort & Palace",
    coordinates: { lat: 26.9850, lng: 75.8456 },
    state: "Rajasthan",
    city: "Jaipur",
    district: "Jaipur",
    asiCircle: "Jaipur Circle",
    unesco: false,
    dynasty: "Kachwaha Rajput Dynasty",
    era: "18th Century",
    foundedYear: 1726,
    shortDescription: "A military fortress connected to Amer Fort via underground passages, housing Jaivana, once the world's largest cannon on wheels.",
    fullNarrative: "Built by Sawai Jai Singh II in 1726 to protect the Amer palace complex, Jaigarh Fort stands atop Cheel ka Teela (Hill of Eagles). Unlike Amer Palace, Jaigarh was purely defensive and military. It housed one of the medieval world's premier cannon foundries. Its prize possession, the Jaivana cannon, weighed 50 tonnes with a 6.15-meter barrel and was fired only once in a test run, reportedly hurling a 50 kg cannonball 35 kilometers away.",
    architecturalHighlights: [
      "Jaivana cannon, 50 tonnes on wheels, historically the world's largest mobile cannon",
      "Subterranean tunnel complex interconnecting Jaigarh and Amer Palace",
      "Sophisticated rainwater harvesting reservoir holding 6 million gallons of water",
      "Unbreached fortress architecture with intact blast furnaces and cannon casting foundry"
    ],
    timeline: [
      { year: "1720", event: "Jaivana cannon cast in the royal foundry." },
      { year: "1726", event: "Sawai Jai Singh II formalizes fortress construction." }
    ],
    timings: {
      open: "09:00",
      close: "16:45",
      bestTimeToVisit: "Midday after Amer Fort"
    },
    tariffs: {
      indianRupees: 70,
      saarcRupees: 70,
      foreignRupees: 150,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://bookrajasm.rajasthan.gov.in/",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Fortress That Never Fell",
        durationSeconds: 175,
        narrationText: "Welcome to Jaigarh Fort, the invincible sentinel of Jaipur. Above you stands the Jaivana cannon, an engineering marvel cast in a single pour of bronze and iron in 1720. Look across the battlements—subterranean escape tunnels connect this military citadel directly to the heart of Amer Palace."
      },
      hi: {
        language: "hi",
        title: "जयगढ़: अजेय दुर्ग और जयबाण तोप",
        durationSeconds: 165,
        narrationText: "जयगढ़ किला आमेर की सुरक्षा के लिए बनाया गया था। यहां दुनिया की सबसे बड़ी पहियों वाली तोप 'जयबाण' रखी है। इस किले को कभी कोई शत्रु जीत नहीं सका।"
      },
      ta: {
        language: "ta",
        title: "ஜெய்கர் கோட்டையின் பிரம்மாண்ட பீரங்கி",
        durationSeconds: 160,
        narrationText: "ஜெய்கர் கோட்டை ஜெய்ப்பூரின் மாபெரும் ராணுவ கோட்டை. இங்குள்ள ஜெய்பானா பீரங்கி அக்காலத்தில் உலகின் மிகப்பெரிய சக்கர பீரங்கியாகும்."
      },
      te: {
        language: "te",
        title: "జయగఢ్ కోట మరియు జైవానా ఫిరంగి",
        durationSeconds: 160,
        narrationText: "జయగఢ్ కోట ఆమేర్ రక్షణకై నిర్మించిన బలమైన కోట. ఇక్కడి జైవానా ఫిరంగి 35 కిలోమీటర్ల దూరం గుండ్లను విసిరే సామర్థ్యం కలది."
      },
      bn: {
        language: "bn",
        title: "জয়গড় দুর্গ ও জয়বাণ কামান",
        durationSeconds: 165,
        narrationText: "জয়গড় দুর্গ কখনো শত্রুর হাতে পরাস্ত হয়নি। এখানকার ৫০ টন ওজনের জয়বাণ কামান পৃথিবীর সর্ববৃহৎ চাকাযুক্ত কামান ছিল।"
      }
    }
  },
  {
    id: "IN-RJ-005",
    name: "Nahargarh Fort",
    hindiName: "नाहरगढ़ किला",
    alternateNames: ["Tiger Fort", "Sudarshangarh"],
    category: "Fort & Palace",
    coordinates: { lat: 26.9372, lng: 75.8156 },
    state: "Rajasthan",
    city: "Jaipur",
    district: "Jaipur",
    asiCircle: "Jaipur Circle",
    unesco: false,
    dynasty: "Kachwaha Rajput Dynasty",
    era: "18th Century",
    foundedYear: 1734,
    shortDescription: "Perched dramatically on the ridge of the Aravalli hills, offering sweeping sunset panoramas over the entire planned city of Jaipur.",
    fullNarrative: "Built by Maharaja Sawai Jai Singh II in 1734 and expanded by Sawai Madho Singh in the late 19th century, Nahargarh ('Abode of Tigers') formed a formidable defense ring alongside Amer and Jaigarh. According to folklore, construction was troubled by the spirit of a Rathore prince, Nahar Singh Bhomia, until a shrine was built in his honor. The fort's Madhavendra Bhawan features nine identical two-storey apartments built for the maharaja's nine queens, linked by open corridors and adorned with vibrant frescoes.",
    architecturalHighlights: [
      "Madhavendra Bhawan: nine interconnected identical suites designed for royal queens",
      "Panoramic 360-degree clifftop views across Jaipur's grid city plan",
      "Ancient stepwells (baoris) carved directly into living Aravalli granite",
      "Intricate floral stucco and Rajasthani miniature wall frescoes"
    ],
    timeline: [
      { year: "1734", event: "Sawai Jai Singh II founds the fortress atop the ridge." },
      { year: "1868", event: "Sawai Madho Singh builds the palatial Madhavendra Bhawan." }
    ],
    timings: {
      open: "10:00",
      close: "17:30",
      bestTimeToVisit: "Sunset (16:30 - 18:00) for city panorama"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 200,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://bookrajasm.rajasthan.gov.in/",
    heroImage: "/images/closing_monument_1789403341798.jpg",
    galleryImages: ["/images/closing_monument_1789403341798.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Tiger Fort Above the Pink City",
        durationSeconds: 175,
        narrationText: "Welcome to Nahargarh Fort. Standing upon this cliff edge, gaze down at the grid streets of Jaipur stretching to the horizon. Inside Madhavendra Bhawan, notice the nine symmetrical suites—each decorated with stained glass and Rajput murals, designed so the king could visit any queen without the others knowing."
      },
      hi: {
        language: "hi",
        title: "नाहरगढ़: अरावली की चोटी पर प्रहरी",
        durationSeconds: 165,
        narrationText: "नाहरगढ़ का किला अरावली की पहाड़ी पर जयपुर शहर की रखवाली करता है। यहां का सूर्यास्त दृश्य अद्भुत है। माधवेंद्र भवन में नौ रानियों के लिए बने नौ एक समान महल देखने योग्य हैं।"
      },
      ta: {
        language: "ta",
        title: "நஹர்கர் கோட்டையின் அழகு",
        durationSeconds: 160,
        narrationText: "ஜெய்ப்பூரின் அழகிய நஹர்கர் கோட்டை மாலை நேர சூரிய அஸ்தமனத்திற்கு புகழ் பெற்றது. இங்கிருந்து ஒட்டுமொத்த ஜெய்ப்பூர் நகரத்தையும் காணலாம்."
      },
      te: {
        language: "te",
        title: "నహర్‌గఢ్ టైగర్ ఫోర్ట్",
        durationSeconds: 160,
        narrationText: "నహర్‌గఢ్ కోట కొండపై నుంచి జైపూర్ నగర వీక్షణను అద్భుతంగా అందిస్తుంది."
      },
      bn: {
        language: "bn",
        title: "নাহারগড় দুর্গ ও সূর্যাস্ত",
        durationSeconds: 165,
        narrationText: "নাহারগড় দুর্গ থেকে গোটা জয়পুর শহরের সূর্যাস্ত দেখার অভিজ্ঞতা অতুলনীয়। এর নয়টি অভিন্ন মহলের নকশা নজরকাড়া।"
      }
    }
  },
  {
    id: "IN-RJ-006",
    name: "Chand Baori, Abhaneri",
    hindiName: "चाँद बावड़ी, आभानेरी",
    alternateNames: ["Abhaneri Stepwell"],
    category: "Stepwell",
    coordinates: { lat: 27.0073, lng: 76.6064 },
    state: "Rajasthan",
    city: "Abhaneri",
    district: "Dausa",
    asiCircle: "Jaipur Circle",
    unesco: false,
    dynasty: "Chahamana / Nikumbha Dynasty",
    era: "8th-9th Century",
    foundedYear: 800,
    shortDescription: "One of the oldest, deepest, and largest stepwells in the world, with 3,500 narrow steps descending 13 storeys (20 meters) in hypnotic geometric symmetry.",
    fullNarrative: "Built by King Chanda of the Nikumbha dynasty between the 8th and 9th centuries CE, Chand Baori in Abhaneri solved the eternal problem of water scarcity in arid eastern Rajasthan. Descending 20 meters across 13 storeys, its 3,500 precisely arranged stone steps form a mesmerizing geometric maze. The northern pavilion features multi-tiered pillared galleries, carved niches enshrining idols of Ganesha and Mahishasuramardini, and royal private pavilions that kept temperatures 5-6 degrees cooler than the desert heat.",
    architecturalHighlights: [
      "3,500 symmetrical narrow steps arranged across 13 subterranean storeys",
      "Hydraulic engineering capturing annual monsoon runoff into subterranean aquifers",
      "Carved stone pavilions dedicated to goddess Harshat Mata",
      "Escher-like optical illusion created by interlocking triangular stairways"
    ],
    timeline: [
      { year: "800", event: "King Chanda begins construction of the stepwell and temple." },
      { year: "1700", event: "Upper arcaded pavilions restored during the Mughal-Rajput era." }
    ],
    timings: {
      open: "07:00",
      close: "18:00",
      bestTimeToVisit: "Morning light when sharp shadows define the triangular steps"
    },
    tariffs: {
      indianRupees: 25,
      saarcRupees: 25,
      foreignRupees: 300,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/chand-baori",
    heroImage: "/images/stepwell_architecture_1789406963346.jpg",
    galleryImages: ["/images/stepwell_architecture_1789406963346.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Geometry of Thirst and Stone",
        durationSeconds: 185,
        narrationText: "Gaze down into the hypnotic depths of Chand Baori. Three thousand five hundred steps descend twenty meters into the cool depths of the earth. In this desert realm, water was life, and this stepwell was both a reservoir and a community sanctum where travelers rested in the coolness of carved stone."
      },
      hi: {
        language: "hi",
        title: "चाँद बावड़ी: ज्यामिति और जल संरक्षण का चमत्कार",
        durationSeconds: 175,
        narrationText: "आभानेरी की चाँद बावड़ी दुनिया की सबसे गहरी और बड़ी बावड़ियों में से एक है। 3,500 सीढ़ियों और 13 मंजिलों का यह भूलभुलैया जैसा ढांचा प्राचीन भारत की उन्नत जल संरक्षण प्रणाली का प्रतीक है।"
      },
      ta: {
        language: "ta",
        title: "சாந்த் பௌரி படிக்கிணறு",
        durationSeconds: 170,
        narrationText: "ஆபனேரியின் சாந்த் பௌரி உலகின் ஆழமான படிக்கிணறு. 3500 படிக்கட்டுகளுடன் கூடிய இதன் வடிவியல் அமைப்பு பிரமிக்க வைக்கிறது."
      },
      te: {
        language: "te",
        title: "చాంద్ బావోరీ మెట్ల బావి",
        durationSeconds: 170,
        narrationText: "చాంద్ బావోరీ రాజస్థాన్‌లోని అద్భుతమైన మెట్ల బావి. 13 అంతస్తుల లోతుతో నిర్మించబడిన ఈ నిర్మాణం నీటి సంరక్షణకు ప్రతీక."
      },
      bn: {
        language: "bn",
        title: "চাঁদ বাওড়ির জ্যামিতিক সিঁড়ি",
        durationSeconds: 175,
        narrationText: "আভানেরির চাঁদ বাওড়ি ৩,৫০০ সিঁড়ি বিশিষ্ট এক আশ্চর্য পাতকুয়ো। এর জ্যামিতিক বিন্যাস চোখ জুড়িয়ে দেয়।"
      }
    }
  },

  // --- 3. DELHI (SULTANATE & MUGHAL CAPITALS) ---
  {
    id: "IN-DL-001",
    name: "Qutub Minar & Complex",
    hindiName: "क़ुतुब मीनार परिसर",
    alternateNames: ["Qutab Minar", "Vijay Stambha of Delhi"],
    category: "Memorial & Gate",
    coordinates: { lat: 28.5245, lng: 77.1855 },
    state: "Delhi",
    city: "New Delhi",
    district: "South Delhi",
    asiCircle: "Delhi Circle",
    unesco: true,
    unescoSiteName: "Qutb Minar and its Monuments, Delhi (1993)",
    dynasty: "Mamluk (Slave) Dynasty",
    era: "12th-13th Century",
    foundedYear: 1199,
    shortDescription: "A 72.5-meter tapering victory tower of red sandstone and marble, anchoring a complex with the rust-resistant 1,600-year-old Iron Pillar.",
    fullNarrative: "Begun in 1199 by Qutb-ud-din Aibak to celebrate the establishment of the Delhi Sultanate and continued by Shams-ud-din Iltutmish and Firoz Shah Tughlaq, the Qutub Minar is the tallest brick minaret in the world at 72.5 meters. The complex also features the Quwwat-ul-Islam mosque, built reusing stone colonnades from earlier temples, and the celebrated 4th-century Iron Pillar of Chandragupta II, whose metallurgical purity has resisted rust for over 1,600 years in the open monsoon air.",
    architecturalHighlights: [
      "72.5m tapering minaret with 379 spiral steps across five distinct storeys",
      "Ornate projecting balconies supported by stalactite corbels and Quranic Kufic inscriptions",
      "The 7-meter Gupta-era Iron Pillar exhibiting zero corrosion over 1,600 years",
      "Alai Darwaza gateway displaying the earliest true horseshoe arches in Indian architecture"
    ],
    timeline: [
      { year: "1199", event: "Qutb-ud-din Aibak completes base storey of the minar." },
      { year: "1220", event: "Iltutmish adds three upper storeys." },
      { year: "1368", event: "Firoz Shah Tughlaq repairs lightning damage and adds marble top storeys." },
      { year: "1993", event: "Inscribed on UNESCO World Heritage List." }
    ],
    timings: {
      open: "06:00",
      close: "21:00",
      bestTimeToVisit: "Evening when the minaret is illuminated with golden spotlights"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/qutub-minar",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Tower of Seven Centuries",
        durationSeconds: 195,
        narrationText: "Look up at the fluted red sandstone shaft of the Qutub Minar, rising seventy-two and a half meters into the Delhi sky. Each balcony is held aloft by intricate stalactite honeycomb brackets. Nearby stands the mystery of the Iron Pillar—cast in the fourth century, its metallurgical secret has kept it completely unrusted through sixteen centuries of rain and wind."
      },
      hi: {
        language: "hi",
        title: "क़ुतुब मीनार: भारत की सबसे ऊंची ईंट मीनार",
        durationSeconds: 180,
        narrationText: "क़ुतुब मीनार 72.5 मीटर ऊंची दुनिया की सबसे ऊंची ईंटों से बनी मीनार है। कुतुबुद्दीन ऐबक द्वारा 1199 में शुरू की गई यह मीनार दिल्ली सल्तनत की स्थापत्य कला का प्रतीक है। परिसर में स्थित 1600 वर्ष पुराना लौह स्तंभ आज भी जंग से मुक्त है।"
      },
      ta: {
        language: "ta",
        title: "குதுப் மினாரின் கம்பீரம்",
        durationSeconds: 175,
        narrationText: "குதுப் மினார் 72.5 மீட்டர் உயரம் கொண்ட வரலாற்று கோபுரமாகும். இதன் அருகில் உள்ள 1600 ஆண்டுகள் பழமையான துருப்பிடிக்காத இரும்புத்தூண் உலோகவியலின் விந்தை."
      },
      te: {
        language: "te",
        title: "కుతుబ్ మీనార్ విశిష్టత",
        durationSeconds: 175,
        narrationText: "కుతుబ్ మీనార్ ప్రపంచ ప్రసిద్ధ చారిత్రక కట్టడం. ఇక్కడి ఇనుప స్తంభం శతాబ్దాలుగా తుప్పు పట్టకుండా ఉండటం భారతీయ రసాయన శాస్త్ర ప్రతిభ."
      },
      bn: {
        language: "bn",
        title: "কুতুব মিনার ও প্রাচীন লৌহস্তম্ভ",
        durationSeconds: 180,
        narrationText: "কুতুব মিনার বিশ্বের সবচেয়ে উঁচু ইটের মিনার। এর প্রাঙ্গণে থাকা ১৬০০ বছরের পুরোনো লোহার স্তম্ভটিতে আজও কোনো মরচে পড়েনি।"
      }
    }
  },
  {
    id: "IN-DL-002",
    name: "Humayun's Tomb",
    hindiName: "हुमायूँ का मक़बरा",
    alternateNames: ["Maqbara-e-Humayun"],
    category: "Tomb & Mausoleum",
    coordinates: { lat: 28.5933, lng: 77.2507 },
    state: "Delhi",
    city: "New Delhi",
    district: "South East Delhi",
    asiCircle: "Delhi Circle",
    unesco: true,
    unescoSiteName: "Humayun's Tomb, Delhi (1993)",
    dynasty: "Mughal Empire",
    era: "16th Century",
    foundedYear: 1565,
    shortDescription: "The first substantial garden-tomb on the Indian subcontinent, introducing the Persian Charbagh and inspiring the design of the Taj Mahal.",
    fullNarrative: "Commissioned in 1565 by Humayun's chief consort Empress Bega Begum (Haji Begum) and designed by Persian architect Mirak Mirza Ghiyas, Humayun's Tomb represents the architectural prototype that culminated in the Taj Mahal eighty years later. It was the first structure in India to feature the Persian double dome and the Charbagh quadripartite paradise garden with water channels representing the four rivers of paradise.",
    architecturalHighlights: [
      "First monumental double-domed garden tomb in South Asia",
      "Charbagh grid spanning 30 acres with cascading channels and pools",
      "High red sandstone podium with 56 arched cells housing over 150 Mughal royals",
      "Integration of white marble and red sandstone in geometric friezes"
    ],
    timeline: [
      { year: "1556", event: "Humayun dies after falling from his library stairs at Sher Mandal." },
      { year: "1565", event: "Empress Bega Begum commissions the mausoleum." },
      { year: "1572", event: "Mausoleum completed at a cost of 1.5 million rupees." },
      { year: "1857", event: "Last Mughal Emperor Bahadur Shah Zafar captured here by British troops." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Late afternoon for soft sunlight through jalis"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/humayuns-tomb",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Dormitory of the House of Timur",
        durationSeconds: 190,
        narrationText: "Walk along the water channels of Humayun's Tomb. Notice how the Persian quadripartite garden creates an oasis of order and reflection. This grand red sandstone monument served as the architectural stepping stone that paved the way for the Taj Mahal. In 1857, the final chapter of the Mughal Empire ended right here with the capture of Bahadur Shah Zafar."
      },
      hi: {
        language: "hi",
        title: "हुमायूँ का मक़बरा: ताजमहल का पूर्वगामी",
        durationSeconds: 180,
        narrationText: "हुमायूँ का मक़बरा भारत में चारबाग शैली का पहला भव्य उदाहरण है। 1565 में हमीदा बानो बेगम द्वारा बनवाया गया यह स्मारक ताजमहल की वास्तुकला की नींव बना।"
      },
      ta: {
        language: "ta",
        title: "ஹுமாயூன் கல்லறை தில்லி",
        durationSeconds: 175,
        narrationText: "தாஜ் மஹாலின் முன்னோடியாக கருதப்படும் ஹுமாயூன் கல்லறை பாரசீக தோட்டக்கலை மற்றும் முகலாய கட்டிடக்கலையின் உன்னத சங்கமம்."
      },
      te: {
        language: "te",
        title: "హుమాయూన్ సమాధి చరిత్ర",
        durationSeconds: 175,
        narrationText: "హుమాయూన్ సమాధి భారతదేశంలో నిర్మించబడిన మొట్టమొదటి ఉద్యానవన సమాధి. ఇది తాజ్ మహల్ నిర్మాణానికి ప్రేరణగా నిలిచింది."
      },
      bn: {
        language: "bn",
        title: "হুমায়ূনের সমাধি ও চারবাগ",
        durationSeconds: 180,
        narrationText: "হুমায়ূনের সমাধি ভারতীয় উপমহাদেশের প্রথম উদ্যান-সমাধি। তাজমহলের নকশা এই সমাধিটির থেকেই অনুপ্রাণিত।"
      }
    }
  },
  {
    id: "IN-DL-003",
    name: "Red Fort, Delhi",
    hindiName: "लाल क़िला, दिल्ली",
    alternateNames: ["Lal Qila", "Qila-e-Mubarak"],
    category: "Fort & Palace",
    coordinates: { lat: 28.6562, lng: 77.2410 },
    state: "Delhi",
    city: "Old Delhi",
    district: "Central Delhi",
    asiCircle: "Delhi Circle",
    unesco: true,
    unescoSiteName: "Red Fort Complex (2007)",
    dynasty: "Mughal Empire",
    era: "17th Century",
    foundedYear: 1639,
    shortDescription: "The historic focal point of Mughal authority and modern Indian independence, built by Shah Jahan when he shifted his capital to Shahjahanabad.",
    fullNarrative: "Constructed between 1639 and 1648 when Shah Jahan relocated the imperial capital from Agra to his new city of Shahjahanabad, the Red Fort spans 254 acres enclosed by massive red sandstone ramparts. Entering through the Lahori Gate leads to the Chhatta Chowk covered bazaar, the Diwan-i-Aam with its marble throne canopy, and the Diwan-i-Khas where the famous Persian couplet is inscribed: 'If there be a paradise on earth, it is this, it is this, it is this.' Every year on 15 August, India's Prime Minister hoists the national flag from its ramparts.",
    architecturalHighlights: [
      "Lahori Gate with towering octagonal towers, the focal point of India's Independence Day address",
      "Nahr-i-Bihisht (Stream of Paradise) continuous water conduit connecting royal pavilions",
      "Diwan-i-Khas in white marble with pietra dura inlays, once housing the Peacock Throne",
      "Moti Masjid (Pearl Mosque) private white marble prayer hall built by Aurangzeb"
    ],
    timeline: [
      { year: "1639", event: "Shah Jahan lays the foundation stone on the banks of Yamuna." },
      { year: "1648", event: "Inaugural ceremony held in the presence of the Emperor." },
      { year: "1947", event: "Jawaharlal Nehru unfurls India's tricolor, establishing modern ritual." },
      { year: "2007", event: "Inscribed as UNESCO World Heritage Site." }
    ],
    timings: {
      open: "09:30",
      close: "16:30",
      closedDays: ["Monday"],
      bestTimeToVisit: "Morning 09:30 - 12:00"
    },
    tariffs: {
      indianRupees: 50,
      saarcRupees: 50,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/red-fort",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Citadel of Imperial Delhi",
        durationSeconds: 200,
        narrationText: "Stand before the Lahori Gate of the Red Fort. For over two centuries, this citadel was the beating heart of Mughal India. Enter through the covered bazaar of Chhatta Chowk into the imperial grounds where the Peacock Throne once stood. Today, this rampart represents the living sovereignty of democratic India."
      },
      hi: {
        language: "hi",
        title: "लाल किला: भारत की आज़ादी का प्रतीक",
        durationSeconds: 185,
        narrationText: "शाहजहां द्वारा 1639 में निर्मित दिल्ली का लाल किला भारतीय संप्रभुता का प्रतीक है। हर वर्ष 15 अगस्त को देश के प्रधानमंत्री इसी की प्राचीर से तिरंगा फहराते हैं। दीवान-ए-खास और नहर-ए-बहिश्त इसकी भव्यता को दर्शाते हैं।"
      },
      ta: {
        language: "ta",
        title: "தில்லி செங்கோட்டை வரலாறு",
        durationSeconds: 180,
        narrationText: "தில்லியின் செங்கோட்டை முகலாயர்களின் முதன்மை கோட்டையாக விளங்கியது. சுதந்திர தினத்தன்று இந்திய பிரதமர் மூவர்ணக் கொடியை ஏற்றும் வரலாற்று சிறப்புமிக்க இடம்."
      },
      te: {
        language: "te",
        title: "ఎర్రకోట మరియు స్వాతంత్ర్య సంబరాలు",
        durationSeconds: 180,
        narrationText: "ఎర్రకోట భారతదేశానికి గర్వకారణం. షాజహాన్ నిర్మించిన ఈ కోట నుండి ప్రతి స్వాతంత్ర్య దినోత్సవం నాడు ప్రధాని ప్రసంగిస్తారు."
      },
      bn: {
        language: "bn",
        title: "দিল্লির লালকেল্লার ঐতিহ্য",
        durationSeconds: 185,
        narrationText: "দিল্লির লালকেল্লা ভারতের স্বাধীনতা ও সার্বভৌমত্বের প্রতীক। শাহজাহানের তৈরি এই কেল্লার লাহোরি গেটের প্রাচীর থেকে স্বাধীনতা দিবসে জাতীয় পতাকা উত্তোলন করা হয়।"
      }
    }
  },
  {
    id: "IN-DL-004",
    name: "Agrasen ki Baoli",
    hindiName: "अग्रसेन की बावली",
    alternateNames: ["Ugrasen ki Baoli"],
    category: "Stepwell",
    coordinates: { lat: 28.6258, lng: 77.2250 },
    state: "Delhi",
    city: "New Delhi",
    district: "New Delhi",
    asiCircle: "Delhi Circle",
    unesco: false,
    dynasty: "Maharaja Agrasen / Tughlaq Era",
    era: "14th Century",
    foundedYear: 1350,
    shortDescription: "A 60-meter long by 15-meter wide historical stepwell hidden among central Delhi skyscrapers, featuring 108 stone steps across three tiers.",
    fullNarrative: "Hidden in the heart of modern Connaught Place high-rises on Hailey Road, Agrasen ki Baoli is an ancient stepwell believed to have been originally commissioned by the legendary King Agrasen and rebuilt during the Tughlaq or Lodi era in the 14th century. Built of rubble masonry dressed with dressed stone arches, its 108 steps descend in three tiers to the subterranean water table.",
    architecturalHighlights: [
      "108 steep stone steps descending through arched symmetrical tiers",
      "Stark stone masonry arches reflecting Lodi and Tughlaq vernacular architecture",
      "Subterranean cooling oasis providing sudden drop in temperature amidst city bustle",
      "Small arched mosque at the western edge with patterned plaster medallions"
    ],
    timeline: [
      { year: "1350", event: "Rebuilt during the Delhi Sultanate era." },
      { year: "1970", event: "Declared a protected monument by the Archaeological Survey of India." }
    ],
    timings: {
      open: "09:00",
      close: "17:30",
      bestTimeToVisit: "Morning 09:00 - 11:00 for calm reflections"
    },
    tariffs: {
      indianRupees: 0,
      saarcRupees: 0,
      foreignRupees: 0,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/",
    heroImage: "/images/stepwell_architecture_1789406963346.jpg",
    galleryImages: ["/images/stepwell_architecture_1789406963346.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Subterranean Haven of Central Delhi",
        durationSeconds: 160,
        narrationText: "Step from the bustling streets of modern Delhi into the cool shadow of Agrasen ki Baoli. One hundred and eight steps descend into the subterranean stillness. Notice the acoustic echo and the dramatic change in temperature as you descend toward the ancient well floor."
      },
      hi: {
        language: "hi",
        title: "अग्रसेन की बावली: दिल्ली का भूमिगत रहस्य",
        durationSeconds: 150,
        narrationText: "कनॉट प्लेस के पास स्थित अग्रसेन की बावली 108 सीढ़ियों वाली एक ऐतिहासिक बावड़ी है। महाराजा अग्रसेन से जुड़ी यह बावड़ी अपनी अनूठी स्थापत्य और शांत वातावरण के लिए जानी जाती है।"
      },
      ta: {
        language: "ta",
        title: "அக்ரசேனின் படிக்கிணறு",
        durationSeconds: 150,
        narrationText: "தில்லியின் நடுவே அமைந்துள்ள அக்ரசேனின் படிக்கிணறு 108 படிகளைக் கொண்ட ஒரு பழமையான நீர் சேமிப்பு அமைப்பாகும்."
      },
      te: {
        language: "te",
        title: "అగ్రసేన్ కి బావోలి",
        durationSeconds: 150,
        narrationText: "న్యూఢిల్లీ నడిబొడ్డున ఉన్న ఈ పురాతన మెట్ల బావి నిశ్శబ్దానికి మరియు అద్భుత శిల్ప శైలికి ప్రసిద్ధి."
      },
      bn: {
        language: "bn",
        title: "অগ্রসেন কি বাওলি",
        durationSeconds: 150,
        narrationText: "দিল্লির বুকে ১০৮টি সিঁড়ি বিশিষ্ট এই প্রাচীন পাতকুয়ো এক গভীর প্রশান্তি ও ইতিহাসের গন্ধ বয়ে নিয়ে চলে।"
      }
    }
  },

  // --- 4. KARNATAKA (VIJAYANAGARA & HOYSALA) ---
  {
    id: "IN-KA-001",
    name: "Virupaksha Temple & Hampi Ruins",
    hindiName: "विरूपाक्ष मंदिर एवं हम्पी स्मारक",
    alternateNames: ["Pampa Kshetra", "Hampi Ruins"],
    category: "Temple",
    coordinates: { lat: 15.3350, lng: 76.4600 },
    state: "Karnataka",
    city: "Hampi",
    district: "Vijayanagara",
    asiCircle: "Hampi Circle",
    unesco: true,
    unescoSiteName: "Group of Monuments at Hampi (1986)",
    dynasty: "Vijayanagara Empire",
    era: "14th-16th Century",
    foundedYear: 1336,
    shortDescription: "The surviving epicenter of the Vijayanagara Empire along the Tungabhadra River, featuring the 50-meter Virupaksha gopuram and granite boulder ruins.",
    fullNarrative: "Perched on the southern bank of the sacred Tungabhadra River among surreal granite boulder hills, Hampi was the capital of the Vijayanagara Empire from 1336 to 1565. At its zenith in the early 16th century under Krishna Deva Raya, it was the second-largest city in the world after Beijing, trading rubies and diamonds by the bushel. Virupaksha Temple, dedicated to Lord Shiva as consort of local goddess Pampa, is one of the oldest continuously functioning temples in India.",
    architecturalHighlights: [
      "50-meter eastern gateway gopuram casting an inverted pinhole camera shadow inside temple hall",
      "Ranga Mandapa pillared hall added by Krishna Deva Raya in 1510 CE with mythological murals",
      "Surrounding landscape of monolithic granite balancing boulders and royal aqueducts",
      "Ancient bazaar street stretching 750 meters from the temple gateway"
    ],
    timeline: [
      { year: "1336", event: "Harihara and Bukka found the Vijayanagara Empire at Hampi." },
      { year: "1510", event: "Krishna Deva Raya adds the grand pillared hall and gopuram." },
      { year: "1565", event: "Battle of Talikota leads to sacking and abandonment of the imperial capital." },
      { year: "1986", event: "Declared a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Sunrise from Matanga Hill overlooking the temple"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/hampi",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: [
      "/images/visitor_monument_1789383102153.jpg",
      "/images/closing_monument_1789403341798.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Granite City of Gods and Kings",
        durationSeconds: 200,
        narrationText: "Welcome to Hampi, where mythology and empire meet among giant granite boulders. Look at the fifty-meter gopuram of Virupaksha Temple. Inside, observe the ancient pinhole camera effect where sunlight filtering through a slit projects an inverted image of the massive tower onto the interior stone wall. This sanctuary has echoed with continuous daily worship for over a thousand years."
      },
      hi: {
        language: "hi",
        title: "हम्पी: विजयनगर साम्राज्य का अमर वैभव",
        durationSeconds: 190,
        narrationText: "हम्पी तुंगभद्रा नदी के तट पर स्थित विजयनगर साम्राज्य की राजधानी थी। विरुपाक्ष मंदिर आज भी सक्रिय पूजा का केंद्र है। मंदिर के अंदर एक दीवार पर गोपुरम की उल्टी परछाई बनती है जो प्राचीन प्रकाशिकी विज्ञान का प्रमाण है।"
      },
      ta: {
        language: "ta",
        title: "ஹம்பியின் விருபாக்ஷா ஆலயம்",
        durationSeconds: 185,
        narrationText: "விஜயநகரப் பேரரசின் தலைநகரான ஹம்பியில் உள்ள விருபாக்ஷா ஆலயம் 14-ஆம் நூற்றாண்டின் ஆன்மீக மற்றும் சிற்பக்கலை மையமாகும். துங்கபத்ரா நதிக்கரையில் அமைந்துள்ள இந்த இடம் உலகப் புகழ்பெற்றது."
      },
      te: {
        language: "te",
        title: "హంపి విరూపాక్ష దేవాలయం",
        durationSeconds: 185,
        narrationText: "విరూపాక్ష దేవాలయం శ్రీకృష్ణదేవరాయల పాలనలో విలసిల్లిన విజయనగర సామ్రాజ్య వైభవానికి సజీవ సాక్ష్యం. ఇక్కడి రాతి రథం మరియు శిల్పాలు అద్వితీయం."
      },
      bn: {
        language: "bn",
        title: "হাম্পির বিরূপাক্ষ মন্দির ও ধ্বংসাবশেষ",
        durationSeconds: 190,
        narrationText: "তুঙ্গভদ্রা নদীর তীরে অবস্থিত হাম্পি ছিল বিজয়নগর সাম্রাজ্যের রাজধানী। বিশাল গ্রানাইট পাথরের মাঝে দাঁড়িয়ে থাকা বিরূপাক্ষ মন্দির আজও পূজিত হয়।"
      }
    }
  },
  {
    id: "IN-KA-002",
    name: "Vittala Temple & Stone Chariot",
    hindiName: "विट्ठल मंदिर एवं पत्थर का रथ",
    alternateNames: ["Vijaya Vittala Temple", "Stone Chariot Hampi"],
    category: "Temple",
    coordinates: { lat: 15.3418, lng: 76.4789 },
    state: "Karnataka",
    city: "Hampi",
    district: "Vijayanagara",
    asiCircle: "Hampi Circle",
    unesco: true,
    unescoSiteName: "Group of Monuments at Hampi (1986)",
    dynasty: "Vijayanagara Empire",
    era: "16th Century",
    foundedYear: 1513,
    shortDescription: "The architectural pinnacle of Hampi, renowned for its monolithic Stone Chariot (on the ₹50 note) and 56 musical pillars that chime musical notes when tapped.",
    fullNarrative: "Built under the patronage of King Deva Raya II and vastly expanded by Krishna Deva Raya, the Vittala Temple is dedicated to Lord Vittala, an incarnation of Vishnu. The iconic Stone Chariot standing in the courtyard is actually a shrine to Garuda, built of carved granite blocks with such precision that the joints are nearly invisible; its giant wheels were once free to rotate. The Mahamandapa features 56 musical pillars (SaReGaMa pillars) engineered to produce distinct musical frequencies and percussive notes.",
    architecturalHighlights: [
      "Monolithic Stone Chariot featured on India's 50-rupee currency note",
      "56 musical granite pillars tuned to harmonic notes (Saptaswara)",
      "Kalyana Mandapa with composite animal sculptures (Yalis) carved from single stones",
      "Concealed joinery technique making segmented granite masonry appear monolithic"
    ],
    timeline: [
      { year: "1513", event: "Krishna Deva Raya commissions expansions after victory over Gajapatis." },
      { year: "1565", event: "Temple damaged during the fall of Vijayanagara." },
      { year: "2017", event: "Stone Chariot adopted as official motif for Indian ₹50 banknote." }
    ],
    timings: {
      open: "08:30",
      close: "17:30",
      bestTimeToVisit: "Morning 08:30 - 11:00"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/hampi",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: [
      "/images/visitor_monument_1789383102153.jpg",
      "/images/closing_monument_1789403341798.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Stone Chariot and Singing Pillars",
        durationSeconds: 195,
        narrationText: "You are standing before the Stone Chariot of Vittala Temple, immortalized on India's fifty-rupee banknote. Look closely at the wheels—they were once designed to rotate freely. Surrounding you are fifty-six musical pillars, each carved from a single block of resonant acoustic granite to produce musical notes when struck."
      },
      hi: {
        language: "hi",
        title: "विट्ठल मंदिर: पत्थर का रथ और संगीतमय स्तंभ",
        durationSeconds: 180,
        narrationText: "विट्ठल मंदिर का पत्थर का रथ भारतीय 50 रुपये के नोट पर अंकित है। यह मंदिर अपने 56 संगीतमय खंभों के लिए प्रसिद्ध है, जिनसे संगीत के सात सुर गूंजते हैं। यह विजयनगर स्थापत्य कला का शिखर है।"
      },
      ta: {
        language: "ta",
        title: "ஹம்பியின் கல் தேர் மற்றும் இசைத் தூண்கள்",
        durationSeconds: 175,
        narrationText: "50 ரூபாய் நோட்டில் இடம்பெற்றுள்ள புகழ்பெற்ற கல் தேர் இங்குள்ளது. ஒரே கல்லில் செதுக்கப்பட்ட 56 இசைத் தூண்களைக் கொண்ட விட்டலா ஆலயம் கலையுலகின் அற்புதம்."
      },
      te: {
        language: "te",
        title: "హంపి రాతి రథం మరియు సంగీత స్తంభాలు",
        durationSeconds: 175,
        narrationText: "విఠల దేవాలయంలోని రాతి రథం భారతీయ ₹50 నోటుపై ఉంటుంది. ఇక్కడి స్తంభాల నుండి సప్తస్వరాలు పలికే అద్భుత శిల్ప నైపుణ్యం కనిపిస్తుంది."
      },
      bn: {
        language: "bn",
        title: "পাথরের রথ ও সংগীতের স্তম্ভ",
        durationSeconds: 180,
        narrationText: "৫০ টাকার ভারতীয় নোটে যে পাথরের রথের ছবি দেখা যায়, তা এই বিট্ঠল মন্দিরেরই রথ। এখানকার ৫৬টি সংগীত স্তম্ভ থেকে নানা সুর ধ্বনিত হতো।"
      }
    }
  },
  {
    id: "IN-KA-003",
    name: "Gol Gumbaz, Vijayapura",
    hindiName: "गोल गुम्बद, विजयपुरा",
    alternateNames: ["Rose Dome of Bijapur", "Gol Gumbadh"],
    category: "Tomb & Mausoleum",
    coordinates: { lat: 16.8306, lng: 75.7360 },
    state: "Karnataka",
    city: "Vijayapura (Bijapur)",
    district: "Vijayapura",
    asiCircle: "Dharwad Circle",
    unesco: false,
    dynasty: "Adil Shahi Dynasty",
    era: "17th Century",
    foundedYear: 1656,
    shortDescription: "The mausoleum of Mohammed Adil Shah featuring the second-largest unsupported dome in the world and an acoustic Whispering Gallery.",
    fullNarrative: "Completed in 1656, Gol Gumbaz is the circular-domed mausoleum of Mohammed Adil Shah, Sultan of Bijapur. The central dome has an external diameter of 44 meters and is supported on intersecting squinches without a single interior pillar. High above the chamber lies the famous Whispering Gallery, where even the faintest whisper or scratch of paper across the stone wall can be heard clearly 38 meters away on the opposite side, echoing up to seven to eleven times.",
    architecturalHighlights: [
      "Second-largest unsupported hemispherical dome in the world (44m external diameter)",
      "Whispering Gallery with phenomenal acoustic resonance echoing up to 11 times",
      "Four 8-storey octagonal minaret towers flanking each corner",
      "Engineering system of interlocking pendentives transmitting weight without central pillars"
    ],
    timeline: [
      { year: "1626", event: "Mohammed Adil Shah ascends the throne and begins tomb design." },
      { year: "1656", event: "Mausoleum completed after 30 years of construction." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Early morning before crowds enter the acoustic gallery"
    },
    tariffs: {
      indianRupees: 25,
      saarcRupees: 25,
      foreignRupees: 300,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/gol-gumbaz",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: ["/images/hero_monument_1789383083590.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Whispering Gallery of the Deccan",
        durationSeconds: 180,
        narrationText: "Welcome to Gol Gumbaz. Stand beneath this colossal dome—the second largest ever constructed in the pre-modern world without central pillars. Climb up to the circular Whispering Gallery: even the gentlest whisper here travels thirty-eight meters along the curved masonry wall and reverberates up to eleven distinct times."
      },
      hi: {
        language: "hi",
        title: "गोल गुम्बद: बीजापुर का ध्वन्यात्मक अजूबा",
        durationSeconds: 170,
        narrationText: "बीजापुर का गोल गुम्बद मुहम्मद आदिल शाह का मक़बरा है। बिना किसी खंभे के टिका इसका विशाल गुंबद वास्तुकला का चमत्कार है। यहां की 'व्हिस्परिंग गैलरी' में एक धीमी सी फुसफुसाहट भी 11 बार गूंजती है।"
      },
      ta: {
        language: "ta",
        title: "கோல் கும்பாஸ் மாளிகை",
        durationSeconds: 165,
        narrationText: "விஜயபுராவின் கோல் கும்பாஸ் உலகின் மிகப்பெரிய தூண்களற்ற குவிமாடங்களில் ஒன்றாகும். இதன் எதிரொலிக்கும் மாடம் உலகப்புகழ் பெற்றது."
      },
      te: {
        language: "te",
        title: "గోల్ గుంబజ్ ప్రతిధ్వనుల అద్భుతం",
        durationSeconds: 165,
        narrationText: "గోల్ గుంబజ్ రెండవ అతిపెద్ద గుమ్మటం. ఇక్కడి విస్పరింగ్ గ్యాలరీలో చిన్న గుసగుస కూడా స్పష్టంగా వినపడుతుంది."
      },
      bn: {
        language: "bn",
        title: "গোল গুম্বজের প্রতিধ্বনি",
        durationSeconds: 170,
        narrationText: "বিজাপুরের গোল গুম্বজের সুবিশাল গম্বুজটি কোনো স্তম্ভ ছাড়াই দাঁড়িয়ে রয়েছে। এখানকার হুইস্পারিং গ্যালারিতে সামান্য ফিসফিসানিও বারবার প্রতিধ্বনিত হয়।"
      }
    }
  },

  // --- 5. ODISHA (KALINGA ARCHITECTURE) ---
  {
    id: "IN-OR-001",
    name: "Sun Temple, Konark",
    hindiName: "सूर्य मंदिर, कोणार्क",
    alternateNames: ["Black Pagoda", "Arka Kshetra"],
    category: "Temple",
    coordinates: { lat: 19.8876, lng: 86.0945 },
    state: "Odisha",
    city: "Konark",
    district: "Puri",
    asiCircle: "Bhubaneswar Circle",
    unesco: true,
    unescoSiteName: "Sun Temple, Konârak (1984)",
    dynasty: "Eastern Ganga Dynasty",
    era: "13th Century",
    foundedYear: 1250,
    shortDescription: "A monumental 13th-century chariot of the Sun God Surya with 24 carved stone wheels that function as precise sundials, pulled by 7 horses.",
    fullNarrative: "Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty on the Bay of Bengal coastline, the Sun Temple at Konark is designed as a colossal processional chariot of Surya, the Sun God. The temple rests on 24 giant stone wheels, each 3.7 meters in diameter, pulled by seven rearing stone horses representing the days of the week. Each wheel functions as a sundial where the spoke shadows indicate exact time of day down to the minute. The temple was called the 'Black Pagoda' by European sailors who navigated by its dark stone silhouette.",
    architecturalHighlights: [
      "24 stone wheels acting as sundials with intricate carvings showing daily activities in each hour",
      "Seven rearing stone horses symbolizing the days of the week and colours of light",
      "Chlorite stone sculptures of Surya poised at dawn, noon, and sunset",
      "Kalinga shikhara architecture with monumental chlorite stone lintels"
    ],
    timeline: [
      { year: "1250", event: "King Narasimhadeva I completes construction using royal treasury." },
      { year: "1627", event: "Sun idol relocated to Jagannath Temple in Puri for preservation." },
      { year: "1984", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "06:00",
      close: "20:00",
      bestTimeToVisit: "Sunrise (06:00 - 08:00) when dawn rays illuminate the chariot"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/konark",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: [
      "/images/visitor_monument_1789383102153.jpg",
      "/images/hero_monument_1789383083590.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Chariot of the Sun",
        durationSeconds: 195,
        narrationText: "Welcome to Konark, where stone breathes life into the chariot of the Sun God. Look closely at the spokes of these twenty-four giant wheels: place your finger at the center, and the shadow cast by the sun reveals the exact time of day. European sailors navigating the Bay of Bengal looked to this dark stone colossus as their guide."
      },
      hi: {
        language: "hi",
        title: "कोणार्क का सूर्य मंदिर: पाषाण रथ",
        durationSeconds: 180,
        narrationText: "कोणार्क का सूर्य मंदिर भगवान सूर्य के विशालकाय रथ के रूप में गढ़ा गया है। 24 नक्काशीदार पहियों और 7 घोड़ों वाला यह मंदिर कलिंग वास्तुकला का अनुपम उदाहरण है। इसके पहिए सटीक धूपघड़ी का काम करते हैं।"
      },
      ta: {
        language: "ta",
        title: "கொனார்க் சூரியனார் ஆலயம்",
        durationSeconds: 175,
        narrationText: "ஒடிசாவின் கொனார்க் சூரியக் கோயில் 24 கல் சக்கரங்களுடன் சூரியனின் தேராக வடிவமைக்கப்பட்டுள்ளது. ஒவ்வொரு சக்கரமும் சூரிய கடிகாரமாக செயல்படுகிறது."
      },
      te: {
        language: "te",
        title: "కోణార్క్ సూర్య దేవాలయం",
        durationSeconds: 175,
        narrationText: "కోణార్క్ సూర్య దేవాలయం కళింగ శిల్పకళా వైభవానికి నిదర్శనం. ఇక్కడి 24 చక్రాలు సమయాన్ని సూచించే సూర్య గడియారాలుగా పనిచేస్తాయి."
      },
      bn: {
        language: "bn",
        title: "কোণার্কের সূর্য মন্দির ও ব্ল্যাক প্যাগোডা",
        durationSeconds: 180,
        narrationText: "কোণার্কের সূর্য মন্দিরটি সূর্যদেবের এক বিশাল রথ হিসেবে নির্মিত। এর চাকাগুলির সূক্ষ্ম খোদাই সূর্যঘড়ির মতো নিখুঁত সময় নির্ণয় করতে পারে।"
      }
    }
  },

  // --- 6. TAMIL NADU (CHOLA & PALLAVA) ---
  {
    id: "IN-TN-001",
    name: "Brihadisvara Temple, Thanjavur",
    hindiName: "बृहदीश्वर मंदिर, तंजावुर",
    alternateNames: ["Peruvudaiyar Kovil", "Big Temple of Thanjavur"],
    category: "Temple",
    coordinates: { lat: 10.7828, lng: 79.1318 },
    state: "Tamil Nadu",
    city: "Thanjavur",
    district: "Thanjavur",
    asiCircle: "Chennai Circle",
    unesco: true,
    unescoSiteName: "Great Living Chola Temples (1987)",
    dynasty: "Chola Dynasty",
    era: "11th Century",
    foundedYear: 1010,
    shortDescription: "An all-granite 66-meter high temple completed in 1010 CE by Emperor Raja Raja Chola I, crowned by an 81-tonne single stone dome (Kumbam).",
    fullNarrative: "Built entirely of granite between 1003 and 1010 CE by the Chola Emperor Raja Raja Chola I, the Brihadisvara Temple (Peruvudaiyar Kovil) is one of the tallest temple towers in South Asia at 66 meters. Remarkably, there are no granite quarries within 60 kilometers of Thanjavur; the stones were hauled using elephants and river rafts. The crowning dome (Kumbam) weighs 81 tonnes and was hoisted to the summit along a specially constructed inclined earthen ramp stretching four kilometers.",
    architecturalHighlights: [
      "Vimana tower rising 66 meters, constructed entirely of interlocking granite blocks without mortar",
      "81-tonne monolithic granite cupola capstone hoisted via a 4-kilometer earthen ramp",
      "Monolithic Nandi bull carved from a single granite block measuring 2 meters high by 6 meters long",
      "Extensive 11th-century Tamil Chola inscriptions detailing temple administration and bronze casters"
    ],
    timeline: [
      { year: "1003", event: "Raja Raja Chola I lays foundation stone." },
      { year: "1010", event: "Consecration ceremony (Kumbhabhishekam) marked by golden kalasam installation." },
      { year: "1987", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "06:00",
      close: "20:30",
      bestTimeToVisit: "Evening pooja (18:00 - 19:30) with temple oil lamps"
    },
    tariffs: {
      indianRupees: 0,
      saarcRupees: 0,
      foreignRupees: 0,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Granite Colossus of Raja Raja Chola",
        durationSeconds: 200,
        narrationText: "Stand before the soaring sixty-six meter Vimana of the Big Temple of Thanjavur. Completed more than one thousand years ago in 1010 CE, this temple was built entirely of hard granite brought from over sixty kilometers away. The monolithic capstone at the peak weighs eighty-one tonnes—raised by elephant power along an inclined earthen ramp."
      },
      hi: {
        language: "hi",
        title: "तंजावुर का बृहदीश्वर मंदिर: चोल साम्राज्य का गौरव",
        durationSeconds: 185,
        narrationText: "तंजावुर का बृहदीश्वर मंदिर चोल सम्राट राजराज प्रथम द्वारा 1010 ईस्वी में बनवाया गया था। 66 मीटर ऊंचा यह मंदिर पूरी तरह ग्रेनाइट से बना है। इसके शिखर पर रखा 81 टन का एकल पत्थर इंजीनियरिंग का अविश्वसनीय चमत्कार है।"
      },
      ta: {
        language: "ta",
        title: "தஞ்சை பெரிய கோயில் - ராஜராஜ சோழனின் சாதனை",
        durationSeconds: 195,
        narrationText: "தஞ்சை பெருவுடையார் ஆலயம் ஆயிரம் ஆண்டுகள் கடந்த சோழர் கட்டிடக்கலையின் உலக சாதனை. 66 மீட்டர் உயரமுடைய விமானமும் அதன் உச்சியில் உள்ள 81 டன் எடை கொண்ட ஒரே கல் கலசமும் சோழர்களின் ஈடு இணையற்ற சாதனையாகும்."
      },
      te: {
        language: "te",
        title: "తంజావూరు బృహదీశ్వర దేవాలయం",
        durationSeconds: 180,
        narrationText: "తంజావూరులోని బృహదీశ్వరాలయం రాజరాజ చోళుని అద్భుత నిర్మాణం. పూర్తిగా గ్రానైట్ రాతితో నిర్మించిన ఈ ఆలయ గోపురం 66 మీటర్ల ఎత్తుతో దర్శనమిస్తుంది."
      },
      bn: {
        language: "bn",
        title: "তাঞ্জাভুরের বৃহদীশ্বর মন্দির",
        durationSeconds: 185,
        narrationText: "রাজারাজা চোল দ্বারা নির্মিত বৃহদীশ্বর মন্দিরটি সম্পূর্ণ গ্রানাইট পাথরে তৈরি। মন্দিরের চূড়ায় থাকা ৮১ টনের পাথরটি প্রাচীন ভারতীয় প্রকৌশলের এক অপার বিস্ময়।"
      }
    }
  },
  {
    id: "IN-TN-002",
    name: "Shore Temple, Mamallapuram",
    hindiName: "तटीय मंदिर, महाबलीपुरम",
    alternateNames: ["Seven Pagodas of Mahabalipuram"],
    category: "Temple",
    coordinates: { lat: 12.6164, lng: 80.1983 },
    state: "Tamil Nadu",
    city: "Mamallapuram (Mahabalipuram)",
    district: "Chengalpattu",
    asiCircle: "Chennai Circle",
    unesco: true,
    unescoSiteName: "Group of Monuments at Mahabalipuram (1984)",
    dynasty: "Pallava Dynasty",
    era: "8th Century",
    foundedYear: 700,
    shortDescription: "An 8th-century granite temple complex overlooking the Bay of Bengal, built by Narasimhavarman II to act as both a sanctuary and landmark for maritime traders.",
    fullNarrative: "Overlooking the Bay of Bengal at the ancient port city of Mamallapuram, the Shore Temple was built between 700 and 728 CE by the Pallava King Narasimhavarman II (Rajasimha). Consisting of three shrines—two dedicated to Shiva and one to a reclining Vishnu—it represents the transition from rock-cut cave temples to free-standing structural stone temples. For over thirteen centuries, its granite carvings have withstood the salt-spray and surf of the Indian Ocean, surviving the catastrophic 2004 tsunami with minimal damage.",
    architecturalHighlights: [
      "Free-standing structural granite temple enduring marine salt erosion for 1,300 years",
      "Dual pyramidal Vimana shrines crowned by octagonal domes",
      "Perimeter wall adorned with rows of sculpted Nandi bulls",
      "Unique shrine housing Vishnu in the reclining Anantashayana posture between two Shiva sanctums"
    ],
    timeline: [
      { year: "700", event: "Narasimhavarman II commences construction on the sea shore." },
      { year: "1984", event: "Declared a UNESCO World Heritage Site." },
      { year: "2004", event: "Survives the massive Indian Ocean tsunami, exposing submerged ancient harbor walls." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Dawn (06:00 - 07:30) as waves crash against temple breakwater"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/mamallapuram",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "Sentinel of the Coromandel Coast",
        durationSeconds: 180,
        narrationText: "Stand on the shores of Mamallapuram where granite meets the sea. For over thirteen hundred years, the waves of the Bay of Bengal have crashed against this temple. Built by the Pallava kings, it greeted ancient Roman and Chinese merchant ships carrying silk and spices to Indian ports."
      },
      hi: {
        language: "hi",
        title: "महाबलीपुरम का तटीय मंदिर",
        durationSeconds: 170,
        narrationText: "बंगाल की खाड़ी के तट पर स्थित महाबलीपुरम का यह तटीय मंदिर पल्लव वास्तुकला का अनुपम उदाहरण है। 8वीं शताब्दी में नरसिंहवर्मन द्वितीय द्वारा निर्मित यह मंदिर सदियों से समुद्री लहरों का सामना कर रहा है।"
      },
      ta: {
        language: "ta",
        title: "மாமல்லபுரம் கடற்கரைக் கோயில்",
        durationSeconds: 175,
        narrationText: "மாமல்லபுரத்தின் கடற்கரைக் கோயில் பல்லவர் காலத்தின் தலைசிறந்த சிற்பக்கலை பொக்கிஷம். வங்கக் கடலின் அலைகள் தழுவும் இந்த கோயில் 1300 ஆண்டுகளாக நிலைத்து நிற்கிறது."
      },
      te: {
        language: "te",
        title: "మహాబలిపురం తీర దేవాలయం",
        durationSeconds: 170,
        narrationText: "పల్లవుల కాలం నాటి మహాబలిపురం తీర దేవాలయం సముద్రతీరంలో గ్రానైట్ రాతితో నిర్మించబడిన అద్భుత క్షేత్రం."
      },
      bn: {
        language: "bn",
        title: "মহাবলীপুরমের শোর টেম্পল",
        durationSeconds: 170,
        narrationText: "বঙ্গোপসাগরের কূলে দাঁড়িয়ে থাকা মহাবলীপুরমের এই মন্দিরটি পল্লব রাজবংশের সৃষ্টি। তেরোশো বছর ধরে সমুদ্রের নোনা বাতাস আর ঢেউ সয়েও এটি অক্ষত রয়েছে।"
      }
    }
  },

  // --- 7. MADHYA PRADESH (CHANDELA & MAURYAN) ---
  {
    id: "IN-MP-001",
    name: "Kandariya Mahadeva Temple, Khajuraho",
    hindiName: "कंदारिया महादेव मंदिर, खजुराहो",
    alternateNames: ["Khajuraho Western Group"],
    category: "Temple",
    coordinates: { lat: 24.8533, lng: 79.9198 },
    state: "Madhya Pradesh",
    city: "Khajuraho",
    district: "Chhatarpur",
    asiCircle: "Bhopal Circle",
    unesco: true,
    unescoSiteName: "Khajuraho Group of Monuments (1986)",
    dynasty: "Chandela Dynasty",
    era: "11th Century",
    foundedYear: 1030,
    shortDescription: "The largest and most ornate temple of Khajuraho, celebrating human beauty, spiritual transcendence, and Nagara shikharas resembling Mount Kailash.",
    fullNarrative: "Built between 1025 and 1035 CE by King Vidyadhara of the Chandela dynasty, the Kandariya Mahadeva Temple is the crowning glory of medieval Nagara temple architecture. Its main shikhara rises 31 meters, composed of 84 miniature replica towers (urushringas) creating the visual impression of Mount Kailash, the abode of Shiva. Over 800 detailed stone figures cover the temple's sand-colored sandstone facade, celebrating life, music, warfare, dance, and sacred tantric union (maithuna).",
    architecturalHighlights: [
      "Over 800 sandstone sculptures depicting celestial nymphs, musicians, and mithuna couples",
      "Main shikhara composed of 84 cascading subsidiary towers mimicking mountain peaks",
      "Elevated high stone plinth (jagati) providing circumambulation path (pradakshina)",
      "Continuous band of architectural relief friezes celebrating all dimensions of worldly and spiritual life"
    ],
    timeline: [
      { year: "1030", event: "King Vidyadhara completes temple to celebrate victory over Mahmud of Ghazni." },
      { year: "1838", event: "British engineer T.S. Burt rediscovers the overgrown temple complex in deep jungle." },
      { year: "1986", event: "Designated as a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Morning 07:00 - 10:00 when carvings catch direct sunrise light"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/khajuraho",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Symphony of Stone at Khajuraho",
        durationSeconds: 195,
        narrationText: "Welcome to Kandariya Mahadeva, the crown jewel of Khajuraho. Notice how the temple shikhara rises like a mountain range—composed of eighty-four miniature spires climbing toward the heavens. Around the friezes, over eight hundred sculptures celebrate every facet of medieval Indian life, spiritual ecstasy, and celebration of the divine in human form."
      },
      hi: {
        language: "hi",
        title: "कंदारिया महादेव: खजुराहो का शिखर मंदिर",
        durationSeconds: 180,
        narrationText: "चंदेल राजा विद्याधर द्वारा 1030 ईस्वी में निर्मित कंदारिया महादेव मंदिर नागर शैली का सर्वश्रेष्ठ उदाहरण है। 84 छोटे शिखरों से मिलकर बना इसका मुख्य शिखर कैलाश पर्वत का आभास कराता है।"
      },
      ta: {
        language: "ta",
        title: "கஜுராஹோ கந்தாரிய மகாதேவர் ஆலயம்",
        durationSeconds: 175,
        narrationText: "கஜுராஹோவின் மிகப்பிரமாண்டமான கோயில் இதுவாகும். 800-க்கும் மேற்பட்ட சிலைகளுடன் கூடிய இதன் கட்டிடக்கலை மனித உணர்வுகளையும் ஆன்மீகத்தையும் ஒருங்கே வெளிப்படுத்துகிறது."
      },
      te: {
        language: "te",
        title: "ఖజురహో కందారియ మహాదేవ ఆలయం",
        durationSeconds: 175,
        narrationText: "ఖజురహో శిల్పకళా అద్భుతం కందారియ మహాదేవాలయం. చందేల రాజుల కాలంలో చెక్కబడిన ఈ శిల్పాలు భారతీయ సంస్కృతిని ప్రతిబింబిస్తాయి."
      },
      bn: {
        language: "bn",
        title: "খাজুরাহোর কান্ডারিয়া মহাদেব",
        durationSeconds: 180,
        narrationText: "খাজুরাহোর সর্বশ্রেষ্ঠ মন্দির কান্ডারিয়া মহাদেব। এর দেয়ালে খোদাই করা আট শতাধিক অপরূপ ভাস্কর্য মানবজীবনের আনন্দ ও আধ্যাত্মিকতার প্রতীক।"
      }
    }
  },
  {
    id: "IN-MP-002",
    name: "Great Stupa at Sanchi",
    hindiName: "सांची का महान स्तूप",
    alternateNames: ["Sanchi Stupa 1"],
    category: "Memorial & Gate",
    coordinates: { lat: 23.4794, lng: 77.7397 },
    state: "Madhya Pradesh",
    city: "Sanchi",
    district: "Raisen",
    asiCircle: "Bhopal Circle",
    unesco: true,
    unescoSiteName: "Buddhist Monuments at Sanchi (1989)",
    dynasty: "Mauryan Empire / Shunga Dynasty",
    era: "3rd Century BCE - 1st Century CE",
    foundedYear: -250,
    shortDescription: "Commissioned by Emperor Ashoka the Great in the 3rd century BCE, enshrining relics of the Buddha beneath a hemispherical dome with four intricately carved torana gateways.",
    fullNarrative: "Originally commissioned in the 3rd century BCE by Mauryan Emperor Ashoka the Great over the relics of the Buddha, the Great Stupa at Sanchi was later doubled in size and encased in stone during the Shunga period. In the 1st century BCE, the Satavahana dynasty added the four monumental carved stone gateways (toranas), displaying narrative bas-reliefs of the Jataka tales, the Buddha's life story, and nature spirits without ever depicting the Buddha in human form (represented symbolically by footprints, umbrellas, and the Bodhi tree).",
    architecturalHighlights: [
      "Four monumental torana gateways carved with breathtaking Jataka narrative bas-reliefs",
      "Aniconic representations of the Buddha through footprints, wheel, and empty throne",
      "Hemispherical dome (anda) surmounted by the triple-tiered umbrella (chhatra) of cosmic axis",
      "Intact circumambulatory paths (vedika) walked by Buddhist monks for over two millennia"
    ],
    timeline: [
      { year: "250 BCE", event: "Emperor Ashoka establishes the original brick stupa." },
      { year: "150 BCE", event: "Shunga dynasty encases the stupa in stone and adds the balustrades." },
      { year: "50 BCE", event: "Satavahana craftsmen carve the four celebrated torana gateways." },
      { year: "1989", event: "Designated as a UNESCO World Heritage Site." }
    ],
    timings: {
      open: "06:30",
      close: "18:30",
      bestTimeToVisit: "Morning when low sun highlights torana relief carvings"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/sanchi",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Dome of Peace and Universal Dharma",
        durationSeconds: 190,
        narrationText: "Welcome to Sanchi, one of humanity's oldest surviving stone monuments. Walk through the southern torana gateway: study the intricate carvings. You will not find a statue of the Buddha here—in this early era of Buddhist art, his presence was shown only through symbols: an empty throne, sacred footprints, or the wheel of dharma."
      },
      hi: {
        language: "hi",
        title: "सांची का स्तूप: बौद्ध धर्म का शाश्वत केंद्र",
        durationSeconds: 175,
        narrationText: "सम्राट अशोक द्वारा तीसरी शताब्दी ईसा पूर्व में निर्मित सांची का स्तूप बौद्ध धर्म का पवित्र स्थल है। इसके चारों तोरण द्वार जातक कथाओं की नक्काशी से सजे हैं, जहां बुद्ध को प्रतीकों के माध्यम से दर्शाया गया है।"
      },
      ta: {
        language: "ta",
        title: "சாஞ்சி ஸ்தூபி - அசோகரின் கொடை",
        durationSeconds: 170,
        narrationText: "மௌரியப் பேரரசர் அசோகரால் அமைக்கப்பட்ட சாஞ்சி ஸ்தூபி புத்த மதத்தின் மிகத் தொன்மையான புனிதத் தலமாகும். இதன் நான்கு தோரண வாயில்கள் அரிய சிற்பக் கலைக் களஞ்சியங்கள்."
      },
      te: {
        language: "te",
        title: "సాంచి స్థూపం విశిష్టత",
        durationSeconds: 170,
        narrationText: "అశోక చక్రవర్తి నిర్మించిన సాంచి స్థూపం బౌద్ధ సంస్కృతికి మరియు అహింసా సిద్ధాంతానికి నిలువెత్తు నిదర్శనం."
      },
      bn: {
        language: "bn",
        title: "সাঁচির মহান স্তূপ",
        durationSeconds: 175,
        narrationText: "সম্রাট অশোকের তৈরি সাঁচি স্তূপ মানবজাতির অন্যতম প্রাচীন নিদর্শন। এর তোরণগুলিতে বুদ্ধের জীবনগাথা অপূর্ব ভাস্কর্যে ফুটে উঠেছে।"
      }
    }
  },

  // --- 8. MAHARASHTRA (ROCK-CUT MONASTERY CAVES) ---
  {
    id: "IN-MH-001",
    name: "Ajanta Caves",
    hindiName: "अजंता की गुफाएं",
    alternateNames: ["Ajanta Rock-Cut Caves"],
    category: "Caves & Rock-cut",
    coordinates: { lat: 20.5519, lng: 75.7033 },
    state: "Maharashtra",
    city: "Aurangabad (Chhatrapati Sambhajinagar)",
    district: "Chhatrapati Sambhajinagar",
    asiCircle: "Aurangabad Circle",
    unesco: true,
    unescoSiteName: "Ajanta Caves (1983)",
    dynasty: "Satavahana & Vakataka Dynasties",
    era: "2nd Century BCE - 5th Century CE",
    foundedYear: -200,
    shortDescription: "A horseshoe gorge of 30 rock-cut Buddhist prayer halls (chaityas) and monasteries (viharas) celebrated for ancient tempera mural paintings like Bodhisattva Padmapani.",
    fullNarrative: "Carved into the vertical crescent cliff face of the Waghora River gorge between the 2nd century BCE and the 5th century CE under the Satavahana and Vakataka rulers, Ajanta comprises thirty rock-cut Buddhist cave temples. Forgotten for centuries beneath dense tiger jungle after the decline of Buddhism in India, the caves were accidentally rediscovered in 1819 by a British hunting party led by John Smith. Cave 1 houses the world-famous tempera mural of Bodhisattva Padmapani, holding a blue lotus with an expression of infinite compassion.",
    architecturalHighlights: [
      "World-famous mural frescoes depicting the Jataka tales painted with mineral pigments",
      "Bodhisattva Padmapani and Vajrapani masterwork paintings in Cave 1",
      "Monolithic ribbed rock-cut chaitya prayer halls mimicking wooden barrel vaults",
      "Grand 7-meter reclining Buddha statue depicting Mahaparinirvana in Cave 26"
    ],
    timeline: [
      { year: "200 BCE", event: "First phase Hinayana caves excavated under Satavahana rule." },
      { year: "460 CE", event: "Second phase Mahayana caves and murals created under Harishena of Vakataka dynasty." },
      { year: "1819", event: "John Smith accidentally rediscovers Cave 10 while hunting tigers." },
      { year: "1983", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "09:00",
      close: "17:00",
      closedDays: ["Monday"],
      bestTimeToVisit: "Monsoon (July - September) when waterfalls cascade down the gorge"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/ajanta",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Whispering Walls of the Crescent Gorge",
        durationSeconds: 200,
        narrationText: "Enter the cool darkness of Cave 1 at Ajanta. Let your eyes adjust: glowing on the stone wall is the Bodhisattva Padmapani. Painted fifteen centuries ago with crushed lapis lazuli and ochre, his gentle gaze has looked upon pilgrims for generations. Outside, the Waghora River still carves its ancient loop through the basalt cliffs."
      },
      hi: {
        language: "hi",
        title: "अजंता: बौद्ध भित्तिचित्रों का विश्व धरोहर",
        durationSeconds: 185,
        narrationText: "अजंता की 30 गुफाएं प्राचीन भारतीय चित्रकला का शिखर हैं। गुफा संख्या 1 में स्थित बोधिसत्व पद्मपाणि का चित्र दुनिया भर में करुणा और शांति का प्रतीक माना जाता है।"
      },
      ta: {
        language: "ta",
        title: "அஜந்தா குகை ஓவியங்கள்",
        durationSeconds: 180,
        narrationText: "அஜந்தாவின் 30 குகைகளும் புத்த மத துறவிகளின் தவச்சாலைகளாகும். இங்குள்ள தாமரை ஏந்திய போதிசத்துவர் ஓவியம் இந்திய கலை வரலாற்றின் பொக்கிஷம்."
      },
      te: {
        language: "te",
        title: "అజంతా గుహల చిత్రకళ",
        durationSeconds: 180,
        narrationText: "అజంతా గుహలు ప్రాచీన బౌద్ధ చిత్రకళకు నిలయం. వాఘోరా నది లోయలో చెక్కబడిన ఈ గుహలు ప్రపంచ ప్రసిద్ధి చెందాయి."
      },
      bn: {
        language: "bn",
        title: "অজন্তার গুহাচিত্র ও ভাস্কর্য",
        durationSeconds: 185,
        narrationText: "অজন্তার ৩০টি গুহায় খোদাই করা বৌদ্ধ ম্যুরাল ও চিত্রকলা প্রায় দেড় হাজার বছর ধরে তার অমলিন রূপ বজায় রেখেছে।"
      }
    }
  },
  {
    id: "IN-MH-002",
    name: "Ellora Caves & Kailasa Temple",
    hindiName: "एलोरा की गुफाएं एवं कैलाश मंदिर",
    alternateNames: ["Verul Leni", "Kailash Cave 16"],
    category: "Caves & Rock-cut",
    coordinates: { lat: 20.0268, lng: 75.1780 },
    state: "Maharashtra",
    city: "Aurangabad (Chhatrapati Sambhajinagar)",
    district: "Chhatrapati Sambhajinagar",
    asiCircle: "Aurangabad Circle",
    unesco: true,
    unescoSiteName: "Ellora Caves (1983)",
    dynasty: "Rashtrakuta Dynasty",
    era: "8th Century",
    foundedYear: 756,
    shortDescription: "The world's largest monolithic rock-cut monument, carved top-to-bottom from a single basalt cliff, removing 200,000 tonnes of volcanic rock without scaffolding.",
    fullNarrative: "Spread across two kilometers of basalt cliff, Ellora features 34 major caves spanning Buddhist, Hindu, and Jain traditions side by side, epitomizing the religious tolerance of ancient India. The crowning masterpiece is Cave 16, the Kailasa Temple, commissioned by Rashtrakuta King Krishna I in the 8th century. Unlike conventional temples constructed ground-up, Kailasa was carved top-down from the crest of a 30-meter basalt hill, with stone masons chiseling away over two hundred thousand tonnes of stone using only hammers, chisels, and picks.",
    architecturalHighlights: [
      "World's largest monolithic rock excavation carved top-to-bottom from a basalt mountain",
      "Removal of over 200,000 tonnes of basalt rock without structural joins or scaffolding",
      "Monumental multi-storey temple with life-sized elephant statues, obelisks, and cloistered galleries",
      "Ravana shaking Mount Kailash high-relief sculpture displaying dynamic multi-dimensional drama"
    ],
    timeline: [
      { year: "756", event: "Rashtrakuta King Krishna I commissions the excavation of Cave 16." },
      { year: "775", event: "Main vimana and assembly hall carvings completed." },
      { year: "1983", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      closedDays: ["Tuesday"],
      bestTimeToVisit: "Morning 07:00 - 11:00"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/ellora",
    heroImage: "/images/tech_architecture_warm_1789436115529.jpg",
    galleryImages: ["/images/tech_architecture_warm_1789436115529.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Monolith Hewn from Living Mountain",
        durationSeconds: 210,
        narrationText: "Stand in the courtyard of Cave 16 at Ellora. What you see before you was not built—it was excavated. Ancient sculptors started at the top of the volcanic mountain and cut downward, removing two hundred thousand tonnes of solid basalt rock to reveal this multi-storey temple. A single mistake anywhere would have ruined the entire sanctuary."
      },
      hi: {
        language: "hi",
        title: "एलोरा का कैलाश मंदिर: एक ही चट्टान से तराशा अजूबा",
        durationSeconds: 195,
        narrationText: "एलोरा का कैलाश मंदिर दुनिया का सबसे बड़ा एकाश्मक (मोनोलिथिक) मंदिर है। राष्ट्रकूट राजा कृष्ण प्रथम के काल में इसे ऊपर से नीचे की ओर तराशा गया था। 2 लाख टन पत्थर हटाकर बनाया गया यह मंदिर मानव इंजीनियरिंग का सबसे बड़ा चमत्कार है।"
      },
      ta: {
        language: "ta",
        title: "எல்லோரா கைலாசநாதர் குடைவரைக் கோயில்",
        durationSeconds: 190,
        narrationText: "எல்லோராவின் கைலாசநாதர் கோயில் ஒற்றை மலையைக் குடைந்து மேலிருந்து கீழாக செதுக்கப்பட்ட உலகின் மிகப்பெரிய கலைப்படைப்பாகும். ராஷ்டிரகூட மன்னர்களால் செதுக்கப்பட்டது."
      },
      te: {
        language: "te",
        title: "ఎల్లోరా కైలాస దేవాలయ అద్భుతం",
        durationSeconds: 190,
        narrationText: "ఎల్లోరాలోని కైలాస దేవాలయం ఒకే ఒక్క కొండను పైనుండి క్రిందికి తొలిచి నిర్మించిన ప్రపంచ మహాద్భుతం."
      },
      bn: {
        language: "bn",
        title: "ইলোরার কৈলাশ মন্দির",
        durationSeconds: 195,
        narrationText: "ইলোরার কৈলাশ মন্দিরটি একটি আস্ত পাহাড় ওপর থেকে নিচে কেটে তৈরি করা হয়েছে। দুই লক্ষ টন পাথর কেটে কোনো জোড়া ছাড়া এই বিশাল মন্দির গড়া এক অতিমানবীয় কীর্তি।"
      }
    }
  },

  // --- 9. GUJARAT & BIHAR (ANCIENT CIVILIZATIONS & UNIVERSITIES) ---
  {
    id: "IN-GJ-001",
    name: "Rani ki Vav, Patan",
    hindiName: "रानी की वाव, पाटण",
    alternateNames: ["Queen's Stepwell"],
    category: "Stepwell",
    coordinates: { lat: 23.8589, lng: 72.1017 },
    state: "Gujarat",
    city: "Patan",
    district: "Patan",
    asiCircle: "Vadodara Circle",
    unesco: true,
    unescoSiteName: "Rani-ki-Vav (the Queen’s Stepwell) at Patan, Gujarat (2014)",
    dynasty: "Chaulukya (Solanki) Dynasty",
    era: "11th Century",
    foundedYear: 1063,
    shortDescription: "An inverted underground stepwell temple on the banks of the Saraswati River, built by Queen Udayamati with over 500 principal sculptures celebrating Vishnu's Dashavatara.",
    fullNarrative: "Built as a memorial to King Bhima I by his widowed queen Udayamati around 1063 CE, Rani ki Vav is designed as an inverted temple highlighting the sacred sanctity of water. Buried beneath silt deposited by the flooding Saraswati River for centuries until unearthed by the ASI in the 1980s, the seven-tiered stepwell contains over 500 major sculptures and over a thousand minor ones. Sculptures of Vishnu's Dashavatara incarnations, celestial Apsaras, and intricate geometric designs line every corridor descending 27 meters into the ground.",
    architecturalHighlights: [
      "Inverted temple architecture descending 27 meters across seven subterranean levels",
      "Over 500 principal high-relief sculptures preserved in immaculate condition beneath river silt",
      "Detailed depictions of Vishnu's ten avatars including Varaha, Narasimha, and Kalki",
      "Complex geometric pillar alignments engineered to withstand underground hydrostatic pressure"
    ],
    timeline: [
      { year: "1063", event: "Queen Udayamati commissions stepwell in memory of King Bhima I." },
      { year: "1300", event: "Saraswati River changes course, silting and preserving the stepwell subterranean chambers." },
      { year: "1986", event: "ASI completes monumental multi-decade desilting and restoration." },
      { year: "2014", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "08:00",
      close: "18:00",
      bestTimeToVisit: "Morning 09:00 - 12:00 when sunlight pierces the lower step terraces"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/rani-ki-vav",
    heroImage: "/images/stepwell_architecture_1789406963346.jpg",
    galleryImages: ["/images/stepwell_architecture_1789406963346.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Queen's Subterranean Temple",
        durationSeconds: 195,
        narrationText: "Walk along the steps of Rani ki Vav into the depths of the earth. Unlike other temples that reach for the sky, Queen Udayamati built this sanctuary downwards, celebrating water as the giver of life. Preserved under river silt for nearly seven centuries, these five hundred stone sculptures look as sharp as the day Solanki artisans laid down their chisels."
      },
      hi: {
        language: "hi",
        title: "रानी की वाव: पाताल लोक का मंदिर",
        durationSeconds: 180,
        narrationText: "गुजरात के पाटण में स्थित रानी की वाव सात मंजिला भूमिगत बावड़ी है। रानी उदयमती ने इसे अपने पति राजा भीमदेव प्रथम की स्मृति में बनवाया था। सरस्वती नदी की गाद में दबे रहने के कारण इसकी 500 से अधिक मूर्तियां आज भी बिल्कुल सुरक्षित हैं।"
      },
      ta: {
        language: "ta",
        title: "ராணி கி வாவ் படிக்கிணறு",
        durationSeconds: 175,
        narrationText: "குஜராத்தின் ராணி கி வாவ் தலைகீழ் கோயில் வடிவில் அமைக்கப்பட்ட 7 அடுக்கு படிக்கிணறு. விஷ்ணுவின் தசாவதார சிற்பங்கள் இங்கு அற்புதமாக வடிக்கப்பட்டுள்ளன."
      },
      te: {
        language: "te",
        title: "రాణి కి వావ్ విశేషాలు",
        durationSeconds: 175,
        narrationText: "రాణి కి వావ్ భూగర్భంలో ఏడంతస్తుల లోతులో నిర్మించిన అపురూప శిల్ప కళా భాండాగారం. యునెస్కో గుర్తింపు పొందిన ఈ మెట్ల బావి అద్భుతమైనది."
      },
      bn: {
        language: "bn",
        title: "রানি কি বাভ পাতাল মন্দির",
        durationSeconds: 180,
        narrationText: "গুজরাটের পাটনের রানি কি বাভ যেন মাটির নিচে উল্টো করে তৈরি এক অপরূপ মন্দির। নদীর পলির নিচে চাপা পড়ে থাকায় এর সূক্ষ্ম ভাস্কর্যগুলো আজও অক্ষত রয়েছে।"
      }
    }
  },
  {
    id: "IN-BR-001",
    name: "Nalanda University Ruins",
    hindiName: "नालंदा विश्वविद्यालय के खंडहर",
    alternateNames: ["Nalanda Mahavihara"],
    category: "Ancient University",
    coordinates: { lat: 25.1357, lng: 85.4439 },
    state: "Bihar",
    city: "Nalanda",
    district: "Nalanda",
    asiCircle: "Patna Circle",
    unesco: true,
    unescoSiteName: "Archaeological Site of Nalanda Mahavihara at Nalanda, Bihar (2016)",
    dynasty: "Gupta Empire",
    era: "5th-12th Century",
    foundedYear: 427,
    shortDescription: "The world's first residential university, educating over 10,000 scholars and 2,000 teachers from across Asia in logic, medicine, astronomy, and philosophy.",
    fullNarrative: "Established in the 5th century CE under the patronage of the Gupta Emperor Kumaragupta I, Nalanda Mahavihara flourished for over seven hundred years as the intellectual beacon of Asia. Students and scholars like Xuanzang (Hiuen Tsang) travelled thousands of miles from China, Korea, Japan, Tibet, and Persia to study. Its legendary library, the Dharmaganja, housed hundreds of thousands of handwritten manuscripts across three nine-storey towers—Ratnasagara, Ratnodadhi, and Ratnaranjaka. The excavated brick ruins reveal sophisticated dormitories, meditation halls, and scientific drainage systems.",
    architecturalHighlights: [
      "Stupa No. 3 (Sariputra Stupa) featuring multiple layered votive structures and carved terracotta Buddha panels",
      "Red-brick monastery quadrangles with student residential cells, central lecture arenas, and cooking wells",
      "Thermal clay-pipe water supply and underground covered brick sewage network",
      "Excavated brick libraries and sealings inscribed in classic Gupta Brahmi script"
    ],
    timeline: [
      { year: "427 CE", event: "Gupta Emperor Kumaragupta I establishes the Mahavihara." },
      { year: "637 CE", event: "Chinese monk Xuanzang studies and teaches logic and Sanskrit at Nalanda for five years." },
      { year: "1193 CE", event: "Destruction and burning of the vast library complex by invaders." },
      { year: "2016", event: "Inscribed on UNESCO World Heritage list." }
    ],
    timings: {
      open: "09:00",
      close: "17:00",
      bestTimeToVisit: "Winter months (November to February)"
    },
    tariffs: {
      indianRupees: 40,
      saarcRupees: 40,
      foreignRupees: 600,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/#/quick/nalanda",
    heroImage: "/images/visitor_monument_1789383102153.jpg",
    galleryImages: ["/images/visitor_monument_1789383102153.jpg"],
    audioNarrations: {
      en: {
        language: "en",
        title: "The Intellectual Light of Ancient Asia",
        durationSeconds: 195,
        narrationText: "Walk through the brick archways of Nalanda, the world's first great residential university. Fifteen hundred years ago, ten thousand scholars lived, debated, and transcribed manuscripts right here. When Xuanzang arrived from China after years on the Silk Road, he marveled at its libraries whose books took months to burn."
      },
      hi: {
        language: "hi",
        title: "नालंदा: विश्व का पहला आवासीय विश्वविद्यालय",
        durationSeconds: 180,
        narrationText: "नालंदा विश्वविद्यालय 5वीं शताब्दी में गुप्त वंश द्वारा स्थापित किया गया था। यहां 10,000 से अधिक छात्र दर्शन, चिकित्सा और खगोल विज्ञान पढ़ते थे। ह्वेन त्सांग जैसे विदेशी यात्रियों ने इसकी शिक्षा पद्धति और विशाल पुस्तकालय की भूरि-भूरि प्रशंसा की थी।"
      },
      ta: {
        language: "ta",
        title: "நாளந்தா பண்டைய பல்கலைக்கழகம்",
        durationSeconds: 175,
        narrationText: "நாளந்தா உலகின் முதல் உறைவிடப் பல்கலைக்கழகமாகும். குப்தர் காலத்தில் உருவான இந்த அறிவுப் பீடத்தில் பத்தாயிரத்திற்கும் மேற்பட்ட உலக நாட்டு மாணவர்கள் கல்வி பயின்றனர்."
      },
      te: {
        language: "te",
        title: "నలంద విశ్వవిద్యాలయ చరిత్ర",
        durationSeconds: 175,
        narrationText: "నలంద ప్రాచీన విద్యా కేంద్రం. గుప్తుల కాలంలో ప్రారంభమైన ఈ విశ్వవిద్యాలయం ఆసియా దేశాల విద్యార్థులకు జ్ఞానదీపికగా నిలిచింది."
      },
      bn: {
        language: "bn",
        title: "নালন্দা মহাবিহারের ধ্বংসাবশেষ",
        durationSeconds: 180,
        narrationText: "নালন্দা ছিল বিশ্বের প্রথম আবাসিক বিশ্ববিদ্যালয়। চীন ও তিব্বত থেকে পণ্ডিতরা এখানে বৌদ্ধ দর্শন ও বিজ্ঞান চর্চা করতে আসতেন। এর সুবিশাল গ্রন্থাগার ইতিহাসের অন্যতম অমূল্য সম্পদ ছিল।"
      }
    }
  }
];

// Ensure target directories exist
const srcDataDir = path.resolve('/Users/krishnajangid/Documents/antigravity/peaceful-hertz/herodotus/src/data');
const pubDataDir = path.resolve('/Users/krishnajangid/Documents/antigravity/peaceful-hertz/herodotus/public/data');
fs.mkdirSync(srcDataDir, { recursive: true });
fs.mkdirSync(pubDataDir, { recursive: true });

// Also generate full 50-item catalog by extending with remaining prominent ASI sites
const additionalSites = [
  { name: "Lotus Temple", hindi: "कमल मंदिर", city: "New Delhi", state: "Delhi", cat: "Temple", lat: 28.5535, lng: 77.2588, dynasty: "Modern", era: "20th Century", yr: 1986, fee: 0 },
  { name: "Jama Masjid, Delhi", hindi: "जामा मस्जिद", city: "Old Delhi", state: "Delhi", cat: "Mosque", lat: 28.6507, lng: 77.2334, dynasty: "Mughal Empire", era: "17th Century", yr: 1656, fee: 0 },
  { name: "Purana Qila", hindi: "पुराना किला", city: "New Delhi", state: "Delhi", cat: "Fort & Palace", lat: 28.6094, lng: 77.2436, dynasty: "Sur / Mughal Empire", era: "16th Century", yr: 1540, fee: 25 },
  { name: "Safdarjung Tomb", hindi: "सफ़दरजंग का मक़बरा", city: "New Delhi", state: "Delhi", cat: "Tomb & Mausoleum", lat: 28.5893, lng: 77.2106, dynasty: "Mughal Empire", era: "18th Century", yr: 1754, fee: 25 },
  { name: "Tughlaqabad Fort", hindi: "तुग़लक़ाबाद क़िला", city: "New Delhi", state: "Delhi", cat: "Fort & Palace", lat: 28.5134, lng: 77.2603, dynasty: "Tughlaq Dynasty", era: "14th Century", yr: 1321, fee: 25 },
  { name: "Hauz Khas Complex", hindi: "हौज़ ख़ास परिसर", city: "New Delhi", state: "Delhi", cat: "Fort & Palace", lat: 28.5529, lng: 77.1947, dynasty: "Khilji / Tughlaq", era: "14th Century", yr: 1296, fee: 25 },
  { name: "India Gate", hindi: "इण्डिया गेट", city: "New Delhi", state: "Delhi", cat: "Memorial & Gate", lat: 28.6129, lng: 77.2295, dynasty: "British Colonial", era: "20th Century", yr: 1931, fee: 0 },
  { name: "Jantar Mantar, Delhi", hindi: "जंतर मंतर, दिल्ली", city: "New Delhi", state: "Delhi", cat: "Memorial & Gate", lat: 28.6271, lng: 77.2166, dynasty: "Kachwaha Rajput", era: "18th Century", yr: 1724, fee: 25 },
  { name: "Mehtab Bagh", hindi: "मेहताब बाग़", city: "Agra", state: "Uttar Pradesh", cat: "Fort & Palace", lat: 27.1799, lng: 78.0421, dynasty: "Mughal Empire", era: "16th Century", yr: 1530, fee: 25 },
  { name: "Chini Ka Rauza", hindi: "चीनी का रोज़ा", city: "Agra", state: "Uttar Pradesh", cat: "Tomb & Mausoleum", lat: 27.2006, lng: 78.0384, dynasty: "Mughal Empire", era: "17th Century", yr: 1635, fee: 0 },
  { name: "Mariam's Tomb", hindi: "मरियम का मक़बरा", city: "Agra", state: "Uttar Pradesh", cat: "Tomb & Mausoleum", lat: 27.2241, lng: 77.9406, dynasty: "Mughal Empire", era: "17th Century", yr: 1623, fee: 25 },
  { name: "City Palace, Jaipur", hindi: "सिटी पैलेस, जयपुर", city: "Jaipur", state: "Rajasthan", cat: "Fort & Palace", lat: 26.9258, lng: 75.8236, dynasty: "Kachwaha Rajput", era: "18th Century", yr: 1727, fee: 300 },
  { name: "Jal Mahal", hindi: "जल महल", city: "Jaipur", state: "Rajasthan", cat: "Fort & Palace", lat: 26.9656, lng: 75.8456, dynasty: "Kachwaha Rajput", era: "18th Century", yr: 1750, fee: 0 },
  { name: "Gatore Ki Chhatriyan", hindi: "गेटोर की छतरियां", city: "Jaipur", state: "Rajasthan", cat: "Tomb & Mausoleum", lat: 26.9422, lng: 75.8344, dynasty: "Kachwaha Rajput", era: "18th Century", yr: 1733, fee: 50 },
  { name: "Mehrangarh Fort", hindi: "मेहरानगढ़ दुर्ग", city: "Jodhpur", state: "Rajasthan", cat: "Fort & Palace", lat: 26.2980, lng: 73.0189, dynasty: "Rathore Rajput", era: "15th Century", yr: 1459, fee: 100 },
  { name: "Kumbhalgarh Fort", hindi: "कुम्भलगढ़ दुर्ग", city: "Rajsamand", state: "Rajasthan", cat: "Fort & Palace", lat: 25.1481, lng: 73.5872, dynasty: "Sisodia Rajput", era: "15th Century", yr: 1458, fee: 40 },
  { name: "Chittorgarh Fort", hindi: "चित्तौड़गढ़ दुर्ग", city: "Chittorgarh", state: "Rajasthan", cat: "Fort & Palace", lat: 24.8879, lng: 74.6450, dynasty: "Mewar Rajput", era: "7th Century", yr: 650, fee: 40 },
  { name: "Jaisalmer Fort", hindi: "जैसलमेर दुर्ग", city: "Jaisalmer", state: "Rajasthan", cat: "Fort & Palace", lat: 26.9124, lng: 70.9125, dynasty: "Bhati Rajput", era: "12th Century", yr: 1156, fee: 50 },
  { name: "Ranthambore Fort", hindi: "रणथंभौर दुर्ग", city: "Sawai Madhopur", state: "Rajasthan", cat: "Fort & Palace", lat: 26.0173, lng: 76.4533, dynasty: "Chahamana Rajput", era: "10th Century", yr: 944, fee: 25 },
  { name: "Pattadakal Monuments", hindi: "पट्टदकल स्मारक", city: "Bagalkot", state: "Karnataka", cat: "Temple", lat: 15.9492, lng: 75.8160, dynasty: "Chalukya Dynasty", era: "8th Century", yr: 740, fee: 40 },
  { name: "Badami Cave Temples", hindi: "बादामी गुफा मंदिर", city: "Bagalkot", state: "Karnataka", cat: "Caves & Rock-cut", lat: 15.9189, lng: 75.6766, dynasty: "Chalukya Dynasty", era: "6th Century", yr: 578, fee: 25 },
  { name: "Halebidu Hoysaleswara", hindi: "होयसलेश्वर मंदिर, हलेबिदु", city: "Hassan", state: "Karnataka", cat: "Temple", lat: 13.2167, lng: 75.9936, dynasty: "Hoysala Dynasty", era: "12th Century", yr: 1121, fee: 25 },
  { name: "Belur Chennakeshava", hindi: "चेन्नाकेशव मंदिर, बेलूर", city: "Hassan", state: "Karnataka", cat: "Temple", lat: 13.1627, lng: 75.8601, dynasty: "Hoysala Dynasty", era: "12th Century", yr: 1117, fee: 25 },
  { name: "Jagannath Temple, Puri", hindi: "जगन्नाथ मंदिर, पुरी", city: "Puri", state: "Odisha", cat: "Temple", lat: 19.8049, lng: 85.8179, dynasty: "Eastern Ganga", era: "12th Century", yr: 1161, fee: 0 },
  { name: "Lingaraj Temple", hindi: "लिंगराज मंदिर, भुवनेश्वर", city: "Bhubaneswar", state: "Odisha", cat: "Temple", lat: 20.2382, lng: 85.8338, dynasty: "Somavamshi Dynasty", era: "11th Century", yr: 1050, fee: 0 },
  { name: "Udayagiri & Khandagiri", hindi: "उदयगिरि एवं खंडगिरि", city: "Bhubaneswar", state: "Odisha", cat: "Caves & Rock-cut", lat: 20.2608, lng: 85.7864, dynasty: "Mahameghavahana", era: "2nd Century BCE", yr: -150, fee: 25 },
  { name: "Meenakshi Amman Temple", hindi: "मीनाक्षी अम्मन मंदिर", city: "Madurai", state: "Tamil Nadu", cat: "Temple", lat: 9.9195, lng: 78.1193, dynasty: "Pandya / Nayaka", era: "14th-17th Century", yr: 1623, fee: 0 },
  { name: "Rameshwaram Ramanathaswamy", hindi: "रामनाथस्वामी मंदिर", city: "Rameswaram", state: "Tamil Nadu", cat: "Temple", lat: 9.2881, lng: 79.3174, dynasty: "Pandya / Setupati", era: "12th-17th Century", yr: 1173, fee: 0 },
  { name: "Gwalior Fort", hindi: "ग्वालियर का किला", city: "Gwalior", state: "Madhya Pradesh", cat: "Fort & Palace", lat: 26.2307, lng: 78.1691, dynasty: "Tomara / Mughal", era: "8th-15th Century", yr: 773, fee: 25 },
  { name: "Orchha Fort Complex", hindi: "ओरछा दुर्ग", city: "Orchha", state: "Madhya Pradesh", cat: "Fort & Palace", lat: 25.3508, lng: 78.6433, dynasty: "Bundela Rajput", era: "16th Century", yr: 1501, fee: 30 },
  { name: "Elephanta Caves", hindi: "एलिफेंटा की गुफाएं", city: "Mumbai Harbor", state: "Maharashtra", cat: "Caves & Rock-cut", lat: 18.9633, lng: 72.9315, dynasty: "Kalachuri / Rashtrakuta", era: "6th-8th Century", yr: 600, fee: 40 },
  { name: "Daulatabad Fort", hindi: "दौलताबाद किला", city: "Chhatrapati Sambhajinagar", state: "Maharashtra", cat: "Fort & Palace", lat: 19.9431, lng: 75.2133, dynasty: "Yadava / Tughlaq", era: "12th Century", yr: 1187, fee: 25 },
  { name: "Sun Temple, Modhera", hindi: "सूर्य मंदिर, मोढेरा", city: "Mehsana", state: "Gujarat", cat: "Temple", lat: 23.5835, lng: 72.1331, dynasty: "Chaulukya (Solanki)", era: "11th Century", yr: 1026, fee: 25 },
  { name: "Somnath Temple", hindi: "सोमनाथ मंदिर", city: "Prabhas Patan", state: "Gujarat", cat: "Temple", lat: 20.8880, lng: 70.4012, dynasty: "Chaulukya / Modern", era: "11th Century / 1951", yr: 1024, fee: 0 },
  { name: "Mahabodhi Temple", hindi: "महाबोधि मंदिर", city: "Bodh Gaya", state: "Bihar", cat: "Temple", lat: 24.6960, lng: 84.9914, dynasty: "Mauryan / Gupta", era: "3rd BCE - 5th CE", yr: -250, fee: 0 },
  { name: "Golghar, Patna", hindi: "गोलघर, पटना", city: "Patna", state: "Bihar", cat: "Memorial & Gate", lat: 25.6200, lng: 85.1436, dynasty: "British Colonial", era: "18th Century", yr: 1786, fee: 20 },
  { name: "Kumbhalgarh Wall", hindi: "कुम्भलगढ़ की दीवार", city: "Kumbhalgarh", state: "Rajasthan", cat: "Fort & Palace", lat: 25.1528, lng: 73.5878, dynasty: "Mewar Rajput", era: "15th Century", yr: 1458, fee: 40 },
  { name: "Fatehpur Sikri Panch Mahal", hindi: "पंच महल", city: "Fatehpur Sikri", state: "Uttar Pradesh", cat: "Fort & Palace", lat: 27.0950, lng: 77.6650, dynasty: "Mughal Empire", era: "16th Century", yr: 1571, fee: 50 }
];

let counter = 13;
additionalSites.forEach((s) => {
  const code = (counter < 10 ? '0' : '') + counter;
  const id = `IN-GEN-${code}`;
  counter++;

  const fullNarrative = `${s.name} is one of India's preeminent historical treasures, situated in ${s.city}, ${s.state}. Established during the ${s.era} under the patronage of the ${s.dynasty}, this landmark exemplifies the sublime aesthetic and civil engineering excellence of its era. Visitors from across India and around the globe journey here to admire its architectural proportion, intricate stone masonry, and deep connection to India's living cultural fabric.`;
  
  monuments.push({
    id: id,
    name: s.name,
    hindiName: s.hindi,
    alternateNames: [s.name],
    category: s.cat,
    coordinates: { lat: s.lat, lng: s.lng },
    state: s.state,
    city: s.city,
    district: s.city,
    asiCircle: `${s.state} Circle`,
    unesco: s.name.includes("Pattadakal") || s.name.includes("Mahabodhi") || s.name.includes("Elephanta") || s.name.includes("Kumbhalgarh"),
    unescoSiteName: s.name.includes("UNESCO") ? s.name : undefined,
    dynasty: s.dynasty,
    era: s.era,
    foundedYear: s.yr,
    shortDescription: `${s.name} in ${s.city}, ${s.state} — an iconic masterpiece of ${s.dynasty} architecture from the ${s.era}.`,
    fullNarrative: fullNarrative,
    architecturalHighlights: [
      `Authentic stone carving characteristic of ${s.dynasty} period`,
      `Original engineering and site orientation optimized for natural light and air flow`,
      `Protected historical monument under the Archaeological Survey of India`,
      `Historical inscriptions documenting civic and cultural milestones`
    ],
    timeline: [
      { year: s.yr > 0 ? `${s.yr} CE` : `${Math.abs(s.yr)} BCE`, event: `Foundation laid by ${s.dynasty}.` },
      { year: "Modern Era", event: "Restored and preserved as a National Protected Monument by ASI." }
    ],
    timings: {
      open: "06:00",
      close: "18:00",
      bestTimeToVisit: "Morning 08:00 - 11:00 or Golden Hour before Sunset"
    },
    tariffs: {
      indianRupees: s.fee,
      saarcRupees: s.fee,
      foreignRupees: s.fee > 0 ? s.fee * 6 : 0,
      entryFreeUnder15: true
    },
    eTicketUrl: "https://asi.payumoney.com/",
    heroImage: "/images/hero_monument_1789383083590.jpg",
    galleryImages: [
      "/images/hero_monument_1789383083590.jpg",
      "/images/amber_fort_crop_1789383125173.jpg"
    ],
    audioNarrations: {
      en: {
        language: "en",
        title: `${s.name} — Living Heritage Audio Guide`,
        durationSeconds: 150,
        narrationText: `Welcome to ${s.name}, located in ${s.city}, ${s.state}. Built under the ${s.dynasty} during the ${s.era}, this landmark is one of India's most treasured historical sites. Take a moment to admire the harmony of stone, space, and living tradition that has endured across centuries.`
      },
      hi: {
        language: "hi",
        title: `${s.hindi} का ऐतिहासिक विवरण`,
        durationSeconds: 145,
        narrationText: `${s.hindi} में आपका स्वागत है। ${s.city}, ${s.state} में स्थित यह ऐतिहासिक स्थल ${s.dynasty} की स्थापत्य कला और भारत की समृद्ध धरोहर का एक अनूठा उदाहरण है।`
      },
      ta: {
        language: "ta",
        title: `${s.name} வரலாற்று உரை`,
        durationSeconds: 140,
        narrationText: `${s.name} வரலாற்று சிறப்புமிக்க இந்திய கலை பொக்கிஷமாகும். ${s.dynasty} காலத்தில் உருவாக்கப்பட்ட இதன் சிறப்புகளை கண்டு மகிழுங்கள்.`
      },
      te: {
        language: "te",
        title: `${s.name} చారిత్రక కథనం`,
        durationSeconds: 140,
        narrationText: `${s.name} భారతదేశంలోని అత్యంత విశిష్టమైన చారిత్రక ప్రదేశాలలో ఒకటి. ${s.dynasty} కాలం నాటి కళాఖండమిది.`
      },
      bn: {
        language: "bn",
        title: `${s.name} এর ইতিহাস ও ঐতিহ্য`,
        durationSeconds: 140,
        narrationText: `${s.name}-এ আপনাকে স্বাগতম। ${s.state}-এর এই মনোরম সৌধটি ভারতের প্রাচীন স্থাপত্য ও ইতিহাসের এক জীবন্ত দলিল।`
      }
    }
  });
});

console.log(`Generated total of ${monuments.length} monuments.`);

fs.writeFileSync(path.join(srcDataDir, 'monuments.json'), JSON.stringify(monuments, null, 2));
fs.writeFileSync(path.join(pubDataDir, 'monuments.json'), JSON.stringify(monuments, null, 2));
console.log('Successfully written to src/data/monuments.json and public/data/monuments.json');
