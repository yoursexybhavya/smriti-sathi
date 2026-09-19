/**
 * SMRITI SATHI — Demo Data Service
 * 
 * Provides sample data for testing and validation.
 * Creates a populated experience for patient "Aai Devi"
 */

import { db } from '../database/db';

export interface DemoPatient {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  profileImage?: string;
}

export const DEMO_PATIENT: DemoPatient = {
  id: 'demo_aai_devi',
  name: 'Aai Devi',
  age: 72,
  preferredLanguage: 'hi',
  profileImage: undefined,
};

class DemoDataServiceClass {
  private isDemoMode: boolean = false;

  /**
   * Initialize demo data for Aai Devi
   */
  async initializeDemoData(): Promise<void> {
    console.log('[DemoData] Initializing demo data for Aai Devi...');
    
    // Clear existing data
    await this.clearAllData();

    // Create patient profile
    const userId = await db.users.add({
      name: DEMO_PATIENT.name,
      age: DEMO_PATIENT.age,
      preferredLanguage: DEMO_PATIENT.preferredLanguage,
      profileImage: DEMO_PATIENT.profileImage,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      updatedAt: Date.now(),
    });

    // Generate 7 days of game sessions
    await this.generateGameSessions(userId);

    // Generate reminder history
    await this.generateReminders(userId);

    // Generate progress data
    await this.generateProgressData(userId);

    // Generate memory items
    await this.generateMemoryItems(userId);

    // Create settings
    await db.settings.add({
      userId,
      textSize: 'large',
      highContrast: false,
      voiceGuidance: true,
      updatedAt: Date.now(),
    });

    this.isDemoMode = true;
    console.log('[DemoData] Demo data initialized successfully');
  }

  /**
   * Generate demo data - accepts optional userId for compatibility
   */
  async generateDemoData(_userId?: number): Promise<void> {
    return this.initializeDemoData();
  }

  /**
   * Generate 7 days of game sessions with varying performance
   */
  private async generateGameSessions(userId: number): Promise<void> {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Performance trend: improving over time
    const performanceData = [
      { dayOffset: 6, accuracy: 45, responseTime: 4200, difficulty: 1 },
      { dayOffset: 5, accuracy: 52, responseTime: 3800, difficulty: 1 },
      { dayOffset: 4, accuracy: 58, responseTime: 3500, difficulty: 2 },
      { dayOffset: 3, accuracy: 65, responseTime: 3200, difficulty: 2 },
      { dayOffset: 2, accuracy: 72, responseTime: 2900, difficulty: 2 },
      { dayOffset: 1, accuracy: 78, responseTime: 2600, difficulty: 3 },
      { dayOffset: 0, accuracy: 85, responseTime: 2400, difficulty: 3 },
    ];

    for (const data of performanceData) {
      const timestamp = now - data.dayOffset * dayMs;
      
      // Remember game session
      await db.gameSessions.add({
        userId,
        gameType: 'remember',
        difficulty: data.difficulty,
        score: Math.round(data.accuracy * 10),
        totalObjects: 6 + data.difficulty,
        accuracy: data.accuracy,
        responseTime: data.responseTime,
        createdAt: timestamp,
      });

      // Recognise game session
      await db.gameSessions.add({
        userId,
        gameType: 'recognise',
        difficulty: data.difficulty,
        score: Math.round((data.accuracy - 5) * 10),
        totalObjects: 6 + data.difficulty,
        accuracy: data.accuracy - 5,
        responseTime: data.responseTime + 300,
        createdAt: timestamp + 1000,
      });
    }

    console.log('[DemoData] Generated 14 game sessions (7 days × 2 games)');
  }

