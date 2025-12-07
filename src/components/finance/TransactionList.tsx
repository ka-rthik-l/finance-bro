import { useMemo, useState } from 'react';
import { Search, Trash2, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Transaction, Category } from '@/types/finance';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  dateRange: { start: Date; end: Date };
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  categories,
  dateRange,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= dateRange.start && date <= dateRange.end;
      })
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => {
        if (!search) return true;
        const category = categories.find(c => c.id === t.categoryId);
        return (
          t.note.toLowerCase().includes(search.toLowerCase()) ||
          category?.name.toLowerCase().includes(search.toLowerCase()) ||
          t.amount.toString().includes(search)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categories, dateRange, search, filterType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      const dateKey = t.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map((type) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilterType(type)}
            className="rounded-full capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {Object.keys(groupedByDate).length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No transactions found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, txns]) => (
            <div key={date} className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground px-1">
                {formatDate(date)}
              </p>
              {txns.map((transaction) => {
                const category = categories.find(c => c.id === transaction.categoryId);
                return (
                  <Card
                    key={transaction.id}
                    className="p-4 flex items-center gap-3 group hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <CategoryIcon
                        name={category?.icon || 'Circle'}
                        color={category?.color || '#64748b'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {category?.name || 'Unknown'}
                      </p>
                      {transaction.note && (
                        <p className="text-sm text-muted-foreground truncate">
                          {transaction.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income'
                            ? 'text-income'
                            : 'text-expense'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
