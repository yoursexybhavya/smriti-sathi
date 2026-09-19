/**
 * SMRITI SATHI — Role Guard
 * 
 * Protects routes/components based on user role.
 * Shows appropriate feedback when access is denied.
 */

import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, RolePermissions } from '../models/Role';
import { Shield, Lock } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: keyof RolePermissions;
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback 
}: RoleGuardProps) {
  const { isAuthenticated, role, hasPermission } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || <AccessDenied message="Please log in to continue" />;
  }

  // Role check
  if (requiredRole && role !== requiredRole) {
    return fallback || <AccessDenied message={`This area is for ${requiredRole}s only`} />;
  }

  // Permission check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <AccessDenied message="You don't have permission to view this" />;
  }

  return <>{children}</>;
}

function AccessDenied({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Lock size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Access Restricted</h3>
      <p className="text-sm text-[#7A7A7A] max-w-xs">{message}</p>
    </div>
  );
}

// Hook version for conditional rendering
export function useRoleAccess() {
  const { isAuthenticated, role, hasPermission } = useAuth();

  return {
    isPatient: role === UserRole.PATIENT,
    isCaregiver: role === UserRole.CAREGIVER,
    can: (permission: keyof RolePermissions) => hasPermission(permission),
    isAuthenticated,
    role,
  };
}
