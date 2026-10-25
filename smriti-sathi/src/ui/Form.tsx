import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const cx = (...p: (string | false | undefined | null)[]) => p.filter(Boolean).join(' ');

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cx('field', className)}>
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="field__hint" style={{ color: 'var(--danger)' }}>
          {error}
        </span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('input', className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('textarea', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx('select', className)} {...rest}>
      {children}
    </select>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  describedBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className="switch"
    />
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: ReactNode }[];
  ariaLabel?: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          className="segmented__item"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A big, elder-friendly radio row (used for language, profile, difficulty). */
export function ChoiceRow({
  selected,
  onSelect,
  title,
  subtitle,
  leading,
  trailing,
  native,
}: {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  native?: string;
}) {
  const id = useId();
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-labelledby={id}
      onClick={onSelect}
      className={cx(
        'flex w-full items-center gap-3.5 rounded-[var(--r-md)] border-2 p-3.5 text-left transition-all',
        selected
          ? 'border-brand bg-brand-soft shadow-[var(--shadow-1)]'
          : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span id={id} className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[0.98rem] font-bold text-ink">{title}</span>
          {native && (
            <span className="text-[0.95rem] text-ink-3" style={{ fontFamily: 'var(--font-display)' }}>
              {native}
            </span>
          )}
        </span>
        {subtitle && <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-3">{subtitle}</span>}
      </span>
      {trailing}
      <span
        aria-hidden
        className={cx(
          'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2',
          selected ? 'border-brand bg-brand' : 'border-line-strong',
        )}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}
