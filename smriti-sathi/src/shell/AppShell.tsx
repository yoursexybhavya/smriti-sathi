import { useState, type ReactNode } from 'react';
import { Check, ChevronLeft, LifeBuoy, Moon, Sun, Globe } from 'lucide-react';
import { BrandLockup, BrandMark, IconButton } from '../ui';
import { useI18n } from '../i18n';
import { tabsFor, type Persona } from './nav';

export interface AppShellProps {
  persona: Persona;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onBack?: () => void;
  /** Big page title under the bar (mobile) / at the top of content (desktop). */
  title?: ReactNode;
  /** Optional shorter title for the phone bar, where space is tight. */
  shortTitle?: ReactNode;
  subtitle?: ReactNode;
  /** Right-hand cluster in the top bar. */
  actions?: ReactNode;
  /** Extra content pinned under the title (tabs, filters…). */
  belowHeader?: ReactNode;
  /** Hide the dock for immersive screens (game play, onboarding). */
  hideDock?: boolean;
  /** Hide chrome entirely (full-bleed game play). */
  bare?: boolean;
  onOpenSos?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  identity?: { name: string; sub?: string };
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * One shell for every surface. Phones get a translucent sticky bar + bottom
 * dock; desktops get a real sidebar. Content always ends above the dock —
 * the old app let cards scroll underneath it.
 */
export function AppShell({
  persona,
  activeTab,
  onNavigate,
  onBack,
  title,
  shortTitle,
  subtitle,
  actions,
  belowHeader,
  hideDock,
  bare,
  onOpenSos,
  theme,
  onToggleTheme,
  identity,
  footer,
  children,
}: AppShellProps) {
  const { t, lang, languages, setLanguage } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const tabs = tabsFor(persona);
  const showDock = !hideDock && !bare;
  const isDark = theme === 'dark';

  return (
    <div className={onBack || persona !== 'elder' ? 'shell shell--with-sidebar' : 'shell'}>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      {!bare && (
        <aside className="sidebar no-print" aria-label={t('app.name')}>
          <BrandLockup size={40} showTagline tagline={t('app.shortTagline')} name={t('app.name')} />

          <nav className="sidebar-nav" aria-label="Primary">
            {tabs.map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={activeTab === id ? 'page' : undefined}
                className="sidebar-link"
              >
                <Icon />
                <span className="truncate">{t(labelKey)}</span>
              </button>
            ))}
          </nav>

          {identity && (
            <div className="card card--pad card--warm">
              <div className="t-eyebrow">{t('cg.elderActivity')}</div>
              <div className="mt-1 truncate text-[0.95rem] font-bold text-ink">{identity.name}</div>
              {identity.sub && <div className="t-xs mt-0.5 truncate">{identity.sub}</div>}
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2">
            {onOpenSos && (
              <button type="button" className="sos-chip w-full justify-center" onClick={onOpenSos}>
                <LifeBuoy />
                {t('saf.safeReturn')}
              </button>
            )}
            {footer}
            <div className="t-xs pt-1 text-ink-4">
              {t('app.name')} · v3.1.0
            </div>
          </div>
        </aside>
      )}

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className="shell-main">
        {!bare && (
          <header className="shell-header no-print">
            {onBack ? (
              <IconButton label={t('c.back')} variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft />
              </IconButton>
            ) : (
              <span className="lg:hidden">
                <BrandMark size={30} />
              </span>
            )}

            <div className="min-w-0 flex-1">
              {title ? (
                <>
                  <div className="truncate text-[1.02rem] font-bold leading-tight tracking-[-0.01em] text-ink">
                    {shortTitle ?? title}
                  </div>
                  {subtitle && (
                    <div className="line-clamp-2 text-[0.74rem] leading-tight text-ink-3 sm:line-clamp-1">
                      {subtitle}
                    </div>
                  )}
                </>
              ) : (
                <BrandLockup size={30} name={t('app.name')} />
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {actions}
              <div className="relative">
                <IconButton
                  label={t('c.language')}
                  variant="ghost"
                  size="sm"
                  onClick={() => setLangOpen((v) => !v)}
                  aria-expanded={langOpen}
                >
                  <span className="flex items-center gap-1 text-[0.7rem] font-extrabold uppercase">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{lang}</span>
                  </span>
                </IconButton>
                {langOpen && (
                  <>
                    <button
                      type="button"
                      aria-label={t('c.close')}
                      tabIndex={-1}
                      className="fixed inset-0 z-40 cursor-default bg-transparent"
                      onClick={() => setLangOpen(false)}
                    />
                    <div
                      role="menu"
                      aria-label={t('c.language')}
                      className="fixed inset-x-3 top-[68px] z-50 overflow-hidden rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface)] p-1.5 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[13.5rem]"
                      style={{ boxShadow: 'var(--shadow-3)' }}
                    >
                      <div className="t-eyebrow px-2 py-1.5">{t('c.language')}</div>
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          role="menuitemradio"
                          aria-checked={l.code === lang}
                          onClick={() => {
                            setLanguage(l.code);
                            setLangOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-[var(--r-xs)] px-2 py-2 text-left text-[0.9rem] font-semibold text-ink hover:bg-[var(--surface-sunken)]"
                        >
                          <span className="truncate">
                            {l.native}
                            <span className="ml-1.5 text-[0.72rem] font-medium text-ink-4">{l.label}</span>
                          </span>
                          {l.code === lang && <Check className="h-4 w-4 shrink-0 text-[var(--brand-teal)]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {onToggleTheme && (
                <span className="hidden sm:inline-flex">
                  <IconButton label={t('c.theme')} variant="ghost" size="sm" onClick={onToggleTheme}>
                    {isDark ? <Sun /> : <Moon />}
                  </IconButton>
                </span>
              )}
              {onOpenSos && (
                <button
                  type="button"
                  onClick={onOpenSos}
                  className="sos-chip !min-h-[42px] !px-3"
                  aria-label={t('saf.safeReturn')}
                >
                  <LifeBuoy />
                  <span>SOS</span>
                </button>
              )}
            </div>
          </header>
        )}

        <div className={`shell-content ${showDock ? 'shell-content--dock' : ''}`}>
          {!bare && (title || subtitle) && (
            <div className="mb-5 hidden lg:flex lg:items-end lg:justify-between lg:gap-4">
              <div className="min-w-0">
                {title && <h1 className="t-h1 text-ink">{title}</h1>}
                {subtitle && <p className="t-body-lg mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
          )}
          {belowHeader}
          {children}
        </div>

        {/* ── Phone dock ────────────────────────────────────────────────── */}
        {showDock && (
          <nav className="shell-bottomnav no-print" aria-label={t('nav.home')}>
            <div className="bottomnav-inner">
              {tabs.map(({ id, labelKey, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className="navitem"
                >
                  <Icon />
                  <span className="truncate">{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
