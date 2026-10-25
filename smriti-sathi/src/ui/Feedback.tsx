import type { ReactNode } from 'react';

const cx = (...p: unknown[]) => p.filter((x) => typeof x === 'string' && x.length > 0).join(' ');

/* ── Tag ──────────────────────────────────────────────────────────────── */
type TagTone = 'default' | 'teal' | 'saffron' | 'danger' | 'success' | 'info' | 'solid-teal';

export function Tag({
  children,
  tone = 'default',
  icon,
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx('tag', tone !== 'default' && `tag--${tone}`, className)}>
      {icon}
      {children}
    </span>
  );
}

/* ── Alert ────────────────────────────────────────────────────────────── */
export function Alert({
  children,
  tone = 'info',
  icon,
  title,
  className,
}: {
  children?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  icon?: ReactNode;
  title?: ReactNode;
  className?: string;
}) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('alert', `alert--${tone}`, className)}>
      {icon}
      <div className="min-w-0 flex-1">
        {title && <div className="font-bold">{title}</div>}
        {children && <div className={cx(title && 'mt-0.5 opacity-90')}>{children}</div>}
      </div>
    </div>
  );
}

/* ── Stat tile ────────────────────────────────────────────────────────── */
export function Stat({
  value,
  label,
  hint,
  icon,
  tone,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: 'teal' | 'saffron' | 'danger';
  className?: string;
}) {
  const valueColor =
    tone === 'teal' ? 'text-brand' : tone === 'saffron' ? 'text-saffron' : tone === 'danger' ? 'text-danger' : 'text-ink';
  return (
    <div className={cx('stat', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="stat__label">{label}</span>
        {icon && <span className="text-ink-4">{icon}</span>}
      </div>
      <span className={cx('stat__value', valueColor)}>{value}</span>
      {hint && <span className="stat__hint">{hint}</span>}
    </div>
  );
}

/* ── Progress ─────────────────────────────────────────────────────────── */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'teal',
  showValue,
}: {
  value: number;
  max?: number;
  label?: ReactNode;
  tone?: 'teal' | 'saffron';
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, max === 0 ? 0 : (value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-2">
          {label && <span className="t-xs font-semibold text-ink-2">{label}</span>}
          {showValue && <span className="t-xs t-num font-bold text-ink-2">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="track"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        <div className={cx('track__fill', tone === 'saffron' && 'track__fill--saffron')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  children,
  tone = 'var(--brand-teal)',
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  tone?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset 600ms var(--ease-out)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────── */
export function EmptyState({
  icon,
  art,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  art?: string;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      {art ? (
        <img
          src={art}
          alt=""
          className="h-[136px] w-[136px] rounded-full object-cover"
          style={{ border: '1px dashed var(--brand-teal-line)' }}
        />
      ) : (
        <div className="empty__art">{icon}</div>
      )}
      <div className="mt-1">
        <h3 className="t-h3">{title}</h3>
        {body && <p className="t-sm mx-auto mt-1 max-w-[36ch]">{body}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
export function Skeleton({ className, height = 16, width }: { className?: string; height?: number | string; width?: number | string }) {
  return <div className={cx('skeleton', className)} style={{ height, width }} aria-hidden />;
}

/* ── Avatar ───────────────────────────────────────────────────────────── */
export function Avatar({
  name,
  src,
  size = 'md',
  square,
  className,
}: {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  square?: boolean;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={cx(
        'avatar',
        size === 'lg' && 'avatar--lg',
        size === 'xl' && 'avatar--xl',
        square && 'avatar--square',
        className,
      )}
      aria-hidden={!!src}
      title={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials || 'स'}
    </span>
  );
}
