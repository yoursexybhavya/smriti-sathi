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
import DemoSetupScreen from './pages/DemoSetupScreen';
import CaregiverHome from './pages/caregiver/CaregiverHome';
import SafetyDashboard from './pages/caregiver/SafetyDashboard';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserRole } from './models/Role';
import { APP } from './core/constants/app';

function AppContent() {
  const { state } = useApp();
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [showDemoSetup, setShowDemoSetup] = useState(false);
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

  // Set initial tab based on role after login
  useEffect(() => {
    if (isAuthenticated) {
      if (role === UserRole.CAREGIVER) {
        setActiveTab('caregiver-home');
      } else {
        setActiveTab('home');
      }
    }
  }, [isAuthenticated, role]);

  if (showSplash) {
    return <SplashScreen appName={APP.name} tagline={APP.tagline} />;
  }

  // Show demo setup if requested
  if (showDemoSetup) {
    return (
      <ScreenContainer>
        <DemoSetupScreen onComplete={() => {
          setShowDemoSetup(false);
          if (role === UserRole.CAREGIVER) {
            setActiveTab('caregiver-home');
          } else {
            setActiveTab('home');
          }
        }} />
      </ScreenContainer>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <LoginScreen 
          onLoginSuccess={() => {
            if (role === UserRole.CAREGIVER) {
              setActiveTab('caregiver-home');
            } else {
              setActiveTab('home');
            }
          }}
          onStartDemo={() => setShowDemoSetup(true)}
        />
      </ScreenContainer>
    );
  }

  // Show onboarding if not complete (patient only)
  if (!state.onboardingComplete && role === UserRole.PATIENT) {
    return (
      <ScreenContainer>
        <OnboardingFlow onComplete={() => setActiveTab('home')} />
      </ScreenContainer>
    );
  }

  // Role-based routing
  const renderScreen = () => {
    // PATIENT ROUTES
    if (role === UserRole.PATIENT) {
      switch (activeTab) {
        case 'home':
          return <PatientHomeScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'games':
          return <GamesScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'remember-game':
          return <RememberGame onBack={() => setActiveTab('games')} />;
        case 'recognise-game':
          return <RecogniseGame onBack={() => setActiveTab('games')} />;
        case 'reminders':
          return <RemindersScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'progress':
          return <ProgressScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'settings':
          return <SettingsScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'memory-book':
          return <MemoryBookScreen />;
        case 'memory-book-viewer':
          return <MemoryBookViewerScreen />;
        default:
          return <PatientHomeScreen onNavigate={setActiveTab} isOnline={isOnline} />;
      }
    }

    // CAREGIVER ROUTES
    if (role === UserRole.CAREGIVER) {
      switch (activeTab) {
        case 'caregiver-home':
          return <CaregiverHome onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'caregiver-reminders':
          return <RemindersScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'caregiver-memory':
          return <MemoryBookScreen />;
        case 'caregiver-settings':
          return <SettingsScreen onNavigate={setActiveTab} isOnline={isOnline} />;
        case 'safety-dashboard':
          return <SafetyDashboard onBack={() => setActiveTab('caregiver-home')} />;
        case 'sync-tests':
          return <SyncTestScreen onBack={() => setActiveTab('caregiver-home')} />;
        case 'security-tests':
          return <SecurityTestScreen onBack={() => setActiveTab('caregiver-settings')} />;
        case 'adaptive-tests':
          return <AdaptiveEngineTestScreen onBack={() => setActiveTab('caregiver-settings')} />;
        case 'database-tests':
          return <DatabaseTestScreen />;
        case 'reminder-tests':
          return <ReminderTestScreen onNavigate={setActiveTab} />;
        case 'voice-language-tests':
          return <VoiceLanguageTestScreen onBack={() => setActiveTab('caregiver-settings')} />;
        default:
          return <CaregiverHome onNavigate={setActiveTab} isOnline={isOnline} />;
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
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
