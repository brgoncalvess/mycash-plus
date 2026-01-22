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
        setShowFilters(false);
    };

    const handleMemberClick = (memberId: string) => {
        if (filters.memberId === memberId) {
            setFilters({ memberId: null });
        } else {
            setFilters({ memberId });
        }
    };

    const dateRangeText = `${format(filters.dateRange.start, 'dd MMM', { locale: ptBR })} - ${format(filters.dateRange.end, 'dd MMM yyyy', { locale: ptBR })}`;

    return (
        <div className="relative w-full">
            <header className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
                {/* Left Section: Search + Filters + Date */}
                <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Pesquisar"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="w-full sm:w-[200px] h-10 pl-9 pr-3 rounded-full border border-secondary-50 bg-surface text-sm text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-secondary-500/20 focus:border-secondary-500/30 transition-all"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border transition-all shrink-0",
                            showFilters
                                ? "bg-secondary border-secondary text-surface"
                                : "bg-surface border-secondary-50 text-secondary hover:border-secondary-500/20"
                        )}
                    >
                        <SlidersHorizontal size={16} />
                    </button>

                    {/* Date Range Button */}
                    <button className="hidden sm:flex items-center gap-2 h-10 px-4 bg-surface border border-secondary-50 rounded-full text-sm text-secondary hover:border-secondary-500/20 transition-all whitespace-nowrap">
                        <Calendar size={16} />
                        <span className="text-xs font-medium">{dateRangeText}</span>
                    </button>
                </div>

                {/* Right Section: Members + New Transaction */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Family Members */}
                    <div className="flex items-center -space-x-2">
                        {members.slice(0, 2).map((member) => {
                            const isSelected = filters.memberId === member.id;
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => handleMemberClick(member.id)}
                                    className={cn(
                                        "relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 hover:z-10",
                                        isSelected
                                            ? "border-secondary ring-2 ring-brand/30"
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all">
                            <Plus size={16} className="text-secondary" />
                        </button>
                    </div>

                    {/* New Transaction Button */}
                    <button className="flex items-center gap-2 h-10 px-5 bg-secondary text-surface rounded-full text-sm font-semibold hover:bg-secondary-500 transition-colors whitespace-nowrap">
                        <Plus size={16} />
                        <span>Nova transação</span>
                    </button>
                </div>
            </header>

            {/* Filter Popover */}
            {showFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Popover Content */}
                    <div className="absolute top-full left-0 sm:left-auto sm:right-auto mt-2 w-full sm:w-80 bg-surface/95 backdrop-blur-xl border border-secondary-50 rounded-2xl shadow-float p-4 z-50">
                        <div className="space-y-3">
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
                                                "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
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
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
