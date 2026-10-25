import { useState } from 'react';
import { ArrowLeft, ArrowRight, LifeBuoy, ShieldCheck } from 'lucide-react';
import { Button, Card, Field, Input } from '../../ui';
import { useI18n } from '../../i18n';
import type { EmergencyContact } from '../../context/AppContext';

/**
 * The one piece of information the Safe Return card cannot work without.
 *
 * It is asked for once, during set-up, and can be skipped — but the card then
 * says so honestly rather than inventing a guardian name and phone number.
 */
export default function EmergencyContactSetup({
  initial,
  onNext,
  onBack,
}: {
  initial: EmergencyContact | null;
  onNext: (contact: EmergencyContact | null) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [relation, setRelation] = useState(initial?.relation ?? '');
  const [error, setError] = useState('');

  const digits = phone.replace(/[^0-9]/g, '');

  const submit = () => {
    if (!name.trim() && !phone.trim()) {
      onNext(null);
      return;
    }
    if (name.trim().length < 2) {
      setError(t('ob.contactNameError'));
      return;
    }
    if (digits.length < 8) {
      setError(t('ob.contactPhoneError'));
      return;
    }
    onNext({ name: name.trim(), phone: phone.trim(), relation: relation.trim() || undefined });
  };

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="t-h1">{t('ob.contactTitle')}</h1>
        <p className="t-body mt-1.5">{t('ob.contactBody')}</p>
      </div>

      <div className="flex items-start gap-2.5 rounded-[var(--r-md)] border border-[var(--line-soft)] bg-[var(--surface-warm)] p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--danger-soft)] text-[var(--danger-strong)]">
          <LifeBuoy className="h-4.5 w-4.5" />
        </span>
        <p className="t-xs m-0 leading-snug">{t('ob.contactWhy')}</p>
      </div>

      <Field label={t('ob.contactName')} htmlFor="ob-contact-name" error={error ? error : undefined}>
        <Input
          id="ob-contact-name"
          value={name}
          autoComplete="name"
          placeholder={t('ob.contactNamePlaceholder')}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
        />
      </Field>

      <Field label={t('ob.contactPhone')} htmlFor="ob-contact-phone" hint={t('ob.contactHint')}>
        <Input
          id="ob-contact-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          placeholder="+91 98765 43210"
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError('');
          }}
        />
      </Field>

      <Field label={t('ob.contactRelation')} htmlFor="ob-contact-relation">
        <Input
          id="ob-contact-relation"
          value={relation}
          placeholder={t('ob.contactRelationPlaceholder')}
          onChange={(e) => setRelation(e.target.value)}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={submit} iconAfter={<ArrowRight className="h-[18px] w-[18px]" />}>
          {t('c.next')}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => onNext(null)}>
          {t('ob.skip')}
        </Button>
        <Button variant="ghost" size="lg" icon={<ArrowLeft className="h-[18px] w-[18px]" />} onClick={onBack}>
          {t('c.back')}
        </Button>
      </div>

      <p className="t-xs flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />
        {t('ob.contactStays')}
      </p>
    </Card>
  );
}
