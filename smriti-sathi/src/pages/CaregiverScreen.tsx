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
        <div className="flex items-start gap-3 p-4 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9]">
          <Shield size={20} className="text-[#1B5E20] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#1B5E20]">Caregiver Access</p>
            <p className="text-xs text-[#4A4A4A] mt-0.5">
              View progress, manage reminders, and stay connected with your care recipient.
            </p>
          </div>
        </div>

        {/* Connected Patients */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Connected Patients</h3>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <span className="text-lg font-bold text-[#1B5E20]">RK</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Ramesh Kumar</h4>
                <p className="text-sm text-[#7A7A7A]">Last active: 2 hours ago</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#2E7D32]" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                <span className="text-lg font-bold text-[#E65100]">SD</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Sunita Devi</h4>
                <p className="text-sm text-[#7A7A7A]">Last active: Yesterday</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#F57F17]" />
            </div>
          </Card>

          {/* Add Patient */}
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 border-dashed border-[#C0B8A8] text-[#4A4A4A] font-medium text-base hover:border-[#1B5E20] hover:text-[#1B5E20] transition-colors">
            <UserPlus size={20} />
            Connect New Patient
          </button>
        </div>

        {/* Quick Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Quick Insights</h3>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={18} className="text-[#1565C0]" />
              <h4 className="text-sm font-semibold text-[#1A1A1A]">Ramesh — This Week</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-[#F5F0E8] rounded-xl">
                <p className="text-lg font-bold text-[#1B5E20]">5</p>
                <p className="text-[10px] text-[#7A7A7A]">Games</p>
              </div>
              <div className="text-center p-2 bg-[#F5F0E8] rounded-xl">
                <p className="text-lg font-bold text-[#E65100]">85%</p>
                <p className="text-[10px] text-[#7A7A7A]">Meds Taken</p>
              </div>
              <div className="text-center p-2 bg-[#F5F0E8] rounded-xl">
                <p className="text-lg font-bold text-[#1565C0]">Good</p>
                <p className="text-[10px] text-[#7A7A7A]">Mood</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Communication */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#1A1A1A] px-1">Communication</h3>
          
          <Card onPress={() => {}} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#E3F2FD] flex items-center justify-center">
                <MessageCircle size={20} className="text-[#1565C0]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">Send Voice Note</h4>
                <p className="text-sm text-[#7A7A7A]">Record a message in their language</p>
              </div>
            </div>
          </Card>

          <Card onPress={() => {}} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                <Eye size={20} className="text-[#1B5E20]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#1A1A1A]">View Full Report</h4>
                <p className="text-sm text-[#7A7A7A]">Detailed activity & progress data</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 bg-[#F5F0E8] rounded-2xl border border-[#E0D8CC]">
          <Shield size={18} className="text-[#5D4037] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#5D4037] leading-relaxed">
            All data is encrypted and shared only with your consent. Patient privacy is our priority. 
            Caregiver access can be revoked at any time.
          </p>
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
