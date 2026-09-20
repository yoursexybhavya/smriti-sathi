import { memoryItemRepository } from '../database/repositories/MemoryItemRepository';
import { MemoryItem } from '../database/db';
import { voiceReminderService } from './voice/VoiceReminderService';

export type MemoryCategory = 'family' | 'places' | 'objects' | 'memories';

export interface MemoryItemInput {
  userId: number;
  category: MemoryCategory;
  title: string;
  subject: string;
  description: string;
  imageData?: string;
  date?: string;
  voiceNote?: string;
  relation?: string;
  hobbies?: string[];
  characteristics?: string[];
  phoneNumber?: string;
}

export interface FamilyQuizOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  isCorrect: boolean;
  audioText: string;
}

export interface FamilyQuizQuestion {
  id: string;
  type: 'who_is_this' | 'hobby' | 'characteristic';
  relative: MemoryItem;
  promptText: string;
  promptTextRegional: string;
  audioPrompt: string;
  targetAnswer: string;
  options: FamilyQuizOption[];
  explanationText: string;
}

export class MemoryBookService {
  /**
   * Create a new memory item
   */
  async createMemoryItem(input: MemoryItemInput): Promise<number> {
    return await memoryItemRepository.create(input);
  }

  /**
   * Get all memory items for a user
   */
  async getAllMemoryItems(userId: number): Promise<MemoryItem[]> {
    return await memoryItemRepository.getByUserId(userId);
  }

  /**
   * Get memory items by category
   */
  async getMemoryItemsByCategory(userId: number, category: MemoryCategory): Promise<MemoryItem[]> {
    return await memoryItemRepository.getByCategory(userId, category);
  }

  /**
   * Get a single memory item
   */
  async getMemoryItem(id: number): Promise<MemoryItem | undefined> {
    return await memoryItemRepository.getById(id);
  }

  /**
   * Update a memory item
   */
  async updateMemoryItem(id: number, updates: Partial<MemoryItemInput>): Promise<void> {
    await memoryItemRepository.update(id, updates);
  }

  /**
   * Delete a memory item
   */
  async deleteMemoryItem(id: number): Promise<void> {
    await memoryItemRepository.delete(id);
  }

  /**
   * Get memory item count
   */
  async getMemoryItemCount(userId: number): Promise<number> {
    return await memoryItemRepository.getCount(userId);
  }

  /**
   * Get memory item count by category
   */
  async getMemoryItemCountByCategory(userId: number, category: MemoryCategory): Promise<number> {
    return await memoryItemRepository.getCountByCategory(userId, category);
  }

