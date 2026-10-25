/**
 * SMRITI SATHI — Security Configuration
 * 
 * ⚠️ PROTOTYPE SECURITY CONFIGURATION
 * 
 * This file documents the security posture of the prototype.
 * It explicitly states what IS and IS NOT implemented.
 * 
 * IMPORTANT DISCLAIMERS:
 * - This is NOT production-grade security
 * - This does NOT claim HIPAA compliance
 * - This does NOT claim clinical-grade security
 * - This has NOT been independently audited or verified
 * - Role enforcement is for UX only, not security
 * 
 * For production deployment, consult security professionals
 * and implement proper security measures.
 */

export const SECURITY_STATUS = {
  // What IS implemented (prototype level)
  implemented: {
    inputValidation: 'Basic client-side validation',
    roleSeparation: 'UX-level role-based navigation',
    dataMinimization: 'Only necessary data stored locally',
    uniqueIds: 'UUID-based user/patient identification',
    sessionManagement: 'Local session with expiration',
    pinHashing: 'Salted SHA-256 via WebCrypto, with an iterated fallback on http origins',
    noHardcodedSecrets: 'No API keys or secrets in code',
  },

  // What is NOT implemented (would be needed for production)
  notImplemented: {
    serverSideAuth: 'No server-side authentication',
    encryptionAtRest: 'Local storage not encrypted',
    encryptionInTransit: 'No HTTPS (no backend yet)',
    passwordHashing: 'PIN digests are salted and hashed, but a 4-digit PIN has a tiny keyspace',
    rateLimiting: 'No brute-force protection on the local PIN pad',
    auditLogging: 'No security event logging',
    sessionTokens: 'No secure session tokens',
    csrfProtection: 'No CSRF tokens',
    xssProtection: 'Basic but not comprehensive',
    sqlInjection: 'N/A (using IndexedDB, not SQL)',
    apiKeys: 'No API keys managed',
    secretsManagement: 'No secrets vault',
    compliance: 'No regulatory compliance (HIPAA, etc.)',
    penetrationTesting: 'Not tested',
    securityAudit: 'Not audited',
  },

  // What should be done before production
  productionRequirements: [
    'Implement server-side authentication (OAuth2, JWT)',
    'Use HTTPS for all API communication',
    'Encrypt sensitive data at rest',
    'Implement proper password hashing (bcrypt, argon2)',
    'Add rate limiting and brute-force protection',
    'Implement audit logging for security events',
    'Use secure session management',
    'Add CSRF protection',
    'Implement comprehensive XSS protection',
    'Conduct security audit by qualified professionals',
    'Perform penetration testing',
    'Implement proper secrets management',
    'Consult legal/compliance experts for regulatory requirements',
    'Implement proper access control on server side',
    'Add multi-factor authentication for caregivers',
  ],
} as const;

// Security headers that should be set by the server in production
export const RECOMMENDED_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

// Data classification (for future encryption decisions)
export const DATA_CLASSIFICATION = {
  public: {
    description: 'Non-sensitive data',
    examples: ['App UI strings', 'Game instructions'],
    encryptionRequired: false,
  },
  internal: {
    description: 'Internal application data',
    examples: ['User preferences', 'App settings'],
    encryptionRequired: false,
  },
  confidential: {
    description: 'Personal health information',
    examples: ['Patient names', 'Medical reminders', 'Progress data'],
    encryptionRequired: true, // In production
    currentStatus: 'NOT ENCRYPTED (prototype)',
  },
  restricted: {
    description: 'Highly sensitive data',
    examples: ['Authentication credentials', 'API keys'],
    encryptionRequired: true,
    currentStatus: 'Stored only as a salted digest on this device',
  },
} as const;

// Privacy principles
export const PRIVACY_PRINCIPLES = {
  dataMinimization: 'Collect only what is necessary',
  purposeLimitation: 'Use data only for stated purposes',
  storageLimitation: 'Delete data when no longer needed',
  integrity: 'Protect data from unauthorized access',
  transparency: 'Be clear about data usage',
  userControl: 'Allow users to control their data',
} as const;
