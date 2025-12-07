import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { Transaction, Category } from '@/types/finance';

interface CategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
  dateRange: { start: Date; end: Date };
}

export const CategoryChart = ({ transactions, categories, dateRange }: CategoryChartProps) => {
  const chartData = useMemo(() => {
    const filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date >= dateRange.start && date <= dateRange.end;
    });

    const categoryTotals = filtered.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category?.name || 'Unknown',
          value: total,
          color: category?.color || '#64748b',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions, categories, dateRange]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Expense Breakdown</h3>
        <p className="text-center text-muted-foreground py-8">No expenses yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Expense Breakdown</h3>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          {chartData.slice(0, 4).map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm truncate flex-1">{item.name}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
