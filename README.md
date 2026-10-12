<div align="center">

# 🌸 Smriti Sathi (স্মৃতি সাথী • स्मृति साथी)

### **Offline-First Multilingual Cognitive Care & Dementia Companion for North East India**

[![Download APK](https://img.shields.io/badge/📲_Download_Android_APK-SmritiSathi--v2.9.1.apk-10B981?style=for-the-badge&logo=android&logoColor=white)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.1/SmritiSathi-v2.9.1.apk)
[![Live Browser Demo](https://img.shields.io/badge/🌐_Try_Live_in_Browser-smriti--sathi.onrender.com-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://smriti-sathi.onrender.com)

[![Bhashini AI](https://img.shields.io/badge/Voice_Engine-Bhashini_AI_%2B_Offline_TTS-06B6D4?style=flat-square)](https://bhashini.gov.in/)
[![Tests](https://img.shields.io/badge/E2E_Tests-285%2F285_Passing_(100%25)-22C55E?style=flat-square)](#%EF%B8%8F-automated-verification--test-scoreboard)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AAA_72px%2B_Touch-F59E0B?style=flat-square)](#-scandinavian-senior-accessibility-specs)
[![DPDP 2023](https://img.shields.io/badge/Privacy-DPDP_Act_2023_AES--GCM-8B5CF6?style=flat-square)](#-local-first-database-er-diagram)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](https://opensource.org/licenses/MIT)

[**📲 1-Tap APK**](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.1/SmritiSathi-v2.9.1.apk) • [**🌐 Web Sandbox**](https://smriti-sathi.onrender.com) • [**🗺️ System Graph**](#-1-end-to-end-system--mesh-sync-architecture) • [**🧠 Cognitive Engine**](#-3-errorless-learning--adaptive-difficulty-state-machine) • [**📈 Clinical SPI Chart**](#-4-clinical-stability-performance-index-spi-trajectory)

</div>

---

## ⚡ What We Do — In One Visual Glance

```mermaid
flowchart LR
    subgraph PROBLEM["❌ The North-East Dementia Care Gap"]
        P1["🗣️ English-Only Apps\n(Elders speak Assamese/Bodo/Manipuri)"]
        P2["📵 Dead Network Zones\n(Hill districts & flood regions)"]
        P3["🤏 Tiny Complex UIs\n(Tremors & cognitive anxiety)"]
    end

    subgraph ENGINE["🌸 Smriti Sathi Core Engine"]
        S1["🔊 Dual Voice Engine\nBhashini Neural + 0ms Offline TTS"]
        S2["📡 3-Stage Mesh Sync\nIndexedDB → BLE P2P → Cloud PHC"]
        S3["🛡️ Errorless Learning UI\n72px+ Targets & 3s Auto-Scaffolding"]
    end

    subgraph IMPACT["✅ Real-World Clinical Impact"]
        I1["👵 Zero-Friction Elder Routine\nNo PIN • Familiar Voice Alarms"]
        I2["👨‍👦 Family Guardian Peace\n1-Tap WhatsApp Daily Health Report"]
        I3["🩺 ASHA Worker Early Triage\n14-Session SPI Trend Detection"]
    end

    P1 --> S1 --> I1
    P2 --> S2 --> I2
    P3 --> S3 --> I3

    style PROBLEM fill:#450a0a,stroke:#ef4444,color:#fecaca
    style ENGINE fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
    style IMPACT fill:#064e3b,stroke:#10b981,color:#d1fae5
```

---

## 📲 Instant Access (Phone, Tablet, or Browser)

| Channel | Action Link | What You Get |
| :--- | :--- | :--- |
| **🤖 Android APK** | [**Download `SmritiSathi-v2.9.1.apk`**](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.1/SmritiSathi-v2.9.1.apk) | Native offline Android build with Auto-OTA Updater & Haptic Alarms |
| **🌐 Live Web App** | [**Launch `smriti-sathi.onrender.com`**](https://smriti-sathi.onrender.com) | Zero-install tablet/mobile browser experience |
| **🔑 Demo PINs** | **Elder:** `No PIN` • **Son/Guardian:** `1234` • **Doctor/ASHA:** `0000` | Instant role-switching via top header `Role ▾` button |

---

## 🗺️ 1. End-to-End System & Mesh Sync Architecture

How data flows from a zero-internet village home in Assam to the family guardian and Primary Health Centre (PHC):

```mermaid
flowchart TD
    subgraph STAGE1["🏠 STAGE 1: Elder Home (100% Offline Capable)"]
        E["👵 Elder Tablet / Phone"] -->|"Plays 4 CST Games"| DB[("🗄️ Local IndexedDB Vault\nAES-256 Encrypted")]
        E -->|"Acknowledges Voice Alarm"| DB
        FAM["👨‍👦 Family Guardian\n(PIN: 1234)"] -->|"Records Voice & Photos"| DB
    end

    subgraph STAGE2["📡 STAGE 2: Rural Store-and-Forward Bridge"]
        DB -->|"Bluetooth BLE GATT 0xFE26\n(1.2 KB Compressed)"| ASHA["🩺 Visiting ASHA Worker Tablet\n(PIN: 0000)"]
        DB -->|"1-Tap WhatsApp Bridge"| WA["💬 Family WhatsApp Summary\n(CPI + Streak + Adherence)"]
    end

    subgraph STAGE3["☁️ STAGE 3: District Health Cloud (When Online)"]
        ASHA -->|"HTTPS Sync at PHC"| API["🚀 Render Cloud Server\nPOST /api/sync"]
        DB -.->|"Opportunistic Wi-Fi Sync"| API
        API --> OTA["📦 Auto-OTA APK Updater\nGET /api/version"]
    end

    style STAGE1 fill:#0f172a,stroke:#38bdf8,color:#f8fafc
    style STAGE2 fill:#1e1b4b,stroke:#818cf8,color:#f8fafc
    style STAGE3 fill:#064e3b,stroke:#34d399,color:#f8fafc
```

---

## 👥 2. Three-Role Persona Ecosystem

One unified app that dynamically adapts its interface complexity to the person holding the device:

```mermaid
flowchart TD
    LOGIN["🔐 Role Switcher / Login Screen"]

    LOGIN -->|"Zero PIN (1-Tap)"| ELDER["👵 ELDER PATIENT VIEW\n• Ultra-simple calm layout\n• 🔊 Voice greeting & instructions\n• 4 Cultural Cognitive Games\n• Multimodal Full-Screen Alarms"]
    LOGIN -->|"PIN: 1234"| SON["👨‍👦 SON / FAMILY GUARDIAN\n• Add Family Photos to Memory Book\n• Record Familiar Voice Alarms\n• Pair Companion Phone\n• 1-Tap WhatsApp Daily Report"]
    LOGIN -->|"PIN: 0000"| DOC["🩺 DOCTOR / ASHA WORKER\n• 14-Session SPI Clinical Charts\n• Cognitive Domain Breakdown\n• Offline BLE Mesh Sync\n• Roaming & Safety Geofence Logs"]

    style ELDER fill:#065f46,stroke:#10b981,color:#ffffff
    style SON fill:#3730a3,stroke:#6366f1,color:#ffffff
    style DOC fill:#1e3a8a,stroke:#3b82f6,color:#ffffff
```

---

## 🧠 3. Errorless Learning & Adaptive Difficulty State Machine

Dementia patients get distressed by red "X" marks or "Game Over" screens. Smriti Sathi uses clinical **Errorless Learning**—distractors are gently disabled and a glowing emerald scaffold guides the elder after 3 seconds of hesitation:

```mermaid
stateDiagram-v2
    [*] --> LevelSelect: Load Last 5 Sessions
    LevelSelect --> StimulusRender: Clamp Difficulty (Level 1 to 5)

    state StimulusRender {
        [*] --> WaitingForTouch: Start 3000ms Inactivity Timer
        WaitingForTouch --> ScaffoldingPulse: 3.0s Hesitation Detected
        ScaffoldingPulse --> WaitingForTouch: Touch / Key / Voice Reset
        Note right of ScaffoldingPulse: Emerald Ring Pulse\nGuides Correct Target\n(Zero Error Encoding)
    }

    StimulusRender --> DignifiedSuccess: Correct Target Tapped
    DignifiedSuccess --> AdaptiveEval: Record Accuracy & Latency

    state AdaptiveEval {
        [*] --> Promote: Accuracy >= 85% & Fast Response
        [*] --> Steady: Stable Baseline
        [*] --> Support: Gentle Step-Down (Level - 1)
    }

    AdaptiveEval --> [*]
```

### 🎮 The 4 Cultural Cognitive Stimulation Games

| Game | Clinical Domain | Level 1 &rarr; Level 5 Progression | North-East Cultural Anchors |
| :--- | :--- | :--- | :--- |
| **🎴 Remember & Recall** | Working Memory | `2 items (8s)` &rarr; `6 items (4s)` | Japi, Gamusa, Bell, Brass Cup |
| **🔍 Recognise Objects** | Visual & Spatial | `2 distinct items` &rarr; `6 subtle pairs` | Tea Cup, Spectacles, Prayer Lamp |
| **🌅 Daily Routine** | Temporal Sequencing | `2 morning steps` &rarr; `6 full-day steps` | Wake Up &rarr; Tea &rarr; Bath &rarr; Medicine |
| **🧩 Memory Match** | Episodic Recall | `2 pairs (4 cards)` &rarr; `6 pairs (12 cards)` | Errorless guided 2nd-card flip |

---

## 📈 4. Clinical Stability Performance Index (SPI) Trajectory

Unlike naive apps that panic on a single tired day, our **SPI Engine** evaluates a 14-session rolling median against the elder's personal baseline—filtering out single-session noise while catching real 7-session longitudinal drops:

```mermaid
xychart-beta
    title "14-Session Cognitive Stability Performance Index (SPI) vs Alert Threshold"
    x-axis ["S1", "S2", "S3", "S4", "S5 (Tired)", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14"]
    y-axis "Cognitive Index Score (0-100)" 40 --> 100
    line [84, 86, 85, 88, 62, 85, 87, 83, 76, 71, 68, 65, 63, 60]
    bar [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
```

> **Legend:** `Line` = Elder Session Score • `Bar (80)` = Personal Baseline Median  
> - **Session 5 (`Score: 62`):** Single bad day &rarr; **Ignored as normal variance** (No false alarm).  
> - **Sessions 8–14 (`83 → 60`):** Sustained 7-session drop + missed medicine &rarr; **Triggers non-diagnostic ASHA Check-In**.

---

## 🔊 5. Dual-Engine Regional Voice Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Elder as 👵 Elder Patient
    participant UI as 📱 Smriti Sathi UI
    participant Voice as 🎙️ VoiceRouter
    participant Bhashini as ☁️ Bhashini AI (MeitY)
    participant Local as 🔊 Offline Web Speech / Recorded Blob

    Elder->>UI: Taps "🔊 Listen" or Alarm Fires
    UI->>Voice: speak(text, lang: 'as' | 'brx' | 'mni' | 'en')
    alt Custom Familiar Caregiver Voice Exists
        Voice->>Local: Play IndexedDB Audio Blob (Son/Daughter's Voice)
        Local-->>Elder: Plays Familiar Family Voice (0ms latency)
    else Online & Bhashini Active
        Voice->>Bhashini: Request Neural TTS Synthesis
        Bhashini-->>Elder: Streams Natural Regional Audio
    else Offline / Rural Dead Zone
        Voice->>Local: Instant Native Script Synthesis (as-IN / bn-IN / hi-IN)
        Local-->>Elder: Speaks Aloud 100% Offline
    end
```

### 🌐 Supported Regional Languages

| Language | Native Script | Target Region | Offline Voice Fallback |
| :--- | :--- | :--- | :--- |
| **Assamese** | `অসমীয়া` | Brahmaputra Valley, Assam | `as-IN` &rarr; `bn-IN` &rarr; `hi-IN` |
| **Bodo** | `बर’ / Bodo` | Bodoland Territorial Region (BTR) | `brx-IN` &rarr; `hi-IN` |
| **Manipuri** | `মৈতৈলোন্` | Imphal Valley, Manipur | `mni-IN` &rarr; `bn-IN` |
| **English** | `English (India)` | Pan-NER & Clinical Dashboards | `en-IN` |

---

## 🗄️ 6. Local-First Database ER Diagram

```mermaid
erDiagram
    PATIENT ||--o{ GAME_SESSION : "plays"
    PATIENT ||--o{ REMINDER : "scheduled_for"
    PATIENT ||--o{ MEMORY_ITEM : "anchors"
    REMINDER ||--o{ REMINDER_LOG : "acknowledges"
    PATIENT ||--o{ SYNC_EVENT : "queues"

    PATIENT {
        int id PK
        string name
        int age
        string preferredLanguage
        string profileImage
    }
    GAME_SESSION {
        int id PK
        int patientId FK
        string gameType
        int difficulty
        float accuracy
        int responseTimeMs
        int synced
    }
    REMINDER {
        int id PK
        int patientId FK
        string type
        string title
        blob audioBlob
        boolean isActive
    }
    MEMORY_ITEM {
        int id PK
        int userId FK
        string category
        string title
        string relation
        string imageData
    }
    SYNC_EVENT {
        string uuid PK
        string entityType
        string syncStatus
        string payload
    }
```

---

## 🛡️ Scandinavian Senior Accessibility Specs

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  🎨 CONTRAST & PALETTE         👆 TOUCH TARGETS        🧘 COGNITIVE SAFETY │
│  ─────────────────────         ────────────────        ─────────────────── │
│  • Daylight: #F8FAFC           • Primary CTA: 64px     • 0 Red Error States│
│  • Midnight: #0B0F19           • Game Tiles:  72px+    • 3s Auto-Scaffold  │
│  • WCAG AAA: >= 7.5:1          • Header Icons: 48px    • Native Body Scroll│
│  • Zero Glass Blur Traps       • Bottom Clearance:176px• Zero Punitive Text│
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Automated Verification & Test Scoreboard

Every build is verified against **285 automated E2E & adversarial tests** (`npm test`) in `< 1.0s`:

| Test Suite | Coverage Focus | Status | Pass Rate |
| :--- | :--- | :---: | :--- |
| **Tier 1: Feature Coverage** | 16 Core Features &times; 6 assertions | ✅ PASS | `██████████ 96/96 (100%)` |
| **Tier 2: Boundary & Corner Cases** | Touch sizing, overflow, null guards | ✅ PASS | `██████████ 96/96 (100%)` |
| **Tier 3: Cross-Feature Pairwise** | Role switch + Language + Offline sync | ✅ PASS | `██████████ 16/16 (100%)` |
| **Tier 4: Clinical Workflows** | 8 End-to-End Elder & ASHA journeys | ✅ PASS | `██████████ 8/8   (100%)` |
| **Tier 5A: Errorless Shield** | 10,000-click fuzzing & 3000ms timer | ✅ PASS | `██████████ 31/31 (100%)` |
| **Tier 5B: Voice & Modal Stress** | 25MB Audio Blobs, Portal & Haptics | ✅ PASS | `██████████ 35/35 (100%)` |
| **Clinical SPI Engine Baseline** | 14-Session Median & Alert Triage | ✅ PASS | `██████████ 3/3   (100%)` |
| **TOTAL** | **7 Verification Suites** | **🎉 100%** | **`285 / 285 TESTS PASSING`** |

---

## 🚀 3-Command Developer Quick Start

```bash
# 1. Install dependencies & run 285 E2E verification tests
cd smriti-sathi && npm install && npm test

# 2. Launch local development server
npm run dev

# 3. Compile production web bundle + Native Android APK
./build-apk.sh
```

---

<div align="center">

**Built with ❤️ for Elderly Cognitive Care in North East India**  
[📥 Download Android APK (`v2.9.1`)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.1/SmritiSathi-v2.9.1.apk) • [🌐 Open Web App](https://smriti-sathi.onrender.com)

</div>
