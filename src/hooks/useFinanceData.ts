import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, FinanceData, DEFAULT_CATEGORIES } from '@/types/finance';

const STORAGE_KEY = 'finance_data';

const getInitialData = (): FinanceData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return {
    transactions: [],
    categories: DEFAULT_CATEGORIES,
  };
};

export const useFinanceData = () => {
  const [data, setData] = useState<FinanceData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
  }, []);

  const exportData = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const exportCSV = useCallback(() => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = data.transactions.map(t => {
      const category = data.categories.find(c => c.id === t.categoryId);
      return [
        t.date,
        t.type,
        category?.name || 'Unknown',
        t.amount.toString(),
        `"${t.note.replace(/"/g, '""')}"`,
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as FinanceData;
      if (imported.transactions && imported.categories) {
        setData(imported);
        return true;
      }
    } catch (e) {
      console.error('Failed to import:', e);
    }
    return false;
  }, []);

  const copyDataToClipboard = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json);
  }, [data]);

  return {
    transactions: data.transactions,
    categories: data.categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    exportData,
    exportCSV,
    importData,
    copyDataToClipboard,
  };
};
