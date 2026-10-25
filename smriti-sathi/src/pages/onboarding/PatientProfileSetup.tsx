import { useState } from 'react';
import { Button, Card, Field, Input } from '../../ui';
import { useI18n } from '../../i18n';
import type { PatientProfile } from '../../context/AppContext';

export default function PatientProfileSetup({
  initial,
  onNext,
  onBack,
}: {
  initial: PatientProfile | null;
  onNext: (p: PatientProfile) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(initial?.name ?? '');
  const [age, setAge] = useState(String(initial?.age ?? ''));

  const submit = () => {
    onNext({
      id: initial?.id ?? `patient_${Date.now()}`,
      name: name.trim() || t('auth.elderName'),
      age: Number(age) || 72,
      preferredLanguage: initial?.preferredLanguage ?? 'en',
      dailyRoutine: initial?.dailyRoutine ?? [],
      reminderPreferences: initial?.reminderPreferences ?? {
        medicine: true,
        hydration: true,
        activity: true,
        appointment: true,
      },
    });
  };

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="t-h1">{t('ob.nameTitle')}</h1>
        <p className="t-body mt-1.5">{t('ob.nameBody')}</p>
      </div>

      <Field label={t('ob.nameLabel')} htmlFor="ob-name">
        <Input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('auth.elderName')} data-autofocus />
      </Field>

      <Field label={t('ob.ageLabel')} htmlFor="ob-age">
        <Input id="ob-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="72" />
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={submit}>
          {t('c.next')}
        </Button>
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← Back to Welcome
        </Button>
      </div>
    </Card>
  );
}
