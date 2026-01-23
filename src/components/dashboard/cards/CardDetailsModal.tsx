import { useState, useEffect, useMemo } from 'react';
import { X, Calendar, CreditCard, Plus, ChevronLeft, ChevronRight, FileText, Edit2 } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardId: string | null;
}

export function CardDetailsModal({ isOpen, onClose, cardId }: CardDetailsModalProps) {
    const { cards, transactions } = useFinance(); // Using context
    const [page, setPage] = useState(0);
    const [showExiting, setShowExiting] = useState(false);

    // Reset page and anim on open
    useEffect(() => {
        if (isOpen) {
            setPage(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setShowExiting(false);
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    const handleClose = () => {
        setShowExiting(true);
        setTimeout(() => {
            onClose();
            setShowExiting(false);
        }, 300);
    };

    const card = useMemo(() => cards.find(c => c.id === cardId), [cards, cardId]);

    const cardTransactions = useMemo(() => {
        if (!cardId) return [];
        return transactions
            .filter(t => t.type === 'expense' && t.accountId === cardId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, cardId]);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(cardTransactions.length / ITEMS_PER_PAGE);
    const displayedTransactions = cardTransactions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    if (!isOpen || !card) return null;

    const availableLimit = card.limit - card.currentInvoice;
    const usagePercentage = card.limit > 0 ? (card.currentInvoice / card.limit) * 100 : 0;

    // Generate Usage Donut stroke
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    showExiting ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
            />

            <div
                className={cn(
                    "relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col transition-all duration-300 max-h-[90vh]",
                    showExiting ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in zoom-in-95 duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner",
                            card.theme === 'black' ? "bg-secondary text-white" :
                                card.theme === 'lime' ? "bg-brand text-secondary" :
                                    "bg-white border text-secondary"
                        )}>
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-secondary">{card.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Fechamento: Dia {card.closingDay}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>Vencimento: Dia {card.dueDay}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">

                    {/* Top Section: Info & Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Info Cards Grid */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Limite Total</p>
                                <p className="text-lg font-bold text-secondary">
                                    {card.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Fatura Atual</p>
                                <p className="text-lg font-bold text-secondary text-orange-500">
                                    {card.currentInvoice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Limite Disponível</p>
                                <p className="text-lg font-bold text-green-600">
                                    {availableLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Uso do Limite</p>
                                <p className="text-lg font-bold text-secondary">
                                    {usagePercentage.toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Últimos 4 Dígitos</p>
                                <p className="text-lg font-bold text-secondary tracking-widest">
                                    •••• {card.last4Digits || '????'}
                                </p>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-surface border border-secondary/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                {/* SVG Donut */}
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke="#f3f4f6"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke={usagePercentage > 90 ? "#EF4444" : "#3247FF"} // Red if > 90%
                                        strokeWidth="10"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-secondary">{Math.round(usagePercentage)}%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Uso atual</p>
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-secondary">Despesas Recentes</h3>
                            <button className="text-sm text-brand font-bold hover:underline">
                                Ver todas
                            </button>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Data</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Descrição</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Categoria</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Parc.</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cardTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                Nenhuma despesa registrada neste cartão ainda.
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedTransactions.map((t) => (
                                            <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                    {format(new Date(t.date), 'dd MMM', { locale: ptBR })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondary font-bold">
                                                    {t.description}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                                    {t.installments && t.installments > 1 ? `${t.installments}x` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right font-bold text-secondary">
                                                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-xs font-bold text-gray-500">
                                        Página {page + 1} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={page === totalPages - 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-100 flex flex-wrap justify-end gap-3 shrink-0 rounded-b-3xl bg-gray-50/50">
                    <button
                        onClick={() => {
                            // "Ver Extrato Completo" - just close for now, ideally navigate to /expenses with filter in URL
                            handleClose();
                        }}
                        className="px-4 h-12 rounded-xl bg-white border border-gray-200 text-secondary text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <FileText size={16} className="text-gray-400" />
                        Ver Extrato
                    </button>
                    <button
                        onClick={() => {/* Edit Logic Placeholder */ }}
                        className="px-4 h-12 rounded-xl bg-white border border-gray-200 text-secondary text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Edit2 size={16} className="text-gray-400" />
                        Editar
                    </button>
                    <div className="flex-1 lg:flex-none" /> {/* Spacer on mobile */}
                    <button
                        onClick={handleClose}
                        className="px-6 h-12 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={() => {
                            // "Adicionar Despesa" - Open NewTransactionModal prefilled (not implemented in this step specifically as wiring, but logic placeholder)
                            // Would need to lift state up or pass a global "openTransactionModal(initialData)" context function.
                            // For now, stick to prompt specifics.
                            handleClose();
                        }}
                        className="px-6 h-12 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Nova Despesa
                    </button>
                </div>
            </div>
        </div>
    );
}
