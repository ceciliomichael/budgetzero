"use client";

import { useState } from 'react';
import { FaPlus, FaWallet, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import BudgetForm from '@/components/budget/budget-form';
import BudgetSummary from '@/components/budget/budget-summary';
import TransactionList from '@/components/transaction/transaction-list';
import { useBudget } from '@/contexts/budget-context';
import BudgetChart from '@/components/analytics/chart';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CustomDropdown } from '@/components/ui/custom-dropdown';

export default function Dashboard() {
  const { isLoading, budgets, currentBudget, setCurrentBudget, deleteBudget } = useBudget();
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <FaWallet className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleBudgetCreated = () => {
    setIsCreatingBudget(false);
  };

  const handleSelectBudget = (budgetId: string) => {
    setCurrentBudget(budgetId);
  };

  const handleDeleteBudget = () => {
    if (!currentBudget) return;
    if (window.confirm(`Are you sure you want to delete the budget "${currentBudget.name}"? This action cannot be undone.`)) {
      deleteBudget(currentBudget.id);
    }
  };

  // If creating a new budget, show the form
  if (isCreatingBudget) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Button
          variant="outline"
          onClick={() => setIsCreatingBudget(false)}
          className="mb-4 bg-glass"
        >
          ← Back to Dashboard
        </Button>
        <BudgetForm onSuccess={handleBudgetCreated} />
      </motion.div>
    );
  }

  // If no budgets exist, show a welcome screen
  if (budgets.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30"
        >
          <FaWallet className="text-white text-5xl" />
          <div className="absolute w-full h-full rounded-full bg-blue-500/20 animate-ping -z-10"></div>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-4 text-slate-900 dark:text-white"
        >
          Welcome to BudgetZero
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-slate-400 max-w-md mb-8"
        >
          Take control of your finances. Create your first budget to start tracking your spending and savings.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => setIsCreatingBudget(true)} className="gap-2" size="lg">
            <FaPlus /> Create Your First Budget
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Budget selector and actions */}
      <GlassmorphismCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-gradient">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              An overview of your selected budget
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CustomDropdown
              value={currentBudget?.id || ''}
              onChange={handleSelectBudget}
              options={budgets.map(b => ({ value: b.id, label: b.name }))}
              placeholder="Select a Budget"
            />
            <div className="flex items-center gap-2 bg-glass p-1 rounded-md">
              <Button onClick={() => setIsCreatingBudget(true)} className="gap-1" size="sm" variant="ghost">
                <FaPlus size={12} /> New
              </Button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
              <Button
                onClick={handleDeleteBudget}
                variant="ghost"
                size="sm"
                className="gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-500 disabled:text-red-500/50"
                disabled={!currentBudget}
              >
                <FaTrash size={12} />
              </Button>
            </div>
          </div>
        </div>
      </GlassmorphismCard>
      
      <AnimatePresence>
        {currentBudget && (
          <motion.div
            key={currentBudget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Budget Summary */}
            <BudgetSummary />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column: Charts */}
              <div className="lg:col-span-3">
                <BudgetChart />
              </div>

              {/* Right Column: Recent Transactions */}
              <div className="lg:col-span-2">
                <TransactionList limit={5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 