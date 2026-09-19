import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();

console.log('======================================================================');
console.log('🔍 CHALLENGER 1 RE-CHECK: EMPIRICAL VERIFICATION HARNESS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function runCheck(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS  ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL  ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// ---------------------------------------------------------------------------
// 1. Test Suite Verification
// ---------------------------------------------------------------------------
console.log('▶ SUITE 1: Full Test Suite Execution & Tier 2 Boundary Verification');

runCheck('1.1: npm test (node tests/run_all_tests.js) exits with code 0', () => {
  const output = execSync('node tests/run_all_tests.js', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(output.includes('Passed Suites:     7'), 'Must report 7 passed suites');
  assert.ok(output.includes('Failed Suites:     0'), 'Must report 0 failed suites');
  assert.ok(output.includes('ALL TIERS 1-4 E2E TESTS PASSED WITH 100% SUCCESS'), 'Must report 100% success');
});

runCheck('1.2: Tier 2 Boundary & Corner Cases suite passes all 96 tests', () => {
  const output = execSync('node --test tests/tier2_boundary_corner_cases.test.ts', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(output.includes('pass 96'), 'Tier 2 must pass 96 tests');
  assert.ok(output.includes('fail 0'), 'Tier 2 must have 0 failures');
});

// ---------------------------------------------------------------------------
// 2. Color Token Cleanliness & Residual Check
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 2: Color Token Cleanliness & Hex Integrity');

runCheck('2.1: ProgressCard.tsx line 16 has #4F46E5', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ProgressCard.tsx'), 'utf-8');
  const lines = content.split('\n');
  const line16 = lines[15] || '';
  assert.ok(line16.includes('#4F46E5'), `Line 16 must include #4F46E5, found: ${line16}`);
});

runCheck('2.2: Zero residual #1B5E20 in src/components/', () => {
  const compDir = path.join(rootDir, 'src/components');
  const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  for (const file of files) {
    const text = fs.readFileSync(path.join(compDir, file), 'utf-8');
    assert.ok(!text.includes('#1B5E20'), `Found residual #1B5E20 in ${file}`);
  }
});

runCheck('2.3: Zero residual #F5F0E8 in src/components/', () => {
  const compDir = path.join(rootDir, 'src/components');
  const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  for (const file of files) {
    const text = fs.readFileSync(path.join(compDir, file), 'utf-8');
    assert.ok(!text.includes('#F5F0E8'), `Found residual #F5F0E8 in ${file}`);
  }
});

runCheck('2.4: Zero residual #FDF8F0 in src/components/', () => {
  const compDir = path.join(rootDir, 'src/components');
  const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  for (const file of files) {
    const text = fs.readFileSync(path.join(compDir, file), 'utf-8');
    assert.ok(!text.includes('#FDF8F0'), `Found residual #FDF8F0 in ${file}`);
  }
});

runCheck('2.5: Zero residual legacy colors in index.html', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(!html.includes('#1B5E20'), 'index.html must not contain #1B5E20');
  assert.ok(!html.includes('#F5F0E8'), 'index.html must not contain #F5F0E8');
  assert.ok(!html.includes('#FDF8F0'), 'index.html must not contain #FDF8F0');
});

// ---------------------------------------------------------------------------
// 3. StatusIndicator Modern Semantic Tokens
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 3: StatusIndicator Semantic Token Validation');

runCheck('3.1: StatusIndicator.tsx has zero legacy pastel hex codes', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/StatusIndicator.tsx'), 'utf-8');
  const legacyPastels = ['#E8F5E9', '#2E7D32', '#EFEBE9', '#5D4037', '#FFF3E0', '#E65100'];
  for (const hex of legacyPastels) {
    assert.ok(!content.includes(hex), `StatusIndicator must not contain legacy hex ${hex}`);
  }
});

