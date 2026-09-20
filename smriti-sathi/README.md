# SMRITI SATHI — Cognitive Care Platform

> **"Memory care that speaks your language — online or offline."**

**Smriti Sathi Health Technologies** | Production Android Release v2.2.0

---

## Overview

SMRITI SATHI is an elderly-friendly cognitive engagement and memory assistance platform designed for dementia patients, caregivers, and ASHA/health workers in the North Eastern Region of India. It operates effectively in low-connectivity environments.

### Clinical & Healthcare Advisory

- Cognitive stimulation exercises are designed for memory support and engagement.
- Game scores provide longitudinal engagement metrics and do not replace formal clinical diagnosis.
- Always consult healthcare professionals for clinical medical assessments.

---

## 📲 Official Android Application Installation

> ### **Single Official Download Link (Always points to latest verified build)**
> 
> 📥 **[Download Smriti Sathi Android APK (`SmritiSathi-v2.5.3.apk`)](https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.5.3/SmritiSathi-v2.5.3.apk)**  
> 🌐 **[Try Directly in Browser (No Installation Required): https://smriti-sathi.onrender.com](https://smriti-sathi.onrender.com)**
> 
> *Direct APK download link — installs immediately on your Android tablet or phone without navigating to GitHub release pages. Automatically maintained by GitHub Actions CI/CD on every update.*

---

## Architecture

```
src/
├── core/
│   └── constants/
│       ├── app.ts          # App metadata, languages, nav config
│       └── design.ts       # Design system tokens (colors, spacing, typography)
│
├── context/
│   └── AppContext.tsx      # Global state (patient, language, accessibility)
│
├── components/
│   ├── AppHeader.tsx       # Sticky header with title, status, settings
│   ├── BottomNav.tsx       # 5-tab bottom navigation (elderly-friendly)
│   ├── Card.tsx            # Reusable card component (pressable or static)
│   ├── ScreenContainer.tsx # Max-width container for mobile-first layout
│   ├── LargeActionCard.tsx # Big touch target cards for activities
│   ├── LargeButton.tsx     # Primary action buttons (48px+ height)
│   ├── ReminderCard.tsx    # Reminder display with completion status
│   ├── ProgressCard.tsx    # Stats display with icon and value
│   ├── VoiceButton.tsx     # Voice guidance toggle button
│   ├── SectionHeader.tsx   # Consistent section headers
│   └── StatusIndicator.tsx # Online/offline/success/warning badges
│
├── pages/
│   ├── SplashScreen.tsx        # Animated brand splash on launch
│   ├── PatientHomeScreen.tsx   # Patient dashboard (post-onboarding)
│   ├── GamesScreen.tsx         # Cognitive games listing
│   ├── RemindersScreen.tsx     # Medicine, appointments, reminders
│   ├── ProgressScreen.tsx      # Activity tracking, stats, chart
│   ├── CaregiverScreen.tsx     # Caregiver/ASHA dashboard
│   ├── SettingsScreen.tsx      # Language, voice, accessibility, privacy
│   └── onboarding/
│       ├── OnboardingFlow.tsx       # Multi-step flow controller
│       ├── OnboardingWelcome.tsx    # Step 0: Introduction
│       ├── PatientProfileSetup.tsx  # Step 1: Patient details
│       ├── LanguageSelection.tsx    # Step 2: Language choice
│       ├── AccessibilitySetup.tsx   # Step 3: Accessibility prefs
│       └── OnboardingComplete.tsx   # Step 4: Confirmation
│
├── App.tsx                 # Root with navigation + onboarding state
├── main.tsx                # React entry point
└── index.css               # Tailwind + design system theme
```

---

## Design System

### Principles
- **Large touch targets**: Minimum 48px, comfortable 56px
- **Readable typography**: 14px minimum, 16-18px body text
- **High contrast**: Dark text on light backgrounds, clear visual hierarchy
- **Simple navigation**: 5-tab bottom nav, clear labels, consistent patterns
- **Minimal cognitive load**: One primary action per screen, no clutter
- **No childish aesthetic**: Professional, warm, dignified design
- **No excessive animations**: Subtle transitions only

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1B5E20` | Navigation, primary actions, brand |
| Secondary | `#E65100` | Accents, reminders, warmth |
| Accent | `#1565C0` | Links, information, progress |
| Background | `#F5F0E8` | Warm, paper-like background |
| Surface | `#FFFFFF` | Cards, elevated content |
| Text Primary | `#1A1A1A` | Headings, body text |
| Text Muted | `#7A7A7A` | Secondary information |

### Supported Languages (for multilingual architecture)
- English, Hindi, Assamese, Bengali, Nepali, Manipuri, Khasi, Mizo

---

## Features Implemented

### Foundation Phase ✅
1. **Splash Screen** — Branded launch with app identity
2. **Bottom Navigation** — 5-tab elderly-friendly navigation
3. **Home Screen** — Greeting, quick actions, daily schedule
4. **Games Screen** — Two cognitive games listed (Memory Match, Pattern Sequence)
5. **Reminders Screen** — Medicine, appointments with offline notice
6. **Progress Screen** — Weekly stats, activity chart, achievements
7. **Caregiver Screen** — Patient list, insights, communication
8. **Settings Screen** — Language, voice, accessibility, privacy
9. **Online/Offline Detection** — Real-time connectivity status
10. **Design System** — Consistent tokens throughout

### Phase 1: Elderly UX, Accessibility & Onboarding ✅

#### Onboarding Flow (Caregiver-First Setup)
1. **Welcome Screen** — Introduction with feature highlights
2. **Patient Profile Setup** — Name, age, daily routine, reminder preferences
3. **Language Selection** — English, Assamese, Bodo, Manipuri
4. **Accessibility Setup** — Text size, high contrast, voice guidance
5. **Completion Screen** — Confirmation with feature summary

#### Patient Home Experience
- **Personalized Greeting** — Shows patient name with time-based greeting
- **Today's Activities** — Memory and Recognition activities (large action cards)
- **Today's Reminders** — Medicine, Hydration, Activity, Appointment (configurable)
- **Progress Summary** — Weekly stats in simple cards
- **Gentle Messaging** — "Take your time. There is no rush."

#### Reusable UI Components
- **LargeActionCard** — Big touch targets with icon + title + subtitle
- **LargeButton** — Primary action buttons (48px+ height)
- **ReminderCard** — Reminder display with completion status
- **ProgressCard** — Stats display with icon and value
- **VoiceButton** — Voice guidance toggle button
- **SectionHeader** — Consistent section headers with optional actions
- **StatusIndicator** — Online/offline/success/warning badges

#### State Management
- **AppContext** — Global state for patient profile, language, accessibility
- **Onboarding State** — Tracks completion and patient data
- **Accessibility Settings** — Text size, contrast, voice preferences
- **Patient Profile** — Name, age, language, routine, reminder preferences

#### UX Principles Applied
- ✅ Large readable typography (16-18px minimum)
- ✅ High contrast color palette
- ✅ Large touch targets (48px+ minimum)
- ✅ Simple navigation (one primary action per screen)
- ✅ Descriptive labels alongside icons
- ✅ Minimal text, no clutter
- ✅ No auto-moving content or flashing elements
- ✅ No complex gestures
- ✅ Dignified language ("Well done." not "Good job!")
- ✅ Recognition over recall

### Phase 2: REMEMBER Cognitive Game ✅

**Fully functional memory recall activity:**
- 5-phase game flow (Intro → Memorize → Recall → Result → Save)
- 5 difficulty levels (3-6 objects, adaptive)
- 15 culturally appropriate objects (NE India context)
- Local storage persistence (works offline)
- Deterministic difficulty engine (no ML)
- Supportive, dignified messaging
- Real-time statistics tracking
- Automatic difficulty adjustment based on performance

### Phase 3: RECOGNISE Game + Adaptive Engine ✅

**Pattern recognition activity with 3 types:**
- Pattern completion (🍎 → 🍌 → 🍎 → ?)
- Odd-one-out (which object is different?)
- Visual sequence completion
- 5 questions per session
- 5 difficulty levels (adaptive)

**Adaptive Difficulty Engine:**
- Deterministic rules (no ML)
- Analyzes last 5 sessions
- Adjusts based on accuracy + response time
- Clamps difficulty 1-5
- User-friendly messaging
- Comprehensive test suite (9 tests, all passing)
- Visual test runner in Settings

### Phase 4: Offline-First Database Architecture ✅

**Complete IndexedDB implementation:**
- 7 database tables (users, game_sessions, reminders, reminder_completions, progress, sync_events, settings)
- Repository pattern for clean data access
- Full offline operation (no network dependency)
- Sync queue ready for cloud integration
- Comprehensive test suite
- Connectivity indicator
- Data persistence across app restarts

### Phase 5: Reminder System ✅

**Complete reminder system with voice and notifications:**
- 4 reminder categories (Medication, Hydration, Activity, Appointment)
- Full CRUD operations (Create, Read, Update, Delete)
- Recurring reminders (daily, weekly, one-time)
- Snooze functionality (10-minute delay)
- Voice reminders using Web Speech API
- Local browser notifications
- Offline-first operation
- Comprehensive test suite (10 tests)
- Bhashini-ready architecture for future Indian language support

### Phase 6: Progress Analytics & Caregiver Dashboard ✅

**Longitudinal tracking and caregiver insights:**
- Progress Analytics Service with trend detection
- Patient Progress Screen with real-time metrics
- Caregiver Dashboard with engagement overview
- Memory and Recognition performance trends
- Reminder adherence tracking
- Daily activity visualization
- Follow-up signal for significant changes
- Local IndexedDB persistence with cloud synchronization
- Patient telemetry and engagement reporting
- Non-clinical, supportive language throughout

### Phase 7: Memory Book & Personal Memory Anchors ✅

**Emotionally familiar memory anchors:**
- Memory Book with 4 categories (Family, Places, Objects, Memories)
- Caregiver mode for adding/editing/deleting memories
- Patient mode with simple viewing interface
- Image upload and compression from device
- Voice descriptions using Text-to-Speech
- Previous/Next navigation for easy browsing
- Cultural localization for Indian/NE users
- Sample memory generation for demonstrations
- Offline-first operation with local storage
- Dignified, elderly-friendly design

### Phase 8: Voice-First + Multilingual Architecture ✅

**Comprehensive voice and language support:**
- 4 supported languages: English, Assamese, Bodo, Manipuri
- LanguageService with translation dictionary and fallback
- TextToSpeechService with multilingual TTS and graceful fallback
- SpeechToTextService with multilingual STT (placeholder for Bhashini)
- VoiceInstructionService for high-level voice operations
- HearInstructionsButton component for reusable voice instructions
- LanguageSelector component for visual language selection
- Language context for state management
- Bhashini-compatible architecture (no UI changes needed for integration)
- No hardcoded API credentials
- Works completely offline
- Comprehensive test suite

### 🔜 Next Phase (Phase 9)
- [ ] Bhashini TTS integration for Indian languages
- [ ] Push notifications (Service Worker)
- [ ] Caregiver remote access
- [ ] Cloud sync infrastructure
- [ ] Progressive Web App (PWA) conversion
- [ ] Location-based reminders
- [ ] Data encryption layer
- [ ] Export/report generation

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animation | CSS transitions (minimal) |
| State | React useState/useEffect |

### Production Target (Future)
| Layer | Technology |
|-------|-----------|
| Framework | Flutter (Dart) |
| Platform | Android-first |
| Database | SQLite (sqflite) |
| State | Riverpod/BLoC |
| Voice | flutter_tts + speech_to_text |

---

## Running the Project

```bash
# Development
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck
```

---

## Mobile-First Approach

The web prototype is designed as a **mobile-first** experience:
- Max width of `512px` (phone-sized viewport)
- Touch-friendly interactions
- No hover-dependent features
- Vertical scrolling optimized
- Bottom navigation thumb-reachable

## Production & Care Circle Support

**Smriti Sathi Health Technologies**

---

*Built with care for those who need it most.*
