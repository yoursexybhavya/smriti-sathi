// Recognise Game Objects and Activities
// Pattern recognition and visual sequence activities with clinical cognitive ordering

import { RememberObject, REMEMBER_OBJECTS } from './GameSession';

export type RecogniseActivityType = 'pattern' | 'odd-one-out' | 'sequence';

export interface RecogniseActivity {
  type: RecogniseActivityType;
  question: string;
  options: string[];
  correctAnswer: string;
  objects: RememberObject[];
  patternHint?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  animal: 'Animal',
  fruit: 'Fruit',
  vehicle: 'Vehicle',
  daily: 'Household',
  nature: 'Nature',
};

const MAIN_CATEGORIES = ['animal', 'fruit', 'vehicle', 'daily'];

export class RecogniseGameEngine {
  /**
   * Helper: Filter objects by category
   */
  private static getObjectsByCategory(category: string): RememberObject[] {
    return REMEMBER_OBJECTS.filter((o) => o.category === category);
  }

  /**
   * Helper: Pick N random distinct categories
   */
  private static getDistinctCategories(count: number): string[] {
    const shuffled = this.shuffleArray([...MAIN_CATEGORIES]);
    return shuffled.slice(0, count);
  }

  /**
   * Helper: Shuffle array using Fisher-Yates
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Helper: Pick wrong distractors that do NOT belong to forbidden categories or IDs
   */
  private static pickDistractors(
    correctId: string,
    forbiddenCategory: string,
    count: number
  ): string[] {
    // Pick objects outside the target category and not matching correctId
    const candidates = REMEMBER_OBJECTS.filter(
      (o) => o.id !== correctId && o.category !== forbiddenCategory
    );
    const shuffled = this.shuffleArray(candidates);
    return shuffled.slice(0, count).map((o) => o.imageUrl);
  }

  /**
   * Level 1 & 2: Direct Alternating Pattern (ABAB)
   * Example: BIRD → MANGO → BIRD → ? (Answer: MANGO)
   */
  static generatePatternActivity(difficulty: number): RecogniseActivity {
    const [catA, catB] = this.getDistinctCategories(2);
    const itemsA = this.shuffleArray(this.getObjectsByCategory(catA));
    const itemsB = this.shuffleArray(this.getObjectsByCategory(catB));

    const objA = itemsA[0];
    const objB = itemsB[0];

    // Difficulty 1: 3-item sequence [A, B, A] -> Target B, 2 options
    // Difficulty >= 2: 3 or 4 item sequence, 4 options
    const isLevel1 = difficulty <= 1;
    const isFourSeq = difficulty >= 3 && Math.random() > 0.5;

    let displaySequence: RememberObject[];
    let targetObj: RememberObject;

    if (isFourSeq) {
      displaySequence = [objA, objB, objA, objB];
      targetObj = objA; // A comes next
    } else {
      displaySequence = [objA, objB, objA];
      targetObj = objB; // B comes next
    }

    const distractorCount = isLevel1 ? 1 : 3;
    const wrongOptions = this.pickDistractors(targetObj.id, targetObj.category, distractorCount);
    const options = this.shuffleArray([targetObj.imageUrl, ...wrongOptions]);

    const hint = `Pattern: ${objA.name} → ${objB.name} → ${objA.name} → ${targetObj.name}`;

    return {
      type: 'pattern',
      question: 'What comes next in the pattern?',
      options,
      correctAnswer: targetObj.imageUrl,
      objects: displaySequence,
      patternHint: hint,
    };
  }

  /**
   * Level 3: Semantic Category Alternation (Type ABAB)
   * Example: [Bird (animal)] → [Apple (fruit)] → [Dog (animal)] → ? (Answer: [Banana (fruit)])
   * Directly implements categorical type ordering so dementia patients recognize
   * the alternating concept: Animal → Fruit → Animal → [Fruit].
   */
  static generateCategoryAlternationActivity(difficulty: number): RecogniseActivity {
    const [catA, catB] = this.getDistinctCategories(2);
    const itemsA = this.shuffleArray(this.getObjectsByCategory(catA));
    const itemsB = this.shuffleArray(this.getObjectsByCategory(catB));

    // 2 distinct items from category A, 2 distinct items from category B
    const a1 = itemsA[0];
    const a2 = itemsA[1] || itemsA[0];
    const b1 = itemsB[0];
    const b2 = itemsB[1] || itemsB[0];

    const displaySequence = [a1, b1, a2];
    const targetObj = b2; // Next must be a member of Category B!

    // Distractors must come from outside category B, so targetObj is the ONLY valid category answer
    const wrongOptions = this.pickDistractors(targetObj.id, catB, 3);
    const options = this.shuffleArray([targetObj.imageUrl, ...wrongOptions]);

    const catAName = CATEGORY_NAMES[catA] || 'Item';
    const catBName = CATEGORY_NAMES[catB] || 'Item';
    const hint = `Type pattern: ${catAName} → ${catBName} → ${catAName} → ${catBName}`;

    return {
      type: 'sequence',
      question: `What comes next? (${catAName} → ${catBName} → ${catAName} → ...)`,
      options,
      correctAnswer: targetObj.imageUrl,
      objects: displaySequence,
      patternHint: hint,
    };
  }

