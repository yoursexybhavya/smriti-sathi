import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface SplashScreenProps {
  appName: string;
  tagline: string;
}

export default function SplashScreen({ appName, tagline }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1B5E20] flex flex-col items-center justify-center z-50">
      <div className={`flex flex-col items-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
          <Brain size={48} className="text-white" />
        </div>
        
        {/* App Name */}
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {appName}
        </h1>
        
        {/* Tagline */}
        <p className="text-base text-white/80 mt-3 text-center px-8 max-w-xs leading-relaxed">
          {tagline}
        </p>

        {/* Loading indicator */}
        <div className="mt-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Version */}
        <p className="absolute bottom-8 text-xs text-white/50">
          v2.2.0 — Cognitive Care Companion
        </p>
      </div>
    </div>
  );
}
