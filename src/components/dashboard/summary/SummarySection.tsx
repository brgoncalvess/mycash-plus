import { useFinance } from '../../../context/FinanceContext';
import { BalanceCard } from './BalanceCard';
import { MetricCard } from './MetricCard';

export function SummarySection() {
    const { calculateIncomeForPeriod, calculateExpensesForPeriod } = useFinance();
    const income = calculateIncomeForPeriod();
    const expense = calculateExpensesForPeriod();

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
            <BalanceCard />
            <MetricCard type="income" value={income} />
            <MetricCard type="expense" value={expense} />
        </section>
    );
}
