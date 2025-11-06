import { BudgetHeader } from '@/components/BudgetHeader';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetOverview } from '@/components/BudgetOverview';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useCurrency } from '@/hooks/useCurrency';

const Index = () => {
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateBudget,
    calculateBalance,
  } = useBudgetData();

  const { currency, currencies, setCurrency, formatAmount } = useCurrency();

  const { income, expenses, balance } = calculateBalance();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <BudgetHeader
          balance={balance}
          income={income}
          expenses={expenses}
          formatAmount={formatAmount}
          currency={currency}
          currencies={currencies}
          onCurrencyChange={setCurrency}
        />

        <div className="space-y-6">
          <AnalyticsDashboard transactions={transactions} formatAmount={formatAmount} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <TransactionForm onAddTransaction={addTransaction} />
              <BudgetOverview
                transactions={transactions}
                budgets={budgets}
                onUpdateBudget={updateBudget}
                formatAmount={formatAmount}
              />
            </div>

            <div className="lg:col-span-2">
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
                formatAmount={formatAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
