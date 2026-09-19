import { Home, Puzzle, Bell, BarChart3, LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-card)] border-t border-[var(--color-border)] z-50 transition-colors duration-200 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={25} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
