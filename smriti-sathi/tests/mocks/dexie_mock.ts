/**
 * In-Memory Dexie Database Mock for Smriti Sathi E2E Testing
 * Fully implements the SmritiSathiDB schema including Blob storage
 * without requiring native browser IndexedDB.
 */

import type { Reminder, ReminderLog, GameSession, Patient, AppSetting } from '../../src/db/database';

export class MockDexieTable<T extends { id?: number }> {
  private items = new Map<number, T>();
  private autoIncrementId = 1;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async add(item: T): Promise<number> {
    const id = item.id !== undefined ? item.id : this.autoIncrementId++;
    const cloned = { ...item, id };
    this.items.set(id, cloned);
    return id;
  }

  async put(item: T): Promise<number> {
    const id = item.id !== undefined ? item.id : this.autoIncrementId++;
    const cloned = { ...item, id };
    this.items.set(id, cloned);
    return id;
  }

  async get(id: number): Promise<T | undefined> {
    const item = this.items.get(id);
    return item ? { ...item } : undefined;
  }

  async update(id: number, changes: Partial<T>): Promise<number> {
    const item = this.items.get(id);
    if (!item) return 0;
    const updated = { ...item, ...changes };
    this.items.set(id, updated);
    return 1;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }

  async clear(): Promise<void> {
    this.items.clear();
    this.autoIncrementId = 1;
  }

  async toArray(): Promise<T[]> {
    return Array.from(this.items.values()).map((item) => ({ ...item }));
  }

  async count(): Promise<number> {
    return this.items.size;
  }

  async bulkAdd(items: T[]): Promise<number> {
    let lastId = 0;
    for (const item of items) {
      lastId = await this.add(item);
    }
    return lastId;
  }

  where(key: keyof T | string) {
    const self = this;
    return {
      equals: (val: unknown) => ({
        toArray: async (): Promise<T[]> => {
          const all = await self.toArray();
          return all.filter((item) => {
            const record = item as Record<string, unknown>;
            return record[key as string] === val;
          });
        },
        first: async (): Promise<T | undefined> => {
          const results = await this.equals(val).toArray();
          return results[0];
        },
        count: async (): Promise<number> => {
          const results = await this.equals(val).toArray();
          return results.length;
        },
        modify: async (changes: Partial<T>): Promise<number> => {
          const matching = await this.equals(val).toArray();
          let count = 0;
          for (const m of matching) {
            if (m.id !== undefined) {
              await self.update(m.id, changes);
              count++;
            }
          }
          return count;
        },
      }),
      anyOf: (vals: unknown[]) => ({
        toArray: async (): Promise<T[]> => {
          const all = await self.toArray();
          const valSet = new Set(vals);
          return all.filter((item) => {
            const record = item as Record<string, unknown>;
            return valSet.has(record[key as string]);
          });
        },
      }),
    };
  }
}

export class MockSmritiSathiDB {
  patients = new MockDexieTable<Patient>('patients');
  gameSessions = new MockDexieTable<GameSession>('gameSessions');
  reminders = new MockDexieTable<Reminder>('reminders');
  reminderLogs = new MockDexieTable<ReminderLog>('reminderLogs');
  settings = new MockDexieTable<AppSetting & { id?: number }>('settings');

  async clearAll(): Promise<void> {
    await this.patients.clear();
    await this.gameSessions.clear();
    await this.reminders.clear();
    await this.reminderLogs.clear();
    await this.settings.clear();
  }
}

export function createMockDatabase(): MockSmritiSathiDB {
  return new MockSmritiSathiDB();
}
