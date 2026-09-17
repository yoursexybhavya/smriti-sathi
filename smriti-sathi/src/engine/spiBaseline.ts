/**
 * Smriti Sathi — Rule-Based Cognitive Stability Index (SPI) Engine
 * Reference: Smriti_Sathi_Judge_Defense_and_Clinical_Validity.pdf
 *
 * Core Clinical Principles:
 * 1. 14-session moving median baseline per elder, per cognitive domain.
 * 2. An alert triggers ONLY when:
 *    - Score drops > 2 standard deviations below the baseline moving median,
 *    - The drop is sustained across >= 7 consecutive sessions, AND
 *    - Repeated missed routine care reminders are recorded in the same window.
 * 3. A single bad session (fatigue, bad day, distraction) NEVER triggers an alert.
 * 4. Output is strictly non-diagnostic: prompts for human clinical review by ASHA worker.
 */

import type { CognitiveDomain, GameSession, ReminderLog } from '../db/database';

export interface DomainBaseline {
  domain: CognitiveDomain;
  sessionCount: number;
  median: number;
  stdDev: number;
  recentSessions: number[];
}

export interface SpiEvaluationResult {
  elderId: number;
  domain: CognitiveDomain;
  baselineMedian: number;
  baselineStdDev: number;
  recentMedian: number;
  consecutiveLowSessions: number;
  missedRemindersInWindow: number;
  totalRemindersInWindow: number;
  reminderAdherencePct: number;
  ashaCheckInRecommended: boolean;
  rationale: string;
  trendData: {
    sessionId?: number;
    playedAt: Date;
    score: number;
    accuracy: number;
    latencyMs?: number;
    isDrop: boolean;
  }[];
}

/**
 * Calculates the mathematical median of a numeric series
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  return (sorted[half - 1] + sorted[half]) / 2;
}

/**
 * Calculates the sample standard deviation of a numeric series
 */
