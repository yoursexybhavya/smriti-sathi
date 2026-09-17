import { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PatientProvider, usePatient } from './contexts/PatientContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { UpdateBanner } from './components/UpdateChecker';
import { FirstLaunchOnboarding } from './components/FirstLaunchOnboarding';
import { CaregiverPinModal } from './components/CaregiverPinModal';
import { Home } from './pages/Home';
import { GamesHub } from './pages/GamesHub';
import { MemoryMatch } from './pages/MemoryMatch';
import { DailyRoutine } from './pages/DailyRoutine';
import { MathWorkout } from './pages/MathWorkout';
import { LanguageWorkout } from './pages/LanguageWorkout';
import { Reminders } from './pages/Reminders';
import { Settings } from './pages/Settings';
import { CaregiverDash } from './pages/CaregiverDash';

function ProtectedCaregiverRoute() {
  const { userRole } = usePatient();
  const [unlocked, setUnlocked] = useState(userRole === 'caregiver');
  const [showPinModal, setShowPinModal] = useState(userRole !== 'caregiver');
  const navigate = useNavigate();

  if (unlocked) {
    return <CaregiverDash />;
  }

  return (
    <>
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Caregiver & ASHA Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: '#94A9C4', maxWidth: '360px', marginBottom: '20px' }}>
          This screen contains longitudinal cognitive check-in data and clinical synchronization.
        </p>
        <button
          className="btn-primary-lumos"
          onClick={() => setShowPinModal(true)}
          style={{ padding: '12px 24px' }}
        >
          Enter 4-Digit Caregiver PIN
        </button>
      </div>

      <CaregiverPinModal
        isOpen={showPinModal}
        onSuccess={() => {
          setUnlocked(true);
          setShowPinModal(false);
        }}
        onClose={() => {
          setShowPinModal(false);
          navigate('/');
        }}
      />
    </>
  );
}

function AppShell() {
  const { isLoading, setupCompleted, patients } = usePatient();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07101B',
          color: '#38BDF8',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 800 }}>স্মৃতি সাথী</div>
        <div style={{ fontSize: '14px', color: '#94A9C4' }}>Memory Care Companion</div>
      </div>
    );
  }

  // Force first-launch account / profile setup if not completed or no elders exist
  if (!setupCompleted || patients.length === 0) {
    return <FirstLaunchOnboarding onComplete={() => {}} />;
  }

  return (
    <div className="app-container">
      <UpdateBanner />
      <TopHeader />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesHub />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/daily-routine" element={<DailyRoutine />} />
          <Route path="/games/math" element={<MathWorkout />} />
          <Route path="/games/language" element={<LanguageWorkout />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/caregiver" element={<ProtectedCaregiverRoute />} />
          {/* Catch-all route to ensure any route or path always renders Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <LanguageProvider>
          <PatientProvider>
            <AppShell />
          </PatientProvider>
        </LanguageProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
