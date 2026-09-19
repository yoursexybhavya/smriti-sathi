/**
 * SMRITI SATHI — Login Screen
 * Clean, production authentication & role selector.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../models/Role';
import { User, Shield, Eye, EyeOff, Lock, HeartHandshake } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, quickLogin, demoUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>('patient_primary');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedUser) {
      setError('Please select a profile');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(selectedUser, pin);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleDirectElderLogin = async (userId: string) => {
    setIsLoading(true);
    setError('');

    const result = await quickLogin(userId);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const selectedUserData = demoUsers.find(u => u.id === selectedUser);
  const isElder = selectedUserData?.role === UserRole.PATIENT;

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full px-5 py-8 space-y-6">
        {/* Header */}
        <div className="bg-[#1B5E20] text-white px-6 py-8 rounded-3xl text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-white/15 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <HeartHandshake size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Smriti Sathi</h1>
          <p className="text-sm opacity-90">Cognitive Care & Memory Companion</p>
        </div>

        {/* Profile Selection */}
        <div className="bg-white rounded-3xl border border-[#E0D8CC] p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">Select Your Profile</h2>
            <p className="text-xs text-[#7A7A7A] mt-0.5">Choose who is using Smriti Sathi right now</p>
          </div>

          <div className="space-y-3">
            {demoUsers.map(user => {
              const isSelected = selectedUser === user.id;
              const isPatientRole = user.role === UserRole.PATIENT;

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user.id);
                    setError('');
                    if (isPatientRole) {
                      handleDirectElderLogin(user.id);
                    }
                  }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1B5E20] bg-[#E8F5E9]/50 shadow-sm'
                      : 'border-[#E0D8CC] hover:border-[#B2DFDB] bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isPatientRole ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#E3F2FD] text-[#1565C0]'
                  }`}>
                    {isPatientRole ? <User size={24} /> : <Shield size={24} />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-[#1A1A1A]">{user.displayName}</div>
                    <div className="text-xs text-[#5C5C5C] mt-0.5">
                      {isPatientRole ? 'Tap to start directly (Elder-friendly)' : 'Caregiver Dashboard & Care Circle'}
                    </div>
                  </div>
                  {isPatientRole ? (
                    <span className="text-xs font-bold text-[#1B5E20] bg-white px-2.5 py-1 rounded-full border border-[#1B5E20]/20">
                      Open →
                    </span>
                  ) : (
                    <Lock size={16} className="text-[#7A7A7A]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Caregiver PIN verification if a caregiver is selected */}
          {!isElder && selectedUserData && (
            <div className="pt-3 border-t border-[#E0D8CC] space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#4A4A4A] block mb-1">
                  Caregiver Security PIN (Default: 1234)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setError(''); }}
                    placeholder="Enter 4-digit PIN"
                    maxLength={8}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E0D8CC] text-sm focus:outline-none focus:border-[#1B5E20]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#1A1A1A]"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs font-semibold text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading || !pin}
                className="w-full py-3.5 bg-[#1B5E20] text-white rounded-xl font-bold text-sm
                  hover:bg-[#0D3B12] active:scale-[0.98] transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Verifying...' : 'Access Caregiver Dashboard'}
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#7A7A7A] space-y-1">
          <p>Smriti Sathi stores your data securely on this device and syncs with cloud.</p>
        </div>
      </div>
    </div>
  );
}
