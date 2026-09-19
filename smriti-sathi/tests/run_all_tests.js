#!/usr/bin/env node

/**
 * Master E2E Test Runner for Smriti Sathi Dementia Care Evidence-Based Features
 * Executes Tiers 1-4 suites + Clinical Baseline.
 * Reports clean TAP / formatted summary and exits with code 0 on all-pass.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const testSuites = [
  {
    name: 'Tier 1: Feature Coverage (12 Features x >=5 tests)',
    path: 'tests/tier1_feature_coverage.test.ts',
  },
  {
    name: 'Tier 2: Boundary & Corner Cases (12 Features x >=5 boundary tests)',
    path: 'tests/tier2_boundary_corner_cases.test.ts',
  },
  {
    name: 'Tier 3: Cross-Feature Pairwise Interactions (>=12 scenarios)',
    path: 'tests/tier3_cross_feature_interactions.test.ts',
  },
  {
    name: 'Tier 4: Real-World Application Workflows (>=5 workflows)',
    path: 'tests/tier4_real_world_scenarios.test.ts',
  },
  {
    name: 'Tier 5A: Adversarial Hardening (Errorless Learning Stress Tests)',
    path: 'tests/tier5_adversarial_errorless_learning.test.ts',
  },
  {
    name: 'Tier 5B: Adversarial Stress & Vulnerability Challenge (Voice & Modals, 35 tests)',
    path: 'tests/adversarial_stress_challenge.test.ts',
  },
  {
    name: 'Clinical Baseline: Stability Performance Index (SPI Engine)',
    path: 'src/engine/test_spi_baseline.js',
  },
];

console.log('\n======================================================================');
console.log('🧪 SMRITI SATHI COMPREHENSIVE E2E TEST SUITE (TIERS 1 - 4)');
console.log('   Evidence-Based Dementia Care Features Verification');
console.log('======================================================================\n');

async function runSuite(suite) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    console.log(`▶ Running Suite: ${suite.name}`);
    console.log(`  Target: ${suite.path}\n`);

    const child = spawn(
      process.execPath,
      ['--experimental-strip-types', suite.path],
      {
        cwd: rootDir,
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' },
      }
    );

    child.on('close', (code) => {
      const elapsedMs = Date.now() - startTime;
      resolve({
        ...suite,
        code,
        elapsedMs,
      });
    });
  });
}

async function main() {
  const results = [];
  let allPassed = true;
  const overallStart = Date.now();

  for (const suite of testSuites) {
    const res = await runSuite(suite);
    results.push(res);
    if (res.code !== 0) {
      allPassed = false;
    }
    console.log(`\n----------------------------------------------------------------------\n`);
  }

  const overallElapsed = ((Date.now() - overallStart) / 1000).toFixed(2);

  console.log('\n======================================================================');
  console.log('📊 E2E TEST EXECUTION SUMMARY REPORT');
  console.log('======================================================================\n');

  for (const res of results) {
    const statusIcon = res.code === 0 ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${statusIcon}  ${res.name.padEnd(65)} (${res.elapsedMs}ms)`);
  }

  console.log('\n----------------------------------------------------------------------');
  console.log(`Total Test Suites: ${results.length}`);
  console.log(`Passed Suites:     ${results.filter((r) => r.code === 0).length}`);
  console.log(`Failed Suites:     ${results.filter((r) => r.code !== 0).length}`);
  console.log(`Total Wall Time:   ${overallElapsed}s`);
  console.log('----------------------------------------------------------------------\n');

  if (allPassed) {
    console.log('🎉 ALL TIERS 1-4 E2E TESTS PASSED WITH 100% SUCCESS (EXIT CODE 0)\n');
    process.exit(0);
  } else {
    console.error('💥 ONE OR MORE TEST SUITES FAILED (EXIT CODE 1)\n');
    process.exit(1);
  }
}

main();
