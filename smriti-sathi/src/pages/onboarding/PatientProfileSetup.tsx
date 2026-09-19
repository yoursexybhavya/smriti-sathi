import { useState } from 'react';
import { User, Camera, ChevronLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import SectionHeader from '../../components/SectionHeader';
import { PatientProfile } from '../../context/AppContext';

interface PatientProfileSetupProps {
  onNext: (patient: PatientProfile) => void;
  onBack: () => void;
}

export default function PatientProfileSetup({ onNext, onBack }: PatientProfileSetupProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<string[]>([]);
  const [reminderPrefs, setReminderPrefs] = useState({
    medicine: true,
    hydration: true,
    activity: true,
    appointment: true,
  });

  const routineOptions = [
    { id: 'morning', label: 'Morning person', emoji: '🌅' },
    { id: 'afternoon', label: 'Active in afternoon', emoji: '☀️' },
    { id: 'evening', label: 'Evening routine', emoji: '🌙' },
  ];

  const toggleRoutine = (id: string) => {
    setSelectedRoutine(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleReminder = (key: keyof typeof reminderPrefs) => {
    setReminderPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const canProceed = name.trim().length > 0 && age.trim().length > 0;

  const handleNext = () => {
    const patient: PatientProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      age: parseInt(age) || 65,
      preferredLanguage: 'en',
      dailyRoutine: selectedRoutine,
      reminderPreferences: reminderPrefs,
    };
    onNext(patient);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="max-w-5xl mx-auto flex items-center gap-3 px-5 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Patient Profile</h1>
            <p className="text-sm text-[#7A7A7A]">Step 1 of 4: Personalized Elder Information</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Basic Info & Photo */}
          <div className="md:col-span-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center bg-white p-6 rounded-3xl border border-[#E0D8CC] shadow-xs">
              <div className="w-28 h-28 rounded-full bg-[#E8F5E9] flex items-center justify-center border-4 border-white shadow-md">
                <User size={52} className="text-[#1B5E20]" />
              </div>
              <button
                type="button"
                className="mt-3 flex items-center gap-2 text-base font-bold text-[#1B5E20] px-4 py-2 rounded-xl hover:bg-[#E8F5E9] transition-colors min-h-[48px]"
              >
                <Camera size={20} />
                <span>Add Photo / ফটো দিয়ক</span>
              </button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-base font-bold text-[#1A1A1A] block px-1">
                Patient's Name (বা নাম)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kamala Baa, Deka Koka, Mohan"
                className="w-full px-5 py-4 text-lg bg-white border-2 border-[#E0D8CC] rounded-2xl focus:border-[#1B5E20] focus:outline-none transition-colors shadow-xs"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-base font-bold text-[#1A1A1A] block px-1">
                Age (বয়স)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 72"
                className="w-full px-5 py-4 text-lg bg-white border-2 border-[#E0D8CC] rounded-2xl focus:border-[#1B5E20] focus:outline-none transition-colors shadow-xs"
              />
            </div>

            {/* Daily Routine */}
            <div className="space-y-3">
              <SectionHeader title="Daily Routine" />
              <div className="space-y-2">
                {routineOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleRoutine(option.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 min-h-[56px] ${
                      selectedRoutine.includes(option.id)
                        ? 'bg-[#E8F5E9] border-[#1B5E20] shadow-xs'
                        : 'bg-white border-[#E0D8CC] hover:border-[#C0B8A8]'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-base font-semibold text-[#1A1A1A]">{option.label}</span>
                    {selectedRoutine.includes(option.id) && (
                      <span className="ml-auto text-[#1B5E20] font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reminder Preferences & Next */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-3">
              <SectionHeader title="Reminders & Alerts" />
              <div className="bg-white rounded-3xl border border-[#E0D8CC] p-5 space-y-4 shadow-xs">
                <ReminderToggle
                  label="Medicine Reminders"
                  description="Sound & visual alerts for morning/evening doses"
                  enabled={reminderPrefs.medicine}
                  onToggle={() => toggleReminder('medicine')}
                />
                <ReminderToggle
                  label="Hydration Reminders"
                  description="Prompts to drink water throughout the day"
                  enabled={reminderPrefs.hydration}
                  onToggle={() => toggleReminder('hydration')}
                />
                <ReminderToggle
                  label="Cognitive Activity"
                  description="Daily reminder to play memory games"
                  enabled={reminderPrefs.activity}
                  onToggle={() => toggleReminder('activity')}
                />
                <ReminderToggle
                  label="Health Appointments"
                  description="ASHA worker visits & clinic appointments"
                  enabled={reminderPrefs.appointment}
                  onToggle={() => toggleReminder('appointment')}
                />
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <LargeButton onPress={handleNext} disabled={!canProceed}>
                Continue to Language →
              </LargeButton>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function ReminderToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 min-h-[48px]"
    >
      <div className="text-left">
        <span className="text-base font-medium text-[#1A1A1A]">{label}</span>
        <p className="text-sm text-[#7A7A7A]">{description}</p>
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-colors ${
        enabled ? 'bg-[#1B5E20]' : 'bg-[#C0B8A8]'
      }`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </div>
    </button>
  );
}
