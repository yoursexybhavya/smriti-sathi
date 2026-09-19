# Smriti Sathi — Master Handoff & Continuity Document for OpenCode

> **Target Agent**: OpenCode  
> **Workspace Root**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz`  
> **App Directory**: `/Users/krishnajangid/Documents/antigravity/peaceful-hertz/smriti-sathi`  
> **Current Version**: `v2.5.0` (`versionCode 250`)  
> **Build Status**: Verified clean (`npm run typecheck` passes with 0 errors, `npm run build` succeeds).

---

## 1. Project Context & Philosophy

**Smriti Sathi (स्मृति साथी)** is an industry-grade digital memory care companion app designed for elderly individuals suffering from dementia, Alzheimer's, or mild cognitive impairment (MCI) in Northeast India, along with their family caregivers.

### Strict User Mandates & Non-Negotiables
1. **Strict Versioned Filename Rule (NO `latest` in filenames)**:
   - There must never be generic files like `SmritiSathi-latest.apk`.
   - All builds, endpoints, scripts, docs, and downloads must produce and reference `SmritiSathi-vX.Y.Z.apk` (specifically `SmritiSathi-v2.5.0.apk`).
2. **Elder Mental Model & Zero Trapping**:
   - The elder user is easily confused or disoriented.
   - **Zero dummy / mock data**: All reminders, cognitive scores, and habit streaks persist in real IndexedDB.
   - **Zero confusing role switches**: Once set up for the elder, the app does not dump them into role pickers.
   - **Hardware Back Button Safety**: When on the home screen, Android back gestures minimize or exit the app cleanly (`CapApp.exitApp()`) rather than kicking the elder into a login screen.
   - In Onboarding, visible "← Switch Profile / Login" escape buttons exist so caregivers never get trapped.
3. **Design Standard: Modern Scandinavian Clarity**:
   - Palette: Deep Slate (`#0F172A` / `#1E293B`), Modern Indigo (`#4F46E5`), Soft Neutral Light Canvas (`#F8FAFC`), Deep Dark Canvas (`#0B0F17`), hairline borders (`#E2E8F0` / `#334155`).
   - Tactile senior-friendly touch targets: minimum 56px–64px height.
   - No repetitive clunky SaaS card kits (monotonous thick rounded boxes with middle dots).

---

## 2. Technical Stack

- **Framework**: React 18.2 + TypeScript + Vite 6.4.3
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + master CSS variables in `src/styles/globals.css` and `src/index.css`
- **Native Android Wrapper**: Capacitor 8.5 (`@capacitor/android`, `@capacitor/app`, `@capacitor/local-notifications`)
- **Local Database**: Dexie.js 4.4 (IndexedDB) with `dexie-react-hooks`
- **Audible Care Alarms**: Web Audio API (`AudioContext` 4-tone ascending chime) + native Android exact background alarms (`allowWhileIdle: true`)
- **In-App Updater**: Native Android package installer plugin (`AppUpdatePlugin.java`) + `UpdateChecker.tsx`

---

## 3. Current Progress State

### Completed in Codebase:
1. **Design System & Theme Engine**:
   - `src/styles/globals.css` & `src/index.css`: fully upgraded with Modern Scandinavian tokens (`--color-bg`, `--color-card`, `--color-border`, `--color-text`, `--color-primary`).
   - Light Theme and Dark Theme classes (`theme-light`, `theme-dark`) synchronized to `document.documentElement` and `document.body`.
2. **Shared Components Modernized**:
   - `AppHeader.tsx`, `BottomNav.tsx`, `Card.tsx`, `LargeButton.tsx`, `ScreenContainer.tsx`, `ReminderCard.tsx`, `ProfileSwitcherModal.tsx`, `HearInstructionsButton.tsx`, `ProgressCard.tsx`.
3. **Core Screens Redesigned**:
   - `SplashScreen.tsx`: Tranquil, modern Scandinavian start screen.
   - `LoginScreen.tsx`: Friction-free profile entry with visible exit navigation.
   - `OnboardingFlow.tsx`: All 5 onboarding steps modernized.
   - `PatientHomeScreen.tsx`: Redesigned with greeting, tactile 2x2 cognitive launcher, and real care schedule.

