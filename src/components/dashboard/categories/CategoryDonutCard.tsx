import { DonutChart } from '../../common/DonutChart';

interface CategoryDonutCardProps {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
    return (
        <div className="flex-shrink-0 w-[200px] h-[190px] bg-white border border-secondary-50 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-brand transition-all group">
            {/* Donut Chart */}
            <div className="flex justify-center">
                <DonutChart percentage={percentage} color={color} size={76} />
            </div>

            {/* Content Group */}
            <div className="flex flex-col items-center gap-1 w-full">
                {/* Category Name - Paragraph/Small */}
                <p className="text-sm leading-5 font-normal text-secondary text-center truncate w-full" title={category}>
                    {category}
                </p>

                {/* Amount - Heading/x-small */}
                <p className="text-xl leading-7 font-bold text-secondary text-center truncate w-full">
                    {amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
            </div>
        </div>
    );
}
