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
    <header className="sticky top-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(showBack || onBack) && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-all active:scale-95 flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)] truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Connection status indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline 
              ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' 
              : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
          }`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Theme toggle */}
          {showThemeToggle && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-focus)] transition-all active:scale-90"
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={19} className="text-[#F59E0B]" /> : <Moon size={19} className="text-[#64748B]" />}
            </button>
          )}



          {/* Settings button */}
          {showSettings && (
            <button
              onClick={onSettingsPress}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-all active:scale-90"
              aria-label="Settings"
            >
              <Settings size={19} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
