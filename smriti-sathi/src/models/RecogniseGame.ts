// Recognise Game Objects and Activities
// Pattern recognition and visual sequence activities

import { RememberObject, REMEMBER_OBJECTS } from './GameSession';

export type RecogniseActivityType = 'pattern' | 'odd-one-out' | 'sequence';

export interface RecogniseActivity {
  type: RecogniseActivityType;
  question: string;
  options: string[];
  correctAnswer: string;
  objects: RememberObject[];
}

export class RecogniseGameEngine {
  /**
   * Generate a pattern completion activity
   * Example: APPLE → BANANA → APPLE → ?
   */
  static generatePatternActivity(difficulty: number): RecogniseActivity {
    // Select 2-3 objects based on difficulty
    const objectCount = Math.min(2 + Math.floor(difficulty / 2), 3);
    const selectedObjects = this.selectRandomObjects(objectCount);
    
    // Create a repeating pattern
    const pattern = selectedObjects.map(obj => obj.id);
    const patternLength = pattern.length;
    
    // Show pattern twice, then ask for next
    const displayPattern = [...pattern, ...pattern];
    const nextInPattern = pattern[0]; // Pattern repeats
    
    // Generate wrong options
    const wrongOptions = this.generateWrongOptions(
      nextInPattern,
      REMEMBER_OBJECTS.map(o => o.id),
      3
    );
    
    // Shuffle options
    const options = this.shuffleArray([nextInPattern, ...wrongOptions]);
    
    // Convert IDs to emoji for display
    const optionImageUrls = options.map((id: string) => {
      const obj = REMEMBER_OBJECTS.find((o: RememberObject) => o.id === id);
      return obj ? obj.imageUrl : '?';
    });
    
    const correctImageUrl = REMEMBER_OBJECTS.find((o: RememberObject) => o.id === nextInPattern)?.imageUrl || '?';
    
    return {
      type: 'pattern',
      question: 'What comes next in the pattern?',
      options: optionImageUrls,
      correctAnswer: correctImageUrl,
      objects: selectedObjects,
    };
  }

  /**
   * Generate an odd-one-out activity
   * Show 4 objects, one is different category
   */
  static generateOddOneOutActivity(difficulty: number): RecogniseActivity {
    // Select objects from different categories
    const categories = ['fruit', 'animal', 'daily', 'nature'];
    const mainCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get 3 objects from main category
    const mainObjects = REMEMBER_OBJECTS.filter(o => o.category === mainCategory);
    const selectedMain = this.shuffleArray(mainObjects).slice(0, 3);
    
    // Get 1 object from different category
    const otherCategories = categories.filter(c => c !== mainCategory);
    const differentCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    const differentObjects = REMEMBER_OBJECTS.filter(o => o.category === differentCategory);
    const oddOne = differentObjects[Math.floor(Math.random() * differentObjects.length)];
    
    // Combine and shuffle
    const allObjects = [...selectedMain, oddOne];
    const shuffledObjects = this.shuffleArray(allObjects);
    
    const options = shuffledObjects.map((o: RememberObject) => o.imageUrl);
    const correctAnswer = oddOne.imageUrl;
    
    return {
      type: 'odd-one-out',
      question: 'Which one is different?',
      options,
      correctAnswer,
      objects: shuffledObjects,
    };
  }

  /**
   * Generate a visual sequence activity
   * Show a sequence and ask what's missing
   */
  static generateSequenceActivity(difficulty: number): RecogniseActivity {
    // Select 4-5 objects based on difficulty
    const objectCount = Math.min(4 + Math.floor(difficulty / 2), 5);
    const selectedObjects = this.selectRandomObjects(objectCount);
    
    // Remove one object from the middle
    const removeIndex = Math.floor(Math.random() * (objectCount - 2)) + 1;
    const missingObject = selectedObjects[removeIndex];
    
    // Create sequence with gap
    const sequence = selectedObjects.filter((_, i) => i !== removeIndex);
    
    // Generate wrong options
    const wrongOptions = this.generateWrongOptions(
      missingObject.id,
      REMEMBER_OBJECTS.map(o => o.id),
      3
    );
    
    // Shuffle options
    const options = this.shuffleArray([missingObject.id, ...wrongOptions]);
    const optionImageUrls = options.map((id: string) => {
      const obj = REMEMBER_OBJECTS.find((o: RememberObject) => o.id === id);
      return obj ? obj.imageUrl : '?';
    });
    
    const correctImageUrl = missingObject.imageUrl;
    
    // Create display sequence with gap
    const displaySequence = sequence.map((o: RememberObject) => o.imageUrl);
    displaySequence.splice(removeIndex, 0, '?');
    
    return {
      type: 'sequence',
      question: 'What is missing in the sequence?',
      options: optionImageUrls,
      correctAnswer: correctImageUrl,
      objects: selectedObjects,
    };
  }

  /**
   * Generate a random activity based on difficulty
   */
  static generateActivity(difficulty: number): RecogniseActivity {
    const activities: RecogniseActivityType[] = ['pattern', 'odd-one-out', 'sequence'];
    const randomType = activities[Math.floor(Math.random() * activities.length)];
    
    switch (randomType) {
      case 'pattern':
        return this.generatePatternActivity(difficulty);
      case 'odd-one-out':
        return this.generateOddOneOutActivity(difficulty);
      case 'sequence':
        return this.generateSequenceActivity(difficulty);
    }
  }

  /**
   * Select random objects
   */
  private static selectRandomObjects(count: number): RememberObject[] {
    return this.shuffleArray([...REMEMBER_OBJECTS]).slice(0, count);
  }

  /**
   * Generate wrong options (not including the correct answer)
   */
  private static generateWrongOptions(
    correctId: string,
    allIds: string[],
    count: number
  ): string[] {
    const available = allIds.filter(id => id !== correctId);
    return this.shuffleArray(available).slice(0, count);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
