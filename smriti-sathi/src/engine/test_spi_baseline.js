import { calculateMedian, calculateStdDev, evaluateDomainSpi } from './spiBaseline.ts';
import assert from 'assert';

console.log('=== RUNNING CLINICAL SPI ENGINE TESTS ===');

// Test 1: Mathematical helpers
const sampleValues = [10, 20, 30, 40, 50];
assert.strictEqual(calculateMedian(sampleValues), 30, 'Median calculation failed');
assert.strictEqual(calculateMedian([10, 20, 30, 40]), 25, 'Even median calculation failed');
console.log('✓ Test 1 Passed: Median calculation verified');

// Test 2: Single bad session in isolation NEVER triggers an alert
// Elder has 13 good sessions (score 85-95) and then 1 bad session (score 20) due to temporary tiredness.
const singleDropSessions = [];
const baseDate = new Date('2026-09-01T10:00:00Z');

for (let i = 0; i < 13; i++) {
  singleDropSessions.push({
    patientId: 1,
    gameType: 'memoryMatch',
    domain: 'workingMemory',
    difficulty: 2,
    score: 90,
    accuracy: 0.9,
    responseTimeMs: 2500,
    playedAt: new Date(baseDate.getTime() + i * 86400000),
    synced: 1,
  });
}

// Session 14 is a single bad session
singleDropSessions.push({
  patientId: 1,
  gameType: 'memoryMatch',
  domain: 'workingMemory',
  difficulty: 2,
  score: 20, // severe single-session dip
  accuracy: 0.2,
  responseTimeMs: 6500,
  playedAt: new Date(baseDate.getTime() + 13 * 86400000),
  synced: 1,
});

const reminderLogsGood = [
  { reminderId: 1, patientId: 1, scheduledAt: new Date(), acknowledgedAt: new Date(), synced: 1 },
  { reminderId: 2, patientId: 1, scheduledAt: new Date(), acknowledgedAt: new Date(), synced: 1 },
];

const singleDropResult = evaluateDomainSpi(1, 'workingMemory', singleDropSessions, reminderLogsGood);

assert.strictEqual(
  singleDropResult.ashaCheckInRecommended,
  false,
  'FAIL: Single bad session triggered ashaCheckInRecommended!'
);
assert.strictEqual(
  singleDropResult.consecutiveLowSessions,
  1,
  'FAIL: Consecutive low sessions should be 1'
);
console.log('✓ Test 2 Passed: Single bad session NEVER triggers ASHA check-in alert');

// Test 3: Sustained cognitive drop across 7+ sessions + repeated missed reminders DOES trigger check-in
const sustainedDropSessions = [];
for (let i = 0; i < 7; i++) {
  sustainedDropSessions.push({
    patientId: 1,
    gameType: 'memoryMatch',
    domain: 'workingMemory',
    difficulty: 2,
    score: 92,
    accuracy: 0.92,
    responseTimeMs: 2200,
    playedAt: new Date(baseDate.getTime() + i * 86400000),
    synced: 1,
  });
}
// 7 consecutive low sessions (drop > 2 SD)
for (let i = 7; i < 14; i++) {
  sustainedDropSessions.push({
    patientId: 1,
    gameType: 'memoryMatch',
    domain: 'workingMemory',
    difficulty: 2,
    score: 35, // sustained drop
    accuracy: 0.35,
    responseTimeMs: 7000,
    playedAt: new Date(baseDate.getTime() + i * 86400000),
    synced: 1,
  });
}

// Missed reminders in the same window
const reminderLogsMissed = [
  { reminderId: 1, patientId: 1, scheduledAt: new Date(), acknowledgedAt: null, synced: 0 },
  { reminderId: 2, patientId: 1, scheduledAt: new Date(), acknowledgedAt: null, synced: 0 },
  { reminderId: 3, patientId: 1, scheduledAt: new Date(), acknowledgedAt: null, synced: 0 },
];

const sustainedResult = evaluateDomainSpi(1, 'workingMemory', sustainedDropSessions, reminderLogsMissed);

assert.strictEqual(
  sustainedResult.ashaCheckInRecommended,
  true,
  'FAIL: Sustained drop across 7 sessions with missed reminders did not trigger ASHA check-in!'
);
assert.ok(
  sustainedResult.consecutiveLowSessions >= 7,
  'FAIL: Should register >= 7 consecutive low sessions'
);
assert.ok(
  sustainedResult.rationale.includes('ASHA worker'),
  'FAIL: Rationale should recommend friendly ASHA worker check-in'
);
assert.ok(
  !sustainedResult.rationale.toLowerCase().includes('dementia detected'),
  'FAIL: Must never use diagnostic terminology!'
);
console.log('✓ Test 3 Passed: Sustained 7-session drop + missed reminders triggers non-diagnostic ASHA recommendation');

console.log('=== ALL CLINICAL SPI TESTS PASSED SUCCESSFULLY ===');
