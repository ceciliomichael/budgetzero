"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { generateCalendarGrid, getMonthName, formatISODate, getYearOptions } from '@/lib/date-utils';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function DatePicker({ value, onChange, error }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarGrid = generateCalendarGrid(year, month);
  const today = new Date();
  const yearOptions = getYearOptions(new Date().getFullYear());
  const monthNames = Array.from({ length: 12 }, (_, i) => getMonthName(i));

  const handleDayClick = (day: Date) => {
    onChange(formatISODate(day));
    setIsOpen(false);
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleMonthSelect = (selectedMonth: number) => {
    setCurrentDate(new Date(year, selectedMonth, 1));
  };
  
  const handleYearSelect = (selectedYear: number) => {
    setCurrentDate(new Date(selectedYear, month, 1));
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={datePickerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-10 w-full items-center rounded-md border bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
        >
          <FaCalendarAlt className="text-slate-500 mr-2" />
          <span className="text-slate-900 dark:text-white">{value ? new Date(value).toLocaleDateString() : 'Select a date'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-1 w-full md:w-80 bg-glass-strong rounded-lg shadow-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-slate-500/10"><FaChevronLeft /></button>
              <div className="flex items-center gap-2">
                <select 
                  value={month} 
                  onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                  className="bg-transparent font-bold text-lg text-slate-900 dark:text-white border-none focus:ring-0"
                >
                  {monthNames.map((name, index) => (
                    <option key={name} value={index} className="text-slate-900 dark:text-black">{name}</option>
                  ))}
                </select>
                <select 
                  value={year} 
                  onChange={(e) => handleYearSelect(parseInt(e.target.value))}
                  className="bg-transparent font-bold text-lg text-slate-900 dark:text-white border-none focus:ring-0"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y} className="text-slate-900 dark:text-black">{y}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-slate-500/10"><FaChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 dark:text-slate-400 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.flat().map((day, index) => (
                <div key={index} className="flex justify-center items-center">
                  {day && (
                    <button
                      onClick={() => handleDayClick(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors 
                        ${formatISODate(day) === value ? 'bg-blue-600 text-white font-bold' : ''} 
                        ${formatISODate(day) !== value && formatISODate(day) === formatISODate(today) ? 'bg-slate-200 dark:bg-slate-700' : ''}
                        ${formatISODate(day) !== value ? 'hover:bg-slate-500/20 text-slate-800 dark:text-slate-200' : ''}
                      `}
                    >
                      {day.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
} 