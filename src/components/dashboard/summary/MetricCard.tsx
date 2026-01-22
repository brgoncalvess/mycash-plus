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
        <div className="relative w-full lg:flex-1 rounded-2xl bg-surface border border-secondary-50 p-6 shadow-sm h-full min-h-[160px] flex flex-col justify-between group hover:border-secondary-500/10 transition-all">
            {/* Icon */}
            <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full mb-4",
                isIncome ? "bg-green-50" : "bg-red-50"
            )}>
                {isIncome ? (
                    <ArrowDownLeft size={20} className="text-green-600" />
                ) : (
                    <ArrowUpRight size={20} className="text-red-600" />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <span className="text-sm font-normal text-gray-600">
                    {isIncome ? 'Receitas' : 'Despesas'}
                </span>
                <CountUp
                    value={value}
                    prefix="R$ "
                    className="text-2xl lg:text-3xl font-bold tracking-tight text-[#2a89ef]"
                />
            </div>
        </div>
    );
}
