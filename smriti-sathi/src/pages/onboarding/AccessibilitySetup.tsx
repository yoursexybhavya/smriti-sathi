import { useState } from 'react';
import { Button, Card, Segmented, Switch } from '../../ui';
import { useI18n } from '../../i18n';
import type { AccessibilitySettings } from '../../context/AppContext';

export default function AccessibilitySetup({
  initial,
  onNext,
  onBack,
}: {
  initial: AccessibilitySettings;
  onNext: (a: AccessibilitySettings) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<AccessibilitySettings>(initial);

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="t-h1">{t('ob.accessTitle')}</h1>
        <p className="t-body mt-1.5">{t('ob.accessBody')}</p>
      </div>

      <div>
        <div className="field__label mb-2">{t('set.textSize')}</div>
        <Segmented
          ariaLabel={t('set.textSize')}
          value={settings.textSize}
          onChange={(v) => setSettings((s) => ({ ...s, textSize: v }))}
          options={[
            { value: 'normal', label: t('set.comfort') },
            { value: 'large', label: t('set.large') },
            { value: 'extra-large', label: t('set.extraLarge') },
          ]}
        />
        <div
          className="mt-3 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface-warm)] p-4"
          style={{ fontSize: settings.textSize === 'extra-large' ? '1.3rem' : settings.textSize === 'large' ? '1.15rem' : '1rem' }}
        >
          {t('set.previewText')}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[var(--r-md)] border border-[var(--line)] p-3.5">
        <div>
          <div className="text-[0.94rem] font-bold text-ink">{t('set.contrast')}</div>
          <div className="t-xs">{t('set.contrastBody')}</div>
        </div>
        <Switch
          label={t('set.contrast')}
          checked={settings.highContrast}
          onChange={(v) => setSettings((s) => ({ ...s, highContrast: v }))}
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[var(--r-md)] border border-[var(--line)] p-3.5">
        <div>
          <div className="text-[0.94rem] font-bold text-ink">{t('set.voiceOn')}</div>
          <div className="t-xs">{t('set.voice')}</div>
        </div>
        <Switch
          label={t('set.voiceOn')}
          checked={settings.voiceGuidance}
          onChange={(v) => setSettings((s) => ({ ...s, voiceGuidance: v }))}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={() => onNext(settings)}>
          {t('c.next')}
        </Button>
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {t('c.back')}
        </Button>
      </div>
    </Card>
  );
}
