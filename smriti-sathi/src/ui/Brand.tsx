import { useId } from 'react';

/**
 * Smriti Sathi brand mark.
 * A lotus (memory, patience, care) cradling a diya flame (the remembered
 * person). Pure vector: renders identically at 16px in a favicon and at
 * 200px on a splash screen, in any theme.
 */

export function BrandMark({
  size = 44,
  className,
  tone = 'filled',
}: {
  size?: number;
  className?: string;
  /** filled = teal tile with cream lotus; mono = currentColor only */
  tone?: 'filled' | 'mono';
}) {
  // Must be unique per instance: a duplicate gradient id that first appears
  // inside a `display:none` container stops painting everywhere else.
  const gradientId = `ss-mark-${tone}-${useId().replace(/[:]/g, '')}`;
  const isMono = tone === 'mono';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Smriti Sathi"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="88" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#17836F" />
          <stop offset="0.55" stopColor="#0E5C50" />
          <stop offset="1" stopColor="#093F37" />
        </linearGradient>
      </defs>

      {!isMono && (
        <>
          <rect x="0" y="0" width="96" height="96" rx="26" fill={`url(#${gradientId})`} />
          <rect x="0.75" y="0.75" width="94.5" height="94.5" rx="25.4" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.5" />
        </>
      )}

      <g fill={isMono ? 'currentColor' : '#FBF6EE'}>
        {/* centre petal */}
        <path d="M48 25c6.6 10.2 6.6 19.4 0 28.4-6.6-9-6.6-18.2 0-28.4Z" fillOpacity="0.97" />
        {/* outer petals */}
        <path d="M47.2 53.6c-10.6-2.4-18.4-10.6-21-21.2 10.9.9 19 8.9 21 21.2Z" fillOpacity="0.86" />
        <path d="M48.8 53.6c10.6-2.4 18.4-10.6 21-21.2-10.9.9-19 8.9-21 21.2Z" fillOpacity="0.86" />
        {/* bowl */}
        <path d="M28.5 58.5h39c-1.6 8.4-9.4 14.5-19.5 14.5s-17.9-6.1-19.5-14.5Z" fillOpacity="0.95" />
      </g>

      {/* diya flame */}
      <circle cx="48" cy="48.2" r="3.1" fill={isMono ? 'currentColor' : '#E8A94E'} />
    </svg>
  );
}

export function BrandLockup({
  size = 40,
  showTagline,
  tagline,
  name,
  className,
  onDark,
}: {
  size?: number;
  showTagline?: boolean;
  tagline?: string;
  name?: string;
  className?: string;
  /** Set on the teal brand panel, where ink colours would disappear. */
  onDark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <BrandMark size={size} />
      <div className="min-w-0">
        <div
          className="t-h3 leading-tight tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: onDark ? '#FBF6EE' : 'var(--ink)',
          }}
        >
          {name ?? 'Smriti Sathi'}
        </div>
        {showTagline && tagline && (
          <div
            className="t-xs leading-tight"
            style={{ color: onDark ? 'rgba(251,246,238,0.72)' : 'var(--ink-3)' }}
          >
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
}
