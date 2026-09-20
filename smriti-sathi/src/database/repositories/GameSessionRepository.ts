import { db, GameSession, SyncEvent } from '../db';
import { generateUUID } from '../../utils/uuid';

export class GameSessionRepository {
  // Create a new game session
  async create(session: Omit<GameSession, 'id' | 'createdAt'>): Promise<number> {
    const id = await db.gameSessions.add({
      ...session,
      createdAt: Date.now(),
    });

    await this.createSyncEvent('game_session', id, 'create');
    return id;
  }

  // Get session by ID
  async getById(id: number): Promise<GameSession | undefined> {
    return await db.gameSessions.get(id);
  }

  // Get all sessions for a user
  async getByUserId(userId: number): Promise<GameSession[]> {
    return await db.gameSessions
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('createdAt');
  }

  // Get sessions by game type
  async getByGameType(userId: number, gameType: 'remember' | 'recognise' | 'test' | 'memory_match' | 'family_quiz'): Promise<GameSession[]> {
    return await db.gameSessions
      .where('userId')
      .equals(userId)
      .and(session => session.gameType === gameType)
      .reverse()
      .sortBy('createdAt');
  }

  // Get recent sessions (last N)
  async getRecent(userId: number, limit: number = 10): Promise<GameSession[]> {
    const sessions = await this.getByUserId(userId);
    return sessions.slice(0, limit);
  }

  // Get sessions from last N days
  async getFromLastDays(userId: number, days: number): Promise<GameSession[]> {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return await db.gameSessions
      .where('userId')
      .equals(userId)
      .and(session => session.createdAt >= cutoff)
      .reverse()
      .sortBy('createdAt');
  }

  // Get statistics for a user
  async getStats(userId: number): Promise<{
    totalGames: number;
    averageAccuracy: number;
    averageResponseTime: number;
    bestScore: number;
  }> {
    const sessions = await this.getByUserId(userId);
    
    if (sessions.length === 0) {
      return {
        totalGames: 0,
        averageAccuracy: 0,
        averageResponseTime: 0,
        bestScore: 0,
      };
    }

    const totalGames = sessions.length;
    const averageAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalGames;
    const averageResponseTime = sessions.reduce((sum, s) => sum + s.responseTime, 0) / totalGames;
    const bestScore = Math.max(...sessions.map(s => s.score));

    return {
      totalGames,
      averageAccuracy: Math.round(averageAccuracy),
      averageResponseTime: Math.round(averageResponseTime),
      bestScore,
    };
  }

  // Delete session
  async delete(id: number): Promise<void> {
    await db.gameSessions.delete(id);
    await this.createSyncEvent('game_session', id, 'delete');
  }

  // Create sync event
  private async createSyncEvent(
    entityType: SyncEvent['entityType'],
    entityId: number,
    operation: SyncEvent['operation']
  ): Promise<void> {
    await db.syncEvents.add({
      uuid: generateUUID(),
      entityType,
      entityId,
      operation,
      syncStatus: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now(),
    });
  }
}

export const gameSessionRepository = new GameSessionRepository();
