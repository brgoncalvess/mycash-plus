import { useState } from 'react';
import { Wallet, Plus, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

// Mock data specific for this widget to demonstrate features
const MOCK_UPCOMING = [
    {
        id: 'u1',
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        status: 'pending',
        source: { type: 'credit', name: 'Nubank', last4: '5897' }
    },
    {
        id: 'u2',
        description: 'Netflix',
        amount: 55.90,
        dueDate: '2026-01-23',
        status: 'pending',
        source: { type: 'credit', name: 'Inter', last4: '1234' }
    },
    {
        id: 'u3',
        description: 'Academia',
        amount: 110.00,
        dueDate: '2026-01-25',
        status: 'pending',
        source: { type: 'account', name: 'Itaú' }
    },
    {
        id: 'u4',
        description: 'Condomínio',
        amount: 850.00,
        dueDate: '2026-01-28',
        status: 'pending',
        source: { type: 'account', name: 'Nubank' }
    }
];

export function UpcomingExpensesWidget() {
    const [expenses, setExpenses] = useState(MOCK_UPCOMING);

    const handlePay = (id: string) => {
        // Optimistic update
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success("Despesa marcada como paga!", {
            description: "Uma nova ocorrência foi agendada para o próximo mês."
        });
        // In a real app, calls context/API here
    };

    const sortedExpenses = [...expenses].sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    return (
        <section className="bg-surface border border-secondary-50 rounded-2xl p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-secondary flex items-center gap-2">
                    <Wallet size={20} className="text-secondary" />
                    Próximas despesas
                </h2>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary-50 hover:bg-gray-50 transition-colors text-secondary"
                    title="Adicionar despesa"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* List */}
            {sortedExpenses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-secondary-50 rounded-xl p-8">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <Check size={24} className="text-green-600" />
                    </div>
                    <p className="text-gray-400 text-sm">Nenhuma despesa pendente</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {sortedExpenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="group flex items-center justify-between py-4 border-b border-secondary-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg"
                        >
                            {/* Left: Info */}
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-secondary text-sm">
                                    {expense.description}
                                </span>
                                <span className="text-xs text-secondary/70">
                                    Vence dia {format(parseISO(expense.dueDate), 'dd/MM')}
                                </span>
                                <span className="text-[11px] text-gray-400 mt-0.5">
                                    {expense.source.type === 'credit'
                                        ? `Crédito ${expense.source.name} **** ${expense.source.last4}`
                                        : `${expense.source.name} conta`
                                    }
                                </span>
                            </div>

                            {/* Right: Amount & Action */}
                            <div className="flex flex-col items-end gap-2">
                                <span className="font-bold text-secondary text-base">
                                    {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                <button
                                    onClick={() => handlePay(expense.id)}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-transparent hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-all duration-300"
                                    title="Marcar como pago"
                                >
                                    <Check size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
