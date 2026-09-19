/**
 * SMRITI SATHI — Caregiver Home Screen
 * 
 * Dashboard for caregivers/ASHA workers.
 * Shows patient overview, follow-up signals, and quick actions.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { caregiverRepository, FollowUpSignal } from '../../database/repositories/CaregiverRepository';
import { UserRole } from '../../models/Role';
import {
  Users,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ChevronRight,
  LogOut,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface CaregiverHomeProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function CaregiverHome({ onNavigate, isOnline = true }: CaregiverHomeProps) {
  const { session, logout, role } = useAuth();
  const [patients, setPatients] = useState<Array<{ id: string; name: string; age: number }>>([]);
  const [signals, setSignals] = useState<FollowUpSignal[]>([]);
  const [summaries, setSummaries] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [session]);

  const loadData = async () => {
    if (!session || role !== UserRole.CAREGIVER) return;
    
    setLoading(true);
    try {
      const patientList = await caregiverRepository.getLinkedPatients(session.userId);
      setPatients(patientList);

      const allSignals = await caregiverRepository.getAllFollowUpSignals(session.userId);
      setSignals(allSignals);

      const summaryData: Record<string, any> = {};
      for (const patient of patientList) {
        const summary = await caregiverRepository.getPatientSummary(session.userId, patient.id);
        if (summary) {
          summaryData[patient.id] = summary;
        }
      }
      setSummaries(summaryData);
    } catch (e) {
      console.error('Error loading caregiver data:', e);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'no_activity': return <Clock size={16} />;
      case 'declining_progress': return <TrendingUp size={16} className="rotate-180" />;
      case 'missed_reminders': return <Bell size={16} />;
      case 'missed_games': return <Activity size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-[#1B5E20] mx-auto mb-3" />
          <p className="text-[#4A4A4A]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-8">
      {/* Header */}
      <div className="bg-[#1B5E20] text-white px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{session?.displayName}</h1>
              <p className="text-xs opacity-80">Caregiver Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs opacity-80">
          <span>{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{signals.length} alert{signals.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Follow-up Signals */}
        {signals.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
            <h2 className="text-sm font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              Follow-up Signals ({signals.length})
            </h2>
            <div className="space-y-2">
              {signals.slice(0, 5).map(signal => (
                <div
                  key={signal.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${getSeverityColor(signal.severity)}`}
                >
                  <div className="mt-0.5">{getSignalIcon(signal.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{signal.patientName}</div>
                    <div className="text-xs opacity-75">{signal.message}</div>
                  </div>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-white/50">
                    {signal.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#4A4A4A] px-1 flex items-center gap-2">
            <Users size={16} />
            Patients
          </h2>
          {patients.map(patient => {
            const summary = summaries[patient.id];
            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-[#E0D8CC] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <span className="text-lg font-bold text-[#1B5E20]">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1A1A1A]">{patient.name}</h3>
                      <p className="text-xs text-[#7A7A7A]">Age: {patient.age}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(`caregiver-patient-${patient.id}`)}
                    className="p-2 rounded-lg bg-[#F5F0E8] hover:bg-[#E0D8CC] transition-colors"
                  >
                    <ChevronRight size={18} className="text-[#4A4A4A]" />
                  </button>
                </div>

                {summary && (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-800">{summary.totalGames}</div>
                      <div className="text-xs text-blue-600">Games</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-800">{summary.avgAccuracy}%</div>
                      <div className="text-xs text-green-600">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg">
                      <div className="text-lg font-bold text-amber-800">{summary.pendingReminders}</div>
                      <div className="text-xs text-amber-600">Pending</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-800">{summary.gamesThisWeek}</div>
                      <div className="text-xs text-purple-600">This Week</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <h2 className="text-sm font-semibold text-[#4A4A4A] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate('caregiver-reminders')}
              className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <Bell size={24} className="text-amber-700" />
              <span className="text-xs font-medium text-amber-800">Manage Reminders</span>
            </button>
            <button
              onClick={() => onNavigate('caregiver-memory')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Users size={24} className="text-purple-700" />
              <span className="text-xs font-medium text-purple-800">Memory Book</span>
            </button>
            <button
              onClick={() => onNavigate('safety-dashboard')}
              className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <Shield size={24} className="text-red-700" />
              <span className="text-xs font-medium text-red-800">Safety Features</span>
            </button>
            <button
              onClick={() => onNavigate('sync-tests')}
              className="flex flex-col items-center gap-2 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw size={24} className="text-indigo-700" />
              <span className="text-xs font-medium text-indigo-800">Sync Status</span>
            </button>
            <button
              onClick={() => onNavigate('caregiver-settings')}
              className="col-span-2 flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Shield size={24} className="text-gray-700" />
              <span className="text-xs font-medium text-gray-800">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
