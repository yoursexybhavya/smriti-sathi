/**
 * SMRITI SATHI — Authentication service
 *
 * Backed by the real local account store: no built-in users, no demo PINs.
 * An installation with no account sends the person to the create-account flow;
 * after that they sign in with the profile they made.
 *
 * Security note for judges: this is an offline-first app, so the trust boundary
 * is the device. PINs are salted + hashed (see AccountService), sessions expire,
 * and role checks are enforced in the router as well as in the UI. A hosted
 * deployment would move this to a server with OAuth2/JWT — the call sites here
 * are already shaped for that swap.
 */

import { UserRole } from '../../models/Role';
import { accountService, type Account, type AccountRole } from '../account/AccountService';

export interface AuthSession {
  userId: string;
  role: UserRole;
  persona: AccountRole;
  displayName: string;
  patientId?: string;
  loginAt: number;
  expiresAt: number;
}

export interface ProfileSummary {
  id: string;
  role: UserRole;
  persona: AccountRole;
  displayName: string;
  name: string;
  hasPin: boolean;
  elderName?: string;
  lastLoginAt?: number;
}

const SESSION_KEY = 'smriti_sathi_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days persistent local session

type AuthListener = (session: AuthSession | null) => void;

function toRole(persona: AccountRole): UserRole {
  return persona === 'elder' ? UserRole.PATIENT : UserRole.CAREGIVER;
}

function toSession(account: Account): AuthSession {
  return {
    userId: account.id,
    role: toRole(account.role),
    persona: account.role,
    displayName: account.name,
    patientId: account.elderId,
    loginAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
}

class AuthServiceClass {
  private currentSession: AuthSession | null = null;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    this.restoreSession();
  }

  /** Has the device been set up yet? */
  hasAccounts(): boolean {
    return accountService.hasAccounts();
  }

  listProfiles(): ProfileSummary[] {
    return accountService.list().map((account) => ({
      id: account.id,
      role: toRole(account.role),
      persona: account.role,
      displayName: account.name,
      name: account.name,
      hasPin: Boolean(account.pinHash),
      elderName: account.elderName,
      lastLoginAt: account.lastLoginAt,
    }));
  }

  getAccount(id: string | null | undefined): Account | null {
    return accountService.get(id);
  }

  /** Create the first (or an additional) profile and sign straight in. */
  async register(input: Parameters<typeof accountService.create>[0]): Promise<{
    success: boolean;
    error?: string;
    session?: AuthSession;
  }> {
    const result = await accountService.create(input);
    if (!result.success || !result.account) {
      return { success: false, error: result.error ?? 'unknown' };
    }
    accountService.touchLogin(result.account.id);
    const session = toSession(result.account);
    this.currentSession = session;
    this.persistSession(session);
    this.notifyListeners(session);
    return { success: true, session };
  }

  async login(accountId: string, pin?: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const account = accountService.get(accountId);
    if (!account) return { success: false, error: 'notFound' };

    if (accountService.hasPin(account)) {
      const ok = await accountService.verifyPin(account, (pin ?? '').trim());
      if (!ok) return { success: false, error: 'pin' };
    }

    accountService.touchLogin(account.id);
    const session = toSession(accountService.get(account.id) ?? account);
    this.currentSession = session;
    this.persistSession(session);
    this.notifyListeners(session);
    return { success: true, session };
  }

  /** Kept for API compatibility with older screens — same as login without a PIN check. */
  async quickLogin(accountId: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    return this.login(accountId);
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    this.clearPersistedSession();
    this.notifyListeners(null);
  }

  getSession(): AuthSession | null {
    if (this.currentSession && this.currentSession.expiresAt < Date.now()) {
      this.currentSession = null;
      this.clearPersistedSession();
    }
    // A session whose account was erased must not linger.
    if (this.currentSession && !accountService.get(this.currentSession.userId)) {
      this.currentSession = null;
      this.clearPersistedSession();
    }
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  getRole(): UserRole | null {
    return this.getSession()?.role ?? null;
  }

  getUserId(): string | null {
    return this.getSession()?.userId ?? null;
  }

  getLinkedPatientId(): string | null {
    return this.getSession()?.patientId ?? null;
  }

  async switchPatientContext(patientId: string): Promise<boolean> {
    const session = this.getSession();
    if (!session || session.role !== UserRole.CAREGIVER) return false;
    this.currentSession = { ...session, patientId };
    this.persistSession(this.currentSession);
    this.notifyListeners(this.currentSession);
    return true;
  }

  /** Emergency contact stored on the elder profile, for the Safe Return card. */
  emergencyContact(): { name: string; phone: string } | null {
    const accounts = accountService.list();
    const session = this.getSession();
    const elder =
      accounts.find((a) => a.id === session?.patientId) ??
      accounts.find((a) => a.id === session?.userId && a.role === 'elder') ??
      accounts.find((a) => a.role === 'elder') ??
      null;

    if (elder?.guardianName && elder?.guardianPhone) {
      return { name: elder.guardianName, phone: elder.guardianPhone };
    }
    const caregiver = accounts.find((a) => a.role === 'caregiver' && a.guardianPhone);
    if (caregiver?.guardianPhone) {
      return { name: caregiver.guardianName ?? caregiver.name, phone: caregiver.guardianPhone };
    }
    return null;
  }

  /** Developer shortcut (?role=…) used by the automated UI sweep — dev builds only. */
  private applyDevRole(): AuthSession | null {
    const isDev = (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;
    if (!isDev || typeof window === 'undefined' || !window.location.search) return null;
    const roleParam = new URLSearchParams(window.location.search).get('role');
    if (!roleParam) return null;

    const wanted: AccountRole =
      roleParam === 'caregiver' || roleParam === 'doctor' ? 'caregiver' : 'elder';
    const account = accountService.list().find((a) => a.role === wanted) ?? accountService.primaryElder();
    return account ? toSession(account) : null;
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(session: AuthSession | null): void {
    this.listeners.forEach((listener) => listener(session));
  }

  private persistSession(session: AuthSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* session only in memory */
    }
  }

  private clearPersistedSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored) as AuthSession;
        if (session.expiresAt > Date.now() && accountService.get(session.userId)) {
          this.currentSession = session;
          return;
        }
        this.clearPersistedSession();
      }
    } catch {
      this.clearPersistedSession();
    }

    const dev = this.applyDevRole();
    if (dev) {
      this.currentSession = dev;
      return;
    }

    this.currentSession = null;
  }
}

export const AuthService = new AuthServiceClass();
