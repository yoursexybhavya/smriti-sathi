import { Volume2 } from 'lucide-react';
import { Button, Card, ChoiceRow } from '../../ui';
import { useI18n } from '../../i18n';
import type { LanguageCode } from '../../i18n/types';
import { useVoice } from '../../hooks/useVoice';

export default function LanguageSelection({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: string;
  onSelect: (code: LanguageCode) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t, languages } = useI18n();
  const { speak } = useVoice();

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="t-h1">{t('ob.langTitle')}</h1>
        <p className="t-body mt-1.5">{t('ob.langBody')}</p>
      </div>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={t('ob.langTitle')}>
        {languages.map((l) => (
          <ChoiceRow
            key={l.code}
            selected={selected === l.code}
            onSelect={() => onSelect(l.code)}
            title={l.native}
            subtitle={l.label}
            leading={
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-sunken)] text-[0.72rem] font-extrabold uppercase text-ink-2">
                {l.code}
              </span>
            }
            trailing={
              <button
                type="button"
                aria-label={t('home.hearThis')}
                onClick={(e) => {
                  e.stopPropagation();
                  speak(t('app.tagline'), l.code);
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-3 hover:bg-[var(--surface-sunken)]"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            }
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={onNext}>
          {t('c.next')}
        </Button>
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← Back to Profile Setup
        </Button>
      </div>
    </Card>
  );
}
