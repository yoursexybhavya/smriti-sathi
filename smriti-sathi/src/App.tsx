import { useState, useEffect, useRef } from 'react';
import BottomNav from './components/BottomNav';
import ScreenContainer from './components/ScreenContainer';
import SyncStatusIndicator from './components/SyncStatusIndicator';
import RoleGuard from './components/RoleGuard';
import ErrorBoundary from './components/ErrorBoundary';
import GamesScreen from './pages/GamesScreen';
import RemindersScreen from './pages/RemindersScreen';
import ProgressScreen from './pages/ProgressScreen';
import CaregiverDashboard from './pages/CaregiverDashboard';
import SettingsScreen from './pages/SettingsScreen';
import SplashScreen from './pages/SplashScreen';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import PatientHomeScreen from './pages/PatientHomeScreen';
import RememberGame from './pages/games/RememberGame';
import RecogniseGame from './pages/games/RecogniseGame';
import MemoryMatchGame from './pages/games/MemoryMatchGame';
import DailyRoutineGame from './pages/games/DailyRoutineGame';
import AdaptiveEngineTestScreen from './pages/settings/AdaptiveEngineTestScreen';
import DatabaseTestScreen from './pages/DatabaseTestScreen';
import ReminderTestScreen from './pages/settings/ReminderTestScreen';
import VoiceLanguageTestScreen from './pages/settings/VoiceLanguageTestScreen';
import SyncTestScreen from './pages/settings/SyncTestScreen';
import SecurityTestScreen from './pages/settings/SecurityTestScreen';
import MemoryBookScreen from './screens/MemoryBookScreen';
import MemoryBookViewerScreen from './screens/MemoryBookViewerScreen';
import FamilyMemoryGame from './games/family/FamilyMemoryGame';
import LoginScreen from './pages/auth/LoginScreen';
import CaregiverHome from './pages/caregiver/CaregiverHome';
import SafetyDashboard from './pages/caregiver/SafetyDashboard';
import { SafeReturnModal } from './components/SafeReturnModal';
import { SundowningCareModal } from './components/SundowningCareModal';
import { AshaTriageModal } from './components/AshaTriageModal';
import { WearableBadgeGeneratorModal } from './components/WearableBadgeGeneratorModal';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageProvider as SecondaryLanguageProvider } from './contexts/LanguageContext';
import { UserRole } from './models/Role';
import { APP } from './core/constants/app';
import { UpdateNotifier } from './components/UpdateChecker';
import { notificationService } from './services/NotificationService';
import { reminderService } from './services/ReminderService';

