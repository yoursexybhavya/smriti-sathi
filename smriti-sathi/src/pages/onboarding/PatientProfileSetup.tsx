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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Profile</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Step 1 of 4: Personalized Elder Information</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Step 1 / 4
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Basic Info & Photo */}
          <div className="md:col-span-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-28 h-28 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-md">
                <User size={52} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <button
                type="button"
                className="mt-3 flex items-center gap-2 text-base font-bold text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors min-h-[48px] cursor-pointer"
              >
                <Camera size={20} />
                <span>Add Photo / ফটো দিয়ক</span>
              </button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-800 dark:text-slate-200 block px-1">
                Patient's Name (বা নাম)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kamala Baa, Deka Koka, Mohan"
                className="w-full px-5 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 transition-colors shadow-xs"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-800 dark:text-slate-200 block px-1">
                Age (বয়স)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 72"
                className="w-full px-5 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 transition-colors shadow-xs"
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
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 min-h-[56px] cursor-pointer ${
                      selectedRoutine.includes(option.id)
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{option.label}</span>
                    {selectedRoutine.includes(option.id) && (
                      <span className="ml-auto text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
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
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-sm">
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
            <div className="pt-4 space-y-3">
              <LargeButton onPress={handleNext} disabled={!canProceed}>
                Continue to Language →
              </LargeButton>
              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                ← Back to Welcome
              </button>
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
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 min-h-[48px] cursor-pointer"
    >
      <div className="text-left pr-4">
        <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{label}</span>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 ${
        enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
      }`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </div>
    </button>
  );
}
