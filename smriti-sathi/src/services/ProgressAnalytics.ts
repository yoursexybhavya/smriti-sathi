import { db } from '../database/db';
import { GameSession } from '../database/db';

export interface ProgressMetrics {
  today: {
    gamesPlayed: number;
    totalTime: number;
    averageAccuracy: number;
  };
  weekly: {
    gamesPlayed: number;
    totalTime: number;
    averageAccuracy: number;
    dailyActivity: number[]; // Last 7 days
  };
  memory: {
    totalGames: number;
    averageAccuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    recentSessions: GameSession[];
  };
  recognition: {
    totalGames: number;
    averageAccuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    recentSessions: GameSession[];
  };
  reminderAdherence: {
    totalReminders: number;
    completedReminders: number;
    adherenceRate: number;
    thisWeek: number;
  };
}

export class ProgressAnalyticsService {
  /**
   * Calculate comprehensive progress metrics for a patient
   */
  async calculateMetrics(patientId: number): Promise<ProgressMetrics> {
    const [
      todayMetrics,
      weeklyMetrics,
      memoryMetrics,
      recognitionMetrics,
      reminderMetrics
    ] = await Promise.all([
      this.calculateTodayMetrics(patientId),
      this.calculateWeeklyMetrics(patientId),
      this.calculateGameMetrics(patientId, 'remember'),
      this.calculateGameMetrics(patientId, 'recognise'),
      this.calculateReminderMetrics(patientId)
    ]);

    return {
      today: todayMetrics,
      weekly: weeklyMetrics,
      memory: memoryMetrics,
      recognition: recognitionMetrics,
      reminderAdherence: reminderMetrics
    };
  }

  /**
   * Calculate today's activity metrics
   */
  private async calculateTodayMetrics(patientId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await db.gameSessions
      .where('userId')
      .equals(patientId)
      .and(session => 
        session.createdAt >= today.getTime() && 
        session.createdAt < tomorrow.getTime()
      )
      .toArray();

    const gamesPlayed = todaySessions.length;
    const totalTime = todaySessions.reduce((sum, s) => sum + s.responseTime, 0);
    const averageAccuracy = gamesPlayed > 0
      ? todaySessions.reduce((sum, s) => sum + s.accuracy, 0) / gamesPlayed
      : 0;

    return {
      gamesPlayed,
      totalTime: Math.round(totalTime),
      averageAccuracy: Math.round(averageAccuracy)
    };
  }

  /**
   * Calculate weekly activity metrics
   */
  private async calculateWeeklyMetrics(patientId: number) {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekSessions = await db.gameSessions
      .where('userId')
      .equals(patientId)
      .and(session => session.createdAt >= weekAgo.getTime())
      .toArray();

    const gamesPlayed = weekSessions.length;
    const totalTime = weekSessions.reduce((sum, s) => sum + s.responseTime, 0);
    const averageAccuracy = gamesPlayed > 0
      ? weekSessions.reduce((sum, s) => sum + s.accuracy, 0) / gamesPlayed
      : 0;

    // Calculate daily activity for last 7 days
    const dailyActivity: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const daySessions = weekSessions.filter(s => 
        s.createdAt >= dayStart.getTime() && 
        s.createdAt < dayEnd.getTime()
      );

      dailyActivity.push(daySessions.length);
    }

