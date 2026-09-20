import { Settings, Wifi, WifiOff, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  showThemeToggle?: boolean;
  isOnline?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  showSettings = false,
  onSettingsPress,
  showThemeToggle = true,
  isOnline = true,
}: AppHeaderProps) {
  const { state, toggleTheme } = useApp();
  const isDark = state.accessibility?.theme === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-card)_86%,transparent)] backdrop-blur-[16px] supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--color-card)_78%,transparent)]">
      {/* subtle top accent line */}
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,#4F46E5_0%,#7C3AED_35%,#06B6D4_70%,#10B981_100%)] opacity-90" />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(showBack || onBack) && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 min-h-[52px] min-w-[52px] px-4 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-[0_2px_10px_rgba(15,23,42,0.06)] text-[var(--color-text)] hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-strong)] hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={19} strokeWidth={2.6} />
              <span className="hidden sm:inline text-[14px] font-bold tracking-tight">Back</span>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-[700] tracking-[-0.02em] leading-none text-[18px] sm:text-[20px] text-[var(--color-text)] flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] text-white text-[12px] font-black shadow-[0_6px_16px_rgba(79,70,229,0.28)]">
                স্মৃ
              </span>
              <span className="truncate" style={{ fontFamily: 'var(--font-display)' }}>{title}</span>
            </h1>
            {subtitle && (
              <p className="text-[12px] sm:text-[13px] font-semibold tracking-wide text-[var(--color-text-muted)] mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Online pill - desktop */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide border shadow-sm ${
              isOnline
                ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success-border)]'
                : 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning-border)]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.18)]' : 'bg-amber-500'}`} />
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? 'Online' : 'Offline'}
          </div>

          {/* Mobile online dot */}
          <span className={`sm:hidden h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.18)]' : 'bg-amber-500'}`} aria-hidden />

          {showThemeToggle && (
            <button
              type="button"
              onClick={toggleTheme}
              className="h-[52px] w-[52px] inline-flex items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-[0_2px_10px_rgba(15,23,42,0.06)] text-[var(--color-text-secondary)] hover:bg-[var(--color-card-hover)] hover:-translate-y-[1px] active:scale-[0.96] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
            </button>
          )}

          {showSettings && (
            <button
              onClick={onSettingsPress}
              className="h-[52px] w-[52px] inline-flex items-center justify-center rounded-full bg-[var(--color-text)] text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] hover:brightness-[1.05] hover:-translate-y-[1px] active:scale-[0.96] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
