import { Brain, Eye, Pill, Droplets, Activity, Calendar, TrendingUp, Settings, BookOpen } from 'lucide-react';
import LargeActionCard from '../components/LargeActionCard';
import ReminderCard from '../components/ReminderCard';
import ProgressCard from '../components/ProgressCard';
import SectionHeader from '../components/SectionHeader';
import StatusIndicator from '../components/StatusIndicator';
import { useApp } from '../context/AppContext';

interface PatientHomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function PatientHomeScreen({ onNavigate, isOnline = true }: PatientHomeScreenProps) {
  const { state } = useApp();
  const patient = state.currentPatient;

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              {greeting}
            </h1>
            <p className="text-base text-[#4A4A4A] mt-0.5">
              {patient?.name || 'Friend'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator
              type={isOnline ? 'online' : 'offline'}
              compact
            />
            <button
              onClick={() => onNavigate('settings')}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-[#4A4A4A]" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-6 pb-28 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {/* Today's Activities */}
        <div className="space-y-3">
          <SectionHeader
            title="Today's Activities"
            icon={<Brain size={20} className="text-[#1B5E20]" />}
          />
          <div className="space-y-3">
            <LargeActionCard
              icon={<Brain size={28} className="text-[#1B5E20]" />}
              title="Start Memory Activity"
              subtitle="Look at objects, then remember them"
              onPress={() => onNavigate('remember-game')}
              variant="primary"
            />
            <LargeActionCard
              icon={<Eye size={28} className="text-[#E65100]" />}
              title="Start Recognition Activity"
              subtitle="Find patterns and what is different"
              onPress={() => onNavigate('recognise-game')}
              variant="secondary"
            />
            <LargeActionCard
              icon={<BookOpen size={28} className="text-[#7B1FA2]" />}
              title="View Memory Book"
              subtitle="Look at your personal memories"
              onPress={() => onNavigate('memory-book-viewer')}
              variant="neutral"
            />
          </div>
        </div>

        {/* Today's Reminders */}
        <div className="space-y-3">
          <SectionHeader
            title="Today's Reminders"
            icon={<Calendar size={20} className="text-[#E65100]" />}
            action={{
              label: 'View All',
              onPress: () => onNavigate('reminders'),
            }}
          />
          <div className="space-y-2">
            {patient?.reminderPreferences.medicine && (
              <ReminderCard
                icon={<Pill size={22} className="text-[#1B5E20]" />}
                title="Morning Medicine"
                time="9:00 AM"
                description="Take with water"
                completed
              />
            )}
            {patient?.reminderPreferences.hydration && (
              <ReminderCard
                icon={<Droplets size={22} className="text-[#1565C0]" />}
                title="Drink Water"
                time="11:00 AM"
                description="Stay hydrated"
              />
            )}
            {patient?.reminderPreferences.activity && (
              <ReminderCard
                icon={<Activity size={22} className="text-[#2E7D32]" />}
                title="Afternoon Walk"
                time="2:00 PM"
                description="Light exercise"
              />
            )}
            {patient?.reminderPreferences.appointment && (
              <ReminderCard
                icon={<Calendar size={22} className="text-[#7B1FA2]" />}
                title="Doctor Appointment"
                time="4:30 PM"
                description="General checkup"
              />
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="space-y-3">
          <SectionHeader
            title="Your Progress"
            icon={<TrendingUp size={20} className="text-[#1565C0]" />}
            action={{
              label: 'View Details',
              onPress: () => onNavigate('progress'),
            }}
          />
          <div className="grid grid-cols-3 gap-3">
            <ProgressCard
              icon={<Brain size={20} />}
              label="Activities"
              value={3}
              subtitle="This week"
              color="#1B5E20"
            />
            <ProgressCard
              icon={<TrendingUp size={20} />}
              label="Streak"
              value={7}
              subtitle="Days"
              color="#E65100"
            />
            <ProgressCard
              icon={<Eye size={20} />}
              label="Accuracy"
              value="78%"
              subtitle="Average"
              color="#1565C0"
            />
          </div>
        </div>

        {/* Gentle Note */}
        <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#E0D8CC]">
          <p className="text-sm text-[#4A4A4A] leading-relaxed text-center">
            Take your time. There is no rush.
          </p>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
