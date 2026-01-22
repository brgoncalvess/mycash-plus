import { DonutChart } from '../../common/DonutChart';

interface CategoryDonutCardProps {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
    return (
        <div className="flex-shrink-0 w-40 bg-surface border border-secondary-50 rounded-2xl p-4 hover:border-brand transition-all group">
            {/* Donut Chart */}
            <div className="flex justify-center mb-3">
                <DonutChart percentage={percentage} color={color} size={64} />
            </div>

            {/* Category Name */}
            <p className="text-sm font-semibold text-secondary text-center mb-1 truncate" title={category}>
                {category}
            </p>

            {/* Amount */}
            <p className="text-xs text-gray-500 text-center">
                {amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
            </p>
        </div>
    );
}
