import { useEffect, useState } from 'react';
import { Droplet, LifeBuoy, MapPin, MessageCircle, Phone, ShieldAlert, Volume2 } from 'lucide-react';
import { QRCodeSvg } from './QRCodeSvg';
import { Button, Sheet, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { MEDICAL_CARD_EVENT, medicalCardService, type MedicalCard } from '../services/care/MedicalCardService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}


/**
 * Safe Return — designed for a stranger, not for the elder or the family.
 * Everything on this screen is legible at arm's length, in one tap.
 */
export const SafeReturnModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { t, lang } = useI18n();

  const elderName = state.currentPatient?.name ?? t('saf.unknownElder');
  const elderAge = state.currentPatient?.age ?? null;

  const [guardianName, setGuardianName] = useState(state.emergencyContact?.name ?? '');
  const [guardianPhone, setGuardianPhone] = useState(state.emergencyContact?.phone ?? '');
  const [card, setCard] = useState<MedicalCard>(() => medicalCardService.get());
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setGuardianName(state.emergencyContact?.name ?? '');
    setGuardianPhone(state.emergencyContact?.phone ?? '');
    setCard(medicalCardService.get());
  }, [isOpen, state.emergencyContact?.name, state.emergencyContact?.phone]);

  useEffect(() => {
    const sync = () => setCard(medicalCardService.get());
    window.addEventListener(MEDICAL_CARD_EVENT, sync);
    return () => window.removeEventListener(MEDICAL_CARD_EVENT, sync);
  }, []);

  const hasContact = guardianName.trim().length > 0 && guardianPhone.replace(/[^0-9]/g, '').length >= 8;
  const cleanPhone = guardianPhone.replace(/[^0-9]/g, '');
  const qrPayload = `SMRITI SATHI · ${elderName}${elderAge ? ` · ${elderAge}` : ''} · SOS ${
    hasContact ? `${guardianName} ${guardianPhone}` : '112 / 14567'
  }${card.bloodGroup ? ` · Blood ${card.bloodGroup}` : ''}${card.conditions.length ? ` · ${card.conditions.join(', ')}` : ''}${
    card.medicines.length ? ` · Meds ${card.medicines.join(', ')}` : ''
  }${card.allergies.length ? ` · Allergy ${card.allergies.join(', ')}` : ''}`;

  const shareLocation = () => {
    const send = (lat?: number, lng?: number) => {
      const place = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : '';
      const msg = `🚨 Safe Return — I have found ${elderName} (age ${elderAge}), who has dementia and may be lost.\n\n${place}\n\nPlease call the family guardian: ${guardianName} — ${guardianPhone}`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    };
    if (!navigator.geolocation) return send();
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        send(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        send();
      },
      { timeout: 8000 },
    );
  };

  const speakForHelper = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      hasContact
        ? `Please help. This is ${elderName}, who has dementia and may be lost. Please call ${guardianName} at ${guardianPhone}, or call 112.`
        : `Please help. This is ${elderName}, who has dementia and may be lost. Please call 112 or 14567.`,
    );
    u.lang = 'en-IN';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      eyebrow={t('saf.foundElder')}
      title={t('saf.safeReturn')}
      wide
      className="!bg-[var(--surface)]"
      footer={
        <div className="flex flex-col gap-2">
          {hasContact ? (
            <>
              <a href={`tel:${cleanPhone}`} className="btn btn--danger btn--lg btn--block">
                <Phone className="h-[18px] w-[18px]" />
                {t('saf.callGuardian')} · {guardianPhone}
              </a>
              <Button variant="secondary" block onClick={shareLocation} loading={locating} icon={<MessageCircle className="h-[18px] w-[18px]" />}>
                {t('saf.shareLocation')}
              </Button>
            </>
          ) : (
            <a href="tel:112" className="btn btn--danger btn--lg btn--block">
              <Phone className="h-[18px] w-[18px]" />
              {t('saf.callEmergency')}
            </a>
          )}
        </div>
      }
    >
      {/* Identity block — the only thing a stranger needs first */}
      <div className="rounded-[var(--r-lg)] border-2 border-[var(--danger-line)] bg-[var(--danger-soft)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="t-eyebrow !text-[var(--danger-strong)]">{elderName}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-[var(--danger-strong)]">
              {elderName}
            </div>
            <div className="mt-0.5 text-[0.95rem] font-bold text-[var(--danger-strong)] opacity-85">
              {elderAge ? `${elderAge} ${t('c.years')} · ` : ''}
              {t('saf.hasDementia')}
            </div>
          </div>
          <Tag tone="danger" icon={<ShieldAlert className="h-3 w-3" />}>
            SOS
          </Tag>
        </div>
        <p className="mt-2 text-[0.95rem] font-semibold leading-snug text-[var(--danger-strong)] opacity-90">
          {t('saf.lostBody')}
        </p>
      </div>

      {/* One-tap actions */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {hasContact ? (
          <a href={`tel:${cleanPhone}`} className="card card--pad card--interactive flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--danger)] text-white">
              <Phone className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-bold text-ink">{guardianName}</span>
              <span className="t-xs block">{guardianPhone}</span>
            </span>
          </a>
        ) : (
          <div className="card card--pad flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-ink-3">
              <Phone className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-bold text-ink">{t('saf.noContact')}</span>
              <span className="t-xs block">{t('saf.noContactBody')}</span>
            </span>
          </div>
        )}

        <a href="tel:14567" className="card card--pad card--interactive flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.95rem] font-bold text-ink">14567</span>
            <span className="t-xs block">{t('saf.elderline')}</span>
          </span>
        </a>

        <a href="tel:112" className="card card--pad card--interactive flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--surface-sunken)] text-ink-2">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.95rem] font-bold text-ink">112</span>
            <span className="t-xs block">{t('saf.sos')}</span>
          </span>
        </a>

        <button type="button" onClick={speakForHelper} className="card card--pad card--interactive flex items-center gap-3 text-left">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
            <Volume2 className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.95rem] font-bold text-ink">{t('home.hearThis')}</span>
            <span className="t-xs block">{t('saf.medicalId')}</span>
          </span>
        </button>

        <button type="button" onClick={shareLocation} className="card card--pad card--interactive flex items-center gap-3 text-left">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--info-soft)] text-[var(--info)]">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.95rem] font-bold text-ink">{t('saf.whatsappLocation')}</span>
            <span className="t-xs block">
              {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : t('c.savedOffline')}
            </span>
          </span>
        </button>
      </div>

      {/* Medical ID */}
      <div className="mt-4 grid gap-3 rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--surface-warm)] p-4 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-[var(--danger)]" />
            <span className="text-[0.95rem] font-bold text-ink">
              {t('saf.bloodGroup')}: {card.bloodGroup || t('c.notAdded')}
            </span>
          </div>
          {medicalCardService.isEmpty(card) ? (
            <p className="t-xs mt-2">{t('saf.cardEmpty')}</p>
          ) : (
            <dl className="mt-2 grid gap-2 text-[0.82rem] sm:grid-cols-2">
              <div>
                <dt className="font-bold text-ink-3">{t('saf.conditions')}</dt>
                <dd className="text-ink-2">{card.conditions.join(', ') || t('c.notAdded')}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-3">{t('saf.medicines')}</dt>
                <dd className="text-ink-2">{card.medicines.join(', ') || t('c.notAdded')}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-3">{t('saf.allergies')}</dt>
                <dd className="text-ink-2">{card.allergies.join(', ') || t('c.notAdded')}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-3">{t('saf.language')}</dt>
                <dd className="text-ink-2">{lang.toUpperCase()}</dd>
              </div>
            </dl>
          )}
        </div>
        <div className="mx-auto flex flex-col items-center gap-1.5">
          <div className="rounded-[var(--r-sm)] bg-white p-2 shadow-[var(--shadow-2)]">
            <QRCodeSvg value={qrPayload} size={112} bgColor="#FFFFFF" fgColor="#17211E" />
          </div>
          <span className="text-[0.64rem] font-bold uppercase tracking-wider text-ink-3">Scan · {lang}</span>
        </div>
      </div>
    </Sheet>
  );
};

export default SafeReturnModal;
