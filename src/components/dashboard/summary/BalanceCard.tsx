import { DollarSign } from 'lucide-react';
import { CountUp } from '../../common/CountUp';
import { useFinance } from '../../../context/FinanceContext';

export function BalanceCard() {
    const { calculateTotalBalance } = useFinance();
    const balance = calculateTotalBalance();

    return (
        <div className="relative w-full lg:flex-1 rounded-2xl bg-[#080B12] border border-secondary-50 p-6 shadow-sm h-[152px] flex flex-col items-center justify-center gap-2 group hover:border-secondary-500/10 transition-all">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                <DollarSign size={20} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-normal text-white">Saldo total</span>
                <CountUp
                    value={balance}
                    prefix="R$ "
                    className="text-3xl font-bold tracking-tight text-brand"
                />
            </div>
        </div>
    );
}
