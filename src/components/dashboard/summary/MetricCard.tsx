import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { CountUp } from '../../common/CountUp';

interface MetricCardProps {
    type: 'income' | 'expense';
    value: number;
}

export function MetricCard({ type, value }: MetricCardProps) {
    const isIncome = type === 'income';

    return (
        <div className="relative w-full lg:flex-1 rounded-2xl bg-white border border-secondary-50 p-6 shadow-sm h-[152px] flex items-center gap-4 group hover:border-secondary-500/10 transition-all">
            {/* Icon */}
            <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
                isIncome ? "bg-green-50" : "bg-red-50"
            )}>
                {isIncome ? (
                    <ArrowDownLeft size={20} className="text-green-600" />
                ) : (
                    <ArrowUpRight size={20} className="text-red-600" />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-sm font-normal text-secondary">
                    {isIncome ? 'Receitas' : 'Despesas'}
                </span>
                <CountUp
                    value={value}
                    prefix="R$ "
                    className="text-3xl font-bold tracking-tight text-secondary"
                />
            </div>
        </div>
    );
}
