import { useState } from 'react';
import { User, Check, Sparkles, ChevronLeft, ArrowRight } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { PatientProfile } from '../../context/AppContext';

interface PatientProfileSetupProps {
  onNext: (patient: PatientProfile) => void;
  onBack: () => void;
}

export default function PatientProfileSetup({ onNext, onBack }: PatientProfileSetupProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👵');
  const [selectedRoutine, setSelectedRoutine] = useState<string[]>(['morning', 'afternoon']);
  const [reminderPrefs, setReminderPrefs] = useState({
    medicine: true,
    hydration: true,
    activity: true,
    appointment: true,
  });

  const avatarOptions = [
    { emoji: '👵', label: 'Kamala Baa (কমলা বা)', defaultAge: '72' },
    { emoji: '👴', label: 'Deka Koka (ডেকা ককা)', defaultAge: '76' },
    { emoji: '🌸', label: 'Aai (আই)', defaultAge: '68' },
    { emoji: '🌿', label: 'Bapu (বাপু)', defaultAge: '70' },
  ];

  const routineOptions = [
    { id: 'morning', label: 'Early Morning Routine', sublabel: 'ৰাতিপুৱা সোনকালে উঠে', emoji: '🌅' },
    { id: 'afternoon', label: 'Active Afternoon', sublabel: 'দুপৰীয়া সক্ৰিয় থাকে', emoji: '☀️' },
    { id: 'evening', label: 'Calm Evening', sublabel: 'গধূলি আৰাম কৰে', emoji: '🌙' },
  ];

  const toggleRoutine = (id: string) => {
    setSelectedRoutine(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleReminder = (key: keyof typeof reminderPrefs) => {
    setReminderPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectPreset = (opt: typeof avatarOptions[0]) => {
    setSelectedAvatar(opt.emoji);
    setName(opt.label.split(' (')[0]);
    setAge(opt.defaultAge);
  };

  const canProceed = name.trim().length > 0 && age.trim().length > 0;

  const handleNext = () => {
    const patient: PatientProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      age: parseInt(age, 10) || 70,
      preferredLanguage: 'as',
      dailyRoutine: selectedRoutine,
      reminderPreferences: reminderPrefs,
    };
    onNext(patient);
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between flex-1">
      <div>
        {/* Step Heading */}
        <div className="mb-6 pb-4 border-b-2 border-[var(--color-border)] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Step 1 of 4
              </span>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Personal Elder Setup
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight mt-1">
              Personal Information / ব্যক্তি পৰিচয়
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Personalize reminders, daily routines, and greeting voice prompts.
            </p>
          </div>
        </div>

        {/* Quick-fill Elder Suggestions */}
        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            <span>Quick Select Elder Profile / দ্ৰুত বাছনি:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {avatarOptions.map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={() => selectPreset(opt)}
                className={`p-3 min-h-[56px] rounded-xl border-2 text-left flex items-center gap-2 text-sm font-bold transition-all cursor-pointer ${
                  name === opt.label.split(' (')[0]
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-400 text-indigo-950 dark:text-indigo-100 shadow-xs'
                    : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] hover:border-indigo-400'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="truncate">{opt.label.split(' (')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Name & Age */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="text-sm sm:text-base font-bold text-[var(--color-text)] block mb-1.5">
                Elder's Full Name / বয়সীয়ালজনৰ নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kamala Baa (কমলা বা)"
                className="w-full px-4 py-3.5 text-base sm:text-lg bg-[var(--color-card)] border-2 border-[var(--color-border)] focus:border-indigo-600 dark:focus:border-indigo-400 rounded-2xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-xs transition-all"
              />
            </div>

            <div>
              <label className="text-sm sm:text-base font-bold text-[var(--color-text)] block mb-1.5">
                Age / বয়স <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 72"
                className="w-full px-4 py-3.5 text-base sm:text-lg bg-[var(--color-card)] border-2 border-[var(--color-border)] focus:border-indigo-600 dark:focus:border-indigo-400 rounded-2xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-xs transition-all"
              />
            </div>

            {/* Daily Routine Pills */}
            <div className="pt-2">
              <label className="text-sm sm:text-base font-bold text-[var(--color-text)] block mb-2">
                Daily Routine Focus / দৈনিক নিয়ম
              </label>
              <div className="space-y-2">
                {routineOptions.map(option => {
                  const isChecked = selectedRoutine.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleRoutine(option.id)}
                      className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] hover:border-emerald-400'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{option.label}</div>
                        <div className="text-xs text-[var(--color-text-secondary)] font-serif truncate">{option.sublabel}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[var(--color-border)]'
                      }`}>
                        {isChecked && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Reminder Preferences */}
          <div className="md:col-span-6 space-y-3">
            <label className="text-sm sm:text-base font-bold text-[var(--color-text)] block mb-1">
              Active Care Reminders / সোঁৱৰণী সক্ৰিয় কৰক
            </label>
            <div className="bg-[var(--color-bg-subtle)] rounded-2xl border-2 border-[var(--color-border)] p-4 space-y-3">
              <ReminderRow
                title="Medicine Reminders"
                subtitle="ঔষধৰ নিয়মীয়া সময়"
                description="Audible chime & visual alert for morning/evening doses"
                enabled={reminderPrefs.medicine}
                onToggle={() => toggleReminder('medicine')}
              />
              <ReminderRow
                title="Hydration Reminders"
                subtitle="পানী খোৱাৰ সোঁৱৰণী"
                description="Periodic gentle prompts to drink fresh water"
                enabled={reminderPrefs.hydration}
                onToggle={() => toggleReminder('hydration')}
              />
              <ReminderRow
                title="Cognitive Activities"
                subtitle="স্মৃতি ব্যায়াম আৰু খেল"
                description="Daily alert to play gentle memory stimulation games"
                enabled={reminderPrefs.activity}
                onToggle={() => toggleReminder('activity')}
              />
              <ReminderRow
                title="Health & Clinic Visits"
                subtitle="চিকিৎসক আৰু আশা কৰ্মীৰ সাক্ষাৎ"
                description="ASHA worker visits and clinic appointment schedule"
                enabled={reminderPrefs.appointment}
                onToggle={() => toggleReminder('appointment')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center gap-3.5">
        <div className="w-full sm:flex-1 sm:max-w-xl">
          <LargeButton onPress={handleNext} disabled={!canProceed} size="lg" variant="primary">
            <span>Continue to Language / পৰৱৰ্তী: ভাষা</span>
          </LargeButton>
        </div>
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto min-w-[220px] whitespace-nowrap min-h-[58px] sm:min-h-[64px] px-6 py-3 rounded-2xl sm:rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] text-base font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Back to Welcome</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ReminderRow({
  title,
  subtitle,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  subtitle: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full min-h-[56px] flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-card)] transition-colors cursor-pointer text-left"
    >
      <div className="pr-3 flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-[var(--color-text)]">{title}</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-serif">{subtitle}</span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>
      </div>

      {/* High-Contrast Accessible Toggle Switch */}
      <div
        className={`w-14 h-8 rounded-full p-1 transition-colors flex-shrink-0 flex items-center ${
          enabled
            ? 'bg-emerald-600 justify-end'
            : 'bg-slate-300 dark:bg-slate-700 justify-start'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
          {enabled ? <Check size={13} className="text-emerald-600 stroke-[3]" /> : null}
        </div>
      </div>
    </button>
  );
}
