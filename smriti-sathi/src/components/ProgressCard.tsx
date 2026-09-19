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
    <div className="p-4 bg-white rounded-2xl border border-[#E0D8CC] text-center">
      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-sm text-[#4A4A4A] mt-1 font-medium">{label}</p>
      {subtitle && (
        <p className="text-xs text-[#7A7A7A] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
