import { DonutChart } from '../../common/DonutChart';

interface CategoryDonutCardProps {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
    return (
        <div className="flex-shrink-0 w-[152px] h-[152px] bg-white border border-secondary-50 rounded-[20px] p-4 flex flex-col items-center justify-between hover:border-brand transition-all group">
            {/* Donut Chart */}
            <div className="flex justify-center mt-1">
                <DonutChart percentage={percentage} color={color} size={64} />
            </div>

            {/* Content Group */}
            <div className="flex flex-col items-center gap-0.5 w-full">
                {/* Category Name */}
                <p className="text-xs leading-tight font-normal text-secondary text-center truncate w-full" title={category}>
                    {category}
                </p>

                {/* Amount */}
                <p className="text-base leading-tight font-bold text-secondary text-center truncate w-full">
                    {amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
            </div>
        </div>
    );
}
