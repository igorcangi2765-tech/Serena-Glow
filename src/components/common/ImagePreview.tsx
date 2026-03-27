import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!images.length) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-500">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out"
          />

          {/* Controls Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
            <div className="text-white/60 font-mono text-sm tracking-widest uppercase bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {currentIndex + 1} <span className="mx-2 text-white/20">/</span> {images.length}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setIsFullScreen(!isFullScreen); }}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
                aria-label="Toggle fullscreen"
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-pink-500 text-white rounded-full transition-all border border-white/10 backdrop-blur-md shadow-lg"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 lg:p-20 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className={`flex items-center justify-center w-full h-full ${isFullScreen ? 'p-0' : 'p-2'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <SafeImage
                  src={images[currentIndex]}
                  alt={`Preview ${currentIndex + 1}`}
                  className={`max-w-full max-h-full object-contain shadow-2xl transition-all duration-700 select-none ${isFullScreen ? 'rounded-none' : 'rounded-2xl border border-white/20'}`}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-8 p-4 md:p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/5 backdrop-blur-sm group z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 md:right-8 p-4 md:p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/5 backdrop-blur-sm group z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Strip (Optional but nice for UX) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 z-20">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-pink-500' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <SafeImage src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
