import type { ReactNode } from 'react';

const cx = (...p: (string | false | undefined | null)[]) => p.filter(Boolean).join(' ');

type Tone = 'default' | 'warm' | 'sage' | 'saffron' | 'danger' | 'ink';

export interface CardProps {
  children: ReactNode;
  tone?: Tone;
  pad?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article';
  id?: string;
}

export function Card({ children, tone = 'default', pad = true, className, as: Tag = 'div', id }: CardProps) {
  return (
    <Tag
      id={id}
      className={cx(
        'card',
        pad && 'card--pad',
        tone === 'warm' && 'card--warm',
        tone === 'sage' && 'card--sage',
        tone === 'saffron' && 'card--saffron',
        tone === 'danger' && 'card--danger',
        tone === 'ink' && 'card--ink',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export interface InteractiveCardProps extends CardProps {
  onClick: () => void;
  label?: string;
}

export function InteractiveCard({ children, onClick, label, tone = 'default', className, id }: InteractiveCardProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      aria-label={label}
      className={cx(
        'card card--pad card--interactive',
        tone !== 'default' && `card--${tone}`,
        className,
      )}
    >
      {children}
    </button>
  );
}

/** A titled block with an optional trailing action — the page rhythm unit. */
export function Section({
  title,
  subtitle,
  action,
  children,
  className,
  id,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cx('flex flex-col gap-3', className)}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="t-h3 text-ink">{title}</h2>}
            {subtitle && <p className="t-sm mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
