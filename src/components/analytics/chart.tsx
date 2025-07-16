"use client";

import { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useBudget } from '@/contexts/budget-context';
import { Budget, BudgetCategory } from '@/lib/types';

type ChartType = 'pie' | 'bar';

type BudgetChartProps = {
  budget?: Budget;
  type?: ChartType;
};

export default function BudgetChart({ budget, type = 'pie' }: BudgetChartProps) {
  const { getBudgetSummary, currentBudget, formatCurrency } = useBudget();
  const [chartType, setChartType] = useState<ChartType>(type);
  
  const targetBudget = budget || currentBudget;
  const summary = targetBudget ? getBudgetSummary(targetBudget.id) : null;
  
  if (!targetBudget || !summary) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-slate-500 dark:text-slate-400">
            No budget data available. Please create or select a budget.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare pie chart data
  const pieChartData = targetBudget.categories.map(category => {
    const summaryCat = summary.categorySummaries.find(
      cat => cat.categoryId === category.id
    );
    
    return {
      name: category.name,
      value: summaryCat ? summaryCat.spent : 0,
      color: category.color,
      categoryId: category.id,
    };
  });
  
  // Prepare bar chart data for spent vs budget comparison
  const barChartData = targetBudget.categories.map(category => {
    const summaryCat = summary.categorySummaries.find(
      cat => cat.categoryId === category.id
    );
    
    return {
      name: category.name,
      Budget: category.amount,
      Spent: summaryCat ? summaryCat.spent : 0,
      color: category.color,
    };
  });
  
  const toggleChartType = () => {
    setChartType(chartType === 'pie' ? 'bar' : 'pie');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Analysis</CardTitle>
        <div>
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1 px-2 text-sm"
          >
            <option value="pie">Spending Breakdown</option>
            <option value="bar">Budget vs Actual</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {chartType === 'pie' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Budget" fill="#4f46e5" />
                <Bar dataKey="Spent" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Budget</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalBudget)}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Spent</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalSpent)}</div>
            </div>
          </div>
          
          <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Budget Utilization</div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {Math.round(summary.percentUsed)}%
              </div>
              <div className="w-3/4 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${
                    summary.percentUsed >= 100 ? 'bg-red-500' : 
                    summary.percentUsed >= 85 ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} 
                  style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 