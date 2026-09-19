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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] h-14 px-3 py-1 rounded-2xl transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-0.5 font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
