import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/finance/Header';
import { BalanceCard } from '@/components/finance/BalanceCard';
import { QuickStats } from '@/components/finance/QuickStats';
import { CategoryChart } from '@/components/finance/CategoryChart';
import { TransactionList } from '@/components/finance/TransactionList';
import { AddTransactionSheet } from '@/components/finance/AddTransactionSheet';
import { FloatingActionButton } from '@/components/finance/FloatingActionButton';
import { ImportDialog } from '@/components/finance/ImportDialog';
import { FinancialInsights } from '@/components/finance/FinancialInsights';
import { Transaction } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Period = 'today' | 'week' | 'month' | 'year' | 'custom';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    exportData,
    exportCSV,
    importData,
    copyDataToClipboard,
  } = useFinanceData();

  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>('month');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const dateRange = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start: Date;

    switch (period) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end };
  }, [period]);

  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    if (editTransaction) {
      updateTransaction(editTransaction.id, data);
      toast({ title: 'Transaction updated!' });
    } else {
      addTransaction(data);
      toast({ title: 'Transaction added!' });
    }
    setEditTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setShowAddSheet(true);
  };

  const handleDeleteTransaction = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      toast({ title: 'Transaction deleted' });
      setDeleteId(null);
    }
  };

  const handleCopyData = () => {
    copyDataToClipboard();
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <>
      <Helmet>
        <title>MoneyWise - Personal Finance Manager</title>
        <meta name="description" content="Track your income and expenses with MoneyWise - a simple, private finance management app." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onExportJSON={exportData}
          onExportCSV={exportCSV}
          onImport={() => setShowImportDialog(true)}
          onCopyData={handleCopyData}
        />

        <main className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
          <QuickStats activePeriod={period} onPeriodChange={setPeriod} />
          <BalanceCard transactions={transactions} dateRange={dateRange} />
          <FinancialInsights transactions={transactions} categories={categories} />
          <CategoryChart
            transactions={transactions}
            categories={categories}
            dateRange={dateRange}
          />
          <TransactionList
            transactions={transactions}
            categories={categories}
            dateRange={dateRange}
            onEdit={handleEditTransaction}
            onDelete={(id) => setDeleteId(id)}
          />
        </main>

        <FloatingActionButton onClick={() => setShowAddSheet(true)} />

        <AddTransactionSheet
          open={showAddSheet}
          onClose={() => {
            setShowAddSheet(false);
            setEditTransaction(null);
          }}
          categories={categories}
          onSave={handleSaveTransaction}
          editTransaction={editTransaction}
        />

        <ImportDialog
          open={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          onImport={importData}
        />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this transaction.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTransaction} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Index;
