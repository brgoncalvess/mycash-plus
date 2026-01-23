import { useState, useMemo } from 'react';
import {
    Search,
    ArrowDownLeft,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';

interface TransactionsTableProps {
    data?: any[]; // Allow external data override
    itemsPerPage?: number;
    hideHeader?: boolean;
}

export function TransactionsTable({ data, itemsPerPage = 5, hideHeader = false }: TransactionsTableProps) {
    const {
        getFilteredTransactions,
        accounts,
        cards,
        members
    } = useFinance();

    // Local Filters State (only used if data is not provided)
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Get Data: either passed prop or from context with local widget filters
    const baseData = data || getFilteredTransactions();

    // Apply Local Widget Filters (ONLY if no external data provided - otherwise assume parent filtered it)
    const processedData = useMemo(() => {
        let result = [...baseData];

        // Apply Widget Filters only if functioning as independent widget
        if (!data) {
            result = result.filter(transaction => {
                if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        transaction.description.toLowerCase().includes(query) ||
                        transaction.category.toLowerCase().includes(query)
                    );
                }
                return true;
            });
        }

        // Apply Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else if (!data) {
            // Default sort for widget (Date Desc)
            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        return result;
    }, [baseData, data, searchQuery, typeFilter, sortConfig]);

    // Pagination Logic
    const totalItems = processedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = processedData.slice(startIndex, endIndex);

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'desc' }; // Default diff key to desc
        });
    };

    // Helpers
    const getAccountOrCardName = (id: string) => {
        const account = accounts.find(a => a.id === id);
        if (account) return account.name;

        const card = cards.find(c => c.id === id);
        if (card) return card.name;

        return 'Desconhecido';
    };

    const getMember = (id?: string) => {
        if (!id) return null;
        return members.find(m => m.id === id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (
        type: 'search' | 'type',
        value: string
    ) => {
        if (type === 'search') setSearchQuery(value);
        if (type === 'type') setTypeFilter(value as any);
        setCurrentPage(1);
    };

    const renderPaginationNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return pages.map((page, index) => (
            page === '...' ? (
                <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
            ) : (
                <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        currentPage === page
                            ? "bg-secondary text-white"
                            : "text-gray-500 hover:bg-gray-100"
                    )}
                >
                    {page}
                </button>
            )
        ));
    };

    return (
        <section className={cn("bg-surface rounded-2xl flex flex-col gap-6", hideHeader ? "" : "border border-secondary-50 p-6")}>
            {!hideHeader && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-secondary">
                        Extrato Detalhado
                    </h2>

                    <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar lançamentos..."
                                value={searchQuery}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-secondary-50 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-brand/20 transition-all"
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full sm:w-[140px] h-10 px-3 rounded-lg border border-secondary-50 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-brand/20 transition-all cursor-pointer"
                        >
                            <option value="all">Todos</option>
                            <option value="income">Receitas</option>
                            <option value="expense">Despesas</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="border border-secondary-50 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-left border-b border-secondary-50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 w-[50px]">Membro</th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 cursor-pointer hover:text-secondary transition-colors select-none group"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-1">
                                        Datas
                                        {sortConfig?.key === 'date' && (
                                            <span className="text-brand text-[10px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Descrição</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Categorias</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Conta/cartão</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Parcelas</th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 text-right cursor-pointer hover:text-secondary transition-colors select-none"
                                    onClick={() => handleSort('amount')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Valor
                                        {sortConfig?.key === 'amount' && (
                                            <span className="text-brand text-[10px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <motion.tbody
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05 } }
                            }}
                        >
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        Nenhum lançamento encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((transaction, index) => {
                                    const member = getMember(transaction.memberId);
                                    const isIncome = transaction.type === 'income';
                                    const isEven = index % 2 === 0;

                                    return (
                                        <motion.tr
                                            key={transaction.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
                                            }}
                                            className={cn(
                                                "group transition-colors border-b border-gray-100 last:border-0",
                                                isEven ? "bg-white" : "bg-gray-50/30",
                                                "hover:bg-gray-100/80"
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200" title={member?.name || 'Usuário'}>
                                                    {member?.avatarUrl ? (
                                                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <User size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {format(parseISO(transaction.date), 'dd/MM/yyyy')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                                        isIncome ? "bg-green-100" : "bg-red-100"
                                                    )}>
                                                        {isIncome ? (
                                                            <ArrowDownLeft size={14} className="text-green-600" />
                                                        ) : (
                                                            <ArrowUpRight size={14} className="text-red-600" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-secondary">
                                                        {transaction.description}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                                                    {transaction.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {getAccountOrCardName(transaction.accountId)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {transaction.installments && transaction.installments > 1
                                                        ? `${transaction.installments}x`
                                                        : '-'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <span className={cn(
                                                    "text-sm font-bold",
                                                    isIncome ? "text-green-600" : "text-secondary"
                                                )}>
                                                    {isIncome ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </div>

            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium text-secondary">{startIndex + 1}</span> a <span className="font-medium text-secondary">{endIndex}</span> de <span className="font-medium text-secondary">{totalItems}</span>
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            {renderPaginationNumbers()}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
