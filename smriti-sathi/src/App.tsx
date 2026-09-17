import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PatientProvider } from './contexts/PatientContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { UpdateBanner } from './components/UpdateChecker';
import { Home } from './pages/Home';
import { GamesHub } from './pages/GamesHub';
import { MemoryMatch } from './pages/MemoryMatch';
import { DailyRoutine } from './pages/DailyRoutine';
import { MathWorkout } from './pages/MathWorkout';
import { LanguageWorkout } from './pages/LanguageWorkout';
import { Reminders } from './pages/Reminders';
import { Settings } from './pages/Settings';
import { CaregiverDash } from './pages/CaregiverDash';

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <LanguageProvider>
          <PatientProvider>
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
                  <Route path="/caregiver" element={<CaregiverDash />} />
                  {/* Catch-all route to ensure any route or path always renders Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
              <BottomNav />
            </div>
          </PatientProvider>
        </LanguageProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
