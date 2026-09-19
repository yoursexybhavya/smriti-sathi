/**
 * SMRITI SATHI — Login Screen
 * 
 * Demo authentication screen.
 * ⚠️ NOT production-grade security — prototype only.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../models/Role';
import { User, Shield, Eye, EyeOff, AlertTriangle, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onStartDemo?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onStartDemo }: LoginScreenProps) {
  const { login, quickLogin, demoUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedUser) {
      setError('Please select a user');
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

  const handleQuickLogin = async (userId: string) => {
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

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Header */}
      <div className="bg-[#1B5E20] text-white px-6 py-8 text-center">
        <h1 className="text-2xl font-bold mb-1">Smriti Sathi</h1>
        <p className="text-sm opacity-80">Memory Care Companion</p>
      </div>

      <div className="flex-1 px-5 py-6 space-y-6">
        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Prototype Authentication</h3>
              <p className="text-xs text-amber-700 mt-1">
                This is a demo login for testing. Not production-grade security.
                No HIPAA compliance or clinical-grade security is claimed.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Login (for testing) */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">Quick Login (Demo)</h3>
          <div className="space-y-2">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.id)}
                disabled={isLoading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${user.role === UserRole.PATIENT 
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                    : 'border-purple-200 bg-purple-50 hover:bg-purple-100'}
                  disabled:opacity-50`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${user.role === UserRole.PATIENT ? 'bg-blue-200' : 'bg-purple-200'}`}>
                  {user.role === UserRole.PATIENT 
                    ? <User size={18} className="text-blue-700" />
                    : <Shield size={18} className="text-purple-700" />
                  }
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm font-medium text-[#1A1A1A]">{user.displayName}</div>
                  <div className={`text-xs ${user.role === UserRole.PATIENT ? 'text-blue-600' : 'text-purple-600'}`}>
                    {user.role === UserRole.PATIENT ? 'Patient' : 'Caregiver'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PIN Login */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">PIN Login</h3>
          
          {/* User Selection */}
          <div className="mb-4">
            <label className="text-xs text-[#7A7A7A] mb-1 block">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => { setSelectedUser(e.target.value); setError(''); }}
              className="w-full px-3 py-3 rounded-xl border border-[#E0D8CC] text-sm bg-white"
            >
              <option value="">Choose a user...</option>
              {demoUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.displayName} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* PIN Input */}
          {selectedUserData && (
            <div className="mb-4">
              <label className="text-xs text-[#7A7A7A] mb-1 block">Enter PIN</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  placeholder="4-digit PIN"
                  maxLength={8}
                  className="w-full px-3 py-3 pr-10 rounded-xl border border-[#E0D8CC] text-sm"
                />
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-[#7A7A7A] mt-1">
                Demo PIN: {selectedUser.includes('patient_demo_001') ? '1234' :
                  selectedUser.includes('patient_demo_002') ? '5678' :
                  selectedUser.includes('caregiver_demo_001') ? '0000' : '9999'}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !selectedUser || !pin}
            className="w-full py-3 bg-[#1B5E20] text-white rounded-xl font-semibold text-base
              hover:bg-[#0D3B12] active:scale-[0.98] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        {/* SIH Demo Quick Start */}
        {onStartDemo && (
          <div className="bg-white rounded-2xl border-2 border-[#1B5E20] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <Sparkles size={20} className="text-[#1B5E20]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">SIH Demo Mode</h3>
                <p className="text-xs text-[#7A7A7A]">Quick setup with sample data</p>
              </div>
            </div>
            <button
              onClick={onStartDemo}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] text-white rounded-xl font-bold text-base
                hover:opacity-90 active:scale-[0.98] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Start Demo (Aai Devi)
            </button>
            <p className="text-xs text-[#7A7A7A] mt-2 text-center">
              Loads 7 days of data instantly
            </p>
          </div>
        )}

        {/* Info */}
        <div className="text-center text-xs text-[#7A7A7A] space-y-1">
          <p>Unique IDs ensure data separation between users.</p>
          <p>No personal data is transmitted in this prototype.</p>
        </div>
      </div>
    </div>
  );
}
