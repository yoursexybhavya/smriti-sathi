import { Brain, Heart, Shield } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { APP } from '../../core/constants/app';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-center">
      {/* Hero & Features Container */}
      <div className="max-w-5xl mx-auto w-full px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Branding & Tagline */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Logo */}
          <div className="w-28 h-28 rounded-3xl bg-[#1B5E20] flex items-center justify-center mb-6 shadow-xl ring-4 ring-[#1B5E20]/20">
            <Brain size={58} className="text-white" />
          </div>

          {/* App Name */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight">
            {APP.name}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-[#1B5E20] mt-1">
            স্মৃতি সাথী
          </p>

          {/* Tagline */}
          <p className="text-base md:text-xl text-[#4A4A4A] mt-3 max-w-md leading-relaxed">
            {APP.tagline}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#E8F5E9] border border-[#1B5E20]/30 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B5E20]">
            <span>🌿 Smart India Hackathon 2026 • SIH26003</span>
          </div>
        </div>

        {/* Right: Feature Highlights & CTA */}
        <div className="md:col-span-6 space-y-4">
          <FeatureRow
            icon={<Heart size={24} className="text-[#E65100]" />}
            title="Memory Activities & Games"
            description="Gentle, culturally attuned cognitive exercises with errorless learning"
          />
          <FeatureRow
            icon={<Shield size={24} className="text-[#1B5E20]" />}
            title="Multimodal Reminders"
            description="Audio, picture, and family voice prompts for medicine and hydration"
          />
          <FeatureRow
            icon={<Brain size={24} className="text-[#1565C0]" />}
            title="100% Offline-First Architecture"
            description="Runs completely locally in remote Northeast hill areas without internet"
          />

          <div className="pt-4 space-y-3">
            <LargeButton onPress={onNext}>
              Begin Setup / আৰম্ভ কৰক →
            </LargeButton>
            <p className="text-center text-xs md:text-sm text-[#7A7A7A]">
              Designed for elderly users and caregivers with high-contrast accessibility.
            </p>
          </div>
        </div>
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