runCheck('3.2: StatusIndicator.tsx uses modern Scandinavian Tailwind emerald/slate/amber tokens', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/StatusIndicator.tsx'), 'utf-8');
  assert.ok(content.includes('bg-emerald-100'), 'Must include bg-emerald-100');
  assert.ok(content.includes('dark:bg-emerald-950/60'), 'Must include dark:bg-emerald-950/60');
  assert.ok(content.includes('text-emerald-800'), 'Must include text-emerald-800');
  assert.ok(content.includes('dark:text-emerald-300'), 'Must include dark:text-emerald-300');
  assert.ok(content.includes('bg-slate-200'), 'Must include bg-slate-200');
  assert.ok(content.includes('dark:bg-slate-800'), 'Must include dark:bg-slate-800');
  assert.ok(content.includes('text-slate-700'), 'Must include text-slate-700');
  assert.ok(content.includes('dark:text-slate-300'), 'Must include dark:text-slate-300');
  assert.ok(content.includes('bg-amber-100'), 'Must include bg-amber-100');
  assert.ok(content.includes('dark:bg-amber-950/60'), 'Must include dark:bg-amber-950/60');
  assert.ok(content.includes('text-amber-800'), 'Must include text-amber-800');
  assert.ok(content.includes('dark:text-amber-300'), 'Must include dark:text-amber-300');
});

// ---------------------------------------------------------------------------
// 4. Touch Target Standard Verification (>= 56px)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 4: Touch Target Standard (>= 56px)');

runCheck('4.1: SectionHeader.tsx specifies min-h-[56px] and NO min-h-[44px]', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/SectionHeader.tsx'), 'utf-8');
  assert.ok(content.includes('min-h-[56px]'), 'Must contain min-h-[56px]');
  assert.ok(!content.includes('min-h-[44px]'), 'Must NOT contain min-h-[44px]');
});

runCheck('4.2: HearInstructionsButton.tsx enforces min-h-[56px] min-w-[56px] on all variants', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/HearInstructionsButton.tsx'), 'utf-8');
  assert.ok(content.includes("sm: 'px-3 py-2 text-sm min-h-[56px] min-w-[56px]'"), 'sm size must enforce 56px');
  assert.ok(content.includes("md: 'px-4 py-3 text-base min-h-[56px] min-w-[56px]'"), 'md size must enforce 56px');
  assert.ok(content.includes("lg: 'px-6 py-4 text-lg min-h-[56px] min-w-[56px]'"), 'lg size must enforce 56px');
  assert.ok(content.includes('min-h-[56px] min-w-[56px]'), 'Button className must enforce 56px');
});

runCheck('4.3: ProfileSwitcherModal.tsx action buttons specify minHeight: 56px', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ProfileSwitcherModal.tsx'), 'utf-8');
  const matches = content.match(/minHeight:\s*'56px'/g);
  assert.ok(matches && matches.length >= 2, `Expected at least 2 instances of minHeight: '56px', found ${matches?.length}`);
  assert.ok(!content.includes("minHeight: '48px'"), 'Must NOT contain residual minHeight: 48px');
});

runCheck('4.4: CaregiverAudioRecorder.tsx preview & playback buttons enforce 56px dimensions', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/CaregiverAudioRecorder.tsx'), 'utf-8');
  assert.ok(!content.includes("width: '42px', height: '42px'"), 'Must NOT have 42px preview button');
  assert.ok(!content.includes("width: '38px', height: '38px'"), 'Must NOT have 38px playback button');
  const matches56 = content.match(/min-w-\[56px\] min-h-\[56px\]/g);
  assert.ok(matches56 && matches56.length >= 2, 'Must contain min-w-[56px] min-h-[56px] classes on audio controls');
});

// ---------------------------------------------------------------------------
// 5. Compiler & Build Verification
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 5: Compiler, Typecheck & Production Build Verification');

runCheck('5.1: tsconfig.app.json specifies strict: true', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'tsconfig.app.json'), 'utf-8');
  const clean = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const tsconfig = JSON.parse(clean);
  assert.strictEqual(tsconfig.compilerOptions.strict, true, 'strict mode must be true');
});

runCheck('5.2: npm run typecheck succeeds with exit code 0', () => {
  const output = execSync('npm run typecheck', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(!output.includes('error TS'), 'Must have zero TypeScript errors');
});

runCheck('5.3: npm run build succeeds and produces valid bundle', () => {
  const output = execSync('npm run build', { cwd: rootDir, encoding: 'utf-8' });
  assert.ok(output.includes('built in'), 'Vite build must report successful build');
  assert.ok(fs.existsSync(path.join(rootDir, 'dist/index.html')), 'dist/index.html must exist');
  assert.ok(fs.existsSync(path.join(rootDir, 'dist/assets')), 'dist/assets must exist');
});

console.log('\n----------------------------------------------------------------------');
console.log(`Total Checks: ${passCount + failCount}`);
console.log(`Passed:       ${passCount}`);
console.log(`Failed:       ${failCount}`);
console.log('----------------------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL RE-CHECK EMPIRICAL VERIFICATIONS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