  /**
   * Level 4: Paired Category Pattern (Type AABB)
   * Example: [Cat (animal)] → [Cow (animal)] → [Mango (fruit)] → ? (Answer: [Apple (fruit)])
   */
  static generatePairedCategoryActivity(difficulty: number): RecogniseActivity {
    const [catA, catB] = this.getDistinctCategories(2);
    const itemsA = this.shuffleArray(this.getObjectsByCategory(catA));
    const itemsB = this.shuffleArray(this.getObjectsByCategory(catB));

    const a1 = itemsA[0];
    const a2 = itemsA[1] || itemsA[0];
    const b1 = itemsB[0];
    const b2 = itemsB[1] || itemsB[0];

    const displaySequence = [a1, a2, b1];
    const targetObj = b2;

    const wrongOptions = this.pickDistractors(targetObj.id, catB, 3);
    const options = this.shuffleArray([targetObj.imageUrl, ...wrongOptions]);

    const catAName = CATEGORY_NAMES[catA] || 'Item';
    const catBName = CATEGORY_NAMES[catB] || 'Item';
    const hint = `Pair pattern: 2 ${catAName}s, then 2 ${catBName}s`;

    return {
      type: 'sequence',
      question: `What comes next in the pair pattern?`,
      options,
      correctAnswer: targetObj.imageUrl,
      objects: displaySequence,
      patternHint: hint,
    };
  }

  /**
   * Level 5: Triplet Rotation Pattern (ABC-ABC)
   * Example: [Bird] → [Apple] → [Car] → [Bird] → [Apple] → ? (Answer: [Car])
   */
  static generateTripletActivity(difficulty: number): RecogniseActivity {
    const [catA, catB, catC] = this.getDistinctCategories(3);
    const objA = this.shuffleArray(this.getObjectsByCategory(catA))[0];
    const objB = this.shuffleArray(this.getObjectsByCategory(catB))[0];
    const objC = this.shuffleArray(this.getObjectsByCategory(catC))[0];

    const displaySequence = [objA, objB, objC, objA, objB];
    const targetObj = objC;

    const wrongOptions = this.pickDistractors(targetObj.id, catC, 3);
    const options = this.shuffleArray([targetObj.imageUrl, ...wrongOptions]);

    const hint = `Triplet: ${objA.name} → ${objB.name} → ${objC.name} → ...`;

    return {
      type: 'pattern',
      question: 'What comes next in the sequence?',
      options,
      correctAnswer: targetObj.imageUrl,
      objects: displaySequence,
      patternHint: hint,
    };
  }

  /**
   * Odd-one-out activity (preserved for backward compatibility)
   */
  static generateOddOneOutActivity(difficulty: number): RecogniseActivity {
    const categories = ['fruit', 'animal', 'daily', 'vehicle'];
    const mainCategory = categories[Math.floor(Math.random() * categories.length)];
    const mainObjects = REMEMBER_OBJECTS.filter((o) => o.category === mainCategory);
    const selectedMain = this.shuffleArray(mainObjects).slice(0, 3);

    const otherCategories = categories.filter((c) => c !== mainCategory);
    const differentCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    const differentObjects = REMEMBER_OBJECTS.filter((o) => o.category === differentCategory);
    const oddOne = differentObjects[Math.floor(Math.random() * differentObjects.length)];

    const allObjects = [...selectedMain, oddOne];
    const shuffledObjects = this.shuffleArray(allObjects);

    const options = shuffledObjects.map((o) => o.imageUrl);
    const correctAnswer = oddOne.imageUrl;

    const mainCatLabel = CATEGORY_NAMES[mainCategory] || 'Items';
    const question = `3 are ${mainCatLabel}. Tap the one that does NOT belong:`;

    return {
      type: 'odd-one-out',
      question,
      options,
      correctAnswer,
      objects: shuffledObjects,
      patternHint: `Look for the one item that is not a ${mainCatLabel}`,
    };
  }

  /**
   * Sequence activity (delegates to category alternation for clear semantic ordering)
   */
  static generateSequenceActivity(difficulty: number): RecogniseActivity {
    return this.generateCategoryAlternationActivity(difficulty);
  }

  /**
   * Primary entry point: Generate a predictable, logical activity based on difficulty
   * Level 1: Direct 2-item alternation (2 choices)
   * Level 2: Direct 2-item alternation (4 choices)
   * Level 3: Semantic Category Alternation (Type ABAB - e.g. Animal -> Fruit -> Animal -> [Fruit])
   * Level 4: Paired Category Pattern (Type AABB) or Category Alternation
   * Level 5: Triplet Rotation (ABC-ABC) or Paired Pattern
   */
  static generateActivity(difficulty: number): RecogniseActivity {
    const clampedDiff = Math.max(1, Math.min(5, Math.round(difficulty) || 1));

    switch (clampedDiff) {
      case 1:
        return this.generatePatternActivity(1);
      case 2:
        return this.generatePatternActivity(2);
      case 3:
        return this.generateCategoryAlternationActivity(3);
      case 4:
        return Math.random() < 0.5
          ? this.generateCategoryAlternationActivity(4)
          : this.generatePairedCategoryActivity(4);
      case 5:
      default:
        return Math.random() < 0.5
          ? this.generatePairedCategoryActivity(5)
          : this.generateTripletActivity(5);
    }
  }
}
