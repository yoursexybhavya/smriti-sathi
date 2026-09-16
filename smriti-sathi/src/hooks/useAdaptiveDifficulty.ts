/**
 * useAdaptiveDifficulty — React Hook
 *
 * Connects the pure difficulty engine to React state and IndexedDB.
 * Loads the player's difficulty state from their game history,
 * and saves new sessions after each game.
 */

import { useState, useEffect, useCallback } from 'react';
import { db, type GameSession } from '../db/database';
import {
  type GameType,
  type DifficultyState,
  createDifficultyState,
  adjustDifficulty,
} from '../games/difficulty';

interface UseAdaptiveDifficultyReturn {
  currentLevel: number;
  difficultyState: DifficultyState;
  saveGameAndAdjust: (accuracy: number, score: number, responseTimeMs: number) => Promise<void>;
  isLoading: boolean;
}

/**
 * Reconstruct the difficulty state from a player's game history.
 * Replays the last few games through the difficulty engine.
 */
async function loadDifficultyFromHistory(
  patientId: number,
  gameType: GameType
): Promise<DifficultyState> {
  // Get the last 10 games of this type, ordered by most recent
  const recentGames = await db.gameSessions
    .where('[patientId+gameType]')
    .equals([patientId, gameType])
    .reverse()
    .limit(10)
    .toArray();

  if (recentGames.length === 0) {
    return createDifficultyState(gameType);
  }

  // Replay from oldest to newest to reconstruct state
  const chronological = recentGames.reverse();
  let state = createDifficultyState(gameType);

  // Start from the last known difficulty level
  state.currentLevel = chronological[0].difficulty;

  for (const game of chronological) {
    state = adjustDifficulty(state, game.accuracy);
  }

  return state;
}

export function useAdaptiveDifficulty(
  patientId: number | undefined,
  gameType: GameType
): UseAdaptiveDifficultyReturn {
  const [difficultyState, setDifficultyState] = useState<DifficultyState>(
    createDifficultyState(gameType)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load difficulty from history on mount
  useEffect(() => {
    if (patientId === undefined) {
      setIsLoading(false);
      return;
    }

    loadDifficultyFromHistory(patientId, gameType).then((state) => {
      setDifficultyState(state);
      setIsLoading(false);
    });
  }, [patientId, gameType]);

  // Save a game session and adjust difficulty
  const saveGameAndAdjust = useCallback(
    async (accuracy: number, score: number, responseTimeMs: number) => {
      if (patientId === undefined) return;

      // Save to IndexedDB
      const session: GameSession = {
        patientId,
        gameType,
        difficulty: difficultyState.currentLevel,
        score,
        accuracy,
        responseTimeMs,
        playedAt: new Date(),
        synced: 0,
      };

      await db.gameSessions.add(session);

      // Adjust difficulty
      const newState = adjustDifficulty(difficultyState, accuracy);
      setDifficultyState(newState);
    },
    [patientId, gameType, difficultyState]
  );

  return {
    currentLevel: difficultyState.currentLevel,
    difficultyState,
    saveGameAndAdjust,
    isLoading,
  };
}
