"use client";

import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSave, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Budget, BudgetCategory } from '@/lib/types';
import { useBudget } from '@/contexts/budget-context';
import { v4 as uuidv4 } from 'uuid';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { DatePicker } from '@/components/ui/date-picker';

type BudgetFormProps = {
  existingBudget?: Budget;
  onSuccess?: (budget: Budget) => void;
};

export default function BudgetForm({ existingBudget, onSuccess }: BudgetFormProps) {
  const { createBudget, saveBudget, formatCurrency } = useBudget();
  
  const [name, setName] = useState(existingBudget?.name || '');
  const [period, setPeriod] = useState(() => (existingBudget ? 'custom' : 'next_month'));

  const [startDate, setStartDate] = useState(() => {
    if (existingBudget) return existingBudget.startDate;
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return start.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    if (existingBudget) return existingBudget.endDate;
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    return end.toISOString().split('T')[0];
  });

  const [categories, setCategories] = useState<BudgetCategory[]>(existingBudget?.categories || []);
  const [categoryName, setCategoryName] = useState('');
  const [categoryAmount, setCategoryAmount] = useState('');
  const [categoryColor, setCategoryColor] = useState(getRandomColor());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (period === 'custom') return;

    const today = new Date();
    let newStart: Date, newEnd: Date;

    if (period === 'next_30_days') {
      newStart = today;
      newEnd = new Date();
      newEnd.setDate(today.getDate() + 30);
    } else { // 'next_month'
      newStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      newEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    }
    setStartDate(newStart.toISOString().split('T')[0]);
    setEndDate(newEnd.toISOString().split('T')[0]);
  }, [period]);

  const periodOptions = [
    { value: 'next_month', label: 'Next Month' },
    { value: 'next_30_days', label: 'Next 30 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];
  
  function getRandomColor() {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A8', 
      '#33A8FF', '#A833FF', '#FF8333', '#33FFC1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function getCurrentDateString() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }
  
  function getNextMonthDateString() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Budget name is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddCategory = () => {
    const categoryErrors: Record<string, string> = {};
    
    if (!categoryName.trim()) {
      categoryErrors.categoryName = 'Category name is required';
    }
    
    const amount = parseFloat(categoryAmount);
    if (isNaN(amount) || amount <= 0) {
      categoryErrors.categoryAmount = 'Please enter a valid amount';
    }
    
    if (Object.keys(categoryErrors).length > 0) {
      setErrors({...errors, ...categoryErrors});
      return;
    }
    
    const newCategory: BudgetCategory = {
      id: uuidv4(),
      name: categoryName,
      amount: parseFloat(categoryAmount),
      color: categoryColor,
    };
    
    setCategories([...categories, newCategory]);
    setCategoryName('');
    setCategoryAmount('');
    setCategoryColor(getRandomColor());
    setErrors({...errors, categoryName: '', categoryAmount: '', categories: ''});
  };
  
  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const totalBudget = categories.reduce((sum, cat) => sum + cat.amount, 0);
    
    const budgetData = {
      name,
      startDate,
      endDate,
      categories,
      totalBudget,
    };
    
    let savedBudget;
    
    if (existingBudget) {
      savedBudget = saveBudget({
        ...budgetData,
        id: existingBudget.id,
      });
    } else {
      savedBudget = createBudget(budgetData);
    }
    
    if (onSuccess) {
      onSuccess(savedBudget);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{existingBudget ? 'Edit Budget' : 'Create New Budget'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Budget Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Monthly Budget, Holiday Savings"
                error={errors.name}
              />
            </div>
            
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Budget Period
                </label>
                <CustomDropdown
                  options={periodOptions}
                  value={period}
                  onChange={setPeriod}
                  placeholder="Select a budget period"
                />
              </div>

              {period === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      error={errors.startDate}
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      End Date
                    </label>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      error={errors.endDate}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Budget Categories</h3>
            
            {errors.categories && (
              <p className="text-sm text-red-500 mb-2">{errors.categories}</p>
            )}
            
            <div className="space-y-4">
              {categories.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-100 dark:bg-slate-700/50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                            {formatCurrency(category.amount)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(category.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th scope="row" className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                          Total Budget
                        </th>
                        <td colSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(categories.reduce((sum, cat) => sum + cat.amount, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Add Category</h4>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-auto">
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Category name"
                      error={errors.categoryName}
                    />
                  </div>
                  <div className="flex-auto">
                    <Input
                      type="number"
                      value={categoryAmount}
                      onChange={(e) => setCategoryAmount(e.target.value)}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                      error={errors.categoryAmount}
                    />
                  </div>
                  <div className="flex items-center shrink-0 space-x-2">
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="h-10 w-10 p-1 rounded-md cursor-pointer bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      variant="outline"
                    >
                      <FaPlus className="mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="gap-2">
          <FaSave /> {existingBudget ? 'Update Budget' : 'Create Budget'}
        </Button>
      </CardFooter>
    </Card>
  );
} 