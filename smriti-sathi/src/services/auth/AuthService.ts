/**
 * SMRITI SATHI — Authentication Service
 * 
 * ⚠️ PROTOTYPE ONLY — NOT PRODUCTION SECURITY
 * 
 * This is a local/demo authentication flow for prototyping purposes.
 * It does NOT provide real security. In production:
 * - Use proper authentication (OAuth2, JWT, etc.)
 * - Use secure password hashing (bcrypt, argon2)
 * - Use HTTPS for all API calls
 * - Implement proper session management
 * - Use server-side role enforcement
 * 
 * Current implementation:
 * - Local storage for demo session
 * - No real password hashing (demo only)
 * - Role-based access for UX purposes
 * - Unique user IDs for data separation
 */

import { UserRole } from '../../models/Role';
import { generateUUID } from '../../utils/uuid';

// Session interface
export interface AuthSession {
  userId: string;
  role: UserRole;
  displayName: string;
  patientId?: string; // For caregivers, which patient they're viewing
  loginAt: number;
  expiresAt: number;
}

// Production User Profiles
export interface UserProfile {
  id: string;
  role: UserRole;
  displayName: string;
  pin?: string;
  linkedPatientId?: string;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'patient_primary',
    role: UserRole.PATIENT,
    displayName: 'Elder (Self / Patient)',
    pin: '', // No PIN for elderly patients
  },
  {
    id: 'caregiver_primary',
    role: UserRole.CAREGIVER,
    displayName: 'Family Caregiver',
    pin: '1234',
    linkedPatientId: 'patient_primary',
  },
  {
    id: 'asha_worker',
    role: UserRole.CAREGIVER,
    displayName: 'Community Health Worker (ASHA)',
    pin: '0000',
    linkedPatientId: 'patient_primary',
  },
];

const SESSION_KEY = 'smriti_sathi_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days persistent local session

type AuthListener = (session: AuthSession | null) => void;

class AuthServiceClass {
  private currentSession: AuthSession | null = null;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    this.restoreSession();
  }

  // Account login
  async login(userId: string, pin?: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    if (!userId || typeof userId !== 'string') {
      return { success: false, error: 'Invalid user ID' };
    }

    const sanitizedUserId = userId.trim().toLowerCase();
    const user = DEFAULT_USERS.find(u => u.id === sanitizedUserId);
    if (!user) {
      return { success: false, error: 'User profile not found' };
    }

    // Elders can log in directly without a PIN
    if (user.role === UserRole.CAREGIVER && user.pin) {
      const sanitizedPin = (pin || '').trim();
      if (user.pin !== sanitizedPin) {
        return { success: false, error: 'Incorrect PIN' };
      }
    }

    // Create session
    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      displayName: user.displayName,
      patientId: user.linkedPatientId,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    this.currentSession = session;
    this.persistSession(session);
    this.notifyListeners(session);

    return { success: true, session };
  }

  // Quick login
  async quickLogin(userId: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const user = DEFAULT_USERS.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User profile not found' };
    }

    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      displayName: user.displayName,
      patientId: user.linkedPatientId,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    this.currentSession = session;
    this.persistSession(session);
    this.notifyListeners(session);

    return { success: true, session };
  }

  // Logout (resets safely to Elder patient companion session)
  async logout(): Promise<void> {
    const defaultElder = DEFAULT_USERS[0];
    const session: AuthSession = {
      userId: defaultElder.id,
      role: defaultElder.role,
      displayName: defaultElder.displayName,
      patientId: defaultElder.linkedPatientId,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    this.currentSession = session;
    this.persistSession(session);
    this.notifyListeners(session);
  }

  // Get current session
  getSession(): AuthSession | null {
    if (!this.currentSession || this.currentSession.expiresAt < Date.now()) {
      // Re-initialize default elder session
      const defaultElder = DEFAULT_USERS[0];
      this.currentSession = {
        userId: defaultElder.id,
        role: defaultElder.role,
        displayName: defaultElder.displayName,
        patientId: defaultElder.linkedPatientId,
        loginAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      this.persistSession(this.currentSession);
    }
    return this.currentSession;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Get current role
  getRole(): UserRole | null {
    return this.getSession()?.role ?? UserRole.PATIENT;
  }

  // Get current user ID
  getUserId(): string | null {
    return this.getSession()?.userId ?? DEFAULT_USERS[0].id;
  }

  // Get linked patient ID (for caregivers)
  getLinkedPatientId(): string | null {
    return this.getSession()?.patientId ?? null;
  }

  // Switch patient context (caregiver only)
  async switchPatientContext(patientId: string): Promise<boolean> {
    const session = this.getSession();
    if (!session || session.role !== UserRole.CAREGIVER) {
      return false;
    }

    this.currentSession = { ...session, patientId };
    this.persistSession(this.currentSession);
    this.notifyListeners(this.currentSession);
    return true;
  }

  // Get available profiles
  getUsers(): Array<{ id: string; role: UserRole; displayName: string }> {
    return DEFAULT_USERS.map(u => ({
      id: u.id,
      role: u.role,
      displayName: u.displayName,
    }));
  }

  // Backward-compatible alias
  getDemoUsers(): Array<{ id: string; role: UserRole; displayName: string }> {
    return this.getUsers();
  }

  // Subscribe to auth changes
  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Private methods
  private notifyListeners(session: AuthSession | null): void {
    this.listeners.forEach(listener => listener(session));
  }

  private persistSession(session: AuthSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Storage not available — session only in memory
    }
  }

  private clearPersistedSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored) as AuthSession;
        if (session.expiresAt > Date.now()) {
          this.currentSession = session;
          return;
        } else {
          this.clearPersistedSession();
        }
      }
    } catch {
      this.clearPersistedSession();
    }

    // Default to the Elder Patient profile automatically
    // The device is dedicated to elder dementia care — zero login barriers
    const defaultElder = DEFAULT_USERS[0];
    const initialSession: AuthSession = {
      userId: defaultElder.id,
      role: defaultElder.role,
      displayName: defaultElder.displayName,
      patientId: defaultElder.linkedPatientId,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    this.currentSession = initialSession;
    this.persistSession(initialSession);
  }
}

// Singleton
export const AuthService = new AuthServiceClass();
