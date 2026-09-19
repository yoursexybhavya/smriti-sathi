import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, className = '', onPress, elevated = false }: CardProps) {
  const baseClasses = `bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-200 ${
    elevated ? 'shadow-md' : 'shadow-sm'
  }`;
  
  if (onPress) {
    return (
      <button
        onClick={onPress}
        className={`${baseClasses} w-full text-left transition-transform active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }
  
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}
