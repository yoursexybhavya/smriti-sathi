# Project: Smriti Sathi Transformation

## Architecture
Smriti Sathi is a React 18 + TypeScript + Vite + Tailwind CSS v4 digital health progressive web app / Capacitor hybrid app designed for elderly patients with cognitive decline / mild cognitive impairment and their caregivers.

- **Frontend Core**: React 18 with Vite bundler, `@tailwindcss/vite` integration, Framer Motion for tranquil transitions, Lucide React icons.
- **Local Persistence & Offline First**: Dexie.js (IndexedDB) for local persistence of patient profiles, care reminders, game sessions, and accessibility preferences.
- **Audio & Haptics Engine**: Web Audio API tone synthesis, Web Speech API (multilingual dementia-paced TTS), and Navigator vibration API.
- **Design System Engine**: Modern Scandinavian Clarity design tokens via CSS variables and Tailwind utilities:
  - Deep Slate (`#0F172A` / `#1E293B`)
  - Crisp Indigo / Modern Cobalt accents (`#4F46E5` / `#3B82F6`)
  - Soft Neutral Canvas (`#F8FAFC` light / `#0B0F17` dark)
  - Functional signals: Emerald (`#10B981` success) and Amber (`#F59E0B` attention)
  - Subtle dividing lines (`slate-200` / `slate-800`), soft floating surfaces, zero legacy muddy backgrounds (`#F5F0E8`).
  - Tactile 56px–64px elderly touch targets.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Scandinavian Color Tokens & CSS Vars | Deep slate, indigo/cobalt accents, soft neutral light/dark canvas, functional emerald/amber | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Tailwind v4 & Dark Mode Engine | `@custom-variant dark` support, clean theme switching without bleed-through | M1 | Survey (Explorer 1) |
| 3 | Tooling & Build Consolidation | Unify `vite.config.ts`, add `"test"` script, clean package.json | M1 | Survey (Explorer 1 & 3) |
| 4 | Legacy Color Purge | Complete elimination of `#F5F0E8`, `#FDF8F0`, `#1B5E20` across tokens and common components | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Tactile 56-64px Touch Target Standard | Enforce senior touch targets on all buttons, toggles, back navigation | M1 | ORIGINAL_REQUEST §R1 |
| 6 | Dead/Orphan Code Cleanup | Remove un-imported dead prototypes and conflicting stylesheets | M1 | Survey (Explorer 1) |
| 7 | Splash Screen Redesign | Tranquil animation, deep slate / modern canvas, version tag, theme awareness | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Profile Selection & Login Screen | Friction-free elder quick login (56px), caregiver PIN login, back/exit navigation | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Onboarding Flow Redesign | Steps 0-4 styled with Scandinavian clarity, high-contrast, text sizing, back navigation | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Patient Home Screen Redesign | Daily greeting, real care schedule with status toggles, audio anchor card | M2 | ORIGINAL_REQUEST §R2 |
| 11 | 2x2 Cognitive Launcher Grid | Balanced 2x2 grid for 4 games with daily completion status & level badges | M2 | ORIGINAL_REQUEST §R2 |
| 12 | Bottom Navigation Alignment | Ensure Settings tab does not cause navbar to vanish | M2 | Survey (Explorer 2) |
| 13 | Recognise Game Overhaul | Offline fallback assets, 56px+ option targets, tactile audio chimes, clear framing | M3 | ORIGINAL_REQUEST §R2 |
| 14 | Remember Game Elder Navigation & Flow | Visible back/exit on Memorize and Recall, tranquil timer, recall grid | M3 | ORIGINAL_REQUEST §R2 |
| 15 | Memory Match 3D Flip & Finish | Genuine 3D card flip animation (`rotateY`), audio chimes, celebratory confetti finish | M3 | ORIGINAL_REQUEST §R2 |
| 16 | Daily Routine Game Fix & Magnetic Snaps | Fix `gameType: 'daily_routine'` bug, Dexie schema update, magnetic drop zones | M3 | ORIGINAL_REQUEST §R2 |
| 17 | Caregiver Dashboard Integration | Wire clinical oversight, weekly engagement %, adherence rates, safety status | M4 | ORIGINAL_REQUEST §R3 |
| 18 | Care Schedule & Reminders Screen | Chronological timeline, one-tap status toggles, audio alarm & buzzer test trigger | M4 | ORIGINAL_REQUEST §R3 |
| 19 | Settings & Live Interactive Preview | Text resizing (18/22/26px), high contrast (WCAG AAA) live interactive preview | M4 | ORIGINAL_REQUEST §R3 |
| 20 | Multi-Orientation Responsiveness | Single focused column on portrait, balanced multi-column landscape >=1024px | M4 | ORIGINAL_REQUEST §R4 |
| 21 | E2E Test Suite Pass (Tiers 1-4) | Pass 100% of requirement-driven test suite with zero failures | M5 | ORIGINAL_REQUEST Acceptance |
| 22 | Adversarial Hardening & Final Audit | Tier 5 stress challenge, typecheck, production build, forensic integrity audit | M5 | Project Pattern Final Milestone |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design System, Theme Engine & Build Unification | Tokens, Tailwind v4 dark mode, vite.config.ts, legacy color purge from shared components, tactile standards | none | DONE |
| M2 | Patient Experience, Splash & Onboarding | Splash, Login, Onboarding Flow (0-4), Patient Home Screen (2x2 launcher, daily care schedule), BottomNav fix | M1 | IN_PROGRESS |
| M3 | Cognitive Games Suite Polish & Bugfixes | Recognise, Remember (exit navigation, calm timer), Memory Match (3D flip, fanfare), Daily Routine (bugfix, magnetic snaps) | M1, M2 | PLANNED |
| M4 | Caregiver Dashboard, Reminders, Settings & Multi-Orientation | Caregiver clinical oversight, Reminders timeline & buzzer test, Settings live preview, landscape multi-column layouts | M1, M2 | PLANNED |
| M5 | Final E2E Test Pass, Build Verification & Audit Hardening | Pass 100% E2E test suite (Tiers 1-4), adversarial coverage (Tier 5), typecheck, production build, forensic audit | M1, M2, M3, M4 | PLANNED |

