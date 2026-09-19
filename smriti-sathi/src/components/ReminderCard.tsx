import { ReactNode } from 'react';

interface ReminderCardProps {
  icon: ReactNode;
  title: string;
  time: string;
  description?: string;
  completed?: boolean;
  onPress?: () => void;
}

export default function ReminderCard({
  icon,
  title,
  time,
  description,
  completed = false,
  onPress,
}: ReminderCardProps) {
  const content = (
    <div className={`flex items-start gap-4 ${completed ? 'opacity-60' : ''}`}>
      <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-[#1A1A1A]">{title}</h4>
        <p className="text-sm text-[#4A4A4A] mt-0.5">{time}</p>
        {description && (
          <p className="text-sm text-[#7A7A7A] mt-1">{description}</p>
        )}
      </div>
      {completed && (
        <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
      )}
    </div>
  );

  if (onPress) {
    return (
      <button
        onClick={onPress}
        className="w-full p-4 bg-white rounded-2xl border border-[#E0D8CC] text-left transition-all active:scale-[0.98]"
        aria-label={`${title} at ${time}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl border border-[#E0D8CC]">
      {content}
    </div>
  );
}
