export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
  budget?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  date: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: string;
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', color: '#10b981', icon: 'Wallet', type: 'income' },
  { id: '2', name: 'Freelance', color: '#06b6d4', icon: 'Laptop', type: 'income' },
  { id: '3', name: 'Investment', color: '#8b5cf6', icon: 'TrendingUp', type: 'income' },
  { id: '4', name: 'Gift', color: '#f59e0b', icon: 'Gift', type: 'income' },
  { id: '5', name: 'Food & Dining', color: '#ef4444', icon: 'UtensilsCrossed', type: 'expense', budget: 8000 },
  { id: '6', name: 'Transport', color: '#3b82f6', icon: 'Car', type: 'expense' },
  { id: '7', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', type: 'expense' },
  { id: '8', name: 'Bills', color: '#f97316', icon: 'Receipt', type: 'expense' },
  { id: '9', name: 'Entertainment', color: '#a855f7', icon: 'Gamepad2', type: 'expense', budget: 3000 },
  { id: '10', name: 'Health', color: '#14b8a6', icon: 'Heart', type: 'expense' },
  { id: '11', name: 'Education', color: '#6366f1', icon: 'GraduationCap', type: 'expense' },
  { id: '12', name: 'Other', color: '#64748b', icon: 'MoreHorizontal', type: 'expense' },
];

export const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000, 5000];
