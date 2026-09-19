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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0D8CC] z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#1B5E20]'
                  : 'text-[#7A7A7A] hover:text-[#4A4A4A]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-[#1B5E20]' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
