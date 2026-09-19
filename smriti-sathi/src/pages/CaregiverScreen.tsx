import { Users, Shield, Eye, MessageCircle, ArrowLeft, UserPlus, Activity } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';

interface CaregiverScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function CaregiverScreen({ onNavigate, isOnline = true }: CaregiverScreenProps) {
  return (
    <>
      <AppHeader title="Caregiver Dashboard" subtitle="For family & ASHA workers" isOnline={isOnline} />
      <div className="px-5 py-6 pb-28 space-y-6">
        {/* Role Info */}
        <div className="flex items-start gap-3 p-4 bg-[var(--color-success-bg)] rounded-2xl border border-[var(--color-success)]/30">
          <Shield size={20} className="text-[var(--color-success)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--color-success)]">Caregiver Access</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              View progress, manage reminders, and stay connected with your care recipient.
            </p>
          </div>
        </div>

        {/* Connected Patients */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Connected Patients</h3>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--color-success)]">RK</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[var(--color-text)]">Ramesh Kumar</h4>
                <p className="text-sm text-[var(--color-text-muted)]">Last active: 2 hours ago</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--color-accent-amber)]">SD</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[var(--color-text)]">Sunita Devi</h4>
                <p className="text-sm text-[var(--color-text-muted)]">Last active: Yesterday</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-accent-amber)]" />
            </div>
          </Card>

          {/* Add Patient */}
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium text-base hover:border-[var(--color-success)] hover:text-[var(--color-success)] transition-colors">
            <UserPlus size={20} />
            Connect New Patient
          </button>
        </div>

        {/* Quick Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Quick Insights</h3>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={18} className="text-[var(--color-accent-blue)]" />
              <h4 className="text-sm font-semibold text-[var(--color-text)]">Ramesh — This Week</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-[var(--color-bg-subtle)] rounded-xl">
                <p className="text-lg font-bold text-[var(--color-success)]">5</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Games</p>
              </div>
              <div className="text-center p-2 bg-[var(--color-bg-subtle)] rounded-xl">
                <p className="text-lg font-bold text-[var(--color-accent-amber)]">85%</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Meds Taken</p>
              </div>
              <div className="text-center p-2 bg-[var(--color-bg-subtle)] rounded-xl">
                <p className="text-lg font-bold text-[var(--color-accent-blue)]">Good</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Mood</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Communication */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Communication</h3>
          
          <Card onPress={() => {}} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-accent-blue)/15] flex items-center justify-center">
                <MessageCircle size={20} className="text-[var(--color-accent-blue)]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[var(--color-text)]">Send Voice Note</h4>
                <p className="text-sm text-[var(--color-text-muted)]">Record a message in their language</p>
              </div>
            </div>
          </Card>

          <Card onPress={() => {}} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-success-bg)] flex items-center justify-center">
                <Eye size={20} className="text-[var(--color-success)]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[var(--color-text)]">View Full Report</h4>
                <p className="text-sm text-[var(--color-text-muted)]">Detailed activity & progress data</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)]">
          <Shield size={18} className="text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            All data is encrypted and shared only with your consent. Patient privacy is our priority. 
            Caregiver access can be revoked at any time.
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] text-base font-medium px-4 py-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
    </>
  );
}
