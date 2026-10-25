import { Check, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n';

export interface LevelPickerProps {
  count?: number;
  /** Level the player is currently on (1-based). */
  current: number;
  /** Highest level the player has ever reached — later ones stay open but unproven. */
  reached?: number;
  /** One line under the numeral, e.g. "4 objects · 15 s". */
  caption?: (level: number) => string;
  onPick: (level: number) => void;
}

/**
 * The level ladder. Every game used to render five identical cards with the
 * same two lines of text; this makes the choice scannable — big numeral,
 * a tick for levels already cleared, and the current level visibly "you are
 * here" — while staying one huge tap target per row.
 */
export function LevelPicker({ count = 5, current, reached = 1, caption, onPick }: LevelPickerProps) {
  const { t } = useI18n();
  return (
    <div className="levelgrid">
      {Array.from({ length: count }, (_, i) => i + 1).map((lvl) => {
        const isCurrent = lvl === current;
        const isCleared = lvl < reached || (lvl < current && !isCurrent);
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => onPick(lvl)}
            className="levelbtn"
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`${t('games.levelN', { n: lvl })}${caption ? ` — ${caption(lvl)}` : ''}`}
          >
            <span className="levelbtn__num">{lvl}</span>
            <span className="levelbtn__meta">
              <span className="levelbtn__name">{t('games.levelN', { n: lvl })}</span>
              {caption && <span className="levelbtn__caption">{caption(lvl)}</span>}
            </span>
            <span className="levelbtn__state" aria-hidden="true">
              {isCleared ? <Check /> : isCurrent ? <ChevronRight className="text-[var(--brand-teal)]" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
