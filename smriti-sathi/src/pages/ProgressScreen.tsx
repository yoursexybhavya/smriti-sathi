import { useState, useEffect } from 'react';
import { TrendingUp, Brain, Grid3X3, Calendar, Award, ArrowLeft, Activity } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import LargeButton from '../components/LargeButton';
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
            <p className="text-[var(--color-text-muted)]">No patient selected</p>
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
            <p className="text-[var(--color-text-muted)]">Loading your progress...</p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader 
        title="My Progress" 
        subtitle="Your cognitive journey" 
        isOnline={isOnline} 
        showBack 
        onBack={() => onNavigate('home')} 
        showSettings
        onSettingsPress={() => onNavigate('settings')}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* Today's Activity */}
        <Card elevated className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={22} className="text-[var(--color-success)]" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">Today's Activity</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-success)]">{metrics.today.gamesPlayed}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Games</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-accent-amber)]">{Math.round(metrics.today.totalTime / 60)}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-accent-blue)]">{metrics.today.averageAccuracy}%</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Accuracy</p>
            </div>
          </div>
        </Card>

        {/* Weekly Summary */}
        <Card elevated className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={22} className="text-[var(--color-success)]" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">This Week</h3>
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-4">
            <ProgressItem 
              label="Memory Performance" 
              value={metrics.memory.averageAccuracy} 
              color="var(--color-success)"
              icon={<Brain size={16} />}
              trend={metrics.memory.trend}
            />
            <ProgressItem 
              label="Recognition Performance" 
              value={metrics.recognition.averageAccuracy} 
              color="var(--color-accent-amber)"
              icon={<Grid3X3 size={16} />}
              trend={metrics.recognition.trend}
            />
          </div>

          {/* Weekly Stats */}
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Games Played</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{metrics.weekly.gamesPlayed}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Total Time</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{Math.round(metrics.weekly.totalTime / 60)} min</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-[var(--color-success)]">{metrics.memory.totalGames + metrics.recognition.totalGames}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Total Games</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-[var(--color-accent-amber)]">{metrics.reminderAdherence.adherenceRate}%</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Reminder Adherence</p>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-semibold text-[var(--color-text)]">Daily Activity</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-24 px-2">
            {metrics.weekly.dailyActivity.map((count, i) => {
              const maxCount = Math.max(...metrics.weekly.dailyActivity, 1);
              const height = (count / maxCount) * 100;
              const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t-md bg-[var(--color-success)] transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {days[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievement */}
        {metrics.weekly.gamesPlayed >= 5 && (
          <Card className="p-4 bg-[var(--color-card-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center">
                <Award size={24} className="text-[var(--color-accent-amber)]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[var(--color-text)]">Week Warrior!</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">{metrics.weekly.gamesPlayed} games this week</p>
              </div>
            </div>
          </Card>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-[var(--color-text-muted)] text-center px-4 leading-relaxed">
          Progress tracking is for personal motivation and caregiver insight. 
          It is not a clinical assessment tool.
        </p>

        {/* Back Button */}
        <div className="pt-2">
          <LargeButton
            onPress={() => onNavigate('home')}
            variant="outline"
            icon={<ArrowLeft size={22} />}
          >
            Back to Home
          </LargeButton>
        </div>
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
  const trendColor = trend === 'improving' ? 'var(--color-success)' : trend === 'declining' ? 'var(--color-error)' : 'var(--color-text-muted)';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span style={{ color: `var(--color-${color})` }}>{icon}</span>
          <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <span className="text-sm font-semibold" style={{ color: trendColor }}>
              {trendIcon}
            </span>
          )}
          <span className="text-sm font-semibold" style={{ color: `var(--color-${color})` }}>{value}%</span>
        </div>
      </div>
      <div className="h-3 bg-[var(--color-bg-subtle)] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: `var(--color-${color})` }}
        />
      </div>
    </div>
  );
}
