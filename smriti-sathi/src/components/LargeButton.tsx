import { ReactNode } from 'react';

interface LargeButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  size?: string;
}

export default function LargeButton({
  children,
  onPress,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled = false,
  className = '',
}: LargeButtonProps) {
  const base =
    'relative isolate overflow-hidden inline-flex items-center justify-center gap-3 ' +
    'min-h-[60px] px-7 py-3.5 rounded-full font-extrabold text-[17px] tracking-tight leading-none ' +
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ' +
    'focus:outline-none focus-visible:ring-4 disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const variants: Record<string, string> = {
    primary:
      'text-white shadow-[0_10px_28px_rgba(79,70,229,0.28),0_2px_8px_rgba(79,70,229,0.18)] ' +
      'bg-[linear-gradient(135deg,#4F46E5_0%,#7C3AED_55%,#6366F1_100%)] hover:brightness-[1.04] hover:-translate-y-[1px] hover:shadow-[0_14px_36px_rgba(79,70,229,0.34)] ' +
      'focus-visible:ring-indigo-500/25 border border-white/10',
    secondary:
      'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] shadow-[0_2px_10px_rgba(15,23,42,0.06)] ' +
      'hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-strong)] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] ' +
      'focus-visible:ring-indigo-500/20 dark:bg-white/[0.06] dark:border-white/10 dark:text-white dark:hover:bg-white/[0.09]',
    outline:
      'bg-transparent text-[var(--color-text)] border-[1.5px] border-[var(--color-border-strong)] ' +
      'hover:bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ' +
      'focus-visible:ring-indigo-500/20',
    success:
      'text-white shadow-[0_10px_24px_rgba(5,150,105,0.22)] ' +
      'bg-[linear-gradient(135deg,#059669_0%,#10B981_55%,#34D399_100%)] hover:brightness-[1.03] hover:-translate-y-[1px] ' +
      'focus-visible:ring-emerald-500/25 border border-white/10',
    warning:
      'text-white shadow-[0_10px_24px_rgba(217,119,6,0.20)] ' +
      'bg-[linear-gradient(135deg,#D97706_0%,#F59E0B_60%,#FBBF24_100%)] hover:brightness-[1.03] hover:-translate-y-[1px] ' +
      'focus-visible:ring-amber-500/25 border border-white/10',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`${fullWidth ? 'w-full' : ''} ${base} ${variants[variant]} ${className}`}
    >
      {/* subtle top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-[0.18]"
        style={{
          background: variant === 'primary' || variant === 'success' || variant === 'warning'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 58%)'
            : undefined,
        }}
      />
      {icon && <span className="relative flex-shrink-0 [&>svg]:drop-shadow-sm">{icon}</span>}
      <span className="relative">{children}</span>
    </button>
  );
}
