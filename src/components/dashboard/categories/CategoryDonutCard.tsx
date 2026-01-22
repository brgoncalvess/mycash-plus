import { DonutChart } from '../../common/DonutChart';

interface CategoryDonutCardProps {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
    return (
        <div className="flex-shrink-0 w-[185px] h-[184px] bg-surface border border-secondary-50 rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 hover:border-brand transition-all group">
            {/* Donut Chart */}
            <div className="flex justify-center">
                <DonutChart percentage={percentage} color={color} size={72} />
            </div>

            {/* Content Group */}
            <div className="flex flex-col items-center gap-1 w-full">
                {/* Category Name */}
                <p className="text-[14px] leading-[20px] font-normal text-secondary text-center truncate w-full tracking-[0.3px]" title={category}>
                    {category}
                </p>

                {/* Amount */}
                <p className="text-[20px] leading-[28px] font-bold text-secondary text-center truncate w-full">
                    {amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
            </div>
        </div>
    );
}
