import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'saffron' | 'outline-danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  loading?: boolean;
}

const cx = (...parts: (string | false | undefined | null)[]) => parts.filter(Boolean).join(' ');

/**
 * The single button primitive for the whole product.
 * Minimum height 52px (tremor-safe); `xl` is 72px for elder primary actions.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, icon, iconAfter, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      disabled={disabled || loading}
      className={cx(
        'btn',
        variant !== 'primary' && `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        block && 'btn--block',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icon
      )}
      {children != null && <span className="min-w-0 truncate">{children}</span>}
      {iconAfter}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'default', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'iconbtn',
        variant !== 'default' && `iconbtn--${variant}`,
        size === 'sm' && 'iconbtn--sm',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
