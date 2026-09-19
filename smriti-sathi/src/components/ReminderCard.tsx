import { ReactNode } from 'react';
import { Volume2, Check } from 'lucide-react';

interface ReminderCardProps {
  icon: ReactNode;
  title: string;
  time: string;
  description?: string;
  completed?: boolean;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export default function ReminderCard({
  icon,
  title,
  time,
  description,
  completed = false,
  onPress,
  onToggleComplete,
}: ReminderCardProps) {
  const speakReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `Reminder: ${title}. Scheduled for ${time}. ${description || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <div
      onClick={onPress}
      className={`w-full p-4 sm:p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 transition-all duration-200 ${
        completed ? 'opacity-65 bg-slate-50 dark:bg-slate-900/50' : 'hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      } ${onPress ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      aria-label={`${title} at ${time}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300 shadow-sm">
          {icon}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h4 className={`text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate ${completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {title}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">{time}</p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Speak button (>=56px touch target) */}
        <button
          type="button"
          onClick={speakReminder}
          className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          title="Listen to reminder"
          aria-label="Speak reminder aloud"
        >
          <Volume2 size={22} />
        </button>

        {/* Complete Checkbox button (>=56px touch target) */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl flex items-center justify-center transition-all border ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-transparent hover:text-emerald-500/50 bg-slate-100 dark:bg-slate-800'
          } active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30`}
          title={completed ? 'Mark pending' : 'Mark done'}
          aria-label={completed ? 'Completed' : 'Mark as completed'}
        >
          <Check size={24} strokeWidth={completed ? 3 : 2} className={completed ? 'text-white' : 'text-current'} />
        </button>
      </div>
    </div>
  );
}
