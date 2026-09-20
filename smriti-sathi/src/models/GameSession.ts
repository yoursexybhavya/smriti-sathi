// Game Session Model
// Stores individual game play results

export interface GameSession {
  id: string;
  patientId: string;
  gameType: 'remember' | 'recognise' | 'test' | 'memory_match' | 'family_quiz';
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
  imageUrl: string;
  name: string;
  category: string;
}

// Culturally appropriate objects for NE India context
export const REMEMBER_OBJECTS: RememberObject[] = [
  { id: 'cup', imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=400&q=80', name: 'Cup', category: 'daily' },
  { id: 'mango', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80', name: 'Mango', category: 'fruit' },
  { id: 'apple', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80', name: 'Apple', category: 'fruit' },
  { id: 'banana', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', name: 'Banana', category: 'fruit' },
  { id: 'orange', imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=400&q=80', name: 'Orange', category: 'fruit' },
  { id: 'umbrella', imageUrl: 'https://images.unsplash.com/photo-1556015048-393289073a6a?auto=format&fit=crop&w=400&q=80', name: 'Umbrella', category: 'daily' },
  { id: 'flower', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80', name: 'Flower', category: 'nature' },
  { id: 'book', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', name: 'Book', category: 'daily' },
  { id: 'rice', imageUrl: 'https://images.unsplash.com/photo-1536972781907-7d00f682dfec?auto=format&fit=crop&w=400&q=80', name: 'Rice Bowl', category: 'daily' },
  { id: 'lamp', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', name: 'Lamp', category: 'daily' },
  { id: 'elephant', imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80', name: 'Elephant', category: 'animal' },
  { id: 'cow', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80', name: 'Cow', category: 'animal' },
  { id: 'cat', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', name: 'Cat', category: 'animal' },
  { id: 'dog', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', name: 'Dog', category: 'animal' },
  { id: 'bird', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=400&q=80', name: 'Bird', category: 'animal' },
  { id: 'bicycle', imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80', name: 'Bicycle', category: 'vehicle' },
  { id: 'car', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80', name: 'Car', category: 'vehicle' },
  { id: 'bus', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', name: 'Bus', category: 'vehicle' },
  { id: 'boat', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80', name: 'Boat', category: 'vehicle' },
  { id: 'tree', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80', name: 'Tree', category: 'nature' },
  { id: 'house', imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80', name: 'House', category: 'daily' },
  { id: 'shoes', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', name: 'Shoes', category: 'daily' },
  { id: 'phone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', name: 'Phone', category: 'daily' },
  { id: 'key', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', name: 'Key', category: 'daily' }
];
