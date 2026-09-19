import { ReactNode } from 'react';

interface LargeActionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export default function LargeActionCard({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'neutral',
}: LargeActionCardProps) {
  const variantClasses = {
    primary: 'bg-[#E8F5E9] border-[#C8E6C9] hover:bg-[#C8E6C9]',
    secondary: 'bg-[#FFF3E0] border-[#FFE0B2] hover:bg-[#FFE0B2]',
    neutral: 'bg-white border-[#E0D8CC] hover:bg-[#FDF8F0]',
  };

  return (
    <button
      onClick={onPress}
      className={`w-full p-5 rounded-2xl border-2 transition-all active:scale-[0.98] flex items-center gap-4 ${variantClasses[variant]}`}
      aria-label={title}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[#4A4A4A] mt-1">{subtitle}</p>
        )}
      </div>
    </button>
  );
}
