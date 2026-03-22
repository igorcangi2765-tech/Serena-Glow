import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../LanguageContext';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, icon }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer"
      >
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-[14px] pointer-events-none group-focus-within:text-pink-500 transition-colors">
              {icon}
            </div>
          )}
          <div className={`
            w-full h-[46px] ${icon ? 'pl-12' : 'pl-4'} pr-10 flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-700 dark:text-white group-hover:border-pink-200 dark:group-hover:border-pink-500/30 transition-all duration-300
            ${isOpen ? 'border-pink-400 dark:border-pink-500 shadow-lg shadow-pink-500/5 ring-2 ring-pink-500/10' : ''}
          `}>
            {value || placeholder || '--'}
          </div>
          <ChevronDown 
            className={`absolute right-4 top-[14px] text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : ''}`} 
            size={18} 
          />
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
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-2.5 rounded-xl cursor-pointer text-sm flex items-center justify-between transition-all duration-200
                    ${value === option 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md shadow-pink-500/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600'}
                  `}
                >
                  {option}
                  {value === option && <Check size={14} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
