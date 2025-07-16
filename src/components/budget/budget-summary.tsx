"use client";

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Budget, BudgetSummary as BudgetSummaryType } from '@/lib/types';
import { useBudget } from '@/contexts/budget-context';
import { GlassmorphismCard } from '../ui/glassmorphism-card';

type BudgetSummaryProps = {
  budget?: Budget;
};

export default function BudgetSummary({ budget }: BudgetSummaryProps) {
  const { getBudgetSummary, currentBudget, formatCurrency } = useBudget();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const targetBudget = budget || currentBudget;
  const summary = targetBudget ? getBudgetSummary(targetBudget.id) : null;
  
  if (!targetBudget || !summary) {
    return (
      <Card className="text-center p-8">
        <p className="text-slate-500 dark:text-slate-400">
          No budget selected. Please create or select a budget to view summary.
        </p>
      </Card>
    );
  }
  
  const getStatusColor = (percentUsed: number): string => {
    if (percentUsed >= 100) return 'bg-red-500';
    if (percentUsed >= 85) return 'bg-amber-500';
    if (percentUsed >= 70) return 'bg-yellow-300';
    return 'bg-green-500';
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <GlassmorphismCard variant="strong" className="p-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {targetBudget.name}
          </h3>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {new Date(targetBudget.startDate).toLocaleDateString()} - {new Date(targetBudget.endDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Budget: {formatCurrency(summary.totalBudget)}
            </div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formatCurrency(summary.totalSpent)} spent ({Math.round(summary.percentUsed)}%)
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getStatusColor(summary.percentUsed)}`} 
              style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Budget</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(summary.totalBudget)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Spent</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(summary.totalSpent)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Remaining</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(summary.totalRemaining)}
            </p>
          </div>
        </div>
      </div>
      
      <div 
        className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50 p-3 cursor-pointer hover:bg-slate-500/10 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            {isExpanded ? (
              <>
                <span>Hide Categories</span>
                <FaChevronUp size={12} />
              </>
            ) : (
              <>
                <span>Show Categories</span>
                <FaChevronDown size={12} />
              </>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {summary.categorySummaries.map((cat) => (
              <div key={cat.categoryId} className="px-6 py-4 hover:bg-slate-500/5 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: targetBudget.categories.find(c => c.id === cat.categoryId)?.color || '#cbd5e1' }}
                    ></div>
                    <span className="font-medium text-slate-900 dark:text-white">{cat.categoryName}</span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(cat.spent)} of {formatCurrency(cat.budgeted)}
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getStatusColor(cat.percentUsed)}`} 
                    style={{ width: `${Math.min(cat.percentUsed, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className={`text-xs font-medium ${cat.remaining < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {cat.remaining < 0 ? 'Over by ' : 'Remaining: '} 
                    {formatCurrency(Math.abs(cat.remaining))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
    </GlassmorphismCard>
  );
} 