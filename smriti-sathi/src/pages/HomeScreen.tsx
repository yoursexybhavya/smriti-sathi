import { Brain, Clock, TrendingUp, Heart, ChevronRight, Sun } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function HomeScreen({ onNavigate, isOnline = true }: HomeScreenProps) {
  const greeting = getGreeting();

  return (
    <>
      <AppHeader
        title="Smriti Sathi"
        subtitle="Your memory companion"
        showSettings
        onSettingsPress={() => onNavigate('settings')}
        isOnline={isOnline}
      />
      <div className="px-5 py-6 pb-28 space-y-6">
        {/* Greeting Card */}
        <Card elevated className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <Sun size={28} className="text-[#1B5E20]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">{greeting}</h2>
              <p className="text-base text-[#4A4A4A] mt-1">
                Let's do something nice for your mind today.
              </p>
              <p className="text-sm text-[#7A7A7A] mt-2">
                You've played 3 games this week. Keep it up!
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Quick Actions</h3>
          
          <Card onPress={() => onNavigate('games')} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] flex items-center justify-center flex-shrink-0">
                <Brain size={24} className="text-[#1565C0]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Play a Game</h4>
                <p className="text-sm text-[#7A7A7A]">Memory & pattern exercises</p>
              </div>
              <ChevronRight size={20} className="text-[#7A7A7A]" />
            </div>
          </Card>

          <Card onPress={() => onNavigate('reminders')} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-[#E65100]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Reminders</h4>
                <p className="text-sm text-[#7A7A7A]">Medicine, appointments & more</p>
              </div>
              <ChevronRight size={20} className="text-[#7A7A7A]" />
            </div>
          </Card>

          <Card onPress={() => onNavigate('progress')} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={24} className="text-[#2E7D32]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">My Progress</h4>
                <p className="text-sm text-[#7A7A7A]">See how you're doing</p>
              </div>
              <ChevronRight size={20} className="text-[#7A7A7A]" />
            </div>
          </Card>
        </div>

        {/* Wellbeing Note */}
        <Card className="p-5 bg-[#FDF8F0] border-[#E0D8CC]">
          <div className="flex items-start gap-3">
            <Heart size={22} className="text-[#E65100] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-base font-semibold text-[#1A1A1A]">A Gentle Reminder</h4>
              <p className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                These activities are for cognitive engagement and enjoyment. 
                They are not medical diagnostics. Always consult your doctor for health concerns.
              </p>
            </div>
          </div>
        </Card>

        {/* Today's Schedule Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Today's Schedule</h3>
          <Card className="p-4">
            <div className="space-y-3">
              <ScheduleItem time="9:00 AM" label="Morning Medicine" done />
              <ScheduleItem time="11:00 AM" label="Memory Game Session" />
              <ScheduleItem time="2:00 PM" label="Afternoon Walk" />
              <ScheduleItem time="5:00 PM" label="Evening Tea & Relax" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ScheduleItem({ time, label, done = false }: { time: string; label: string; done?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${done ? 'opacity-60' : ''}`}>
      <div className={`w-3 h-3 rounded-full border-2 ${
        done ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-[#C0B8A8]'
      }`} />
      <span className="text-sm font-medium text-[#4A4A4A] min-w-[70px]">{time}</span>
      <span className={`text-sm ${done ? 'line-through text-[#7A7A7A]' : 'text-[#1A1A1A]'}`}>
        {label}
      </span>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning 🌅';
  if (hour < 17) return 'Good Afternoon ☀️';
  return 'Good Evening 🌙';
}
