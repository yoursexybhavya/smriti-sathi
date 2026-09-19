// Adaptive Difficulty Service
// Deterministic difficulty adjustment based on recent performance
// NOT a clinical or diagnostic tool - for cognitive engagement personalization only

import { GameSession } from '../../models/GameSession';
import { GameStorage } from '../storage/GameStorage';

export interface DifficultyAdjustment {
  currentDifficulty: number;
  suggestedDifficulty: number;
  reason: string;
  recentAccuracy: number;
  recentResponseTime: number;
  sessionsAnalyzed: number;
}

export class AdaptiveDifficultyService {
  // Configuration
  private static readonly MIN_DIFFICULTY = 1;
  private static readonly MAX_DIFFICULTY = 5;
  private static readonly RECENT_SESSIONS_COUNT = 5; // Analyze last 5 sessions
  private static readonly HIGH_PERFORMANCE_THRESHOLD = 80; // >= 80% accuracy
  private static readonly LOW_PERFORMANCE_THRESHOLD = 50; // < 50% accuracy
  private static readonly FAST_RESPONSE_THRESHOLD = 10; // < 10 seconds = fast
  private static readonly SLOW_RESPONSE_THRESHOLD = 20; // > 20 seconds = slow

  /**
   * Calculate suggested difficulty based on recent performance
   * Uses deterministic rules, not machine learning
   */
  static async calculateSuggestedDifficulty(
    patientId: string,
    gameType: string,
    currentDifficulty: number
  ): Promise<DifficultyAdjustment> {
    // Get recent sessions for this patient and game type
    const allSessions = await GameStorage.getGameSessions(patientId, gameType);
    const recentSessions = allSessions
      .sort((a: GameSession, b: GameSession) => b.timestamp - a.timestamp)
      .slice(0, this.RECENT_SESSIONS_COUNT);

    // If no recent sessions, maintain current difficulty
    if (recentSessions.length === 0) {
      return {
        currentDifficulty,
        suggestedDifficulty: currentDifficulty,
        reason: 'No recent activity data available',
        recentAccuracy: 0,
        recentResponseTime: 0,
        sessionsAnalyzed: 0,
      };
    }

    // Calculate average accuracy from recent sessions
    const totalAccuracy = recentSessions.reduce((sum: number, s: GameSession) => sum + s.accuracy, 0);
    const recentAccuracy = totalAccuracy / recentSessions.length;

    // Calculate average response time
    const totalTime = recentSessions.reduce((sum: number, s: GameSession) => sum + s.responseTime, 0);
    const recentResponseTime = totalTime / recentSessions.length;

    // Determine suggested difficulty
    let suggestedDifficulty = currentDifficulty;
    let reason = '';

    // Rule 1: High performance (>= 80% accuracy)
    if (recentAccuracy >= this.HIGH_PERFORMANCE_THRESHOLD) {
      // Check if response time is also fast (confident high performance)
      if (recentResponseTime < this.FAST_RESPONSE_THRESHOLD) {
        suggestedDifficulty = Math.min(currentDifficulty + 1, this.MAX_DIFFICULTY);
        reason = 'Excellent performance with quick responses';
      } else {
        suggestedDifficulty = Math.min(currentDifficulty + 1, this.MAX_DIFFICULTY);
        reason = 'High accuracy achieved';
      }
    }
    // Rule 2: Low performance (< 50% accuracy)
    else if (recentAccuracy < this.LOW_PERFORMANCE_THRESHOLD) {
      // Check if response time is slow (struggling)
      if (recentResponseTime > this.SLOW_RESPONSE_THRESHOLD) {
        suggestedDifficulty = Math.max(currentDifficulty - 1, this.MIN_DIFFICULTY);
        reason = 'Performance needs support - reducing difficulty';
      } else {
        suggestedDifficulty = Math.max(currentDifficulty - 1, this.MIN_DIFFICULTY);
        reason = 'Lower accuracy detected';
      }
    }
    // Rule 3: Medium performance (50-79% accuracy)
    else {
      // Maintain current difficulty
      suggestedDifficulty = currentDifficulty;
      reason = 'Steady performance - maintaining difficulty';
    }

    // Clamp to valid range
    suggestedDifficulty = Math.max(
      this.MIN_DIFFICULTY,
      Math.min(this.MAX_DIFFICULTY, suggestedDifficulty)
    );

    return {
      currentDifficulty,
      suggestedDifficulty,
      reason,
      recentAccuracy: Math.round(recentAccuracy),
      recentResponseTime: Math.round(recentResponseTime),
      sessionsAnalyzed: recentSessions.length,
    };
  }

