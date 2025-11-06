import { BudgetHeader } from '@/components/BudgetHeader';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetOverview } from '@/components/BudgetOverview';
import { useBudgetData } from '@/hooks/useBudgetData';

const Index = () => {
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateBudget,
    calculateBalance,
  } = useBudgetData();

  const { income, expenses, balance } = calculateBalance();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <BudgetHeader balance={balance} income={income} expenses={expenses} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onAddTransaction={addTransaction} />
            <BudgetOverview
              transactions={transactions}
              budgets={budgets}
              onUpdateBudget={updateBudget}
            />
          </div>

          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
