import { useState } from 'react';
import { REMEMBER_OBJECTS } from '../models/GameSession';

interface ObjectCardVisualProps {
  imageUrl?: string;
  name?: string;
  emoji?: string;
  className?: string;
  imgClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function ObjectCardVisual({
  imageUrl,
  name,
  emoji,
  className = 'w-12 h-12',
  imgClassName = 'w-full h-full object-contain',
  onError,
}: ObjectCardVisualProps) {
  const [hasError, setHasError] = useState(false);

  // Lookup object from registry if emoji not explicitly passed
  const found = !emoji && imageUrl 
    ? REMEMBER_OBJECTS.find(o => o.imageUrl === imageUrl || o.id === imageUrl) 
    : undefined;
  const displayEmoji = emoji || found?.emoji || '🌸';
  const displayName = name || found?.name;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {!hasError && imageUrl ? (
        <img
          src={imageUrl}
          alt={displayName || 'Object'}
          className={imgClassName}
          loading="eager"
          onError={(e) => {
            setHasError(true);
            onError?.(e);
          }}
        />
      ) : (
        <span className="text-3xl sm:text-4xl select-none leading-none" role="img" aria-label={displayName || 'Object'}>
          {displayEmoji}
        </span>
      )}
    </div>
  );
}
