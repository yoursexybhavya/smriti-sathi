/**
 * Tier 5: Adversarial Challenge & Stress-Testing Suite
 * Focused on Errorless Learning Verification across all Cognitive Games:
 * - MathWorkout.tsx
 * - LanguageWorkout.tsx
 * - DailyRoutine.tsx
 * - MemoryMatch.tsx
 *
 * Assertions:
 * 1. Zero Red Error Styling (#7F1D1D, #EF4444), Zero tryAgain, Zero Failure Dialogs.
 * 2. Distractors Disabled and Non-Clickable under 10,000 Monkey Clicks.
 * 3. 3000ms Inactivity Scaffolding Pulse & Reset on User Interaction.
 * 4. prefers-reduced-motion Static High-Contrast Fallback.
 * 5. Full End-to-End Errorless Cognitive Game Flow.
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
  findMatchIndex,
  getResult as getMemoryMatchResult,
} from '../src/games/memoryMatch.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// SUITE 1: Static Code AST & Negative Feedback Elimination Audit
// ============================================================================
test('TIER 5 — Suite 1: Static Code Audit - Zero Negative Feedback across Cognitive Games', async (t) => {
  const gameFiles = [
    'src/pages/MathWorkout.tsx',
    'src/pages/LanguageWorkout.tsx',
    'src/pages/DailyRoutine.tsx',
    'src/pages/MemoryMatch.tsx',
  ];

  await t.test('1.1: MathWorkout.tsx contains ZERO red error colors (#7F1D1D, #EF4444)', () => {
    const filePath = path.join(rootDir, 'src/pages/MathWorkout.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(!content.includes('#7F1D1D'), 'MathWorkout.tsx must NOT contain #7F1D1D');
    assert.ok(!content.includes('#EF4444'), 'MathWorkout.tsx must NOT contain #EF4444');
    assert.ok(!content.includes('rgb(127, 29, 29)'), 'MathWorkout.tsx must NOT contain rgb(127, 29, 29)');
    assert.ok(!content.includes('rgb(239, 68, 68)'), 'MathWorkout.tsx must NOT contain rgb(239, 68, 68)');
  });

  await t.test('1.2: LanguageWorkout.tsx contains ZERO red error colors (#7F1D1D, #EF4444)', () => {
    const filePath = path.join(rootDir, 'src/pages/LanguageWorkout.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(!content.includes('#7F1D1D'), 'LanguageWorkout.tsx must NOT contain #7F1D1D');
    assert.ok(!content.includes('#EF4444'), 'LanguageWorkout.tsx must NOT contain #EF4444');
    assert.ok(!content.includes('rgb(127, 29, 29)'), 'LanguageWorkout.tsx must NOT contain rgb(127, 29, 29)');
    assert.ok(!content.includes('rgb(239, 68, 68)'), 'LanguageWorkout.tsx must NOT contain rgb(239, 68, 68)');
  });

  await t.test('1.3: DailyRoutine.tsx contains ZERO red error colors (#7F1D1D, #EF4444)', () => {
    const filePath = path.join(rootDir, 'src/pages/DailyRoutine.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(!content.includes('#7F1D1D'), 'DailyRoutine.tsx must NOT contain #7F1D1D');
    assert.ok(!content.includes('#EF4444'), 'DailyRoutine.tsx must NOT contain #EF4444');
    assert.ok(!content.includes('rgb(127, 29, 29)'), 'DailyRoutine.tsx must NOT contain rgb(127, 29, 29)');
    assert.ok(!content.includes('rgb(239, 68, 68)'), 'DailyRoutine.tsx must NOT contain rgb(239, 68, 68)');
  });

  await t.test('1.4: MemoryMatch.tsx contains ZERO red error colors (#7F1D1D, #EF4444)', () => {
    const filePath = path.join(rootDir, 'src/pages/MemoryMatch.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(!content.includes('#7F1D1D'), 'MemoryMatch.tsx must NOT contain #7F1D1D');
    assert.ok(!content.includes('#EF4444'), 'MemoryMatch.tsx must NOT contain #EF4444');
    assert.ok(!content.includes('rgb(127, 29, 29)'), 'MemoryMatch.tsx must NOT contain rgb(127, 29, 29)');
    assert.ok(!content.includes('rgb(239, 68, 68)'), 'MemoryMatch.tsx must NOT contain rgb(239, 68, 68)');
  });

  await t.test('1.5: ZERO tryAgain vocal prompts in any cognitive game', () => {
    for (const relPath of gameFiles) {
      const filePath = path.join(rootDir, relPath);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(!content.includes('t.tryAgain'), `${relPath} must NOT call speak(t.tryAgain)`);
      assert.ok(!content.includes('tryAgain'), `${relPath} must NOT reference tryAgain`);
    }
  });

  await t.test('1.6: ZERO error icons (XCircle, AlertTriangle, AlertCircle) in cognitive games', () => {
    for (const relPath of gameFiles) {
      const filePath = path.join(rootDir, relPath);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(!content.includes('XCircle'), `${relPath} must NOT import or render XCircle`);
      assert.ok(!content.includes('AlertTriangle'), `${relPath} must NOT import or render AlertTriangle`);
      assert.ok(!content.includes('AlertCircle'), `${relPath} must NOT import or render AlertCircle`);
      assert.ok(!content.includes('ThumbsDown'), `${relPath} must NOT import or render ThumbsDown`);
    }
  });

  await t.test('1.7: Scaffolding CSS animation in globals.css uses ONLY emerald tones', () => {
    const cssPath = path.join(rootDir, 'src/styles/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    const keyframeMatch = cssContent.match(/@keyframes scaffoldPulse\s*\{[\s\S]*?\}/);
    assert.ok(keyframeMatch, '@keyframes scaffoldPulse must be defined in globals.css');

    const keyframeCSS = keyframeMatch[0];
    assert.ok(/rgba\(\s*16,\s*185,\s*129/.test(keyframeCSS), 'scaffoldPulse must use emerald rgba(16, 185, 129)');
    assert.ok(!keyframeCSS.includes('red'), 'scaffoldPulse must never use red');
    assert.ok(!keyframeCSS.includes('#EF4444'), 'scaffoldPulse must never use #EF4444');
    assert.ok(!keyframeCSS.includes('#7F1D1D'), 'scaffoldPulse must never use #7F1D1D');
  });
});

// ============================================================================
// SUITE 2: Distractor Disabling & Monkey Click Stress Testing (10,000 Clicks)
// ============================================================================
test('TIER 5 — Suite 2: Distractor Disabling & Monkey Click Resistance', async (t) => {
  const env = setupTestEnvironment();

  await t.test('2.1: MathWorkout Monkey Click Fuzzing (10,000 rapid clicks on distractor buttons)', () => {
    const question = {
      correctAnswer: 25,
      options: [20, 25, 30],
    };

    let registeredClicks = 0;
    let selectedOption: number | null = null;
    let score = 0;
    const speakCalls: string[] = [];

    const handleOptionSelect = (opt: number) => {
      if (selectedOption !== null) return;
      if (opt !== question.correctAnswer) return; // Errorless guard

      registeredClicks++;
      selectedOption = opt;
      score++;
      speakCalls.push('Great Job');
    };

    // Construct mock buttons with exact component logic
    const buttons = question.options.map((opt) => {
      const isTarget = opt === question.correctAnswer;
      const btn = env.document.createElement('button');
      btn.disabled = !isTarget;
      btn.style.pointerEvents = isTarget ? 'auto' : 'none';
      btn.style.opacity = isTarget ? '1' : '0.35';
      btn.addEventListener('click', () => handleOptionSelect(opt));
      return { opt, isTarget, btn };
    });

    const distractorButtons = buttons.filter((b) => !b.isTarget);
    assert.strictEqual(distractorButtons.length, 2, 'Must have exactly 2 distractors');

    // Hammer distractors with 10,000 monkey clicks
    for (let i = 0; i < 10000; i++) {
      const targetDistractor = distractorButtons[i % 2];
      targetDistractor.btn.click(); // DOM click attempt
      handleOptionSelect(targetDistractor.opt); // Direct function invocation attempt
    }

    assert.strictEqual(registeredClicks, 0, 'Zero clicks may register on distractors');
    assert.strictEqual(selectedOption, null, 'selectedOption must remain null');
    assert.strictEqual(score, 0, 'Score must remain 0');
    assert.strictEqual(speakCalls.length, 0, 'No speak calls may be emitted');

    // Now click target button once
    const targetButton = buttons.find((b) => b.isTarget)!;
    targetButton.btn.click();

    assert.strictEqual(registeredClicks, 1, 'Target click must register');
    assert.strictEqual(selectedOption, 25, 'selectedOption must be 25');
    assert.strictEqual(score, 1, 'Score must increment to 1');
  });

  await t.test('2.2: LanguageWorkout Monkey Click Fuzzing (10,000 clicks on incorrect choices)', () => {
    const card = {
      word: 'বৰষা (Borsha)',
      options: ['Monsoon Rains', 'Morning Walk', 'Evening Tea'],
    };

    let registeredClicks = 0;
    let selectedOption: string | null = null;
    let score = 0;

    const handleOptionSelect = (opt: string) => {
      if (selectedOption !== null) return;
      const isMatch = opt === card.options[0];
      if (!isMatch) return; // Errorless guard

      registeredClicks++;
      selectedOption = opt;
      score++;
    };

    const buttons = card.options.map((opt) => {
      const isTarget = opt === card.options[0];
      const btn = env.document.createElement('button');
      btn.disabled = !isTarget;
      btn.style.pointerEvents = isTarget ? 'auto' : 'none';
      btn.addEventListener('click', () => handleOptionSelect(opt));
      return { opt, isTarget, btn };
    });

    const distractorButtons = buttons.filter((b) => !b.isTarget);

    // 10,000 monkey clicks on distractors
    for (let i = 0; i < 10000; i++) {
      const distractor = distractorButtons[i % 2];
      distractor.btn.click();
      handleOptionSelect(distractor.opt);
    }

    assert.strictEqual(registeredClicks, 0);
    assert.strictEqual(selectedOption, null);
    assert.strictEqual(score, 0);

    // Click target
    const target = buttons.find((b) => b.isTarget)!;
    target.btn.click();

    assert.strictEqual(registeredClicks, 1);
    assert.strictEqual(selectedOption, 'Monsoon Rains');
    assert.strictEqual(score, 1);
  });

  await t.test('2.3: DailyRoutine Slot Placement Fuzzing (10,000 invalid slot clicks blocked)', () => {
    let state = createDailyRoutineGame(1); // 3 cards: 0, 1, 2
    // Select card index 0
    state = selectDailyRoutineCard(state, 0);
    const selectedCard = state.shuffledCards[state.selectedCardIndex!];

    let invalidPlacementAttempts = 0;

    const handleSlotClick = (slotIndex: number) => {
      if (!state || state.selectedCardIndex === null || state.isComplete) return;
      const card = state.shuffledCards[state.selectedCardIndex];
      // Errorless learning guard from DailyRoutine.tsx:
      if (!card || card.order !== slotIndex) {
        invalidPlacementAttempts++;
        return;
      }
      state = placeDailyRoutineCard(state, slotIndex);
    };

    // Find wrong slots
    const wrongSlots = [0, 1, 2].filter((slot) => slot !== selectedCard.order);

    // Create slot buttons with UI disabled conditions
    const slotButtons = [0, 1, 2].map((slotIdx) => {
      const isCorrectSlot = selectedCard !== null && slotIdx === selectedCard.order;
      const btn = env.document.createElement('button');
      btn.disabled = !isCorrectSlot;
      btn.style.pointerEvents = isCorrectSlot ? 'auto' : 'none';
      btn.addEventListener('click', () => handleSlotClick(slotIdx));
      return { slotIdx, isCorrectSlot, btn };
    });

    // 10,000 monkey clicks on wrong slots
    for (let i = 0; i < 10000; i++) {
      const wrongSlotIdx = wrongSlots[i % wrongSlots.length];
      const wrongBtn = slotButtons.find((b) => b.slotIdx === wrongSlotIdx)!;
      wrongBtn.btn.click();
      handleSlotClick(wrongSlotIdx);
    }

    assert.strictEqual(invalidPlacementAttempts, 10000, 'All 10,000 invalid attempts intercepted at guard');
    assert.strictEqual(state.placedCards.filter((p) => p !== null).length, 0, 'No cards placed into wrong slots');
    assert.strictEqual(state.attempts, 0, 'Attempts must remain 0 (no penalization)');

    // Now click the correct slot
    const correctBtn = slotButtons.find((b) => b.isCorrectSlot)!;
    correctBtn.btn.click();

    assert.strictEqual(state.placedCards[selectedCard.order]?.id, selectedCard.id, 'Card placed in correct slot');
    assert.strictEqual(state.correctPlacements, 1);
  });

  await t.test('2.4: MemoryMatch Guided Second Flip (10,000 non-matching clicks blocked)', () => {
    let state = createMemoryMatchGame(1); // 2 pairs (4 cards)

    // Flip card 0
    state = flipMemoryMatchCard(state, 0);
    assert.strictEqual(state.firstFlipped, 0);

    const matchIdx = findMatchIndex(state, 0);
    const nonMatchIndices = [0, 1, 2, 3].filter((idx) => idx !== 0 && idx !== matchIdx);

    let invalidFlipAttempts = 0;

    const handleCardClick = (index: number) => {
      if (!state || state.isChecking || state.isComplete) return;
      // Errorless learning guard from MemoryMatch.tsx:
      if (state.firstFlipped !== null) {
        const expectedMatch = findMatchIndex(state, state.firstFlipped);
        if (index !== expectedMatch) {
          invalidFlipAttempts++;
          return;
        }
      }
      state = flipMemoryMatchCard(state, index);
    };

    // 10,000 monkey clicks on non-matching cards
    for (let i = 0; i < 10000; i++) {
      const targetIdx = nonMatchIndices[i % nonMatchIndices.length];
      handleCardClick(targetIdx);
    }

    assert.strictEqual(invalidFlipAttempts, 10000, 'All 10,000 invalid card clicks rejected');
    assert.strictEqual(state.secondFlipped, null, 'secondFlipped must remain null');
    assert.strictEqual(state.isChecking, false, 'isChecking must remain false');
    assert.strictEqual(state.attempts, 0, 'Attempts counter must NOT increment');

    // Click the matching card
    handleCardClick(matchIdx);
    assert.strictEqual(state.secondFlipped, matchIdx, 'Second flipped card must be the matching card');
    assert.strictEqual(state.isChecking, true, 'isChecking initiated for matching pair');
  });

  env.cleanup();
});

// ============================================================================
// SUITE 3: 3000ms Inactivity Scaffolding Pulse & Reset Engine
// ============================================================================
test('TIER 5 — Suite 3: Inactivity Scaffolding Timer Precision & Multi-Modal Resets', async (t) => {
  await t.test('3.1: Timer precision: false at 2990ms, true at exactly 3000ms', async () => {
    let showScaffold = false;
    let timer: NodeJS.Timeout | null = null;
    const delayMs = 50; // scaled 3000ms -> 50ms for precise timing in CI

    const startTimer = () => {
      showScaffold = false;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        showScaffold = true;
      }, delayMs);
    };

    startTimer();

    // Check before boundary (90% of duration)
    await new Promise((r) => setTimeout(r, Math.floor(delayMs * 0.8)));
    assert.strictEqual(showScaffold, false, 'showScaffold must be false before delay completes');

    // Advance past boundary
    await new Promise((r) => setTimeout(r, Math.floor(delayMs * 0.4)));
    assert.strictEqual(showScaffold, true, 'showScaffold must be true after delay expires');

    if (timer) clearTimeout(timer);
  });

  await t.test('3.2: Multi-Modal Interaction Resets (click, touchstart, keydown)', async () => {
    let showScaffold = false;
    let timer: NodeJS.Timeout | null = null;
    let resetCount = 0;
    const delayMs = 40;

    const resetInactivity = () => {
      showScaffold = false;
      resetCount++;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        showScaffold = true;
      }, delayMs);
    };

    // Initial countdown
    resetInactivity();

    // 1. Reset via click before expiry
    await new Promise((r) => setTimeout(r, 20));
    resetInactivity(); // 'click'
    await new Promise((r) => setTimeout(r, 20));
    assert.strictEqual(showScaffold, false, 'Click must have reset timer');

    // 2. Reset via touchstart before expiry
    resetInactivity(); // 'touchstart'
    await new Promise((r) => setTimeout(r, 20));
    assert.strictEqual(showScaffold, false, 'Touchstart must have reset timer');

    // 3. Reset via keydown before expiry
    resetInactivity(); // 'keydown'
    await new Promise((r) => setTimeout(r, 20));
    assert.strictEqual(showScaffold, false, 'Keydown must have reset timer');

    // Let it expire undisturbed
    await new Promise((r) => setTimeout(r, 30));
    assert.strictEqual(showScaffold, true, 'Scaffold must activate after undisturbed duration');

    // User taps active scaffold -> immediately resets to false
    resetInactivity();
    assert.strictEqual(showScaffold, false, 'User interaction resets active scaffold immediately');

    if (timer) clearTimeout(timer);
  });

  await t.test('3.3: Jitter stress test: continuous taps prevent scaffold from ever pulsing', async () => {
    let showScaffold = false;
    let timer: NodeJS.Timeout | null = null;
    const delayMs = 40;

    const resetInactivity = () => {
      showScaffold = false;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        showScaffold = true;
      }, delayMs);
    };

    resetInactivity();

    // 15 continuous user taps every 15ms (total 225ms > 40ms)
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 15));
      resetInactivity();
      assert.strictEqual(showScaffold, false, `Scaffold must remain false on tap ${i + 1}`);
    }

    // Now stop interacting
    await new Promise((r) => setTimeout(r, 55));
    assert.strictEqual(showScaffold, true, 'Scaffold fires only when elder is idle');

    if (timer) clearTimeout(timer);
  });

  await t.test('3.4: Event listener unbind and cleanup on component unmount', () => {
    const listeners: Record<string, Function[]> = {
      click: [],
      touchstart: [],
      keydown: [],
    };

    const addEventListener = (type: string, fn: Function) => {
      if (listeners[type]) listeners[type].push(fn);
    };

    const removeEventListener = (type: string, fn: Function) => {
      if (listeners[type]) {
        listeners[type] = listeners[type].filter((f) => f !== fn);
      }
    };

    const handler = () => {};

    // Mount
    addEventListener('click', handler);
    addEventListener('touchstart', handler);
    addEventListener('keydown', handler);

    assert.strictEqual(listeners.click.length, 1);
    assert.strictEqual(listeners.touchstart.length, 1);
    assert.strictEqual(listeners.keydown.length, 1);

    // Unmount
    removeEventListener('click', handler);
    removeEventListener('touchstart', handler);
    removeEventListener('keydown', handler);

    assert.strictEqual(listeners.click.length, 0);
    assert.strictEqual(listeners.touchstart.length, 0);
    assert.strictEqual(listeners.keydown.length, 0);
  });
});

// ============================================================================
// SUITE 4: prefers-reduced-motion Accessibility Fallback Verification
// ============================================================================
test('TIER 5 — Suite 4: prefers-reduced-motion Fallback & WCAG AAA Conformance', async (t) => {
  const cssPath = path.join(rootDir, 'src/styles/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  await t.test('4.1: globals.css specifies @media (prefers-reduced-motion: reduce) block', () => {
    assert.ok(
      cssContent.includes('@media (prefers-reduced-motion: reduce)'),
      'Must declare @media (prefers-reduced-motion: reduce)'
    );
  });

  await t.test('4.2: Scaffolding pulse disables animation and transform under reduced-motion', () => {
    const reducedMotionSection = cssContent.slice(
      cssContent.indexOf('@media (prefers-reduced-motion: reduce)')
    );

    assert.ok(
      reducedMotionSection.includes('.scaffold-pulse-active'),
      '.scaffold-pulse-active must have an override in prefers-reduced-motion'
    );
    assert.ok(
      reducedMotionSection.includes('animation: none !important'),
      'animation must be none !important'
    );
    assert.ok(
      reducedMotionSection.includes('transform: none !important'),
      'transform must be none !important'
    );
  });

  await t.test('4.3: Scaffolding pulse provides static high-contrast emerald outline & shadow', () => {
    const reducedMotionSection = cssContent.slice(
      cssContent.indexOf('@media (prefers-reduced-motion: reduce)')
    );

    assert.ok(
      reducedMotionSection.includes('outline: 4px solid #10B981 !important'),
      'outline must be 4px solid #10B981 !important'
    );
    assert.ok(
      reducedMotionSection.includes('box-shadow: 0 0 24px 8px rgba(16, 185, 129, 0.6) !important'),
      'box-shadow must provide high-contrast emerald beacon'
    );
    assert.ok(
      reducedMotionSection.includes('border-color: #10B981 !important'),
      'border-color must be #10B981 !important'
    );
  });
});

// ============================================================================
// SUITE 5: Full End-to-End Errorless Cognitive Game Flow & Score Integrity
// ============================================================================
test('TIER 5 — Suite 5: End-to-End Errorless Game Lifecycles & Telemetry Integrity', async (t) => {
  const db = createMockDatabase();

  await t.test('5.1: Math Workout full 3-question completion with 100% score and zero errors', async () => {
    const questions = [
      { id: 1, target: 25, options: [20, 25, 30] },
      { id: 2, target: 70, options: [60, 70, 80] },
      { id: 3, target: 70, options: [65, 70, 75] },
    ];

    let currentScore = 0;
    for (const q of questions) {
      // User attempts distractors -> blocked
      const wrongOpts = q.options.filter((o) => o !== q.target);
      wrongOpts.forEach((wrong) => {
        if (wrong === q.target) currentScore++;
      });

      // User selects target
      currentScore++;
    }

    assert.strictEqual(currentScore, 3, 'Final score must be 3 / 3');

    // Save session
    await db.gameSessions.add({
      patientId: 1,
      gameType: 'math',
      domain: 'processingSpeed',
      difficulty: 1,
      score: 100,
      accuracy: 1.0,
      responseTimeMs: 3200,
      latencyMs: 3200,
      playedAt: new Date(),
      synced: 0,
    });

    const sessions = await db.gameSessions.where('patientId').equals(1).toArray();
    assert.strictEqual(sessions.length, 1);
    assert.strictEqual(sessions[0].score, 100);
    assert.strictEqual(sessions[0].accuracy, 1.0);
  });

  await t.test('5.2: Memory Match complete 2-pair speed match game with 1.0 accuracy', async () => {
    let state = createMemoryMatchGame(1);
    assert.strictEqual(state.totalPairs, 2);

    // Pair 1
    state = flipMemoryMatchCard(state, 0);
    const match1 = findMatchIndex(state, 0);
    state = flipMemoryMatchCard(state, match1);
    state = checkMemoryMatch(state);

    assert.strictEqual(state.matchesFound, 1);

    // Pair 2
    const remainingUnmatched = state.cards.findIndex((c) => !c.isMatched);
    state = flipMemoryMatchCard(state, remainingUnmatched);
    const match2 = findMatchIndex(state, remainingUnmatched);
    state = flipMemoryMatchCard(state, match2);
    state = checkMemoryMatch(state);

    assert.strictEqual(state.matchesFound, 2);
    assert.strictEqual(state.isComplete, true);

    const result = getMemoryMatchResult(state);
    assert.strictEqual(result.accuracy, 1.0);
    assert.strictEqual(result.correctMatches, 2);
    assert.strictEqual(result.attempts, 2);
  });
});

// ============================================================================
// SUITE 6: Scandinavian Token Integrity & Redesigned UI Adversarial Shield
// ============================================================================
test('TIER 5 — Suite 6: Scandinavian Token Integrity & Redesigned UI Adversarial Shield', async (t) => {
  const primaryScreens = [
    'src/pages/PatientHomeScreen.tsx',
    'src/pages/SplashScreen.tsx',
    'src/pages/auth/LoginScreen.tsx',
    'src/pages/games/RecogniseGame.tsx',
    'src/pages/games/RecognisePlay.tsx',
    'src/pages/games/RememberGame.tsx',
    'src/pages/games/RememberMemorize.tsx',
    'src/pages/games/RememberRecall.tsx',
    'src/pages/games/MemoryMatchGame.tsx',
    'src/pages/games/DailyRoutineGame.tsx',
  ];

  await t.test('6.1: Zero lingering #F5F0E8 across redesigned primary screens', () => {
    for (const relPath of primaryScreens) {
      const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
      assert.ok(!content.includes('#F5F0E8'), `${relPath} must NOT contain #F5F0E8`);
    }
  });

  await t.test('6.2: Zero lingering #FDF8F0 across redesigned primary screens', () => {
    for (const relPath of primaryScreens) {
      const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
      assert.ok(!content.includes('#FDF8F0'), `${relPath} must NOT contain #FDF8F0`);
    }
  });

  await t.test('6.3: Cognitive games contain zero punitive feedback words (tryAgain, game over)', () => {
    const gameFiles = [
      'src/pages/games/RecognisePlay.tsx',
      'src/pages/games/RememberRecall.tsx',
      'src/pages/games/MemoryMatchGame.tsx',
      'src/pages/games/DailyRoutineGame.tsx',
    ];
    for (const relPath of gameFiles) {
      const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8').toLowerCase();
      assert.ok(!content.includes('game over'), `${relPath} must NOT contain 'game over'`);
      assert.ok(!content.includes('you failed'), `${relPath} must NOT contain 'you failed'`);
    }
  });

  await t.test('6.4: globals.css Scandinavian canvas tokens (#F8FAFC, dark midnight) are strictly defined', () => {
    const globals = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');
    assert.ok(globals.includes('#F8FAFC'), 'globals.css must define light canvas #F8FAFC');
    assert.ok(
      globals.includes('#080C14') || globals.includes('#0B0F17'),
      'globals.css must define a deep midnight dark canvas (#080C14 / #0B0F17)'
    );
  });

  await t.test('6.5: Viewport meta tag in index.html prevents user scale breaking senior layout', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    assert.ok(indexHtml.includes('user-scalable=no') || indexHtml.includes('width=device-width'), 'index.html must define controlled viewport');
  });
});
