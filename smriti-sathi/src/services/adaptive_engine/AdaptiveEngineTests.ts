// Tests for Adaptive Difficulty Service
// Verifies the deterministic difficulty adjustment logic

import { AdaptiveDifficultyService } from './AdaptiveDifficultyService';

export interface TestResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

export class AdaptiveEngineTests {
  /**
   * Run all tests and return results
   */
  static runAllTests(): TestResult[] {
    const results: TestResult[] = [];
    
    results.push(this.testHighPerformance());
    results.push(this.testHighPerformanceWithFastResponse());
    results.push(this.testMediumPerformance());
    results.push(this.testLowPerformance());
    results.push(this.testLowPerformanceWithSlowResponse());
    results.push(this.testMinimumDifficultyClamp());
    results.push(this.testMaximumDifficultyClamp());
    results.push(this.testNoSessions());
    results.push(this.testMixedPerformance());
    
    return results;
  }

  /**
   * Test: High performance (>= 80% accuracy) should increase difficulty
   */
  static testHighPerformance(): TestResult {
    const testName = 'High Performance (80-100% accuracy)';
    const currentDifficulty = 2;
    const recentAccuracies = [85, 90, 88, 92, 87];
    const recentResponseTimes = [15, 14, 16, 15, 14]; // Normal response times

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 3;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty increased from 2 to 3 for high performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: High performance with fast response should increase difficulty
   */
  static testHighPerformanceWithFastResponse(): TestResult {
    const testName = 'High Performance + Fast Response';
    const currentDifficulty = 3;
    const recentAccuracies = [95, 92, 98, 90, 94];
    const recentResponseTimes = [8, 7, 9, 8, 7]; // Fast responses

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 4;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty increased from 3 to 4 for excellent performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Medium performance (50-79% accuracy) should maintain difficulty
   */
  static testMediumPerformance(): TestResult {
    const testName = 'Medium Performance (50-79% accuracy)';
    const currentDifficulty = 3;
    const recentAccuracies = [65, 70, 68, 72, 66];
    const recentResponseTimes = [15, 16, 14, 15, 17];

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 3;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty maintained at 3 for medium performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Low performance (< 50% accuracy) should decrease difficulty
   */
  static testLowPerformance(): TestResult {
    const testName = 'Low Performance (< 50% accuracy)';
    const currentDifficulty = 3;
    const recentAccuracies = [40, 35, 45, 38, 42];
    const recentResponseTimes = [15, 16, 14, 15, 17];

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 2;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty decreased from 3 to 2 for low performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Low performance with slow response should decrease difficulty
   */
  static testLowPerformanceWithSlowResponse(): TestResult {
    const testName = 'Low Performance + Slow Response';
    const currentDifficulty = 4;
    const recentAccuracies = [30, 35, 28, 32, 38];
    const recentResponseTimes = [25, 28, 24, 26, 27]; // Slow responses

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 3;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty decreased from 4 to 3 for struggling performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Minimum difficulty clamp (should not go below 1)
   */
  static testMinimumDifficultyClamp(): TestResult {
    const testName = 'Minimum Difficulty Clamp';
    const currentDifficulty = 1;
    const recentAccuracies = [20, 25, 18, 22, 28]; // Very low performance
    const recentResponseTimes = [30, 32, 28, 31, 29]; // Very slow

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 1; // Should stay at 1, not go to 0
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty clamped at minimum (1) despite very low performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Maximum difficulty clamp (should not go above 5)
   */
  static testMaximumDifficultyClamp(): TestResult {
    const testName = 'Maximum Difficulty Clamp';
    const currentDifficulty = 5;
    const recentAccuracies = [98, 95, 100, 97, 99]; // Perfect performance
    const recentResponseTimes = [5, 6, 5, 7, 6]; // Very fast

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 5; // Should stay at 5, not go to 6
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty clamped at maximum (5) despite perfect performance'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: No recent sessions should maintain current difficulty
   */
  static testNoSessions(): TestResult {
    const testName = 'No Recent Sessions';
    const currentDifficulty = 3;
    const recentAccuracies: number[] = [];
    const recentResponseTimes: number[] = [];

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 3;
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty maintained when no sessions available'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Test: Mixed performance (average around 65%) should maintain difficulty
   */
  static testMixedPerformance(): TestResult {
    const testName = 'Mixed Performance';
    const currentDifficulty = 2;
    const recentAccuracies = [50, 80, 60, 70, 65]; // Mixed results, avg ~65%
    const recentResponseTimes = [15, 14, 16, 15, 14];

    const result = AdaptiveDifficultyService.simulateScenario(
      currentDifficulty,
      recentAccuracies,
      recentResponseTimes
    );

    const expected = 2; // Should maintain since average is in medium range
    const passed = result.suggestedDifficulty === expected;

    return {
      name: testName,
      passed,
      expected,
      actual: result.suggestedDifficulty,
      message: passed
        ? '✓ Difficulty maintained for mixed performance (avg ~65%)'
        : `✗ Expected difficulty ${expected}, got ${result.suggestedDifficulty}`,
    };
  }

  /**
   * Print test results to console
   */
  static printResults(results: TestResult[]): void {
    console.log('\n========================================');
    console.log('Adaptive Difficulty Engine Test Results');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;

    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      console.log(`   ${result.message}`);
      console.log('');

      if (result.passed) {
        passed++;
      } else {
        failed++;
      }
    });

    console.log('========================================');
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('========================================\n');

    if (failed === 0) {
      console.log('✓ All tests passed!\n');
    } else {
      console.log(`✗ ${failed} test(s) failed\n`);
    }
  }
}
