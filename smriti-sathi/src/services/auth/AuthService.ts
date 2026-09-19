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

// Demo users (NOT real credentials — for prototype only)
interface DemoUser {
  id: string;
  role: UserRole;
  displayName: string;
  // In production, passwords would NEVER be stored in plaintext
  // This is for demo convenience only
  demoPin: string;
  linkedPatientId?: string;
}

// Demo user registry — clearly marked as prototype
const DEMO_USERS: DemoUser[] = [
  {
    id: 'patient_demo_001',
    role: UserRole.PATIENT,
    displayName: 'Ramesh Kumar',
    demoPin: '1234',
  },
  {
    id: 'patient_demo_002',
    role: UserRole.PATIENT,
    displayName: 'Lakshmi Devi',
    demoPin: '5678',
  },
  {
    id: 'caregiver_demo_001',
    role: UserRole.CAREGIVER,
    displayName: 'ASHA Worker — Priya',
    demoPin: '0000',
    linkedPatientId: 'patient_demo_001',
  },
  {
    id: 'caregiver_demo_002',
    role: UserRole.CAREGIVER,
    displayName: 'Family — Arjun (Son)',
    demoPin: '9999',
    linkedPatientId: 'patient_demo_002',
  },
];

const SESSION_KEY = 'smriti_sathi_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

type AuthListener = (session: AuthSession | null) => void;

class AuthServiceClass {
  private currentSession: AuthSession | null = null;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    this.restoreSession();
  }

  // Demo login — NOT secure authentication
  async login(userId: string, pin: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    // Input validation
    if (!userId || typeof userId !== 'string') {
      return { success: false, error: 'Invalid user ID' };
    }
    if (!pin || typeof pin !== 'string' || pin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 characters' };
    }

    // Sanitize inputs
    const sanitizedUserId = userId.trim().toLowerCase();
    const sanitizedPin = pin.trim();

    // Find demo user
    const user = DEMO_USERS.find(u => u.id === sanitizedUserId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Demo PIN check — NOT secure, prototype only
    if (user.demoPin !== sanitizedPin) {
      return { success: false, error: 'Incorrect PIN' };
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

  // Quick demo login (bypass PIN for testing)
  async quickLogin(userId: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
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

  // Logout
  async logout(): Promise<void> {
    this.currentSession = null;
    this.clearPersistedSession();
    this.notifyListeners(null);
  }

  // Get current session
  getSession(): AuthSession | null {
    if (this.currentSession && this.currentSession.expiresAt < Date.now()) {
      // Session expired
      this.logout();
      return null;
    }
    return this.currentSession;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Get current role
  getRole(): UserRole | null {
    return this.getSession()?.role ?? null;
  }

  // Get current user ID
  getUserId(): string | null {
    return this.getSession()?.userId ?? null;
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

  // Get available demo users (for login screen)
  getDemoUsers(): Array<{ id: string; role: UserRole; displayName: string }> {
    return DEMO_USERS.map(u => ({
      id: u.id,
      role: u.role,
      displayName: u.displayName,
    }));
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
        } else {
          this.clearPersistedSession();
        }
      }
    } catch {
      this.clearPersistedSession();
    }
  }
}

// Singleton
export const AuthService = new AuthServiceClass();
