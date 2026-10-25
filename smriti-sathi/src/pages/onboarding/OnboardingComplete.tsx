import { Check } from 'lucide-react';
import { Button, Card, Tag } from '../../ui';
import { useI18n } from '../../i18n';
import type { AccessibilitySettings, PatientProfile } from '../../context/AppContext';

export default function OnboardingComplete({
  patient,
  accessibility,
  onFinish,
  onBack,
}: {
  patient: PatientProfile | null;
  accessibility: AccessibilitySettings;
  onFinish: () => void;
  onBack: () => void;
}) {
  const { t, meta } = useI18n();

  return (
    <Card className="flex flex-col gap-5 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
        <Check className="h-8 w-8" />
      </div>

      <div>
        <h1 className="t-h1">{t('ob.doneTitle')}</h1>
        <p className="t-body mx-auto mt-1.5 max-w-[42ch]">{t('ob.doneBody')}</p>
      </div>

      <div className="mx-auto flex flex-wrap justify-center gap-2">
        <Tag tone="teal">{patient?.name ?? t('auth.elderName')}</Tag>
        <Tag>{patient?.age ?? 72}</Tag>
        <Tag tone="saffron">{meta.native}</Tag>
        <Tag tone="info">{accessibility.textSize}</Tag>
      </div>

      <Button size="xl" block onClick={onFinish}>
        {t('ob.start')}
      </Button>
      <Button variant="ghost" onClick={onBack}>
        ← Review Settings
      </Button>
    </Card>
  );
}
