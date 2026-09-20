import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ScreenContainer({ children, className = '' }: ScreenContainerProps) {
  return (
    <div
      className={`relative w-full max-w-7xl mx-auto min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200 overflow-clip ${className}`}
    >
      {/* soft ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full blur-[80px] opacity-[0.08] bg-[radial-gradient(circle_at_center,#7C3AED_0%,transparent_70%)]" />
        <div className="absolute top-[18%] -left-24 h-[360px] w-[360px] rounded-full blur-[90px] opacity-[0.06] bg-[radial-gradient(circle_at_center,#06B6D4_0%,transparent_70%)]" />
        <div className="absolute bottom-[12%] right-[8%] h-[420px] w-[420px] rounded-full blur-[100px] opacity-[0.05] bg-[radial-gradient(circle_at_center,#10B981_0%,transparent_70%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
