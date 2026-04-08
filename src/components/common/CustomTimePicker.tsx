import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../LanguageContext';

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange, label }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer"
      >
        <div className="relative group">
          <Clock className="absolute left-4 top-[14px] text-pink-400 pointer-events-none group-focus-within:text-pink-500 transition-colors" size={18} />
          <div className={`
            w-full h-[46px] pl-12 pr-4 flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-700 dark:text-white group-hover:border-pink-200 dark:group-hover:border-pink-500/30 transition-all duration-300
            ${isOpen ? 'border-pink-400 dark:border-pink-500 shadow-lg shadow-pink-500/5 ring-2 ring-pink-500/10' : ''}
          `}>
            {value || label || '--:--'}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute z-[100] mt-2 left-0 right-0 max-h-64 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-y-auto backdrop-blur-xl custom-scrollbar"
          >
            <div className="p-2 space-y-1">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  onClick={() => handleSelect(time)}
                  className={`
                    px-4 py-2.5 rounded-xl cursor-pointer text-sm flex items-center justify-between transition-all duration-200
                    ${value === time 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md shadow-pink-500/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600'}
                  `}
                >
                  {time}
                  {value === time && <Check size={14} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomTimePicker;
