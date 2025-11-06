import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/budget';
import { toast } from 'sonner';
import { transactionSchema } from '@/lib/validation';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate with zod schema
    const validationResult = transactionSchema.safeParse({
      type,
      amount: numAmount,
      category,
      description,
      date,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      toast.error(errors);
      return;
    }

    onAddTransaction({
      type: validationResult.data.type,
      amount: validationResult.data.amount,
      category: validationResult.data.category,
      description: validationResult.data.description,
      date: validationResult.data.date,
    });

    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);

    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>

      <Tabs value={type} onValueChange={(v) => setType(v as 'income' | 'expense')} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            max="999999999"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="What was this for?"
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Card>
  );
}
