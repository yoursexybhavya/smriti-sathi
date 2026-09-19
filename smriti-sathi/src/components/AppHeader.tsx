import { Settings, Wifi, WifiOff } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  isOnline?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showSettings = false,
  onSettingsPress,
  isOnline = true,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E0D8CC]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#1A1A1A]">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#7A7A7A] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Connection status indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-[#E8F5E9] text-[#2E7D32]' 
              : 'bg-[#EFEBE9] text-[#5D4037]'
          }`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {showSettings && (
            <button
              onClick={onSettingsPress}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0E8] text-[#4A4A4A] hover:bg-[#E0D8CC] transition-colors"
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
