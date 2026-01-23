import { DollarSign } from 'lucide-react';
import { CountUp } from '../../common/CountUp';
import { useFinance } from '../../../context/FinanceContext';

export function BalanceCard() {
    const { calculateTotalBalance } = useFinance();
    const balance = calculateTotalBalance();

    return (
        <div className="relative w-full lg:flex-1 rounded-2xl bg-[#F9FAFB] border border-secondary-50 p-6 shadow-sm h-[152px] flex items-center gap-4 group hover:border-secondary-500/10 transition-all">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shrink-0">
                <DollarSign size={20} className="text-secondary" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-sm font-normal text-secondary">Saldo total</span>
                <CountUp
                    value={balance}
                    prefix="R$ "
                    className="text-3xl font-bold tracking-tight text-brand"
                />
            </div>
        </div>
    );
}
