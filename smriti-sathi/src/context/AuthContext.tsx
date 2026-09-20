/**
 * SMRITI SATHI — Auth Context
 * 
 * React context for authentication state.
 * Provides role-aware access to components.
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthService, AuthSession } from '../services/auth/AuthService';
import { UserRole, hasPermission, RolePermissions } from '../models/Role';

interface AuthContextType {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  patientId: string | null;
  login: (userId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (userId: string) => Promise<{ success: boolean; error?: string }>;
  switchRole: (userId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchPatient: (patientId: string) => Promise<boolean>;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  demoUsers: Array<{ id: string; role: UserRole; displayName: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(AuthService.getSession());

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((newSession) => {
      setSession(newSession);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (userId: string, pin: string) => {
    const result = await AuthService.login(userId, pin);
    return { success: result.success, error: result.error };
  }, []);

  const quickLogin = useCallback(async (userId: string) => {
    const result = await AuthService.quickLogin(userId);
    return { success: result.success, error: result.error };
  }, []);

  const switchRole = useCallback(async (userId: string) => {
    const sess = await AuthService.switchRoleDirect(userId);
    return { success: sess !== null };
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
  }, []);

  const switchPatient = useCallback(async (patientId: string) => {
    return await AuthService.switchPatientContext(patientId);
  }, []);

  const checkPermission = useCallback((permission: keyof RolePermissions) => {
    if (!session) return false;
    return hasPermission(session.role, permission);
  }, [session]);

  const value: AuthContextType = {
    session,
    isAuthenticated: session !== null,
    role: session?.role ?? null,
    userId: session?.userId ?? null,
    patientId: session?.patientId ?? null,
    login,
    quickLogin,
    switchRole,
    logout,
    switchPatient,
    hasPermission: checkPermission,
    demoUsers: AuthService.getDemoUsers(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
