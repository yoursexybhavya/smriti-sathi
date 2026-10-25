import { useEffect, useState } from 'react';
import { BrandMark } from '../ui';
import { useT } from '../i18n';

/**
 * Splash — the brand moment. Calm, quiet, no spinners, no clip-art.
 * A single lotus mark breathing once, then the app appears.
 */
export default function SplashScreen() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #12756A 0%, #0E5C50 38%, #083F38 72%, #062B27 100%)',
      }}
      role="status"
      aria-live="polite"
    >
      {/* soft aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(232,169,78,0.35), transparent 62%)' }}
      />

      <div
        className="relative flex flex-col items-center gap-6 transition-all duration-700 ease-out"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
      >
        <div className="rounded-[34px] bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm">
          <BrandMark size={96} />
        </div>

        <div>
          <h1
            className="text-[2.2rem] leading-none text-[#FBF6EE] sm:text-[2.6rem]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.03em' }}
          >
            {t('app.name')}
          </h1>
          <p className="mt-2.5 text-[0.98rem] font-medium text-[#D8E7E2]">{t('app.tagline')}</p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#9FC4BB]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E8A94E]" />
          Smart India Hackathon · SIH26003
        </div>
      </div>

      <div className="absolute bottom-7 left-0 right-0 text-center text-[0.7rem] font-semibold tracking-wide text-[#7FA79E]">
        v3.0.0
      </div>
    </div>
  );
}
