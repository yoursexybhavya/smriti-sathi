# Smriti Sathi (স্মৃতি সাথী / स्मृति साथी)

<div align="center">

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026%20Problem%20Statement%20SIH26003-orange?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![Ministry of Development of North Eastern Region](https://img.shields.io/badge/Ministry-MDoNER-green?style=for-the-badge)](https://mdoner.gov.in/)
[![Powered by Bhashini AI](https://img.shields.io/badge/AI%20Engine-Bhashini%20(MeitY)-blue?style=for-the-badge)](https://bhashini.gov.in/)
[![Platform](https://img.shields.io/badge/Platform-Android%20Tablet%20%26%20Mobile-brightgreen?style=for-the-badge&logo=android)](https://github.com/yoursexybhavya/smriti-sathi/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North East India**

*Memory care that speaks your language — 100% Offline-First, culturally resonant, and free of paywalls.*

[Explore Architecture](#-system-architecture) • [Download Android APK](#-download--install-android-apk) • [Features](#-key-features) • [Clinical Grounding](#-clinical-validation--cst) • [Contributing](#-contributing)

</div>

---

## 🧭 The Problem We Solve

In the **North Eastern Region (NER)** of India, elderly patients suffering from Mild Cognitive Impairment (MCI) and Dementia face acute healthcare barriers:
1. **Linguistic Fragmentation:** Elders predominantly speak native languages—such as **Assamese (অসমীয়া), Bodo (बर'), and Manipuri (মৈতৈলোন্)**—while existing memory tools are almost exclusively in English.
2. **Rural Connectivity Gaps:** Unstable cellular and Wi-Fi networks in rural hill communities disrupt cloud-dependent healthcare platforms.
3. **Digital Illiteracy & Tremors:** Traditional mobile UIs with tiny text and complex navigation cause frustration, cognitive fatigue, and resistance in dementia patients.

**Smriti Sathi** bridges these divides by coupling **Bhashini's speech infrastructure** with an offline-first **Lumosity-grade design system**, clinically grounded cognitive stimulation, and a novel **offline Bluetooth Low Energy (BLE) parent-child sync**.

---

## 🌟 Key Features

### 🧠 1. Evidence-Based Cognitive Stimulation Games
Designed specifically for seniors, featuring high-contrast dark surfaces (`#0A1420`, `#15253B`), 72px+ touch targets, and non-punitive gameplay:
- **Speed Match (`/games/memory-match`):** Working memory pair-matching with pulsating gold errorless cues at Level 1 to prevent frustration.
- **Masterpiece Routine Sequencing (`/games/daily-routine`):** Drag-and-drop chronological daily scheduling to reinforce daily orientation and combat temporal disorientation.
- **Market Math & Currency (`/games/math`):** Real-world estimation and shopping arithmetic based on North Eastern markets (Assam tea stalls, fruit bazaars).
- **Language & Cultural Proverbs (`/games/language`):** Native folk proverbs and vocabulary recall with Bhashini audio pronunciation.

### 🗣️ 2. Bhashini AI Multilingual Speech Integration
- **Text-to-Speech (TTS):** Speaks exercise instructions, daily routines, and medication alarms aloud in Assamese, Bodo, and Manipuri.
- **Automatic Speech Recognition (ASR):** Allows elders with motor tremors or arthritis to respond verbally to cognitive quizzes.
- **Neural Machine Translation (NMT):** Bridges regional elder dialect logs with English/Hindi clinical dashboards for family members and ASHA workers.

### 🔄 3. Dual-Channel Parent-Child Synchronization
```
[ Bedside Elder Tablet (Samsung SM-T290) ]
        │
        ├── (1) Direct Offline BLE P2P (No Internet) ────► [ Child Companion Phone (Pixel / OnePlus) ]
        │       GATT Service: 0xFE26                             │
        │       Transfers encrypted cognitive scores & med logs  │
        │                                                        │
        └── (2) Wi-Fi / Mobile Data (When Connected) ────────────┴─► [ Cloud REST Server (/api/sync) ]
                                                                         │
                                                                         ├── Family Web Dashboard
                                                                         └── ASHA Worker Health Portal
```
- **Zero-Internet Bluetooth Sync:** When the child returns home in the evening, tapping "Sync BLE" transfers all day-long memory scores and medication logs over Bluetooth LE in < 3 seconds.
- **Opportunistic Cloud Sync:** Encrypted telemetry backs up to the REST server whenever internet is restored.

### ⏰ 4. Offline Health Reminders & Emergency SOS
- **Voice-First Care Schedule:** Gentle native voice alarms for **Medicine 💊**, **Hydration 💧**, and **Brain Workouts 🎯**.
- **Bedside Emergency SOS Beacon:** One-tap emergency alarm with haptic vibration, GPS location dispatch (`26.1445° N, 91.7362° E`), and emergency SMS notifications to designated family members and local ASHA health workers.

---

## 📱 Download & Install Android APK

The pre-compiled native Android APK is ready for deployment on Android tablets and smartphones:

| File | Size | Platform | Link |
|---|---|---|---|
| **`SmritiSathi-v1.0.apk`** | **4.1 MB** | Android 7.0+ (API 24 to 36) | [📥 Download Latest APK](SmritiSathi-v1.0.apk) |

### Quick Installation:
1. Transfer `SmritiSathi-v1.0.apk` to your Android device (via WhatsApp, Google Drive, or USB).
2. Tap the file in your device's **Files / Downloads** app and select **Install**.
3. Launch **Smriti Sathi**—the application is 100% unlocked and functional completely offline!

---

## 🔬 Clinical Validation & CST

Smriti Sathi's gameplay and telemetry are grounded in:
1. **Cognitive Stimulation Therapy (CST):** Evaluated by Cochrane systematic reviews as an effective non-pharmacological treatment for mild-to-moderate dementia, promoting neuroplasticity and daily functional independence.
2. **Errorless Learning Framework:** Highlighting matching pairs and providing audio-visual guidance during initial stages to bypass impaired explicit episodic memory without embedding errors.
3. **Digital Personal Data Protection (DPDP) Act 2023:** All patient identity records and telemetry remain encrypted locally (AES-GCM in IndexedDB). No biometric voice recordings are permanently retained.

---

## 🏗️ System Architecture

```
smriti-sathi/
├── android/                   # Capacitor Native Android project & Gradle wrapper
│   ├── app/src/main/          # AndroidManifest (BLE, Haptics, Internet permissions)
│   └── build/outputs/apk/     # Compiled native APK (app-debug.apk)
├── src/
│   ├── components/            # Lumosity-grade accessible UI (TopHeader, BottomNav, BigButton)
│   ├── contexts/              # Multilingual context (LanguageContext, PatientContext)
│   ├── db/                    # Offline-first IndexedDB database layer (Dexie.js)
│   ├── hooks/                 # Adaptive staircase difficulty & Web Speech synthesis hooks
│   ├── i18n/                  # Native translations (Assamese, Bodo, Manipuri, English)
│   ├── pages/                 # Home, MemoryMatch, DailyRoutine, MathWorkout, LanguageWorkout
│   └── styles/                # Lumosity dark theme (#0A1420, #15253B, #FF7247)
├── server/                    # Lightweight Express sync backend for remote testing
│   ├── index.js               # REST endpoints (/api/sync, /api/telemetry, /api/sos)
│   └── package.json           # Standalone dependencies for 1-click cloud deploy
├── .github/workflows/         # Cloud CI workflow (build-apk.yml) for auto-compilation
└── build-apk.sh               # 1-Click native compilation script for local machines
```

---

## 💻 Developer Quick Start

### Prerequisites
- Node.js 18+ & npm
- JDK 17 or JDK 21
- Android SDK (API 34+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yoursexybhavya/smriti-sathi.git
cd smriti-sathi/smriti-sathi
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Build Web Bundle & Sync Android Assets
```bash
npm run cap:sync
```

### 4. Compile Fresh Native Android APK
```bash
# From the project root
./build-apk.sh
```

### 5. Run the Cloud Testing & Telemetry Server
```bash
cd smriti-sathi/server
npm install
npm start
# Server listens on port 4000: http://localhost:4000
```

---

## 🌐 1-Click Cloud Hosting (Outside Google Play Store)

To host the companion sync server and telemetry dashboard online for free:
1. Connect this repository to [Render.com](https://render.com) (or Railway.app / Glitch.com).
2. Configure a **Web Service**:
   - **Root Directory:** `smriti-sathi`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
3. Enter your generated Render URL into the app's **Parent-Child Sync** tab (`My Brain -> PARENT-CHILD SYNC`) for remote cloud telemetry.

---

## 🤝 Contributing

Contributions to expand language models, regional cultural folk content, or elderly cognitive games are warmly welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewLanguageSupport`)
3. Commit your Changes (`git commit -m 'Add Khasi & Mizo language vocabulary'`)
4. Push to the Branch (`git push origin feature/NewLanguageSupport`)
5. Open a Pull Request

---

## 📄 License & Acknowledgments

- Distributed under the **MIT License**. See `LICENSE` for more information.
- Developed for **Smart India Hackathon 2026 (SIH26003)** under the **Ministry of Development of North Eastern Region (MDoNER)**.
- Powered by the **Bhashini National Language Translation Mission (MeitY)**.
