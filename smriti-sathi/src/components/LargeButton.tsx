import { ReactNode } from 'react';

interface LargeButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'md' | 'lg';
}

export default function LargeButton({
  children,
  onPress,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled = false,
  className = '',
  size = 'lg',
}: LargeButtonProps) {
  const variantClasses = {
    primary:
      'bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 active:bg-indigo-800 text-white border-2 border-indigo-500/80 dark:border-indigo-400/80 shadow-[0_4px_12px_rgba(79,70,229,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-indigo-500/40',
    secondary:
      'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:bg-slate-100 dark:active:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 shadow-[0_3px_8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] focus-visible:ring-slate-400/40',
    outline:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 focus-visible:ring-indigo-500/40',
    success:
      'bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 active:bg-emerald-800 text-white border-2 border-emerald-500/80 dark:border-emerald-400/80 shadow-[0_4px_12px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-emerald-500/40',
    warning:
      'bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 active:bg-amber-700 text-white border-2 border-amber-400/80 dark:border-amber-300/80 shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-amber-500/40',
  };

  const sizeClasses = {
    md: 'min-h-[52px] py-3.5 px-5 rounded-2xl text-base font-bold',
    lg: 'min-h-[58px] sm:min-h-[64px] py-4 px-6 rounded-2xl sm:rounded-3xl text-base sm:text-lg font-bold',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses[size]}
        transition-all duration-150 cursor-pointer
        active:translate-y-1 active:scale-[0.99]
        disabled:opacity-45 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:scale-100
        flex items-center justify-center gap-3 select-none
        focus:outline-none focus-visible:ring-4
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span className="text-center leading-snug">{children}</span>
    </button>
  );
}
