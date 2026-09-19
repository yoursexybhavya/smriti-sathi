import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, className = '', onPress, elevated = false }: CardProps) {
  const baseClasses = `bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-200 ${
    elevated ? 'shadow-md dark:shadow-slate-950/40' : 'shadow-sm'
  }`;
  
  if (onPress) {
    return (
      <button
        onClick={onPress}
        className={`${baseClasses} w-full text-left transition-transform active:scale-[0.98] cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${className}`}
      >
        {children}
      </button>
    );
  }
  
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}
