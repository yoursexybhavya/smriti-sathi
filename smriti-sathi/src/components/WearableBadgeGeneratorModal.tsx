import { useState } from 'react';
import { CreditCard, Printer } from 'lucide-react';
import { QRCodeSvg } from './QRCodeSvg';
import { Field, Input, Sheet, Button, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Printable 85.6 × 54 mm (credit-card) emergency badge for a pocket,
 * wallet or pendant. Pure CSS + inline SVG so it prints crisply offline.
 */
export const WearableBadgeGeneratorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { t, lang } = useI18n();

  const [name, setName] = useState(state.currentPatient?.name ?? t('auth.elderName'));
  const [age, setAge] = useState(String(state.currentPatient?.age ?? 72));
  const [phone, setPhone] = useState(
    (() => {
      try {
        return localStorage.getItem('smriti_linked_caregiver_phone') || '+91 98765 43210';
      } catch {
        return '+91 98765 43210';
      }
    })(),
  );
  const [contactName, setContactName] = useState('Bhavya (Son)');

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const payload = `https://smriti-sathi.onrender.com/rescue?name=${encodeURIComponent(name)}&phone=${cleanPhone}&lang=${lang}`;

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      eyebrow={t('saf.badge')}
      title={t('saf.badgeBody')}
      footer={
        <Button block size="lg" onClick={() => window.print()} icon={<Printer className="h-[18px] w-[18px]" />}>
          {t('c.print')}
        </Button>
      }
    >
      {/* Card preview at true 85.6 × 54 mm aspect */}
      <div className="mx-auto w-full max-w-[420px]">
        <div
          id="printable-emergency-badge"
          className="printable-card relative overflow-hidden rounded-[14px] bg-white"
          style={{ aspectRatio: '85.6 / 54', border: '1px solid var(--line-strong)', boxShadow: 'var(--shadow-2)' }}
        >
          <div className="h-[26%] w-full px-3 py-1.5" style={{ background: '#0E5C50' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/90">Safe Return · स्मृति साथी</span>
              <span className="rounded-full bg-[#E8A94E] px-1.5 py-[1px] text-[8px] font-extrabold text-[#2B1A03]">SOS</span>
            </div>
          </div>

          <div className="flex h-[74%] items-start gap-2.5 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-extrabold leading-tight" style={{ color: '#17211E' }}>
                {name}
              </div>
              <div className="text-[8.5px] font-bold uppercase tracking-wide" style={{ color: '#68766F' }}>
                {age} · Dementia care
              </div>

              <div className="mt-1.5 space-y-[2px] text-[8px] leading-[1.25]" style={{ color: '#414F4A' }}>
                <div>
                  <b>If found lost, please call:</b>
                </div>
                <div className="text-[10px] font-extrabold" style={{ color: '#B3261E' }}>
                  {contactName} · {phone}
                </div>
                <div>Blood group: O+ · Allergy: Penicillin</div>
                <div>Speaks: {lang.toUpperCase()} · May not remember address</div>
              </div>
            </div>

            <div className="shrink-0 text-center">
              <div className="rounded-[4px] border p-[2px]" style={{ borderColor: '#E8DDCC', background: '#fff' }}>
                <QRCodeSvg value={payload} size={58} bgColor="#FFFFFF" fgColor="#17211E" />
              </div>
              <div className="mt-[2px] text-[6.5px] font-bold uppercase tracking-wider" style={{ color: '#68766F' }}>
                Scan for help
              </div>
            </div>
          </div>
        </div>

        <p className="t-xs mt-2 text-center">{t('saf.badgeBody')}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Field label={t('ob.nameLabel')} htmlFor="b-name">
          <Input id="b-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('ob.ageLabel')} htmlFor="b-age">
            <Input id="b-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
          </Field>
          <Field label={t('saf.emergencyContact')} htmlFor="b-contact">
            <Input id="b-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </Field>
        </div>
        <Field label={t('saf.callGuardian')} htmlFor="b-phone">
          <Input id="b-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <div className="flex items-center gap-2">
          <Tag tone="teal" icon={<CreditCard className="h-3 w-3" />}>
            85.6 × 54 mm
          </Tag>
          <Tag>{t('c.print')} {t('c.on')} {t('set.about')}</Tag>
        </div>
      </div>
    </Sheet>
  );
};

export default WearableBadgeGeneratorModal;
