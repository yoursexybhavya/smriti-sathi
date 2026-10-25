<div align="center">

# 🌸 Smriti Sathi — Technical & Clinical Architecture (`v2.9.2`)

[![Download APK](https://img.shields.io/badge/📥_Download_Android_APK-SmritiSathi--v2.9.2.apk-10B981?style=for-the-badge&logo=android&logoColor=white)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.2/SmritiSathi-v2.9.2.apk)
[![Live Browser Demo](https://img.shields.io/badge/🌐_Try_Directly_in_Browser-smriti--sathi.onrender.com-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://smriti-sathi.onrender.com)

> **📥 [Download Smriti Sathi Android APK (`SmritiSathi-v2.9.2.apk`)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.2/SmritiSathi-v2.9.2.apk)**  
> **🌐 [Try Directly in Browser (No Installation Required): https://smriti-sathi.onrender.com](https://smriti-sathi.onrender.com)**

</div>

---

## 🆘 Critical SIH Innovations (v2.9.2)

```mermaid
flowchart LR
    A["👵 Wandering Elder Found"] --> B["🆘 Safe Return Mode\n(1-Tap PIN-free)"]
    B --> C["📞 1-Tap Guardian Call\n(tel:+91...)"]
    B --> D["📍 WhatsApp GPS Pin\n(Google Maps Live Link)"]
    B --> E["📱 Offline Camera QR\n(Zero-Dependency SVG)"]
    B --> F["🪪 Wearable Badge\n(85x54mm Laminated Card)"]

    G["🌇 Evening Sunset"] --> H["🌅 Sundowning Care\n(4-7-8 Breathing + Family Voice)"]
    I["👩‍⚕️ ASHA Home Visit"] --> J["📊 ASHA Triage Hub\n(14-Session SPI Median + PHC Export)"]

    style B fill:#b91c1c,stroke:#f87171,color:#ffffff
    style H fill:#d97706,stroke:#fbbf24,color:#ffffff
    style J fill:#047857,stroke:#34d399,color:#ffffff
```

---

## 🏗️ 1. Component & Data Flow Graph

```mermaid
flowchart TB
    subgraph UI["📱 Presentation Layer (React 18 + Tailwind 4)"]
        HOME["👵 PatientHomeScreen\n(Voice Greeting + Safe Return + Sundowning)"]
        GAMES["🎮 4 CST Cognitive Games\n(Remember, Recognise, Routine, Match)"]
        REM["⏰ MultimodalReminderModal\n(72px+ Icons + Haptics + Audio)"]
        CARE["👨‍👦 CaregiverHome & SafetyDashboard\n(PIN: 1234 / 0000)"]
        EMERG["🆘 Safe Return & Wearable Badge\n(PIN-Free Good Samaritan Rescue)"]
    end

    subgraph ENGINE["⚙️ Clinical & Voice Engines"]
        ADAPT["📐 AdaptiveDifficultyService\n(Levels 1-5 Clamping + 3s Scaffold)"]
        SPI["📈 SPI Baseline Engine\n(14-Session Rolling Median)"]
        VOICE["🔊 Voice & Language Router\n(Assamese, Bodo, Manipuri, English)"]
        ASHA["🩺 ASHA Triaging Engine\n(ICMR Non-Diagnostic Rules)"]
    end

    subgraph STORAGE["🗄️ Offline-First Storage & Sync"]
        DEXIE[("💾 IndexedDB (Dexie.js)\nLocal Encrypted Vault")]
        BLE["📡 BLE Mesh Sync (0xFE26)\nStore-and-Forward"]
        CLOUD["☁️ Render Cloud REST API\n/api/sync & /api/version"]
    end

    HOME & GAMES & REM & CARE & EMERG --> ADAPT & SPI & VOICE & ASHA
    ADAPT & SPI & ASHA --> DEXIE
    DEXIE --> BLE --> CLOUD

    style UI fill:#1e1b4b,stroke:#6366f1,color:#ffffff
    style ENGINE fill:#064e3b,stroke:#10b981,color:#ffffff
    style STORAGE fill:#0f172a,stroke:#38bdf8,color:#ffffff
```

---

## 📊 2. Cognitive Game Progression & Errorless Scaffolding

```mermaid
xychart-beta
    title "Adaptive Game Complexity Scaling (Levels 1 to 5)"
    x-axis ["Level 1 (Seed)", "Level 2 (Gentle)", "Level 3 (Moderate)", "Level 4 (Active)", "Level 5 (Mastery)"]
    y-axis "Stimulus Items / Card Pairs" 1 --> 7
    bar [2, 3, 4, 5, 6]
    line [2, 3, 4, 5, 6]
```

| Level | Target Items | Preview Window | Errorless Safeguard |
| :---: | :---: | :---: | :--- |
| **Level 1** | `2 Items / Pairs` | `8.0s` | Distractors disabled + 3.0s emerald hint pulse |
| **Level 2** | `3 Items / Pairs` | `7.0s` | Distractors disabled + 3.0s emerald hint pulse |
| **Level 3** | `4 Items / Pairs` | `6.0s` | Guided pair matching + positive reinforcement |
| **Level 4** | `5 Items / Pairs` | `5.0s` | Cultural artifact discrimination |
| **Level 5** | `6 Items / Pairs` | `4.0s` | Full circadian routine & matrix recall |

---

## 🔄 3. Multimodal Reminder Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant Sched as ⏱️ ReminderScheduler
    participant Modal as 🚨 MultimodalModal (#modal-root)
    participant Audio as 🔊 FamiliarVoice / TTS
    participant Haptic as 📳 Vibration API
    participant DB as 💾 IndexedDB Logs

    Sched->>Modal: Trigger Scheduled Reminder
    par Parallel Sensory Cues
        Modal->>Audio: Play Caregiver Audio Blob (or Regional TTS)
        Modal->>Haptic: Vibrate [300, 120, 300, 120, 450]ms
    end
    Note over Modal: 24px+ High-Contrast Text & 72px+ Icon
    alt Elder Taps "✅ Done"
        Modal->>Haptic: Confirmation Pulse [120, 60, 120]ms
        Modal->>Audio: Revoke ObjectURL (Zero Memory Leak)
        Modal->>DB: Log Adherence (status: completed)
    else Elder Taps "⏳ Snooze 10m"
        Modal->>Sched: Reschedule +10 Minutes
    end
```

---

## 📁 4. Visual Repository Map

```text
smriti-sathi/
├── 🤖 android/                    # Native Capacitor Android project (versionCode 292)
├── ☁️ server/                     # Express Cloud Sync & Auto-OTA Version Server
├── 🧪 tests/                      # 8 Automated Test Suites (293/293 Passing)
├── 🎨 src/
│   ├── components/                # Accessible UI (SafeReturnModal, AshaTriageModal, WearableBadgeGeneratorModal, SundowningCareModal, QRCodeSvg)
│   ├── context/ & contexts/       # Auth, App, Patient, & Multilingual State
│   ├── database/ & db/            # Offline-First IndexedDB Repositories
│   ├── engine/                    # Clinical SPI 14-Session Baseline Engine
│   ├── hooks/                     # useVoice, useInactivityScaffolding, useReminderScheduler
│   ├── pages/
│   │   ├── PatientHomeScreen.tsx  # Simplified Elder Companion Dashboard (Safe Return + Sundowning)
│   │   ├── GamesScreen.tsx        # 4 Cultural Cognitive Workouts
│   │   ├── caregiver/             # CaregiverHome & SafetyDashboard (Clinical Triage & Wearable Badge Hub)
│   │   └── onboarding/            # 4-Step Guided Caregiver Setup
│   └── services/                  # AdaptiveEngine, Bhashini/TTS, Sync, & Safety
└── 🛠️ build-apk.sh                # 1-Click Vite → Capacitor → Gradle APK Builder
```

---

## ⚡ Commands & Verification

| Command | Action | Expected Output |
| :--- | :--- | :--- |
| `npm test` | Runs all 8 E2E, Adversarial & Safe Return test suites | `293 / 293 Passing (100%)` in `< 1s` |
| `npm run typecheck` | Strict TypeScript compiler verification | `0 Errors` |
| `npm run build` | Production Vite asset bundle | Built in `~950ms` |
| `./build-apk.sh` | Compiles `SmritiSathi-v2.9.2.apk` | Copies APK to root & Desktop |
