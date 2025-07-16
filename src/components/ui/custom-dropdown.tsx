"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

type Option = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function CustomDropdown({ options, value, onChange, placeholder = "Select an option" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="relative w-full md:w-64" ref={dropdownRef}>
      <button
        type="button"
        className="w-full flex items-center justify-between bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className={`ml-2 transition-transform duration-200`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-300 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {options.map(option => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-500/10 ${selectedOption?.value === option.value ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-3 py-2 text-slate-500 dark:text-slate-400">No options available</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
} 