import { useState } from 'react';
import { CreditCard as CreditCardIcon, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../../context/FinanceContext';
import { CardDetailsModal } from '../cards/CardDetailsModal';
import { BankLogo } from '../../ui/BankLogo';
import { cn } from '../../../utils/cn';

interface CreditCardsWidgetProps {
    onAddCard?: () => void;
}

export function CreditCardsWidget({ onAddCard }: CreditCardsWidgetProps) {
    const { cards } = useFinance();
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE);

    // Safety check just in case cards are deleted and page is out of bounds
    if (page >= totalPages && totalPages > 0) {
        setPage(Math.max(0, totalPages - 1));
    }

    const displayedCards = cards.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <section className="bg-white border border-secondary-50 rounded-[32px] p-8 flex flex-col shadow-sm h-[518px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <CreditCardIcon size={24} className="text-secondary" />
                    <h2 className="text-xl font-bold text-secondary">
                        Cards & contas
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onAddCard}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary-50 text-secondary hover:bg-gray-50 transition-colors"
                        title="Adicionar cartão"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => navigate('/cards')}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary-50 text-secondary hover:bg-gray-50 transition-colors"
                        title="Ver todos"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {cards.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 py-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                        <CreditCardIcon size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500">Nenhum cartão cadastrado</p>
                </div>
            )}

            {/* List */}
            {cards.length > 0 && (
                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                    {displayedCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className="group cursor-pointer flex flex-col gap-0.5 transition-opacity hover:opacity-80 pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                        >
                            {/* Top Row: Logo, Name, Last4 */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-3">
                                    {/* Logo */}
                                    <div className="w-8 h-8 rounded-lg shrink-0">
                                        <BankLogo
                                            src={card.logoUrl}
                                            bankName={card.bankName || card.name}
                                            alt={card.name}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    {/* Name */}
                                    <span className="text-base text-gray-800 font-normal truncate max-w-[120px]">
                                        {card.bankName || card.name.split(' ')[0]}
                                    </span>
                                </div>
                                {/* Last 4 */}
                                <span className="text-sm font-bold text-secondary">
                                    **** {card.last4Digits || '0000'}
                                </span>
                            </div>

                            {/* Amount */}
                            <p className="text-3xl font-bold text-secondary tracking-tight">
                                {card.currentInvoice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>

                            {/* Due Date */}
                            <p className="text-sm font-semibold text-secondary">
                                Vence dia {card.dueDay}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 border-dashed shrink-0">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    i === page ? "bg-secondary w-3" : "bg-gray-300"
                                )}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-secondary"
                    >
                        <ChevronRight size={20} />
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
