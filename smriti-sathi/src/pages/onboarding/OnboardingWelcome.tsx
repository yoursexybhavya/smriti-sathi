import { HeartHandshake, Languages, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card } from '../../ui';
import { useI18n } from '../../i18n';

export default function OnboardingWelcome({ onNext, onCancel }: { onNext: () => void; onCancel?: () => void }) {
  const { t } = useI18n();

  const points = [
    { icon: Sparkles, title: t('games.title'), body: t('games.subtitle') },
    { icon: HeartHandshake, title: t('mem.title'), body: t('mem.subtitle') },
    { icon: Languages, title: t('set.language'), body: t('ob.langBody') },
  ];

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h1 className="t-h1">{t('ob.welcomeTitle')}</h1>
        <p className="t-body mt-1.5">{t('ob.welcomeBody')}</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {points.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3 rounded-[var(--r-md)] border border-[var(--line-soft)] bg-[var(--surface-warm)] p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-soft)] text-[var(--brand-teal-deep)]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-bold text-ink">{title}</span>
              <span className="t-xs block leading-snug">{body}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 rounded-[var(--r-sm)] bg-[var(--success-soft)] px-3 py-2 text-[0.8rem] font-semibold text-[var(--success)]">
        <ShieldCheck className="h-4 w-4" />
        {t('c.offlineBody')}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={onNext}>
          {t('c.next')}
        </Button>
        {onCancel && (
          <Button variant="ghost" size="lg" onClick={onCancel}>
            Return to Profile Selection
          </Button>
        )}
      </div>
      <p className="t-xs">
        <button type="button" onClick={onCancel} className="font-bold text-brand hover:underline">
          Switch Profile / Login
        </button>
      </p>
    </Card>
  );
}
