/**
 * SMRITI SATHI — Auth context
 *
 * React binding for the real account store: the profile list here is whatever
 * this device has created, nothing more.
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthService, AuthSession, ProfileSummary } from '../services/auth/AuthService';
import type { AccountInput } from '../services/account/AccountService';
import { UserRole, hasPermission, RolePermissions } from '../models/Role';

interface AuthContextType {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  persona: 'elder' | 'caregiver' | 'clinician' | null;
  userId: string | null;
  patientId: string | null;
  hasAccounts: boolean;
  profiles: ProfileSummary[];
  login: (accountId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: AccountInput) => Promise<{ success: boolean; error?: string }>;
  switchRole: (accountId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchPatient: (patientId: string) => Promise<boolean>;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  refreshProfiles: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(AuthService.getSession());
  const [profiles, setProfiles] = useState<ProfileSummary[]>(() => AuthService.listProfiles());

  const refreshProfiles = useCallback(() => {
    setProfiles(AuthService.listProfiles());
  }, []);

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((newSession) => {
      setSession(newSession);
      setProfiles(AuthService.listProfiles());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (accountId: string, pin: string) => {
    const result = await AuthService.login(accountId, pin);
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback(async (input: AccountInput) => {
    const result = await AuthService.register(input);
    setProfiles(AuthService.listProfiles());
    return { success: result.success, error: result.error };
  }, []);

  const switchRole = useCallback(async (accountId: string) => {
    const result = await AuthService.login(accountId);
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setProfiles(AuthService.listProfiles());
  }, []);

  const switchPatient = useCallback(async (patientId: string) => {
    return await AuthService.switchPatientContext(patientId);
  }, []);

  const checkPermission = useCallback(
    (permission: keyof RolePermissions) => {
      if (!session) return false;
      return hasPermission(session.role, permission);
    },
    [session],
  );

  const value: AuthContextType = {
    session,
    isAuthenticated: session !== null,
    role: session?.role ?? null,
    persona: session?.persona ?? null,
    userId: session?.userId ?? null,
    patientId: session?.patientId ?? null,
    hasAccounts: profiles.length > 0,
    profiles,
    login,
    register,
    switchRole,
    logout,
    switchPatient,
    hasPermission: checkPermission,
    refreshProfiles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
