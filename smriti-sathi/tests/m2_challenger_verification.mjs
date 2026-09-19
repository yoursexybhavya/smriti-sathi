import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();

console.log('======================================================================');
console.log('🔍 CHALLENGER M2-2: EMPIRICAL VERIFICATION & STRESS HARNESS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function runCheck(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS  ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL  ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
    failures.push({ name, error: err.message });
  }
}

// ---------------------------------------------------------------------------
// 1. Color Cleanliness Automated Grep Check
// ---------------------------------------------------------------------------
console.log('▶ SUITE 1: Color Cleanliness Check (#F5F0E8, #FDF8F0, #1B5E20)');

runCheck('1.1: Zero occurrences of #F5F0E8 in M2 screens', () => {
  const targetFiles = [
    'src/pages/SplashScreen.tsx',
    'src/pages/auth/LoginScreen.tsx',
    'src/pages/PatientHomeScreen.tsx'
  ];
  const onboardingFiles = fs.readdirSync(path.join(rootDir, 'src/pages/onboarding'))
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join('src/pages/onboarding', f));
  
  const allFiles = [...targetFiles, ...onboardingFiles];
  for (const relPath of allFiles) {
    const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
    assert.ok(!content.includes('#F5F0E8'), `Found #F5F0E8 in ${relPath}`);
    assert.ok(!content.includes('#f5f0e8'), `Found #f5f0e8 in ${relPath}`);
  }
});

runCheck('1.2: Zero occurrences of #FDF8F0 in M2 screens', () => {
  const targetFiles = [
    'src/pages/SplashScreen.tsx',
    'src/pages/auth/LoginScreen.tsx',
    'src/pages/PatientHomeScreen.tsx'
  ];
  const onboardingFiles = fs.readdirSync(path.join(rootDir, 'src/pages/onboarding'))
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join('src/pages/onboarding', f));
  
  const allFiles = [...targetFiles, ...onboardingFiles];
  for (const relPath of allFiles) {
    const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
    assert.ok(!content.includes('#FDF8F0'), `Found #FDF8F0 in ${relPath}`);
    assert.ok(!content.includes('#fdf8f0'), `Found #fdf8f0 in ${relPath}`);
  }
});

runCheck('1.3: Zero occurrences of #1B5E20 in M2 screens', () => {
  const targetFiles = [
    'src/pages/SplashScreen.tsx',
    'src/pages/auth/LoginScreen.tsx',
    'src/pages/PatientHomeScreen.tsx'
  ];
  const onboardingFiles = fs.readdirSync(path.join(rootDir, 'src/pages/onboarding'))
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join('src/pages/onboarding', f));
  
  const allFiles = [...targetFiles, ...onboardingFiles];
  for (const relPath of allFiles) {
    const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
    assert.ok(!content.includes('#1B5E20'), `Found #1B5E20 in ${relPath}`);
    assert.ok(!content.includes('#1b5e20'), `Found #1b5e20 in ${relPath}`);
  }
});

// ---------------------------------------------------------------------------
// 2. Touch Target Verification (>= 56px height)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 2: Touch Target Verification (>= 56px height)');

runCheck('2.1: Keypad buttons in LoginScreen.tsx must be >= 56px (h-14 or min-h-[56px])', () => {
  const loginCode = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');
  
  // Find keypad section
  const keypadStart = loginCode.indexOf('Tactile Keypad for Caregiver PIN');
  assert.ok(keypadStart !== -1, 'Tactile Keypad section must exist in LoginScreen.tsx');
  const keypadSection = loginCode.slice(keypadStart, keypadStart + 2500);

  // Check digits 1-9 button class
  const digitMatch = keypadSection.match(/\[1,\s*2,\s*3,\s*4,\s*5,\s*6,\s*7,\s*8,\s*9\][\s\S]*?<button[\s\S]*?className="([^"]*)"/);
  assert.ok(digitMatch, 'Keypad digit button must be found');
  const digitClasses = digitMatch[1];
  
  const is56orMore = digitClasses.includes('h-14') || 
                     digitClasses.includes('h-16') || 
                     digitClasses.includes('min-h-[56px]') ||
                     digitClasses.includes('min-h-[64px]');
  assert.ok(is56orMore, `Keypad digit buttons class is "${digitClasses}", which fails >= 56px requirement (found h-12 = 48px)`);
});

