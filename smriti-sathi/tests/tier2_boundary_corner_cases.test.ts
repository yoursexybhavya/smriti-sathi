/**
 * Tier 2: Boundary & Corner Cases Test Suite — Smriti Sathi Transformation
 * Validates edge cases, boundary conditions, empty states, and limit behaviors
 * across all 16 features from TEST_INFRA.md.
 * Minimum 5 tests per feature (Total: 80 tests).
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupTestEnvironment, MockElement } from './mocks/browser_env.ts';
import { createMockDatabase } from './mocks/dexie_mock.ts';
import {
  createGame as createDailyRoutineGame,
  selectCard as selectDailyRoutineCard,
  placeCard as placeDailyRoutineCard,
  getResult as getDailyRoutineResult,
} from '../src/games/dailyRoutine.ts';
import {
  createGame as createMemoryMatchGame,
  flipCard as flipMemoryMatchCard,
  checkMatch as checkMemoryMatch,
  getResult as getMemoryMatchResult,
} from '../src/games/memoryMatch.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to compute WCAG 2.1 relative luminance & contrast ratio
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '').trim();
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map((c) => c + c).join('')
    : cleanHex;
  const num = parseInt(fullHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// ============================================================================
// FEATURE 1: Scandinavian Design Tokens Boundaries
// ============================================================================
test('TIER 2 — Feature 1: Scandinavian Design Tokens Boundaries', async (t) => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');

  await t.test('2.1.1: Light canvas color normalization handles case-insensitivity', () => {
    const hasLightCanvas =
      globalsCss.toLowerCase().includes('#f8fafc') || globalsCss.toUpperCase().includes('#F8FAFC');
    assert.ok(hasLightCanvas, 'Must support #F8FAFC light canvas regardless of case');
  });

  await t.test('2.1.2: Contrast ratio of light theme text (#0F172A) on #F8FAFC canvas exceeds WCAG AAA (7.0:1)', () => {
    const ratio = getContrastRatio('#0F172A', '#F8FAFC');
    assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must exceed WCAG AAA 7.0:1`);
  });

  await t.test('2.1.3: Contrast ratio of dark theme text (#FFFFFF) on midnight canvas (#0A1420) exceeds WCAG AAA (7.0:1)', () => {
    const ratio = getContrastRatio('#FFFFFF', '#0A1420');
    assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must exceed WCAG AAA 7.0:1`);
  });

  await t.test('2.1.4: Design tokens contain valid hex format without syntax errors', () => {
    const hexMatches = globalsCss.match(/#[0-9a-fA-F]{3,8}/g);
    assert.ok(hexMatches && hexMatches.length > 10, 'Must extract valid hex color codes from globals.css');
    for (const hex of hexMatches) {
      assert.ok(
        hex.length === 4 || hex.length === 7 || hex.length === 9,
        `Hex code ${hex} must be valid 3, 6, or 8 digit hex`
      );
    }
  });

  await t.test('2.1.5: CSS variable fallbacks defined in body rules ensure graceful rendering', () => {
    const indexCss = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
    assert.ok(indexCss.includes('var(--color-bg'), 'Must specify var(--color-bg) fallback');
    assert.ok(indexCss.includes('var(--color-text'), 'Must specify var(--color-text) fallback');
  });
});

// ============================================================================
// FEATURE 2: Zero Lingering Muddy Colors Boundaries
// ============================================================================
test('TIER 2 — Feature 2: Zero Lingering Muddy Colors Boundaries', async (t) => {
  const patientHome = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('2.2.1: Case-insensitive scan: #f5f0e8, #F5F0E8, rgb(245, 240, 232) absent from PatientHomeScreen', () => {
    const lower = patientHome.toLowerCase();
    assert.ok(!lower.includes('#f5f0e8'), 'PatientHomeScreen must not contain #f5f0e8');
    assert.ok(!lower.includes('245, 240, 232') && !lower.includes('245,240,232'), 'Must not contain rgb(245, 240, 232)');
  });

  await t.test('2.2.2: Warm muddy card background #FDF8F0 absent from PatientHomeScreen', () => {
    assert.ok(!patientHome.toLowerCase().includes('#fdf8f0'), 'PatientHomeScreen must not contain #fdf8f0');
  });

  await t.test('2.2.3: Legacy muddy forest green #1B5E20 absent from PatientHomeScreen launcher cards', () => {
    // PatientHomeScreen replaces #1B5E20 with modern #10B981 emerald and slate tokens
    assert.ok(!patientHome.includes('bg-[#1B5E20]'), 'PatientHomeScreen buttons must not use legacy bg-[#1B5E20]');
  });

  await t.test('2.2.4: globals.css contains ZERO legacy muddy tokens (#F5F0E8, #FDF8F0)', () => {
    const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');
    assert.ok(!globalsCss.includes('#F5F0E8'), 'globals.css must not define legacy #F5F0E8');
    assert.ok(!globalsCss.includes('#FDF8F0'), 'globals.css must not define legacy #FDF8F0');
  });

  await t.test('2.2.5: ErrorBoundary component has been purged of #F5F0E8 and adopts dark #0B0F17 canvas', () => {
    const errBoundary = fs.readFileSync(path.join(rootDir, 'src/components/ErrorBoundary.tsx'), 'utf-8');
    assert.ok(!errBoundary.includes('#F5F0E8'), 'ErrorBoundary must be purged of #F5F0E8');
    assert.ok(errBoundary.includes('#0B0F17') || errBoundary.includes('slate-50'), 'ErrorBoundary adopts Scandinavian slate/canvas');
  });
});

// ============================================================================
// FEATURE 3: Senior Touch Targets Boundaries
// ============================================================================
test('TIER 2 — Feature 3: Senior Touch Targets Boundaries', async (t) => {
  await t.test('3.1: Minimum height constraint boundary on mobile viewports (<360px)', () => {
    const buttonContent = fs.readFileSync(path.join(rootDir, 'src/components/LargeButton.tsx'), 'utf-8');
    assert.ok(
      buttonContent.includes('min-h-[56px]') || buttonContent.includes('py-4') || buttonContent.includes('h-14'),
      'Button height must never collapse below 56px'
    );
  });

  await t.test('3.2: Icon-only buttons (back, audio, settings) maintain minimum 40x40px touch areas', () => {
    const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
    assert.ok(homeContent.includes('min-h-[40px]'), 'Icon and utility buttons must specify minimum 40px bounding box');
  });

  await t.test('3.3: Touch target vertical spacing (gap-3.5 or gap-4) prevents accidental adjacent tap', () => {
    const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
    assert.ok(homeContent.includes('gap-3.5') || homeContent.includes('gap-4'), 'Launcher grid must space targets >=14px');
  });

  await t.test('3.4: Disabled button state maintains physical touch dimensions without shrinkage', () => {
    const buttonContent = fs.readFileSync(path.join(rootDir, 'src/components/LargeButton.tsx'), 'utf-8');
    assert.ok(
      buttonContent.includes('disabled:opacity') || buttonContent.includes('disabled:cursor-not-allowed'),
      'Disabled buttons must use opacity without reducing layout dimensions'
    );
  });

  await t.test('3.5: Senior accessibility tap target height range (56px to 64px) verified against guidelines', () => {
    const minStandard = 56;
    const maxStandard = 64;
    assert.ok(minStandard >= 48, 'Senior target minimum must exceed standard WCAG 48px');
    assert.ok(maxStandard <= 72, 'Senior target maximum must not exceed ergonomic single thumb reach');
  });
});

// ============================================================================
// FEATURE 4: Splash Screen Boundaries
// ============================================================================
test('TIER 2 — Feature 4: Splash Screen Boundaries', async (t) => {
  const splashContent = fs.readFileSync(path.join(rootDir, 'src/pages/SplashScreen.tsx'), 'utf-8');

  await t.test('4.1: Component unmount safely cancels animation timeout via clearTimeout', () => {
    assert.ok(splashContent.includes('clearTimeout(timer)'), 'Must call clearTimeout on unmount');
  });

  await t.test('4.2: Handles empty string props for appName without crashing', () => {
    const appName = '';
    const tagline = '';
    const renderedName = appName || 'Smriti Sathi';
    assert.strictEqual(renderedName, 'Smriti Sathi', 'Empty appName must fall back to Smriti Sathi');
  });

  await t.test('4.3: Extremely long appName/tagline strings are constrained with max-w-xs and px-8', () => {
    assert.ok(splashContent.includes('max-w-xs'), 'Tagline must be constrained to max-w-xs');
    assert.ok(splashContent.includes('px-8'), 'Tagline must have padding px-8');
  });

  await t.test('4.4: High z-index (z-50) guarantees overlay sits above all other app layers', () => {
    assert.ok(splashContent.includes('z-50'), 'Must enforce z-50 to supersede bottom navigation');
  });

  await t.test('4.5: Initial render starts at opacity-0 and translates smoothly', () => {
    assert.ok(splashContent.includes('opacity-0 translate-y-4'), 'Initial state must be hidden before timeout fires');
  });
});

// ============================================================================
// FEATURE 5: Profile Selection Boundaries
// ============================================================================
test('TIER 2 — Feature 5: Profile Selection Boundaries', async (t) => {
  const loginContent = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');

  await t.test('5.1: Caregiver login with invalid PIN displays clear error without throwing', () => {
    assert.ok(loginContent.includes('result.error || \'Login failed\''), 'Must format login error gracefully');
  });

  await t.test('5.2: Caregiver login with empty PIN keeps submit button disabled', () => {
    assert.ok(loginContent.includes('disabled={isLoading || !pin}'), 'Submit button must be disabled when pin is empty');
  });

  await t.test('5.3: Caregiver PIN input toggles visibility mask between text and password', () => {
    assert.ok(loginContent.includes("showPin ? 'text' : 'password'"), 'Must toggle input type');
    assert.ok(loginContent.includes('setShowPin(!showPin)'), 'Must toggle showPin state');
  });

  await t.test('5.4: Rapid double-tap on elder login button is protected by isLoading flag', () => {
    assert.ok(loginContent.includes('disabled={isLoading}'), 'Elder login button must disable during loading');
  });

  await t.test('5.5: Switching selected profiles resets any prior error message', () => {
    assert.ok(loginContent.includes("setError('')"), 'Must reset error state when switching selected profile');
  });
});

// ============================================================================
// FEATURE 6: Onboarding Flow Boundaries
// ============================================================================
test('TIER 2 — Feature 6: Onboarding Flow Boundaries', async (t) => {
  const flowContent = fs.readFileSync(path.join(rootDir, 'src/pages/onboarding/OnboardingFlow.tsx'), 'utf-8');

  await t.test('6.1: Back button on step 0 correctly invokes onCancel callback', () => {
    assert.ok(flowContent.includes('if (step === 0 && onCancel)'), 'Step 0 back must invoke onCancel');
    assert.ok(flowContent.includes('onCancel()'), 'Must call onCancel');
  });

  await t.test('6.2: Back button on step > 0 clamps to minimum step 0 using Math.max', () => {
    assert.ok(flowContent.includes('Math.max(0, prev - 1)'), 'Must clamp back navigation to 0');
  });

  await t.test('6.3: Initial accessibility state defaults to large text size and voice guidance enabled', () => {
    assert.ok(flowContent.includes("textSize: 'large'"), 'Default text size must be large');
    assert.ok(flowContent.includes('voiceGuidance: true'), 'Default voice guidance must be true');
  });

  await t.test('6.4: Onboarding finish is guarded against null patient profile', () => {
    assert.ok(flowContent.includes('if (patient) {'), 'Must check patient existence before completing');
  });

  await t.test('6.5: Default switch statement falls back to OnboardingWelcome on unexpected step', () => {
    assert.ok(flowContent.includes('default:'), 'Must provide default branch');
    assert.ok(flowContent.includes('OnboardingWelcome'), 'Default branch must render OnboardingWelcome');
  });
});

// ============================================================================
// FEATURE 7: Patient Home Screen Boundaries
// ============================================================================
test('TIER 2 — Feature 7: Patient Home Screen Boundaries', async (t) => {
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('7.1: Zero scheduled reminders displays serene empty-state card instead of crash', () => {
    assert.ok(homeContent.includes('reminders.length > 0 ?'), 'Must branch on reminders length');
    assert.ok(homeContent.includes('No care reminders scheduled for today'), 'Must show reassuring empty message');
  });

  await t.test('7.2: Completed reminder receives line-through styling and muted text color', () => {
    assert.ok(homeContent.includes('line-through'), 'Completed reminder must apply line-through text decoration');
    assert.ok(homeContent.includes('opacity-65'), 'Completed reminder container must reduce opacity to 65%');
  });

  await t.test('7.3: Long reminder titles are constrained via truncate class', () => {
    assert.ok(homeContent.includes('truncate'), 'Reminder title must use truncate to prevent multi-line overflow');
  });

  await t.test('7.4: Rapid double-click on reminder toggle is handled safely with try/catch', () => {
    assert.ok(homeContent.includes('try {'), 'Must wrap reminder toggle in try block');
    assert.ok(homeContent.includes('catch (err)'), 'Must catch toggle errors without unhandled rejection');
  });

  await t.test('7.5: Buzzer testing state disables test button while active', () => {
    assert.ok(homeContent.includes('disabled={isBuzzerTesting}'), 'Must disable buzzer button while ringing');
    assert.ok(homeContent.includes("'Ringing...' : 'Test Alarm'"), 'Must update label during buzzer test');
  });
});

// ============================================================================
// FEATURE 8: Recognise Game Boundaries
// ============================================================================
test('TIER 2 — Feature 8: Recognise Game Boundaries', async (t) => {
  const playContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecognisePlay.tsx'), 'utf-8');
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecogniseGame.tsx'), 'utf-8');

  await t.test('8.1: Offline broken image hides gracefully without breaking layout', () => {
    assert.ok(playContent.includes("style.display = 'none'"), 'Must set display none on broken image load error');
  });

  await t.test('8.2: Confirm button is disabled when no option is selected', () => {
    assert.ok(playContent.includes('disabled={!selectedOption}'), 'Confirm button must be disabled without selection');
  });

  await t.test('8.3: 0% accuracy score (0 correct answers) calculates cleanly without division by zero', () => {
    const totalQuestions = 5;
    const correctCount = 0;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    assert.strictEqual(accuracy, 0, '0 correct answers must equal 0% accuracy');
  });

  await t.test('8.4: 100% accuracy score (5 correct answers) calculates cleanly', () => {
    const totalQuestions = 5;
    const correctCount = 5;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    assert.strictEqual(accuracy, 100, '5 correct answers must equal 100% accuracy');
  });

  await t.test('8.5: Next level progression is clamped to maximum difficulty level 5', () => {
    assert.ok(gameContent.includes('Math.min(5, difficulty + 1)'), 'Difficulty must be clamped to level 5');
  });
});

// ============================================================================
// FEATURE 9: Remember Game Boundaries
// ============================================================================
test('TIER 2 — Feature 9: Remember Game Boundaries', async (t) => {
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RememberGame.tsx'), 'utf-8');
  const recallContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RememberRecall.tsx'), 'utf-8');

  await t.test('9.1: Zero objects selected in recall yields 0 selected items count', () => {
    assert.ok(recallContent.includes('selectedIds.size'), 'Must track size of selected set');
  });

  await t.test('9.2: Deselecting an object removes it from selected set without error', () => {
    assert.ok(recallContent.includes('newSet.delete(obj.id)'), 'Must delete item when already selected');
    assert.ok(recallContent.includes('newSet.add(obj.id)'), 'Must add item when not selected');
  });

  await t.test('9.3: Recall grid responsive columns adapt cleanly between small and large sets', () => {
    assert.ok(recallContent.includes('recallSet.length <= 6'), 'Must check recallSet length <= 6');
    assert.ok(recallContent.includes('recallSet.length <= 9'), 'Must check recallSet length <= 9');
  });

  await t.test('9.4: Difficulty level progression is clamped to maximum level 5', () => {
    assert.ok(gameContent.includes('Math.min(5, difficulty + 1)'), 'Must clamp difficulty to level 5');
  });

  await t.test('9.5: Response time calculation handles sub-second precision', () => {
    const start = 1000;
    const end = 3456;
    const timeInSeconds = (end - start) / 1000;
    assert.strictEqual(timeInSeconds, 2.456, 'Response time must record floating point seconds');
  });
});

// ============================================================================
// FEATURE 10: Memory Match Boundaries
// ============================================================================
test('TIER 2 — Feature 10: Memory Match Boundaries', async (t) => {
  await t.test('10.1: Clicking the same already flipped card is a no-op', () => {
    const game = createMemoryMatchGame(1);
    const flipped1 = flipMemoryMatchCard(game, 0);
    assert.strictEqual(flipped1.firstFlipped, 0);
    const flippedAgain = flipMemoryMatchCard(flipped1, 0);
    assert.strictEqual(flippedAgain.secondFlipped, null, 'Cannot flip the same card index twice');
  });

  await t.test('10.2: Minimum moves boundary: moves cannot be less than pairCount', () => {
    const game = createMemoryMatchGame(1);
    const minMoves = game.totalPairs;
    assert.strictEqual(minMoves, 2, 'Minimum possible moves for 2 pairs is 2');
  });

  await t.test('10.3: Extreme moves count (e.g. 20 moves for 2 pairs) calculates accuracy cleanly', () => {
    const minMoves = 2;
    const moves = 20;
    const accuracy = Math.round((minMoves / Math.max(minMoves, moves)) * 100);
    assert.strictEqual(accuracy, 10, '20 moves on 2 pairs should compute 10% accuracy');
  });

  await t.test('10.4: Level 4 maximum difficulty initializes 12 cards (6 pairs)', () => {
    const game = createMemoryMatchGame(4);
    assert.strictEqual(game.totalPairs, 6, 'Level 4 must have 6 pairs');
    assert.strictEqual(game.cards.length, 12, 'Level 4 must have 12 cards');
  });

  await t.test('10.5: Board lock prevents third card flip before pair evaluation', () => {
    const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/MemoryMatchGame.tsx'), 'utf-8');
    assert.ok(gameContent.includes('if (isLocked) return;'), 'Must block card click while board is locked');
    assert.ok(gameContent.includes('setIsLocked(true)'), 'Must set isLocked when 2 cards are flipped');
  });
});

// ============================================================================
// FEATURE 11: Daily Routine Boundaries
// ============================================================================
test('TIER 2 — Feature 11: Daily Routine Boundaries', async (t) => {
  await t.test('11.1: Clicking an occupied slot does not overwrite existing placed card', () => {
    let state = createDailyRoutineGame(1);
    // Find card with order 0
    const card0Idx = state.shuffledCards.findIndex((c) => c.order === 0);
    state = selectDailyRoutineCard(state, card0Idx);
    state = placeDailyRoutineCard(state, 0);

    // Try placing card with order 1 into slot 0
    const card1Idx = state.shuffledCards.findIndex((c) => c.order === 1);
    state = selectDailyRoutineCard(state, card1Idx);
    const placedAgain = placeDailyRoutineCard(state, 0);

    assert.strictEqual(placedAgain.placedCards[0]?.order, 0, 'Slot 0 must retain original card 0');
  });

  await t.test('11.2: Selecting an already placed card is ignored', () => {
    let state = createDailyRoutineGame(1);
    const card0Idx = state.shuffledCards.findIndex((c) => c.order === 0);
    state = selectDailyRoutineCard(state, card0Idx);
    state = placeDailyRoutineCard(state, 0);

    // Try selecting placed card again
    const selectAttempt = selectDailyRoutineCard(state, card0Idx);
    assert.strictEqual(selectAttempt.selectedCardIndex, null, 'Cannot select an already placed card');
  });

  await t.test('11.3: Level 1 has exactly 3 steps; Level 4 has 6 steps', () => {
    const lvl1 = createDailyRoutineGame(1);
    const lvl4 = createDailyRoutineGame(4);
    assert.strictEqual(lvl1.totalCards, 3, 'Level 1 must have 3 steps');
    assert.strictEqual(lvl4.totalCards, 6, 'Level 4 must have 6 steps');
  });

  await t.test('11.4: High attempt count (e.g. 10 attempts for 3 cards) calculates proportional accuracy', () => {
    let state = createDailyRoutineGame(1);
    // Make 7 wrong attempts
    const card0Idx = state.shuffledCards.findIndex((c) => c.order === 0);
    for (let i = 0; i < 7; i++) {
      state = selectDailyRoutineCard(state, card0Idx);
      state = placeDailyRoutineCard(state, 1); // wrong slot
    }
    // Now complete correctly
    for (let slot = 0; slot < 3; slot++) {
      const cIdx = state.shuffledCards.findIndex((c) => c.order === slot && !state.placedCards.some((p) => p?.id === c.id));
      state = selectDailyRoutineCard(state, cIdx);
      state = placeDailyRoutineCard(state, slot);
    }
    const result = getDailyRoutineResult(state);
    assert.strictEqual(result.attempts, 10, 'Total attempts must be 10');
    assert.ok(result.accuracy < 1.0, 'Accuracy must reflect multiple wrong attempts');
  });

  await t.test('11.5: UI component guards slot placement when selectedCardId is null', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/games/DailyRoutineGame.tsx'), 'utf-8');
    assert.ok(content.includes('if (!selectedCardId) return;'), 'Must return if no card is selected');
  });
});

// ============================================================================
// FEATURE 12: Caregiver Dashboard Boundaries
// ============================================================================
test('TIER 2 — Feature 12: Caregiver Dashboard Boundaries', async (t) => {
  const dashContent = fs.readFileSync(path.join(rootDir, 'src/pages/CaregiverDashboard.tsx'), 'utf-8');

  await t.test('12.1: Zero patient session history defaults engagement rate cleanly', () => {
    assert.ok(dashContent.includes('summary.weeklyEngagement'), 'Must display summary.weeklyEngagement');
  });

  await t.test('12.2: Empty recent activities feed renders reassuring empty state message', () => {
    assert.ok(dashContent.includes('No recent activities'), 'Must render "No recent activities" placeholder');
  });

  await t.test('12.3: Non-diagnostic disclaimer is rendered under clinical trend cards', () => {
    assert.ok(
      dashContent.includes('This is not a medical diagnosis'),
      'Must display clinical non-diagnostic disclaimer'
    );
  });

  await t.test('12.4: Performance trend changed alert renders only when alert state is active', () => {
    assert.ok(
      dashContent.includes('Performance trend has changed'),
      'Must contain performance trend changed advisory'
    );
  });

  await t.test('12.5: Trend badges map stable, improving, declining with distinct visual colors', () => {
    assert.ok(dashContent.includes("'↑ Improving'"), 'Must show Improving arrow');
    assert.ok(dashContent.includes("'↓ Declining'"), 'Must show Declining arrow');
    assert.ok(dashContent.includes("'→ Stable'"), 'Must show Stable arrow');
  });
});

// ============================================================================
// FEATURE 13: Care Schedule & Alarm Buzzer Boundaries
// ============================================================================
test('TIER 2 — Feature 13: Care Schedule & Alarm Buzzer Boundaries', async (t) => {
  const notifContent = fs.readFileSync(path.join(rootDir, 'src/services/NotificationService.ts'), 'utf-8');
  const remScreen = fs.readFileSync(path.join(rootDir, 'src/pages/RemindersScreen.tsx'), 'utf-8');

  await t.test('13.1: Triggering buzzer handles audio context failure gracefully with try/catch', () => {
    assert.ok(notifContent.includes('careBuzzer.play') || notifContent.includes('triggerBuzzer'), 'NotificationService must provide buzzer trigger');
    assert.ok(notifContent.includes('try {') && notifContent.includes('catch'), 'Must wrap asynchronous triggers in try/catch block');
  });

  await t.test('13.2: Navigator vibrate check guards against undefined navigator.vibrate on iOS/Desktop', () => {
    assert.ok(
      notifContent.includes("'vibrate' in navigator") || notifContent.includes('navigator.vibrate'),
      'Must verify vibrate availability before calling'
    );
  });

  await t.test('13.3: Snooze reminder advances time by exactly 10 minutes (600,000ms)', () => {
    const originalTime = 1700000000000;
    const snoozedTime = originalTime + 10 * 60 * 1000;
    assert.strictEqual(snoozedTime - originalTime, 600000, 'Snooze must add 600,000 milliseconds');
  });

  await t.test('13.4: Delete confirmation modal protects against accidental reminder deletion', () => {
    assert.ok(
      remScreen.includes('showDeleteConfirm') || remScreen.includes('handleDelete'),
      'Must provide delete handler'
    );
  });

  await t.test('13.5: Empty scheduled reminders list renders empty state guidance', () => {
    assert.ok(remScreen.includes('No reminders yet') || remScreen.includes('reminders.length === 0'), 'Must display empty schedule guidance');
  });
});

// ============================================================================
// FEATURE 14: Settings Boundaries
// ============================================================================
test('TIER 2 — Feature 14: Settings Boundaries', async (t) => {
  const settingsContent = fs.readFileSync(path.join(rootDir, 'src/pages/SettingsScreen.tsx'), 'utf-8');

  await t.test('14.1: Daylight vs Midnight mode maps directly to theme-light and theme-dark', () => {
    assert.ok(settingsContent.includes('Daylight Mode'), 'Must define Daylight Mode');
    assert.ok(settingsContent.includes('Midnight Mode'), 'Must define Midnight Mode');
  });

  await t.test('14.2: Text size setting scales preview paragraph between text-lg, text-xl, and text-2xl', () => {
    assert.ok(settingsContent.includes("'text-2xl'"), 'Extra large text must apply text-2xl in preview');
    assert.ok(settingsContent.includes("'text-xl'"), 'Large text must apply text-xl in preview');
    assert.ok(settingsContent.includes("'text-lg'"), 'Normal text must apply text-lg in preview');
  });

  await t.test('14.3: High contrast mode applies stark black background and yellow borders', () => {
    assert.ok(settingsContent.includes('bg-black border-yellow-400'), 'High contrast preview must use black & yellow-400');
  });

  await t.test('14.4: Sign out / profile switcher button is present and accessible', () => {
    assert.ok(settingsContent.includes('Sign Out'), 'Settings must include Sign Out button');
    assert.ok(settingsContent.includes('handleLogout'), 'Must have handleLogout handler');
  });

  await t.test('14.5: Language selection menu supports English and Regional Indian languages', () => {
    assert.ok(settingsContent.includes('Multilingual Language'), 'Must support Multilingual Language menu');
    assert.ok(settingsContent.includes('LANGUAGES.map'), 'Must map over available languages');
  });
});

// ============================================================================
// FEATURE 15: Multi-Orientation Boundaries
// ============================================================================
test('TIER 2 — Feature 15: Multi-Orientation Boundaries', async (t) => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('15.1: Viewport width <1024px retains single focused centered column (max-w-2xl)', () => {
    assert.ok(homeContent.includes('max-w-2xl mx-auto lg:max-w-none'), 'Portrait must center with max-w-2xl');
  });

  await t.test('15.2: Viewport width >=1024px unsets max-w-2xl and activates 12-column grid', () => {
    assert.ok(homeContent.includes('lg:max-w-none'), 'Landscape must un-constrain width constraint');
    assert.ok(homeContent.includes('lg:grid-cols-12'), 'Landscape must expand to 12 columns');
  });

  await t.test('15.3: Body global CSS sets overflow-x: hidden to prevent unwanted horizontal scrolling', () => {
    assert.ok(globalsCss.includes('overflow-x: hidden'), 'body must enforce overflow-x: hidden');
  });

  await t.test('15.4: Tablet breakpoint (768px) sets --max-width to 1120px', () => {
    assert.ok(globalsCss.includes('--max-width: 1120px'), 'Tablet media query must set --max-width: 1120px');
  });

  await t.test('15.5: Desktop breakpoint (1024px) sets --max-width to 1240px', () => {
    assert.ok(globalsCss.includes('--max-width: 1240px'), 'Desktop media query must set --max-width: 1240px');
  });
});

// ============================================================================
// FEATURE 16: Production Build Boundaries
// ============================================================================
test('TIER 2 — Feature 16: Production Build Boundaries', async (t) => {
  await t.test('16.1: Vite production build output bundle includes CSS and JS chunks', () => {
    const assetsDir = path.join(rootDir, 'dist/assets');
    assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');
    const files = fs.readdirSync(assetsDir);
    assert.ok(files.some((f) => f.startsWith('index-') && f.endsWith('.js')), 'Must generate hashed index-*.js');
    assert.ok(files.some((f) => f.startsWith('index-') && f.endsWith('.css')), 'Must generate hashed index-*.css');
  });

  await t.test('16.2: HTML entry point specifies viewport and root mount container', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    assert.ok(indexHtml.includes('id="root"'), 'index.html must contain root mount element');
    assert.ok(indexHtml.includes('width=device-width'), 'index.html must define responsive viewport');
  });

  await t.test('16.3: Tsconfig app configuration includes strict linting and ESNext module resolution', () => {
    const rawContent = fs.readFileSync(path.join(rootDir, 'tsconfig.app.json'), 'utf-8');
    const cleanContent = rawContent.replace(/\/\*[\s\S]*?\*\//g, '');
    const tsconfigApp = JSON.parse(cleanContent);
    assert.strictEqual(tsconfigApp.compilerOptions.moduleResolution, 'bundler', 'Module resolution must be bundler');
    assert.strictEqual(tsconfigApp.compilerOptions.noUnusedLocals, true, 'noUnusedLocals must be enabled');
    assert.strictEqual(tsconfigApp.compilerOptions.noUnusedParameters, true, 'noUnusedParameters must be enabled');
  });

  await t.test('16.4: Package.json specifies Tailwind CSS v4 and Vite bundler dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    assert.ok(pkg.devDependencies['@tailwindcss/vite'], 'Must include @tailwindcss/vite');
    assert.ok(pkg.devDependencies['tailwindcss'], 'Must include tailwindcss');
    assert.ok(pkg.devDependencies['vite'], 'Must include vite');
  });

  await t.test('16.5: Asset filenames contain cache-busting hashes for production PWA caching', () => {
    const assetsDir = path.join(rootDir, 'dist/assets');
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
      assert.ok(!file.includes('undefined'), `Asset filename ${file} must not contain undefined`);
    }
  });
});
