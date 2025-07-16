"use client";

import { useState } from 'react';
import { FaCalendarAlt, FaTag, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { useBudget } from '@/contexts/budget-context';
import { DatePicker } from '@/components/ui/date-picker';

type TransactionFormProps = {
  existingTransaction?: Transaction;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
};

export default function TransactionForm({
  existingTransaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const { currentBudget, createTransaction, saveTransaction } = useBudget();

  const [amount, setAmount] = useState(
    existingTransaction ? String(existingTransaction.amount) : ''
  );
  const [description, setDescription] = useState(
    existingTransaction?.description || ''
  );
  const [categoryId, setCategoryId] = useState(
    existingTransaction?.categoryId || (currentBudget?.categories[0]?.id || '')
  );
  const [date, setDate] = useState(
    existingTransaction?.date || new Date().toISOString().split('T')[0]
  );
  const [isIncome, setIsIncome] = useState(
    existingTransaction?.isIncome || false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentBudget) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-slate-500 dark:text-slate-400">
            Please create or select a budget first before adding transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const transactionData = {
      amount: parseFloat(amount),
      description,
      categoryId,
      date,
      isIncome,
    };

    let savedTransaction;

    if (existingTransaction) {
      savedTransaction = saveTransaction({
        ...transactionData,
        id: existingTransaction.id,
      });
    } else {
      savedTransaction = createTransaction(transactionData);
    }

    if (onSuccess) {
      onSuccess(savedTransaction);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          {existingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="transaction-type"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Transaction Type
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
                  !isIncome
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => setIsIncome(false)}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
                  isIncome
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => setIsIncome(true)}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              error={errors.amount}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this transaction for?"
              error={errors.description}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Category
            </label>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              icon={<FaTag />}
              options={currentBudget.categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              error={errors.categoryId}
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Date
            </label>
            <DatePicker
              value={date}
              onChange={(d) => setDate(d)}
              error={errors.date}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} className="gap-2">
          <FaSave /> {existingTransaction ? 'Update' : 'Add'} Transaction
        </Button>
      </CardFooter>
    </Card>
  );
} 