import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Layers, TrendingUp, Bell, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function BottomNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', label: t.home, icon: Sun },
    { path: '/games', label: t.games, icon: Layers },
    { path: '/caregiver', label: t.myBrain, icon: TrendingUp },
    { path: '/reminders', label: t.reminders, icon: Bell },
    { path: '/settings', label: t.settings, icon: User },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(10, 20, 32, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1A2B40',
        padding: '8px 12px calc(8px + env(safe-area-inset-bottom)) 12px',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: 'var(--max-width)',
          width: '100%',
        }}
      >
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                minWidth: '60px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                color: isActive ? '#FF7247' : '#647B99',
                transition: 'all 0.15s ease',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.2px',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
