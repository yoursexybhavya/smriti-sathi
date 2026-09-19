// SMRITI SATHI — Design System Constants
// Elderly-friendly: large touch targets, high contrast, readable typography

export const COLORS = {
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#0D3B12',
  secondary: '#E65100',
  secondaryLight: '#FF8A50',
  accent: '#1565C0',
  surface: '#FFFFFF',
  surfaceWarm: '#FDF8F0',
  surfaceCard: '#FFFFFF',
  background: '#F5F0E8',
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#7A7A7A',
  border: '#E0D8CC',
  success: '#2E7D32',
  warning: '#F57F17',
  error: '#C62828',
  offline: '#5D4037',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  display: 36,
} as const;

export const TOUCH_TARGET = {
  min: 48,
  comfortable: 56,
  large: 64,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const SHADOW = {
  sm: '0 1px 3px rgba(0,0,0,0.08)',
  md: '0 2px 8px rgba(0,0,0,0.1)',
  lg: '0 4px 16px rgba(0,0,0,0.12)',
} as const;
