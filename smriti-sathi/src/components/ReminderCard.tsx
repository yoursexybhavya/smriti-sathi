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
      className={`w-full p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between gap-4 transition-all duration-200 ${
        completed ? 'opacity-70 bg-[var(--color-bg-subtle)]' : 'hover:border-[var(--color-border-focus)] shadow-sm'
      } ${onPress ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      aria-label={`${title} at ${time}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center flex-shrink-0 shadow-sm">
          {icon}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h4 className={`text-base font-semibold text-[var(--color-text)] truncate ${completed ? 'line-through' : ''}`}>
            {title}
          </h4>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">{time}</p>
          {description && (
            <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Speak button */}
        <button
          type="button"
          onClick={speakReminder}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[#10B981] hover:bg-[var(--color-card-hover)] transition-colors border border-[var(--color-border-subtle)] active:scale-90"
          title="Listen to reminder"
          aria-label="Speak reminder aloud"
        >
          <Volume2 size={18} />
        </button>

        {/* Complete Checkbox button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
            completed
              ? 'bg-[#10B981] border-[#10B981] text-white shadow-sm'
              : 'border-[var(--color-border)] hover:border-[#10B981] text-transparent hover:text-[#10B981]/50 bg-[var(--color-bg-subtle)]'
          } active:scale-90`}
          title={completed ? 'Mark pending' : 'Mark done'}
          aria-label={completed ? 'Completed' : 'Mark as completed'}
        >
          <Check size={18} strokeWidth={completed ? 3 : 2} className={completed ? 'text-white' : 'text-current'} />
        </button>
      </div>
    </div>
  );
}
