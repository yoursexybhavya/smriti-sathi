import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ScreenContainer({ children, className = '' }: ScreenContainerProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto min-h-screen bg-[var(--color-bg,#F8FAFC)] text-[var(--color-text,#0F172A)] transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
}
