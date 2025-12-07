import { useState, useEffect } from 'react';
import { X, ChevronDown, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Transaction, Category, TransactionType, QUICK_AMOUNTS } from '@/types/finance';
import { CategoryIcon } from './CategoryIcon';

interface AddTransactionSheetProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction?: Transaction | null;
}

export const AddTransactionSheet = ({
  open,
  onClose,
  categories,
  onSave,
  editTransaction,
}: AddTransactionSheetProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategoryId(editTransaction.categoryId);
      setNote(editTransaction.note);
      setDate(editTransaction.date);
      setIsRecurring(editTransaction.isRecurring || false);
      setRecurringFrequency(editTransaction.recurringFrequency || 'monthly');
    } else {
      setType('expense');
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurring(false);
    }
  }, [editTransaction, open]);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSave = () => {
    if (!amount || !categoryId) return;

    onSave({
      amount: parseFloat(amount),
      type,
      categoryId,
      note,
      date,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">
            {editTransaction ? 'Edit' : 'Add'} Transaction
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto pb-20">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  type === t
                    ? t === 'income'
                      ? 'bg-income text-income-foreground'
                      : 'bg-expense text-expense-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-10 text-3xl font-bold h-16 rounded-xl"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {QUICK_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant="secondary"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  className="rounded-full"
                >
                  ₹{amt}
                </Button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-14 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <CategoryIcon name={cat.icon} color={cat.color} size={16} />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 rounded-xl"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <Repeat className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Recurring</p>
                <p className="text-sm text-muted-foreground">Repeat this transaction</p>
              </div>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          {isRecurring && (
            <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as typeof recurringFrequency)}>
              <SelectTrigger className="h-14 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button
            onClick={handleSave}
            disabled={!amount || !categoryId}
            className="w-full h-14 rounded-xl text-lg font-semibold"
          >
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
