import { Home, Puzzle, Bell, BarChart3, LayoutDashboard, BookOpen, Settings } from 'lucide-react';
import { UserRole } from '../models/Role';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role?: UserRole | null;
}

const patientTabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'games', label: 'Games', Icon: Puzzle },
  { id: 'reminders', label: 'Reminders', Icon: Bell },
  { id: 'progress', label: 'Progress', Icon: BarChart3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const caregiverTabs = [
  { id: 'caregiver-home', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'caregiver-reminders', label: 'Reminders', Icon: Bell },
  { id: 'caregiver-memory', label: 'Memory', Icon: BookOpen },
  { id: 'caregiver-settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange, role }: BottomNavProps) {
  const tabs = role === UserRole.CAREGIVER ? caregiverTabs : patientTabs;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-card)_92%,transparent)] backdrop-blur-xl shadow-[0_12px_32px_rgba(15,23,42,0.16),0_4px_12px_rgba(15,23,42,0.10)] max-w-[min(640px,100%)] w-[min(640px,100%)] justify-between overflow-x-auto scrollbar-none">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex-1 min-w-[56px] min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-full px-2.5 py-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                isActive
                  ? 'bg-[linear-gradient(135deg,#4F46E5_0%,#7C3AED_100%)] text-white shadow-[0_8px_20px_rgba(79,70,229,0.28)] scale-[1.02]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] active:scale-[0.97]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.6 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className={`text-[10px] sm:text-[11px] leading-none tracking-wide whitespace-nowrap ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                {label}
              </span>
              {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-white/80" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
