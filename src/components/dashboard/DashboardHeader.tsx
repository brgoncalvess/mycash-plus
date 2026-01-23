import { Search, SlidersHorizontal, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NewTransactionModal } from './transactions/NewTransactionModal';
import { AddMemberModal } from './members/AddMemberModal';

export function DashboardHeader() {
    const { filters, setFilters, members } = useFinance();
    const [showFilters, setShowFilters] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
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
            <header className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center w-full bg-surface/50 backdrop-blur-sm p-1 rounded-full border border-transparent">
                {/* Left Group: Search, Filter, Date, Members */}
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="w-full sm:w-[240px] h-12 pl-11 pr-4 rounded-full border border-secondary-50 bg-surface text-sm text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border transition-all shrink-0 shadow-sm",
                            showFilters
                                ? "bg-secondary border-secondary text-surface"
                                : "bg-surface border-secondary-50 text-secondary hover:border-brand/30 hover:bg-background"
                        )}
                    >
                        <SlidersHorizontal size={18} />
                    </button>

                    {/* Date Range Button */}
                    <button className="flex items-center gap-3 h-12 px-6 bg-surface border border-secondary-50 rounded-full text-sm text-secondary hover:border-brand/30 hover:bg-background transition-all whitespace-nowrap shadow-sm">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="font-medium text-secondary">{dateRangeText}</span>
                    </button>

                    {/* Family Members Stack */}
                    <div className="flex items-center -space-x-3 ml-2">
                        {members.map((member) => {
                            const isSelected = filters.memberId === member.id;
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => handleMemberClick(member.id)}
                                    className={cn(
                                        "relative w-11 h-11 rounded-full border-2 transition-all hover:scale-110 hover:z-20",
                                        isSelected
                                            ? "border-brand z-10 scale-105"
                                            : "border-surface"
                                    )}
                                    title={member.name}
                                >
                                    <img
                                        src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
                                        alt={member.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    {isSelected && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-brand rounded-full border-2 border-surface flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setIsMemberModalOpen(true)}
                            className="w-11 h-11 rounded-full bg-gray-100 border-2 border-surface flex items-center justify-center hover:bg-gray-200 transition-all text-secondary z-0"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Right Group: New Transaction */}
                <div className="flex items-center lg:ml-auto">
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-secondary text-surface rounded-full text-base font-bold hover:bg-secondary/90 transition-all shadow-md active:scale-95 group w-full lg:w-auto"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span>Nova transação</span>
                    </button>
                </div>
            </header>

            {/* Filter Popover */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFilters(false)}
                    />

                    <div className="absolute top-full left-0 sm:left-auto mt-3 w-full sm:w-80 bg-surface/95 backdrop-blur-xl border border-secondary-50 rounded-2xl shadow-float p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-secondary mb-3">
                                    Tipo de Transação
                                </h3>
                                <div className="flex gap-2 p-1 bg-background rounded-xl">
                                    {[
                                        { value: 'all', label: 'Todos' },
                                        { value: 'income', label: 'Receitas' },
                                        { value: 'expense', label: 'Despesas' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleTransactionTypeChange(option.value as any)}
                                            className={cn(
                                                "flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                                filters.transactionType === option.value
                                                    ? "bg-secondary text-surface shadow-sm"
                                                    : "text-gray-500 hover:text-secondary"
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

            {/* Transaction Modal */}
            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />

            {/* Member Modal */}
            <AddMemberModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
            />
        </div>
    );
}
