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
    primary: 'bg-[#10B981] text-white hover:bg-[#059669] shadow-md',
    secondary: 'bg-[#E65100] text-white hover:bg-[#D84315] shadow-md',
    outline: 'bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] hover:border-[#10B981] hover:bg-[var(--color-bg-subtle)]',
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
