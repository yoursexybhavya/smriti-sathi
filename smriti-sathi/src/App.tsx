import { useState, useEffect } from 'react';
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
import AdaptiveEngineTestScreen from './pages/settings/AdaptiveEngineTestScreen';
import DatabaseTestScreen from './pages/DatabaseTestScreen';
import ReminderTestScreen from './pages/settings/ReminderTestScreen';
import VoiceLanguageTestScreen from './pages/settings/VoiceLanguageTestScreen';
import SyncTestScreen from './pages/settings/SyncTestScreen';
import SecurityTestScreen from './pages/settings/SecurityTestScreen';
import MemoryBookScreen from './screens/MemoryBookScreen';
import MemoryBookViewerScreen from './screens/MemoryBookViewerScreen';
import LoginScreen from './pages/auth/LoginScreen';
import CaregiverHome from './pages/caregiver/CaregiverHome';
import SafetyDashboard from './pages/caregiver/SafetyDashboard';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageProvider as SecondaryLanguageProvider } from './contexts/LanguageContext';
import { UserRole } from './models/Role';
import { APP } from './core/constants/app';
import { UpdateNotifier } from './components/UpdateChecker';

function AppContent() {
  const { state } = useApp();
  const { isAuthenticated, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);
  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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
      rootEl.classList.add('theme-dark');
      rootEl.classList.remove('theme-light');
      bodyEl.classList.add('theme-dark');
      bodyEl.classList.remove('theme-light');
    } else {
      rootEl.classList.add('theme-light');
      rootEl.classList.remove('theme-dark');
      bodyEl.classList.add('theme-light');
      bodyEl.classList.remove('theme-dark');
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
    setNavigationHistory(prev => [...prev, screen]);
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

  // Hardware and Gesture Back Button Listener (Capacitor Android)
  useEffect(() => {
    let backListener: any = null;

    const initBackHandler = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        backListener = await CapApp.addListener('backButton', () => {
          if (!state.onboardingComplete && role === UserRole.PATIENT) {
            logout();
            return;
          }
          const handled = handleGoBack();
          if (!handled) {
            if (isAuthenticated) {
              logout();
            } else {
              CapApp.exitApp();
            }
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
  }, [navigationHistory, activeTab, isAuthenticated, role, logout, state.onboardingComplete]);

  // Set initial tab based on role after login
  useEffect(() => {
    if (isAuthenticated) {
      const rootScreen = role === UserRole.CAREGIVER ? 'caregiver-home' : 'home';
      setNavigationHistory([rootScreen]);
      setActiveTab(rootScreen);
    }
  }, [isAuthenticated, role]);

  if (showSplash) {
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
      <ScreenContainer>
        <OnboardingFlow 
          onComplete={() => handleNavigate('home')} 
          onCancel={logout}
        />
      </ScreenContainer>
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
        case 'reminders':
          return <RemindersScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'progress':
          return <ProgressScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'settings':
          return <SettingsScreen onNavigate={handleNavigate} isOnline={isOnline} />;
        case 'memory-book':
          return <MemoryBookScreen onBack={handleGoBack} onNavigate={handleNavigate} />;
        case 'memory-book-viewer':
          return <MemoryBookViewerScreen onBack={handleGoBack} />;
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
  const patientNavTabs = ['home', 'games', 'reminders', 'progress'];
  const caregiverNavTabs = ['caregiver-home', 'caregiver-reminders', 'caregiver-memory', 'caregiver-settings'];
  
  const currentNavTabs = role === UserRole.PATIENT ? patientNavTabs : caregiverNavTabs;
  const showBottomNav = currentNavTabs.includes(activeTab);

  return (
    <ScreenContainer>
      <div className="relative">
        <UpdateNotifier />
        {/* Sync Status Indicator - always visible, unobtrusive */}
        <div className="fixed top-2 right-2 z-50">
          <SyncStatusIndicator compact showDetails={false} />
        </div>
        {renderScreen()}
        {showBottomNav && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            role={role}
          />
        )}
      </div>
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
