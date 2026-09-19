import { useState } from 'react';
import { CheckCircle, XCircle, Play, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { AdaptiveEngineTests, TestResult } from '../../services/adaptive_engine/AdaptiveEngineTests';

interface AdaptiveEngineTestScreenProps {
  onBack: () => void;
}

export default function AdaptiveEngineTestScreen({ onBack }: AdaptiveEngineTestScreenProps) {
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const runTests = () => {
    const results = AdaptiveEngineTests.runAllTests();
    setTestResults(results);
    setHasRun(true);
    
    // Also log to console
    AdaptiveEngineTests.printResults(results);
  };

  const passedCount = testResults?.filter(r => r.passed).length || 0;
  const failedCount = testResults?.filter(r => !r.passed).length || 0;
  const allPassed = failedCount === 0 && hasRun;

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Adaptive Engine Tests</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Verify difficulty adjustment logic</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-10">
        {/* Info */}
        <div className="p-4 bg-[var(--color-accent-blue)/15] rounded-2xl border border-[var(--color-accent-blue)]/30">
          <p className="text-sm text-[var(--color-accent-blue)] leading-relaxed">
            These tests verify the adaptive difficulty engine works correctly for different performance scenarios. 
            All tests run offline using deterministic logic.
          </p>
        </div>

        {/* Run Tests Button */}
        {!hasRun && (
          <LargeButton onPress={runTests} icon={<Play size={20} />}>
            Run All Tests
          </LargeButton>
        )}

        {/* Results */}
        {hasRun && testResults && (
          <>
            {/* Summary */}
            <div className={`p-5 rounded-2xl border-2 ${
              allPassed 
                ? 'bg-[var(--color-success-bg)] border-[var(--color-success)]' 
                : 'bg-[var(--color-error-bg)] border-[var(--color-error)]'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {allPassed ? (
                  <CheckCircle size={32} className="text-[var(--color-success)]" />
                ) : (
                  <XCircle size={32} className="text-[var(--color-error)]" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    allPassed ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                  }`}>
                    {allPassed ? 'All Tests Passed' : 'Some Tests Failed'}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {passedCount} passed, {failedCount} failed
                  </p>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${
                      result.passed
                        ? 'bg-[var(--color-card)] border-[var(--color-border)]'
                        : 'bg-[var(--color-error-bg)] border-[var(--color-error)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.passed ? (
                        <CheckCircle size={20} className="text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle size={20} className="text-[var(--color-error)] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-[var(--color-text)]">
                          {result.name}
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          {result.message}
                        </p>
                        {!result.passed && (
                          <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                            Expected: {result.expected} | Actual: {result.actual}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Again Button */}
            <LargeButton onPress={runTests} variant="outline" icon={<Play size={20} />}>
              Run Tests Again
            </LargeButton>
          </>
        )}

        {/* Note */}
        <div className="p-4 bg-[var(--color-card-subtle)] rounded-2xl border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            These tests verify the deterministic difficulty adjustment logic. 
            The adaptive engine uses recent performance data (last 5 sessions) to suggest difficulty changes.
            Results are also logged to the browser console.
          </p>
        </div>
      </div>
    </div>
  );
}
