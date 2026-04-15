import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../LanguageContext';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const locale = language === 'pt' ? pt : enUS;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onDateClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5">
      <button 
        type="button"
        onClick={prevMonth}
        className="p-1 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-full transition-colors text-gray-400 hover:text-pink-500"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-semibold capitalize bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        {format(currentMonth, 'MMMM yyyy', { locale })}
      </span>
      <button 
        type="button"
        onClick={nextMonth}
        className="p-1 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-full transition-colors text-gray-400 hover:text-pink-500"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center py-2">
          {format(addDays(startDate, i), 'eee', { locale })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-gray-50 dark:border-white/5">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale });
    const endDate = endOfWeek(monthEnd, { locale });

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {calendarDays.map((day) => {
          const isSelected = value && isSameDay(day, new Date(value));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                relative h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer text-sm transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600'}
                ${isSelected ? 'bg-gradient-to-br from-pink-500 to-rose-500 !text-white shadow-lg shadow-pink-500/30' : ''}
                ${isToday && !isSelected ? 'border border-pink-200 dark:border-pink-500/30' : ''}
              `}
            >
              {format(day, 'd')}
              {isToday && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-pink-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer"
      >
        <div className="relative group">
          <CalendarIcon className="absolute left-4 top-[14px] text-pink-400 pointer-events-none group-focus-within:text-pink-500 transition-colors" size={18} />
          <div className={`
            w-full h-[46px] pl-12 pr-4 flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-gray-700 dark:text-white group-hover:border-pink-200 dark:group-hover:border-pink-500/30 transition-all duration-300
            ${isOpen ? 'border-pink-400 dark:border-pink-500 shadow-lg shadow-pink-500/5 ring-2 ring-pink-500/10' : ''}
          `}>
            {value ? format(new Date(value), 'PPP', { locale }) : (label || '--/--/----')}
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
            className="absolute z-[100] mt-2 left-0 right-0 md:w-80 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden backdrop-blur-xl"
          >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="p-3 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex justify-end">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-pink-600 hover:text-pink-700 px-3 py-1 rounded-full hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
              >
                {language === 'pt' ? 'Fechar' : 'Close'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDatePicker;
