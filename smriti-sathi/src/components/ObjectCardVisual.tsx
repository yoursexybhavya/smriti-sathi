import { REMEMBER_OBJECTS } from '../models/GameSession';

/**
 * The one way a memory object is ever drawn.
 *
 * The old components painted remote Unsplash photographs, which meant the
 * "offline" app showed grey boxes the moment a network dropped — and a photo
 * of a hotel bathroom sitting next to a stranger's shoe is confusing for
 * someone living with dementia. Every object already carries a curated glyph,
 * so we draw a warm, high-contrast tile instead: instantly recognisable at any
 * distance, identical on every device, and no network at all.
 */

const CATEGORY_TINT: Record<string, { bg: string; ring: string; label: string }> = {
  daily: { bg: 'var(--brand-teal-soft)', ring: 'var(--brand-teal-line)', label: 'var(--brand-teal-deep)' },
  fruit: { bg: 'var(--brand-saffron-soft)', ring: 'var(--brand-saffron-line)', label: 'var(--brand-saffron-ink)' },
  nature: { bg: 'var(--success-soft)', ring: 'var(--success-line)', label: 'var(--success-ink)' },
  animal: { bg: 'var(--info-soft)', ring: 'var(--info-line)', label: 'var(--info-ink)' },
  vehicle: { bg: 'var(--surface-sunken)', ring: 'var(--line)', label: 'var(--ink-2)' },
};

export interface ObjectCardVisualProps {
  /** Retained for API compatibility — never used for rendering. */
  imageUrl?: string;
  name?: string;
  emoji?: string;
  /** `tile` fills its box; `chip` is a small inline glyph. */
  variant?: 'tile' | 'chip';
  /** Show the object's name under the glyph (tiles only). */
  showLabel?: boolean;
  className?: string;
  imgClassName?: string;
  onError?: (e: unknown) => void;
}

export default function ObjectCardVisual({
  imageUrl,
  name,
  emoji,
  variant = 'tile',
  showLabel = true,
  className = '',
}: ObjectCardVisualProps) {
  const found = REMEMBER_OBJECTS.find((o) => o.imageUrl === imageUrl || o.id === imageUrl || o.name === name);
  const glyph = emoji || found?.emoji || '🌼';
  const label = name || found?.name;
  const tint = CATEGORY_TINT[found?.category ?? 'daily'] ?? CATEGORY_TINT.daily;

  if (variant === 'chip') {
    return (
      <span className={`object-chip ${className}`} role="img" aria-label={label ?? 'Object'}>
        {glyph}
      </span>
    );
  }

  return (
    <div className={`object-tile ${className}`} style={{ background: tint.bg, borderColor: tint.ring }}>
      <span className="object-tile__glyph" role="img" aria-label={label ?? 'Object'}>
        {glyph}
      </span>
      {showLabel && label && (
        <span className="object-tile__label" style={{ color: tint.label }}>
          {label}
        </span>
      )}
    </div>
  );
}
