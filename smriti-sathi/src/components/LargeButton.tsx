import { ReactNode } from 'react';

interface LargeButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function LargeButton({
  children,
  onPress,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled = false,
  className = '',
}: LargeButtonProps) {
  const variantClasses = {
    primary: 'bg-[#1B5E20] text-white hover:bg-[#0D3B12] shadow-md',
    secondary: 'bg-[#E65100] text-white hover:bg-[#BF360C] shadow-md',
    outline: 'bg-white text-[#1B5E20] border-2 border-[#1B5E20] hover:bg-[#E8F5E9]',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${variantClasses[variant]}
        py-4 px-6 rounded-2xl font-semibold text-lg
        transition-all active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