runCheck('2.2: Keypad action buttons (Clear, 0, Backspace) in LoginScreen.tsx must be >= 56px', () => {
  const loginCode = fs.readFileSync(path.join(rootDir, 'src/pages/auth/LoginScreen.tsx'), 'utf-8');
  const keypadStart = loginCode.indexOf('Tactile Keypad for Caregiver PIN');
  const keypadSection = loginCode.slice(keypadStart, keypadStart + 2500);

  const clearMatch = keypadSection.match(/<button[\s\S]*?Clear[\s\S]*?className="([^"]*)"/) || 
                     keypadSection.match(/className="([^"]*)"[\s\S]*?>[\s\S]*?Clear[\s\S]*?<\/button>/);
  assert.ok(clearMatch, 'Clear button must be found');
  const clearClasses = clearMatch[1];
  const isClear56 = clearClasses.includes('h-14') || clearClasses.includes('min-h-[56px]');
  assert.ok(isClear56, `Clear button class is "${clearClasses}", which fails >= 56px requirement (found h-12 = 48px)`);
});

runCheck('2.3: All onboarding step buttons must meet >= 56px touch target', () => {
  const onboardingDir = path.join(rootDir, 'src/pages/onboarding');
  const files = fs.readdirSync(onboardingDir).filter(f => f.endsWith('.tsx'));
  
  const sub56Buttons = [];
  
  for (const f of files) {
    const code = fs.readFileSync(path.join(onboardingDir, f), 'utf-8');
    // find buttons
    const btnMatches = code.matchAll(/<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g);
    for (const m of btnMatches) {
      const attrs = m[1];
      const inner = m[2].trim().slice(0, 40).replace(/\n/g, ' ');
      const classMatch = attrs.match(/className=(?:\{`([\s\S]*?)`\}|"([^"]*)")/);
      const classStr = classMatch ? (classMatch[1] || classMatch[2]) : '';
      
      // Check if it has 48px, 44px, 40px, or 52px
      const hasSub56 = classStr.includes('min-h-[48px]') || 
                       classStr.includes('min-h-[52px]') || 
                       classStr.includes('h-10') || 
                       classStr.includes('w-10') || 
                       classStr.includes('h-11') || 
                       classStr.includes('w-11') || 
                       classStr.includes('h-12');
      if (hasSub56) {
        sub56Buttons.push({ file: f, button: inner, classStr });
      }
    }
  }

  assert.strictEqual(sub56Buttons.length, 0, 
    `Found ${sub56Buttons.length} buttons with sub-56px height in onboarding:\n` +
    sub56Buttons.map(b => `  - [${b.file}] "${b.button}": ${b.classStr}`).join('\n')
  );
});

// ---------------------------------------------------------------------------
// 3. Build & Test Verification
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 3: Build, Typecheck & Full Test Suite');

runCheck('3.1: npm run typecheck passes cleanly', () => {
  const output = execSync('npm run typecheck', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(!output.includes('error TS'), 'Must have zero TypeScript errors');
});

runCheck('3.2: npm run build produces production bundle cleanly', () => {
  const output = execSync('npm run build', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(output.includes('built in'), 'Build must succeed cleanly');
});

runCheck('3.3: npm test passes 100% of suites', () => {
  const output = execSync('npm test', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(output.includes('Passed Suites:     7'), 'All 7 suites must pass');
  assert.ok(output.includes('Failed Suites:     0'), '0 suites must fail');
});

// ---------------------------------------------------------------------------
// Summary & Verdict
// ---------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount}`);
console.log(`PASSED:       ${passCount}`);
console.log(`FAILED:       ${failCount}`);
console.log('======================================================================\n');

if (failCount > 0) {
  console.log('🛑 VERDICT: REJECT');
  console.log('Failure details:');
  failures.forEach(f => console.log(` - ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log('🎉 VERDICT: APPROVE');
  process.exit(0);
}
