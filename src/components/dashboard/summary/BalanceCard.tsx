import { DollarSign } from 'lucide-react';
import { CountUp } from '../../common/CountUp';
import { useFinance } from '../../../context/FinanceContext';

export function BalanceCard() {
    const { calculateTotalBalance } = useFinance();
    const balance = calculateTotalBalance();

    return (
        <div className="relative w-full lg:flex-1 rounded-2xl bg-surface border border-secondary-50 p-6 shadow-sm h-full min-h-[160px] flex flex-col justify-between group hover:border-secondary-500/10 transition-all">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background mb-4">
                <DollarSign size={20} className="text-secondary" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <span className="text-sm font-normal text-gray-600">Saldo total</span>
                <CountUp
                    value={balance}
                    prefix="R$ "
                    className="text-2xl lg:text-3xl font-bold tracking-tight text-[#2a89ef]"
                />
            </div>
        </div>
    );
}