    return {
      gamesPlayed,
      totalTime: Math.round(totalTime),
      averageAccuracy: Math.round(averageAccuracy),
      dailyActivity
    };
  }

  /**
   * Calculate metrics for a specific game type
   */
  private async calculateGameMetrics(
    patientId: number, 
    gameType: 'remember' | 'recognise'
  ) {
    const sessions = await db.gameSessions
      .where('userId')
      .equals(patientId)
      .and(session => session.gameType === gameType)
      .reverse()
      .sortBy('createdAt');

    const totalGames = sessions.length;
    const averageAccuracy = totalGames > 0
      ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalGames
      : 0;

    // Calculate trend based on recent sessions
    const trend = this.calculateTrend(sessions);

    // Get last 5 sessions for display
    const recentSessions = sessions.slice(0, 5);

    return {
      totalGames,
      averageAccuracy: Math.round(averageAccuracy),
      trend,
      recentSessions
    };
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(sessions: GameSession[]): 'improving' | 'stable' | 'declining' {
    if (sessions.length < 3) return 'stable';

    // Compare last 3 sessions with previous 3 sessions
    const recent = sessions.slice(0, 3);
    const previous = sessions.slice(3, 6);

    if (previous.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length;
    const previousAvg = previous.reduce((sum, s) => sum + s.accuracy, 0) / previous.length;

    const diff = recentAvg - previousAvg;

    if (diff > 10) return 'improving';
    if (diff < -10) return 'declining';
    return 'stable';
  }

  /**
   * Calculate reminder adherence metrics
   */
  private async calculateReminderMetrics(patientId: number) {
    const reminders = await db.reminders
      .where('userId')
      .equals(patientId)
      .toArray();

    const completions = await db.reminderCompletions
      .where('userId')
      .equals(patientId)
      .toArray();

    const totalReminders = reminders.length;
    const completedReminders = completions.length;
    const adherenceRate = totalReminders > 0
      ? (completedReminders / totalReminders) * 100
      : 0;

    // Calculate this week's adherence
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeekCompletions = completions.filter(
      c => c.completedAt >= weekAgo.getTime()
    ).length;

    return {
      totalReminders,
      completedReminders,
      adherenceRate: Math.round(adherenceRate),
      thisWeek: thisWeekCompletions
    };
  }

  /**
   * Get performance summary for caregiver view
   */
  async getCaregiverSummary(patientId: number) {
    const metrics = await this.calculateMetrics(patientId);
    
    // Get patient info
    const patient = await db.users.get(patientId);
    
    // Get last active time
    const lastSession = await db.gameSessions
      .where('userId')
      .equals(patientId)
      .reverse()
      .sortBy('createdAt')
      .then(sessions => sessions[0]);

    const lastActive = lastSession ? lastSession.createdAt : null;

    // Calculate weekly engagement
    const weeklyEngagement = metrics.weekly.averageAccuracy;

    // Determine if follow-up needed
    const followUpNeeded = this.shouldSuggestFollowUp(metrics);

    return {
      patientName: patient?.name || 'Patient',
      lastActive,
      sessionsCompleted: metrics.memory.totalGames + metrics.recognition.totalGames,
      weeklyEngagement,
      memoryTrend: metrics.memory.trend,
      recognitionTrend: metrics.recognition.trend,
      reminderAdherence: metrics.reminderAdherence.adherenceRate,
      recentActivities: await this.getRecentActivities(patientId),
      followUpNeeded
    };
  }

  /**
   * Determine if caregiver follow-up should be suggested
   */
  private shouldSuggestFollowUp(metrics: ProgressMetrics): boolean {
    // Suggest follow-up if:
    // 1. Both memory and recognition are declining
    // 2. Reminder adherence is very low (< 50%)
    // 3. No activity in the last 3 days

    const bothDeclining = 
      metrics.memory.trend === 'declining' && 
      metrics.recognition.trend === 'declining';

    const lowAdherence = metrics.reminderAdherence.adherenceRate < 50;

    const noRecentActivity = metrics.today.gamesPlayed === 0 && 
      metrics.weekly.dailyActivity.slice(-3).every(day => day === 0);

    return bothDeclining || lowAdherence || noRecentActivity;
  }

  /**
   * Get recent activities for display
   */
  private async getRecentActivities(patientId: number) {
    const sessions = await db.gameSessions
      .where('userId')
      .equals(patientId)
      .reverse()
      .sortBy('createdAt')
      .then(s => s.slice(0, 5));

    const completions = await db.reminderCompletions
      .where('userId')
      .equals(patientId)
      .reverse()
      .sortBy('completedAt')
      .then(c => c.slice(0, 5));

    // Combine and sort by time
    const activities = [
      ...sessions.map(s => ({
        type: s.gameType === 'remember' ? 'Memory' : 'Recognition',
        timestamp: s.createdAt,
        detail: `${s.accuracy}% accuracy`
      })),
      ...completions.map(async c => {
        const reminder = await db.reminders.get(c.reminderId);
        return {
          type: reminder?.type || 'Reminder',
          timestamp: c.completedAt,
          detail: reminder?.title || 'Completed'
        };
      })
    ];

    // Resolve promises and sort
    const resolvedActivities = await Promise.all(activities);
    return resolvedActivities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }
}

export const progressAnalytics = new ProgressAnalyticsService();
