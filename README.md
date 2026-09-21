# Smriti Sathi (স্মৃতি সাথী / स्मृति साथी)

<div align="center">

[![Powered by Bhashini AI](https://img.shields.io/badge/AI%20Engine-Bhashini%20(MeitY)-blue?style=for-the-badge)](https://bhashini.gov.in/)
[![Platform](https://img.shields.io/badge/Platform-Android%20Tablet%20%26%20Mobile-brightgreen?style=for-the-badge&logo=android)](https://github.com/yoursexybhavya/smriti-sathi/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North East India**

*Memory care that speaks your language — 100% Offline-First, culturally resonant, and free of paywalls.*

[Explore Architecture](#-system-architecture) • [Download Android APK](#-download--install-android-apk) • [Features](#-key-features) • [Clinical Grounding](#-clinical-validation--cst) • [Contributing](#-contributing)

</div>

---

## 📱 Download & Install Android APK

> **Ready for Testing on Android Tablets & Phones**

There is **only one** official download link for the Smriti Sathi app. This link will always securely provide the latest compiled Android version directly to your device. 

[![Download APK](https://img.shields.io/badge/Download%20APK-SmritiSathi--v2.8.0.apk-brightgreen?style=for-the-badge&logo=android)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.8.0/SmritiSathi-v2.8.0.apk)

🔗 **[Direct APK Download: SmritiSathi-v2.8.0.apk](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.8.0/SmritiSathi-v2.8.0.apk)**  
🌐 **[Try Directly in Browser (No Installation Required): https://smriti-sathi.onrender.com](https://smriti-sathi.onrender.com)**

### Quick Tablet Installation Steps:
1. Open Chrome or any browser on your Android tablet/phone.
2. Tap the **Direct Download** link above.
3. Once downloaded, tap the file in your notification bar or **Files &rarr; Downloads**.
4. Tap **Install** (if prompted *"Allow installs from this source"*, tap **Settings** & toggle **Allow**).
5. Open **Smriti Sathi** — it runs 100% offline immediately!

*Note: The app contains an automatic in-app updater. Once installed, it will automatically notify you of future updates and download them directly inside the app.*

---

## 🧭 The Problem We Solve

In the **North Eastern Region (NER)** of India, elderly patients suffering from Mild Cognitive Impairment (MCI) and Dementia face acute healthcare barriers:
1. **Linguistic Fragmentation:** Elders predominantly speak native languages—such as **Assamese (অসমীয়া), Bodo (बर'), and Manipuri (মৈতৈলোন্)**—while existing memory tools are almost exclusively in English.
2. **Rural Connectivity Gaps:** Unstable cellular and Wi-Fi networks in rural hill communities disrupt cloud-dependent healthcare platforms.
3. **Digital Illiteracy & Tremors:** Traditional mobile UIs with tiny text and complex navigation cause frustration, cognitive fatigue, and resistance in dementia patients.

**Smriti Sathi** bridges these divides by coupling **Bhashini's speech infrastructure** with an offline-first accessible UI design, clinically grounded cognitive stimulation, and a novel offline parent-child synchronization system.

---

## 🌟 Key Features

### 🧠 1. Evidence-Based Cognitive Stimulation Games
Designed specifically for seniors, featuring high-contrast environments, 72px+ touch targets, and non-punitive gameplay:
- **Memory Match (`/games/memory-match`):** Working memory visual pair-matching with errorless cues at early stages.
- **Recognise (`/games/recognise-game`):** Visual pattern recognition testing spatial memory with adaptive tiered levelling.
- **Remember (`/games/remember-game`):** Timed object recall exercises utilizing real-world photography (no abstract emojis).

### 🗣️ 2. Bhashini AI Multilingual Speech Integration
- **Text-to-Speech (TTS):** Speaks exercise instructions, daily routines, and medication alarms aloud in local languages.
- **Neural Machine Translation (NMT):** Bridges regional elder dialect logs with English/Hindi clinical dashboards for family members and ASHA workers.

### 🔄 3. Parent-Child Synchronization
- **Zero-Internet Bluetooth Sync:** Allows family members to securely pair their caregiver accounts to the patient's tablet.
- **WhatsApp Integration:** One-tap export of daily memory scores and medical logs to local caregivers via WhatsApp.
- **Opportunistic Cloud Sync:** Encrypted telemetry backs up to the REST server whenever internet is restored.

---

## 🔬 Clinical Validation & CST

Smriti Sathi's gameplay and telemetry are grounded in:
1. **Cognitive Stimulation Therapy (CST):** Evaluated by Cochrane systematic reviews as an effective non-pharmacological treatment for mild-to-moderate dementia.
2. **Errorless Learning Framework:** Highlighting matching pairs and providing guidance during initial stages to bypass impaired explicit episodic memory without embedding errors.
3. **Digital Personal Data Protection (DPDP) Act 2023:** All patient identity records and telemetry remain encrypted locally (AES-GCM in IndexedDB). 

---

## 🏗️ System Architecture

```text
smriti-sathi/
├── android/                   # Capacitor Native Android project
├── src/
│   ├── components/            # Accessible UI (TopHeader, BottomNav, BigButton, UpdateNotifier)
│   ├── contexts/              # Multilingual context (LanguageContext, PatientContext)
│   ├── services/              # Adaptive Engine & Offline-first IndexedDB database layer (Dexie.js)
│   ├── pages/                 # Home, MemoryMatch, Recognise, SettingsScreen
│   └── styles/                # CSS Theme
├── server/                    # Lightweight Express sync backend for remote testing
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

### 2. Build Web Bundle & Sync Android Assets
```bash
npm run build
npx cap sync android
```

### 3. Compile Native Android APK
```bash
# From the project root
./build-apk.sh
```

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

- Distributed under the **MIT License**.
- Developed for elderly cognitive care and memory assistance in the **North Eastern Region of India**.
- Powered by the **Bhashini National Language Translation Mission (MeitY)**.
