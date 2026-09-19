import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { voiceInstructionService } from '../services/voice/VoiceInstructionService';
import { useLanguage } from '../context/LanguageContext';

interface HearInstructionsButtonProps {
  translationKey: string;
  params?: Record<string, string>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function HearInstructionsButton({
  translationKey,
  params,
  size = 'md',
  variant = 'primary',
  className = '',
}: HearInstructionsButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { translate } = useLanguage();

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = async () => {
    if (isSpeaking) {
      voiceInstructionService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await voiceInstructionService.speakInstruction({
        translationKey,
        params,
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Failed to speak instruction:', error);
      setIsSpeaking(false);
    }
  };

  const buttonText = translate('voice.hearInstructions');

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium
        flex items-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={!voiceInstructionService.isAvailable()}
      aria-label={buttonText}
    >
      {isSpeaking ? (
        <>
          <VolumeX size={iconSize[size]} className="animate-pulse" />
          <span>{translate('voice.speaking')}</span>
        </>
      ) : (
        <>
          <Volume2 size={iconSize[size]} />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
}
