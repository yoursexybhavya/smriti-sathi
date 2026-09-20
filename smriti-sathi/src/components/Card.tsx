import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, className = '', onPress, elevated = false }: CardProps) {
  const baseClasses = `bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-200 ${
    elevated
      ? 'shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]'
      : 'shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]'
  }`;
  
  if (onPress) {
    return (
      <button
        onClick={onPress}
        className={`${baseClasses} w-full text-left transition-all active:scale-[0.99] active:translate-y-0.5 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${className}`}
      >
        {children}
      </button>
    );
  }
  
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}
