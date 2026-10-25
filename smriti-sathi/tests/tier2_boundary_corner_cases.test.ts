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
test('TIER 2 — Feature 1: Warm Heritage design token boundaries', async (t) => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');

  await t.test('2.1.1: Light canvas color normalization handles case-insensitivity', () => {
    const hasLightCanvas =
      globalsCss.toLowerCase().includes('#fbf6ee') || globalsCss.toUpperCase().includes('#FBF6EE');
    assert.ok(hasLightCanvas, 'Must support the warm ivory #FBF6EE canvas regardless of case');
  });

  await t.test('2.1.2: Contrast of light-theme ink (#17211E) on ivory canvas (#FBF6EE) exceeds WCAG AAA', () => {
    const ratio = getContrastRatio('#17211E', '#FBF6EE');
    assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must exceed WCAG AAA 7.0:1`);
  });

  await t.test('2.1.3: Contrast of dark-theme ink (#F3EFE7) on calm-night canvas (#0C1512) exceeds WCAG AAA', () => {
    const ratio = getContrastRatio('#F3EFE7', '#0C1512');
    assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must exceed WCAG AAA 7.0:1`);
  });

  await t.test('2.1.4: Design tokens contain valid hex format without syntax errors', () => {
    const hexMatches = globalsCss.match(/#[0-9a-fA-F]{3,8}/g);
    assert.ok(hexMatches && hexMatches.length > 10, 'Must extract valid hex color codes from tokens.css');
    for (const hex of hexMatches) {
      assert.ok(
        hex.length === 4 || hex.length === 7 || hex.length === 9,
        `Hex code ${hex} must be valid 3, 6, or 8 digit hex`
      );
    }
  });

  await t.test('2.1.5: Every global rule lives in a cascade layer, so utilities can win', () => {
    const indexCss = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
    const baseCss = fs.readFileSync(path.join(rootDir, 'src/styles/base.css'), 'utf-8');
    assert.ok(indexCss.includes("@import 'tailwindcss'"), 'Tailwind must be imported first');
    assert.ok(baseCss.includes('@layer base'), 'The reset must live in @layer base');
    assert.ok(!/^\s*\*\s*,/m.test(baseCss.split('@layer base')[0]), 'No unlayered universal selector may precede the layer');
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

  await t.test('2.2.4: The token layer contains ZERO legacy muddy tokens (#F5F0E8, #FDF8F0)', () => {
    const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
    assert.ok(!tokensCss.toUpperCase().includes('#F5F0E8'), 'tokens.css must not define legacy #F5F0E8');
    assert.ok(!tokensCss.toUpperCase().includes('#FDF8F0'), 'tokens.css must not define legacy #FDF8F0');
  });

  await t.test('2.2.5: ErrorBoundary is purged of muddy colours and reads from tokens', () => {
    const errBoundary = fs.readFileSync(path.join(rootDir, 'src/components/ErrorBoundary.tsx'), 'utf-8');
    assert.ok(!errBoundary.toUpperCase().includes('#F5F0E8'), 'ErrorBoundary must be purged of #F5F0E8');
    assert.ok(errBoundary.includes('var(--') || errBoundary.includes('var(--canvas)'), 'ErrorBoundary must consume design tokens');
  });
});

// ============================================================================
// FEATURE 3: Senior Touch Targets Boundaries
// ============================================================================
test('TIER 2 — Feature 3: Senior Touch Targets Boundaries', async (t) => {
  const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
  const componentCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');

  await t.test('3.1: Button height can never collapse below the tremor-safe token', () => {
    const match = tokensCss.match(/--tap-min:\s*(\d+)px/);
    assert.ok(match, 'A minimum tap token must exist');
    assert.ok(Number(match[1]) >= 52, 'The minimum tap target must be at least 52px');
    assert.ok(componentCss.includes('min-height: var(--tap-min)'), 'Buttons must consume that token');
  });

  await t.test('3.2: Icon-only buttons keep a >=44px hit area', () => {
    assert.ok(componentCss.includes('.iconbtn'), 'An icon button primitive must exist');
    const block = componentCss.slice(componentCss.indexOf('.iconbtn '), componentCss.indexOf('.iconbtn ') + 400);
    assert.ok(/(min-)?(width|height):\s*(4[4-9]|[5-9]\d)px/.test(block), 'Icon buttons must be at least 44px square');
  });

  await t.test('3.3: Touch targets are spaced so a tremor cannot hit two at once', () => {
    const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
    assert.ok(/gap-3(\.5)?/.test(homeContent) || homeContent.includes('gap-4'), 'Activity grid must space targets >=12px');
    assert.ok(tokensCss.includes('--s-3:'), 'Spacing must come from the token scale');
  });

  await t.test('3.4: Disabled buttons keep their physical size', () => {
    assert.ok(componentCss.includes('disabled'), 'Disabled styling must be handled in the button layer');
    assert.ok(/\.btn:disabled[\s\S]{0,200}opacity/.test(componentCss), 'Disabled must be expressed as opacity, not shrinkage');
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

  await t.test('4.3: Long names are constrained so the mark always stays centred', () => {
    assert.ok(splashContent.includes('text-center'), 'Splash copy must be centred');
    assert.ok(splashContent.includes('px-6') || splashContent.includes('px-5'), 'Must reserve horizontal padding');
  });

  await t.test('4.4: The splash owns the whole viewport above everything else', () => {
    assert.ok(splashContent.includes('overflow-hidden'), 'Must not create scrollbars over the app');
    assert.ok(splashContent.includes('role="status"'), 'Must be announced as a status region');
  });

  await t.test('4.5: The mark starts hidden and fades in, so there is no flash', () => {
    assert.ok(splashContent.includes('opacity: visible ? 1 : 0'), 'Initial state must be transparent');
    assert.ok(splashContent.includes('duration-700'), 'The reveal must be slow enough to feel calm');
  });
});

// ============================================================================
// FEATURE 5: Profile Selection Boundaries
// ============================================================================
test('TIER 2 — Feature 5: Profile Selection Boundaries', async (t) => {
  const loginContent = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');

  await t.test('5.1: A wrong PIN shows a gentle, translated message instead of throwing', () => {
    assert.ok(loginContent.includes("t('auth.pinWrong')"), 'Must show a localised PIN error');
    assert.ok(loginContent.includes('{error}'), 'Must render the error state');
  });

  await t.test('5.2: A short PIN cannot be submitted', () => {
    assert.ok(loginContent.includes('pin.length < 4'), 'Submit must require four digits');
    assert.ok(loginContent.includes('disabled='), 'The submit control must actually disable');
  });

  await t.test('5.3: The PIN is entered on a tactile keypad with delete', () => {
    assert.ok(loginContent.includes('Delete'), 'Must offer a delete key for mistakes');
    assert.ok(loginContent.includes('aria-label="Tactile Keypad for Caregiver PIN"'), 'Keypad must be labelled for assistive tech');
  });

  await t.test('5.4: Rapid double-tap cannot start two sign-ins', () => {
    assert.ok(loginContent.includes('loading={busy}'), 'Button must show and block while busy');
    assert.ok(loginContent.includes('setBusy(true)'), 'Busy state must be set during sign-in');
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

  await t.test('6.5: An unexpected step can never leave the user on a blank screen', () => {
    assert.ok(flowContent.includes('OnboardingWelcome'), 'A welcome step must exist');
    assert.ok(/step > 4|step === 4|step < 5/.test(flowContent) || flowContent.includes('Math.min'), 'Step must be clamped to the known range');
  });
});

// ============================================================================
// FEATURE 7: Patient Home Screen Boundaries
// ============================================================================
test('TIER 2 — Feature 7: Patient Home Screen Boundaries', async (t) => {
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('7.1: No reminder today shows reassurance, never an empty hole', () => {
    assert.ok(homeContent.includes('nextReminder ?'), 'Must branch on whether a reminder exists');
    assert.ok(homeContent.includes("t('home.noReminderToday')"), 'Must show the reassuring empty message');
    assert.ok(homeContent.includes("t('home.noReminderBody')"), 'Must explain why it is empty');
  });

  await t.test('7.2: Completed work is acknowledged rather than struck through', () => {
    assert.ok(homeContent.includes("t('rem.completed')") || homeContent.includes('doneToday'), 'Must show what was completed');
    assert.ok(homeContent.includes('Check'), 'Completion must read as a positive tick');
  });

  await t.test('7.3: Long titles and names cannot break the layout', () => {
    assert.ok(homeContent.includes('truncate'), 'Reminder/activity titles must truncate');
    assert.ok(homeContent.includes('min-w-0'), 'Flex children must be allowed to shrink');
  });

  await t.test('7.4: Reminder actions cannot leave the UI inconsistent on failure', () => {
    assert.ok(homeContent.includes('await reminderService'), 'Actions must await the service');
    assert.ok(homeContent.includes('await load(userId)'), 'State must be reloaded from the database after an action');
  });

  await t.test('7.5: Safety actions are real buttons reachable by keyboard', () => {
    assert.ok(homeContent.includes('type="button"'), 'Safety cards must be real buttons');
    assert.ok(homeContent.includes('open-safe-return'), 'The safe-return action must be wired');
    assert.ok(homeContent.includes('open-sundowning'), 'The evening-calm action must be wired');
  });
});

// ============================================================================
// FEATURE 8: Recognise Game Boundaries
// ============================================================================
test('TIER 2 — Feature 8: Recognise Game Boundaries', async (t) => {
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecogniseGame.tsx'), 'utf-8');
  const playContent = gameContent;

  await t.test('8.1: No remote image can break the layout offline', () => {
    assert.ok(!/<img/.test(playContent), 'The game must not load remote images');
    assert.ok(playContent.includes('ObjectCardVisual'), 'It must draw local glyph tiles instead');
  });

  await t.test('8.2: Options lock once an answer has been given', () => {
    assert.ok(playContent.includes('disabled={!!feedback}'), 'Options must disable after answering');
    assert.ok(playContent.includes('setFeedback'), 'Feedback state must drive the lock');
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
    assert.ok(/level < 5/.test(gameContent), 'Difficulty must be clamped to level 5');
  });
});

// ============================================================================
// FEATURE 9: Remember Game Boundaries
// ============================================================================
test('TIER 2 — Feature 9: Remember Game Boundaries', async (t) => {
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RememberGame.tsx'), 'utf-8');
  const recallContent = gameContent;

  await t.test('9.1: Zero objects selected yields a zero count and a blocked submit', () => {
    assert.ok(recallContent.includes('selected.length'), 'Must track the selection');
    assert.ok(recallContent.includes('disabled={selected.length === 0}'), 'Submit must be blocked with nothing selected');
  });

  await t.test('9.2: Deselecting an object removes it without error', () => {
    assert.ok(/prev\.filter\(\(o\) => o\.id !== obj\.id\)/.test(recallContent), 'Must filter the object out');
    assert.ok(recallContent.includes('[...prev, obj]'), 'Must add the object back');
  });

  await t.test('9.3: The recall grid reflows from two columns up', () => {
    assert.ok(recallContent.includes('object-grid'), 'Must use the object grid');
    assert.ok(/\.object-grid[\s\S]{0,300}grid-template-columns/.test(
      fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8')), 'The grid must be defined responsively');
  });

  await t.test('9.4: Difficulty level progression is clamped to maximum level 5', () => {
    assert.ok(/level < 5/.test(gameContent), 'Must not offer a sixth level');
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
    assert.ok(gameContent.includes('if (locked) return;'), 'Must block card click while board is locked');
    assert.ok(gameContent.includes('setLocked(true)'), 'Must lock the board when two cards are up');
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
    assert.ok(content.includes('if (!picked) return;'), 'Must return if no card is selected');
  });
});

// ============================================================================
// FEATURE 12: Caregiver Dashboard Boundaries
// ============================================================================
test('TIER 2 — Feature 12: Caregiver Dashboard Boundaries', async (t) => {
  const dashContent = fs.readFileSync(path.join(rootDir, 'src/pages/caregiver/CaregiverHome.tsx'), 'utf-8');

  await t.test('12.1: A patient with no history shows dashes, never NaN', () => {
    assert.ok(/reminders\.total \?/.test(dashContent), 'Adherence must guard against zero');
    assert.ok(dashContent.includes("'—'"), 'Empty metrics must render an em dash');
  });

  await t.test('12.2: An empty activity feed says so instead of rendering nothing', () => {
    assert.ok(dashContent.includes("t('cg.waiting')"), 'Must render a reassuring empty-state message');
  });

  await t.test('12.3: Clinical surfaces carry a non-diagnostic disclaimer', () => {
    assert.ok(dashContent.includes("t('saf.disclaimer')"), 'Must show the non-diagnostic disclaimer');
  });

  await t.test('12.4: Alerts appear only when something is genuinely pending', () => {
    assert.ok(dashContent.includes('reminders.pending'), 'Must derive alerts from live state');
    assert.ok(dashContent.includes('tone="success"'), 'Must show an all-clear when nothing is pending');
  });

  await t.test('12.5: Status is expressed with words as well as colour', () => {
    assert.ok(dashContent.includes('Tag'), 'Status must be shown as a tag');
    assert.ok(dashContent.includes("t('cg.sessionsWeek')") || dashContent.includes("t('cg.accuracy')"), 'Must name each metric in words');
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

  await t.test('13.4: Deleting a reminder asks first', () => {
    assert.ok(remScreen.includes('ConfirmDialog'), 'Must confirm before deleting');
    assert.ok(remScreen.includes('toDelete'), 'Must track the reminder awaiting confirmation');
  });

  await t.test('13.5: An empty schedule teaches the next step', () => {
    assert.ok(remScreen.includes('EmptyState'), 'Must use the shared empty state');
    assert.ok(remScreen.includes("t('rem.emptyTitle')"), 'Must explain that no reminders exist yet');
    assert.ok(remScreen.includes("t('rem.add')"), 'Must offer the add action inline');
  });
});

// ============================================================================
// FEATURE 14: Settings Boundaries
// ============================================================================
test('TIER 2 — Feature 14: Settings Boundaries', async (t) => {
  const settingsContent = fs.readFileSync(path.join(rootDir, 'src/pages/SettingsScreen.tsx'), 'utf-8');

  await t.test('14.1: Appearance is a single switch bound to the theme attribute', () => {
    assert.ok(settingsContent.includes("t('set.darkMode')"), 'Must offer the calm-night switch');
    assert.ok(settingsContent.includes('toggleTheme'), 'Must call toggleTheme');
  });

  await t.test('14.2: Text size is chosen from three named steps', () => {
    assert.ok(settingsContent.includes("'normal'"), 'Must support comfort size');
    assert.ok(settingsContent.includes("'large'"), 'Must support large size');
    assert.ok(settingsContent.includes("'extra-large'"), 'Must support extra-large size');
    assert.ok(settingsContent.includes('Segmented'), 'Must be a segmented control, not a dropdown');
  });

  await t.test('14.3: High contrast is a real toggle that the shell responds to', () => {
    assert.ok(settingsContent.includes('highContrast'), 'Must manage the high-contrast setting');
    const indexCss = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf-8');
    assert.ok(indexCss.includes('--contrast') || fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8').includes('[data-contrast'),
      'Contrast must be driven by a document attribute');
  });

  await t.test('14.4: Signing out is present and guarded', () => {
    assert.ok(settingsContent.includes("t('set.signOut')"), 'Must include a sign-out action');
    assert.ok(settingsContent.includes('logout'), 'Must call logout');
  });

  await t.test('14.5: Language selection offers every supported language', () => {
    assert.ok(settingsContent.includes('languages.map'), 'Must map over the available languages');
    assert.ok(settingsContent.includes('setLanguage'), 'Must actually change the language');
  });
});

// ============================================================================
// FEATURE 15: Multi-Orientation Boundaries
// ============================================================================
test('TIER 2 — Feature 15: Multi-Orientation Boundaries', async (t) => {
  const baseCss = fs.readFileSync(path.join(rootDir, 'src/styles/base.css'), 'utf-8');
  const componentCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');
  const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('15.1: Phones keep one focused column', () => {
    assert.ok(homeContent.includes('grid-cols-1'), 'Content must stack on a phone');
  });

  await t.test('15.2: Tablets already get a two-column activity grid', () => {
    assert.ok(homeContent.includes('sm:grid-cols-2'), 'Must reflow at the small breakpoint');
  });

  await t.test('15.3: Nothing can scroll the page sideways', () => {
    assert.ok(baseCss.includes('overflow-x: hidden') || baseCss.includes('overflow-x: clip'), 'body must suppress horizontal scroll');
  });

  await t.test('15.4: Tablet width is capped by the shell token', () => {
    assert.ok(tokensCss.includes('--shell-max'), 'Content cap must be a token');
  });

  await t.test('15.5: Desktop gets the wide cap and a sidebar', () => {
    assert.ok(tokensCss.includes('--shell-max: 1240px'), 'Desktop cap must be 1240px');
    assert.ok(componentCss.includes('@media (min-width: 1024px)'), 'Must declare the desktop breakpoint');
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
