import { useState, useEffect } from 'react';
import { Brain, Grid3X3, ArrowLeft, Sparkles, Info, Eye, Sun } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { GameStorage } from '../services/storage/GameStorage';
import RecogniseGame from './games/RecogniseGame';
import RememberGame from './games/RememberGame';
import MemoryMatchGame from './games/MemoryMatchGame';
import DailyRoutineGame from './games/DailyRoutineGame';

interface GamesScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function GamesScreen({ onNavigate, isOnline = navigator.onLine }: GamesScreenProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';
  
  // Local state for routing within games module
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Game stats
  const [stats, setStats] = useState({
    totalGames: 0,
    currentStreak: 0,
    averageAccuracy: 0,
  });
  const [recogniseGamesPlayed, setRecogniseGamesPlayed] = useState(0);
  const [rememberGamesPlayed, setRememberGamesPlayed] = useState(0);

  // Load stats
  useEffect(() => {
    const loadData = async () => {
      // Get session stats
      const allSessions = await GameStorage.getPatientSessions(patientId);
      const patientStats = await GameStorage.getPatientStats(patientId);
      
      let totalAcc = 0;
      allSessions.forEach(s => totalAcc += s.accuracy);
      const avgAcc = allSessions.length > 0 ? Math.round(totalAcc / allSessions.length) : 0;
      
      setStats({
        totalGames: allSessions.length,
        currentStreak: patientStats.currentStreak,
        averageAccuracy: avgAcc,
      });

      // Get game-specific counts
      const recogniseSessions = allSessions.filter(s => s.gameType === 'recognise');
      const rememberSessions = allSessions.filter(s => s.gameType === 'remember');
      setRecogniseGamesPlayed(recogniseSessions.length);
      setRememberGamesPlayed(rememberSessions.length);
    };
    
    loadData();
  }, [patientId]);

  // Handle local game navigation
  if (activeGame === 'recognise-game') {
    return <RecogniseGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'remember-game') {
    return <RememberGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory-match') {
    return <MemoryMatchGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'daily-routine') {
    return <DailyRoutineGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <>
      <AppHeader title="Cognitive Games" subtitle="Keep your mind active" isOnline={isOnline} />
      <div className="max-w-7xl mx-auto px-5 py-6 pb-28 space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-[#E3F2FD] rounded-2xl border border-[#BBDEFB]">
          <Info size={20} className="text-[#1565C0] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#1565C0] leading-relaxed">
            These games are designed for cognitive engagement and enjoyment. Difficulty adapts to your comfort level.
          </p>
        </div>

        {/* Game Cards */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1 md:col-span-2">Available Games</h3>
          
          {/* REMEMBER Game - Fully Working */}
          <Card onPress={() => setActiveGame('remember-game')} className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center flex-shrink-0">
                  <Eye size={32} className="text-[#1B5E20]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[#1A1A1A]">Remember</h4>
                    <span className="text-xs font-medium text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                    Look at familiar objects, then recall which ones you saw.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      5 Levels
                    </span>
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      3-6 Objects
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#F57F17]" />
                  <span className="text-xs text-[#4A4A4A]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-semibold text-[#1B5E20]">Start Activity →</span>
              </div>
            </div>
          </Card>

          {/* Memory Match Game - NOW WORKING */}
          <Card onPress={() => setActiveGame('memory-match')} className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex items-center justify-center flex-shrink-0">
                  <Brain size={32} className="text-[#1565C0]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[#1A1A1A]">Memory Match</h4>
                    <span className="text-xs font-medium text-[#1565C0] bg-[#E3F2FD] px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                    Find matching pairs of images. Tests your visual memory and recall ability.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      5 Levels
                    </span>
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      Pairs
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#F57F17]" />
                  <span className="text-xs text-[#4A4A4A]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-semibold text-[#1565C0]">Start Activity →</span>
              </div>
            </div>
          </Card>

          {/* RECOGNISE Game - Fully Working */}
          <Card onPress={() => setActiveGame('recognise-game')} className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] flex items-center justify-center flex-shrink-0">
                  <Eye size={32} className="text-[#E65100]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[#1A1A1A]">Recognise</h4>
                    <span className="text-xs font-medium text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                    Find patterns, sequences, and what is different.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      5 Levels
                    </span>
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      3 Activity Types
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#F57F17]" />
                  <span className="text-xs text-[#4A4A4A]">Adaptive difficulty</span>
                </div>
                <span className="text-sm font-semibold text-[#E65100]">Start Activity →</span>
              </div>
            </div>
          </Card>

          {/* DAILY ROUTINE Sequencing Game */}
          <Card onPress={() => setActiveGame('daily-routine')} className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center flex-shrink-0">
                  <Sun size={32} className="text-[#1B5E20]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-[#1A1A1A]">Daily Routine</h4>
                    <span className="text-xs font-medium text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                    Order daily habits in sequence from morning to night.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      5 Levels
                    </span>
                    <span className="text-xs font-medium text-[#7A7A7A] bg-[#F5F0E8] px-2 py-1 rounded-full">
                      Temporal Focus
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#F57F17]" />
                  <span className="text-xs text-[#4A4A4A]">Errorless learning</span>
                </div>
                <span className="text-sm font-semibold text-[#1B5E20]">Start Activity →</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Your Progress</h3>
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#1B5E20]">{stats.totalGames}</p>
                <p className="text-xs text-[#7A7A7A] mt-1">Games Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#E65100]">{stats.currentStreak}</p>
                <p className="text-xs text-[#7A7A7A] mt-1">Day Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1565C0]">{stats.averageAccuracy}%</p>
                <p className="text-xs text-[#7A7A7A] mt-1">Avg. Accuracy</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#4A4A4A] text-base font-medium px-4 py-3 rounded-xl hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
    </>
  );
}
