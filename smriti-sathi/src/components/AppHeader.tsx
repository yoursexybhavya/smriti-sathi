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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(showBack || onBack) && (
            <button
              onClick={onBack}
              className="min-h-[56px] min-w-[56px] px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              aria-label="Go back"
            >
              <ArrowLeft size={22} className="stroke-[2.5]" />
              <span className="text-base font-semibold hidden sm:inline">Back</span>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 truncate tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Connection status indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isOnline 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Theme toggle (>=56px touch target) */}
          {showThemeToggle && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-14 h-14 min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDark ? 'Light Theme' : 'Dark Theme'}
            >
              {isDark ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-600" />}
            </button>
          )}

          {/* Settings button (>=56px touch target) */}
          {showSettings && (
            <button
              onClick={onSettingsPress}
              className="w-14 h-14 min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              aria-label="Settings"
            >
              <Settings size={22} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
