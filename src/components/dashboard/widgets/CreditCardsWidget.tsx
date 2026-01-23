import { useState } from 'react';
import { CreditCard as CreditCardIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import type { CreditCard } from '../../../types';

import { CardDetailsModal } from '../cards/CardDetailsModal';

interface CreditCardsWidgetProps {
    onAddCard?: () => void;
}

export function CreditCardsWidget({ onAddCard }: CreditCardsWidgetProps) {
    const { cards } = useFinance();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    const itemsPerPage = 3;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
    const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

    const displayedCards = cards.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const getThemeColors = (theme: CreditCard['theme']) => {
        switch (theme) {
            case 'black':
                return 'bg-secondary text-white';
            case 'lime':
                return 'bg-brand text-secondary';
            case 'white':
            default:
                return 'bg-white border border-gray-200 text-secondary';
        }
    };

    const getBadgeColors = (theme: CreditCard['theme']) => {
        switch (theme) {
            case 'black':
                return 'bg-secondary text-white';
            case 'lime':
                return 'bg-brand text-secondary';
            case 'white':
            default:
                return 'bg-gray-100 text-secondary';
        }
    };

    return (
        <section className="bg-gray-100/50 border border-secondary-50 rounded-2xl p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-secondary flex items-center gap-2">
                    <CreditCardIcon size={18} />
                    Cartões
                </h2>
                <button
                    onClick={onAddCard}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface shadow-sm text-secondary hover:bg-gray-100 transition-colors"
                    title="Adicionar cartão"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Empty State */}
            {cards.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                        <CreditCardIcon size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500">Nenhum cartão cadastrado</p>
                </div>
            )}

            {/* List */}
            {cards.length > 0 && (
                <div className="flex flex-col gap-3">
                    {displayedCards.map((card) => {
                        const usagePercentage = Math.round((card.currentInvoice / card.limit) * 100);

                        return (
                            <div
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className="group bg-surface rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4 border border-transparent hover:border-secondary-50"
                            >
                                {/* Icon Block */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden",
                                    (card as any).logoUrl ? "bg-white p-1" : getThemeColors(card.theme)
                                )}>
                                    {(card as any).logoUrl ? (
                                        <img
                                            src={(card as any).logoUrl}
                                            alt={card.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : (
                                        <CreditCardIcon size={20} />
                                    )}
                                    {/* Fallback icon if image fails (hidden by default if image exists) */}
                                    {(card as any).logoUrl && <CreditCardIcon size={20} className="hidden text-gray-400" />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5 truncate">{card.name}</p>
                                    <p className="text-sm font-bold text-secondary truncate">
                                        {card.currentInvoice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        •••• {card.last4Digits || '0000'}
                                    </p>
                                </div>

                                {/* Usage Badge */}
                                <div className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                                    getBadgeColors(card.theme)
                                )}>
                                    {usagePercentage}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="p-1 rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span>
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-1 rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Modal */}
            <CardDetailsModal
                isOpen={!!selectedCardId}
                cardId={selectedCardId}
                onClose={() => setSelectedCardId(null)}
            />
        </section>
    );
}
