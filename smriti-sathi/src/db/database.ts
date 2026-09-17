import Dexie, { type Table } from 'dexie';

export interface Patient {
  id?: number;
  name: string;
  age: number;
  language: string; // 'en' | 'as' | 'brx' | 'mni' | 'hi'
  photoUrl?: string;
  remindersEnabled?: {
    medicine: boolean;
    hydration: boolean;
    brainWorkout: boolean;
  };
  createdAt: Date;
}

export type CognitiveDomain =
  | 'workingMemory'
  | 'processingSpeed'
  | 'temporalOrientation'
  | 'attentionFocus'
  | 'careAdherence';

export interface GameSession {
  id?: number;
  patientId: number;
  gameType: 'memoryMatch' | 'dailyRoutine' | 'math' | 'language';
  domain?: CognitiveDomain;
  difficulty: number; // 1-4
  score: number;
  accuracy: number; // 0-1
  responseTimeMs: number;
  recallAccuracyFirstLook?: number; // Speed match working memory
  attemptCount?: number;            // Speed match attempt count
  latencyMs?: number;               // motor-visual latency (ms, render->touch)
  sequencingErrors?: number;        // Daily Routine sequencing
  distractorRejectionRate?: number; // Language distractor rejection
  playedAt: Date;
  synced: number; // 0 = not synced, 1 = synced
}

export interface Reminder {
  id?: number;
  patientId: number;
  type: 'medicine' | 'water' | 'activity' | 'appointment';
  label: string;
  timeHour: number; // 0-23
  timeMinute: number; // 0-59
  repeatDays: number[]; // 0=Sun, 1=Mon, ... 6=Sat. Empty = one-time
  isActive: boolean;
  lastAcked: Date | null;
}

export interface ReminderLog {
  id?: number;
  reminderId: number;
  patientId: number;
  scheduledAt: Date;
  acknowledgedAt: Date | null;
  synced: number;
}

export interface AppSetting {
  key: string;
  value: string;
}

export class SmritiSathiDB extends Dexie {
  patients!: Table<Patient>;
  gameSessions!: Table<GameSession>;
  reminders!: Table<Reminder>;
  reminderLogs!: Table<ReminderLog>;
  settings!: Table<AppSetting>;

  constructor() {
    super('SmritiSathiDB');
    this.version(1).stores({
      patients: '++id, name, language, createdAt',
      gameSessions: '++id, patientId, gameType, difficulty, playedAt, synced, [patientId+gameType]',
      reminders: '++id, patientId, type, isActive',
      reminderLogs: '++id, reminderId, patientId, scheduledAt, synced',
      settings: 'key',
    });
  }
}

export const db = new SmritiSathiDB();
