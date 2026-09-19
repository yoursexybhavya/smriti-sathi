# SMRITI SATHI — PHASE 10 VERIFICATION GUIDE

## Quick Verification Steps

### 1. Build Verification
```bash
npm run build
```
Expected: ✅ Build succeeds with no errors

### 2. Secret Audit
Search for hard-coded secrets:
```bash
grep -r "api_key\|secret\|password\|token" src/ --include="*.ts" --include="*.tsx"
```
Expected: ✅ No API keys or secrets found (only disclaimers about NOT having them)

### 3. Access the Login Screen
- Open the app
- Should see login screen with demo users
- Verify security notice is visible

### 4. Test Patient Login
1. Click "Ramesh Kumar" quick login button
2. Verify: Patient dashboard loads
3. Verify: Bottom nav shows Home, Games, Reminders, Progress
4. Navigate to Settings
5. Verify: **No** Developer Tools section visible
6. Verify: Log Out button visible

### 5. Test Caregiver Login
1. Click "Log Out"
2. Click "ASHA Worker — Priya" quick login button
3. Verify: Caregiver dashboard loads
4. Verify: Bottom nav shows Dashboard, Reminders, Memory, Settings
5. Verify: Patient cards visible with summaries
6. Verify: Follow-up signals visible (if any data exists)
7. Navigate to Settings
8. Verify: Developer Tools section **is** visible
9. Verify: Security & Privacy Audit link visible

### 6. Test Role Separation
**Patient cannot access caregiver features:**
1. Login as patient
2. Try navigating to `caregiver-home` (should not be accessible)
3. Verify: Only patient routes work

**Caregiver cannot access patient game features:**
1. Login as caregiver
2. Try navigating to `games` (should not be accessible)
3. Verify: Only caregiver routes work

### 7. Test Security Audit Screen
1. Login as caregiver
2. Go to Settings → Developer Tools → Security & Privacy Audit
3. Verify: Audit runs automatically
4. Verify: Summary shows pass/warn/fail counts
5. Verify: Disclaimers section visible
6. Verify: No false compliance claims

### 8. Verify Input Validation
In the security audit, check:
- ✅ Input validation implemented
- ✅ Name validator (2-100 chars)
- ✅ Age validator (1-150)
- ✅ PIN validator (4-8 digits)
- ✅ Email validator (basic regex)
- ✅ Phone validator (10-15 digits)

### 9. Verify Data Safety
In the security audit, check:
- ✅ Data minimization principle
- ✅ Unique IDs (UUID-based)
- ✅ Data classification documented
- ✅ Privacy principles listed

### 10. Verify Disclaimers
Throughout the app, verify:
- ✅ Login screen: "Prototype Authentication" notice
- ✅ Security audit: "IMPORTANT DISCLAIMERS" section
- ✅ No HIPAA compliance claims
- ✅ No clinical-grade security claims
- ✅ No regulatory certification claims

---

## Automated Test Checklist

### Authentication
- [ ] Login screen shows on app start
- [ ] Demo users listed correctly
- [ ] Quick login works
- [ ] PIN login works
- [ ] Logout works
- [ ] Session expires after 8 hours (not testable in prototype)

### Patient Role
- [ ] Patient sees correct navigation
- [ ] Patient can access: Home, Games, Reminders, Progress, Settings
- [ ] Patient **cannot** access: Caregiver dashboard, Developer tools
- [ ] Patient settings show no developer tools
- [ ] Patient can log out

### Caregiver Role
- [ ] Caregiver sees correct navigation
- [ ] Caregiver can access: Dashboard, Reminders, Memory, Settings
- [ ] Caregiver sees patient cards
- [ ] Caregiver sees follow-up signals
- [ ] Caregiver settings show developer tools
- [ ] Caregiver can access security audit
- [ ] Caregiver can log out

### Security
- [ ] No hard-coded API keys
- [ ] No hard-coded secrets
- [ ] Input validation implemented
- [ ] Role separation enforced
- [ ] Unique IDs used
- [ ] Session management works
- [ ] Clear disclaimers present

### Data Safety
- [ ] Data minimization documented
- [ ] Data classification defined
- [ ] Privacy principles listed
- [ ] No false compliance claims

---

## Code Audit Commands

### Check for hard-coded secrets
```bash
# Search for common secret patterns
grep -rE "(api[_-]?key|secret|password|token)\s*[:=]\s*['\"][^'\"]+['\"]" src/

# Search for API key patterns
grep -rE "(sk_live|sk_test|pk_live|pk_test|ghp_|xox[baprs])" src/
```
Expected: No matches (or only in comments/disclaimers)

### Check for false compliance claims
```bash
# Search for compliance claims
grep -rE "(HIPAA compliant|clinical.grade security|FDA approved|regulatory certified)" src/
```
Expected: No matches (only disclaimers saying NOT compliant)

### Verify role separation
```bash
# Check that patient routes don't include caregiver screens
grep -n "caregiver" src/App.tsx | grep -v "CAREGIVER"
```
Expected: Only in caregiver-specific route sections

---

## Common Issues and Fixes

### Issue: Patient sees caregiver features
**Fix**: Check that `role === UserRole.PATIENT` routes don't include caregiver screens

### Issue: Caregiver doesn't see developer tools
**Fix**: Check that `isCaregiver` conditional wraps the Developer Tools section in SettingsScreen

### Issue: Login doesn't work
**Fix**: Verify demo PINs match:
- patient_demo_001: 1234
- patient_demo_002: 5678
- caregiver_demo_001: 0000
- caregiver_demo_002: 9999

### Issue: Bottom nav shows wrong tabs
**Fix**: Check that `BottomNav` receives `role` prop and uses correct tab set

---

## Security Posture Summary

### ✅ Implemented (Prototype)
- Input validation
- Role-based navigation
- Data minimization
- Unique IDs
- Session management
- No hard-coded secrets

### ⚠️ Not Implemented (Production Required)
- Server-side authentication
- Encryption at rest
- HTTPS
- Password hashing
- Rate limiting
- Audit logging
- CSRF protection
- Security audit
- Penetration testing
- Regulatory compliance

---

## Final Verification

Before considering Phase 10 complete:

1. ✅ Build succeeds without errors
2. ✅ No hard-coded secrets found
3. ✅ Patient login works correctly
4. ✅ Caregiver login works correctly
5. ✅ Role separation enforced
6. ✅ Security audit screen accessible
7. ✅ Disclaimers clearly visible
8. ✅ No false compliance claims
9. ✅ Input validation implemented
10. ✅ Data safety documented
