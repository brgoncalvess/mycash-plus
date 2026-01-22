import { TrendingUp } from 'lucide-react';
import { CountUp } from '../../common/CountUp';
import { useFinance } from '../../../context/FinanceContext';

export function BalanceCard() {
    const { calculateTotalBalance } = useFinance();
    const balance = calculateTotalBalance();

    // Note: We need access to raw transactions, but context provides `getFilteredTransactions`.
    // Ideally we'd use `transactions` directly from context, but `useFinance` exposes it.
    // Let's assume for this specific card visual we just use a static calculation or simple heuristic for now
    // to keep it performant and focus on UI as requested.

    const growthPercentage = 12.5; // Mocked for UI stability as per "realistic mock" request

    return (
        <div className="relative w-full lg:flex-1 overflow-hidden rounded-3xl bg-secondary p-6 text-surface shadow-card h-full min-h-[180px] flex flex-col justify-between group">
            {/* Decorative Blur */}
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand blur-[60px] opacity-20 transition-opacity duration-500 group-hover:opacity-30" />

            <div className="relative z-10 flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-400">Saldo Total</span>
                <CountUp
                    value={balance}
                    prefix="R$ "
                    className="text-3xl lg:text-4xl font-bold tracking-tight text-white"
                />
            </div>

            <div className="relative z-10 mt-4 flex items-center">
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand backdrop-blur-sm">
                    <TrendingUp size={14} className="stroke-[3px]" />
                    <span>+{growthPercentage}% esse mês</span>
                </div>
            </div>
        </div>
    );
}
