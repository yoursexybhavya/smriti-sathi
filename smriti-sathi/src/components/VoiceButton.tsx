import { Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  onPress: () => void;
  label?: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function VoiceButton({
  onPress,
  label = 'Listen',
  isActive = false,
  size = 'md',
}: VoiceButtonProps) {
  const sizeClasses = {
    sm: 'min-w-[56px] min-h-[56px] w-14 h-14',
    md: 'min-w-[56px] min-h-[56px] w-14 h-14',
    lg: 'min-w-[64px] min-h-[64px] w-16 h-16',
  };

  return (
    <button
      onClick={onPress}
      className={`
        ${sizeClasses[size]}
        rounded-2xl flex items-center justify-center
        transition-all active:scale-95
        focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/40'
        }
      `}
      aria-label={label}
      title={label}
    >
      <Volume2 size={size === 'lg' ? 28 : size === 'sm' ? 22 : 24} />
    </button>
  );
}
