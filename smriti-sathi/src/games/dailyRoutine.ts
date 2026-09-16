/**
 * Daily Routine Sequencing Game Engine — Pure Functions
 *
 * Game Design (from execution plan):
 * - Cards representing daily activities appear shuffled
 * - Patient arranges them in correct chronological order
 * - Correctly placed cards get a green glow + voice confirmation
 * - Incorrectly placed cards gently bounce back (no punishment)
 * - Voice narrates the completed routine at the end
 *
 * Difficulty scaling:
 * - Level 1: 3 cards, numbered slot hints
 * - Level 2: 4 cards, hints fade after 3s
 * - Level 3: 5 cards, no hints
 * - Level 4: 6 cards, no hints, mixed routines
 */

/** A single activity card */
export interface ActivityCard {
  id: string;
  label: string;     // Translation key (e.g., 'wakeUp')
  emoji: string;     // Visual icon
  order: number;     // Correct position (0-indexed)
  period: 'morning' | 'afternoon' | 'evening';
}

/** Configuration per difficulty level */
export interface DailyRoutineConfig {
  cardCount: number;
  showSlotNumbers: boolean;
  hintDurationMs: number;   // 0 = no hints, >0 = hints fade after this time
  includesMixed: boolean;   // Level 4: cards from different routines
}

/** Current game state */
export interface DailyRoutineState {
  shuffledCards: ActivityCard[];    // Cards in their shuffled order
  placedCards: (ActivityCard | null)[]; // Slots where cards have been placed
  selectedCardIndex: number | null;    // Currently selected card from shuffled deck
  correctPlacements: number;
  totalCards: number;
  attempts: number;                     // Total placement attempts
  isComplete: boolean;
  startTime: number;
  level: number;
  config: DailyRoutineConfig;
  lastPlacementCorrect: boolean | null; // For feedback animation
}

/** Result of a completed game */
export interface DailyRoutineResult {
  totalCards: number;
  attempts: number;
  correctOnFirstTry: number;
  accuracy: number;      // correctOnFirstTry / totalCards
  timeMs: number;
  level: number;
}

/**
 * All available activity cards with their emoji representations.
 * Uses NER-appropriate imagery conceptually.
 */
const ALL_ACTIVITIES: ActivityCard[] = [
  { id: 'wake',      label: 'wakeUp',       emoji: '🌅', order: 0, period: 'morning' },
  { id: 'brush',     label: 'brushTeeth',    emoji: '🪥', order: 1, period: 'morning' },
  { id: 'breakfast', label: 'breakfast',     emoji: '🍚', order: 2, period: 'morning' },
  { id: 'medicine',  label: 'takeMedicine',  emoji: '💊', order: 3, period: 'morning' },
  { id: 'walk',      label: 'morningWalk',   emoji: '🚶', order: 4, period: 'morning' },
  { id: 'lunch',     label: 'lunch',         emoji: '🍛', order: 5, period: 'afternoon' },
  { id: 'rest',      label: 'rest',          emoji: '😴', order: 6, period: 'afternoon' },
  { id: 'tea',       label: 'eveningTea',    emoji: '☕', order: 7, period: 'evening' },
  { id: 'dinner',    label: 'dinner',        emoji: '🍲', order: 8, period: 'evening' },
  { id: 'sleep',     label: 'sleep',         emoji: '🌙', order: 9, period: 'evening' },
];

/**
 * Get configuration for a difficulty level.
 */
export function getConfig(level: number): DailyRoutineConfig {
  switch (level) {
    case 1:
      return { cardCount: 3, showSlotNumbers: true, hintDurationMs: 0, includesMixed: false };
    case 2:
      return { cardCount: 4, showSlotNumbers: false, hintDurationMs: 3000, includesMixed: false };
    case 3:
      return { cardCount: 5, showSlotNumbers: false, hintDurationMs: 0, includesMixed: false };
    case 4:
      return { cardCount: 6, showSlotNumbers: false, hintDurationMs: 0, includesMixed: true };
    default:
      return { cardCount: 3, showSlotNumbers: true, hintDurationMs: 0, includesMixed: false };
  }
}

/**
 * Select activities appropriate for the difficulty level.
 */