  /**
   * Get user-friendly message about difficulty adjustment
   */
  static getAdjustmentMessage(adjustment: DifficultyAdjustment): string {
    if (adjustment.sessionsAnalyzed === 0) {
      return 'Starting at your current level.';
    }

    if (adjustment.suggestedDifficulty > adjustment.currentDifficulty) {
      return 'Difficulty adjusted for your recent activity. Well done.';
    } else if (adjustment.suggestedDifficulty < adjustment.currentDifficulty) {
      return 'Difficulty adjusted for your recent activity. Let\'s take it step by step.';
    } else {
      return 'Difficulty adjusted for your recent activity.';
    }
  }

  /**
   * Get performance summary for display
   */
  static async getPerformanceSummary(
    patientId: string,
    gameType: string
  ): Promise<{
    totalSessions: number;
    averageAccuracy: number;
    averageResponseTime: number;
    trend: 'improving' | 'stable' | 'declining';
  }> {
    const sessions = await GameStorage.getGameSessions(patientId, gameType);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageAccuracy: 0,
        averageResponseTime: 0,
        trend: 'stable',
      };
    }

    const totalSessions = sessions.length;
    const averageAccuracy = sessions.reduce((sum: number, s: GameSession) => sum + s.accuracy, 0) / totalSessions;
    const averageResponseTime = sessions.reduce((sum: number, s: GameSession) => sum + s.responseTime, 0) / totalSessions;

    // Determine trend by comparing recent vs older sessions
    const recentSessions = sessions
      .sort((a: GameSession, b: GameSession) => b.timestamp - a.timestamp)
      .slice(0, Math.min(3, totalSessions));
    
    const olderSessions = sessions
      .sort((a: GameSession, b: GameSession) => b.timestamp - a.timestamp)
      .slice(Math.min(3, totalSessions));

    if (olderSessions.length === 0) {
      return {
        totalSessions,
        averageAccuracy: Math.round(averageAccuracy),
        averageResponseTime: Math.round(averageResponseTime),
        trend: 'stable',
      };
    }

    const recentAvg = recentSessions.reduce((sum: number, s: GameSession) => sum + s.accuracy, 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum: number, s: GameSession) => sum + s.accuracy, 0) / olderSessions.length;

    const diff = recentAvg - olderAvg;
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    
    if (diff > 10) trend = 'improving';
    else if (diff < -10) trend = 'declining';

    return {
      totalSessions,
      averageAccuracy: Math.round(averageAccuracy),
      averageResponseTime: Math.round(averageResponseTime),
      trend,
    };
  }

  /**
   * Test helper: Simulate performance scenario
   */
  static simulateScenario(
    currentDifficulty: number,
    recentAccuracies: number[],
    recentResponseTimes: number[]
  ): DifficultyAdjustment {
    // Create mock sessions
    const mockSessions: GameSession[] = recentAccuracies.map((accuracy, i) => ({
      id: `test_${i}`,
      patientId: 'test_patient',
      gameType: 'test',
      difficulty: currentDifficulty,
      score: Math.round((accuracy / 100) * 5),
      totalObjects: 5,
      accuracy,
      responseTime: recentResponseTimes[i] || 15,
      timestamp: Date.now() - (i * 1000 * 60 * 60), // Spread over hours
    }));

    // Calculate metrics
    const recentAccuracy = mockSessions.reduce((sum, s) => sum + s.accuracy, 0) / mockSessions.length;
    const recentResponseTime = mockSessions.reduce((sum, s) => sum + s.responseTime, 0) / mockSessions.length;

    // Apply rules
    let suggestedDifficulty = currentDifficulty;
    let reason = '';

    if (recentAccuracy >= this.HIGH_PERFORMANCE_THRESHOLD) {
      suggestedDifficulty = Math.min(currentDifficulty + 1, this.MAX_DIFFICULTY);
      reason = recentResponseTime < this.FAST_RESPONSE_THRESHOLD
        ? 'Excellent performance with quick responses'
        : 'High accuracy achieved';
    } else if (recentAccuracy < this.LOW_PERFORMANCE_THRESHOLD) {
      suggestedDifficulty = Math.max(currentDifficulty - 1, this.MIN_DIFFICULTY);
      reason = recentResponseTime > this.SLOW_RESPONSE_THRESHOLD
        ? 'Performance needs support - reducing difficulty'
        : 'Lower accuracy detected';
    } else {
      suggestedDifficulty = currentDifficulty;
      reason = 'Steady performance - maintaining difficulty';
    }

    suggestedDifficulty = Math.max(
      this.MIN_DIFFICULTY,
      Math.min(this.MAX_DIFFICULTY, suggestedDifficulty)
    );

    return {
      currentDifficulty,
      suggestedDifficulty,
      reason,
      recentAccuracy: Math.round(recentAccuracy),
      recentResponseTime: Math.round(recentResponseTime),
      sessionsAnalyzed: mockSessions.length,
    };
  }
}
