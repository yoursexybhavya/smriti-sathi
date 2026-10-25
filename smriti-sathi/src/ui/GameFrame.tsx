import type { ReactNode } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { IconButton } from './Button';
import { ProgressBar } from './Feedback';

export interface GameFrameProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onBack: () => void;
  /** 0–100. Omit for intro/result screens where progress is meaningless. */
  progress?: number;
  /** Right-hand pill (level, score, timer…). */
  badge?: ReactNode;
  /** Pinned action area under the content — thumb reachable on phones. */
  footer?: ReactNode;
  /** `exit` shows an X (leaving a live session), `back` a chevron. */
  backIcon?: 'back' | 'exit';
  width?: 'play' | 'board';
  children: ReactNode;
}

/**
 * Immersive chrome for a single activity. The bottom dock is deliberately
 * absent: during play there is exactly one obvious way out, and the action
 * button sits where a thumb can reach it without covering the task.
 */
export function GameFrame({
  title,
  subtitle,
  onBack,
  progress,
  badge,
  footer,
  backIcon = 'back',
  width = 'play',
  children,
}: GameFrameProps) {
  const { t } = useI18n();
  return (
    <div className={`gameframe ${width === 'board' ? 'gameframe--board' : ''}`}>
      <header className="gameframe__bar">
        <IconButton label={t('c.back')} variant="ghost" size="sm" onClick={onBack}>
          {backIcon === 'exit' ? <X /> : <ChevronLeft />}
        </IconButton>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[1.02rem] font-bold leading-tight tracking-[-0.01em] text-ink">{title}</div>
          {subtitle && <div className="truncate text-[0.78rem] leading-tight text-ink-3">{subtitle}</div>}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </header>

      {typeof progress === 'number' && (
        <div className="gameframe__progress" aria-hidden="true">
          <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}

      <div className="gameframe__body">{children}</div>

      {footer && <div className="gameframe__foot">{footer}</div>}
    </div>
  );
}

/** Small helper so screens don't hand-roll the same progress maths. */
export function gameProgress(done: number, total: number) {
  return total <= 0 ? 0 : (done / total) * 100;
}

export { ProgressBar };
