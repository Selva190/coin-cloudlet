import { useState, useEffect } from 'react';
import { Transaction, Budget } from '@/types/budget';

const STORAGE_KEY = 'budget-tracker-data';

interface BudgetData {
  transactions: Transaction[];
  budgets: Budget[];
}

export function useBudgetData() {
  const [data, setData] = useState<BudgetData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { transactions: [], budgets: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setData((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const updateBudget = (category: string, limit: number) => {
    setData((prev) => {
      const existingIndex = prev.budgets.findIndex((b) => b.category === category);
      const spent = prev.transactions
        .filter((t) => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      const newBudget = { category, limit, spent };

      if (existingIndex >= 0) {
        const newBudgets = [...prev.budgets];
        newBudgets[existingIndex] = newBudget;
        return { ...prev, budgets: newBudgets };
      }

      return { ...prev, budgets: [...prev.budgets, newBudget] };
    });
  };

  const calculateBalance = () => {
    const income = data.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = data.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  return {
    transactions: data.transactions,
    budgets: data.budgets,
    addTransaction,
    deleteTransaction,
    updateBudget,
    calculateBalance,
  };
}
