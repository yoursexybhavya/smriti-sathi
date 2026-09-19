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
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Adaptive Engine Tests</h1>
            <p className="text-sm text-[#7A7A7A]">Verify difficulty adjustment logic</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-10">
        {/* Info */}
        <div className="p-4 bg-[#E3F2FD] rounded-2xl border border-[#BBDEFB]">
          <p className="text-sm text-[#1565C0] leading-relaxed">
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
                ? 'bg-[#E8F5E9] border-[#2E7D32]' 
                : 'bg-[#FFEBEE] border-[#C62828]'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {allPassed ? (
                  <CheckCircle size={32} className="text-[#2E7D32]" />
                ) : (
                  <XCircle size={32} className="text-[#C62828]" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    allPassed ? 'text-[#2E7D32]' : 'text-[#C62828]'
                  }`}>
                    {allPassed ? 'All Tests Passed' : 'Some Tests Failed'}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]">
                    {passedCount} passed, {failedCount} failed
                  </p>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${
                      result.passed
                        ? 'bg-white border-[#E0D8CC]'
                        : 'bg-[#FFEBEE] border-[#C62828]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.passed ? (
                        <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle size={20} className="text-[#C62828] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-[#1A1A1A]">
                          {result.name}
                        </h4>
                        <p className="text-sm text-[#4A4A4A] mt-1">
                          {result.message}
                        </p>
                        {!result.passed && (
                          <div className="mt-2 text-xs text-[#7A7A7A]">
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
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            These tests verify the deterministic difficulty adjustment logic. 
            The adaptive engine uses recent performance data (last 5 sessions) to suggest difficulty changes.
            Results are also logged to the browser console.
          </p>
        </div>
      </div>
    </div>
  );
}
