import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, className = '', onPress, elevated = false }: CardProps) {
  const base =
    'relative overflow-hidden bg-[var(--color-card)] text-[var(--color-text)] ' +
    'rounded-[28px] border border-[var(--color-border)] ' +
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
    (elevated
      ? 'shadow-[0_12px_32px_rgba(15,23,42,0.08),0_4px_12px_rgba(15,23,42,0.06)] '
      : 'shadow-[0_8px_20px_rgba(15,23,42,0.06),0_2px_6px_rgba(15,23,42,0.04)] ') +
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';

  const interactive = onPress
    ? 'cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(15,23,42,0.10),0_8px_16px_rgba(15,23,42,0.06)] hover:border-[var(--color-border-strong)] active:translate-y-0 active:scale-[0.985] active:shadow-[0_4px_12px_rgba(15,23,42,0.06)] ' +
      'focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 '
    : '';

  if (onPress) {
    return (
      <button onClick={onPress} className={`${base} w-full text-left ${interactive} ${className}`}>
        <span className="relative block">{children}</span>
      </button>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
