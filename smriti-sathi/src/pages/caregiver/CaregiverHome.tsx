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
  User,
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
import RoleAndProfileModal from '../../components/RoleAndProfileModal';

interface CaregiverHomeProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function CaregiverHome({ onNavigate, isOnline = true }: CaregiverHomeProps) {
  const { session, logout, role, switchRole } = useAuth();
  const [patients, setPatients] = useState<Array<{ id: string; name: string; age: number }>>([]);
  const [signals, setSignals] = useState<FollowUpSignal[]>([]);
  const [summaries, setSummaries] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Role and profile modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'role' | 'profile'>('role');

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
      case 'high': return 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]/30';
      case 'medium': return 'bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)] border-[var(--color-accent-amber)]/30';
      case 'low': return 'bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30';
      default: return 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]';
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
      <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-[var(--color-success)] mx-auto mb-3" />
          <p className="text-[var(--color-text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] pb-44 sm:pb-52">
      {/* Header */}
      <div className="bg-[var(--color-success)] text-white px-5 py-5">
        <div className="max-w-5xl mx-auto">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  await switchRole('patient_primary');
                  onNavigate('home');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Switch back to Elderly Patient Companion"
              >
                <span>👵 Elder View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalInitialTab('role');
                  setShowRoleModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Switch Role (Doctor, Guardian, Elder)"
              >
                <Users size={15} />
                <span>Role ▾</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Logout to Profile Selection"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs opacity-80">
            <span>{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{signals.length} alert{signals.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* Follow-up Signals */}
        {signals.length > 0 && (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-[var(--color-accent-amber)]" />
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
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] px-1 flex items-center gap-2">
            <Users size={16} />
            Patients
          </h2>
          {patients.map(patient => {
            const summary = summaries[patient.id];
            return (
              <div
                key={patient.id}
                className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--color-success)]">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-text)]">{patient.name}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">Age: {patient.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalInitialTab('profile');
                        setShowRoleModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-xs font-bold text-[var(--color-text)] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit Patient Name & Age"
                    >
                      <User size={13} />
                      <span>Edit Name/Age</span>
                    </button>
                    <button
                      onClick={() => onNavigate(`caregiver-patient-${patient.id}`)}
                      className="p-2 rounded-lg bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      <ChevronRight size={18} className="text-[var(--color-text-secondary)]" />
                    </button>
                  </div>
                </div>

                {summary && (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-[var(--color-accent-blue)/15] rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-accent-blue)]">{summary.totalGames}</div>
                      <div className="text-xs text-[var(--color-accent-blue)]/80">Games</div>
                    </div>
                    <div className="text-center p-2 bg-[var(--color-success-bg)] rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-success)]">{summary.avgAccuracy}%</div>
                      <div className="text-xs text-[var(--color-success)]/80">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-[var(--color-warning-bg)] rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-accent-amber)]">{summary.pendingReminders}</div>
                      <div className="text-xs text-[var(--color-accent-amber)]/80">Pending</div>
                    </div>
                    <div className="text-center p-2 bg-[var(--color-accent-purple)/15] rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-accent-purple)]">{summary.gamesThisWeek}</div>
                      <div className="text-xs text-[var(--color-accent-purple)]/80">This Week</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate('caregiver-reminders')}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-warning-bg)] rounded-xl hover:bg-[var(--color-warning-bg)]/80 transition-colors"
            >
              <Bell size={24} className="text-[var(--color-accent-amber)]" />
              <span className="text-xs font-medium text-[var(--color-accent-amber)]">Manage Reminders</span>
            </button>
            <button
              onClick={() => onNavigate('caregiver-memory')}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-accent-purple)/15] rounded-xl hover:bg-[var(--color-accent-purple)]/25 transition-colors"
            >
              <Users size={24} className="text-[var(--color-accent-purple)]" />
              <span className="text-xs font-medium text-[var(--color-accent-purple)]">Memory Book</span>
            </button>
            <button
              onClick={() => onNavigate('safety-dashboard')}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-error-bg)] rounded-xl hover:bg-[var(--color-error-bg)]/80 transition-colors"
            >
              <Shield size={24} className="text-[var(--color-error)]" />
              <span className="text-xs font-medium text-[var(--color-error)]">Safety Features</span>
            </button>
            <button
              onClick={() => onNavigate('sync-tests')}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-accent-blue)/15] rounded-xl hover:bg-[var(--color-accent-blue)]/25 transition-colors"
            >
              <RefreshCw size={24} className="text-[var(--color-accent-blue)]" />
              <span className="text-xs font-medium text-[var(--color-accent-blue)]">Sync Status</span>
            </button>
            <button
              onClick={() => onNavigate('caregiver-settings')}
              className="col-span-2 flex flex-col items-center gap-2 p-4 bg-[var(--color-bg-subtle)] rounded-xl hover:bg-[var(--color-border)] transition-colors"
            >
              <Shield size={24} className="text-[var(--color-text-secondary)]" />
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Settings</span>
            </button>
          </div>
        </div>
      </div>

      <RoleAndProfileModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        initialTab={modalInitialTab}
        onNavigate={onNavigate}
      />
    </div>
  );
}
