import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, TrendingUp, Calendar, Trash2, ArrowUpRight, PiggyBank } from 'lucide-react';
import { cn } from '../utils/cn';
import { differenceInMonths } from 'date-fns';

// Mock Modal Component for simpler implementation within this file
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-secondary">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Plus size={20} className="rotate-45 text-gray-400" />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function GoalsView() {
    const { goals, addGoal, deleteGoal, addGoalContribution } = useFinance();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [yieldType, setYieldType] = useState<'CDI' | 'Savings' | 'Crypto' | 'Stocks'>('CDI');

    // Deposit State
    const [depositAmount, setDepositAmount] = useState('');

    const handleCreateGoal = () => {
        if (!name || !targetAmount) return;
        addGoal({
            name,
            description: '',
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount) || 0,
            category: 'General', // could add selector
            deadline,
            status: 'active',
            yieldType
        });
        setIsAddModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setTargetAmount('');
        setCurrentAmount('');
        setDeadline('');
        setYieldType('CDI');
    };

    const handleDeposit = () => {
        if (selectedGoalId && depositAmount) {
            addGoalContribution(selectedGoalId, parseFloat(depositAmount));
            setDepositAmount('');
            setSelectedGoalId(null);
        }
    };

    const getYieldInfo = (type?: string) => {
        switch (type) {
            case 'CDI': return { label: '100% do CDI', rate: '0.9% a.m', color: 'bg-blue-50 text-blue-600' };
            case 'Savings': return { label: 'Poupança', rate: '0.5% a.m', color: 'bg-yellow-50 text-yellow-600' };
            case 'Crypto': return { label: 'Cripto (BTC)', rate: '~5.0% a.m (Var)', color: 'bg-purple-50 text-purple-600' };
            case 'Stocks': return { label: 'Ações (IVVB11)', rate: '~1.2% a.m', color: 'bg-green-50 text-green-600' };
            default: return { label: 'Saldo Livre', rate: '0%', color: 'bg-gray-50 text-gray-500' };
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">
                        Objetivos
                    </h1>
                    <p className="text-gray-500 mt-2">Guarde dinheiro para seus sonhos em caixinhas que rendem.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-12 px-6 rounded-full bg-secondary text-white font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Nova Caixinha</span>
                </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    const yieldData = getYieldInfo(goal.yieldType);
                    const monthsLeft = goal.deadline ? differenceInMonths(new Date(goal.deadline), new Date()) : 0;

                    return (
                        <div key={goal.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-6 group hover:border-brand transition-all relative overflow-hidden">
                            {/* Yield Tag */}
                            <div className={cn("absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-xs font-bold flex items-center gap-1", yieldData.color)}>
                                <TrendingUp size={14} />
                                {yieldData.label} ({yieldData.rate})
                            </div>

                            <div className="flex items-start gap-4 mt-2">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl">
                                    🎯
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-secondary leading-tight">{goal.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">META: {goal.targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-secondary">{progress.toFixed(0)}%</span>
                                    <span className="text-green-600">{goal.currentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Info Footer */}
                            <div className="flex items-center justify-between text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Sem data'}
                                </span>
                                {monthsLeft > 0 && <span>Faltam ~{monthsLeft} meses</span>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedGoalId(goal.id)}
                                    className="flex-1 h-10 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowUpRight size={16} />
                                    Depositar
                                </button>
                                <button
                                    onClick={() => deleteGoal(goal.id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {goals.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300">
                            <PiggyBank size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-400">Nenhum objetivo criado</h3>
                            <p className="text-gray-400">Comece criando sua primeira caixinha.</p>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-brand font-bold hover:underline"
                        >
                            Criar Objetivo
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nova Caixinha">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Nome do Objetivo</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Comprar Carro"
                            className="w-full text-lg font-medium border-b border-gray-200 py-2 focus:outline-none focus:border-brand bg-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Meta (R$)</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                placeholder="0,00"
                                className="w-full text-lg font-medium border-b border-gray-200 py-2 focus:outline-none focus:border-brand bg-transparent"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Já Tenho (R$)</label>
                            <input
                                type="number"
                                value={currentAmount}
                                onChange={e => setCurrentAmount(e.target.value)}
                                placeholder="0,00"
                                className="w-full text-lg font-medium border-b border-gray-200 py-2 focus:outline-none focus:border-brand bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Data Limite</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="w-full text-base font-medium border-b border-gray-200 py-2 focus:outline-none focus:border-brand bg-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Onde vai investir?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['CDI', 'Savings', 'Crypto', 'Stocks'] as const).map(type => {
                                const info = getYieldInfo(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setYieldType(type)}
                                        className={cn(
                                            "p-3 rounded-xl border text-left transition-all",
                                            yieldType === type
                                                ? "border-brand bg-brand/10 shadow-sm"
                                                : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="text-sm font-bold text-secondary">{info.label.split('(')[0]}</div>
                                        <div className="text-xs text-green-600 font-bold">{info.rate}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateGoal}
                        className="mt-6 w-full h-12 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                    >
                        Criar Objetivo
                    </button>
                </div>
            </Modal>

            {/* Deposit Modal */}
            <Modal isOpen={!!selectedGoalId} onClose={() => setSelectedGoalId(null)} title="Adicionar Dinheiro">
                <div className="flex flex-col gap-6 text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                        <PiggyBank size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500">Quanto você quer guardar?</p>
                        <input
                            type="number"
                            autoFocus
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            className="text-4xl font-bold text-center w-full bg-transparent focus:outline-none placeholder:text-gray-200 text-secondary mt-2"
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <button
                        onClick={handleDeposit}
                        className="mt-2 w-full h-12 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95"
                    >
                        Confirmar Depósito
                    </button>
                </div>
            </Modal>
        </div>
    );
}
