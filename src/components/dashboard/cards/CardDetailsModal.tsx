import { useState, useEffect, useMemo } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Edit2, Save } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BankLogo } from '../../ui/BankLogo';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardId: string | null;
}

export function CardDetailsModal({ isOpen, onClose, cardId }: CardDetailsModalProps) {
    const { cards, transactions, updateCard } = useFinance();
    const [page, setPage] = useState(0);
    const [showExiting, setShowExiting] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLimit, setEditLimit] = useState('');
    const [editClosing, setEditClosing] = useState('');
    const [editDue, setEditDue] = useState('');

    const card = useMemo(() => cards.find(c => c.id === cardId), [cards, cardId]);

    // Reset state when opening
    useEffect(() => {
        if (isOpen && card) {
            setPage(0);
            setIsEditing(false);
            setEditName(card.name);
            setEditLimit(card.limit.toString());
            setEditClosing(card.closingDay.toString());
            setEditDue(card.dueDay.toString());
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setShowExiting(false);
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen, card]);

    const handleClose = () => {
        setShowExiting(true);
        setTimeout(() => {
            onClose();
            setShowExiting(false);
            setIsEditing(false);
        }, 300);
    };

    const handleSave = () => {
        if (card) {
            updateCard(card.id, {
                name: editName,
                limit: parseFloat(editLimit.replace(/\./g, '').replace(',', '.')),
                closingDay: parseInt(editClosing),
                dueDay: parseInt(editDue)
            });
            setIsEditing(false);

            // Simple toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-right duration-300';
            toast.innerHTML = `<div class="bg-green-500 rounded-full p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="font-bold">Cartão atualizado!</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };

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
                    <div className="flex items-center gap-4 w-full">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner overflow-hidden",
                            card.theme === 'black' ? "bg-secondary text-white" :
                                card.theme === 'lime' ? "bg-brand text-secondary" :
                                    "bg-white border text-secondary"
                        )}>
                            <BankLogo
                                src={card.logoUrl}
                                bankName={card.bankName || card.name}
                                alt={card.name}
                                className="w-full h-full p-1"
                            />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="text-2xl font-bold text-secondary border-b border-gray-300 focus:border-brand focus:outline-none bg-transparent w-full"
                                    placeholder="Nome do Cartão"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-secondary">{card.name}</h2>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Fechamento: Dia
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editClosing}
                                            onChange={e => setEditClosing(e.target.value)}
                                            className="w-12 border-b border-gray-300 focus:border-brand focus:outline-none text-center bg-transparent ml-1"
                                        />
                                    ) : (
                                        ` ${card.closingDay}`
                                    )}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="flex items-center gap-1">
                                    Vencimento: Dia
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editDue}
                                            onChange={e => setEditDue(e.target.value)}
                                            className="w-12 border-b border-gray-300 focus:border-brand focus:outline-none text-center bg-transparent ml-1"
                                        />
                                    ) : (
                                        ` ${card.dueDay}`
                                    )}
                                </span>
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
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editLimit}
                                        onChange={e => setEditLimit(e.target.value)}
                                        className="text-lg font-bold text-secondary border-b border-gray-300 focus:border-brand focus:outline-none bg-transparent w-full"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-secondary">
                                        {card.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                )}
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
                                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke={usagePercentage > 90 ? "#EF4444" : "#3247FF"}
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
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Data</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Descrição</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Categoria</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {displayedTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                Nenhuma despesa registrada.
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
                                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"><ChevronLeft size={16} /></button>
                                    <span className="text-xs font-bold text-gray-500">Página {page + 1} de {totalPages}</span>
                                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"><ChevronRight size={16} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-100 flex flex-wrap justify-end gap-3 shrink-0 rounded-b-3xl bg-gray-50/50">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 h-12 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 h-12 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                            >
                                <Save size={18} />
                                Salvar Alterações
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 h-12 rounded-xl bg-white border border-gray-200 text-secondary text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Edit2 size={16} className="text-gray-400" />
                                Editar
                            </button>
                            <div className="flex-1 lg:flex-none" />
                            <button
                                onClick={handleClose}
                                className="px-6 h-12 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-colors"
                            >
                                Fechar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
