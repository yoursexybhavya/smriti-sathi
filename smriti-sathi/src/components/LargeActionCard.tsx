import { ReactNode } from 'react';

interface LargeActionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export default function LargeActionCard({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'neutral',
}: LargeActionCardProps) {
  const variantClasses = {
    primary: 'bg-[var(--color-card)] border-[#10B981]/40 hover:border-[#10B981] shadow-sm',
    secondary: 'bg-[var(--color-card)] border-[#F59E0B]/40 hover:border-[#F59E0B] shadow-sm',
    neutral: 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-[var(--color-border-focus)] shadow-sm',
  };

  return (
    <button
      onClick={onPress}
      className={`w-full p-5 rounded-2xl border-2 transition-all active:scale-[0.98] flex items-center gap-4 ${variantClasses[variant]}`}
      aria-label={title}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-subtle)] flex items-center justify-center flex-shrink-0 shadow-sm border border-[var(--color-border-subtle)]">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>
    </button>
  );
}
