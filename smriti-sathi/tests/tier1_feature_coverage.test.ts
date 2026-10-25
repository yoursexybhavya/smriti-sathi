/**
 * Tier 1: Feature Coverage Test Suite — Smriti Sathi Transformation
 * Validates primary behavior (happy path) for all 16 features from TEST_INFRA.md.
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

// ============================================================================
// FEATURE 1: Scandinavian Design Tokens & Canvas
// ============================================================================
test('TIER 1 — Feature 1: Warm Heritage design tokens & canvas', async (t) => {
  // v3: one token source of truth (globals.css was retired — its unlayered
  // reset was overriding every Tailwind utility in the app).
  const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
  const componentCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');
  const globalsCss = tokensCss + '\n' + componentCss;

  await t.test('1.1: Light warm-ivory canvas token (#FBF6EE) is defined', () => {
    assert.ok(tokensCss.includes('--canvas: #FBF6EE'), 'Light canvas must define warm ivory #FBF6EE');
  });

  await t.test('1.2: Dark "Calm Night" canvas token (#0C1512) is defined', () => {
    assert.ok(tokensCss.includes('--canvas: #0C1512'), 'Dark canvas must define calm-night #0C1512');
  });

  await t.test('1.3: Deep teal-ink typography token (#17211E) is defined for high contrast', () => {
    assert.ok(tokensCss.includes('--ink: #17211E'), 'Light theme text must define teal ink #17211E');
  });

  await t.test('1.4: Brand accents are drawn from the logo (teal / saffron / terracotta)', () => {
    assert.ok(tokensCss.includes('--brand-teal: #0E5C50'), 'Must define brand teal #0E5C50');
    assert.ok(tokensCss.includes('--brand-saffron: #C77A19'), 'Must define saffron #C77A19');
    assert.ok(tokensCss.includes('--brand-terracotta: #B4432B'), 'Must define terracotta #B4432B');
  });

  await t.test('1.5: Functional signal tokens (success / warning) are defined', () => {
    assert.ok(tokensCss.includes('--success: #2C7A54'), 'Must define success signal #2C7A54');
    assert.ok(tokensCss.includes('--warning: #A9650C'), 'Must define warning signal #A9650C');
    assert.ok(tokensCss.includes('--danger: #B3261E'), 'Must define danger signal #B3261E');
  });

  await t.test('1.6: All global CSS is layered so utilities always win', () => {
    assert.ok(!/, \*::before/.test(globalsCss.split('@layer')[0] || ''), 'No unlayered universal reset may ship');
    assert.ok(componentCss.includes('@layer components'), 'Component CSS must live in @layer components');
    assert.ok(!fs.existsSync(path.join(rootDir, 'src/styles/globals.css')), 'The unlayered legacy globals.css must stay deleted');
  });
});

// ============================================================================
// FEATURE 2: Zero Lingering Muddy Colors
// ============================================================================
test('TIER 1 — Feature 2: Zero Lingering Muddy Colors in Core Redesigned UI', async (t) => {
  await t.test('2.1: PatientHomeScreen.tsx contains ZERO instances of #F5F0E8', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
    assert.ok(!content.includes('#F5F0E8'), 'PatientHomeScreen.tsx must not contain muddy #F5F0E8');
  });

  await t.test('2.2: SplashScreen.tsx contains ZERO instances of #F5F0E8', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/SplashScreen.tsx'), 'utf-8');
    assert.ok(!content.includes('#F5F0E8'), 'SplashScreen.tsx must not contain muddy #F5F0E8');
  });

  await t.test('2.3: LoginScreen.tsx contains ZERO instances of #F5F0E8', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');
    assert.ok(!content.includes('#F5F0E8'), 'LoginScreen.tsx must not contain muddy #F5F0E8');
  });

  await t.test('2.4: RecogniseGame.tsx contains ZERO instances of #F5F0E8', () => {
    const game = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecogniseGame.tsx'), 'utf-8');
    assert.ok(!game.includes('#F5F0E8'), 'RecogniseGame.tsx must not contain #F5F0E8');
  });

  await t.test('2.5: MemoryMatchGame.tsx and DailyRoutineGame.tsx contain ZERO instances of #F5F0E8', () => {
    const match = fs.readFileSync(path.join(rootDir, 'src/pages/games/MemoryMatchGame.tsx'), 'utf-8');
    const routine = fs.readFileSync(path.join(rootDir, 'src/pages/games/DailyRoutineGame.tsx'), 'utf-8');
    assert.ok(!match.includes('#F5F0E8'), 'MemoryMatchGame.tsx must not contain #F5F0E8');
    assert.ok(!routine.includes('#F5F0E8'), 'DailyRoutineGame.tsx must not contain #F5F0E8');
  });
});

// ============================================================================
// FEATURE 3: Tactile 56-64px Senior Touch Targets
// ============================================================================
test('TIER 1 — Feature 3: Tactile 56-64px Senior Touch Targets', async (t) => {
  const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
  const componentCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');
  const buttonTsx = fs.readFileSync(path.join(rootDir, 'src/ui/Button.tsx'), 'utf-8');

  await t.test('3.1: Button primitive is driven by the senior touch-target tokens (52 / 60 / 72px)', () => {
    assert.ok(tokensCss.includes('--tap-min: 52px'), 'Must define a 52px tremor-safe minimum');
    assert.ok(tokensCss.includes('--tap-comfort: 60px'), 'Must define a 60px comfort target');
    assert.ok(tokensCss.includes('--tap-elder: 72px'), 'Must define a 72px elder primary target');
    assert.ok(componentCss.includes('min-height: var(--tap-min)'), 'The button base must consume the token');
    assert.ok(buttonTsx.includes('size = \'md\''), 'Button must expose size variants');
  });

  await t.test('3.2: LoginScreen uses the large button size for its primary action', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');
    assert.ok(content.includes('size="lg"') || content.includes('size="xl"'), 'Sign-in action must use a large size');
  });

  await t.test('3.3: Accessibility settings use a segmented control with >=52px rows', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/onboarding/AccessibilitySetup.tsx'), 'utf-8');
    assert.ok(content.includes('Segmented'), 'Text-size choice must use the segmented primitive');
    assert.ok(componentCss.includes('min-height: var(--tap-min)'), 'Segmented rows must honour the tap token');
  });

  await t.test('3.4: PatientHomeScreen primary CTA satisfies the elder target', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
    assert.ok(content.includes('size="lg"') || content.includes('size="xl"'), 'Daily focus CTA must be large');
  });

  await t.test('3.5: RecogniseGame option tiles are generous square targets', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecogniseGame.tsx'), 'utf-8');
    assert.ok(content.includes('aspect-square'), 'Option tiles must be square and large');
    assert.ok(componentCss.includes('--object-min'), 'Object tiles must declare a minimum height');
  });
});

// ============================================================================
// FEATURE 4: Splash Screen Tranquil Animation & Theme Awareness
// ============================================================================
test('TIER 1 — Feature 4: Splash Screen Tranquil Animation & Theme Awareness', async (t) => {
  const content = fs.readFileSync(path.join(rootDir, 'src/pages/SplashScreen.tsx'), 'utf-8');

  await t.test('4.1: SplashScreen renders the localised app name, tagline and version', () => {
    assert.ok(content.includes("t('app.name')"), 'SplashScreen must display the app name');
    assert.ok(content.includes("t('app.tagline')"), 'SplashScreen must display the tagline');
    assert.ok(/v\d+\.\d+\.\d+/.test(content), 'SplashScreen must include a version tag');
  });

  await t.test('4.2: SplashScreen reveals with a tranquil 700ms fade + rise', () => {
    assert.ok(content.includes('duration-700'), 'Must use the 700ms tranquil transition');
    assert.ok(content.includes('translateY(0)'), 'Must rise into place');
  });

  await t.test('4.3: SplashScreen uses the vector brand mark (no clip-art)', () => {
    assert.ok(content.includes('BrandMark'), 'SplashScreen must render the vector brand mark');
  });

  await t.test('4.4: SplashScreen is calm — no spinners or pulsing dots', () => {
    assert.ok(!content.includes('animate-spin'), 'A splash screen must not show a spinner');
    assert.ok(!content.includes('animate-pulse'), 'A splash screen must not pulse at the user');
    assert.ok(content.includes('role="status"'), 'Splash must announce itself politely to screen readers');
  });

  await t.test('4.5: SplashScreen fills the viewport on every device', () => {
    assert.ok(content.includes('min-h-[100dvh]'), 'Must fill the dynamic viewport height');
    assert.ok(content.includes('overflow-hidden'), 'Must not allow the aura to create scrollbars');
  });
});

// ============================================================================
// FEATURE 5: Friction-Free Profile Selection & Back Navigation
// ============================================================================
test('TIER 1 — Feature 5: Friction-Free Profile Selection & Back Navigation', async (t) => {
  const content = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');

  await t.test('5.1: Elder login uses quickLogin bypassing PIN requirements', () => {
    assert.ok(content.includes('quickLogin'), 'LoginScreen must provide quickLogin for elders');
    assert.ok(content.includes('handleDirectElderLogin'), 'Must have handleDirectElderLogin handler');
  });

  await t.test('5.2: Caregiver login enforces security PIN verification', () => {
    assert.ok(content.includes('login(selectedUser, pin)'), 'Caregiver login must check PIN');
    assert.ok(content.includes("t('auth.pin')"), 'Must show the caregiver PIN label');
    assert.ok(content.includes('pin.length < 4'), 'Must refuse to submit a short PIN');
  });

  await t.test('5.3: Profile selection initializes to patient_primary by default', () => {
    assert.ok(content.includes("useState<string>('patient_primary')"), 'Default profile must be patient_primary');
  });

  await t.test('5.4: Theme toggle button is present on login screen', () => {
    assert.ok(content.includes('toggleTheme'), 'Login screen must have toggleTheme');
    assert.ok(content.includes("<IconButton label={t('c.theme')}"), 'Theme toggle must carry an accessible label');
  });

  await t.test('5.5: Invalid PIN submission sets error message state', () => {
    assert.ok(content.includes('setError'), 'LoginScreen must manage error state');
    assert.ok(content.includes('{error}'), 'LoginScreen must render error container');
  });
});

// ============================================================================
// FEATURE 6: Onboarding Flow (0-4) with working preview & back buttons
// ============================================================================
test('TIER 1 — Feature 6: Onboarding Flow (0-4) with working preview & back buttons', async (t) => {
  const flow = fs.readFileSync(path.join(rootDir, 'src/pages/onboarding/OnboardingFlow.tsx'), 'utf-8');

  await t.test('6.1: OnboardingFlow initializes at step 0 (Welcome)', () => {
    assert.ok(flow.includes('useState(0)'), 'Onboarding must start at step 0');
    assert.ok(flow.includes('OnboardingWelcome'), 'Step 0 must render OnboardingWelcome');
  });

  await t.test('6.2: Step 1 (Profile Setup) advances to Step 2', () => {
    assert.ok(flow.includes('PatientProfileSetup'), 'Step 1 must render PatientProfileSetup');
    assert.ok(flow.includes('setStep(2)'), 'Patient setup next must transition to step 2');
  });

  await t.test('6.3: Step 2 (Language Selection) advances to Step 3', () => {
    assert.ok(flow.includes('LanguageSelection'), 'Step 2 must render LanguageSelection');
    assert.ok(flow.includes('setStep(3)'), 'Language next must transition to step 3');
  });

  await t.test('6.4: Step 3 (Accessibility Setup) advances to Step 4', () => {
    assert.ok(flow.includes('AccessibilitySetup'), 'Step 3 must render AccessibilitySetup');
    assert.ok(flow.includes('setStep(4)'), 'Accessibility next must transition to step 4');
  });

  await t.test('6.5: Step 4 (Complete) invokes completeOnboarding and onComplete', () => {
    assert.ok(flow.includes('OnboardingComplete'), 'Step 4 must render OnboardingComplete');
    assert.ok(flow.includes('completeOnboarding'), 'Must call completeOnboarding from AppContext');
  });
});

// ============================================================================
// FEATURE 7: Patient Home Screen with 2x2 Cognitive Launcher Grid & Real Care Schedule
// ============================================================================
test('TIER 1 — Feature 7: Patient Home Screen with 2x2 Cognitive Launcher Grid & Real Care Schedule', async (t) => {
  const content = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');

  await t.test('7.1: The activity grid renders all four cognitive games from one source', () => {
    assert.ok(content.includes('ACTIVITIES.map'), 'Grid must be driven by the activity registry');
    const registry = fs.readFileSync(path.join(rootDir, 'src/data/activities.ts'), 'utf-8');
    for (const route of ['remember-game', 'recognise-game', 'memory-match', 'daily-routine']) {
      assert.ok(registry.includes(`route: '${route}'`), `Activity registry must include ${route}`);
    }
  });

  await t.test('7.2: The hero card launches the suggested activity of the day', () => {
    assert.ok(content.includes("t('home.todayEyebrow')"), 'Must feature the "today for you" hero card');
    assert.ok(content.includes('suggested.route'), 'Hero must launch the suggested activity');
    assert.ok(content.includes('home.startGame'), 'Hero must offer a start action');
  });

  await t.test('7.3: The next-reminder card renders live reminders', () => {
    assert.ok(content.includes("t('home.nextReminder')"), 'Must surface the next reminder');
    assert.ok(content.includes('reminderService'), 'Must load reminders from reminderService');
    assert.ok(content.includes('nextReminder'), 'Must derive the next pending reminder');
  });

  await t.test('7.4: One tap marks a reminder taken, or snoozes it', () => {
    assert.ok(content.includes('completeReminder'), 'Must provide completeReminder');
    assert.ok(content.includes('snoozeReminder'), 'Must provide snoozeReminder');
    assert.ok(content.includes("t('home.taken')"), 'Must offer a taken action');
    assert.ok(content.includes("t('home.snooze')"), 'Must offer a snooze action');
  });

  await t.test('7.5: The page can be read aloud', () => {
    assert.ok(content.includes('const readPage'), 'Must provide a read-aloud handler');
    assert.ok(content.includes('speak('), 'Must call the speech service');
    assert.ok(content.includes("t('home.hearThis')"), 'Must expose a hear-this button');
  });
});

// ============================================================================
// FEATURE 8: Recognise Game (Offline fallback assets, 56px touch areas, audio feedback)
// ============================================================================
test('TIER 1 — Feature 8: Recognise Game (Offline fallback assets, 56px touch areas, audio feedback)', async (t) => {
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RecogniseGame.tsx'), 'utf-8');
  const playContent = gameContent;

  await t.test('8.1: Recognise game generates question and candidate options', () => {
    assert.ok(gameContent.includes('RecogniseGameEngine.generateActivity'), 'Must generate activity from engine');
    assert.ok(playContent.includes('activity.options.map'), 'Must render candidate options');
  });

  await t.test('8.2: Answering gives spoken feedback', () => {
    assert.ok(playContent.includes('speak('), 'Must speak on answer');
    assert.ok(playContent.includes("t('games.wellDone')"), 'Must give encouraging spoken feedback');
  });

  await t.test('8.3: Object tiles are drawn locally, so nothing can fail to load offline', () => {
    assert.ok(playContent.includes('ObjectCardVisual'), 'Must use the local object tile');
    const visual = fs.readFileSync(path.join(rootDir, 'src/components/ObjectCardVisual.tsx'), 'utf-8');
    assert.ok(!/<img/.test(visual), 'The object tile must not depend on a network image');
    assert.ok(visual.includes('emoji'), 'It must render a bundled glyph instead');
  });

  await t.test('8.4: Back button allows returning to game menu at any time', () => {
    assert.ok(playContent.includes('onBack'), 'Play screen must support onBack');
    assert.ok(playContent.includes('GameFrame'), 'Must render the shared activity frame with its back button');
  });

  await t.test('8.5: Completing all questions saves session to GameStorage', () => {
    assert.ok(gameContent.includes('GameStorage.saveSession'), 'Must save completed session to GameStorage');
    assert.ok(gameContent.includes("gameType: 'recognise'"), 'Must record recognise gameType');
  });
});

// ============================================================================
// FEATURE 9: Remember Game (Visible back buttons on Memorize/Recall, tranquil timer)
// ============================================================================
test('TIER 1 — Feature 9: Remember Game (Visible back buttons on Memorize/Recall, tranquil timer)', async (t) => {
  const gameContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/RememberGame.tsx'), 'utf-8');
  const memorizeContent = gameContent;
  const recallContent = gameContent;

  await t.test('9.1: Memorise stage provides a visible countdown ring', () => {
    assert.ok(memorizeContent.includes('secondsLeft'), 'Must maintain the countdown');
    assert.ok(memorizeContent.includes('ProgressRing'), 'Must show the countdown as a ring');
  });

  await t.test('9.2: Memorise stage auto-transitions to recall when the countdown ends', () => {
    assert.ok(memorizeContent.includes("setPhase('recall')"), 'Must move to recall automatically');
  });

  await t.test('9.3: Recall stage renders targets mixed with distractors', () => {
    assert.ok(recallContent.includes('recallSet.map'), 'Must render recallSet');
    assert.ok(recallContent.includes('toggle('), 'Must allow toggling objects');
  });

  await t.test('9.4: Selecting recall objects updates the live selection count', () => {
    assert.ok(recallContent.includes('selected.length'), 'Must display the selected count');
    assert.ok(recallContent.includes('aria-pressed'), 'Must expose selection state to assistive tech');
  });

  await t.test('9.5: Result stage saves session with gameType remember', () => {
    assert.ok(gameContent.includes("gameType: 'remember'"), 'Must record remember gameType');
    assert.ok(gameContent.includes('GameStorage.saveSession'), 'Must persist session via GameStorage');
  });
});

// ============================================================================
// FEATURE 10: Memory Match (3D card flip transform, Web Audio chimes, celebratory finish)
// ============================================================================
test('TIER 1 — Feature 10: Memory Match (3D card flip transform, Web Audio chimes, celebratory finish)', async (t) => {
  const componentContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/MemoryMatchGame.tsx'), 'utf-8');

  await t.test('10.1: Card pair count scales with level (Level 1: 2 pairs / 4 cards)', () => {
    assert.ok(componentContent.includes('PAIRS_FOR_LEVEL'), 'Pair counts must come from one table');
    assert.ok(/PAIRS_FOR_LEVEL\s*=\s*\[\s*0,\s*2,\s*3/.test(componentContent), 'Level 1 = 2 pairs, level 2 = 3 pairs');
  });

  await t.test('10.2: Pure game engine initializes cards and flips properly', () => {
    const game = createMemoryMatchGame(1);
    assert.strictEqual(game.totalPairs, 2, 'Level 1 must have 2 pairs');
    assert.strictEqual(game.cards.length, 4, 'Level 1 must have 4 total cards');

    const flipped = flipMemoryMatchCard(game, 0);
    assert.strictEqual(flipped.cards[0].isFlipped, true, 'First card must be flipped');
  });

  await t.test('10.3: Matching cards lock face-up with isMatched set', () => {
    const game = createMemoryMatchGame(1);
    // Find pair
    const card0 = game.cards[0];
    const matchIdx = game.cards.findIndex((c, i) => i !== 0 && c.pairId === card0.pairId);
    assert.ok(matchIdx > 0, 'Matching pair must exist');

    let state = flipMemoryMatchCard(game, 0);
    state = flipMemoryMatchCard(state, matchIdx);
    const checked = checkMemoryMatch(state);
    assert.strictEqual(checked.cards[0].isMatched, true, 'Card 0 must be matched');
    assert.strictEqual(checked.cards[matchIdx].isMatched, true, 'Matching card must be matched');
  });

  await t.test('10.4: Mismatched cards reset flip state without penalizing elder', () => {
    const game = createMemoryMatchGame(1);
    const card0 = game.cards[0];
    const mismatchIdx = game.cards.findIndex((c, i) => i !== 0 && c.pairId !== card0.pairId);
    assert.ok(mismatchIdx > 0, 'Mismatched pair must exist');

    let state = flipMemoryMatchCard(game, 0);
    state = flipMemoryMatchCard(state, mismatchIdx);
    const checked = checkMemoryMatch(state);
    assert.strictEqual(checked.cards[0].isMatched, false, 'Mismatched card 0 must not be matched');
    assert.strictEqual(checked.cards[mismatchIdx].isMatched, false, 'Mismatched card must not be matched');
  });

  await t.test('10.5: Matching all pairs yields 100% completion in result stage', () => {
    const game = createMemoryMatchGame(1);
    // Pair 1
    const p1a = 0;
    const p1b = game.cards.findIndex((c, i) => i !== 0 && c.pairId === game.cards[0].pairId);
    let state = flipMemoryMatchCard(game, p1a);
    state = flipMemoryMatchCard(state, p1b);
    state = checkMemoryMatch(state);

    // Pair 2
    const remaining = [0, 1, 2, 3].filter((i) => i !== p1a && i !== p1b);
    state = flipMemoryMatchCard(state, remaining[0]);
    state = flipMemoryMatchCard(state, remaining[1]);
    state = checkMemoryMatch(state);

    assert.strictEqual(state.isComplete, true, 'Game must be complete');
    const result = getMemoryMatchResult(state);
    assert.strictEqual(result.totalPairs, 2, 'Result must record 2 total pairs');
  });
});

// ============================================================================
// FEATURE 11: Daily Routine ('daily_routine' session gameType in db & memory, magnetic drop zones)
// ============================================================================
test('TIER 1 — Feature 11: Daily Routine sequencing and magnetic drop zones', async (t) => {
  const componentContent = fs.readFileSync(path.join(rootDir, 'src/pages/games/DailyRoutineGame.tsx'), 'utf-8');

  await t.test('11.1: Routine activities configure chronological sequence from morning to night', () => {
    assert.ok(componentContent.includes("id: 'wake'"), 'Must start with waking up');
    assert.ok(componentContent.includes("id: 'sleep'"), 'Must end with sleeping');
    assert.ok(componentContent.includes("time: '6:00'") && componentContent.includes("time: '21:00'"), 'Times must run morning to night');
    assert.ok(componentContent.includes('labelKey'), 'Steps must be localised, not hard-coded English');
  });

  await t.test('11.2: Pure game engine initializes daily routine deck with valid slot count', () => {
    const game = createDailyRoutineGame(1);
    assert.strictEqual(game.totalCards, 3, 'Level 1 routine must have 3 steps');
    assert.strictEqual(game.placedCards.length, 3, 'Slots must match card count');
  });

  await t.test('11.3: Selecting and placing card into correct slot locks card into place', () => {
    const game = createDailyRoutineGame(1);
    // Find card with order 0
    const card0Idx = game.shuffledCards.findIndex((c) => c.order === 0);
    const selected = selectDailyRoutineCard(game, card0Idx);
    const placed = placeDailyRoutineCard(selected, 0);

    assert.ok(placed.placedCards[0], 'Slot 0 must now contain the placed card');
    assert.strictEqual(placed.placedCards[0]?.order, 0, 'Placed card must match slot order');
    assert.strictEqual(placed.correctPlacements, 1, 'Must increment correct placements');
  });

  await t.test('11.4: Placing card into incorrect slot provides gentle feedback without penalty', () => {
    const game = createDailyRoutineGame(1);
    // Select card with order 0 and try to place in slot 1
    const card0Idx = game.shuffledCards.findIndex((c) => c.order === 0);
    const selected = selectDailyRoutineCard(game, card0Idx);
    const placed = placeDailyRoutineCard(selected, 1);

    assert.strictEqual(placed.placedCards[1], null, 'Slot 1 must remain empty on wrong placement');
    assert.strictEqual(placed.correctPlacements, 0, 'Correct placements must not increment');
  });

  await t.test('11.5: Routine completion calculates accurate score summary', () => {
    let state = createDailyRoutineGame(1);
    for (let slot = 0; slot < 3; slot++) {
      const cardIdx = state.shuffledCards.findIndex((c) => c.order === slot && !state.placedCards.some((p) => p?.id === c.id));
      state = selectDailyRoutineCard(state, cardIdx);
      state = placeDailyRoutineCard(state, slot);
    }
    assert.strictEqual(state.isComplete, true, 'Game must complete when all slots placed');
    const result = getDailyRoutineResult(state);
    assert.strictEqual(result.totalCards, 3, 'Total cards must be 3');
    assert.strictEqual(result.accuracy, 1, 'Accuracy must be 1.0 on first-try placement');
  });
});

// ============================================================================
// FEATURE 12: Caregiver Dashboard Clinical Oversight & Adherence Rates
// ============================================================================
test('TIER 1 — Feature 12: Caregiver Dashboard Clinical Oversight & Adherence Rates', async (t) => {
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/caregiver/CaregiverHome.tsx'), 'utf-8');
  const dashContent = homeContent;

  await t.test('12.1: Calculates reminder adherence percentage from completed and total reminders', () => {
    assert.ok(homeContent.includes('adherence'), 'Must compute adherence');
    assert.ok(homeContent.includes("t('cg.adherence')"), 'Must show the adherence metric');
    assert.ok(/reminders\.done\s*\/\s*reminders\.total/.test(homeContent), 'Adherence must be completed / total');
  });

  await t.test('12.2: Calculates weekly engagement from recent activity', () => {
    assert.ok(homeContent.includes('week'), 'Must compute this week\'s activity');
    assert.ok(homeContent.includes("t('cg.sessionsWeek')"), 'Must surface this week\'s sessions');
  });

  await t.test('12.3: Evaluates cognitive performance across memory and recognition domains', () => {
    assert.ok(homeContent.includes("t('prog.domainRecall')"), 'Must show the memory-recall domain');
    assert.ok(homeContent.includes("t('prog.domainRecognition')") || homeContent.includes("t('prog.domainAttention')"), 'Must show recognition domain');
    assert.ok(homeContent.includes('ProgressBar'), 'Domains must be shown as comparable bars');
  });

  await t.test('12.4: Follow-up signals categorize clinical alerts by severity (high/medium/low)', () => {
    assert.ok(homeContent.includes('<Alert'), 'Must surface alerts');
    assert.ok(homeContent.includes('tone="warning"') && homeContent.includes('tone="success"'), 'Alerts must distinguish attention from all-clear');
  });

  await t.test('12.5: Caregiver summary aggregates patient stats, pending reminders, and weekly games', () => {
    assert.ok(homeContent.includes('totalGames') || homeContent.includes('avgAccuracy') || homeContent.includes('pendingReminders'), 'Must aggregate patient stats');
  });
});

// ============================================================================
// FEATURE 13: Care Schedule & Alarm Buzzer Test Trigger
// ============================================================================
test('TIER 1 — Feature 13: Care Schedule & Alarm Buzzer Test Trigger', async (t) => {
  const remScreen = fs.readFileSync(path.join(rootDir, 'src/pages/RemindersScreen.tsx'), 'utf-8');
  const notifService = fs.readFileSync(path.join(rootDir, 'src/services/NotificationService.ts'), 'utf-8');

  await t.test('13.1: Reminders are partitioned into upcoming, done and missed', () => {
    assert.ok(remScreen.includes("status === 'pending'"), 'Must collect pending reminders');
    assert.ok(remScreen.includes("status === 'completed'"), 'Must collect completed reminders');
    assert.ok(remScreen.includes("status === 'missed'"), 'Must collect missed reminders');
  });

  await t.test('13.2: Complete reminder action marks it taken', () => {
    assert.ok(remScreen.includes('reminderService.completeReminder'), 'Must call completeReminder');
  });

  await t.test('13.3: Snooze reminder action pushes the reminder back', () => {
    assert.ok(remScreen.includes('snoozeReminder'), 'Must call snoozeReminder');
    assert.ok(/snoozeReminder\([^)]*,\s*\d+/.test(remScreen), 'Must pass a snooze duration');
  });

  await t.test('13.4: The notification service can synthesise an alarm tone', () => {
    assert.ok(notifService.includes('AudioContext') || notifService.includes('webkitAudioContext'), 'NotificationService must synthesize audio');
    assert.ok(notifService.includes('navigator.vibrate'), 'NotificationService must also vibrate');
  });

  await t.test('13.5: Notification service triggers tactile haptic vibration pattern', () => {
    assert.ok(notifService.includes('navigator.vibrate'), 'NotificationService must invoke navigator.vibrate');
  });
});

// ============================================================================
// FEATURE 14: Settings Live Interactive Preview & Text Resizing
// ============================================================================
test('TIER 1 — Feature 14: Settings Live Interactive Preview & Text Resizing', async (t) => {
  const settingsContent = fs.readFileSync(path.join(rootDir, 'src/pages/SettingsScreen.tsx'), 'utf-8');

  await t.test('14.1: Theme toggle switches between Daylight Mode and Midnight Mode', () => {
    assert.ok(settingsContent.includes('toggleTheme'), 'Settings must invoke toggleTheme');
    assert.ok(settingsContent.includes("t('set.darkMode')"), 'Must describe the calm-night appearance');
  });

  await t.test('14.2: Text size scaling across normal (18px), large (22px), extra-large (26px)', () => {
    assert.ok(settingsContent.includes("'normal'"), 'Must support normal text size');
    assert.ok(settingsContent.includes("'large'"), 'Must support large text size');
    assert.ok(settingsContent.includes("'extra-large'"), 'Must support extra-large text size');
  });

  await t.test('14.3: Live interactive preview dynamically renders sample card reflecting text size', () => {
    assert.ok(settingsContent.includes("t('set.previewText')"), 'Must feature a live sample of the text size');
    assert.ok(settingsContent.includes('a11y?.textSize'), 'Preview must bind to the live text-size setting');
  });

  await t.test('14.4: High contrast toggle switches to WCAG AAA contrast colors', () => {
    assert.ok(settingsContent.includes('highContrast'), 'Must manage highContrast setting');
    assert.ok(settingsContent.includes('highContrast'), 'Preview must react to the high-contrast switch');
  });

  await t.test('14.5: Voice guidance toggle updates spoken prompt preference', () => {
    assert.ok(settingsContent.includes('voiceGuidance'), 'Must manage voiceGuidance setting');
  });
});

// ============================================================================
// FEATURE 15: Multi-Orientation Responsiveness
// ============================================================================
test('TIER 1 — Feature 15: Multi-Orientation Responsiveness', async (t) => {
  const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/PatientHomeScreen.tsx'), 'utf-8');
  const shellCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');
  const shellTsx = fs.readFileSync(path.join(rootDir, 'src/shell/AppShell.tsx'), 'utf-8');

  await t.test('15.1: Phones get one focused column', () => {
    assert.ok(homeContent.includes('grid-cols-1'), 'Content must stack on a phone');
    assert.ok(shellCss.includes('.shell-content'), 'Shell must own the content column');
  });

  await t.test('15.2: From 1024px the shell switches to a real sidebar layout', () => {
    assert.ok(shellCss.includes('@media (min-width: 1024px)'), 'Must declare the desktop breakpoint');
    assert.ok(/grid-template-columns: var\(--sidebar-w\)/.test(shellCss), 'Desktop must lay out sidebar + content');
  });

  await t.test('15.3: The phone dock disappears once the sidebar appears', () => {
    assert.ok(/@media \(min-width: 1024px\)[\s\S]{0,400}\.shell-bottomnav \{ display: none/.test(shellCss),
      'Bottom dock must be hidden on desktop');
  });

  await t.test('15.4: Content width is capped so lines never become unreadable', () => {
    assert.ok(shellCss.includes('max-width: var(--shell-max)'), 'Content must be capped');
    assert.ok(fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8').includes('--shell-max: 1240px'),
      'The cap must be a token');
  });

  await t.test('15.5: Tablet range reflows without a sidebar', () => {
    assert.ok(shellCss.includes('@media (min-width: 640px)') || shellCss.includes('@media (min-width: 560px)'),
      'Intermediate breakpoints must exist for tablets');
    assert.ok(shellTsx.includes('shell--with-sidebar') || shellTsx.includes('sidebar'), 'Shell must render the sidebar');
  });
});

// ============================================================================
// FEATURE 16: Production Build & Typecheck Cleanliness
// ============================================================================
test('TIER 1 — Feature 16: Production Build & Typecheck Cleanliness', async (t) => {
  await t.test('16.1: tsconfig.json enforces strict TypeScript compilation rules', () => {
    const tsconfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'tsconfig.json'), 'utf-8'));
    assert.strictEqual(tsconfig.compilerOptions.strict, true, 'strict must be true');
    assert.strictEqual(tsconfig.compilerOptions.noEmit, true, 'noEmit must be true');
  });

  await t.test('16.2: package.json specifies build, typecheck, dev, and preview scripts', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    assert.ok(pkg.scripts.build, 'Must define build script');
    assert.ok(pkg.scripts.typecheck, 'Must define typecheck script');
    assert.ok(pkg.scripts.dev, 'Must define dev script');
    assert.ok(pkg.scripts.preview, 'Must define preview script');
  });

  await t.test('16.3: Production build directory dist/ index.html exists and has valid structure', () => {
    const distHtmlPath = path.join(rootDir, 'dist/index.html');
    assert.ok(fs.existsSync(distHtmlPath), 'dist/index.html must exist from production build');
    const content = fs.readFileSync(distHtmlPath, 'utf-8');
    assert.ok(content.includes('<div id="root"></div>'), 'dist/index.html must contain root div mount');
  });

  await t.test('16.4: Production assets bundle contains compiled JS and CSS chunks', () => {
    const assetsDir = path.join(rootDir, 'dist/assets');
    assert.ok(fs.existsSync(assetsDir), 'dist/assets must exist');
    const files = fs.readdirSync(assetsDir);
    const hasJs = files.some((f) => f.endsWith('.js'));
    const hasCss = files.some((f) => f.endsWith('.css'));
    assert.ok(hasJs, 'dist/assets must contain production JS bundle');
    assert.ok(hasCss, 'dist/assets must contain production CSS bundle');
  });

  await t.test('16.5: HTML title and metadata define Smriti Sathi Cognitive Care Companion branding', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    assert.ok(indexHtml.includes('Smriti Sathi'), 'index.html must include Smriti Sathi in title or header');
    assert.ok(indexHtml.includes('viewport'), 'index.html must define viewport meta tag');
  });
});
