import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CurrencySelector } from './CurrencySelector';
import { Currency } from '@/hooks/useCurrency';

interface BudgetHeaderProps {
  balance: number;
  income: number;
  expenses: number;
  formatAmount: (amount: number) => string;
  currency: Currency;
  currencies: Currency[];
  onCurrencyChange: (currency: Currency) => void;
}

export function BudgetHeader({ balance, income, expenses, formatAmount, currency, currencies, onCurrencyChange }: BudgetHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-xl">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Budget Tracker</h1>
            <p className="text-muted-foreground">Manage your finances with ease</p>
          </div>
        </div>
        <CurrencySelector
          currency={currency}
          currencies={currencies}
          onCurrencyChange={onCurrencyChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Current Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
            {formatAmount(balance)}
          </p>
        </Card>

        <Card className="p-6 border-success/20 bg-success/5">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Income</p>
          <p className="text-3xl font-bold text-success">
            +{formatAmount(income)}
          </p>
        </Card>

        <Card className="p-6 border-destructive/20 bg-destructive/5">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-destructive">
            -{formatAmount(expenses)}
          </p>
        </Card>
      </div>
    </div>
  );
}