### Pending Tasks for OpenCode:
1. **Purge Remaining Legacy Colors (14 files, ~118 instances)**:
   Replace legacy arbitrary hex classes (`bg-[#F5F0E8]`, `bg-[#FDF8F0]`, `bg-[#1B5E20]`, `border-[#E0D8CC]`, `text-[#1A1A1A]`) with CSS variables (`bg-[var(--color-bg)]`, `bg-[var(--color-card)]`, `bg-[var(--color-primary)]`, `border-[var(--color-border)]`, `text-[var(--color-text)]`) in:
   - `src/pages/GamesScreen.tsx`
   - `src/pages/ProgressScreen.tsx`
   - `src/pages/RemindersScreen.tsx`
   - `src/pages/CaregiverDashboard.tsx`
   - `src/pages/CaregiverScreen.tsx`
   - `src/pages/HomeScreen.tsx`
   - `src/pages/DemoSetupScreen.tsx`
   - `src/screens/MemoryBookViewerScreen.tsx`
   - `src/pages/caregiver/SafetyDashboard.tsx`
   - `src/pages/caregiver/CaregiverHome.tsx`
   - `src/pages/settings/AdaptiveEngineTestScreen.tsx`
   - `src/pages/settings/SecurityTestScreen.tsx`
   - `src/pages/settings/SyncTestScreen.tsx`
   - `src/pages/settings/ReminderTestScreen.tsx`
2. **Cognitive Games Suite Polish**:
   - Verify that `RecognisePlay.tsx`, `RememberRecall.tsx`, `MemoryMatchGame.tsx`, and `DailyRoutineGame.tsx` render cleanly with Scandinavian tokens and back navigation.
3. **Native APK Compilation**:
   - Run `./build-apk.sh` to compile `SmritiSathi-v2.5.0.apk`.

---

## 4. Key Development Commands

```bash
# App Directory
cd /Users/krishnajangid/Documents/antigravity/peaceful-hertz/smriti-sathi

# Run local browser dev server (tested on laptop at http://localhost:5173)
npm run dev

# Run TypeScript verification
npm run typecheck

# Run production build
npm run build

# Preview production build
npm run preview

# Compile Native Android APK (from workspace root)
cd /Users/krishnajangid/Documents/antigravity/peaceful-hertz
./build-apk.sh
```

---

## 5. Skills Attachments (Copy & Install in OpenCode)

### Attachment 1: `frontend-design`
```markdown
---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
---

# Frontend Design

Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's.

## Design Principles
- Ground designs in the subject matter: For dementia memory care, prioritize serenity, high contrast, tactile physical buttons (56px+), and zero clutter.
- Typography carries personality: Use clear typographic scale (Plus Jakarta Sans / Inter), bold headings, high legibility.
- Visual structure is information: Subtle dividing lines and surface elevation over identical card borders.
- Restraint: Spend boldness in one place, keep surrounding elements quiet and disciplined.
- Tone: Conversational, active voice, sentence case, no robotic filler.
- Avoid AI tells: No middle-dot metadata chains, no uppercase-tracked labels above every box, no clunky identical card kits.
```

### Attachment 2: `ponytail` (Lazy Senior Dev Mode)
```markdown
---
name: ponytail
description: Forces the laziest solution that actually works, simplest, shortest, most minimal. Channels a senior dev who has seen everything: question whether the task needs to exist at all (YAGNI), reach for the standard library before custom code, native platform features before dependencies, one line before fifty.
---

# Ponytail — Lazy Senior Dev Mode

The best code is the code never written.

The Ladder:
1. Does this need to exist at all? (YAGNI)
2. Already in this codebase? Reuse existing helpers, components, tokens.
3. Standard library does it? Use it.
4. Native platform feature covers it? Use it.
5. Already-installed dependency solves it? Use it.
6. Can it be one line? Make it one line.
7. Only then: minimum code that works.

Rules:
- No unrequested abstractions.
- No boilerplate or speculative scaffolding.
- Deletion over addition.
- Shortest working diff wins, but understand root cause before writing.
- Never be lazy about: accessibility, data loss prevention, error handling.
```

### Attachment 3: `verification-before-completion`
```markdown
---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always.
---

# Verification Before Completion

THE IRON LAW:
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

Gate Function:
1. IDENTIFY: What command proves this claim? (e.g. `npm run typecheck && npm run build`)
2. RUN: Execute the FULL command.
3. READ: Full output, check exit code.
4. VERIFY: Does output confirm the claim?
5. ONLY THEN: Make the claim with concrete evidence.
```

### Attachment 4: `accidental-data-loss-prevention`
```markdown
---
name: accidental-data-loss-prevention
description: STOP AND VERIFY before running any command or tool that results in irreversible data loss.
---

# Accidental Data Loss Prevention

Before deleting database tables, cloud resources, production buckets, or running destructive git resets:
1. Halt execution.
2. Request explicit affirmative consent from the user.
```

### Attachment 5: `brainstorming`
```markdown
---
name: brainstorming
description: Explores user intent, requirements, and design before implementation.
---

# Brainstorming Ideas Into Designs

Hard Gate: Do not write code or scaffold implementations until user intent has been clarified and approved.
- Understand the context and user goals.
- Present concrete options.
- Get approval before making large changes.
```

### Attachment 6: `systematic-debugging`
```markdown
---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes.
---

# Systematic Debugging

1. Reproduce the bug consistently.
2. Form a hypothesis grounded in the logs and code flow.
3. Identify the shared root cause rather than patching symptoms in callers.
4. Verify the fix with tests.
```
