import { useState } from 'react';
import { CreditCard as CreditCardIcon, Plus, ArrowRight } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { CardDetailsModal } from '../cards/CardDetailsModal';

interface CreditCardsWidgetProps {
    onAddCard?: () => void;
}

export function CreditCardsWidget({ onAddCard }: CreditCardsWidgetProps) {
    const { cards } = useFinance();
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    return (
        <section className="bg-white border border-secondary-50 rounded-[32px] p-8 flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
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
                        // Navigate to full cards view? For now just a placeholder action
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
            <div className="flex flex-col gap-8">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className="group cursor-pointer flex flex-col gap-1 transition-opacity hover:opacity-80"
                    >
                        {/* Top Row: Logo, Name, Last4 */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                                {/* Logo */}
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                                    {card.logoUrl ? (
                                        <img
                                            src={card.logoUrl}
                                            alt={card.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <CreditCardIcon size={16} className="text-gray-400" />
                                    )}
                                </div>
                                {/* Name */}
                                <span className="text-base text-gray-800 font-normal">
                                    {card.name.split(' ')[0]} {/* Simple brand name */}
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

            {/* Modal */}
            <CardDetailsModal
                isOpen={!!selectedCardId}
                cardId={selectedCardId}
                onClose={() => setSelectedCardId(null)}
            />
        </section>
    );
}
