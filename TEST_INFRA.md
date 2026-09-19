# E2E Test Infra: SMRITI SATHI Flutter Prototype

## Test Philosophy
- Opaque-box, requirement-driven. Derived from user requirements (SIH26003, R1, R2, R3).
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise + Accessibility Auditing.

## Feature Inventory
| # | Feature | Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---------|--------|:----------------:|:-----------------:|:----------------------:|:-----------------:|
| 1 | Modular Directory Structure | ORIGINAL_REQUEST §R1 | ✓ | ✓ | ✓ | ✓ |
| 2 | 6 Placeholder Screens | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ | ✓ |
| 3 | Shell Navigation | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ | ✓ |
| 4 | High-Contrast Theme | ORIGINAL_REQUEST §R3 | ✓ | ✓ | ✓ | ✓ |
| 5 | >= 24px Typography | ORIGINAL_REQUEST §R3 | ✓ | ✓ | ✓ | ✓ |
| 6 | >= 48x48 Touch Targets | ORIGINAL_REQUEST §R3 | ✓ | ✓ | ✓ | ✓ |
| 7 | Static Analysis (0 errors)| Acceptance Criteria | ✓ | ✓ | ✓ | ✓ |
| 8 | Android Debug Build | Acceptance Criteria | ✓ | ✓ | ✓ | ✓ |

## Test Architecture
- Test runner: `flutter test` (executes all widget, accessibility, and navigation tests).
- Static analyzer: `flutter analyze`.
- Android build runner: `flutter build apk --debug`.
- Test directory: `smriti-sathi-flutter/test/`.
  - `widget_test.dart`: App loads and renders main navigation shell.
  - `accessibility_test.dart`: Verifies touch targets >= 48x48 and font sizes >= 24px.
  - `navigation_test.dart`: Verifies navigation between all 6 placeholder screens.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised |
|---|----------|--------------------|
| 1 | Elder Morning Routine | Home Screen -> View Next Reminder -> Acknowledge -> Return |
| 2 | Cognitive Exercise Session | Home Screen -> Navigate to Games -> View Game Scaffolding Card |
| 3 | Caregiver Setup | App Bar Action -> Caregiver Portal -> Voice Recording UI -> Back |
| 4 | Accessibility Settings Adjustment | Settings Screen -> Verify High Contrast & Font Scale UI -> Home |
