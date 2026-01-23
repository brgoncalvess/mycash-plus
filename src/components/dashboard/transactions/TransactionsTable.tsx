import { useState, useMemo } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    ArrowDown,
    ArrowUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';

interface TransactionsTableProps {
    data?: any[];
    itemsPerPage?: number;
    hideHeader?: boolean;
}

export function TransactionsTable({ data, itemsPerPage = 5, hideHeader = false }: TransactionsTableProps) {
    const { getFilteredTransactions, accounts, cards, members } = useFinance();

    // Local Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

    // Get Data
    const baseData = data || getFilteredTransactions();

    const processedData = useMemo(() => {
        let result = [...baseData];

        if (!data) {
            // Filter by search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                result = result.filter(transaction =>
                    transaction.description.toLowerCase().includes(query) ||
                    transaction.category.toLowerCase().includes(query)
                );
            }
            // Filter by type
            if (typeFilter !== 'all') {
                result = result.filter(t => t.type === typeFilter);
            }
        }

        // Sort by Date Desc default
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return result;
    }, [baseData, data, searchQuery, typeFilter]);

    // Pagination
    const totalItems = processedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = processedData.slice(startIndex, endIndex);

    const getMember = (id?: string) => members.find(m => m.id === id);
    const getAccountOrCardName = (id: string) => {
        const account = accounts.find(a => a.id === id);
        if (account) return `${account.name} ${account.type === 'checking' ? 'corrente' : ''}`;
        const card = cards.find(c => c.id === id);
        if (card) return `Cartão ${card.name}`;
        return 'Desconhecido';
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <section className={cn("bg-white rounded-[32px] flex flex-col gap-8", hideHeader ? "" : "border border-secondary-50 p-8")}>
            {!hideHeader && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-secondary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        </div>
                        <h2 className="text-xl font-bold text-secondary">
                            Extrato detalhado
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar lançamentos"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[44px] pl-11 pr-4 rounded-full border border-secondary-50 bg-white text-sm text-secondary placeholder:text-gray-500 focus:outline-none focus:border-secondary transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer" title="Filtrar tipo">
                            <span className="text-sm font-bold text-secondary">Despesas</span>
                            <select
                                className="absolute opacity-0 w-[100px] cursor-pointer"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as any)}
                            >
                                <option value="all">Todos</option>
                                <option value="expense">Despesas</option>
                                <option value="income">Receitas</option>
                            </select>
                            <ArrowDown size={14} className="text-secondary" />
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="pb-4 pl-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[80px]">Membro</th>
                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[120px]">Data</th>
                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Conta/Cartão</th>
                            <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Parcelas</th>
                            <th className="pb-4 pr-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400">
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((transaction) => {
                                const member = getMember(transaction.memberId);
                                const isIncome = transaction.type === 'income';

                                return (
                                    <tr key={transaction.id} className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                                        <td className="py-4 px-6">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                                {member?.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-600 font-medium">
                                            {(() => {
                                                try {
                                                    return format(parseISO(transaction.date), 'dd/MM/yyyy');
                                                } catch {
                                                    return transaction.date;
                                                }
                                            })()}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                    isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                                                )}>
                                                    {isIncome ? (
                                                        <ArrowUp size={14} strokeWidth={2.5} />
                                                    ) : (
                                                        <ArrowDown size={14} strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <span className="text-secondary font-bold">
                                                    {transaction.description}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm">
                                            {getAccountOrCardName(transaction.accountId)}
                                        </td>
                                        <td className="py-4 text-center text-gray-400 font-medium">
                                            {transaction.installments && transaction.installments > 1
                                                ? `${transaction.installments}x`
                                                : '-'}
                                        </td>
                                        <td className={cn(
                                            "py-4 pr-6 text-right font-bold text-base",
                                            isIncome ? "text-green-600" : "text-gray-900"
                                        )}>
                                            {isIncome ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}
                                            <span className="text-xs text-gray-400 font-normal ml-1">BRL</span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalItems > 0 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-base font-bold text-secondary">
                        Mostrando {startIndex + 1} a {endIndex} de {totalItems}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1 hover:text-brand disabled:opacity-30 disabled:hover:text-inherit transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-3 text-base font-bold">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        "w-2 transition-colors hover:text-brand",
                                        currentPage === page ? "text-secondary" : "text-gray-400"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                            {totalPages > 5 && <span className="text-gray-400">...</span>}
                            {totalPages > 5 && (
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className={cn(
                                        "w-2 transition-colors hover:text-brand",
                                        currentPage === totalPages ? "text-secondary" : "text-gray-400"
                                    )}
                                >
                                    {totalPages}
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 hover:text-brand disabled:opacity-30 disabled:hover:text-inherit transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
