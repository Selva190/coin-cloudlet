import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BudgetHeaderProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BudgetHeader({ balance, income, expenses }: BudgetHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary rounded-xl">
          <Wallet className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground">Manage your finances with ease</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Current Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
            ${balance.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6 border-success/20 bg-success/5">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Income</p>
          <p className="text-3xl font-bold text-success">
            +${income.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6 border-destructive/20 bg-destructive/5">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-destructive">
            -${expenses.toFixed(2)}
          </p>
        </Card>
      </div>
    </div>
  );
}
