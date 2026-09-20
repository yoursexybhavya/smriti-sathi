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
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center z-50 overflow-hidden select-none">
      {/* Background ambient radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className={`relative flex flex-col items-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Logo with tranquil ring and breathing pulse */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-md animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-slate-800/90 border border-slate-700/80 ring-4 ring-indigo-500/20 shadow-2xl backdrop-blur-sm flex items-center justify-center">
            <Brain size={48} className="text-indigo-400 drop-shadow-sm" />
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {appName}
        </h1>
        
        {/* Tagline */}
        <p className="text-base text-slate-300/90 mt-3 text-center px-8 max-w-xs leading-relaxed">
          {tagline}
        </p>

        {/* Loading indicator */}
        <div className="mt-10 flex items-center gap-2" role="status" aria-label="Loading">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/80 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/80 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Version / Sub-tagline */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 font-semibold tracking-wider uppercase">
          <span>v2.5.3</span>
          <span className="hidden" aria-hidden="true">v2.2.0</span>
          <span>•</span>
          <span>Cognitive Care Companion</span>
        </div>
      </div>
    </div>
  );
}
