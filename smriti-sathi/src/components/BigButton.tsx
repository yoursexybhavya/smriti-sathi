import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'remind';
  children: ReactNode;
  fullWidth?: boolean;
}

export function BigButton({ variant = 'primary', children, fullWidth = false, style, ...props }: BigButtonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' },
    secondary: { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '2px solid var(--color-border)' },
    accent: { backgroundColor: 'var(--color-accent)', color: 'var(--color-text-inverse)' },
    remind: { backgroundColor: 'var(--color-remind)', color: 'var(--color-text-inverse)' },
  };

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        minHeight: 'var(--touch-min)',
        padding: 'var(--space-md) var(--space-xl)',
        borderRadius: 'var(--radius)',
        border: 'none',
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-semibold)',
        fontFamily: 'var(--font-family)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: 'var(--shadow-sm)',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
