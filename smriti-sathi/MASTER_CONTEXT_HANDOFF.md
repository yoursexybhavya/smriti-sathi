# SMRITI SATHI (স্মৃতি সাথী) — COMPLETE MASTER CONTEXT & HANDOFF DOCUMENT

> **Project Name**: Smriti Sathi — Cognitive Care & Memory Companion  
> **Workspace Root**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`  
> **App Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/smriti-sathi`  
> **Current Version**: `v2.5.3` (versionCode `253`)  
> **Git Repository**: `https://github.com/yoursexybhavya/smriti-sathi.git` (Branch: `main`)  
> **Live Browser Testing URL**: `http://localhost:5173/` (Local Vite Server)  
> **Cloud Deployment**: `https://smriti-sathi.onrender.com`  
> **Latest APK**: `SmritiSathi-v2.5.3.apk` (located at repo root and `/Users/krishnajangid/Desktop/SmritiSathi-v2.5.3.apk`)

---

## 1. WHY THE UI LOOKED BROKEN IN THE BROWSER SCREENSHOT

### The Root Cause in Safari / Desktop Browser:
1. **The "Floating Box in Void" Effect**: On a desktop or laptop monitor (e.g. 1728×1117 or 2560×1600 resolution), the onboarding screen was enclosed in an `.onboarding-card` with `max-w-[860px]` inside a `min-h-screen flex items-center justify-center` container.
2. This made the application render as a tiny isolated box floating in a massive empty white void instead of filling the screen like a real application or presenting a dedicated tablet frame simulator.
3. Inside that 860px box, complex forms (like Patient Profile Setup) were compressed into two columns, causing input boxes, labels, and toggles to look squished, awkward, and cramped.

### The Fix:
- **Full-Bleed Responsive Layout**: Remove `max-w-[860px]` and let `.onboarding-screen-frame` and its contents expand naturally using standard full-width layout with comfortable padding (`max-w-5xl` or `w-full min-h-screen flex flex-col`), making it feel like a real native tablet app.
- **Tablet Viewport Mode**: For desktop testing, an explicit tablet bezel toggle or responsive full viewport layout ensures it fills the viewport cleanly.

---

## 2. STRICT USER MANDATES & NON-NEGOTIABLE RULES

1. **Strict Versioned Filename Rule (NO `latest` in filenames)**:
   - Never produce or reference generic files like `SmritiSathi-latest.apk`.
   - Every build, download link, CI workflow, and update manifest must strictly use `SmritiSathi-vX.Y.Z.apk` (current: `SmritiSathi-v2.5.3.apk`).
2. **Elder Mental Model & Zero Trapping**:
   - The primary user is an elderly person in Northeast India with dementia, Alzheimer's, or MCI.
   - **Zero dummy/mock data**: All routines, reminders, and game records must persist in real IndexedDB (`Dexie.js`).
   - **Zero confusing role-switching**: The elder must boot directly into their calming home dashboard (`UserRole.PATIENT`).
   - **Hardware Back Button Safety**: On the home screen, back gestures must minimize/exit the app (`CapApp.exitApp()`), never trap or disorient the elder into a login screen.
   - In Onboarding, visible escape buttons must exist so caregivers never get trapped.
3. **Design Standard**:
   - Large, senior-accessible touch targets: minimum 56px–64px height.
   - Distinct tactile buttons with 2px borders, high contrast, and active press states.
   - High-contrast text meeting WCAG AAA guidelines.
   - Regional language support: Assamese (অসমীয়া), Bengali (বাংলা), Bodo, Manipuri, Hindi, and English.
4. **Browser Testing & GitHub Delivery on Every Change**:
   - Keep the local Vite dev server accessible (`http://localhost:5173/`).
   - Bump version (`package.json`, `build.gradle`, `build-apk.sh`, `server/index.js`, `.github/workflows/build-apk.yml`).
   - Compile Android APK with `./build-apk.sh`.
   - Push commit and git tag (e.g. `git tag v2.5.3 && git push origin main --tags`) to GitHub.

---

## 3. TECHNICAL STACK & ARCHITECTURE

- **Framework**: React 18.2 + TypeScript + Vite 6.4.3
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + master CSS variables in `src/styles/globals.css`
- **Native Android Wrapper**: Capacitor 8.5 (`@capacitor/android`, `@capacitor/app`, `@capacitor/local-notifications`)
- **Local Database**: Dexie.js 4.4 (IndexedDB) with `dexie-react-hooks`
- **Audible Care Alarms**: Web Audio API (`AudioContext` chimes) + Native Android exact background alarms (`allowWhileIdle: true`)
- **Backend / In-App Updater**: Node.js / Express (`server/index.js`) + Native Android package installer plugin (`AppUpdatePlugin.java`)

