import { ReactNode } from 'react';
import { Volume2, Check, Clock3 } from 'lucide-react';

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
      const u = new SpeechSynthesisUtterance(`Reminder: ${title}. Scheduled for ${time}. ${description || ''}`);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete) onToggleComplete();
    else if (onPress) onPress();
  };

  return (
    <div
      onClick={onPress}
      className={`group relative w-full p-4 sm:p-5 rounded-[24px] border flex items-center justify-between gap-4 transition-all duration-200 overflow-hidden ${
        completed
          ? 'bg-[var(--color-card-subtle)] border-[var(--color-border)] opacity-75'
          : 'bg-[var(--color-card)] border-[var(--color-border)] shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:-translate-y-[1px] hover:shadow-[0_14px_30px_rgba(15,23,42,0.09)] hover:border-[var(--color-border-strong)]'
      } ${onPress ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      aria-label={`${title} at ${time}`}
    >
      {/* accent strip */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[24px] ${completed ? 'bg-emerald-400' : 'bg-[linear-gradient(180deg,#4F46E5,#7C3AED)] opacity-90 group-hover:opacity-100'}`}
        aria-hidden
      />
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pl-1">
        <div
          className={`h-[56px] w-[56px] min-w-[56px] rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm transition-colors ${
            completed
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] group-hover:border-indigo-200 group-hover:bg-indigo-50/70 dark:group-hover:bg-indigo-500/10'
          }`}
        >
          {completed ? <Check size={22} strokeWidth={3} /> : icon}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h4 className={`text-[15px] sm:text-[17px] font-extrabold tracking-tight leading-tight truncate ${completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}>
            {title}
          </h4>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--color-text-secondary)] mt-1">
            <Clock3 size={13} className="opacity-70" /> {time}
          </p>
          {description && <p className="text-[12px] font-medium text-[var(--color-text-muted)] truncate mt-1">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={speakReminder}
          className="h-[52px] w-[52px] rounded-full inline-flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-muted)] hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
          title="Listen to reminder"
          aria-label="Speak reminder aloud"
        >
          <Volume2 size={18} />
        </button>

        <button
          type="button"
          onClick={handleToggle}
          className={`h-[52px] w-[52px] rounded-full inline-flex items-center justify-center border shadow-sm transition-all active:scale-95 focus:outline-none focus-visible:ring-4 ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.28)] focus-visible:ring-emerald-500/20'
              : 'bg-[var(--color-card)] border-[var(--color-border-strong)] text-transparent hover:border-emerald-300 hover:text-emerald-500/60 hover:bg-emerald-50 focus-visible:ring-emerald-500/20'
          }`}
          title={completed ? 'Mark pending' : 'Mark done'}
          aria-label={completed ? 'Completed' : 'Mark as completed'}
        >
          <Check size={20} strokeWidth={completed ? 3 : 2.2} className={completed ? 'text-white' : 'text-current'} />
        </button>
      </div>
    </div>
  );
}
