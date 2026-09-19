# Phase 4 Testing Guide

## Overview
This guide provides step-by-step instructions to verify the offline-first database architecture implementation.

## Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No internet connection required for testing

## Test 1: Database Initialization

### Steps:
1. Open the application
2. Navigate to Settings → Developer Tools → Run Database Tests
3. Click "Run All Tests"

### Expected Results:
- ✓ Database initialized successfully
- ✓ All 14 tests pass
- ✓ No errors in console

## Test 2: Offline Operation

### Steps:
1. Disable internet connection (airplane mode or disconnect network)
2. Open the application
3. Verify connectivity indicator shows "Offline"
4. Complete onboarding if not already done
5. Navigate through all screens

### Expected Results:
- ✓ App loads without internet
- ✓ All screens accessible
- ✓ No network errors
- ✓ Connectivity indicator shows "Offline"

## Test 3: Game Session Persistence

### Steps:
1. Ensure offline mode
2. Play Remember game (complete at least one round)
3. Play Recognise game (complete at least one round)
4. Navigate to Games screen
5. Verify statistics show updated values
6. Close browser completely
7. Reopen browser and app
8. Navigate to Games screen

### Expected Results:
- ✓ Game sessions saved
- ✓ Statistics persist after restart
- ✓ Scores visible in progress tracking
- ✓ Streak counter updates correctly

## Test 4: Reminder System

### Steps:
1. Navigate to Reminders screen
2. Create a new reminder (medicine, hydration, activity, or appointment)
3. Mark reminder as completed
4. Close browser
5. Reopen browser
6. Navigate to Reminders screen

### Expected Results:
- ✓ Reminder created successfully
- ✓ Completion status persists
- ✓ Reminder visible after restart
- ✓ Completion history maintained

## Test 5: Settings Persistence

### Steps:
1. Navigate to Settings
2. Change text size to "Extra Large"
3. Enable high contrast
4. Disable voice guidance
5. Close browser
6. Reopen browser
7. Navigate to Settings

### Expected Results:
- ✓ All settings persist
- ✓ Text size remains "Extra Large"
- ✓ High contrast remains enabled
- ✓ Voice guidance remains disabled

## Test 6: User Profile Persistence

### Steps:
1. Navigate to Settings
2. Verify patient profile is visible
3. Note the patient name and age
4. Close browser
5. Reopen browser
6. Navigate to Settings

### Expected Results:
- ✓ Patient profile persists
- ✓ Name and age remain unchanged
- ✓ Profile image (if set) persists

## Test 7: Sync Queue

### Steps:
1. Navigate to Settings → Developer Tools → Run Database Tests
2. Run all tests
3. Observe sync event creation in test results

### Expected Results:
- ✓ Sync events created for each operation
- ✓ Sync queue shows pending events
- ✓ Simulated sync completes successfully

## Test 8: Database Clear and Reset

### Steps:
1. Navigate to Settings → Developer Tools → Run Database Tests
2. Click "Clear Database"
3. Confirm the action
4. Refresh the page
5. Verify onboarding screen appears

### Expected Results:
- ✓ Database cleared successfully
- ✓ App returns to onboarding state
- ✓ All data removed
- ✓ Fresh start possible

## Test 9: Connectivity Indicator

### Steps:
1. Start with internet connected
2. Observe connectivity indicator shows "Online"
3. Disable internet connection
4. Observe indicator changes to "Offline"
5. Re-enable internet connection
6. Observe indicator changes back to "Online"

### Expected Results:
- ✓ Indicator updates in real-time
- ✓ Correct status displayed
- ✓ No lag or delay
- ✓ Visual distinction between states

## Test 10: Performance Under Load

### Steps:
1. Play multiple rounds of Remember game (10+ rounds)
2. Play multiple rounds of Recognise game (10+ rounds)
3. Create multiple reminders (5+)
4. Navigate between screens rapidly
5. Check browser console for errors

### Expected Results:
- ✓ No performance degradation
- ✓ No memory leaks
- ✓ No console errors
- ✓ Smooth navigation
- ✓ Fast data retrieval

## Test 11: Data Integrity

### Steps:
1. Open browser developer tools
2. Navigate to Application/Storage tab
3. Find IndexedDB → SmritiSathiDB
4. Inspect each table
5. Verify data structure

### Expected Results:
- ✓ All 7 tables present
- ✓ Data correctly structured
- ✓ Foreign keys maintained
- ✓ Timestamps accurate
- ✓ No corrupted data

## Test 12: Error Handling

### Steps:
1. Navigate to Settings → Developer Tools → Run Database Tests
2. Intentionally cause an error (if possible)
3. Observe error handling

### Expected Results:
- ✓ Errors caught gracefully
- ✓ User-friendly error messages
- ✓ App doesn't crash
- ✓ Recovery possible

## Test 13: Browser Compatibility

### Steps:
Test in multiple browsers:
1. Chrome/Chromium
2. Firefox
3. Edge
4. Safari

### Expected Results:
- ✓ All tests pass in each browser
- ✓ IndexedDB supported
- ✓ No browser-specific errors
- ✓ Consistent behavior

## Test 14: Mobile Responsiveness

### Steps:
1. Open app on mobile device or use device emulation
2. Test all features on small screen
3. Verify touch interactions work

### Expected Results:
- ✓ All buttons tappable
- ✓ Text readable on small screens
- ✓ No layout issues
- ✓ Touch interactions smooth

## Common Issues and Solutions

### Issue: Database not initializing
**Solution**: Clear browser cache and reload. Check console for errors.

### Issue: Data not persisting
**Solution**: Verify IndexedDB is enabled in browser. Check browser storage settings.

### Issue: Sync queue not working
**Solution**: This is expected - sync queue is prepared for future cloud integration.

### Issue: Connectivity indicator not updating
**Solution**: Check browser's online/offline event support. May require page reload.

## Automated Test Results

Run the database test suite and verify all tests pass:
- [ ] Test 1: Database initialization
- [ ] Test 2: User CRUD operations
- [ ] Test 3: Game session management
- [ ] Test 4: Reminder operations
- [ ] Test 5: Settings persistence
- [ ] Test 6: Sync event creation
- [ ] Test 7: Data retrieval
- [ ] Test 8: Statistics calculation
- [ ] Test 9: Data updates
- [ ] Test 10: Data deletion
- [ ] Test 11: Query operations
- [ ] Test 12: Transaction support
- [ ] Test 13: Error handling
- [ ] Test 14: Performance

## Sign-off Checklist

- [ ] All 14 manual tests pass
- [ ] Automated test suite passes
- [ ] No console errors
- [ ] Works offline completely
- [ ] Data persists across restarts
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Error handling robust
- [ ] User experience smooth

## Next Steps

After successful testing:
1. Document any issues found
2. Create bug reports if needed
3. Proceed to Phase 5 (Reminder System)
4. Consider PWA conversion for better offline experience

## Support

If tests fail:
1. Check browser console for errors
2. Verify IndexedDB is enabled
3. Clear browser cache
4. Try different browser
5. Check PHASE4_SUMMARY.md for implementation details