  /**
   * Process and compress image for storage
   */
  async processImage(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality for storage
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Speak memory item description
   */
  async speakMemoryDescription(item: MemoryItem, patientName?: string): Promise<void> {
    const text = `${item.title}. ${item.subject}. ${item.description}`;
    
    await voiceReminderService.speak({
      text,
      patientName,
      rate: 0.8, // Slower for better comprehension
      pitch: 1.0,
      volume: 1.0,
    });
  }

  /**
   * Get category display name
   */
  getCategoryDisplayName(category: MemoryCategory): string {
    const names: Record<MemoryCategory, string> = {
      family: 'My Family',
      places: 'My Places',
      objects: 'Important Objects',
      memories: 'My Memories',
    };
    return names[category];
  }

  /**
   * Get category icon emoji
   */
  getCategoryIcon(category: MemoryCategory): string {
    const icons: Record<MemoryCategory, string> = {
      family: '👨‍👩‍👧‍👦',
      places: '🏠',
      objects: '📿',
      memories: '📸',
    };
    return icons[category];
  }

  /**
   * Get all categories
   */
  getAllCategories(): MemoryCategory[] {
    return ['family', 'places', 'objects', 'memories'];
  }

  /**
   * Create sample memory items for demonstration
   */
  async createSampleMemories(userId: number): Promise<void> {
    const sampleItems: MemoryItemInput[] = [
      {
        userId,
        category: 'family',
        title: 'Aarav',
        subject: 'Grandson / নাতি',
        relation: 'Grandson (নাতি)',
        hobbies: ['Playing football', 'Drawing pictures'],
        characteristics: ['Loves grandma ladoos', 'Calls every afternoon at 4 PM'],
        phoneNumber: '+91 98765 43210',
        description: 'My sweet grandson Aarav. He is 8 years old. He loves playing football and brings his drawings to show me.',
        date: '2024-01-10',
      },
      {
        userId,
        category: 'family',
        title: 'Anita',
        subject: 'Daughter / জীয়াৰী',
        relation: 'Daughter (জীয়াৰী)',
        hobbies: ['Gardening', 'Cooking Bihu sweets'],
        characteristics: ['Lives in Guwahati', 'Visits every Sunday morning with fresh sweets'],
        phoneNumber: '+91 98123 45678',
        description: 'My daughter Anita. She lives in Guwahati with her family. She visits every Sunday and makes sweet pitha.',
        date: '2024-01-15',
      },
      {
        userId,
        category: 'family',
        title: 'Rajesh',
        subject: 'Son / পুত্ৰ',
        relation: 'Son (পুত্ৰ)',
        hobbies: ['Morning walk', 'Reading Assamese books'],
        characteristics: ['Doctor in Assam Medical College', 'Calls every evening at 8 PM'],
        phoneNumber: '+91 98234 56789',
        description: 'My son Rajesh. He works as a doctor in Assam Medical College. He calls every evening to check on my health.',
        date: '2024-02-10',
      },
      {
        userId,
        category: 'places',
        title: 'Our Home',
        subject: 'Family House',
        description: 'Our family home in Shillong. We have lived here for 40 years. The garden has many flowers.',
        date: '1984-05-20',
      },
      {
        userId,
        category: 'places',
        title: 'Market',
        subject: 'Local Market',
        description: 'The local market where I buy vegetables and fruits. I go every morning.',
      },
      {
        userId,
        category: 'objects',
        title: 'Wedding Ring',
        subject: 'Marriage Ring',
        description: 'My wedding ring from 1975. It is gold with a small stone.',
        date: '1975-11-12',
      },
      {
        userId,
        category: 'objects',
        title: 'Prayer Beads',
        subject: 'Mala',
        description: 'My prayer beads. I use them every morning for prayer.',
      },
      {
        userId,
        category: 'memories',
        title: 'Wedding Day',
        subject: 'Marriage Ceremony',
        description: 'My wedding day in 1975. It was a beautiful ceremony with family and friends.',
        date: '1975-11-12',
      },
      {
        userId,
        category: 'memories',
        title: 'Festival Time',
        subject: 'Bihu Celebration',
        description: 'Celebrating Bihu festival with family. We dance and eat traditional food.',
        date: '2023-04-14',
      },
    ];

    for (const item of sampleItems) {
      await this.createMemoryItem(item);
    }
  }

  /**
   * Generate questions for the Family Memory Book Game
   */
  async getFamilyQuizQuestions(userId: number): Promise<FamilyQuizQuestion[]> {
    let familyItems = await this.getMemoryItemsByCategory(userId, 'family');
    
    // Auto-seed if empty so the elder never faces a blank game
    if (familyItems.length === 0) {
      await this.createSampleMemories(userId);
      familyItems = await this.getMemoryItemsByCategory(userId, 'family');
    }

    const questions: FamilyQuizQuestion[] = [];

    for (const relative of familyItems) {
      const relName = relative.title;
      const relation = relative.relation || relative.subject || 'Family Member';
      const hobbies = relative.hobbies && relative.hobbies.length > 0 ? relative.hobbies : ['Drinking afternoon tea'];

      // 1. Who is this relative?
      const otherRelatives = familyItems.filter(f => f.id !== relative.id);
      const distractor1 = otherRelatives[0]?.title ? `${otherRelatives[0].title} (${otherRelatives[0].relation || otherRelatives[0].subject})` : 'Ramesh (Neighbor)';
      const distractor2 = otherRelatives[1]?.title ? `${otherRelatives[1].title} (${otherRelatives[1].relation || otherRelatives[1].subject})` : 'Dr. Baruah (Doctor)';

      const whoOptions: FamilyQuizOption[] = [
        {
          id: `${relative.id}-who-correct`,
          label: relName,
          sublabel: relation,
          icon: '❤️',
          isCorrect: true,
          audioText: `${relName}, your ${relation}`,
        },
        {
          id: `${relative.id}-who-w1`,
          label: distractor1.split(' (')[0],
          sublabel: distractor1.includes('(') ? distractor1.split('(')[1].replace(')', '') : undefined,
          icon: '👤',
          isCorrect: false,
          audioText: distractor1,
        },
        {
          id: `${relative.id}-who-w2`,
          label: distractor2.split(' (')[0],
          sublabel: distractor2.includes('(') ? distractor2.split('(')[1].replace(')', '') : undefined,
          icon: '👤',
          isCorrect: false,
          audioText: distractor2,
        },
      ].sort(() => Math.random() - 0.5);

      questions.push({
        id: `who-${relative.id}`,
        type: 'who_is_this',
        relative,
        promptText: `Who is this person in your family?`,
        promptTextRegional: `আপোনাৰ পৰিয়ালৰ এই মৰমৰ মানুহজন কোন?`,
        audioPrompt: `Look at this photo. Who is this person in your family?`,
        targetAnswer: `${relName} (${relation})`,
        options: whoOptions,
        explanationText: `Yes, wonderful! This is ${relName}, your loving ${relation}.`,
      });

      // 2. What does this relative love doing?
      const primaryHobby = hobbies[0];
      const hobbyDistractor1 = primaryHobby.toLowerCase().includes('football') ? 'Singing Bihu folk songs' : 'Playing football in the field';
      const hobbyDistractor2 = primaryHobby.toLowerCase().includes('tea') ? 'Riding a bicycle' : 'Drinking warm afternoon tea';

      const hobbyOptions: FamilyQuizOption[] = [
        {
          id: `${relative.id}-hobby-correct`,
          label: primaryHobby,
          icon: primaryHobby.toLowerCase().includes('football') ? '⚽' : primaryHobby.toLowerCase().includes('tea') ? '🍵' : primaryHobby.toLowerCase().includes('gardening') ? '🌸' : '🌟',
          isCorrect: true,
          audioText: primaryHobby,
        },
        {
          id: `${relative.id}-hobby-w1`,
          label: hobbyDistractor1,
          icon: hobbyDistractor1.includes('football') ? '⚽' : '🎶',
          isCorrect: false,
          audioText: hobbyDistractor1,
        },
        {
          id: `${relative.id}-hobby-w2`,
          label: hobbyDistractor2,
          icon: hobbyDistractor2.includes('bicycle') ? '🚲' : '🍵',
          isCorrect: false,
          audioText: hobbyDistractor2,
        },
      ].sort(() => Math.random() - 0.5);

      questions.push({
        id: `hobby-${relative.id}`,
        type: 'hobby',
        relative,
        promptText: `What does ${relName} (${relation}) love doing?`,
        promptTextRegional: `${relName} (${relation}) এ কি কাম কৰি ভাল পায়?`,
        audioPrompt: `What is ${relName}'s favorite hobby or activity?`,
        targetAnswer: primaryHobby,
        options: hobbyOptions,
        explanationText: `Exactly! ${relName} loves ${primaryHobby}!`,
      });
    }

    return questions;
  }
}

export const memoryBookService = new MemoryBookService();