### Project Directory Structure:
```
smriti-sathi/
├── android/                   # Native Android Studio / Gradle project
│   ├── app/
│   │   ├── build.gradle       # versionCode 253, versionName "2.5.3"
│   │   └── src/main/java/     # Native plugins (AppUpdatePlugin, etc.)
├── public/                    # Static assets, fallback icons, audio files
├── server/                    # Node/Express cloud server (hosted on Render)
│   └── index.js               # /api/version auto-update manifest & static asset host
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AppHeader.tsx      # Top bar with theme toggle & settings button
│   │   ├── BottomNav.tsx      # Elder-friendly bottom navigation
│   │   ├── Card.tsx           # Tactile 2px bordered card wrapper
│   │   ├── LargeButton.tsx    # 56px-64px tactile hardware button
│   │   ├── ScreenContainer.tsx# Standard screen wrapper
│   │   ├── ReminderCard.tsx   # Audio reminder tile with checkmark
│   │   └── UpdateChecker.tsx  # In-app auto-update checker
│   ├── context/
│   │   └── AppContext.tsx     # App state (theme, activeProfile, skipToElderDemo, etc.)
│   ├── core/
│   │   └── constants/app.ts   # APP metadata, version, regional languages
│   ├── db/
│   │   └── db.ts              # Dexie.js IndexedDB schemas (reminders, games, profiles)
│   ├── games/                 # Cognitive exercises
│   │   ├── memory/            # Memory Match (card flip chimes)
│   │   ├── recognise/         # Recognise Game (photo/voice recognition)
│   │   ├── remember/          # Remember Game (memorize & recall)
│   │   └── routine/           # Daily Routine sequencing game
│   ├── pages/
│   │   ├── onboarding/        # Onboarding Flow (5 steps)
│   │   │   ├── OnboardingFlow.tsx       # Master container & step coordinator
│   │   │   ├── OnboardingWelcome.tsx    # Step 0: Welcome & Demo Dashboard CTA
│   │   │   ├── PatientProfileSetup.tsx  # Step 1: Elder profile & presets
│   │   │   ├── LanguageSelection.tsx    # Step 2: Regional language picker
│   │   │   ├── AccessibilitySetup.tsx   # Step 3: Text sizing & audio preview
│   │   │   └── OnboardingComplete.tsx   # Step 4: Celebration & review
│   │   ├── PatientHomeScreen.tsx        # Main patient home screen (2x2 cognitive grid)
│   │   ├── GamesScreen.tsx              # Cognitive games catalog
│   │   ├── RemindersScreen.tsx          # Care schedule & alarms
│   │   ├── SettingsScreen.tsx           # Settings & PIN-protected Caregiver Portal
│   │   └── SplashScreen.tsx             # Tranquil splash screen
│   ├── screens/
│   │   ├── MemoryBookScreen.tsx         # Family memory book photo manager
│   │   └── MemoryBookViewerScreen.tsx   # Elder memory viewer with voice narration
│   └── styles/
│       └── globals.css        # Design tokens, color palette, animations
├── tests/                     # 7 Comprehensive E2E test suites (206+ tests)
│   ├── tier1_feature_coverage.test.ts
│   ├── tier2_boundary_corner_cases.test.ts
│   ├── tier3_cross_feature_interactions.test.ts
│   ├── tier4_real_world_scenarios.test.ts
│   ├── tier5_adversarial_errorless_learning.test.ts
│   ├── adversarial_stress_challenge.test.ts
│   ├── empirical_theme_challenge.mjs
│   └── run_all_tests.js       # Master test runner (node tests/run_all_tests.js)
├── build-apk.sh               # Local APK build script
├── package.json
└── vite.config.ts
```

---

## 4. ESSENTIAL DEV COMMANDS

```bash
# 1. Navigate to App Directory
cd /Users/krishnajangid/Documents/antigravity/peaceful-hertz/smriti-sathi

# 2. Start Vite Dev Server (Browse at http://localhost:5173/)
npm run dev -- --host 0.0.0.0 --port 5173

# 3. TypeScript Typecheck
npm run typecheck

# 4. Run All 7 Test Suites (206+ tests)
npm test

# 5. Run Headless Chrome Theme & Layout Verification
node tests/empirical_theme_challenge.mjs

# 6. Production Web Build
npm run build

# 7. Compile Native Android APK (Produces SmritiSathi-v2.5.3.apk on Desktop)
./build-apk.sh

# 8. Git Commit & Push (from workspace root)
cd /Users/krishnajangid/Documents/antigravity/peaceful-hertz
git add .
git commit -m "feat: description of changes"
git tag v2.5.X
git push origin main --tags
```
