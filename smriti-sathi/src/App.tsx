import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PatientProvider } from './contexts/PatientContext';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
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
    <BrowserRouter>
      <LanguageProvider>
        <PatientProvider>
          <div className="app-container">
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
              </Routes>
            </div>
            <BottomNav />
          </div>
        </PatientProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
