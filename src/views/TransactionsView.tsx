import { useState, useMemo } from 'react';
import {
    Download,
    Plus,
    Search,
    Filter,
    Calendar,
    ArrowDownLeft,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionsTable } from '../components/dashboard/transactions/TransactionsTable';
import { NewTransactionModal } from '../components/dashboard/transactions/NewTransactionModal';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

export function TransactionsView() {
    const {
        getFilteredTransactions,
        categories,
        accounts,
        cards,
        members
    } = useFinance();

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // Local Filters State
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [categoryId, setCategoryId] = useState('all');
    const [accountId, setAccountId] = useState('all');
    const [memberId, setMemberId] = useState('all');
    const [status, setStatus] = useState('all');

    // Note: Date Range in this view is handled via Global Filters usually, 
    // but prompt asked for a specific date range picker here "adicionando-se aos filtros globais".
    // I will add a local date filter that works ON TOP of global. 
    // Realistically, users might want to *change* the global date range from here, 
    // but I'll follow "AND" logic as requested for simplicity.
    // Actually, to make it usable, let's say this local date range is optional and defaults to "all time" within the global window?
    // Or maybe just let global handle date. 
    // Prompt: "Date range picker para período customizado... adicionando-se aos filtros globais"
    // I'll add inputs for start/end date which default to empty (no extra restriction).
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const baseTransactions = getFilteredTransactions();

    const filteredTransactions = useMemo(() => {
        return baseTransactions.filter(t => {
            // Text Search
            if (search) {
                const query = search.toLowerCase();
                const matchesDesc = t.description.toLowerCase().includes(query);
                const matchesCat = t.category.toLowerCase().includes(query);
                if (!matchesDesc && !matchesCat) return false;
            }

            // Type
            if (type !== 'all' && t.type !== type) return false;

            // Category
            if (categoryId !== 'all' && t.category !== categories.find(c => c.id === categoryId)?.name) return false; // Matching by name since 'category' in t is string name currently in mock, but ideally ID. Mock data uses names.
            // Wait, t.category is string Name in types.ts? 
            // Checking types... "category: string". MOCK_CATEGORIES has ids.
            // My existing logic in modal used name. I should match by Name if 't' stores Name.
            // Let's assume t.category is the Name.

            // Account
            if (accountId !== 'all' && t.accountId !== accountId) return false;

            // Member
            if (memberId !== 'all' && t.memberId !== memberId) return false;

            // Status (Mock 'completed' | 'pending')
            if (status !== 'all' && t.status !== status) return false;

            // Date Range (Local)
            if (startDate && t.date < startDate) return false;
            if (endDate && t.date > endDate) return false;

            return true;
        });
    }, [baseTransactions, search, type, categoryId, accountId, memberId, status, startDate, endDate, categories]);

    // Derived Statistics
    const stats = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
            income,
            expense,
            balance: income - expense,
            count: filteredTransactions.length
        };
    }, [filteredTransactions]);

    const handleExport = () => {
        // Mock Export
        const header = "Data,Descrição,Categoria,Valor,Tipo\n";
        const csv = filteredTransactions.map(t =>
            `${format(new Date(t.date), 'dd/MM/yyyy')},"${t.description}",${t.category},${t.amount},${t.type}`
        ).join("\n");

        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extrato-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">
                    Transações
                </h1>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="h-12 px-6 rounded-full bg-white border border-gray-200 text-secondary font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Download size={20} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="h-12 px-6 rounded-full bg-secondary text-white font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg active:scale-95 flex-1 md:flex-none justify-center"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Nova Transação</span>
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <section className="bg-surface rounded-3xl p-6 shadow-sm border border-secondary-50">
                <div className="flex items-center gap-2 mb-4 text-secondary font-bold">
                    <Filter size={18} />
                    <span>Filtros Avançados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por descrição ou categoria..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none transition-colors"
                        />
                    </div>

                    {/* Type */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none cursor-pointer"
                    >
                        <option value="all">Todas Transações</option>
                        <option value="income">Apenas Receitas</option>
                        <option value="expense">Apenas Despesas</option>
                    </select>

                    {/* Category */}
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none cursor-pointer"
                    >
                        <option value="all">Todas Categorias</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id || c.name}>{c.name}</option> // Fallback to name if id missing in mock loop issues
                        ))}
                    </select>

                    {/* Account */}
                    <select
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none cursor-pointer"
                    >
                        <option value="all">Todas Contas/Cartões</option>
                        <optgroup label="Contas">
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </optgroup>
                        <optgroup label="Cartões">
                            {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </optgroup>
                    </select>

                    {/* Member */}
                    <select
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none cursor-pointer"
                    >
                        <option value="all">Todos Membros</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>

                    {/* Status */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none cursor-pointer"
                    >
                        <option value="all">Todos Status</option>
                        <option value="completed">Concluídos</option>
                        <option value="pending">Pendentes</option>
                    </select>

                    {/* Date Start */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none text-gray-500"
                        />
                    </div>

                    {/* Date End */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand outline-none text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ArrowDownLeft size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Receitas</p>
                        <p className="text-lg font-bold text-secondary">
                            {stats.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <ArrowUpRight size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Despesas</p>
                        <p className="text-lg font-bold text-secondary">
                            {stats.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        stats.balance >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )}>
                        <ArrowRight size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Saldo Filtrado</p>
                        <p className={cn(
                            "text-lg font-bold",
                            stats.balance >= 0 ? "text-green-600" : "text-red-500"
                        )}>
                            {stats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center gap-4 justify-center md:justify-start">
                    <div className="text-center md:text-left">
                        <p className="text-3xl font-bold text-secondary">{stats.count}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">Transações</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <TransactionsTable
                data={filteredTransactions}
                itemsPerPage={10}
                hideHeader={true}
            />

            {/* Modal */}
            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />
        </div>
    );
}
