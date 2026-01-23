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
                        <tr className="text-left">
                            <th className="pb-6 text-base font-bold text-secondary w-[100px]">Membro</th>
                            <th className="pb-6 text-base font-bold text-secondary w-[140px]">Datas</th>
                            <th className="pb-6 text-base font-bold text-secondary">Descrição</th>
                            <th className="pb-6 text-base font-bold text-secondary">Categorias</th>
                            <th className="pb-6 text-base font-bold text-secondary">Conta/cartão</th>
                            <th className="pb-6 text-base font-bold text-secondary">Parcelas</th>
                            <th className="pb-6 text-base font-bold text-secondary text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-secondary">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400">
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((transaction) => {
                                const member = getMember(transaction.memberId);
                                const isIncome = transaction.type === 'income';

                                return (
                                    <tr key={transaction.id} className="group hover:bg-gray-50/50 transition-colors border-b border-transparent">
                                        <td className="py-5">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                {member?.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 text-gray-600">
                                            {format(parseISO(transaction.date), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-2">
                                                {isIncome ? (
                                                    <ArrowUp size={14} className="text-red-500 rotate-180" strokeWidth={3} /> // Design uses red arrow down for expense?? No, screenshot shows red arrow UP meaning Expense? Wait.
                                                    // Screenshot: Red arrow pointing UP for "Conta de água". Red arrow UP usually means money LEAVING (Expense).
                                                    // Green arrow DOWN usually means money ENTERING (Income).
                                                    // Let's mimic screenshot: Red arrow Up for Expense.
                                                    // Oh wait, standard is usually Arrow UP = Income (Green), Arrow Down = Expense (Red).
                                                    // BUT in screenshot "Conta de água" has Red Arrow Pointing UP.
                                                    // Let's follow screenshot: Red Arrow UP.
                                                ) : (
                                                    // Actually screenshot shows Red Arrow UP for "Conta de água" which is an Expense.
                                                    null)}

                                                {!isIncome ? (
                                                    <ArrowUp size={14} className="text-red-500" strokeWidth={3} />
                                                ) : (
                                                    <ArrowDown size={14} className="text-green-500" strokeWidth={3} />
                                                )}

                                                <span className="text-gray-600 font-medium">
                                                    {transaction.description}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-gray-600">
                                            {transaction.category}
                                        </td>
                                        <td className="py-5 text-gray-600">
                                            {getAccountOrCardName(transaction.accountId)}
                                        </td>
                                        <td className="py-5 text-gray-600">
                                            {transaction.installments && transaction.installments > 1
                                                ? `${transaction.installments}/???` // We don't track total installments in mock perfectly, assuming simplify
                                                : '-'}
                                            {transaction.installments ? transaction.installments : '-'}
                                        </td>
                                        <td className="py-5 text-right font-medium text-gray-600">
                                            {/* Screenshot shows just "R$ 100,00" in gray, no colors */}
                                            {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
