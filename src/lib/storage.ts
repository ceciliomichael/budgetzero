import { v4 as uuidv4 } from 'uuid';
import { Budget, Transaction, AppSettings, BudgetCategory } from './types';

// Storage keys
const STORAGE_KEYS = {
  BUDGETS: 'budget_app_budgets',
  TRANSACTIONS: 'budget_app_transactions',
  SETTINGS: 'budget_app_settings',
  CURRENT_BUDGET: 'budget_app_current_budget',
};

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  currency: 'PHP',
  theme: 'system',
  notifications: true,
};

// Helper to safely parse JSON from localStorage
const safelyParseJSON = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper to safely save JSON to localStorage
const safelySaveJSON = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Budget storage service
export const budgetStorage = {
  // Get all budgets
  getBudgets: (): Budget[] => {
    return safelyParseJSON<Budget[]>(STORAGE_KEYS.BUDGETS, []);
  },
  
  // Get a single budget by id
  getBudget: (id: string): Budget | null => {
    const budgets = budgetStorage.getBudgets();
    return budgets.find(budget => budget.id === id) || null;
  },
  
  // Get the current active budget
  getCurrentBudget: (): Budget | null => {
    const currentBudgetId = safelyParseJSON<string | null>(STORAGE_KEYS.CURRENT_BUDGET, null);
    if (!currentBudgetId) return null;
    
    return budgetStorage.getBudget(currentBudgetId);
  },
  
  // Set the current active budget
  setCurrentBudget: (budgetId: string): void => {
    safelySaveJSON(STORAGE_KEYS.CURRENT_BUDGET, budgetId);
  },
  
  // Save a budget
  saveBudget: (budget: Budget): Budget => {
    const budgets = budgetStorage.getBudgets();
    const existingIndex = budgets.findIndex(b => b.id === budget.id);
    
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    
    safelySaveJSON(STORAGE_KEYS.BUDGETS, budgets);
    return budget;
  },
  
  // Create a new budget
  createBudget: (budgetData: Omit<Budget, 'id'>): Budget => {
    const newBudget: Budget = {
      ...budgetData,
      id: uuidv4(),
    };
    
    return budgetStorage.saveBudget(newBudget);
  },
  
  // Delete a budget
  deleteBudget: (id: string): void => {
    // First, delete all associated transactions
    transactionStorage.deleteTransactionsByBudget(id);
    
    const budgets = budgetStorage.getBudgets().filter(budget => budget.id !== id);
    safelySaveJSON(STORAGE_KEYS.BUDGETS, budgets);
    
    // If we deleted the current budget, clear the current budget
    const currentBudgetId = safelyParseJSON<string | null>(STORAGE_KEYS.CURRENT_BUDGET, null);
    if (currentBudgetId === id) {
      safelySaveJSON(STORAGE_KEYS.CURRENT_BUDGET, null);
    }
  },
};

// Transaction storage service
export const transactionStorage = {
  // Get all transactions
  getTransactions: (): Transaction[] => {
    return safelyParseJSON<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  },
  
  // Get transactions for a specific budget
  getBudgetTransactions: (budgetId: string): Transaction[] => {
    const budget = budgetStorage.getBudget(budgetId);
    if (!budget) return [];
    
    const transactions = transactionStorage.getTransactions();
    const categoryIds = budget.categories.map(cat => cat.id);
    
    return transactions.filter(tx => categoryIds.includes(tx.categoryId));
  },
  
  // Save a transaction
  saveTransaction: (transaction: Transaction): Transaction => {
    const transactions = transactionStorage.getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    safelySaveJSON(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transaction;
  },
  
  // Create a new transaction
  createTransaction: (transactionData: Omit<Transaction, 'id'>): Transaction => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
    };
    
    return transactionStorage.saveTransaction(newTransaction);
  },
  
  // Delete a transaction
  deleteTransaction: (id: string): void => {
    const transactions = transactionStorage.getTransactions().filter(tx => tx.id !== id);
    safelySaveJSON(STORAGE_KEYS.TRANSACTIONS, transactions);
  },
  
  // Delete all transactions for a category
  deleteTransactionsByCategory: (categoryId: string): void => {
    const transactions = transactionStorage.getTransactions()
      .filter(tx => tx.categoryId !== categoryId);
    safelySaveJSON(STORAGE_KEYS.TRANSACTIONS, transactions);
  },
  
  // Delete all transactions for a budget
  deleteTransactionsByBudget: (budgetId: string): void => {
    const budget = budgetStorage.getBudget(budgetId);
    if (!budget) return;

    const categoryIds = budget.categories.map(cat => cat.id);
    const transactions = transactionStorage.getTransactions()
      .filter(tx => !categoryIds.includes(tx.categoryId));
    safelySaveJSON(STORAGE_KEYS.TRANSACTIONS, transactions);
  }
};

// Settings storage service
export const settingsStorage = {
  // Get app settings
  getSettings: (): AppSettings => {
    return safelyParseJSON<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  
  // Save app settings
  saveSettings: (settings: AppSettings): void => {
    safelySaveJSON(STORAGE_KEYS.SETTINGS, settings);
  },
  
  // Update specific setting
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]): void => {
    const settings = settingsStorage.getSettings();
    settings[key] = value;
    settingsStorage.saveSettings(settings);
  },
};

// Utility functions
export const storageUtils = {
  // Clear all data (for reset/debug)
  clearAllData: (): void => {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
  
  // Export all data as JSON
  exportData: (): string => {
    const data = {
      budgets: budgetStorage.getBudgets(),
      transactions: transactionStorage.getTransactions(),
      settings: settingsStorage.getSettings(),
      currentBudgetId: safelyParseJSON<string | null>(STORAGE_KEYS.CURRENT_BUDGET, null),
    };
    
    return JSON.stringify(data);
  },
  
  // Import data from JSON
  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.budgets) safelySaveJSON(STORAGE_KEYS.BUDGETS, data.budgets);
      if (data.transactions) safelySaveJSON(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.settings) safelySaveJSON(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.currentBudgetId) safelySaveJSON(STORAGE_KEYS.CURRENT_BUDGET, data.currentBudgetId);
      
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }
}; 