/**
 * SMRITI SATHI — Role Definitions
 * 
 * Defines user roles and their permissions.
 * This is NOT a security boundary — it's a UX/access control layer.
 * Real security requires server-side enforcement.
 * 
 * IMPORTANT DISCLAIMERS:
 * - This is a prototype, not production-grade security
 * - No HIPAA compliance is claimed
 * - No clinical-grade security is claimed
 * - Role enforcement here is for UX only
 */

export enum UserRole {
  PATIENT = 'patient',
  CAREGIVER = 'caregiver',
}

export interface RolePermissions {
  // Patient experience
  canPlayGames: boolean;
  canViewOwnProgress: boolean;
  canViewOwnReminders: boolean;
  canViewMemoryBook: boolean;
  canManageAccessibility: boolean;
  
  // Caregiver features
  canViewPatientProfile: boolean;
  canViewPatientProgress: boolean;
  canManageReminders: boolean;
  canManageMemoryBook: boolean;
  canViewSyncStatus: boolean;
  canViewFollowUpSignals: boolean;
  canManageCaregiverSettings: boolean;
  
  // System
  canAccessDeveloperTools: boolean;
  canSwitchRole: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.PATIENT]: {
    canPlayGames: true,
    canViewOwnProgress: true,
    canViewOwnReminders: true,
    canViewMemoryBook: true,
    canManageAccessibility: true,
    
    canViewPatientProfile: false,
    canViewPatientProgress: false, // Patient sees own progress differently
    canManageReminders: false,
    canManageMemoryBook: false,
    canViewSyncStatus: false,
    canViewFollowUpSignals: false,
    canManageCaregiverSettings: false,
    
    canAccessDeveloperTools: false,
    canSwitchRole: false,
  },
  
  [UserRole.CAREGIVER]: {
    canPlayGames: false,
    canViewOwnProgress: false,
    canViewOwnReminders: false,
    canViewMemoryBook: true, // Can view but manage differently
    canManageAccessibility: false,
    
    canViewPatientProfile: true,
    canViewPatientProgress: true,
    canManageReminders: true,
    canManageMemoryBook: true,
    canViewSyncStatus: true,
    canViewFollowUpSignals: true,
    canManageCaregiverSettings: true,
    
    canAccessDeveloperTools: true, // For prototype testing
    canSwitchRole: true, // Demo only
  },
};

// Navigation items per role
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

export const PATIENT_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', roles: [UserRole.PATIENT] },
  { id: 'games', label: 'Games', icon: 'gamepad', roles: [UserRole.PATIENT] },
  { id: 'reminders', label: 'Reminders', icon: 'bell', roles: [UserRole.PATIENT] },
  { id: 'progress', label: 'Progress', icon: 'trending-up', roles: [UserRole.PATIENT] },
];

export const CAREGIVER_NAV_ITEMS: NavItem[] = [
  { id: 'caregiver-home', label: 'Dashboard', icon: 'layout', roles: [UserRole.CAREGIVER] },
  { id: 'caregiver-patients', label: 'Patients', icon: 'users', roles: [UserRole.CAREGIVER] },
  { id: 'caregiver-reminders', label: 'Reminders', icon: 'bell', roles: [UserRole.CAREGIVER] },
  { id: 'caregiver-settings', label: 'Settings', icon: 'settings', roles: [UserRole.CAREGIVER] },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  switch (role) {
    case UserRole.PATIENT:
      return PATIENT_NAV_ITEMS;
    case UserRole.CAREGIVER:
      return CAREGIVER_NAV_ITEMS;
    default:
      return [];
  }
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}
