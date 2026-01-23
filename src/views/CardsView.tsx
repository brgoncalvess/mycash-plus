import { useState } from 'react';
import { CreditCard, Plus, Calendar } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../utils/cn';
import { AddCardModal } from '../components/dashboard/members/AddCardModal';
import { CardDetailsModal } from '../components/dashboard/cards/CardDetailsModal';
import { NewTransactionModal } from '../components/dashboard/transactions/NewTransactionModal';
import { BankLogo } from '../components/ui/BankLogo';
import type { CreditCard as CreditCardType } from '../types';

export function CardsView() {
    const { cards } = useFinance();
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [expenseCardId, setExpenseCardId] = useState<string | null>(null);

    // Sort cards by current invoice descending
    const sortedCards = [...cards].sort((a, b) => b.currentInvoice - a.currentInvoice);

    const getThemeStyles = (theme: CreditCardType['theme']) => {
        switch (theme) {
            case 'black':
                return {
                    card: "bg-surface border-secondary",
                    badge: "bg-secondary text-white",
                    icon: "bg-secondary text-white"
                };
            case 'lime':
                return {
                    card: "bg-surface border-brand",
                    badge: "bg-brand text-secondary",
                    icon: "bg-brand text-secondary"
                };
            case 'white':
            default:
                return {
                    card: "bg-surface border-gray-200",
                    badge: "bg-gray-100 text-secondary",
                    icon: "bg-gray-100 text-secondary"
                };
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">
                    Cartões de Crédito
                </h1>
                <button
                    onClick={() => setIsAddCardOpen(true)}
                    className="h-12 px-6 rounded-full bg-secondary text-white font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Novo Cartão</span>
                </button>
            </div>

            {/* Content */}
            {sortedCards.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-iner">
                        <CreditCard size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">Nenhum cartão cadastrado</h3>
                    <p className="text-gray-500 mb-8 max-w-sm text-center">
                        Cadastre seus cartões de crédito para acompanhar faturas e limites em um só lugar.
                    </p>
                    <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="h-12 px-8 rounded-full bg-brand text-secondary font-bold hover:bg-brand/90 transition-all shadow-lg active:scale-95"
                    >
                        Cadastrar Primeiro Cartão
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCards.map((card) => {
                        const themeStyles = getThemeStyles(card.theme);
                        const usagePercentage = Math.round((card.currentInvoice / card.limit) * 100);
                        const availableLimit = card.limit - card.currentInvoice;
                        const isHighUsage = usagePercentage >= 90;

                        return (
                            <div
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className={cn(
                                    "relative bg-white rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col gap-6",
                                    themeStyles.card
                                )}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0",
                                            card.logoUrl ? "bg-white p-1" : themeStyles.icon
                                        )}>
                                            <BankLogo
                                                src={card.logoUrl}
                                                bankName={card.bankName || card.name}
                                                alt={card.name}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary leading-tight">{card.name}</h3>
                                            <p className="text-xs text-gray-400 font-mono tracking-widest mt-0.5">
                                                •••• {card.last4Digits || '????'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold",
                                        themeStyles.badge
                                    )}>
                                        {card.theme === 'lime' ? 'Lime' : card.theme === 'black' ? 'Black' : 'White'}
                                    </div>
                                </div>

                                {/* Values */}
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Fatura Atual</p>
                                            <p className={cn(
                                                "text-2xl font-bold",
                                                isHighUsage ? "text-red-500" : "text-secondary"
                                            )}>
                                                {card.currentInvoice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Limite Disponível</p>
                                            <p className="text-sm font-bold text-green-600">
                                                {availableLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                            <span>{usagePercentage}% usado</span>
                                            <span>{card.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} Total</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000 ease-out",
                                                    isHighUsage ? "bg-red-500" : "bg-brand"
                                                )}
                                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 border-dashed">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={14} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Fechamento</span>
                                            <span className="text-sm font-bold text-secondary">Dia {card.closingDay}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={14} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Vencimento</span>
                                            <span className="text-sm font-bold text-secondary">Dia {card.dueDay}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions (Hover only on desktop, always visible mobile?) -> Keep always visible small buttons similar to widget but richer */}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCardId(card.id);
                                        }}
                                        className="flex-1 h-9 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 text-xs font-bold text-secondary transition-all"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpenseCardId(card.id);
                                        }}
                                        className="flex-1 h-9 rounded-lg bg-gray-50 hover:bg-secondary hover:text-white text-xs font-bold text-secondary transition-all flex items-center justify-center gap-1"
                                    >
                                        <Plus size={12} />
                                        Despesa
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <AddCardModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
            />
            <CardDetailsModal
                isOpen={!!selectedCardId}
                cardId={selectedCardId}
                onClose={() => setSelectedCardId(null)}
            />
            <NewTransactionModal
                isOpen={!!expenseCardId}
                onClose={() => setExpenseCardId(null)}
                initialAccountId={expenseCardId || undefined}
            />
        </div>
    );
}
