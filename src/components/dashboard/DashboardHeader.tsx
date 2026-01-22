import { Search, SlidersHorizontal, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardHeader() {
    const { filters, setFilters, members } = useFinance();
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.searchQuery);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        setFilters({ searchQuery: value });
    };

    const handleTransactionTypeChange = (type: 'all' | 'income' | 'expense') => {
        setFilters({ transactionType: type });
    };

    const handleMemberClick = (memberId: string) => {
        if (filters.memberId === memberId) {
            setFilters({ memberId: null });
        } else {
            setFilters({ memberId });
        }
    };

    const dateRangeText = `${format(filters.dateRange.start, 'dd MMM', { locale: ptBR })} - ${format(filters.dateRange.end, 'dd MMM, yyyy', { locale: ptBR })}`;

    return (
        <header className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full mb-6">
            {/* Left Section: Search + Filters */}
            <div className="flex items-center gap-3 flex-1 max-w-full lg:max-w-md">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-secondary-50 bg-surface text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>

                {/* Filter Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center justify-center w-11 h-11 rounded-xl border transition-all",
                        showFilters
                            ? "bg-secondary border-secondary text-surface"
                            : "bg-surface border-secondary-50 text-secondary hover:border-secondary-500/20"
                    )}
                >
                    <SlidersHorizontal size={18} />
                </button>
            </div>

            {/* Right Section: Members + New Transaction */}
            <div className="flex items-center gap-4 justify-between lg:justify-end">
                {/* Family Members */}
                <div className="flex items-center -space-x-2">
                    {members.map((member) => {
                        const isSelected = filters.memberId === member.id;
                        return (
                            <button
                                key={member.id}
                                onClick={() => handleMemberClick(member.id)}
                                className={cn(
                                    "relative w-10 h-10 rounded-full border-2 bg-surface transition-all hover:scale-110 hover:z-10",
                                    isSelected
                                        ? "border-secondary ring-2 ring-brand"
                                        : "border-surface hover:border-secondary-50"
                                )}
                                title={member.name}
                            >
                                <img
                                    src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
                                    alt={member.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                                {isSelected && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand rounded-full border-2 border-surface flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    <button className="w-10 h-10 rounded-full border-2 border-dashed border-secondary-50 bg-background flex items-center justify-center hover:border-brand hover:bg-brand/5 transition-all">
                        <Plus size={16} className="text-secondary" />
                    </button>
                </div>

                {/* New Transaction Button */}
                <button className="flex items-center gap-2 h-11 px-6 bg-secondary text-surface rounded-xl font-semibold hover:bg-secondary-500 transition-colors whitespace-nowrap">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Nova Transação</span>
                </button>
            </div>

            {/* Filter Popover (Desktop) */}
            {showFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Popover Content */}
                    <div className={cn(
                        "absolute top-full left-0 mt-2 w-full lg:w-80 bg-surface/95 backdrop-blur-xl border border-secondary-50 rounded-2xl shadow-float p-4 z-50",
                        "lg:left-auto lg:right-0"
                    )}>
                        <div className="space-y-4">
                            {/* Transaction Type */}
                            <div>
                                <label className="text-xs font-semibold text-secondary mb-2 block">
                                    Tipo de Transação
                                </label>
                                <div className="flex gap-2">
                                    {[
                                        { value: 'all', label: 'Todos' },
                                        { value: 'income', label: 'Receitas' },
                                        { value: 'expense', label: 'Despesas' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleTransactionTypeChange(option.value as any)}
                                            className={cn(
                                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                                filters.transactionType === option.value
                                                    ? "bg-secondary text-surface"
                                                    : "bg-background text-secondary hover:bg-secondary-50"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="text-xs font-semibold text-secondary mb-2 block">
                                    Período
                                </label>
                                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-background rounded-lg text-sm text-secondary hover:bg-secondary-50 transition-colors">
                                    <Calendar size={16} />
                                    <span>{dateRangeText}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
