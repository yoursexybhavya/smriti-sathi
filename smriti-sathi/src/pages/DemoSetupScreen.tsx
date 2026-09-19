/**
 * SMRITI SATHI — Demo Setup Screen
 * 
 * Screen for testing and device validation.
 * Allows quick setup of demo data for "Aai Devi"
 */

import { useState } from 'react';
import { DemoDataService, DEMO_PATIENT } from '../services/DemoDataService';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/Role';
import { User, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface DemoSetupScreenProps {
  onComplete: () => void;
}

export default function DemoSetupScreen({ onComplete }: DemoSetupScreenProps) {
  const { quickLogin } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePatientDemo = async () => {
    setIsInitializing(true);
    setStatus('idle');
    
    try {
      // Initialize demo data
      await DemoDataService.initializeDemoData();
      
      // Login as patient
      const result = await quickLogin('patient_demo_001');
      
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('[DemoSetup] Error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize demo');
      setIsInitializing(false);
    }
  };

  const handleCaregiverDemo = async () => {
    setIsInitializing(true);
    setStatus('idle');
    
    try {
      // Initialize demo data (caregiver will see patient data)
      await DemoDataService.initializeDemoData();
      
      // Login as caregiver
      const result = await quickLogin('caregiver_demo_001');
      
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('[DemoSetup] Error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize demo');
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-success)] via-[var(--color-success)]/90 to-[var(--color-success)]/70 flex flex-col">
      {/* Header */}
      <div className="text-white text-center px-6 py-12">
        <h1 className="text-4xl font-bold mb-3">Smriti Sathi</h1>
        <p className="text-lg opacity-90">Cognitive Care Companion</p>
        <p className="text-sm opacity-75 mt-2">Production Setup & Testing</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[var(--color-bg-subtle)] rounded-t-[40px] px-6 py-8 -mt-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Demo Info */}
          <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
                <Sparkles size={24} className="text-[var(--color-success)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">Sample Clinical Setup</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Quick setup for device validation</p>
              </div>
            </div>

            <div className="bg-[var(--color-bg-subtle)] rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Demo Patient</h3>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--color-success)]">
                    {DEMO_PATIENT.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--color-text)]">{DEMO_PATIENT.name}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">Age {DEMO_PATIENT.age} • Hindi</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <p>✓ 7 days of game history</p>
              <p>✓ 14 game sessions with improving performance</p>
              <p>✓ Reminder history with 80% completion</p>
              <p>✓ Progress charts and trends</p>
              <p>✓ Memory book with 3 items</p>
            </div>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="bg-[var(--color-success-bg)] border border-[var(--color-success)]/30 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle size={24} className="text-[var(--color-success)]" />
              <div>
                <div className="font-semibold text-[var(--color-success)]">Demo Ready!</div>
                <div className="text-sm text-[var(--color-success)]/80">Loading application...</div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-[var(--color-error)]" />
              <div className="flex-1">
                <div className="font-semibold text-[var(--color-error)]">Setup Failed</div>
                <div className="text-sm text-[var(--color-error)]/80">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePatientDemo}
              disabled={isInitializing}
              className="w-full py-5 bg-[var(--color-success)] text-white rounded-2xl font-bold text-lg
                hover:bg-[var(--color-success)]/90 active:scale-[0.98] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 shadow-lg"
            >
              {isInitializing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <User size={24} />
                  Start as Patient
                </>
              )}
            </button>

            <button
              onClick={handleCaregiverDemo}
              disabled={isInitializing}
              className="w-full py-5 bg-[var(--color-accent-purple)] text-white rounded-2xl font-bold text-lg
                hover:bg-[var(--color-accent-purple)]/90 active:scale-[0.98] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 shadow-lg"
            >
              {isInitializing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Shield size={24} />
                  Start as Caregiver
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="text-center text-xs text-[var(--color-text-muted)] space-y-1 pt-4">
            <p>This will initialize demo data and log you in automatically.</p>
            <p>You can reset demo data anytime from Settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
