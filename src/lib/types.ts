// Types for budget tracking app

export type BudgetCategory = {
  id: string;
  name: string;
  amount: number;
  color: string;
  icon?: string;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  isIncome: boolean;
};

export type Budget = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  totalBudget: number;
};

export type AppSettings = {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
};

export type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentUsed: number;
  categorySummaries: {
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentUsed: number;
  }[];
}; 