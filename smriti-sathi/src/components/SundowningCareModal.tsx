import { useEffect, useRef, useState } from 'react';
import { Moon, Play, Square, Volume2, Wind } from 'lucide-react';
import { Button, Sheet, Tag } from '../ui';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { useVoice } from '../hooks/useVoice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'in' | 'hold' | 'out';

const PHASE_MS: Record<Phase, number> = { in: 4000, hold: 7000, out: 8000 };

/**
 * A soft two-note chime marking each breathing phase, so the elder can keep
 * their eyes closed. Built with the Web Audio API at a low volume — never a
 * notification "bleep", never startling. Silently does nothing where audio is
 * unavailable.
 */
function playChime(rising: boolean) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const tones = rising ? [392, 523.25] : [523.25, 392];

    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.22;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.5);
    });

    window.setTimeout(() => ctx.close().catch(() => undefined), 2200);
  } catch {
    /* audio is a nicety, never a requirement */
  }
}

/**
 * Sundowning support: a slow 4-7-8 breathing guide the elder can follow
 * without reading, plus a familiar voice message.
 */
export const SundowningCareModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { t, lang } = useI18n();
  const { speak, isSpeaking } = useVoice();

  const elderName = state.currentPatient?.name ?? t('auth.elderName');
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('in');
  const [cycles, setCycles] = useState(0);
  const timer = useRef<number | null>(null);
  const [chime, setChime] = useState(true);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setTimeout(() => {
      if (chime) playChime(phase === 'in');
      setPhase((p) => {
        if (p === 'in') return 'hold';
        if (p === 'hold') return 'out';
        setCycles((c) => c + 1);
        return 'in';
      });
    }, PHASE_MS[phase]);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [running, phase, chime]);

  useEffect(() => {
    if (!isOpen) {
      setRunning(false);
      setPhase('in');
      setCycles(0);
    }
  }, [isOpen]);

  const label = phase === 'in' ? t('saf.breatheIn') : phase === 'hold' ? t('saf.hold') : t('saf.breatheOut');
  const scale = phase === 'in' ? 1 : phase === 'hold' ? 1 : 0.62;

  const familyMessage = `It is ${elderName}. You are safe at home. I am with you. Let us breathe slowly together.`;

  return (
    <Sheet open={isOpen} onClose={onClose} eyebrow={t('saf.sundowning')} title={t('home.eveningCalm')}>
      <div className="flex flex-col items-center text-center">
        <Tag tone="saffron" icon={<Moon className="h-3 w-3" />}>
          {t('saf.sundowning')}
        </Tag>

        <p className="t-body mt-3 max-w-[36ch]">{t('saf.breatheBody')}</p>

        {/* Breathing orb */}
        <div className="relative mt-6 grid h-[220px] w-[220px] place-items-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, var(--brand-teal-soft), transparent 70%)' }}
          />
          <span
            className="absolute rounded-full"
            style={{
              width: 176,
              height: 176,
              background: 'linear-gradient(160deg, var(--brand-teal-bright), var(--brand-teal))',
              transform: `scale(${running ? scale : 0.8})`,
              transition: `transform ${PHASE_MS[phase]}ms cubic-bezier(0.37, 0, 0.63, 1)`,
              boxShadow: '0 18px 44px -18px rgba(14,92,80,0.55)',
            }}
          />
          <div className="relative z-10">
            <div className="text-[1.35rem] font-extrabold text-white drop-shadow-sm">{running ? label : t('saf.breatheIn')}</div>
            <div className="mt-0.5 text-[0.75rem] font-bold uppercase tracking-wider text-white/75">
              {cycles} / 4
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {running ? (
            <Button variant="secondary" size="lg" onClick={() => setRunning(false)} icon={<Square className="h-[18px] w-[18px]" />}>
              {t('c.stop')}
            </Button>
          ) : (
            <Button size="lg" onClick={() => setRunning(true)} icon={<Play className="h-[18px] w-[18px]" />}>
              {t('saf.breatheIn')}
            </Button>
          )}
          <Button
            variant="soft"
            size="lg"
            loading={isSpeaking}
            onClick={() => speak(familyMessage, lang)}
            icon={<Volume2 className="h-[18px] w-[18px]" />}
          >
            {t('saf.familyVoice')}
          </Button>
          <Button
            variant={chime ? 'soft' : 'ghost'}
            size="lg"
            onClick={() => setChime((c) => !c)}
            aria-pressed={chime}
            icon={chime ? <Volume2 className="h-[18px] w-[18px]" /> : <Square className="h-[18px] w-[18px]" />}
          >
            {chime ? t('saf.chimeOn') : t('saf.chimeOff')}
          </Button>
        </div>

        {cycles >= 4 && (
          <Button className="mt-4" block size="lg" onClick={onClose} icon={<Wind className="h-[18px] w-[18px]" />}>
            {t('saf.iAmCalm')}
          </Button>
        )}
      </div>
    </Sheet>
  );
};

export default SundowningCareModal;
