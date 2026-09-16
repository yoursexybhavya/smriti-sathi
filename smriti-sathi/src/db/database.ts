import Dexie, { type Table } from 'dexie';

export interface Patient {
  id?: number;
  name: string;
  age: number;
  language: string; // 'en' | 'as' | 'brx' | 'mni'
  createdAt: Date;
}

export interface GameSession {
  id?: number;
  patientId: number;
  gameType: 'memoryMatch' | 'dailyRoutine';
  difficulty: number; // 1-4
  score: number;
  accuracy: number; // 0-1
  responseTimeMs: number;
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
