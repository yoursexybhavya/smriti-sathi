import { ReactNode } from 'react';

interface LargeActionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning';
}

export default function LargeActionCard({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'neutral',
}: LargeActionCardProps) {
  const cardVariantClasses = {
    primary: 'bg-white dark:bg-slate-800/90 border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-slate-800/90 border-blue-200/80 dark:border-blue-900/60 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-md',
    neutral: 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md',
    success: 'bg-white dark:bg-slate-800/90 border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-md',
    warning: 'bg-white dark:bg-slate-800/90 border-amber-200/80 dark:border-amber-900/60 hover:border-amber-500 dark:hover:border-amber-400 shadow-sm hover:shadow-md',
  };

  const iconVariantClasses = {
    primary: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    secondary: 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400',
    neutral: 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400',
  };

  return (
    <button
      onClick={onPress}
      className={`w-full min-h-[64px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.98] flex items-center gap-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${cardVariantClasses[variant]}`}
      aria-label={title}
    >
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-sm ${iconVariantClasses[variant]}`}>
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">{title}</h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">{subtitle}</p>
        )}
      </div>
    </button>
  );
}
