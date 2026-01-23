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
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        status: 'pending',
        source: { type: 'credit', name: 'Nubank', last4: '5897' }
    },
    {
        id: 'u3',
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        status: 'pending',
        source: { type: 'credit', name: 'Nubank', last4: '5897' }
    },
    {
        id: 'u4',
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        status: 'pending',
        source: { type: 'credit', name: 'Nubank', last4: '5897' }
    },
    {
        id: 'u5',
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        status: 'pending',
        source: { type: 'credit', name: 'Nubank', last4: '5897' }
    }
];

interface UpcomingExpensesWidgetProps {
    onAddExpense?: () => void;
}

export function UpcomingExpensesWidget({ onAddExpense }: UpcomingExpensesWidgetProps) {
    const [expenses, setExpenses] = useState(MOCK_UPCOMING);

    const handlePay = (id: string) => {
        // Optimistic update
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success("Despesa marcada como paga!", {
            description: "Uma nova ocorrência foi agendada para o próximo mês."
        });
        // In a real app, calls context/API here
    };

    return (
        <section className="bg-white border border-secondary-50 rounded-[32px] p-8 flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Wallet size={24} className="text-secondary" />
                    <h2 className="text-xl font-bold text-secondary">
                        Próximas despesas
                    </h2>
                </div>
                <button
                    onClick={onAddExpense}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary-50 text-secondary hover:bg-gray-50 transition-colors"
                    title="Adicionar despesa"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-6">
                {expenses.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-secondary-50 rounded-xl p-8">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <Check size={24} className="text-green-600" />
                        </div>
                        <p className="text-gray-400 text-sm">Nenhuma despesa pendente</p>
                    </div>
                ) : (
                    expenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="group flex items-center justify-between py-1 hover:bg-gray-50/50 transition-colors rounded-lg"
                        >
                            {/* Left: Info */}
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-secondary mb-1">
                                    {expense.description}
                                </span>
                                <span className="text-sm font-semibold text-secondary">
                                    Vence dia {format(parseISO(expense.dueDate), 'dd/MM')}
                                </span>
                                <span className="text-xs font-normal text-secondary/70 mt-1">
                                    {expense.source.type === 'credit'
                                        ? `Crédito ${expense.source.name} **** ${expense.source.last4}`
                                        : `${expense.source.name} conta`
                                    }
                                </span>
                            </div>

                            {/* Right: Amount & Action */}
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-secondary text-base">
                                    {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                <button
                                    onClick={() => handlePay(expense.id)}
                                    className="w-10 h-10 rounded-full border border-secondary-50 flex items-center justify-center text-green-500 hover:bg-green-50 hover:border-green-500 transition-all duration-300"
                                    title="Marcar como pago"
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
