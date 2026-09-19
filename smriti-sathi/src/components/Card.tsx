import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, className = '', onPress, elevated = false }: CardProps) {
  const baseClasses = `bg-white rounded-2xl border border-[#E0D8CC] ${
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