function selectActivities(config: DailyRoutineConfig): ActivityCard[] {
  if (config.includesMixed) {
    // Level 4: pick from all periods
    return ALL_ACTIVITIES.slice(0, config.cardCount);
  }

  // Lower levels: pick consecutive morning activities
  if (config.cardCount <= 3) {
    // wake, brush, breakfast
    return ALL_ACTIVITIES.slice(0, 3);
  }

  if (config.cardCount <= 5) {
    // wake through walk
    return ALL_ACTIVITIES.slice(0, config.cardCount);
  }

  return ALL_ACTIVITIES.slice(0, config.cardCount);
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Create a new game with shuffled cards.
 */
export function createGame(level: number): DailyRoutineState {
  const config = getConfig(level);
  const activities = selectActivities(config);

  // Re-index orders to be 0-based for the selected subset
  const reindexed = activities.map((a, i) => ({ ...a, order: i }));

  return {
    shuffledCards: shuffle(reindexed),
    placedCards: new Array(reindexed.length).fill(null),
    selectedCardIndex: null,
    correctPlacements: 0,
    totalCards: reindexed.length,
    attempts: 0,
    isComplete: false,
    startTime: Date.now(),
    level,
    config,
    lastPlacementCorrect: null,
  };
}

/**
 * Select a card from the shuffled deck.
 */
export function selectCard(
  state: DailyRoutineState,
  cardIndex: number
): DailyRoutineState {
  if (state.isComplete) return state;

  // Can't select a card that's already been placed
  const card = state.shuffledCards[cardIndex];
  if (!card) return state;

  // Check if this card is already placed
  const alreadyPlaced = state.placedCards.some(
    (placed) => placed !== null && placed.id === card.id
  );
  if (alreadyPlaced) return state;

  return {
    ...state,
    selectedCardIndex: cardIndex,
    lastPlacementCorrect: null,
  };
}

/**
 * Try to place the selected card into a slot.
 *
 * Errorless learning: if placement is wrong, the card goes back
 * to the deck. No error sound, no red indicator.
 */
export function placeCard(
  state: DailyRoutineState,
  slotIndex: number
): DailyRoutineState {
  if (state.isComplete || state.selectedCardIndex === null) return state;

  const card = state.shuffledCards[state.selectedCardIndex];
  if (!card) return state;

  // Slot already occupied
  if (state.placedCards[slotIndex] !== null) return state;

  const isCorrect = card.order === slotIndex;
  const newAttempts = state.attempts + 1;

  if (isCorrect) {
    const newPlaced = [...state.placedCards];
    newPlaced[slotIndex] = card;
    const newCorrectPlacements = state.correctPlacements + 1;
    const isComplete = newCorrectPlacements === state.totalCards;

    return {
      ...state,
      placedCards: newPlaced,
      selectedCardIndex: null,
      correctPlacements: newCorrectPlacements,
      attempts: newAttempts,
      isComplete,
      lastPlacementCorrect: true,
    };
  }

  // Incorrect — card goes back, no punishment
  return {
    ...state,
    selectedCardIndex: null,
    attempts: newAttempts,
    lastPlacementCorrect: false,
  };
}

/**
 * Get available (unplaced) cards from the shuffled deck.
 */
export function getAvailableCards(state: DailyRoutineState): ActivityCard[] {
  const placedIds = new Set(
    state.placedCards.filter((c): c is ActivityCard => c !== null).map((c) => c.id)
  );
  return state.shuffledCards.filter((card) => !placedIds.has(card.id));
}

/**
 * Calculate the game result.
 */
export function getResult(state: DailyRoutineState): DailyRoutineResult {
  // "Correct on first try" = total cards minus (attempts - total cards)
  // i.e., if you placed 5 cards in 7 attempts, 3 were first-try correct
  const correctOnFirstTry = Math.max(0, state.totalCards - (state.attempts - state.totalCards));

  return {
    totalCards: state.totalCards,
    attempts: state.attempts,
    correctOnFirstTry,
    accuracy: state.totalCards > 0 ? state.correctPlacements / state.attempts : 0,
    timeMs: Date.now() - state.startTime,
    level: state.level,
  };
}

/**
 * Get the correct order labels for narrating the completed routine.
 * Used by the voice system to read out the sequence at the end.
 */
export function getCorrectOrderLabels(state: DailyRoutineState): string[] {
  return state.placedCards
    .filter((c): c is ActivityCard => c !== null)
    .sort((a, b) => a.order - b.order)
    .map((c) => c.label);
}
