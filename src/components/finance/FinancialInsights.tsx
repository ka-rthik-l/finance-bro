import { useMemo } from 'react';
import { AlertTriangle, Target, Lightbulb, TrendingUp, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Transaction, Category } from '@/types/finance';

interface FinancialInsightsProps {
  transactions: Transaction[];
  categories: Category[];
}

const WEEKLY_TIPS = [
  { tip: "Skip 2 takeout meals this week", savings: 400 },
  { tip: "Use public transport twice instead of cab", savings: 300 },
  { tip: "Make coffee at home for a week", savings: 500 },
  { tip: "Cancel one unused subscription", savings: 200 },
  { tip: "Pack lunch for 3 days this week", savings: 450 },
  { tip: "Avoid impulse purchases for 7 days", savings: 600 },
  { tip: "Use coupons for your next grocery run", savings: 250 },
  { tip: "Walk for short distances instead of rides", savings: 150 },
];

export const FinancialInsights = ({ transactions, categories }: FinancialInsightsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current month's data
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startOfMonth && date <= endOfMonth;
    });
  }, [transactions]);

  // Budget warnings (categories at 75%+ of budget)
  const budgetWarnings = useMemo(() => {
    const warnings: { category: Category; spent: number; percentage: number }[] = [];

    categories.forEach(cat => {
      if (cat.budget && cat.type === 'expense') {
        const spent = currentMonthData
          .filter(t => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (spent / cat.budget) * 100;
        if (percentage >= 75) {
          warnings.push({ category: cat, spent, percentage: Math.min(percentage, 100) });
        }
      }
    });

    return warnings.sort((a, b) => b.percentage - a.percentage);
  }, [categories, currentMonthData]);

  // Emergency fund calculation (3x average monthly expenses)
  const emergencyFund = useMemo(() => {
    const monthlyExpenses: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyExpenses[key] = (monthlyExpenses[key] || 0) + t.amount;
      });

    const months = Object.values(monthlyExpenses);
    if (months.length === 0) return null;

    const avgMonthlyExpense = months.reduce((a, b) => a + b, 0) / months.length;
    const target = avgMonthlyExpense * 3;

    // Calculate current savings (total income - total expenses)
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentSavings = Math.max(0, totalIncome - totalExpense);

    const progress = target > 0 ? Math.min((currentSavings / target) * 100, 100) : 0;

    return {
      target,
      current: currentSavings,
      progress,
      avgMonthly: avgMonthlyExpense,
    };
  }, [transactions]);

  // Weekly tip (based on current week)
  const weeklyTip = useMemo(() => {
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return WEEKLY_TIPS[weekNumber % WEEKLY_TIPS.length];
  }, []);

  // Big purchase alerts
  const bigPurchaseAlerts = useMemo(() => {
    const alerts: { transaction: Transaction; category: Category; avgAmount: number; deviation: number }[] = [];

    categories.forEach(cat => {
      if (cat.type !== 'expense') return;

      const catTransactions = transactions.filter(t => t.categoryId === cat.id && t.type === 'expense');
      if (catTransactions.length < 2) return;

      const amounts = catTransactions.map(t => t.amount);
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const threshold = avg * 2; // 2x average is considered "big"

      // Check recent transactions (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      catTransactions.forEach(t => {
        const date = new Date(t.date);
        if (date >= sevenDaysAgo && t.amount > threshold) {
          alerts.push({
            transaction: t,
            category: cat,
            avgAmount: avg,
            deviation: (t.amount / avg) * 100,
          });
        }
      });
    });

    return alerts.sort((a, b) => b.deviation - a.deviation).slice(0, 3);
  }, [transactions, categories]);

  const hasInsights = budgetWarnings.length > 0 || emergencyFund || bigPurchaseAlerts.length > 0;

  if (!hasInsights && transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-chart-4" />
        Financial Insights
      </h2>

      <div className="grid gap-3">
        {/* Budget Warnings */}
        {budgetWarnings.length > 0 && (
          <Card className="p-4 border-chart-1/30 bg-chart-1/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-chart-1" />
              <span className="font-medium text-sm">Budget Alerts</span>
            </div>
            <div className="space-y-3">
              {budgetWarnings.map(({ category, spent, percentage }) => (
                <div key={category.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {formatCurrency(spent)} / {formatCurrency(category.budget!)}
                      </span>
                      <Badge 
                        variant={percentage >= 100 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {Math.round(percentage)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      ['--progress-background' as string]: percentage >= 100 
                        ? 'hsl(var(--destructive))' 
                        : percentage >= 90 
                          ? 'hsl(var(--chart-1))' 
                          : 'hsl(var(--chart-4))'
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Emergency Fund Nudge */}
        {emergencyFund && (
          <Card className="p-4 border-chart-3/30 bg-chart-3/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-chart-3" />
              <span className="font-medium text-sm">Emergency Fund Goal</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target (3× monthly expenses)</span>
                <span className="font-medium text-foreground">{formatCurrency(emergencyFund.target)}</span>
              </div>
              <Progress value={emergencyFund.progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Current: {formatCurrency(emergencyFund.current)}</span>
                <span>{Math.round(emergencyFund.progress)}% achieved</span>
              </div>
              {emergencyFund.progress < 100 && (
                <p className="text-xs text-muted-foreground mt-2">
                  💡 You need {formatCurrency(emergencyFund.target - emergencyFund.current)} more to reach your goal.
                </p>
              )}
              {emergencyFund.progress >= 100 && (
                <p className="text-xs text-income mt-2">
                  ✨ Great job! You've built a solid emergency fund.
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Weekly Micro-Action Tip */}
        <Card className="p-4 border-chart-2/30 bg-chart-2/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-2" />
            <span className="font-medium text-sm">Weekly Saving Tip</span>
          </div>
          <p className="text-sm text-foreground">{weeklyTip.tip}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Potential savings: <span className="text-income font-medium">{formatCurrency(weeklyTip.savings)}</span>/week
          </p>
        </Card>

        {/* Big Purchase Alerts */}
        {bigPurchaseAlerts.length > 0 && (
          <Card className="p-4 border-expense/30 bg-expense/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-expense" />
              <span className="font-medium text-sm">Unusual Spending Detected</span>
            </div>
            <div className="space-y-2">
              {bigPurchaseAlerts.map(({ transaction, category, avgAmount }) => (
                <div key={transaction.id} className="flex items-start justify-between text-sm p-2 rounded-lg bg-background/50">
                  <div>
                    <p className="text-foreground font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.note || 'No note'} • {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-expense">{formatCurrency(transaction.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(avgAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};