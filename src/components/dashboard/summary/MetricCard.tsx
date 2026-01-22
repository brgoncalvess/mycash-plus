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
        <div className="relative w-full lg:flex-1 rounded-3xl bg-surface border border-secondary-50 p-6 shadow-sm h-full min-h-[180px] flex flex-col justify-between group hover:border-secondary-500/10 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-start justify-between">
                <span className={cn(
                    "text-sm font-bold",
                    isIncome ? "text-secondary" : "text-gray-500"
                )}>
                    {isIncome ? 'Receitas' : 'Despesas'}
                </span>

                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110",
                    isIncome ? "bg-secondary-50" : "bg-red-50"
                )}>
                    {isIncome ? (
                        <ArrowDownLeft size={20} className="text-secondary" />
                    ) : (
                        <ArrowUpRight size={20} className="text-red-500" />
                    )}
                </div>
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1 mt-4">
                <CountUp
                    value={value}
                    prefix="R$ "
                    className="text-2xl lg:text-3xl font-bold tracking-tight text-secondary"
                />
            </div>

            {/* Subtext purely decorative for alignment */}
            {/* <div className="h-4" /> */}
        </div>
    );
}