  /**
   * Generate reminder history with varying adherence
   */
  private async generateReminders(userId: number): Promise<void> {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;

    const reminderTypes: Array<'medicine' | 'hydration' | 'activity' | 'appointment'> = [
      'medicine', 'hydration', 'activity', 'medicine'
    ];

    for (let day = 0; day < 7; day++) {
      for (let i = 0; i < reminderTypes.length; i++) {
        const scheduledTime = now - day * dayMs + (8 + i * 3) * hourMs;
        const isCompleted = Math.random() > 0.2; // 80% completion rate
        const isPast = scheduledTime < now;
        
        let status: 'pending' | 'completed' | 'missed';
        if (!isPast) {
          status = 'pending';
        } else if (isCompleted) {
          status = 'completed';
        } else {
          status = 'missed';
        }

        const reminderId = await db.reminders.add({
          userId,
          type: reminderTypes[i],
          title: this.getReminderTitle(reminderTypes[i]),
          scheduledTime,
          status,
          createdAt: scheduledTime - dayMs,
        });

        // If completed, add completion record
        if (status === 'completed') {
          await db.reminderCompletions.add({
            reminderId,
            userId,
            completedAt: scheduledTime + 5 * 60 * 1000,
          });
        }
      }
    }

    // Future reminders (next 3 days)
    for (let day = 1; day <= 3; day++) {
      for (let i = 0; i < 2; i++) {
        const scheduledTime = now + day * dayMs + (9 + i * 4) * hourMs;
        
        await db.reminders.add({
          userId,
          type: reminderTypes[i],
          title: this.getReminderTitle(reminderTypes[i]),
          scheduledTime,
          status: 'pending',
          createdAt: now,
        });
      }
    }

    console.log('[DemoData] Generated reminder history');
  }

  /**
   * Generate progress data for charts
   */
  private async generateProgressData(userId: number): Promise<void> {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let day = 0; day < 7; day++) {
      const date = new Date(now - day * dayMs);
      const dateStr = date.toISOString().split('T')[0];

      await db.progress.add({
        userId,
        date: dateStr,
        gamesPlayed: 2,
        totalScore: (45 + day * 7) * 20,
        averageAccuracy: 45 + day * 7,
        streak: day + 1,
        updatedAt: now - day * dayMs,
      });
    }

    console.log('[DemoData] Generated 7 days of progress data');
  }

  /**
   * Generate memory items for Memory Book
   */
  private async generateMemoryItems(userId: number): Promise<void> {
    const memoryItems = [
      {
        category: 'family' as const,
        title: 'My Family',
        subject: 'Family members',
        description: 'My children and grandchildren',
      },
      {
        category: 'places' as const,
        title: 'My Home',
        subject: 'Family house',
        description: 'The house where I raised my family',
      },
      {
        category: 'memories' as const,
        title: 'Wedding Day',
        subject: 'Wedding ceremony',
        description: 'A beautiful day in 1975',
      },
    ];

    for (const item of memoryItems) {
      await db.memoryItems.add({
        userId,
        category: item.category,
        title: item.title,
        subject: item.subject,
        description: item.description,
        imageData: undefined,
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
      });
    }

    console.log('[DemoData] Generated 3 memory items');
  }

  /**
   * Get reminder title based on type
   */
  private getReminderTitle(type: 'medicine' | 'hydration' | 'activity' | 'appointment'): string {
    const titles = {
      medicine: 'Take morning medicine',
      hydration: 'Drink water',
      activity: 'Evening walk',
      appointment: 'Doctor appointment',
    };
    return titles[type];
  }

  /**
   * Clear all demo data
   */
  async clearAllData(): Promise<void> {
    console.log('[DemoData] Clearing all data...');
    
    await db.users.clear();
    await db.gameSessions.clear();
    await db.reminders.clear();
    await db.reminderCompletions.clear();
    await db.progress.clear();
    await db.syncEvents.clear();
    await db.settings.clear();
    await db.memoryItems.clear();

    this.isDemoMode = false;
    console.log('[DemoData] All data cleared');
  }

  /**
   * Reset demo data (clear and reinitialize)
   */
  async resetDemoData(): Promise<void> {
    await this.clearAllData();
    await this.initializeDemoData();
  }

  /**
   * Check if demo mode is active
   */
  isDemoActive(): boolean {
    return this.isDemoMode;
  }

  /**
   * Get demo statistics
   */
  async getDemoStats(): Promise<{
    totalGameSessions: number;
    totalReminders: number;
    totalProgressDays: number;
    totalMemoryItems: number;
  }> {
    const [gameSessions, reminders, progress, memoryItems] = await Promise.all([
      db.gameSessions.count(),
      db.reminders.count(),
      db.progress.count(),
      db.memoryItems.count(),
    ]);

    return {
      totalGameSessions: gameSessions,
      totalReminders: reminders,
      totalProgressDays: progress,
      totalMemoryItems: memoryItems,
    };
  }
}

export const DemoDataService = new DemoDataServiceClass();
export const demoDataService = DemoDataService;
