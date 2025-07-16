"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaSave, FaTrash, FaDownload, FaUpload, FaMoon, FaSun, FaDesktop, FaBell, FaBellSlash, FaGlobe } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { Input, Select } from '@/components/ui/input';
import { settingsStorage, storageUtils } from '@/lib/storage';
import { AppSettings } from '@/lib/types';
import { useBudget } from '@/contexts/budget-context';

export default function Settings() {
  const { settings, updateSetting, theme, setTheme } = useBudget();
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Update theme when settings change
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  const handleSettingsChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSetting(key, value);
  };

  const handleSaveSettings = () => {
    // Settings are saved on change via context, so this could just be for user feedback
    setSaveMessage({
      message: 'Settings updated successfully',
      type: 'success',
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  const handleClearAllData = () => {
    if (isDeletingData) {
      storageUtils.clearAllData();
      setIsDeletingData(false);
      setSaveMessage({
        message: 'All data has been cleared. Refreshing page...',
        type: 'success',
      });

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setIsDeletingData(true);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletingData(false);
  };

  const handleExportData = () => {
    const jsonData = storageUtils.exportData();
    const dataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'budget-data.json';
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result;
      if (typeof contents === 'string') {
        const success = storageUtils.importData(contents);
        if (success) {
          setSaveMessage({
            message: 'Data imported successfully. Refreshing page...',
            type: 'success',
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setSaveMessage({
            message: 'Error importing data. Please check your file format.',
            type: 'error',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2 text-gradient">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Customize your BudgetZero experience
        </p>
      </motion.div>

      {saveMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
        >
          {saveMessage.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <motion.div variants={itemVariants}>
          <GlassmorphismCard 
            variant="strong" 
            hoverEffect 
            animation="none"
            className="h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Settings</h2>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-secondary-300 flex items-center justify-center">
                <FaGlobe className="text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Currency
                </label>
                <Select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange('currency', e.target.value)}
                  options={[
                    { value: 'PHP', label: 'PHP - Philippine Peso' },
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'JPY', label: 'JPY - Japanese Yen' },
                    { value: 'CAD', label: 'CAD - Canadian Dollar' },
                    { value: 'AUD', label: 'AUD - Australian Dollar' },
                  ]}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center rounded-xl p-4 transition-all duration-300 ${
                      theme === 'light' 
                        ? 'bg-white shadow-lg border-2 border-brand-primary-500 dark:bg-slate-800' 
                        : 'bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white hover:dark:bg-slate-800'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      theme === 'light' 
                        ? 'bg-brand-primary-100 text-brand-primary-500' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      <FaSun className="text-xl" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center rounded-xl p-4 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white shadow-lg border-2 border-brand-primary-500 dark:bg-slate-800' 
                        : 'bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white hover:dark:bg-slate-800'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      theme === 'dark' 
                        ? 'bg-brand-primary-100 text-brand-primary-500' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      <FaMoon className="text-xl" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center rounded-xl p-4 transition-all duration-300 ${
                      theme === 'system' 
                        ? 'bg-white shadow-lg border-2 border-brand-primary-500 dark:bg-slate-800' 
                        : 'bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white hover:dark:bg-slate-800'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      theme === 'system' 
                        ? 'bg-brand-primary-100 text-brand-primary-500' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      <FaDesktop className="text-xl" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block h-6 rounded-full transition-colors duration-300 ${settings.notifications ? 'bg-brand-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${settings.notifications ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      {settings.notifications ? <FaBell className="text-brand-primary-500" /> : <FaBellSlash className="text-slate-500" />}
                      Notifications
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Receive notifications for budget alerts and reminders
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button onClick={handleSaveSettings} className="gap-2 w-full sm:w-auto bg-gradient-to-r from-brand-primary-600 to-brand-primary-500 hover:from-brand-primary-700 hover:to-brand-primary-600 text-white">
                <FaSave /> Save Settings
              </Button>
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={itemVariants}>
          <GlassmorphismCard 
            variant="strong" 
            hoverEffect 
            animation="none"
            className="h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Management</h2>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-accent-300 to-brand-accent-500 flex items-center justify-center">
                <FaDownload className="text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-medium text-slate-900 dark:text-white mb-1 flex items-center gap-1">
                  <FaDownload className="text-brand-primary-500" /> Export Data
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Download a backup of all your budget data
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleExportData} 
                  className="gap-2 w-full border-brand-primary-200 dark:border-brand-primary-900 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20"
                >
                  <FaDownload className="text-brand-primary-500" /> Export Data
                </Button>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-medium text-slate-900 dark:text-white mb-1 flex items-center gap-1">
                  <FaUpload className="text-brand-primary-500" /> Import Data
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Restore your data from a previous backup
                </p>
                <label className="flex">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="gap-2 w-full border-brand-primary-200 dark:border-brand-primary-900 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20" 
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  >
                    <FaUpload className="text-brand-primary-500" /> Import Data
                  </Button>
                </label>
              </motion.div>

              <motion.div 
                className={`p-5 rounded-xl shadow-sm border ${
                  isDeletingData 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
                whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className={`font-medium mb-1 flex items-center gap-1 ${
                  isDeletingData ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'
                }`}>
                  <FaTrash className={isDeletingData ? 'text-red-500' : 'text-slate-500'} /> Clear All Data
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {isDeletingData
                    ? 'Are you sure? This will permanently delete all your budgets and transactions.'
                    : 'Delete all your budget data and start fresh'}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant={isDeletingData ? 'danger' : 'outline'}
                    onClick={handleClearAllData}
                    className={`gap-2 ${
                      isDeletingData 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20'
                    } w-full`}
                  >
                    <FaTrash /> {isDeletingData ? 'Confirm Delete' : 'Clear All Data'}
                  </Button>

                  {isDeletingData && (
                    <Button variant="outline" onClick={handleCancelDelete} className="w-full">
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </motion.div>
  );
} 