import { useState, useEffect } from 'react';
import { TrendingUp, Brain, Grid3X3, Calendar, Award, ArrowLeft, Activity } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { progressAnalytics, ProgressMetrics } from '../services/ProgressAnalytics';

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function ProgressScreen({ onNavigate, isOnline = true }: ProgressScreenProps) {
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : null;
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadMetrics();
    }
  }, [userId]);

  const loadMetrics = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await progressAnalytics.calculateMetrics(userId);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load progress metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <>
        <AppHeader title="My Progress" subtitle="Your cognitive journey" isOnline={isOnline} />
        <div className="px-5 py-6 pb-28">
          <Card className="p-6 text-center">
            <p className="text-[#7A7A7A]">No patient selected</p>
          </Card>
        </div>
      </>
    );
  }

  if (loading || !metrics) {
    return (
      <>
        <AppHeader title="My Progress" subtitle="Your cognitive journey" isOnline={isOnline} />
        <div className="px-5 py-6 pb-28">
          <Card className="p-6 text-center">
            <p className="text-[#7A7A7A]">Loading your progress...</p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="My Progress" subtitle="Your cognitive journey" isOnline={isOnline} />
      <div className="px-5 py-6 pb-28 space-y-6">
        {/* Today's Activity */}
        <Card elevated className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={22} className="text-[#1B5E20]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">Today's Activity</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1B5E20]">{metrics.today.gamesPlayed}</p>
              <p className="text-xs text-[#7A7A7A] mt-1">Games</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#E65100]">{Math.round(metrics.today.totalTime / 60)}</p>
              <p className="text-xs text-[#7A7A7A] mt-1">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1565C0]">{metrics.today.averageAccuracy}%</p>
              <p className="text-xs text-[#7A7A7A] mt-1">Accuracy</p>
            </div>
          </div>
        </Card>

        {/* Weekly Summary */}
        <Card elevated className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={22} className="text-[#1B5E20]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">This Week</h3>
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-4">
            <ProgressItem 
              label="Memory Performance" 
              value={metrics.memory.averageAccuracy} 
              color="#1B5E20"
              icon={<Brain size={16} />}
              trend={metrics.memory.trend}
            />
            <ProgressItem 
              label="Recognition Performance" 
              value={metrics.recognition.averageAccuracy} 
              color="#E65100"
              icon={<Grid3X3 size={16} />}
              trend={metrics.recognition.trend}
            />
          </div>

          {/* Weekly Stats */}
          <div className="mt-4 pt-4 border-t border-[#E0D8CC]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-[#7A7A7A]">Games Played</p>
                <p className="text-xl font-bold text-[#1A1A1A]">{metrics.weekly.gamesPlayed}</p>
              </div>
              <div>
                <p className="text-sm text-[#7A7A7A]">Total Time</p>
                <p className="text-xl font-bold text-[#1A1A1A]">{Math.round(metrics.weekly.totalTime / 60)} min</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-[#1B5E20]">{metrics.memory.totalGames + metrics.recognition.totalGames}</p>
            <p className="text-sm text-[#7A7A7A] mt-1">Total Games</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-[#E65100]">{metrics.reminderAdherence.adherenceRate}%</p>
            <p className="text-sm text-[#7A7A7A] mt-1">Reminder Adherence</p>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-[#4A4A4A]" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">Daily Activity</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-24 px-2">
            {metrics.weekly.dailyActivity.map((count, i) => {
              const maxCount = Math.max(...metrics.weekly.dailyActivity, 1);
              const height = (count / maxCount) * 100;
              const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t-md bg-[#4CAF50] transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-[#7A7A7A]">
                    {days[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievement */}
        {metrics.weekly.gamesPlayed >= 5 && (
          <Card className="p-4 bg-[#FDF8F0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                <Award size={24} className="text-[#E65100]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#1A1A1A]">Week Warrior!</h4>
                <p className="text-sm text-[#4A4A4A]">{metrics.weekly.gamesPlayed} games this week</p>
              </div>
            </div>
          </Card>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-[#7A7A7A] text-center px-4 leading-relaxed">
          Progress tracking is for personal motivation and caregiver insight. 
          It is not a clinical assessment tool.
        </p>

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

function ProgressItem({ 
  label, 
  value, 
  color, 
  icon,
  trend 
}: { 
  label: string; 
  value: number; 
  color: string; 
  icon: React.ReactNode;
  trend?: 'improving' | 'stable' | 'declining';
}) {
  const trendIcon = trend === 'improving' ? '↑' : trend === 'declining' ? '↓' : '→';
  const trendColor = trend === 'improving' ? '#2E7D32' : trend === 'declining' ? '#C62828' : '#7A7A7A';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <span className="text-sm font-semibold" style={{ color: trendColor }}>
              {trendIcon}
            </span>
          )}
          <span className="text-sm font-semibold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <div className="h-3 bg-[#F5F0E8] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
