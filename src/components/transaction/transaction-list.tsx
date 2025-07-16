"use client";

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSortAmountDown, FaSortAmountUp, FaSearch, FaPlus } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/types';
import { useBudget } from '@/contexts/budget-context';
import TransactionForm from './transaction-form';
import { GlassmorphismCard } from '../ui/glassmorphism-card';
import { AnimatePresence, motion } from 'framer-motion';

type TransactionListProps = {
  limit?: number;
  showAddButton?: boolean;
};

export default function TransactionList({ limit, showAddButton = true }: TransactionListProps) {
  const { currentBudget, getBudgetTransactions, deleteTransaction, formatCurrency } = useBudget();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (currentBudget) {
      const budgetTransactions = getBudgetTransactions(currentBudget.id);
      setTransactions(budgetTransactions);
    } else {
      setTransactions([]);
    }
  }, [currentBudget, getBudgetTransactions]);

  if (!currentBudget) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-slate-500 dark:text-slate-400">
            Please select a budget to view transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      setTransactions(transactions.filter(tx => tx.id !== id));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleTransactionSuccess = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(tx => tx.id === transaction.id ? transaction : tx));
      setEditingTransaction(null);
    } else {
      setTransactions([transaction, ...transactions]);
      setIsAddingTransaction(false);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        currentBudget.categories.find(cat => cat.id === transaction.categoryId)?.name.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTransactionCurrency = (amount: number, isIncome: boolean): string => {
    return `${isIncome ? '+' : '-'}${formatCurrency(amount)}`;
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = currentBudget.categories.find(cat => cat.id === categoryId);
    return category?.color || '#cbd5e1';
  };

  const getCategoryName = (categoryId: string): string => {
    const category = currentBudget.categories.find(cat => cat.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  if (isAddingTransaction) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setIsAddingTransaction(false)} className="mb-4">
          ← Back to Transactions
        </Button>
        <TransactionForm 
          onSuccess={handleTransactionSuccess} 
          onCancel={() => setIsAddingTransaction(false)}
        />
      </div>
    );
  }

  if (editingTransaction) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setEditingTransaction(null)} className="mb-4">
          ← Back to Transactions
        </Button>
        <TransactionForm 
          existingTransaction={editingTransaction} 
          onSuccess={handleTransactionSuccess}
          onCancel={() => setEditingTransaction(null)}
        />
      </div>
    );
  }

  return (
    <GlassmorphismCard variant="strong" className="p-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex items-center gap-2">
          {showAddButton && (
            <Button onClick={() => setIsAddingTransaction(true)} size="sm" variant="ghost" className="gap-1">
              <FaPlus size={12} /> Add
            </Button>
          )}
          <Button 
            onClick={handleSortToggle}
            size="icon"
            variant="ghost"
            className="p-2 rounded-md"
          >
            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<FaSearch />}
            />
          </div>
        </div>

        {displayTransactions.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery ? 'No transactions match your search.' : 'No transactions found. Add one to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {displayTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-3 bg-white/5 dark:bg-slate-800/20 rounded-lg shadow-sm border border-slate-100/10 dark:border-slate-700/20 hover:bg-white/10 dark:hover:bg-slate-800/40 transition-all hover:scale-[1.02] hover:border-slate-200/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center mt-1">
                        <div 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                        ></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {getCategoryName(transaction.categoryId)}
                        </span>
                        <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium text-sm ${transaction.isIncome ? 'text-green-500' : 'text-red-500'}`}>
                        {formatTransactionCurrency(transaction.amount, transaction.isIncome)}
                      </span>
                      <div className="flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          aria-label="Edit transaction"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-500"
                          aria-label="Delete transaction"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {limit && filteredTransactions.length > limit && (
              <div className="text-center mt-4">
                <Button variant="link" className="text-sm">
                  View all {filteredTransactions.length} transactions
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </GlassmorphismCard>
  );
} 