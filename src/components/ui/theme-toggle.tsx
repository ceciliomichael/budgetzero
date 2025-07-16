"use client";

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { useBudget } from '@/contexts/budget-context';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'default',
  size = 'md',
  className = ''
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useBudget();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={`rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 ${sizeClasses[size]} ${className}`}
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? (
          <FaSun className="text-yellow-500" />
        ) : (
          <FaMoon className="text-slate-700" />
        )}
      </button>
    );
  }
  
  // Minimal variant (just buttons)
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-full ${theme === 'light' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} ${sizeClasses[size]}`}
          aria-label="Light theme"
        >
          <FaSun className={theme === 'light' ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'} />
        </button>
        
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-full ${theme === 'system' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} ${sizeClasses[size]}`}
          aria-label="System theme"
        >
          <FaDesktop className={theme === 'system' ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'} />
        </button>
        
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} ${sizeClasses[size]}`}
          aria-label="Dark theme"
        >
          <FaMoon className={theme === 'dark' ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'} />
        </button>
      </div>
    );
  }
  
  // Default variant (full)
  return (
    <div className={`inline-flex items-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1.5 ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors ${sizeClasses[size]}`}
      >
        <FaSun className={theme === 'light' ? 'text-yellow-500' : ''} />
        <span>Light</span>
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 px-3 py-1.5 ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors ${sizeClasses[size]}`}
      >
        <FaDesktop className={theme === 'system' ? 'text-blue-500' : ''} />
        <span>System</span>
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1.5 ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors ${sizeClasses[size]}`}
      >
        <FaMoon className={theme === 'dark' ? 'text-indigo-500' : ''} />
        <span>Dark</span>
      </button>
    </div>
  );
} 