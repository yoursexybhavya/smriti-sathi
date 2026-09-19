# Project: SMRITI SATHI Cognitive Care Platform v2.2.0

## Architecture
- **Framework**: Flutter 3.47.4 / Dart 3.13.3 (Android-first).
- **Target App ID / Org**: `com.ctrlaltelite.smriti_sathi_flutter`
- **Pattern**: Clean Feature-First Modular Architecture with offline-first repositories and native `IndexedStack` shell navigation.
- **Directory Structure**:
  - `lib/core/`: Application constants (`AppColors`, `AppDimensions`, `AppTypography`, `AppRoutes`), accessibility utilities, and Material 3 `AppTheme`.
  - `lib/models/`: Pure Dart domain entities (`Patient`, `CognitiveDomain`, `GameSession`, `Reminder`, `ReminderLog`, `AppSettings`).
  - `lib/database/repositories/`: Abstract repository interfaces and in-memory pre-seeded providers (`PatientRepository`, `ReminderRepository`, `GameSessionRepository`, `SettingsRepository`).
  - `lib/features/`: Feature modules (`home`, `games`, `reminders`, `progress`, `caregiver`, `settings`, `shell`).
  - `lib/services/`: Core platform services (`AdaptiveEngineService`, `VoiceService`, `LanguageService`, `ConnectivityService`, `SyncService`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Flutter Project Initialization | Initialize Flutter 3.x project in `smriti-sathi-flutter` with `com.ctrlaltelite` | M1 | ORIGINAL_REQUEST R1 |
| 2 | Modular Directory Hierarchy | Establish `core/`, `models/`, `database/repositories/`, `features/`, `services/` | M1 | ORIGINAL_REQUEST R1 |
| 3 | Core Domain Models | Patient, GameSession, Reminder, ReminderLog, CognitiveDomain, AppSettings | M1 | ORIGINAL_REQUEST R1 & database.ts |
| 4 | Database Repositories | Abstract contracts + in-memory providers pre-seeded with realistic elderly data | M1 | ORIGINAL_REQUEST R1 |
| 5 | Modular Core Services | Adaptive engine, voice, language, connectivity, sync service definitions | M1 | ORIGINAL_REQUEST R1 |
| 6 | WCAG AAA Color System | High-contrast dark (`#0A1420`) and light (`#F8FAFC`) palettes with >= 7:1 contrast | M2 | ORIGINAL_REQUEST R3 & Survey |
| 7 | Large Typography Engine | Strict >= 24px floor for body styles and button labels with anti-crowding line-height | M2 | ORIGINAL_REQUEST R3 & Survey |
| 8 | Motor Ergonomic Dimensions | >= 48x48px touch targets, 64-88px button heights, 16-24px tremor safety gaps | M2 | ORIGINAL_REQUEST R3 & Survey |
| 9 | Material 3 ThemeData | Complete `ThemeData` (ColorScheme, TextTheme, ElevatedButton, Card, NavigationBar) | M2 | ORIGINAL_REQUEST R3 & Survey |
| 10 | Accessible UI Components | Reusable `ElderlyCard`, `ElderlyButton`, and `ElderlyHeader` components | M2 | ORIGINAL_REQUEST R3 & Survey |
| 11 | Main Navigation Shell | Native `IndexedStack` preserving state across 6 destinations with zero latency | M3 | ORIGINAL_REQUEST R2 & Survey |
| 12 | Home Placeholder Screen | Greeting, next reminder, single primary CTA, and 1-tap navigation shortcuts | M3 | ORIGINAL_REQUEST R2 |
| 13 | Games Placeholder Screen | Cognitive game cards with errorless learning visual scaffolding (3s hint) | M3 | ORIGINAL_REQUEST R2 |
| 14 | Reminders Placeholder Screen| Daily reminder schedule with large voice playback button and acknowledgment CTA | M3 | ORIGINAL_REQUEST R2 |
| 15 | Progress Placeholder Screen | Daily adherence metrics, cognitive streak, and simplified progress indicators | M3 | ORIGINAL_REQUEST R2 |
| 16 | Caregiver Placeholder Screen| Familiar voice recording interface and patient management controls | M3 | ORIGINAL_REQUEST R2 |
| 17 | Settings Placeholder Screen | High-contrast toggle, font scale selector, and Indian language preferences | M3 | ORIGINAL_REQUEST R2 |
| 18 | Static Analysis Verification| `flutter analyze` passes with 0 errors and 0 warnings across all files | M4 | ORIGINAL_REQUEST Acceptance |
| 19 | Android Debug Build | `flutter build apk --debug` completes successfully producing `app-debug.apk` | M4 | ORIGINAL_REQUEST Acceptance |
| 20 | E2E Automated Verification | Opaque-box automated test suite validating typography, touch targets, and navigation | M4 | Dual Track Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Project Setup & Architecture Setup | Initialize Flutter project, create modular directories (`core`, `models`, `database/repositories`, `features`, `services`), define models, repository contracts, and service stubs. | none | PLANNED |
| M2 | Design System & Theme Engine | Implement WCAG AAA palettes, >=24px typography, >=48x48 touch targets, Material 3 `ThemeData`, and accessible UI components. | M1 | PLANNED |
| M3 | Application Shell & 6 Feature Screens | Implement `MainNavigationShell` (`IndexedStack`), 6 placeholder screens (Home, Games, Reminders, Progress, Caregiver, Settings), and interactive bindings to repositories/services. | M2 | PLANNED |
| M4 | E2E Verification & Android Build | Automated widget tests (touch targets >=48px, typography >=24px, navigation), `flutter analyze` (0 errors), and `flutter build apk --debug`. | M3 | PLANNED |

## Interface Contracts

### Shell ↔ Features
- Navigation state: `currentIndex` (0: Home, 1: Games, 2: Reminders, 3: Progress, 4: Caregiver, 5: Settings).
- Shell provides top app bar with context-sensitive back buttons for sub-flows (Caregiver/Settings) and title display.
- Shell provides `onNavigate(int index)` callback accessible to in-screen shortcut buttons on Home.

### Features ↔ Repositories
- `PatientRepository.getCurrentPatient()` -> `Future<Patient>`
- `ReminderRepository.getActiveReminders()` -> `Future<List<Reminder>>`
- `ReminderRepository.acknowledgeReminder(String id)` -> `Future<void>`
- `GameSessionRepository.getRecentSessions()` -> `Future<List<GameSession>>`
- `SettingsRepository.getSettings()` -> `Future<AppSettings>`

### Features ↔ Services
- `VoiceService.playAudioCue(String audioPath)` -> `Future<void>`
- `AdaptiveEngineService.triggerScaffoldingHint()` -> `void`
- `LanguageService.getCurrentLanguage()` -> `String`
- `ConnectivityService.isOnline` -> `bool`

## Code Layout
- `smriti-sathi-flutter/`
  - `pubspec.yaml`
  - `analysis_options.yaml`
  - `lib/`
    - `main.dart`
    - `core/`
      - `constants/` (`app_colors.dart`, `app_dimensions.dart`, `app_typography.dart`, `app_routes.dart`)
      - `theme/` (`app_theme.dart`)
      - `utils/` (`accessibility_utils.dart`, `date_formatter.dart`)
      - `widgets/` (`elderly_button.dart`, `elderly_card.dart`, `elderly_header.dart`)
    - `models/` (`patient.dart`, `cognitive_domain.dart`, `game_session.dart`, `reminder.dart`, `reminder_log.dart`, `app_settings.dart`)
    - `database/repositories/` (`patient_repository.dart`, `reminder_repository.dart`, `game_session_repository.dart`, `settings_repository.dart`)
    - `features/`
      - `shell/` (`main_navigation_shell.dart`)
      - `home/` (`home_screen.dart`)
      - `games/` (`games_hub_screen.dart`)
      - `reminders/` (`reminders_screen.dart`)
      - `progress/` (`progress_screen.dart`)
      - `caregiver/` (`caregiver_screen.dart`)
      - `settings/` (`settings_screen.dart`)
    - `services/` (`adaptive_engine_service.dart`, `voice_service.dart`, `language_service.dart`, `connectivity_service.dart`, `sync_service.dart`)
  - `test/`
    - `widget_test.dart`
    - `accessibility_test.dart`
    - `navigation_test.dart`
