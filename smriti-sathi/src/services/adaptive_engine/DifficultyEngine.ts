// Difficulty Engine for Remember Game
// Deterministic local logic - no ML models

import { RememberObject, REMEMBER_OBJECTS } from '../../models/GameSession';

export interface DifficultyConfig {
  level: number;
  objectCount: number; // Number of objects to remember
  distractorCount: number; // Number of distractors in recall phase
  memorizeTime: number; // Seconds to memorize
  description: string;
}

export class DifficultyEngine {
  // Get configuration for a difficulty level
  static getConfig(level: number): DifficultyConfig {
    const configs: Record<number, DifficultyConfig> = {
      1: {
        level: 1,
        objectCount: 3,
        distractorCount: 9,
        memorizeTime: 15,
        description: 'Easy - 3 objects',
      },
      2: {
        level: 2,
        objectCount: 4,
        distractorCount: 8,
        memorizeTime: 15,
        description: 'Moderate - 4 objects',
      },
      3: {
        level: 3,
        objectCount: 5,
        distractorCount: 7,
        memorizeTime: 18,
        description: 'Challenging - 5 objects',
      },
      4: {
        level: 4,
        objectCount: 6,
        distractorCount: 6,
        memorizeTime: 20,
        description: 'Difficult - 6 objects',
      },
      5: {
        level: 5,
        objectCount: 6,
        distractorCount: 6,
        memorizeTime: 15, // Less time for same objects = more complex
        description: 'Expert - 6 objects, less time',
      },
    };

    return configs[level] || configs[1];
  }

  // Select random objects for the game
  static selectObjects(count: number): RememberObject[] {
    const shuffled = [...REMEMBER_OBJECTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Select distractors (objects not in the target set)
  static selectDistractors(
    targetObjects: RememberObject[],
    count: number
  ): RememberObject[] {
    const targetIds = new Set(targetObjects.map(o => o.id));
    const available = REMEMBER_OBJECTS.filter(o => !targetIds.has(o.id));
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Create the recall set (target objects + distractors, shuffled)
  static createRecallSet(
    targetObjects: RememberObject[],
    distractorCount: number
  ): RememberObject[] {
    const distractors = this.selectDistractors(targetObjects, distractorCount);
    const recallSet = [...targetObjects, ...distractors];
    return recallSet.sort(() => Math.random() - 0.5);
  }

  // Calculate score and accuracy
  static calculateScore(
    selectedObjects: RememberObject[],
    targetObjects: RememberObject[]
  ): { score: number; accuracy: number } {
    const targetIds = new Set(targetObjects.map(o => o.id));
    const selectedIds = new Set(selectedObjects.map(o => o.id));

    // Count correct selections
    let correct = 0;
    selectedIds.forEach(id => {
      if (targetIds.has(id)) {
        correct++;
      }
    });

    const score = correct;
    const accuracy = targetObjects.length > 0 
      ? Math.round((correct / targetObjects.length) * 100)
      : 0;

    return { score, accuracy };
  }

  // Get supportive message based on performance
  static getSupportiveMessage(accuracy: number, score: number, total: number): string {
    if (accuracy === 100) {
      return `Well done. You remembered all ${total} objects.`;
    } else if (accuracy >= 80) {
      return `Well done. You remembered ${score} out of ${total} objects.`;
    } else if (accuracy >= 60) {
      return `Good effort. You remembered ${score} out of ${total} objects.`;
    } else if (accuracy >= 40) {
      return `You remembered ${score} out of ${total} objects. Let's try again.`;
    } else {
      return `You remembered ${score} out of ${total} objects. Practice makes progress.`;
    }
  }

  // Suggest next difficulty level based on performance
  static suggestNextLevel(currentLevel: number, accuracy: number): number {
    if (accuracy >= 90 && currentLevel < 5) {
      return currentLevel + 1; // Increase difficulty
    } else if (accuracy < 50 && currentLevel > 1) {
      return currentLevel - 1; // Decrease difficulty
    }
    return currentLevel; // Keep same level
  }

  // Get all available difficulty levels
  static getAllLevels(): DifficultyConfig[] {
    return [1, 2, 3, 4, 5].map(level => this.getConfig(level));
  }
}
