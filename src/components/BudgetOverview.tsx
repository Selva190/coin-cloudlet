import { useState } from 'react';
import { PieChart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Budget, EXPENSE_CATEGORIES, Transaction } from '@/types/budget';
import { toast } from 'sonner';

interface BudgetOverviewProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (category: string, limit: number) => void;
  formatAmount: (amount: number) => string;
}

export function BudgetOverview({ transactions, budgets, onUpdateBudget, formatAmount }: BudgetOverviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');

  const getCategorySpent = (category: string) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const budgetsWithSpent = budgets.map((budget) => ({
    ...budget,
    spent: getCategorySpent(budget.category),
    percentage: (getCategorySpent(budget.category) / budget.limit) * 100,
  }));

  const handleSetBudget = () => {
    if (!selectedCategory || !budgetLimit) {
      toast.error('Please fill in all fields');
      return;
    }

    const limit = parseFloat(budgetLimit);
    if (isNaN(limit) || limit <= 0) {
      toast.error('Please enter a valid budget limit');
      return;
    }

    onUpdateBudget(selectedCategory, limit);
    setSelectedCategory('');
    setBudgetLimit('');
    setIsOpen(false);
    toast.success('Budget updated successfully!');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Budget Overview</h2>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Category Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Limit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
              </div>

              <Button onClick={handleSetBudget} className="w-full">
                Save Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {budgetsWithSpent.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No budgets set. Click "Set Budget" to create your first budget!
          </p>
        ) : (
          budgetsWithSpent.map((budget) => (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{budget.category}</span>
                <span className="text-muted-foreground">
                  {formatAmount(budget.spent)} / {formatAmount(budget.limit)}
                </span>
              </div>
              <Progress
                value={Math.min(budget.percentage, 100)}
                className="h-2"
                indicatorClassName={
                  budget.percentage > 90
                    ? 'bg-destructive'
                    : budget.percentage > 75
                    ? 'bg-warning'
                    : 'bg-success'
                }
              />
              {budget.percentage > 100 && (
                <p className="text-xs text-destructive">
                  Over budget by {formatAmount(budget.spent - budget.limit)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
