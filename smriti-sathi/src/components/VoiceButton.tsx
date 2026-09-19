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
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  return (
    <button
      onClick={onPress}
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center
        transition-all active:scale-95
        ${isActive 
          ? 'bg-[#1B5E20] text-white shadow-lg' 
          : 'bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#C8E6C9]'
        }
      `}
      aria-label={label}
    >
      <Volume2 size={size === 'sm' ? 20 : size === 'md' ? 24 : 28} />
    </button>
  );
}