export function calculateStdDev(values: number[], mean?: number): number {
  if (values.length < 2) return 0;
  const avg = mean !== undefined ? mean : values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Evaluates cognitive stability index (SPI) for a specific elder and domain
 *
 * @param elderId Active elder ID
 * @param domain Cognitive domain to evaluate
 * @param sessions Chronologically sorted game sessions (oldest to newest)
 * @param reminderLogs Reminder logs occurring in the same evaluation window
 * @returns SpiEvaluationResult with human-actionable, non-diagnostic guidance
 */
export function evaluateDomainSpi(
  elderId: number,
  domain: CognitiveDomain,
  sessions: GameSession[],
  reminderLogs: ReminderLog[] = []
): SpiEvaluationResult {
  // Filter sessions matching elder and domain
  const domainSessions = sessions.filter(
    (s) =>
      s.patientId === elderId &&
      (s.domain === domain ||
        (domain === 'workingMemory' && s.gameType === 'memoryMatch') ||
        (domain === 'temporalOrientation' && s.gameType === 'dailyRoutine') ||
        (domain === 'processingSpeed' && s.gameType === 'math') ||
        (domain === 'attentionFocus' && s.gameType === 'language'))
  );

  // Default neutral evaluation if insufficient data
  if (domainSessions.length < 7) {
    return {
      elderId,
      domain,
      baselineMedian: 0,
      baselineStdDev: 0,
      recentMedian: 0,
      consecutiveLowSessions: 0,
      missedRemindersInWindow: 0,
      totalRemindersInWindow: reminderLogs.length,
      reminderAdherencePct: 100,
      ashaCheckInRecommended: false,
      rationale:
        'Baseline calibration in progress. At least 7 to 14 daily sessions are required to establish an elder-specific moving median.',
      trendData: domainSessions.map((s) => ({
        sessionId: s.id,
        playedAt: new Date(s.playedAt),
        score: s.score,
        accuracy: s.accuracy,
        latencyMs: s.latencyMs || s.responseTimeMs,
        isDrop: false,
      })),
    };
  }

  // Baseline calibration window: 14-session moving median established from prior stable history
  let baselineCandidates = domainSessions;
  if (domainSessions.length >= 14) {
    // If >= 14 sessions, use earlier reference sessions up to 14 prior to the current 7-session evaluation window
    baselineCandidates = domainSessions.slice(Math.max(0, domainSessions.length - 21), -7);
    if (baselineCandidates.length < 7) {
      baselineCandidates = domainSessions.slice(0, 14);
    }
  } else {
    // 7-13 calibration sessions: reference first half
    baselineCandidates = domainSessions.slice(0, Math.max(7, Math.floor(domainSessions.length / 2)));
  }

  const baselineScores = baselineCandidates.map((s) => s.score);
  const baselineMedian = calculateMedian(baselineScores);
  const baselineStdDev = calculateStdDev(baselineScores, baselineMedian) || 6; // fallback min stdDev to prevent division by 0

  // Define threshold: > 2 standard deviations below baseline median
  const dropThreshold = Math.max(0, baselineMedian - 2 * baselineStdDev);

  // Analyze the most recent window (last 7 sessions)
  const recentSessions = domainSessions.slice(-7);
  const recentScores = recentSessions.map((s) => s.score);
  const recentMedian = calculateMedian(recentScores);

  // Count consecutive sessions below dropThreshold
  let consecutiveLowSessions = 0;
  for (let i = domainSessions.length - 1; i >= 0; i--) {
    if (domainSessions[i].score < dropThreshold) {
      consecutiveLowSessions++;
    } else {
      break;
    }
  }

  // Check missed routine reminders in the window
  const totalRemindersInWindow = reminderLogs.length;
  const missedRemindersInWindow = reminderLogs.filter((r) => !r.acknowledgedAt).length;
  const reminderAdherencePct =
    totalRemindersInWindow > 0
      ? Math.round(
          ((totalRemindersInWindow - missedRemindersInWindow) / totalRemindersInWindow) * 100
        )
      : 100;

  // RULE CHECK:
  // 1. Drop > 2 SD sustained across >= 7 consecutive sessions
  // 2. AND missed routine reminders in the same window (e.g. >= 2 missed or adherence < 70%)
  const hasSustainedCognitiveDrop = consecutiveLowSessions >= 7;
  const hasRoutineAdherenceDrop = missedRemindersInWindow >= 2 || reminderAdherencePct < 70;

  // Single bad sessions NEVER trigger ashaCheckInRecommended:
  const ashaCheckInRecommended = hasSustainedCognitiveDrop && hasRoutineAdherenceDrop;

  let rationale = '';
  if (ashaCheckInRecommended) {
    rationale =
      "Elder's cognitive markers have shown a sustained variance across 7+ sessions alongside repeated missed routine reminders. Consider scheduling a routine check-in with the local ASHA worker or PHC medical officer.";
  } else if (hasSustainedCognitiveDrop && !hasRoutineAdherenceDrop) {
    rationale =
      "Activity scores show temporary variation, but daily routine adherence remains steady. Continuing standard daily observation.";
  } else if (consecutiveLowSessions > 0 && consecutiveLowSessions < 7) {
    rationale =
      "Normal day-to-day session variance observed (isolated session change). No sustained pattern detected.";
  } else {
    rationale =
      "Cognitive markers and daily care engagement remain stable within normal baseline variability.";
  }

  const trendData = domainSessions.map((s) => ({
    sessionId: s.id,
    playedAt: new Date(s.playedAt),
    score: s.score,
    accuracy: s.accuracy,
    latencyMs: s.latencyMs || s.responseTimeMs,
    isDrop: s.score < dropThreshold,
  }));

  return {
    elderId,
    domain,
    baselineMedian: Math.round(baselineMedian),
    baselineStdDev: Math.round(baselineStdDev * 10) / 10,
    recentMedian: Math.round(recentMedian),
    consecutiveLowSessions,
    missedRemindersInWindow,
    totalRemindersInWindow,
    reminderAdherencePct,
    ashaCheckInRecommended,
    rationale,
    trendData,
  };
}
