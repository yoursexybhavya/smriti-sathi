import type { ReactNode } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export function GameCard({ title, description, icon, onClick }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-surface)',
        border: '2px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        boxShadow: 'var(--shadow-sm)',
        fontFamily: 'var(--font-family)',
        minHeight: 'var(--touch-min)',
      }}
    >
      <span style={{ fontSize: 'var(--font-size-2xl)', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-dark)', marginBottom: 'var(--space-xs)' }}>
          {title}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          {description}
        </div>
      </div>
    </button>
  );
}