## Interface Contracts

### Design Tokens & Theming (`src/index.css` & `src/styles/globals.css`)
- Light theme canvas: `--color-bg: #F8FAFC`, `--color-card: #FFFFFF`, `--color-border: #E2E8F0`, `--color-text: #0F172A`, `--color-text-muted: #64748B`
- Dark theme canvas: `--color-bg: #0B0F17`, `--color-card: #1E293B`, `--color-border: #334155`, `--color-text: #F8FAFC`, `--color-text-muted: #94A3B8`
- Accents: `--color-primary: #4F46E5` (Indigo), `--color-accent: #3B82F6` (Cobalt)
- Functional: `--color-success: #10B981` (Emerald), `--color-warning: #F59E0B` (Amber)
- Touch targets: interactive buttons/links minimum `h-14` (56px) or `h-16` (64px) for primary elder controls.

### Navigation Contract (`src/App.tsx` ↔ Pages)
- `onNavigate: (screen: string) => void`
- `onBack: () => void`
- Patient tabs: `['home', 'games', 'reminders', 'progress', 'settings']`
- Caregiver tabs: `['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings']`
- Dynamic patient route in caregiver mode: `'caregiver-patient-details'` rendering `CaregiverDashboard.tsx`.

### Game Persistence Contract (`src/database/db.ts` & `src/models/GameSession.ts`)
- `gameType: 'remember' | 'recognise' | 'test' | 'memory_match' | 'daily_routine'`
- `GameStorage.saveSession(session)` stores all 4 cognitive game results accurately.

## Code Layout
- `src/styles/`: `globals.css`, `index.css`
- `src/components/`: Shared UI components (`AppHeader`, `BottomNav`, `Card`, `LargeButton`, `LargeActionCard`, `VoiceButton`, `ScreenContainer`)
- `src/pages/`:
  - `SplashScreen.tsx`, `PatientHomeScreen.tsx`, `CaregiverDashboard.tsx`, `RemindersScreen.tsx`, `SettingsScreen.tsx`, `ProgressScreen.tsx`
  - `auth/LoginScreen.tsx`
  - `onboarding/`: `OnboardingFlow.tsx`, `OnboardingWelcome.tsx`, `PatientProfileSetup.tsx`, `LanguageSelection.tsx`, `AccessibilitySetup.tsx`, `OnboardingComplete.tsx`
  - `games/`: `RecogniseGame.tsx`, `RememberGame.tsx`, `MemoryMatchGame.tsx`, `DailyRoutineGame.tsx`
  - `caregiver/`: `CaregiverHome.tsx`, `SafetyDashboard.tsx`
- `src/database/`: `db.ts`, `index.ts`
- `tests/`: `run_all_tests.js`, `tier1_feature_coverage.test.ts`, `tier2_boundary_corner_cases.test.ts`, `tier3_cross_feature_interactions.test.ts`, `tier4_real_world_scenarios.test.ts`, `tier5_adversarial_errorless_learning.test.ts`
