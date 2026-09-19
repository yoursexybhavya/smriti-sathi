import { useState, useEffect } from 'react';
import { Users, TrendingUp, Brain, Grid3X3, Bell, Activity, AlertCircle, RefreshCw, Database } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { progressAnalytics } from '../services/ProgressAnalytics';
import { demoDataService } from '../services/DemoDataService';
import { formatRelativeTime } from '../utils/dateUtils';

interface CaregiverDashboardProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function CaregiverDashboard({ onNavigate, isOnline = true }: CaregiverDashboardProps) {
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : null;
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadSummary();
    }
  }, [userId]);

  const loadSummary = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await progressAnalytics.getCaregiverSummary(userId);
      setSummary(data);
    } catch (error) {
      console.error('Failed to load caregiver summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!userId) return;
    
    if (!confirm('This will reset all demo data and generate new realistic data. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      await demoDataService.generateDemoData(userId);
      await loadSummary();
      alert('Demo data has been reset successfully!');
    } catch (error) {
      console.error('Failed to reset demo data:', error);
      alert('Failed to reset demo data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <>
        <AppHeader title="Caregiver Dashboard" subtitle="Patient overview" isOnline={isOnline} />
        <div className="px-5 py-6 pb-28">
          <Card className="p-6 text-center">
            <p className="text-[#7A7A7A]">No patient selected</p>
          </Card>
        </div>
      </>
    );
  }

  if (loading || !summary) {
    return (
      <>
        <AppHeader title="Caregiver Dashboard" subtitle="Patient overview" isOnline={isOnline} />
        <div className="px-5 py-6 pb-28">
          <Card className="p-6 text-center">
            <p className="text-[#7A7A7A]">Loading dashboard...</p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Caregiver Dashboard" subtitle="Patient overview" isOnline={isOnline} />
      <div className="px-5 py-6 pb-28 space-y-6">
        {/* Patient Info */}
        <Card elevated className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#1B5E20]">
                {summary.patientName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1A1A1A]">{summary.patientName}</h3>
              <p className="text-sm text-[#7A7A7A] mt-1">
                Last active: {summary.lastActive ? formatRelativeTime(summary.lastActive) : 'Never'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Activity size={14} className="text-[#1B5E20]" />
                <span className="text-sm text-[#4A4A4A]">
                  {summary.sessionsCompleted} sessions completed
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Follow-up Alert */}
        {summary.followUpNeeded && (
          <Card className="p-4 bg-[#FFF3E0] border-[#FFE0B2]">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-[#E65100] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Follow-up Suggested</h4>
                <p className="text-sm text-[#4A4A4A] mt-1">
                  Performance trend has changed. Consider caregiver follow-up.
                </p>
                <p className="text-xs text-[#7A7A7A] mt-2">
                  This is not a medical diagnosis. Please consult healthcare professionals for clinical advice.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly Engagement */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={22} className="text-[#1B5E20]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">Weekly Engagement</h3>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#1B5E20]">{summary.weeklyEngagement}%</p>
            <p className="text-sm text-[#7A7A7A] mt-2">Average accuracy this week</p>
          </div>
        </Card>

        {/* Performance Trends */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={18} className="text-[#1B5E20]" />
              <span className="text-sm font-medium text-[#1A1A1A]">Memory</span>
            </div>
            <p className={`text-lg font-bold ${
              summary.memoryTrend === 'improving' ? 'text-[#2E7D32]' :
              summary.memoryTrend === 'declining' ? 'text-[#C62828]' :
              'text-[#7A7A7A]'
            }`}>
              {summary.memoryTrend === 'improving' ? '↑ Improving' :
               summary.memoryTrend === 'declining' ? '↓ Declining' :
               '→ Stable'}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Grid3X3 size={18} className="text-[#E65100]" />
              <span className="text-sm font-medium text-[#1A1A1A]">Recognition</span>
            </div>
            <p className={`text-lg font-bold ${
              summary.recognitionTrend === 'improving' ? 'text-[#2E7D32]' :
              summary.recognitionTrend === 'declining' ? 'text-[#C62828]' :
              'text-[#7A7A7A]'
            }`}>
              {summary.recognitionTrend === 'improving' ? '↑ Improving' :
               summary.recognitionTrend === 'declining' ? '↓ Declining' :
               '→ Stable'}
            </p>
          </Card>
        </div>

        {/* Reminder Adherence */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={22} className="text-[#E65100]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">Reminder Adherence</h3>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#E65100]">{summary.reminderAdherence}%</p>
            <p className="text-sm text-[#7A7A7A] mt-2">Reminders completed on time</p>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={22} className="text-[#1565C0]" />
            <h3 className="text-lg font-bold text-[#1A1A1A]">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {summary.recentActivities.length === 0 ? (
              <p className="text-sm text-[#7A7A7A] text-center py-4">No recent activities</p>
            ) : (
              summary.recentActivities.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-[#E0D8CC] last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-[#1565C0] mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">{activity.type}</p>
                    <p className="text-xs text-[#7A7A7A] mt-0.5">{activity.detail}</p>
                    <p className="text-xs text-[#7A7A7A] mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={loadSummary}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E0D8CC] text-[#4A4A4A] font-medium hover:bg-white transition-colors"
          >
            <RefreshCw size={18} />
            Refresh Dashboard
          </button>
          <button
            onClick={handleResetDemoData}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E65100] text-[#E65100] font-medium hover:bg-[#FFF3E0] transition-colors"
          >
            <Database size={18} />
            Reset Demo Data
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-[#4A4A4A] text-base font-medium px-4 py-3 rounded-xl hover:bg-white transition-colors w-full justify-center"
          >
            Back to Home
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#7A7A7A] text-center px-4 leading-relaxed">
          This dashboard provides engagement insights for caregiver support. 
          It is not a diagnostic or clinical assessment tool.
        </p>
      </div>
    </>
  );
}
