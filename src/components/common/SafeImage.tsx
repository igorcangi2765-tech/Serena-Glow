import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff, Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * A robust image component that handles loading states, 
 * error fallbacks and ensures correct pathing for production.
 */
export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  fallbackSrc = '/images/hero_serena_glow.png',
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);

  // Normalize path: ensure it starts with / for public assets
  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    let processedSrc = src;
    if (src.startsWith('http')) {
      processedSrc = src;
    } else if (!src.startsWith('/')) {
      processedSrc = `/${src}`;
    }
    
    setCurrentSrc(processedSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.warn(`SafeImage: Failed to load ${currentSrc}. Falling back.`);
    setHasError(true);
    setIsLoaded(true); // Stop showing skeleton
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pink-100/50 dark:bg-pink-900/10 animate-pulse flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-pink-300 dark:text-pink-700 opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Fallback */}
      {hasError ? (
        <div className={`flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 p-4 ${className}`}>
          <ImageOff className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-center">
            {alt || 'Image Unavailable'}
          </span>
        </div>
      ) : (
        /* The Real Image */
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
