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
        title: 'Anita',
        subject: 'Daughter',
        description: 'My daughter Anita. She lives in Guwahati with her family. She visits every Sunday.',
        date: '2024-01-15',
      },
      {
        userId,
        category: 'family',
        title: 'Rajesh',
        subject: 'Son',
        description: 'My son Rajesh. He works in Delhi. He calls every evening.',
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
}

export const memoryBookService = new MemoryBookService();
