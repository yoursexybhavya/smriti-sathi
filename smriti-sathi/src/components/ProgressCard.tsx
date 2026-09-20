import { ReactNode } from 'react';

interface ProgressCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function ProgressCard({
  icon,
  label,
  value,
  subtitle,
  color = '#4F46E5',
}: ProgressCardProps) {
  return (
    <div className="p-3 sm:p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] text-center shadow-xs transition-all h-full flex flex-col items-center justify-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl mx-auto mb-1.5 sm:mb-2 flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</p>
      <p className="text-xs sm:text-sm text-[var(--color-text)] mt-0.5 font-bold truncate max-w-full">{label}</p>
      {subtitle && (
        <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5 truncate max-w-full">{subtitle}</p>
      )}
    </div>
  );
}
