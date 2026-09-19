import { ReactNode } from 'react';

interface LargeButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
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
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm hover:shadow-md focus-visible:ring-indigo-500/30',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm focus-visible:ring-slate-400/30',
    outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 focus-visible:ring-indigo-500/30',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm hover:shadow-md focus-visible:ring-emerald-500/30',
    warning: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm hover:shadow-md focus-visible:ring-amber-500/30',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        min-h-[56px] py-3.5 px-6 rounded-2xl font-semibold text-lg
        transition-all active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
        focus:outline-none focus-visible:ring-4
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
