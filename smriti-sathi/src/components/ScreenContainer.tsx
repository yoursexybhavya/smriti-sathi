import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ScreenContainer({ children, className = '' }: ScreenContainerProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto min-h-screen bg-[#F5F0E8] ${className}`}>
      {children}
    </div>
  );
}
