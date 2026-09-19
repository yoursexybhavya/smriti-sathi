import { Brain, Heart, Shield } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { APP } from '../../core/constants/app';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="w-28 h-28 rounded-3xl bg-[#1B5E20] flex items-center justify-center mb-8 shadow-lg">
          <Brain size={56} className="text-white" />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] text-center">
          {APP.name}
        </h1>

        {/* Tagline */}
        <p className="text-lg text-[#4A4A4A] text-center mt-3 max-w-xs leading-relaxed">
          {APP.tagline}
        </p>

        {/* Feature highlights */}
        <div className="mt-10 space-y-4 w-full max-w-sm">
          <FeatureRow
            icon={<Heart size={22} className="text-[#E65100]" />}
            title="Memory Activities"
            description="Gentle exercises for your mind"
          />
          <FeatureRow
            icon={<Shield size={22} className="text-[#1B5E20]" />}
            title="Daily Reminders"
            description="Medicine, appointments & more"
          />
          <FeatureRow
            icon={<Brain size={22} className="text-[#1565C0]" />}
            title="Works Offline"
            description="No internet needed to use"
          />
        </div>
      </div>

      {/* Action */}
      <div className="px-6 pb-10">
        <LargeButton onPress={onNext}>
          Begin Setup
        </LargeButton>
        <p className="text-center text-sm text-[#7A7A7A] mt-4">
          A caregiver will help set things up.
        </p>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E0D8CC]">
      <div className="w-12 h-12 rounded-xl bg-[#FDF8F0] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
        <p className="text-sm text-[#7A7A7A]">{description}</p>
      </div>
    </div>
  );
}
