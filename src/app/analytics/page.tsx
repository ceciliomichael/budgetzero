"use client";

import { useState } from 'react';
import { FaChartPie, FaChartBar } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BudgetChart from '@/components/analytics/chart';
import { useBudget } from '@/contexts/budget-context';

export default function Analytics() {
  const { budgets, currentBudget, setCurrentBudget, getBudgetSummary, formatCurrency } = useBudget();
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>(currentBudget?.id || '');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const budgetId = e.target.value;
    setSelectedBudgetId(budgetId);
    setCurrentBudget(budgetId);
  };
  
  const selectedBudget = budgets.find(budget => budget.id === selectedBudgetId) || currentBudget;
  const summary = selectedBudget ? getBudgetSummary(selectedBudget.id) : null;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">
            Budget Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Analyze your spending patterns and budget trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white shadow-sm focus:ring focus:ring-blue-500/20"
            value={selectedBudgetId || ''}
            onChange={handleBudgetChange}
          >
            <option value="" disabled>
              Select Budget
            </option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
          
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 ${chartType === 'pie' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}
              title="Pie Chart"
            >
              <FaChartPie />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 ${chartType === 'bar' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400'}`}
              title="Bar Chart"
            >
              <FaChartBar />
            </button>
          </div>
        </div>
      </div>
      
      {!selectedBudget ? (
        <Card className="text-center p-8">
          <p className="text-slate-500 dark:text-slate-400">
            No budget selected. Please create or select a budget to view analytics.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Main Chart */}
          <BudgetChart budget={selectedBudget} type={chartType} />
          
          {/* Budget Analytics and Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {summary && summary.categorySummaries.length > 0 ? (
                  <div className="space-y-4">
                    {summary.categorySummaries
                      .sort((a, b) => b.spent - a.spent)
                      .map((category) => {
                        const categoryInfo = selectedBudget.categories.find(c => c.id === category.categoryId);
                        return (
                          <div key={category.categoryId} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: categoryInfo?.color || '#cbd5e1' }}
                                ></div>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {category.categoryName}
                                </span>
                              </div>
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {formatCurrency(category.spent)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                                style={{ width: `${(category.spent / summary.totalSpent) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                              {((category.spent / summary.totalSpent) * 100).toFixed(1)}% of total spending
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400">
                    No spending data available for this budget.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="mb-4">Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                {summary && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Budget</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {formatCurrency(summary.totalBudget)}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Spent</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {formatCurrency(summary.totalSpent)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Remaining Budget</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {formatCurrency(summary.totalRemaining)}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${
                            summary.percentUsed >= 100 ? 'bg-red-500' : 
                            summary.percentUsed >= 85 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                        {summary.percentUsed.toFixed(1)}% used
                      </div>
                    </div>
                    
                    {/* Budget Alerts */}
                    {summary.categorySummaries.filter(cat => cat.percentUsed >= 90).length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-lg">
                        <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">Budget Alerts</h4>
                        <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                          {summary.categorySummaries
                            .filter(cat => cat.percentUsed >= 90)
                            .map(cat => (
                              <li key={cat.categoryId}>
                                <strong>{cat.categoryName}</strong> is {cat.percentUsed >= 100 ? 'over budget' : 'almost depleted'} ({cat.percentUsed.toFixed(0)}%)
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 