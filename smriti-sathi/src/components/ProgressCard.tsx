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
  color = '#1B5E20',
}: ProgressCardProps) {
  return (
    <div className="p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] text-center shadow-sm transition-colors duration-200">
      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color }}>{value}</p>
      <p className="text-sm text-[var(--color-text)] mt-1 font-semibold">{label}</p>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
