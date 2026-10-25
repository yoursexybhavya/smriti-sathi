import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton, Button } from './Button';
import { useT } from '../i18n';

const cx = (...p: (string | false | undefined | null)[]) => p.filter(Boolean).join(' ');

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  /** Hide the default close affordance (e.g. for the emergency card). */
  hideClose?: boolean;
  className?: string;
}

/**
 * Bottom sheet on phones, centred dialog on desktop.
 * Traps focus, closes on Escape / backdrop, restores body scroll.
 */
export function Sheet({ open, onClose, title, eyebrow, children, footer, wide, hideClose, className }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const nodes = ref.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const list = Array.from(nodes).filter((n) => !n.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => {
      ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 80);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cx('sheet', wide && 'sheet--wide', className)}
      >
        <div className="sheet__grab" />
        {(title || !hideClose) && (
          <div className="sheet__head">
            <div className="min-w-0 flex-1">
              {eyebrow && <div className="t-eyebrow mb-1">{eyebrow}</div>}
              {title && <h2 className="t-h2">{title}</h2>}
            </div>
            {!hideClose && (
              <IconButton label={t('c.close')} variant="ghost" onClick={onClose} data-autofocus>
                <X />
              </IconButton>
            )}
          </div>
        )}
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  danger,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  body?: ReactNode;
  confirmLabel?: ReactNode;
  danger?: boolean;
}) {
  const t = useT();
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" block onClick={onClose}>
            {t('c.cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} block onClick={onConfirm}>
            {confirmLabel ?? t('c.delete')}
          </Button>
        </div>
      }
    >
      {body && <p className="t-body">{body}</p>}
    </Sheet>
  );
}
