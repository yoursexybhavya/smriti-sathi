/**
 * Smriti Sathi — Clinical Demonstration Data Seeder
 * Reference: Smriti_Sathi_Judge_Defense_and_Clinical_Validity.pdf
 *
 * Seeds realistic 14-session longitudinal trajectories for judges & evaluators:
 * 1. Baa (আইতা) — Stable Cognitive Baseline (14 sessions, normal moving median ~92, 100% reminder adherence)
 * 2. Ram Chandra — Sustained Variance & Care Signal (14 sessions: 7 normal + 7 low, missed routine reminders -> triggers ASHA check-in signal)
 * 3. Biren Boro (आदै बिरेन) — Multilingual Bodo profile (7 sessions, stable math & orientation)
 */

import { db, type Patient, type GameSession, type ReminderLog } from './database';

export async function seedDemoProfiles(): Promise<number> {
  const now = new Date();
  const dayMs = 86400000;

  // 1. Create Elder 1: Baa (Stable Care)
  const baaElder: Patient = {
    name: 'Baa (আইতা) — Stable Care',
    age: 72,
    language: 'as',
    remindersEnabled: { medicine: true, hydration: true, brainWorkout: true },
    createdAt: new Date(now.getTime() - 15 * dayMs),
  };
  const baaId = await db.patients.add(baaElder);

  // 2. Create Elder 2: Ram Chandra (ASHA Review Signal)
  const ramElder: Patient = {
    name: 'Ram Chandra — ASHA Review Signal',
    age: 76,
    language: 'en',
    remindersEnabled: { medicine: true, hydration: true, brainWorkout: true },
    createdAt: new Date(now.getTime() - 15 * dayMs),
  };
  const ramId = await db.patients.add(ramElder);

  // 3. Create Elder 3: Biren Boro (Bodo Language)
  const birenElder: Patient = {
    name: 'Biren Boro (आदै बिरेन)',
    age: 68,
    language: 'brx',
    remindersEnabled: { medicine: true, hydration: true, brainWorkout: true },
    createdAt: new Date(now.getTime() - 8 * dayMs),
  };
  const birenId = await db.patients.add(birenElder);

  // Seed Baa's 14 sessions (Stable moving median ~90-95)
  const baaSessions: GameSession[] = [];
  const baaLogs: ReminderLog[] = [];
  for (let i = 14; i >= 1; i--) {
    const sessionDate = new Date(now.getTime() - i * dayMs + 3600000 * 10);
    const score = Math.floor(88 + Math.random() * 8); // 88 - 95
    baaSessions.push({
      patientId: baaId,
      gameType: i % 2 === 0 ? 'memoryMatch' : 'dailyRoutine',
      domain: i % 2 === 0 ? 'workingMemory' : 'temporalOrientation',
      difficulty: 2,
      score,
      accuracy: score / 100,
      responseTimeMs: Math.floor(2100 + Math.random() * 400),
      recallAccuracyFirstLook: i % 2 === 0 ? 0.92 : undefined,
      sequencingErrors: i % 2 === 1 ? 0 : undefined,
      playedAt: sessionDate,
      synced: 1,
    });

    // Reminders acknowledged promptly
    baaLogs.push({
      reminderId: 1,
      patientId: baaId,
      scheduledAt: new Date(now.getTime() - i * dayMs + 3600000 * 9),
      acknowledgedAt: new Date(now.getTime() - i * dayMs + 3600000 * 9 + 180000),
      synced: 1,
    });
  }

  // Seed Ram Chandra's 14 sessions (7 days normal baseline + 7 days sustained >2 SD drop)
  const ramSessions: GameSession[] = [];
  const ramLogs: ReminderLog[] = [];
  for (let i = 14; i >= 1; i--) {
    const sessionDate = new Date(now.getTime() - i * dayMs + 3600000 * 10);
    const isDropPeriod = i <= 7; // Last 7 days are sustained drop
    const score = isDropPeriod
      ? Math.floor(32 + Math.random() * 8) // 32 - 40 (severe sustained drop)
      : Math.floor(88 + Math.random() * 6); // 88 - 94 (normal baseline)

    ramSessions.push({
      patientId: ramId,
      gameType: 'memoryMatch',
      domain: 'workingMemory',
      difficulty: 2,
      score,
      accuracy: score / 100,
      responseTimeMs: isDropPeriod ? Math.floor(6500 + Math.random() * 1200) : Math.floor(2300 + Math.random() * 400),
      latencyMs: isDropPeriod ? 7200 : 2400,
      recallAccuracyFirstLook: isDropPeriod ? 0.35 : 0.90,
      attemptCount: isDropPeriod ? 4 : 1,
      playedAt: sessionDate,
      synced: 1,
    });

    // In drop period, routine reminders were missed (acknowledgedAt = null)
    ramLogs.push({
      reminderId: 1,
      patientId: ramId,
      scheduledAt: new Date(now.getTime() - i * dayMs + 3600000 * 9),
      acknowledgedAt: isDropPeriod && i % 2 === 1 ? null : new Date(now.getTime() - i * dayMs + 3600000 * 9 + 300000),
      synced: 1,
    });
  }

  // Seed Biren Boro's 7 sessions
  const birenSessions: GameSession[] = [];
  for (let i = 7; i >= 1; i--) {
    const sessionDate = new Date(now.getTime() - i * dayMs + 3600000 * 11);
    const score = Math.floor(85 + Math.random() * 10);
    birenSessions.push({
      patientId: birenId,
      gameType: 'math',
      domain: 'processingSpeed',
      difficulty: 1,
      score,
      accuracy: score / 100,
      responseTimeMs: 2900,
      playedAt: sessionDate,
      synced: 1,
    });
  }

  await db.gameSessions.bulkAdd([...baaSessions, ...ramSessions, ...birenSessions]);
  await db.reminderLogs.bulkAdd([...baaLogs, ...ramLogs]);

  // Set Baa as active patient by default
  await db.settings.put({ key: 'activePatientId', value: baaId.toString() });
  await db.settings.put({ key: 'setup_completed', value: 'true' });
  await db.settings.put({ key: 'caregiver_pin', value: '1234' });

  return baaId;
}
