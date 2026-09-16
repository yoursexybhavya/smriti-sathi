/**
 * Memory Match Game Engine — Pure Functions
 *
 * This module handles all the game logic for the Memory Match game.
 * It's separated from the React UI component so it can be tested independently.
 *
 * Game Design (from execution plan):
 * - Grid of face-down cards
 * - Patient flips two cards at a time
 * - Matching pairs stay face up
 * - No failure state — game always completes
 * - Errorless learning: on Level 1, hints show the correct match location
 */

/** Represents a single card on the board */
export interface Card {
  id: number;
  pairId: number;    // Cards with the same pairId are a matching pair
  emoji: string;     // The visual content (emoji for now, could be image URL)
  isFlipped: boolean;
  isMatched: boolean;
}

/** Configuration for each difficulty level */
export interface MemoryMatchConfig {
  rows: number;
  cols: number;
  pairs: number;
  revealTimeMs: number;  // How long mismatched cards stay visible
  showHints: boolean;    // Level 1: hint at correct location on mismatch
}

/** Result of a completed game */
export interface MemoryMatchResult {
  totalPairs: number;
  attempts: number;       // Total flip pairs attempted
  correctMatches: number; // Always equals totalPairs when game completes
  accuracy: number;       // correctMatches / attempts (0-1)
  timeMs: number;         // Total game duration
  level: number;
}

/** Current state of a game in progress */
export interface MemoryMatchState {
  cards: Card[];
  firstFlipped: number | null;  // Index of first card flipped in current turn
  secondFlipped: number | null; // Index of second card flipped
  attempts: number;
  matchesFound: number;
  totalPairs: number;
  isChecking: boolean;          // True while comparing two flipped cards
  isComplete: boolean;
  startTime: number;
  level: number;
  config: MemoryMatchConfig;
}

/**
 * Content sets for each difficulty level.
 * Uses emoji for the prototype; real app would use images.
 */
const CONTENT_SETS = {
  // Level 1 — Simple, familiar fruits
  fruits: ['🍎', '🍌', '🍊', '🥭', '🍇', '🍈'],
  // Level 2 — NER regional motifs
  regional: ['🌺', '🎋', '🐘', '🦚', '🌾', '🍵'],
  // Level 3 — Animals of NER
  animals: ['🐅', '🦏', '🐒', '🦅', '🐍', '🐢'],
  // Level 4 — Mixed
  mixed: ['🪷', '🎭', '🏔️', '🛶', '☂️', '🪘'],
};

/**
 * Get configuration for a given difficulty level.
 */
export function getConfig(level: number): MemoryMatchConfig {
  switch (level) {
    case 1:
      return { rows: 2, cols: 2, pairs: 2, revealTimeMs: 5000, showHints: true };
    case 2:
      return { rows: 2, cols: 3, pairs: 3, revealTimeMs: 4000, showHints: false };
    case 3:
      return { rows: 2, cols: 4, pairs: 4, revealTimeMs: 3000, showHints: false };
    case 4:
      return { rows: 3, cols: 4, pairs: 6, revealTimeMs: 2000, showHints: false };
    default:
      return { rows: 2, cols: 2, pairs: 2, revealTimeMs: 5000, showHints: true };
  }
}

/**
 * Get emoji content for a given level.
 */
function getContentForLevel(level: number): string[] {
  switch (level) {
    case 1: return CONTENT_SETS.fruits;
    case 2: return CONTENT_SETS.regional;
    case 3: return CONTENT_SETS.animals;
    case 4: return CONTENT_SETS.mixed;
    default: return CONTENT_SETS.fruits;
  }
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 * Returns a new array; does not mutate the input.
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
 * Create a new game board with shuffled card pairs.
 */
export function createGame(level: number): MemoryMatchState {
  const config = getConfig(level);
  const content = getContentForLevel(level);
  const selectedEmojis = content.slice(0, config.pairs);

  // Create pairs of cards
  const cardPairs: Card[] = [];
  selectedEmojis.forEach((emoji, pairIndex) => {
    cardPairs.push(
      { id: pairIndex * 2, pairId: pairIndex, emoji, isFlipped: false, isMatched: false },
      { id: pairIndex * 2 + 1, pairId: pairIndex, emoji, isFlipped: false, isMatched: false },
    );
  });

  return {
    cards: shuffle(cardPairs),
    firstFlipped: null,
    secondFlipped: null,
    attempts: 0,
    matchesFound: 0,
    totalPairs: config.pairs,
    isChecking: false,
    isComplete: false,
    startTime: Date.now(),
    level,
    config,
  };
}

/**
 * Handle a card flip. Returns the new game state.
 *
 * Rules:
 * - Can't flip a card that's already matched or already flipped
 * - Can't flip while the game is checking a pair
 * - First flip: reveal the card
 * - Second flip: reveal and check for match
 */
export function flipCard(
  state: MemoryMatchState,
  cardIndex: number
): MemoryMatchState {
  const card = state.cards[cardIndex];

  // Can't flip if: game over, currently checking, card already revealed
  if (state.isComplete || state.isChecking || card.isFlipped || card.isMatched) {
    return state;
  }

  const newCards = state.cards.map((c, i) =>
    i === cardIndex ? { ...c, isFlipped: true } : c
  );

  // First card of the pair
  if (state.firstFlipped === null) {
    return {
      ...state,
      cards: newCards,
      firstFlipped: cardIndex,
    };
  }

  // Second card — start checking
  return {
    ...state,
    cards: newCards,
    secondFlipped: cardIndex,
    isChecking: true,
    attempts: state.attempts + 1,
  };
}

/**
 * Check if the two flipped cards match.
 * Called after the reveal delay.
 * Returns the new state with cards either matched or flipped back.
 */
export function checkMatch(state: MemoryMatchState): MemoryMatchState {
  if (state.firstFlipped === null || state.secondFlipped === null) {
    return state;
  }

  const first = state.cards[state.firstFlipped];
  const second = state.cards[state.secondFlipped];
  const isMatch = first.pairId === second.pairId;

  const newCards = state.cards.map((card) => {
    if (isMatch && card.pairId === first.pairId) {
      return { ...card, isMatched: true, isFlipped: true };
    }
    if (!isMatch && (card.id === first.id || card.id === second.id)) {
      return { ...card, isFlipped: false };
    }
    return card;
  });

  const newMatchesFound = isMatch ? state.matchesFound + 1 : state.matchesFound;
  const isComplete = newMatchesFound === state.totalPairs;

  return {
    ...state,
    cards: newCards,
    firstFlipped: null,
    secondFlipped: null,
    isChecking: false,
    matchesFound: newMatchesFound,
    isComplete,
  };
}

/**
 * Calculate the game result when the game is complete.
 */
export function getResult(state: MemoryMatchState): MemoryMatchResult {
  return {
    totalPairs: state.totalPairs,
    attempts: state.attempts,
    correctMatches: state.matchesFound,
    accuracy: state.attempts > 0 ? state.matchesFound / state.attempts : 0,
    timeMs: Date.now() - state.startTime,
    level: state.level,
  };
}

/**
 * Find the index of the matching card for a given card.
 * Used for the hint system on Level 1 (errorless learning).
 */
export function findMatchIndex(state: MemoryMatchState, cardIndex: number): number {
  const card = state.cards[cardIndex];
  return state.cards.findIndex(
    (c, i) => i !== cardIndex && c.pairId === card.pairId
  );
}
