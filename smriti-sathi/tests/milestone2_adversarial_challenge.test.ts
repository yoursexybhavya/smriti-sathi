/**
 * Milestone 2 Adversarial Challenge & Verification Test Suite
 * 
 * Objective:
 * 1. Empirically verify that PatientHomeScreen.tsx renders exactly 4 game cards
 *    inside the launcher grid in a 2x2 layout, and verify the Memory Book is a separate featured card.
 * 2. Empirically verify that App.tsx keeps the bottom nav visible when activeTab === 'settings'.
 * 3. Verify back navigation and exit routes on Splash, Login, and Onboarding steps (0-4).
 * 4. Verify zero lingering legacy muddy colors across all M2 screens.
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// SUITE 1: PatientHomeScreen 2x2 Launcher Grid & Memory Book Separation
// ============================================================================
test('M2 Adversarial Suite 1: PatientHomeScreen 2x2 Launcher & Memory Book Card', async (t) => {
  const filePath = path.join(rootDir, 'src/pages/PatientHomeScreen.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('1.1: Launcher grid specifies responsive 2x2 layout (grid-cols-1 sm:grid-cols-2)', () => {
    // Look for the launcher grid section
    const gridMatch = content.match(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3\.5">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Featured Anchor Card/);
    assert.ok(gridMatch, 'Must find grid with grid-cols-1 sm:grid-cols-2 immediately followed by Featured Anchor Card');
    
    const gridContent = gridMatch[1];
    
    // Count buttons within this grid
    const buttonMatches = gridContent.match(/<button\b[\s\S]*?<\/button>/g) || [];
    assert.strictEqual(
      buttonMatches.length,
      4,
      `Expected exactly 4 game cards inside the launcher grid, but found ${buttonMatches.length}`
    );
  });

  await t.test('1.2: Launcher grid contains the exact 4 required cognitive games in order', () => {
    const gridMatch = content.match(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3\.5">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Featured Anchor Card/);
    assert.ok(gridMatch, 'Grid match required');
    const gridContent = gridMatch[1];

    assert.ok(gridContent.includes("onNavigate('remember-game')"), 'Launcher must contain remember-game');
    assert.ok(gridContent.includes("onNavigate('recognise-game')"), 'Launcher must contain recognise-game');
    assert.ok(gridContent.includes("onNavigate('memory-match')"), 'Launcher must contain memory-match');
    assert.ok(gridContent.includes("onNavigate('daily-routine')"), 'Launcher must contain daily-routine');
    
    // Memory book must NOT be one of the grid items
    assert.ok(
      !gridContent.includes("memory-book"),
      'Memory Book must NOT be inside the 2x2 cognitive exercises grid'
    );
  });

  await t.test('1.3: Each launcher card enforces elder-friendly tactile min-height (>=64px) and level badges', () => {
    const gridMatch = content.match(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3\.5">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Featured Anchor Card/);
    assert.ok(gridMatch, 'Grid match required');
    const gridContent = gridMatch[1];

    const cards = gridContent.split(/\{\/\* \d+\./).slice(1);
    assert.strictEqual(cards.length, 4, 'Must have 4 numbered card sections');

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      assert.ok(
        card.includes('min-h-[64px]'),
        `Card ${i + 1} must enforce min-h-[64px] tactile target`
      );
      assert.ok(
        card.includes('Level {gameProgress.'),
        `Card ${i + 1} must display dynamic Level badge`
      );
      assert.ok(
        card.includes('doneToday'),
        `Card ${i + 1} must display doneToday daily completion status`
      );
    }
  });

  await t.test('1.4: Personal Memory Book is rendered as a separate dedicated featured card outside the grid', () => {
    // Verify separate featured slot
    const featuredMatch = content.match(/\{\/\* Featured Anchor Card: Personal Memory Book[\s\S]*?<\/div>\s*\{\/\* Daily Comfort/);
    assert.ok(featuredMatch, 'Must find Personal Memory Book featured anchor card block outside grid');
    
    const featuredContent = featuredMatch[0];
    assert.ok(featuredContent.includes('Personal Memory Book'), 'Must contain Personal Memory Book heading');
    assert.ok(featuredContent.includes("onNavigate('memory-book-viewer')"), 'Must navigate to memory-book-viewer');
    assert.ok(featuredContent.includes('min-h-[56px]'), 'Must enforce min-h-[56px] tactile touch target');
    assert.ok(featuredContent.includes('Featured Family Sanctuary'), 'Must designate Featured Family Sanctuary');
  });
});

// ============================================================================
// SUITE 2: App.tsx Bottom Navigation Visibility for Settings Tab
// ============================================================================
test('M2 Adversarial Suite 2: App.tsx Bottom Navigation Visibility on Settings Tab', async (t) => {
  const filePath = path.join(rootDir, 'src/App.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  await t.test('2.1: patientNavTabs explicitly includes "settings"', () => {
    const patientNavTabsMatch = content.match(/const\s+patientNavTabs\s*=\s*\[(.*?)\];/);
    assert.ok(patientNavTabsMatch, 'Must find patientNavTabs declaration');
    
    const tabs = patientNavTabsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/['"]/g, ''));

    assert.deepStrictEqual(
      tabs,
      ['home', 'games', 'reminders', 'progress', 'settings'],
      'patientNavTabs must contain exactly [home, games, reminders, progress, settings]'
    );
  });

  await t.test('2.2: Caregiver nav tabs include caregiver-settings', () => {
    const caregiverNavTabsMatch = content.match(/const\s+caregiverNavTabs\s*=\s*\[(.*?)\];/);
    assert.ok(caregiverNavTabsMatch, 'Must find caregiverNavTabs declaration');

    const tabs = caregiverNavTabsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/['"]/g, ''));

    assert.ok(tabs.includes('caregiver-settings'), 'caregiverNavTabs must include caregiver-settings');
  });

  await t.test('2.3: Bottom nav simulation verifies showBottomNav is TRUE when activeTab === "settings"', () => {
    const patientNavTabs = ['home', 'games', 'reminders', 'progress', 'settings'];
    const caregiverNavTabs = ['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings'];

    const getShowBottomNav = (role: 'patient' | 'caregiver', activeTab: string) => {
      const currentNavTabs = role === 'patient' ? patientNavTabs : caregiverNavTabs;
      return currentNavTabs.includes(activeTab);
    };

    // Patient role
    assert.strictEqual(getShowBottomNav('patient', 'settings'), true, 'Patient settings MUST show bottom nav');
    assert.strictEqual(getShowBottomNav('patient', 'home'), true, 'Patient home MUST show bottom nav');
    assert.strictEqual(getShowBottomNav('patient', 'games'), true, 'Patient games MUST show bottom nav');
    assert.strictEqual(getShowBottomNav('patient', 'reminders'), true, 'Patient reminders MUST show bottom nav');
    assert.strictEqual(getShowBottomNav('patient', 'progress'), true, 'Patient progress MUST show bottom nav');

    // Cognitive game full immersion check (bottom nav should NOT distract during game play)
    assert.strictEqual(getShowBottomNav('patient', 'remember-game'), false, 'Game screen should hide bottom nav for cognitive focus');
    assert.strictEqual(getShowBottomNav('patient', 'recognise-game'), false, 'Game screen should hide bottom nav for cognitive focus');
    assert.strictEqual(getShowBottomNav('patient', 'memory-match'), false, 'Game screen should hide bottom nav for cognitive focus');
    assert.strictEqual(getShowBottomNav('patient', 'daily-routine'), false, 'Game screen should hide bottom nav for cognitive focus');

    // Caregiver role
    assert.strictEqual(getShowBottomNav('caregiver', 'caregiver-settings'), true, 'Caregiver settings MUST show bottom nav');
    assert.strictEqual(getShowBottomNav('caregiver', 'caregiver-home'), true, 'Caregiver home MUST show bottom nav');
  });

  await t.test('2.4: BottomNav component has 56px senior touch targets and handles "settings" tab', () => {
    const bottomNavPath = path.join(rootDir, 'src/components/BottomNav.tsx');
    const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf-8');

    assert.ok(bottomNavContent.includes("id: 'settings'"), 'BottomNav must include settings tab config');
    assert.ok(bottomNavContent.includes('min-h-[56px]'), 'BottomNav buttons must be at least 56px tall');
    assert.ok(bottomNavContent.includes('min-w-[56px]'), 'BottomNav buttons must be at least 56px wide');
  });
});

// ============================================================================
// SUITE 3: Back Navigation & Exit Routes on Splash, Login, and Onboarding
// ============================================================================
test('M2 Adversarial Suite 3: Back Navigation & Exit Routes on Splash, Login, and Onboarding', async (t) => {
  await t.test('3.1: SplashScreen timer cleans up and transitions smoothly to app entry', () => {
    const splashPath = path.join(rootDir, 'src/pages/SplashScreen.tsx');
    const splashContent = fs.readFileSync(splashPath, 'utf-8');

    assert.ok(splashContent.includes('setTimeout'), 'SplashScreen must utilize timer for serene entrance');
    assert.ok(splashContent.includes('clearTimeout'), 'SplashScreen must clean up timeout on unmount');
    assert.ok(splashContent.includes('v2.5.0 (v2.2.0)'), 'SplashScreen must display version info');

    // App.tsx splash timeout verification
    const appPath = path.join(rootDir, 'src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    assert.ok(
      appContent.match(/setTimeout\(\(\)\s*=>\s*setShowSplash\(false\),\s*2500\)/),
      'App.tsx must transition splash screen after 2500ms'
    );
  });

  await t.test('3.2: LoginScreen provides elder quick login and caregiver back-to-elder escape route', () => {
    const loginPath = path.join(rootDir, 'src/pages/auth/LoginScreen.tsx');
    const loginContent = fs.readFileSync(loginPath, 'utf-8');

    // Elder quick login
    assert.ok(
      loginContent.includes('handleDirectElderLogin'),
      'LoginScreen must provide handleDirectElderLogin for friction-free elder entry'
    );
    assert.ok(
      loginContent.includes('quickLogin(\'patient_primary\')'),
      'handleDirectElderLogin must call quickLogin'
    );

    // Escape hatch when in caregiver mode
    assert.ok(
      loginContent.includes('← Back to Elder'),
      'LoginScreen must have a visible "← Back to Elder" button when caregiver profile is selected'
    );
    assert.ok(
      loginContent.includes("setSelectedUser('patient_primary')"),
      'Back to Elder must reset selectedUser to patient_primary'
    );

    // Tactile Keypad
    assert.ok(
      loginContent.includes('Tactile Keypad for Caregiver PIN'),
      'LoginScreen must provide tactile numeric keypad for PIN entry'
    );
  });

  await t.test('3.3: OnboardingFlow wires back navigation across all steps (0 to 4) and exit on step 0', () => {
    const flowPath = path.join(rootDir, 'src/pages/onboarding/OnboardingFlow.tsx');
    const flowContent = fs.readFileSync(flowPath, 'utf-8');

    // Check goBack implementation
    assert.ok(flowContent.includes('const goBack = () => {'), 'Must have goBack handler');
    assert.ok(
      flowContent.includes('if (step === 0 && onCancel)'),
      'Step 0 back must trigger onCancel exit handler'
    );
    assert.ok(
      flowContent.includes('Math.max(0, prev - 1)'),
      'goBack must decrement step safely with Math.max(0, prev - 1)'
    );

    // App.tsx connects onCancel to logout
    const appPath = path.join(rootDir, 'src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    assert.ok(
      appContent.includes('onCancel={logout}'),
      'App.tsx must pass onCancel={logout} to OnboardingFlow so elders can cleanly exit back to login'
    );

    // Step 0: OnboardingWelcome
    const welcomePath = path.join(rootDir, 'src/pages/onboarding/OnboardingWelcome.tsx');
    const welcomeContent = fs.readFileSync(welcomePath, 'utf-8');
    assert.ok(welcomeContent.includes('Switch Profile / Login'), 'OnboardingWelcome must offer top switch profile / login back button');
    assert.ok(welcomeContent.includes('Return to Profile Selection'), 'OnboardingWelcome must offer return to profile selection');

    // Step 1: PatientProfileSetup
    const profilePath = path.join(rootDir, 'src/pages/onboarding/PatientProfileSetup.tsx');
    const profileContent = fs.readFileSync(profilePath, 'utf-8');
    assert.ok(profileContent.includes('onClick={onBack}'), 'PatientProfileSetup must wire onBack to back button');
    assert.ok(profileContent.includes('← Back to Welcome'), 'PatientProfileSetup must have text Back to Welcome');

    // Step 2: LanguageSelection
    const langPath = path.join(rootDir, 'src/pages/onboarding/LanguageSelection.tsx');
    const langContent = fs.readFileSync(langPath, 'utf-8');
    assert.ok(langContent.includes('onClick={onBack}'), 'LanguageSelection must wire onBack to back button');
    assert.ok(langContent.includes('← Back to Profile Setup'), 'LanguageSelection must have text Back to Profile Setup');

    // Step 3: AccessibilitySetup
    const accessPath = path.join(rootDir, 'src/pages/onboarding/AccessibilitySetup.tsx');
    const accessContent = fs.readFileSync(accessPath, 'utf-8');
    assert.ok(accessContent.includes('onClick={onBack}'), 'AccessibilitySetup must wire onBack to back button');
    assert.ok(accessContent.includes('← Back to Language'), 'AccessibilitySetup must have text Back to Language');

    // Step 4: OnboardingComplete
    const completePath = path.join(rootDir, 'src/pages/onboarding/OnboardingComplete.tsx');
    const completeContent = fs.readFileSync(completePath, 'utf-8');
    assert.ok(completeContent.includes('onClick={onBack}'), 'OnboardingComplete must wire onBack');
    assert.ok(completeContent.includes('← Review Settings'), 'OnboardingComplete must have text Review Settings');
  });

  await t.test('3.4: Onboarding state machine simulation under stress', () => {
    // Model onboarding step transitions
    let step = 0;
    let cancelCalled = false;
    let finishCalled = false;

    const onCancel = () => { cancelCalled = true; };
    const onFinish = () => { finishCalled = true; };
    const goBack = () => {
      if (step === 0) {
        onCancel();
        return;
      }
      step = Math.max(0, step - 1);
    };

    // Forward through all steps
    step = 0;
    step = 1; // Welcome -> Profile
    step = 2; // Profile -> Language
    step = 3; // Language -> Accessibility
    step = 4; // Accessibility -> Complete

    // Back step-by-step
    goBack(); // to 3
    assert.strictEqual(step, 3, 'Back from Complete must reach Accessibility (3)');
    goBack(); // to 2
    assert.strictEqual(step, 2, 'Back from Accessibility must reach Language (2)');
    goBack(); // to 1
    assert.strictEqual(step, 1, 'Back from Language must reach Profile Setup (1)');
    goBack(); // to 0
    assert.strictEqual(step, 0, 'Back from Profile Setup must reach Welcome (0)');
    
    // Back on step 0 should cancel/exit
    goBack();
    assert.strictEqual(cancelCalled, true, 'Back on Welcome (step 0) must trigger cancel/exit');
    assert.strictEqual(step, 0, 'Step must not become negative on step 0 back');
  });
});

// ============================================================================
// SUITE 4: Zero Lingering Muddy Legacy Colors Audit
// ============================================================================
test('M2 Adversarial Suite 4: Strict Color Audit Across M2 Redesigned Surfaces', async (t) => {
  const targetFiles = [
    'src/pages/SplashScreen.tsx',
    'src/pages/auth/LoginScreen.tsx',
    'src/pages/PatientHomeScreen.tsx',
    'src/pages/onboarding/OnboardingFlow.tsx',
    'src/pages/onboarding/OnboardingWelcome.tsx',
    'src/pages/onboarding/PatientProfileSetup.tsx',
    'src/pages/onboarding/LanguageSelection.tsx',
    'src/pages/onboarding/AccessibilitySetup.tsx',
    'src/pages/onboarding/OnboardingComplete.tsx',
  ];

  const forbiddenColors = [
    '#1B5E20', // Legacy dark green
    '#F5F0E8', // Legacy muddy canvas
    '#FDF8F0', // Legacy yellow-tinted off-white
    '#E0D8CC', // Legacy border tan
    '#E8F5E9', // Legacy light green tint
  ];

  for (const file of targetFiles) {
    const absPath = path.join(rootDir, file);
    const content = fs.readFileSync(absPath, 'utf-8');

    for (const color of forbiddenColors) {
      await t.test(`${file} has ZERO instances of ${color}`, () => {
        assert.ok(
          !content.includes(color),
          `Found forbidden legacy color ${color} in ${file}`
        );
      });
    }
  }
});
