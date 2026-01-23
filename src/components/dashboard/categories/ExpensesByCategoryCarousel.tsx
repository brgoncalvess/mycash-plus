import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { CategoryDonutCard } from './CategoryDonutCard';

const CATEGORY_COLORS = [
    '#a3e635', // brand (lime)
    '#080b12', // secondary (black)
    '#6B7280', // gray-500
    '#EF4444', // red-500
    '#3B82F6', // blue-500
    '#8B5CF6', // purple-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
];

export function ExpensesByCategoryCarousel() {
    const { calculateExpensesByCategory, calculateCategoryPercentage } = useFinance();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showArrows, setShowArrows] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const expensesByCategory = calculateExpensesByCategory();

    // Check scroll position
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Check on mount and when data changes
    useState(() => {
        checkScroll();
    });

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 236; // 220px card + 16px gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (scrollContainerRef.current) {
            e.preventDefault();
            scrollContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    if (expensesByCategory.length === 0) {
        return (
            <div className="bg-surface border border-secondary-50 rounded-2xl p-6">
                <p className="text-sm text-gray-500 text-center">
                    Nenhuma despesa encontrada no período selecionado.
                </p>
            </div>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            {/* Left Arrow */}
            {showArrows && canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-surface border border-secondary-50 rounded-full shadow-card hover:bg-background transition-all"
                >
                    <ChevronLeft size={20} className="text-secondary" />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onWheel={handleWheel}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
                }}
            >
                {expensesByCategory.map((expense, index) => {
                    const percentage = calculateCategoryPercentage(expense.category);
                    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                    return (
                        <CategoryDonutCard
                            key={expense.category}
                            category={expense.category}
                            amount={expense.amount}
                            percentage={percentage}
                            color={color}
                        />
                    );
                })}
            </div>

            {/* Right Arrow */}
            {showArrows && canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-surface border border-secondary-50 rounded-full shadow-card hover:bg-background transition-all"
                >
                    <ChevronRight size={20} className="text-secondary" />
                </button>
            )}
        </div>
    );
}
