import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../models/Role';
import { User, Shield, Eye, EyeOff, Lock, HeartHandshake, Sun, Moon } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, quickLogin, demoUsers } = useAuth();
  const { state, toggleTheme } = useApp();
  const isDark = state.accessibility?.theme === 'dark';

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

  const handleDirectElderLogin = async () => {
    setIsLoading(true);
    setError('');

    const result = await quickLogin('patient_primary');

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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-center px-4 py-8 transition-colors duration-200">
      <div className="max-w-md mx-auto w-full space-y-5">
        {/* Top bar with theme toggle */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Smriti Sathi Health Platform
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#10B981] transition-all active:scale-90 shadow-sm"
            aria-label="Toggle Theme"
            title={isDark ? 'Light Theme' : 'Dark Theme'}
          >
            {isDark ? <Sun size={19} className="text-[#F59E0B]" /> : <Moon size={19} className="text-[#64748B]" />}
          </button>
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#0D3B12] text-white px-6 py-7 rounded-3xl text-center shadow-lg border border-[#1B5E20]">
          <div className="w-14 h-14 rounded-2xl bg-white/15 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <HeartHandshake size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Smriti Sathi</h1>
          <p className="text-sm opacity-90">Cognitive Care & Memory Companion</p>
        </div>

        {/* Profile Selection */}
        <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">Select Profile to Begin</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Select your role to explore the companion</p>
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
                  }}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#10B981] bg-[var(--color-bg-subtle)] shadow-sm'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-focus)] bg-[var(--color-card)]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isPatientRole 
                      ? 'bg-[#10B981]/15 text-[#10B981]' 
                      : 'bg-[#0EA5E9]/15 text-[#0EA5E9]'
                  }`}>
                    {isPatientRole ? <User size={24} /> : <Shield size={24} />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-bold text-[var(--color-text)]">{user.displayName}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      {isPatientRole ? 'Personalized cognitive exercises & routine' : 'Care circle monitoring & clinical logs'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#10B981] bg-[#10B981]' : 'border-[var(--color-border)]'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Elder Action */}
          {isElder && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDirectElderLogin}
                disabled={isLoading}
                className="w-full py-4 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Opening...' : 'Enter as Elder Patient →'}</span>
              </button>
            </div>
          )}

          {/* Caregiver PIN verification if a caregiver is selected */}
          {!isElder && selectedUserData && (
            <div className="pt-3 border-t border-[var(--color-border)] space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">
                  Caregiver Security PIN (Default: 1234)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setError(''); }}
                    placeholder="Enter 4-digit PIN"
                    maxLength={8}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[#10B981]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-xs font-semibold text-red-500">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading || !pin}
                className="w-full py-3.5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Verifying...' : 'Access Caregiver Dashboard →'}
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[var(--color-text-muted)] space-y-1">
          <p>Local-first storage with automatic cloud synchronization.</p>
        </div>
      </div>
    </div>
  );
}
