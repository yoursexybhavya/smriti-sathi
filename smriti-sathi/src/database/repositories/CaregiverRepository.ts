/**
 * SMRITI SATHI — Caregiver Repository
 * 
 * Manages caregiver-specific data and relationships.
 * Caregivers can view/manage data for their linked patients.
 */

import { db } from '../db';
import { UserRole } from '../../models/Role';
import { patientRepository } from './PatientRepository';

export interface CaregiverData {
  id: string;
  name: string;
  role: UserRole.CAREGIVER;
  linkedPatientIds: string[];
  createdAt: number;
}

export interface FollowUpSignal {
  id: string;
  patientId: string;
  patientName: string;
  type: 'missed_games' | 'declining_progress' | 'missed_reminders' | 'no_activity';
  severity: 'low' | 'medium' | 'high';
  message: string;
  createdAt: number;
  acknowledged: boolean;
}

export class CaregiverRepository {
  // Get caregiver's linked patients
  async getLinkedPatients(caregiverId: string): Promise<Array<{ id: string; name: string; age: number }>> {
    // In prototype, return all patients (demo)
    // In production, this would check actual caregiver-patient relationships
    return await patientRepository.getAllPatients(UserRole.CAREGIVER);
  }

  // Generate follow-up signals for a patient
  async getFollowUpSignals(caregiverId: string, patientId: string): Promise<FollowUpSignal[]> {
    const signals: FollowUpSignal[] = [];
    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    
    if (isNaN(numericId)) return signals;

    // Check for missed games (no games in last 3 days)
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const recentGames = await db.gameSessions
      .where('userId')
      .equals(numericId)
      .and(session => session.createdAt >= threeDaysAgo)
      .count();

    if (recentGames === 0) {
      signals.push({
        id: `signal_nogames_${patientId}`,
        patientId,
        patientName: 'Patient', // Would be resolved from patient data
        type: 'no_activity',
        severity: 'medium',
        message: 'No games played in the last 3 days',
        createdAt: Date.now(),
        acknowledged: false,
      });
    }

    // Check for declining progress
    const sessions = await db.gameSessions
      .where('userId')
      .equals(numericId)
      .reverse()
      .sortBy('createdAt');

    if (sessions.length >= 4) {
      const recentAvg = sessions.slice(0, 2).reduce((sum, s) => sum + s.accuracy, 0) / 2;
      const olderAvg = sessions.slice(2, 4).reduce((sum, s) => sum + s.accuracy, 0) / 2;
      
      if (recentAvg < olderAvg - 20) {
        signals.push({
          id: `signal_declining_${patientId}`,
          patientId,
          patientName: 'Patient',
          type: 'declining_progress',
          severity: 'high',
          message: `Accuracy declined from ${Math.round(olderAvg)}% to ${Math.round(recentAvg)}%`,
          createdAt: Date.now(),
          acknowledged: false,
        });
      }
    }

    // Check for missed reminders
    const pendingReminders = await db.reminders
      .where('userId')
      .equals(numericId)
      .and(r => r.status === 'missed')
      .count();

    if (pendingReminders > 2) {
      signals.push({
        id: `signal_missedreminders_${patientId}`,
        patientId,
        patientName: 'Patient',
        type: 'missed_reminders',
        severity: 'medium',
        message: `${pendingReminders} reminders missed recently`,
        createdAt: Date.now(),
        acknowledged: false,
      });
    }

    return signals;
  }

  // Get all follow-up signals for all linked patients
  async getAllFollowUpSignals(caregiverId: string): Promise<FollowUpSignal[]> {
    const patients = await this.getLinkedPatients(caregiverId);
    const allSignals: FollowUpSignal[] = [];

    for (const patient of patients) {
      const signals = await this.getFollowUpSignals(caregiverId, patient.id);
      // Resolve patient name
      const resolvedSignals = signals.map(s => ({
        ...s,
        patientName: patient.name,
      }));
      allSignals.push(...resolvedSignals);
    }

    return allSignals.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // Get patient summary for caregiver dashboard
  async getPatientSummary(caregiverId: string, patientId: string) {
    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    if (isNaN(numericId)) return null;

    const sessions = await db.gameSessions
      .where('userId')
      .equals(numericId)
      .toArray();

    const reminders = await db.reminders
      .where('userId')
      .equals(numericId)
      .toArray();

    const memoryItems = await db.memoryItems
      .where('userId')
      .equals(numericId)
      .count();

    const totalGames = sessions.length;
    const avgAccuracy = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
      : 0;
    
    const pendingReminders = reminders.filter(r => r.status === 'pending').length;
    const completedReminders = reminders.filter(r => r.status === 'completed').length;

    // Last activity
    const lastGame = sessions.sort((a, b) => b.createdAt - a.createdAt)[0];
    const lastActivity = lastGame ? lastGame.createdAt : null;

    return {
      totalGames,
      avgAccuracy,
      pendingReminders,
      completedReminders,
      memoryItems,
      lastActivity,
      gamesThisWeek: sessions.filter(s => s.createdAt >= Date.now() - 7 * 24 * 60 * 60 * 1000).length,
    };
  }
}

export const caregiverRepository = new CaregiverRepository();
