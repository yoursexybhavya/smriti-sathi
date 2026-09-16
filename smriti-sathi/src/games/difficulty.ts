/**
 * Adaptive Difficulty Engine — Rule-Based Staircase Algorithm
 *
 * Based on the execution plan's specification:
 * - 3 consecutive strong attempts (≥80% accuracy) → step UP
 * - 2 consecutive weak attempts (<40% accuracy) → step DOWN
 * - Never drops below Level 1 (guaranteed success floor)
 * - Never rises above Level 4
 *
 * This implements errorless learning: the floor level is designed
 * so the patient always succeeds, building confidence.
 */

export type GameType = 'memoryMatch' | 'dailyRoutine';

export interface DifficultyState {
  currentLevel: number;       // 1-4
  consecutiveStrong: number;  // count of consecutive ≥80% accuracy games
  consecutiveWeak: number;    // count of consecutive <40% accuracy games
  gameType: GameType;
}

/** Thresholds for adjusting difficulty */
const STRONG_THRESHOLD = 0.80;    // 80%+ accuracy is "strong"
const WEAK_THRESHOLD = 0.40;      // Below 40% is "weak"
const STRONG_STREAK_NEEDED = 3;   // 3 strong in a row to level up
const WEAK_STREAK_NEEDED = 2;     // 2 weak in a row to level down
const MIN_LEVEL = 1;
const MAX_LEVEL = 4;

/**
 * Create a fresh difficulty state for a new player or game type.
 */
export function createDifficultyState(gameType: GameType): DifficultyState {
  return {
    currentLevel: 1,
    consecutiveStrong: 0,
    consecutiveWeak: 0,
    gameType,
  };
}

/**
 * Adjust difficulty based on the latest game's accuracy.
 *
 * @param state - Current difficulty state
 * @param accuracy - Accuracy from 0.0 to 1.0
 * @returns New difficulty state (never mutates the input)
 */
export function adjustDifficulty(
  state: DifficultyState,
  accuracy: number
): DifficultyState {
  // Strong performance
  if (accuracy >= STRONG_THRESHOLD) {
    const newStrong = state.consecutiveStrong + 1;

    if (newStrong >= STRONG_STREAK_NEEDED && state.currentLevel < MAX_LEVEL) {
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        consecutiveStrong: 0,
        consecutiveWeak: 0,
      };
    }

    return {
      ...state,
      consecutiveStrong: newStrong,
      consecutiveWeak: 0,
    };
  }

  // Weak performance
  if (accuracy < WEAK_THRESHOLD) {
    const newWeak = state.consecutiveWeak + 1;

    if (newWeak >= WEAK_STREAK_NEEDED && state.currentLevel > MIN_LEVEL) {
      return {
        ...state,
        currentLevel: state.currentLevel - 1,
        consecutiveWeak: 0,
        consecutiveStrong: 0,
      };
    }

    return {
      ...state,
      consecutiveWeak: newWeak,
      consecutiveStrong: 0,
    };
  }

  // Middle range — reset streaks, maintain level
  return {
    ...state,
    consecutiveStrong: 0,
    consecutiveWeak: 0,
  };
}

/**
 * Get a human-readable description of what happens at each level.
 * Used for game configuration.
 */
export interface LevelConfig {
  level: number;
  label: string;
  description: string;
}

export function getLevelConfigs(gameType: GameType): LevelConfig[] {
  if (gameType === 'memoryMatch') {
    return [
      { level: 1, label: 'Easy', description: '2×2 grid, 2 pairs, 5s reveal' },
      { level: 2, label: 'Medium', description: '2×3 grid, 3 pairs, 4s reveal' },
      { level: 3, label: 'Hard', description: '2×4 grid, 4 pairs, 3s reveal' },
      { level: 4, label: 'Expert', description: '3×4 grid, 6 pairs, 2s reveal' },
    ];
  }

  // dailyRoutine
  return [
    { level: 1, label: 'Easy', description: '3 cards with numbered hints' },
    { level: 2, label: 'Medium', description: '4 cards, hints fade after 3s' },
    { level: 3, label: 'Hard', description: '5 cards, no hints' },
    { level: 4, label: 'Expert', description: '6 cards, no hints, mixed' },
  ];
}
