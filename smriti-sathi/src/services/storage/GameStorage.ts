// Game Storage Service
// Uses IndexedDB (via Dexie) for offline-first persistence

import { GameSession, GameStats } from '../../models/GameSession';
import { gameSessionRepository } from '../../database';

export class GameStorage {
  // Save a game session (async)
  static async saveSession(session: GameSession): Promise<void> {
    try {
      await gameSessionRepository.create({
        userId: parseInt(session.patientId),
        gameType: session.gameType as 'remember' | 'recognise',
        difficulty: session.difficulty,
        score: session.score,
        totalObjects: session.totalObjects,
        accuracy: session.accuracy,
        responseTime: session.responseTime,
      });
    } catch (error) {
      console.error('Failed to save game session:', error);
    }
  }

  // Get all game sessions (async)
  static async getAllSessions(): Promise<GameSession[]> {
    try {
      // This is a simplified version - in production, you'd want to convert DB models to GameSession models
      return [];
    } catch (error) {
      console.error('Failed to load game sessions:', error);
      return [];
    }
  }

  // Get sessions for a specific patient (async)
  static async getPatientSessions(patientId: string): Promise<GameSession[]> {
    try {
      const sessions = await gameSessionRepository.getByUserId(parseInt(patientId));
      return sessions.map(s => ({
        id: s.id?.toString() || '',
        patientId: s.userId.toString(),
        gameType: s.gameType,
        difficulty: s.difficulty,
        score: s.score,
        totalObjects: s.totalObjects,
        accuracy: s.accuracy,
        responseTime: s.responseTime,
        timestamp: s.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load patient sessions:', error);
      return [];
    }
  }

  // Get sessions for a specific game type (async)
  static async getGameSessions(patientId: string, gameType: string): Promise<GameSession[]> {
    try {
      const sessions = await gameSessionRepository.getByGameType(
        parseInt(patientId),
        gameType as 'remember' | 'recognise'
      );
      return sessions.map(s => ({
        id: s.id?.toString() || '',
        patientId: s.userId.toString(),
        gameType: s.gameType,
        difficulty: s.difficulty,
        score: s.score,
        totalObjects: s.totalObjects,
        accuracy: s.accuracy,
        responseTime: s.responseTime,
        timestamp: s.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load game sessions:', error);
      return [];
    }
  }

  // Get recent sessions (last N) (async)
  static async getRecentSessions(patientId: string, count: number = 10): Promise<GameSession[]> {
    try {
      const sessions = await gameSessionRepository.getRecent(parseInt(patientId), count);
      return sessions.map(s => ({
        id: s.id?.toString() || '',
        patientId: s.userId.toString(),
        gameType: s.gameType,
        difficulty: s.difficulty,
        score: s.score,
        totalObjects: s.totalObjects,
        accuracy: s.accuracy,
        responseTime: s.responseTime,
        timestamp: s.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load recent sessions:', error);
      return [];
    }
  }

  // Calculate stats for a patient (async)
  static async getPatientStats(patientId: string): Promise<GameStats> {
    try {
      const stats = await gameSessionRepository.getStats(parseInt(patientId));
      const sessions = await this.getPatientSessions(patientId);
      const currentStreak = this.calculateStreak(sessions);

      return {
        ...stats,
        currentStreak,
      };
    } catch (error) {
      console.error('Failed to calculate patient stats:', error);
      return {
        totalGames: 0,
        averageAccuracy: 0,
        averageResponseTime: 0,
        bestScore: 0,
        currentStreak: 0,
      };
    }
  }

  // Calculate consecutive days streak
  private static calculateStreak(sessions: GameSession[]): number {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions.sort((a, b) => b.timestamp - a.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let lastDate = new Date(sortedSessions[0].timestamp);
    lastDate.setHours(0, 0, 0, 0);

    // Check if most recent game was today or yesterday
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) return 0; // Streak broken

    streak = 1;

    // Count consecutive days
    for (let i = 1; i < sortedSessions.length; i++) {
      const currentDate = new Date(sortedSessions[i].timestamp);
      currentDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
        lastDate = currentDate;
      } else if (diff === 0) {
        // Same day, continue
        continue;
      } else {
        // Streak broken
        break;
      }
    }

    return streak;
  }

  // Clear all sessions (for testing) (async)
  static async clearAll(): Promise<void> {
    try {
      // This would need to be implemented in the repository
      console.warn('clearAll not yet implemented for IndexedDB');
    } catch (error) {
      console.error('Failed to clear game sessions:', error);
    }
  }

  // Get sessions from last N days (async)
  static async getSessionsFromLastDays(patientId: string, days: number): Promise<GameSession[]> {
    try {
      const sessions = await gameSessionRepository.getFromLastDays(parseInt(patientId), days);
      return sessions.map(s => ({
        id: s.id?.toString() || '',
        patientId: s.userId.toString(),
        gameType: s.gameType,
        difficulty: s.difficulty,
        score: s.score,
        totalObjects: s.totalObjects,
        accuracy: s.accuracy,
        responseTime: s.responseTime,
        timestamp: s.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load sessions from last days:', error);
      return [];
    }
  }
}
