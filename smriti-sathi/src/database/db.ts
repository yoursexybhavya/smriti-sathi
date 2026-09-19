import Dexie, { Table } from 'dexie';

// Database Models
export interface User {
  id?: number;
  name: string;
  age: number;
  preferredLanguage: string;
  profileImage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface GameSession {
  id?: number;
  userId: number;
  gameType: 'remember' | 'recognise' | 'test' | 'memory_match';
  difficulty: number;
  score: number;
  totalObjects: number;
  accuracy: number;
  responseTime: number;
  createdAt: number;
}

export interface Reminder {
  id?: number;
  userId: number;
  type: 'medicine' | 'hydration' | 'activity' | 'appointment';
  title: string;
  description?: string;
  scheduledTime: number;
  repeatPattern?: 'daily' | 'weekly' | 'none';
  status: 'pending' | 'completed' | 'missed';
  createdAt: number;
}

export interface ReminderCompletion {
  id?: number;
  reminderId: number;
  userId: number;
  completedAt: number;
}

export interface Progress {
  id?: number;
  userId: number;
  date: string; // YYYY-MM-DD
  gamesPlayed: number;
  totalScore: number;
  averageAccuracy: number;
  streak: number;
  updatedAt: number;
}

export interface SyncEvent {
  id?: number;
  uuid: string; // Unique ID for idempotency
  entityType: 'user' | 'game_session' | 'reminder' | 'reminder_completion' | 'progress' | 'settings' | 'memory_item';
  entityId: number;
  operation: 'create' | 'update' | 'delete';
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  createdAt: number;
  syncedAt?: number;
  payload?: string; // JSON serialized entity data for replay
}

export interface Settings {
  id?: number;
  userId: number;
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  voiceGuidance: boolean;
  updatedAt: number;
}

export interface MemoryItem {
  id?: number;
  userId: number;
  category: 'family' | 'places' | 'objects' | 'memories';
  title: string;
  subject: string; // person/place/object name
  description: string;
  imageData?: string; // base64 encoded image
  date?: string; // optional date
  voiceNote?: string; // optional voice note placeholder
  createdAt: number;
  updatedAt: number;
}

// Database Class
export class SmritiSathiDatabase extends Dexie {
  users!: Table<User>;
  gameSessions!: Table<GameSession>;
  reminders!: Table<Reminder>;
  reminderCompletions!: Table<ReminderCompletion>;
  progress!: Table<Progress>;
  syncEvents!: Table<SyncEvent>;
  settings!: Table<Settings>;
  memoryItems!: Table<MemoryItem>;

  constructor() {
    super('SmritiSathiDB');

    this.version(3).stores({
      users: '++id, name, createdAt',
      gameSessions: '++id, userId, gameType, createdAt',
      reminders: '++id, userId, type, status, scheduledTime',
      reminderCompletions: '++id, reminderId, userId, completedAt',
      progress: '++id, userId, date',
      syncEvents: '++id, uuid, entityType, entityId, syncStatus, createdAt',
      settings: '++id, userId',
      memoryItems: '++id, userId, category, createdAt',
    });
  }
}

// Singleton instance
export const db = new SmritiSathiDatabase();
