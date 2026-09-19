/**
 * SMRITI SATHI — Patient Repository
 * 
 * Manages patient-specific data access.
 * Ensures data is scoped to the authenticated patient.
 */

import { db } from '../db';
import { UserRole } from '../../models/Role';

export interface PatientData {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  profileImage?: string;
  createdAt: number;
  updatedAt: number;
}

export class PatientRepository {
  // Get patient by ID (with role check)
  async getPatient(patientId: string, requestingRole: UserRole, requestingUserId: string): Promise<PatientData | null> {
    // Patients can only access their own data
    if (requestingRole === UserRole.PATIENT && requestingUserId !== patientId) {
      return null; // Access denied
    }

    // Caregivers can access linked patients
    // (In production, this would check caregiver-patient relationship)
    
    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    if (isNaN(numericId)) {
      // Try to find by matching the string ID pattern
      const users = await db.users.toArray();
      const user = users.find(u => u.id?.toString() === patientId.replace('patient_demo_', ''));
      if (!user) return null;

      return {
        id: patientId,
        name: user.name,
        age: user.age,
        preferredLanguage: user.preferredLanguage,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    const user = await db.users.get(numericId);
    if (!user) return null;

    return {
      id: patientId,
      name: user.name,
      age: user.age,
      preferredLanguage: user.preferredLanguage,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Get all patients (caregiver only)
  async getAllPatients(requestingRole: UserRole): Promise<PatientData[]> {
    if (requestingRole !== UserRole.CAREGIVER) {
      return []; // Patients cannot list all patients
    }

    const users = await db.users.toArray();
    return users.map(user => ({
      id: `patient_demo_${user.id}`,
      name: user.name,
      age: user.age,
      preferredLanguage: user.preferredLanguage,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  // Get patient's game sessions
  async getPatientGameSessions(patientId: string, requestingRole: UserRole, requestingUserId: string) {
    if (requestingRole === UserRole.PATIENT && requestingUserId !== patientId) {
      return []; // Access denied
    }

    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    if (isNaN(numericId)) return [];

    return await db.gameSessions
      .where('userId')
      .equals(numericId)
      .reverse()
      .sortBy('createdAt');
  }

  // Get patient's reminders
  async getPatientReminders(patientId: string, requestingRole: UserRole, requestingUserId: string) {
    if (requestingRole === UserRole.PATIENT && requestingUserId !== patientId) {
      return []; // Access denied
    }

    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    if (isNaN(numericId)) return [];

    return await db.reminders
      .where('userId')
      .equals(numericId)
      .sortBy('scheduledTime');
  }

  // Get patient's memory items
  async getPatientMemoryItems(patientId: string, requestingRole: UserRole, requestingUserId: string) {
    if (requestingRole === UserRole.PATIENT && requestingUserId !== patientId) {
      return []; // Access denied
    }

    const numericId = parseInt(patientId.replace(/\D/g, ''), 10);
    if (isNaN(numericId)) return [];

    return await db.memoryItems
      .where('userId')
      .equals(numericId)
      .reverse()
      .sortBy('createdAt');
  }
}

export const patientRepository = new PatientRepository();
