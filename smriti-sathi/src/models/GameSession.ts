// Game Session Model
// Stores individual game play results

export interface GameSession {
  id: string;
  patientId: string;
  gameType: 'remember' | 'recognise' | 'test';
  difficulty: number; // 1-5
  score: number; // correct answers
  totalObjects: number; // total objects to remember
  accuracy: number; // percentage 0-100
  responseTime: number; // seconds
  timestamp: number; // Unix timestamp
}

export interface GameStats {
  totalGames: number;
  averageAccuracy: number;
  averageResponseTime: number;
  bestScore: number;
  currentStreak: number;
}

export interface RememberObject {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

// Culturally appropriate objects for NE India context
export const REMEMBER_OBJECTS: RememberObject[] = [
  { id: 'cup', emoji: '🍵', name: 'Cup', category: 'daily' },
  { id: 'mango', emoji: '🥭', name: 'Mango', category: 'fruit' },
  { id: 'umbrella', emoji: '☂️', name: 'Umbrella', category: 'daily' },
  { id: 'flower', emoji: '🌸', name: 'Flower', category: 'nature' },
  { id: 'book', emoji: '📖', name: 'Book', category: 'daily' },
  { id: 'rice', emoji: '🍚', name: 'Rice Bowl', category: 'food' },
  { id: 'lamp', emoji: '🪔', name: 'Lamp', category: 'daily' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant', category: 'animal' },
  { id: 'bamboo', emoji: '🎋', name: 'Bamboo', category: 'nature' },
  { id: 'lotus', emoji: '🪷', name: 'Lotus', category: 'nature' },
  { id: 'drum', emoji: '🥁', name: 'Drum', category: 'music' },
  { id: 'fish', emoji: '🐟', name: 'Fish', category: 'animal' },
  { id: 'banana', emoji: '🍌', name: 'Banana', category: 'fruit' },
  { id: 'bird', emoji: '🐦', name: 'Bird', category: 'animal' },
  { id: 'sun', emoji: '☀️', name: 'Sun', category: 'nature' },
];
