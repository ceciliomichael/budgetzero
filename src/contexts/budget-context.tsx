"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetCategory, Transaction, BudgetSummary, AppSettings } from '@/lib/types';
import { budgetStorage, transactionStorage, settingsStorage } from '@/lib/storage';

type Theme = 'light' | 'dark' | 'system';

type BudgetContextType = {
  // Settings
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  formatCurrency: (amount: number) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';

  // Budgets
  budgets: Budget[];
  currentBudget: Budget | null;
  getBudget: (id: string) => Budget | null;
  setCurrentBudget: (budgetId: string | null) => void;
  saveBudget: (budget: Budget) => Budget;
  createBudget: (budgetData: Omit<Budget, 'id'>) => Budget;
  deleteBudget: (id: string) => void;
  
  // Categories
  addCategory: (budgetId: string, category: Omit<BudgetCategory, 'id'>) => void;
  updateCategory: (budgetId: string, category: BudgetCategory) => void;
  deleteCategory: (budgetId: string, categoryId: string) => void;
  
  // Transactions
  transactions: Transaction[];
  saveTransaction: (transaction: Transaction) => Transaction;
  createTransaction: (transactionData: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;
  
  // Analytics
  getBudgetSummary: (budgetId?: string) => BudgetSummary;
  getBudgetTransactions: (budgetId?: string) => Transaction[];
  
  // Status
  isLoading: boolean;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBudget, setCurrentBudgetState] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(settingsStorage.getSettings());
  const [theme, rawSetTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedBudgets = budgetStorage.getBudgets();
      setBudgets(storedBudgets);
      
      const storedTransactions = transactionStorage.getTransactions();
      setTransactions(storedTransactions);
      
      const current = budgetStorage.getCurrentBudget();
      setCurrentBudgetState(current);

      const storedSettings = settingsStorage.getSettings();
      setSettings(storedSettings);
      rawSetTheme(storedSettings.theme);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Theme management
  const setTheme = (newTheme: Theme) => {
    updateSetting('theme', newTheme);
    rawSetTheme(newTheme);
  };

  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      systemTheme === 'dark' 
        ? document.documentElement.classList.add('dark') 
        : document.documentElement.classList.remove('dark');
    } else {
      setResolvedTheme(theme);
      theme === 'dark'
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      newTheme === 'dark'
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Settings functions
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      settingsStorage.saveSettings(newSettings);
      return newSettings;
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  // Budget functions
  const getBudget = (id: string): Budget | null => {
    return budgets.find(budget => budget.id === id) || null;
  };

  const setCurrentBudget = (budgetId: string | null): void => {
    if (!budgetId) {
      setCurrentBudgetState(null);
      localStorage.removeItem('budget_app_current_budget');
      return;
    }
    
    const budget = getBudget(budgetId);
    if (budget) {
      setCurrentBudgetState(budget);
      budgetStorage.setCurrentBudget(budgetId);
    }
  };

  const saveBudget = (budget: Budget): Budget => {
    const updatedBudget = budgetStorage.saveBudget(budget);
    setBudgets(prev => {
      const existingIndex = prev.findIndex(b => b.id === budget.id);
      
      if (existingIndex >= 0) {
        return prev.map(b => b.id === budget.id ? updatedBudget : b);
      }
      
      return [...prev, updatedBudget];
    });
    
    // Update current budget if it's the one we just saved
    if (currentBudget && currentBudget.id === updatedBudget.id) {
      setCurrentBudgetState(updatedBudget);
    }
    
    return updatedBudget;
  };

  const createBudget = (budgetData: Omit<Budget, 'id'>): Budget => {
    const newBudget = budgetStorage.createBudget(budgetData);
    setBudgets(prev => [...prev, newBudget]);
    return newBudget;
  };

  const deleteBudget = (id: string): void => {
    // Get category IDs before deleting the budget
    const budgetToDelete = budgets.find(b => b.id === id);
    if (!budgetToDelete) return;
    const categoryIdsToDelete = budgetToDelete.categories.map(c => c.id);

    budgetStorage.deleteBudget(id);
    
    // Update budgets state
    setBudgets(prev => prev.filter(budget => budget.id !== id));
    
    // Update transactions state
    setTransactions(prev => prev.filter(tx => !categoryIdsToDelete.includes(tx.categoryId)));

    // If we deleted the current budget, clear the current budget
    if (currentBudget && currentBudget.id === id) {
      setCurrentBudgetState(null);
    }
  };

  // Category functions
  const addCategory = (budgetId: string, category: Omit<BudgetCategory, 'id'>): void => {
    const budget = getBudget(budgetId);
    if (!budget) return;
    
    const newCategory: BudgetCategory = {
      ...category,
      id: uuidv4(),
    };
    
    const updatedBudget: Budget = {
      ...budget,
      categories: [...budget.categories, newCategory],
      totalBudget: budget.totalBudget + category.amount
    };
    
    saveBudget(updatedBudget);
  };

  const updateCategory = (budgetId: string, category: BudgetCategory): void => {
    const budget = getBudget(budgetId);
    if (!budget) return;
    
    const oldCategory = budget.categories.find(c => c.id === category.id);
    const amountDiff = oldCategory ? category.amount - oldCategory.amount : category.amount;
    
    const updatedBudget: Budget = {
      ...budget,
      categories: budget.categories.map(c => c.id === category.id ? category : c),
      totalBudget: budget.totalBudget + amountDiff
    };
    
    saveBudget(updatedBudget);
  };

  const deleteCategory = (budgetId: string, categoryId: string): void => {
    const budget = getBudget(budgetId);
    if (!budget) return;
    
    const category = budget.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Remove category from budget
    const updatedBudget: Budget = {
      ...budget,
      categories: budget.categories.filter(c => c.id !== categoryId),
      totalBudget: budget.totalBudget - category.amount
    };
    
    saveBudget(updatedBudget);
    
    // Also delete any transactions associated with this category
    transactionStorage.deleteTransactionsByCategory(categoryId);
    setTransactions(prev => prev.filter(tx => tx.categoryId !== categoryId));
  };

  // Transaction functions
  const saveTransaction = (transaction: Transaction): Transaction => {
    const updatedTransaction = transactionStorage.saveTransaction(transaction);
    
    setTransactions(prev => {
      const existingIndex = prev.findIndex(t => t.id === transaction.id);
      
      if (existingIndex >= 0) {
        return prev.map(t => t.id === transaction.id ? updatedTransaction : t);
      }
      
      return [...prev, updatedTransaction];
    });
    
    return updatedTransaction;
  };

  const createTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
    const newTransaction = transactionStorage.createTransaction(transactionData);
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };

  const deleteTransaction = (id: string): void => {
    transactionStorage.deleteTransaction(id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Analytics functions
  const getBudgetTransactions = (budgetId?: string): Transaction[] => {
    const targetBudget = budgetId 
      ? getBudget(budgetId) 
      : currentBudget;
    
    if (!targetBudget) return [];
    
    const categoryIds = targetBudget.categories.map(c => c.id);
    return transactions.filter(tx => categoryIds.includes(tx.categoryId));
  };

  const getBudgetSummary = (budgetId?: string): BudgetSummary => {
    const targetBudget = budgetId 
      ? getBudget(budgetId) 
      : currentBudget;
    
    if (!targetBudget) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        percentUsed: 0,
        categorySummaries: []
      };
    }
    
    const budgetTransactions = getBudgetTransactions(targetBudget.id);
    
    // Calculate total spent
    const totalSpent = budgetTransactions
      .filter(tx => !tx.isIncome)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate remaining budget
    const totalRemaining = targetBudget.totalBudget - totalSpent;
    const percentUsed = targetBudget.totalBudget > 0 
      ? (totalSpent / targetBudget.totalBudget) * 100 
      : 0;
    
    // Calculate per-category summaries
    const categorySummaries = targetBudget.categories.map(category => {
      const categoryTransactions = budgetTransactions
        .filter(tx => tx.categoryId === category.id && !tx.isIncome);
        
      const spent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const remaining = category.amount - spent;
      const percentUsed = category.amount > 0 ? (spent / category.amount) * 100 : 0;
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        budgeted: category.amount,
        spent,
        remaining,
        percentUsed
      };
    });
    
    return {
      totalBudget: targetBudget.totalBudget,
      totalSpent,
      totalRemaining,
      percentUsed,
      categorySummaries
    };
  };

  const value = {
    settings,
    updateSetting,
    formatCurrency,
    theme,
    setTheme,
    resolvedTheme,

    budgets,
    currentBudget,
    getBudget,
    setCurrentBudget,
    saveBudget,
    createBudget,
    deleteBudget,
    
    addCategory,
    updateCategory,
    deleteCategory,
    
    transactions,
    saveTransaction,
    createTransaction,
    deleteTransaction,
    
    getBudgetSummary,
    getBudgetTransactions,
    
    isLoading,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  
  return context;
} 