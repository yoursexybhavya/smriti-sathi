# E2E Test Infra: Smriti Sathi Transformation

## Test Philosophy
- Opaque-box, requirement-driven, independently verifying system capabilities against ORIGINAL_REQUEST.md.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinations + Real-World Workload Testing.
- Executed via custom test runner with native Node.js: `npm test` (`node tests/run_all_tests.js`).

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|-------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Scandinavian Design Tokens & Canvas | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 2 | Zero Lingering Legacy Muddy Colors (#F5F0E8) | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 3 | Tactile 56-64px Senior Touch Targets | R1 | 5 tests | 5 tests | ✓ | ✓ |
| 4 | Splash Screen & Tranquil Navigation | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 5 | Profile Selection & Friction-free Auth | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 6 | Onboarding Flow (0-4) & Settings Sync | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 7 | Patient Home Screen & 2x2 Exercise Launcher | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 8 | Recognise Game (Offline assets, 56px targets) | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 9 | Remember Game (Exit navigation, tranquil timer) | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 10 | Memory Match Game (3D flip, audio, finish) | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 11 | Daily Routine Game ('daily_routine' type, magnetic snap) | R2 | 5 tests | 5 tests | ✓ | ✓ |
| 12 | Caregiver Dashboard Clinical Oversight | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 13 | Care Schedule & Alarm Buzzer Test Trigger | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 14 | Settings Live Interactive Preview & Text Resizing | R3 | 5 tests | 5 tests | ✓ | ✓ |
| 15 | Multi-Orientation Responsiveness (Portrait/Landscape) | R4 | 5 tests | 5 tests | ✓ | ✓ |
| 16 | Production Build & Typecheck Cleanliness | Acceptance | 5 tests | 5 tests | ✓ | ✓ |

## Test Architecture
- Test runner: `node tests/run_all_tests.js`
- Test suites:
  - `tests/tier1_feature_coverage.test.ts`: Fundamental isolation tests for all 16 features.
  - `tests/tier2_boundary_corner_cases.test.ts`: Limit conditions, empty states, extremes, error bounds.
  - `tests/tier3_cross_feature_interactions.test.ts`: Pairwise combinations (Theme + High Contrast + Font Scaling; Game completion + Dashboard stats; Schedule toggle + Notification alarm).
  - `tests/tier4_real_world_scenarios.test.ts`: Complete elder and caregiver daily journeys.
  - `tests/tier5_adversarial_errorless_learning.test.ts`: Static code AST inspection for forbidden colors/patterns + rapid monkey click simulation.

## Coverage Goals
- Tier 1: >= 80 test cases (>=5 per feature across 16 features)
- Tier 2: >= 80 test cases (>=5 per feature)
- Tier 3: >= 16 pairwise interaction cases
- Tier 4: >= 8 end-to-end clinical workflow scenarios
- **Total: >= 184 test assertions**
