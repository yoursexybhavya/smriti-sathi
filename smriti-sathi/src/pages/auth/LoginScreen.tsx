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
    <div className="min-h-screen w-full bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-12 transition-colors duration-200">
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto space-y-5 md:space-y-6">
        {/* Top bar with mode label, exit/reset, and theme toggle */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Smriti Sathi Health Platform
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-indigo-500 transition-all active:scale-90 shadow-sm cursor-pointer"
              aria-label="Toggle Theme"
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={20} className="text-[#F59E0B]" /> : <Moon size={20} className="text-[#64748B]" />}
            </button>
          </div>
        </div>

        {/* Header Hero - Scandinavian Deep Slate Canvas */}
        <div className="bg-slate-900 text-white px-6 sm:px-8 py-7 sm:py-8 rounded-3xl text-center shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <HeartHandshake size={32} className="text-indigo-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight text-white">Smriti Sathi</h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium">Cognitive Care & Memory Companion</p>
        </div>

        {/* Profile Selection */}
        <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] p-5 sm:p-7 md:p-8 shadow-sm space-y-4 md:space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--color-text)]">Select Profile to Begin</h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">Select your role to explore the companion</p>
            </div>
            {selectedUser !== 'patient_primary' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedUser('patient_primary');
                  setPin('');
                  setError('');
                }}
                className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
                aria-label="Back to Elder Profile"
              >
                ← Back to Elder
              </button>
            )}
          </div>

          <div className="space-y-3 sm:space-y-3.5">
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
                  className={`flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer min-h-[68px] sm:min-h-[76px] ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-focus)] bg-[var(--color-card)]'
                  }`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ${
                    user.id === 'patient_primary'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : user.id === 'caregiver_primary'
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {user.id === 'patient_primary' ? '👵' : user.id === 'caregiver_primary' ? '👨‍👦' : '🩺'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm sm:text-base md:text-lg font-bold text-[var(--color-text)]">{user.displayName}</div>
                    <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                      {user.id === 'patient_primary'
                        ? 'Simplified visual & voice interface, memory games & daily routines'
                        : user.id === 'caregiver_primary'
                        ? 'Family memory book, photo quizzes, care schedule & alerts (PIN: 1234)'
                        : 'Clinical SPI stability index, cognitive decline logs & telemetry (PIN: 0000)'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-[var(--color-border)]'
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
                className="w-full min-h-[56px] sm:min-h-[64px] py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40 cursor-pointer disabled:opacity-50"
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
                  Caregiver Security PIN (Default: {selectedUser === 'asha_worker' ? '0000' : '1234'})
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setError(''); }}
                    placeholder="Enter 4-digit PIN"
                    maxLength={8}
                    className="w-full px-4 py-3.5 pr-11 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text)] text-base font-mono tracking-widest focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Tactile Keypad for Caregiver PIN */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      if (pin.length < 8) {
                        setPin(p => p + digit.toString());
                        setError('');
                      }
                    }}
                    className="h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] hover:border-indigo-400 font-bold text-base text-[var(--color-text)] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setPin(''); setError(''); }}
                  className="h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] font-semibold text-xs text-[var(--color-text-muted)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pin.length < 8) {
                      setPin(p => p + '0');
                      setError('');
                    }
                  }}
                  className="h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] hover:border-indigo-400 font-bold text-base text-[var(--color-text)] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPin(p => p.slice(0, -1));
                    setError('');
                  }}
                  className="h-12 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] font-semibold text-sm text-[var(--color-text-muted)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  aria-label="Backspace"
                >
                  ⌫
                </button>
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
                className="w-full min-h-[56px] py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm sm:text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer flex items-center justify-center"
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
