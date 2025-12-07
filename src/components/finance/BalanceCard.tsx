import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { useMemo } from 'react';

interface BalanceCardProps {
  transactions: Transaction[];
  dateRange: { start: Date; end: Date };
}

export const BalanceCard = ({ transactions, dateRange }: BalanceCardProps) => {
  const stats = useMemo(() => {
    const filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= dateRange.start && date <= dateRange.end;
    });

    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="p-6 gradient-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">Total Balance</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrency(stats.balance)}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-income-muted border-income/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-income/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-income" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="text-lg font-semibold text-income">
            {formatCurrency(stats.income)}
          </p>
        </Card>

        <Card className="p-4 bg-expense-muted border-expense/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-expense/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-expense" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="text-lg font-semibold text-expense">
            {formatCurrency(stats.expense)}
          </p>
        </Card>
      </div>
    </div>
  );
};
