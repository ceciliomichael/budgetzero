"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBars, FaChartLine, FaDownload, FaUpload, FaCog, FaWallet, FaHome } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useBudget } from '@/contexts/budget-context';
import { storageUtils } from '@/lib/storage';

export default function Header() {
  const { budgets, currentBudget, setCurrentBudget, theme, resolvedTheme } = useBudget();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleExportData = () => {
    const jsonData = storageUtils.exportData();
    const dataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'budget-data.json';
    link.click();
    
    setIsExportOpen(false);
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (typeof contents === 'string') {
        const success = storageUtils.importData(contents);
        if (success) {
          window.location.reload();
        }
      }
    };
    reader.readAsText(file);
    
    setIsExportOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <FaHome /> },
    { href: '/analytics', label: 'Analytics', icon: <FaChartLine /> },
    { href: '/settings', label: 'Settings', icon: <FaCog /> }
  ];
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-dark-surface-1/80 backdrop-blur-md shadow-md' 
          : 'bg-gradient-to-r from-brand-primary-600 to-brand-primary-800 dark:from-brand-primary-900 dark:to-dark-surface-1'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className={`rounded-full ${
                scrolled 
                  ? 'bg-brand-primary-500 shadow-md' 
                  : 'bg-white shadow-lg'
              } p-2 transition-all duration-300`}
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            >
              <FaWallet className={`text-xl ${
                scrolled 
                  ? 'text-white' 
                  : 'text-brand-primary-600'
              } transition-colors duration-300`} />
            </motion.div>
            <h1 className={`text-xl font-bold ${
              scrolled 
                ? 'text-slate-900 dark:text-white' 
                : 'text-white'
            } transition-colors duration-300`}>
              BudgetZero
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-1.5 ${
                  scrolled 
                    ? 'text-slate-700 dark:text-slate-300 hover:text-brand-primary-600 dark:hover:text-white' 
                    : 'text-white/90 hover:text-white'
                } transition-colors relative group`}
              >
                <span className="text-brand-primary-400 group-hover:text-brand-primary-300 transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className={`${
                  scrolled 
                    ? 'bg-white/10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                } transition-colors`}
              >
                Import/Export
              </Button>
              
              {isExportOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-50 p-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    onClick={handleExportData}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <FaDownload className="text-brand-primary-500" />
                    <span>Export Data</span>
                  </button>
                  
                  <label className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer transition-colors">
                    <FaUpload className="text-brand-primary-500" />
                    <span>Import Data</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportData} 
                      className="hidden" 
                    />
                  </label>
                </motion.div>
              )}
            </div>
            
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              className={`p-2 rounded-md ${
                scrolled 
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } transition-colors`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.nav 
            className="mt-4 border-t border-white/10 dark:border-slate-700/50 pt-4 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      scrolled 
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' 
                        : 'hover:bg-white/10 text-white'
                    } transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-brand-primary-400">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button 
                  className={`flex items-center gap-2 p-2 rounded-md w-full text-left ${
                    scrolled 
                      ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' 
                      : 'hover:bg-white/10 text-white'
                  } transition-colors`}
                  onClick={handleExportData}
                >
                  <FaDownload className="text-brand-primary-400" /> Export Data
                </button>
              </li>
              <li>
                <label className={`flex items-center gap-2 p-2 rounded-md w-full cursor-pointer ${
                  scrolled 
                    ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' 
                    : 'hover:bg-white/10 text-white'
                } transition-colors`}>
                  <FaUpload className="text-brand-primary-400" /> Import Data
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportData} 
                    className="hidden" 
                  />
                </label>
              </li>
            </ul>
          </motion.nav>
        )}
      </div>
    </header>
  );
} 