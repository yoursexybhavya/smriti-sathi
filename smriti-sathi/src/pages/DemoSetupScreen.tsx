/**
 * SMRITI SATHI — Demo Setup Screen
 * 
 * Initial screen for SIH demonstration.
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
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#4CAF50] flex flex-col">
      {/* Header */}
      <div className="text-white text-center px-6 py-12">
        <h1 className="text-4xl font-bold mb-3">Smriti Sathi</h1>
        <p className="text-lg opacity-90">Memory Care Companion</p>
        <p className="text-sm opacity-75 mt-2">Smart India Hackathon 2026</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#F5F0E8] rounded-t-[40px] px-6 py-8 -mt-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Demo Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <Sparkles size={24} className="text-[#1B5E20]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">SIH Demo Mode</h2>
                <p className="text-sm text-[#7A7A7A]">Quick setup for demonstration</p>
              </div>
            </div>

            <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-[#4A4A4A] mb-2">Demo Patient</h3>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1B5E20]">
                    {DEMO_PATIENT.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#1A1A1A]">{DEMO_PATIENT.name}</div>
                  <div className="text-sm text-[#7A7A7A]">Age {DEMO_PATIENT.age} • Hindi</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#7A7A7A] space-y-1">
              <p>✓ 7 days of game history</p>
              <p>✓ 14 game sessions with improving performance</p>
              <p>✓ Reminder history with 80% completion</p>
              <p>✓ Progress charts and trends</p>
              <p>✓ Memory book with 3 items</p>
            </div>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <div className="font-semibold text-green-800">Demo Ready!</div>
                <div className="text-sm text-green-700">Loading application...</div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-red-600" />
              <div className="flex-1">
                <div className="font-semibold text-red-800">Setup Failed</div>
                <div className="text-sm text-red-700">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePatientDemo}
              disabled={isInitializing}
              className="w-full py-5 bg-[#1B5E20] text-white rounded-2xl font-bold text-lg
                hover:bg-[#0D3B12] active:scale-[0.98] transition-all
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
              className="w-full py-5 bg-[#7B1FA2] text-white rounded-2xl font-bold text-lg
                hover:bg-[#6A1B9A] active:scale-[0.98] transition-all
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
          <div className="text-center text-xs text-[#7A7A7A] space-y-1 pt-4">
            <p>This will initialize demo data and log you in automatically.</p>
            <p>You can reset demo data anytime from Settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
