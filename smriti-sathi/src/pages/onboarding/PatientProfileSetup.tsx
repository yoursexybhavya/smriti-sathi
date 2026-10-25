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
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(t('ob.nameRequired'));
      isValid = false;
    } else {
      setNameError('');
    }

    const trimmedAge = age.trim();
    const numAge = Number(trimmedAge);
    if (!trimmedAge || isNaN(numAge)) {
      setAgeError(t('ob.ageRequired'));
      isValid = false;
    } else if (numAge < 40) {
      setAgeError(t('ob.ageTooLow'));
      isValid = false;
    } else if (numAge > 120) {
      setAgeError(t('ob.ageTooHigh'));
      isValid = false;
    } else {
      setAgeError('');
    }

    return isValid;
  };

  const submit = () => {
    if (!validate()) return;
    onNext({
      id: initial?.id ?? `patient_${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      preferredLanguage: initial?.preferredLanguage ?? 'en',
      profileImage: initial?.profileImage,
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

      <Field label={t('ob.nameLabel')} htmlFor="ob-name" error={nameError}>
        <Input
          id="ob-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
          placeholder={t('auth.elderName')}
          data-autofocus
        />
      </Field>

      <Field
        label={t('ob.ageLabel')}
        htmlFor="ob-age"
        error={ageError}
        hint={!ageError ? t('ob.ageRange') : undefined}
      >
        <Input
          id="ob-age"
          type="number"
          inputMode="numeric"
          min={40}
          max={120}
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            if (ageError) setAgeError('');
          }}
          placeholder="72"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={submit}>
          {t('c.next')}
        </Button>
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {t('c.back')}
        </Button>
      </div>
    </Card>
  );
}
