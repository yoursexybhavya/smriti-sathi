import { useCallback, useEffect, useRef, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { SafeReturnModal } from './components/SafeReturnModal';
import { SundowningCareModal } from './components/SundowningCareModal';
import { AshaTriageModal } from './components/AshaTriageModal';
import { WearableBadgeGeneratorModal } from './components/WearableBadgeGeneratorModal';

import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/auth/LoginScreen';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import PatientHomeScreen from './pages/PatientHomeScreen';
import GamesScreen from './pages/GamesScreen';
import RemindersScreen from './pages/RemindersScreen';
import ProgressScreen from './pages/ProgressScreen';
import SettingsScreen from './pages/SettingsScreen';
import MemoryBookScreen from './screens/MemoryBookScreen';
import MemoryBookViewerScreen from './screens/MemoryBookViewerScreen';
import RememberGame from './pages/games/RememberGame';
import RecogniseGame from './pages/games/RecogniseGame';
import MemoryMatchGame from './pages/games/MemoryMatchGame';
import DailyRoutineGame from './pages/games/DailyRoutineGame';
import FamilyMemoryGame from './games/family/FamilyMemoryGame';
import CaregiverHome from './pages/caregiver/CaregiverHome';
import SafetyDashboard from './pages/caregiver/SafetyDashboard';
import DemoHubScreen from './pages/demo/DemoHubScreen';
import DiagnosticsScreen from './pages/demo/DiagnosticsScreen';

import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './i18n';
import { UserRole } from './models/Role';
import { notificationService } from './services/NotificationService';
import { reminderService } from './services/ReminderService';

/** Tabs that own the bottom dock. */
const patientNavTabs = ['home', 'games', 'reminders', 'progress', 'settings'];
const caregiverNavTabs = ['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings'];

const PATIENT_SCREENS = [
  ...patientNavTabs,
  'remember-game',
  'recognise-game',
  'memory-match',
  'daily-routine',
  'family-memory-game',
  'memory-book',
  'memory-book-viewer',
];

const CAREGIVER_SCREENS = [
  ...caregiverNavTabs,
  'safety-dashboard',
  'demo',
  'diagnostics',
  'sync-tests',
  'security-tests',
  'adaptive-tests',
  'database-tests',
  'reminder-tests',
  'voice-language-tests',
];

function readInitialTab(): string {
  if (typeof window === 'undefined') return 'home';
  const params = new URLSearchParams(window.location.search);
  return params.get('tab') || params.get('screen') || 'home';
}

function AppContent() {
  const { state } = useApp();
  const { isAuthenticated, role, logout, userId } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(readInitialTab);
  const [history, setHistory] = useState<string[]>([readInitialTab()]);
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('nosplash') === 'true') return false;
    try {
      return sessionStorage.getItem('smriti_splash_shown') !== 'true';
    } catch {
      return true;
    }
  });
  const [isOnline, setIsOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  const [modal, setModal] = useState<null | 'safe-return' | 'sundowning' | 'asha' | 'badge'>(null);

  /* ── splash ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash) {
      try {
        sessionStorage.setItem('smriti_splash_shown', 'true');
      } catch {
        /* ignore */
      }
    }
  }, [showSplash]);

  /* ── connectivity ───────────────────────────────────────────────────── */
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  /* ── appearance → <html> attributes ─────────────────────────────────── */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.accessibility?.theme === 'dark' ? 'dark' : 'light';
    const scale =
      state.accessibility?.textSize === 'extra-large'
        ? 'xlarge'
        : state.accessibility?.textSize === 'large'
          ? 'large'
          : 'comfort';
    root.dataset.scale = scale;
    root.dataset.contrast = state.accessibility?.highContrast ? 'high' : 'normal';
    root.style.colorScheme = state.accessibility?.theme === 'dark' ? 'dark' : 'light';
  }, [state.accessibility?.theme, state.accessibility?.textSize, state.accessibility?.highContrast]);

  /* ── global modal events ────────────────────────────────────────────── */
  useEffect(() => {
    const handlers: Record<string, () => void> = {
      'open-safe-return': () => setModal('safe-return'),
      'open-sundowning': () => setModal('sundowning'),
      'open-asha-triage': () => setModal('asha'),
      'open-wearable-badge': () => setModal('badge'),
    };
    Object.entries(handlers).forEach(([evt, fn]) => window.addEventListener(evt, fn));
    return () => Object.entries(handlers).forEach(([evt, fn]) => window.removeEventListener(evt, fn));
  }, []);

  /* ── native services ────────────────────────────────────────────────── */
  useEffect(() => {
    notificationService.initialize();
  }, []);

  useEffect(() => {
    if (state.currentPatient?.id) {
      const pId = parseInt(state.currentPatient.id, 10);
      if (!isNaN(pId)) reminderService.initialize(pId, state.currentPatient.name);
    }
  }, [state.currentPatient?.id, state.currentPatient?.name]);

  /* ── navigation ─────────────────────────────────────────────────────── */
  const navigate = useCallback((screen: string) => {
    setHistory((prev) => (prev[prev.length - 1] === screen ? prev : [...prev, screen]));
    setActiveTab(screen);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const rootTab = role === UserRole.CAREGIVER ? 'caregiver-home' : 'home';

  const goBack = useCallback(() => {
    let handled = false;
    setHistory((prev) => {
      if (prev.length > 1) {
        const next = prev.slice(0, -1);
        handled = true;
        setActiveTab(next[next.length - 1]);
        return next;
      }
      return prev;
    });
    if (!handled) {
      setHistory([rootTab]);
      setActiveTab(rootTab);
    }
    return true;
  }, [rootTab]);

  const goBackRef = useRef(goBack);
  useEffect(() => {
    goBackRef.current = goBack;
  });

  /* Capacitor hardware back button */
  useEffect(() => {
    let listener: { remove?: () => void } | null = null;
    (async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        listener = await CapApp.addListener('backButton', () => {
          const atRoot = activeTab === rootTab || activeTab === 'home' || activeTab === 'caregiver-home';
          if (!atRoot) {
            goBackRef.current();
          } else {
            CapApp.exitApp();
          }
        });
      } catch {
        /* web: no native shell */
      }
    })();
    return () => listener?.remove?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, rootTab]);

  /* Keep the active tab valid for the current role */
  useEffect(() => {
    if (!isAuthenticated) return;
    const valid = role === UserRole.CAREGIVER ? CAREGIVER_SCREENS : PATIENT_SCREENS;
    if (!valid.includes(activeTab)) {
      setActiveTab(rootTab);
      setHistory([rootTab]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, role]);

  /* ── gates ──────────────────────────────────────────────────────────── */
  if (showSplash || state.isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          const next = role === UserRole.CAREGIVER ? 'caregiver-home' : 'home';
          setHistory([next]);
          setActiveTab(next);
        }}
      />
    );
  }

  if (!state.onboardingComplete && role === UserRole.PATIENT) {
    return <OnboardingFlow onComplete={() => navigate('home')} onCancel={logout} />;
  }

  const persona = role === UserRole.CAREGIVER ? (userId === 'asha_worker' ? 'clinician' : 'caregiver') : 'elder';
  const showDock =
    role === UserRole.CAREGIVER ? caregiverNavTabs.includes(activeTab) : patientNavTabs.includes(activeTab);

  const shared = { onNavigate: navigate, onBack: goBack, isOnline, persona: persona as 'elder' | 'caregiver' | 'clinician', showDock };

  /* ── routes ─────────────────────────────────────────────────────────── */
  const renderScreen = () => {
    if (role === UserRole.PATIENT) {
      switch (activeTab) {
        case 'home':
          return <PatientHomeScreen {...shared} />;
        case 'games':
          return <GamesScreen {...shared} />;
        case 'reminders':
          return <RemindersScreen {...shared} />;
        case 'progress':
          return <ProgressScreen {...shared} />;
        case 'settings':
          return <SettingsScreen {...shared} />;
        case 'memory-book':
          return <MemoryBookScreen {...shared} />;
        case 'memory-book-viewer':
          return <MemoryBookViewerScreen {...shared} />;
        case 'remember-game':
          return <RememberGame onBack={goBack} />;
        case 'recognise-game':
          return <RecogniseGame onBack={goBack} />;
        case 'memory-match':
          return <MemoryMatchGame onBack={goBack} />;
        case 'daily-routine':
          return <DailyRoutineGame onBack={goBack} />;
        case 'family-memory-game':
          return <FamilyMemoryGame onBack={goBack} />;
        default:
          return <PatientHomeScreen {...shared} />;
      }
    }

    switch (activeTab) {
      case 'caregiver-home':
        return <CaregiverHome {...shared} />;
      case 'caregiver-reminders':
        return <RemindersScreen {...shared} />;
      case 'caregiver-memory':
        return <MemoryBookScreen {...shared} />;
      case 'caregiver-settings':
        return <SettingsScreen {...shared} />;
      case 'safety-dashboard':
        return <SafetyDashboard {...shared} />;
      case 'demo':
        return <DemoHubScreen {...shared} />;
      case 'diagnostics':
      case 'sync-tests':
      case 'security-tests':
      case 'adaptive-tests':
      case 'database-tests':
      case 'reminder-tests':
      case 'voice-language-tests':
        return <DiagnosticsScreen onBack={goBack} onNavigate={navigate} />;
      default:
        return <CaregiverHome {...shared} />;
    }
  };

  return (
    <>
      {renderScreen()}

      <SafeReturnModal isOpen={modal === 'safe-return'} onClose={() => setModal(null)} />
      <SundowningCareModal isOpen={modal === 'sundowning'} onClose={() => setModal(null)} />
      <AshaTriageModal isOpen={modal === 'asha'} onClose={() => setModal(null)} />
      <WearableBadgeGeneratorModal isOpen={modal === 'badge'} onClose={() => setModal(null)} />

      {/* Public SOS entry — visible to anyone, including on the login screen */}
      {showDock && role === UserRole.PATIENT && null}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