function AppContent() {
  const { state } = useApp();
  const { isAuthenticated, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('screen');
      if (tab) return tab;
    }
    return 'home';
  });
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);
  const [showSafeReturn, setShowSafeReturn] = useState(false);
  const [showSundowning, setShowSundowning] = useState(false);
  const [showAshaTriage, setShowAshaTriage] = useState(false);
  const [showWearableBadge, setShowWearableBadge] = useState(false);

  useEffect(() => {
    const handleOpenSafeReturn = () => setShowSafeReturn(true);
    const handleOpenSundowning = () => setShowSundowning(true);
    const handleOpenAshaTriage = () => setShowAshaTriage(true);
    const handleOpenWearableBadge = () => setShowWearableBadge(true);

    window.addEventListener('open-safe-return', handleOpenSafeReturn);
    window.addEventListener('open-sundowning', handleOpenSundowning);
    window.addEventListener('open-asha-triage', handleOpenAshaTriage);
    window.addEventListener('open-wearable-badge', handleOpenWearableBadge);

    return () => {
      window.removeEventListener('open-safe-return', handleOpenSafeReturn);
      window.removeEventListener('open-sundowning', handleOpenSundowning);
      window.removeEventListener('open-asha-triage', handleOpenAshaTriage);
      window.removeEventListener('open-wearable-badge', handleOpenWearableBadge);
    };
  }, []);
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('nosplash') === 'true' || sessionStorage.getItem('smriti_splash_shown')) {
        return false;
      }
    }
    return true;
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        try { sessionStorage.setItem('smriti_splash_shown', 'true'); } catch {}
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme class to document.body and html
  useEffect(() => {
    const isDark = state.accessibility?.theme === 'dark';
    const rootEl = document.documentElement;
    const bodyEl = document.body;

    if (isDark) {
      rootEl.classList.add('dark', 'theme-dark');
      rootEl.classList.remove('theme-light');
      bodyEl.classList.add('dark', 'theme-dark');
      bodyEl.classList.remove('theme-light');
      rootEl.style.colorScheme = 'dark';
    } else {
      rootEl.classList.add('theme-light');
      rootEl.classList.remove('dark', 'theme-dark');
      bodyEl.classList.add('theme-light');
      bodyEl.classList.remove('dark', 'theme-dark');
      rootEl.style.colorScheme = 'light';
    }
  }, [state.accessibility?.theme]);

  useEffect(() => {
    if (state.accessibility) {
      if (state.accessibility.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      
      document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large');
      document.body.classList.add(`text-size-${state.accessibility.textSize}`);
    }
  }, [state.accessibility]);

  // Navigate forward and track history
  const handleNavigate = (screen: string) => {
    setNavigationHistory(prev => {
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
    setActiveTab(screen);
  };

  // Navigate backward
  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setActiveTab(prevScreen);
      return true;
    }
    if (activeTab !== 'home' && activeTab !== 'caregiver-home') {
      const defaultRoot = role === UserRole.CAREGIVER ? 'caregiver-home' : 'home';
      setNavigationHistory([defaultRoot]);
      setActiveTab(defaultRoot);
      return true;
    }
    return false;
  };

  const handleGoBackRef = useRef(handleGoBack);
  useEffect(() => {
    handleGoBackRef.current = handleGoBack;
  });

  // Hardware and Gesture Back Button Listener (Capacitor Android) - registered once on mount
  useEffect(() => {
    let backListener: any = null;

    const initBackHandler = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        backListener = await CapApp.addListener('backButton', () => {
          const handled = handleGoBackRef.current();
          if (!handled) {
            // On root screen: exit/minimize app cleanly, never dump the elder into login
            CapApp.exitApp();
          }
        });
      } catch (err) {
        console.warn('Capacitor backButton listener unavailable', err);
      }
    };

    initBackHandler();

    return () => {
      if (backListener && backListener.remove) {
        backListener.remove();
      }
    };
  }, []);

  // Initialize native care alarms and channels on mount
  useEffect(() => {
    notificationService.initialize();
  }, []);

  // Initialize reminder schedule when patient profile is active
  useEffect(() => {
    if (state.currentPatient?.id) {
      const pId = parseInt(state.currentPatient.id, 10);
      if (!isNaN(pId)) {
        reminderService.initialize(pId, state.currentPatient.name);
      }
    }
  }, [state.currentPatient?.id, state.currentPatient?.name]);

  // Set initial tab based on role after login only if current tab is invalid for role
  useEffect(() => {
    if (isAuthenticated) {
      const isCaregiver = role === UserRole.CAREGIVER;
      const validPatientTabs = ['home', 'games', 'remember-game', 'recognise-game', 'memory-match', 'daily-routine', 'reminders', 'progress', 'settings', 'memory-book', 'memory-book-viewer'];
      const validCaregiverTabs = ['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings', 'safety-dashboard', 'sync-tests', 'security-tests', 'adaptive-tests', 'database-tests', 'reminder-tests', 'voice-language-tests'];

      const currentValid = isCaregiver ? validCaregiverTabs.includes(activeTab) : validPatientTabs.includes(activeTab);
      if (!currentValid) {
        const rootScreen = isCaregiver ? 'caregiver-home' : 'home';
        setNavigationHistory([rootScreen]);
        setActiveTab(rootScreen);
      }
    }
  }, [isAuthenticated, role]);

  if (showSplash || state.isLoading) {
    return <SplashScreen appName={APP.name} tagline={APP.tagline} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <LoginScreen 
          onLoginSuccess={() => {
            sessionStorage.setItem('smriti_in_session_login', 'true');
            const rootScreen = role === UserRole.CAREGIVER ? 'caregiver-home' : 'home';
            setNavigationHistory([rootScreen]);
            setActiveTab(rootScreen);
          }}
        />
      </ScreenContainer>
    );
  }

  // Show onboarding if not complete (patient only)
  if (!state.onboardingComplete && role === UserRole.PATIENT) {
    return (
      <OnboardingFlow 
        onComplete={() => handleNavigate('home')} 
        onCancel={logout}
      />
    );
  }

  // Role-based routing
  const renderScreen = () => {
    // PATIENT ROUTES
    if (role === UserRole.PATIENT) {
      switch (activeTab) {
        case 'home':
          return <PatientHomeScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'games':
          return <GamesScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'remember-game':
          return <RememberGame onBack={handleGoBack} />;
        case 'recognise-game':
          return <RecogniseGame onBack={handleGoBack} />;
        case 'memory-match':
          return <MemoryMatchGame onBack={handleGoBack} />;
        case 'daily-routine':
          return <DailyRoutineGame onBack={handleGoBack} />;
        case 'reminders':
          return <RemindersScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'progress':
          return <ProgressScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'settings':
          return <SettingsScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'memory-book':
          return <MemoryBookScreen onBack={handleGoBack} onNavigate={handleNavigate} />;
        case 'memory-book-viewer':
          return <MemoryBookViewerScreen onBack={handleGoBack} onNavigate={handleNavigate} />;
        case 'family-memory-game':
          return <FamilyMemoryGame onBack={handleGoBack} />;
        default:
          return <PatientHomeScreen onNavigate={handleNavigate} isOnline={isOnline} />;
      }
    }

    // CAREGIVER ROUTES
    if (role === UserRole.CAREGIVER) {
      switch (activeTab) {
        case 'caregiver-home':
          return <CaregiverHome onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'caregiver-reminders':
          return <RemindersScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'caregiver-memory':
          return <MemoryBookScreen onBack={handleGoBack} onNavigate={handleNavigate} />;
        case 'caregiver-settings':
          return <SettingsScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'safety-dashboard':
          return <SafetyDashboard onBack={handleGoBack} />;
        case 'sync-tests':
          return <SyncTestScreen onBack={handleGoBack} />;
        case 'security-tests':
          return <SecurityTestScreen onBack={handleGoBack} />;
        case 'adaptive-tests':
          return <AdaptiveEngineTestScreen onBack={handleGoBack} />;
        case 'database-tests':
          return <DatabaseTestScreen />;
        case 'reminder-tests':
          return <ReminderTestScreen onNavigate={handleNavigate} />;
        case 'voice-language-tests':
          return <VoiceLanguageTestScreen onBack={handleGoBack} />;
        default:
          return <CaregiverHome onNavigate={handleNavigate} isOnline={isOnline} />;
      }
    }

    return null;
  };

  // Bottom nav visibility based on role
  const patientNavTabs = ['home', 'games', 'reminders', 'progress', 'settings'];
  const caregiverNavTabs = ['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings'];
  
  const currentNavTabs = role === UserRole.PATIENT ? patientNavTabs : caregiverNavTabs;
  const showBottomNav = currentNavTabs.includes(activeTab);

  return (
    <ScreenContainer>
      <div className={`relative min-h-screen w-full flex-1 flex flex-col ${showBottomNav ? 'pb-24 sm:pb-28' : ''}`}>
        <UpdateNotifier />
        {renderScreen()}

        {/* Floating Safe Return Emergency Button for Elders & Public */}
        {isAuthenticated && role === UserRole.PATIENT && activeTab !== 'remember-game' && activeTab !== 'recognise-game' && activeTab !== 'memory-match' && activeTab !== 'daily-routine' && (
          <div className="fixed bottom-24 right-4 sm:right-6 z-40">
            <button
              type="button"
              onClick={() => setShowSafeReturn(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full font-bold text-xs sm:text-sm shadow-xl shadow-red-950/30 border-2 border-red-300/40 active:scale-95 transition-all cursor-pointer"
              aria-label="Safe Return Emergency ID Card"
              title="Safe Return Emergency ID"
            >
              <span className="text-sm sm:text-base animate-pulse">🆘</span>
              <span className="tracking-tight hidden xs:inline">Safe Return</span>
            </button>
          </div>
        )}

        {showBottomNav && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={handleNavigate}
            role={role}
          />
        )}
      </div>

      {/* Global Clinical & Rescue Modals */}
      <SafeReturnModal
        isOpen={showSafeReturn}
        onClose={() => setShowSafeReturn(false)}
      />
      <SundowningCareModal
        isOpen={showSundowning}
        onClose={() => setShowSundowning(false)}
      />
      <AshaTriageModal
        isOpen={showAshaTriage}
        onClose={() => setShowAshaTriage(false)}
      />
      <WearableBadgeGeneratorModal
        isOpen={showWearableBadge}
        onClose={() => setShowWearableBadge(false)}
      />
    </ScreenContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SecondaryLanguageProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </SecondaryLanguageProvider>
    </ErrorBoundary>
  );
}
