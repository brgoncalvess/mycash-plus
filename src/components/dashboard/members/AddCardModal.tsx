import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import { BANKS } from '../../../constants/banks';
import type { CardTheme } from '../../../types';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
    const { addAccount, addCard, members } = useFinance();

    // Form State
    const [type, setType] = useState<'account' | 'creditCard'>('account');
    const [bankId, setBankId] = useState('');
    const [name, setName] = useState('');
    const [holderId, setHolderId] = useState(''); // Member ID

    // Account Specific
    const [initialBalance, setInitialBalance] = useState('');

    // Credit Card Specific
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [limit, setLimit] = useState('');
    const [last4Digits, setLast4Digits] = useState('');
    const [theme, setTheme] = useState<CardTheme>('black');

    const [errors, setErrors] = useState<{
        name?: string;
        holder?: string;
        balance?: string;
        closingDay?: string;
        dueDay?: string;
        limit?: string;
        theme?: string;
        last4digits?: string;
    }>({});

    const [showExiting, setShowExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset
            setType('account');
            setBankId('');
            setName('');
            setHolderId('');
            setInitialBalance('');
            setClosingDay('');
            setDueDay('');
            setLimit('');
            setLast4Digits('');
            setTheme('black');
            setErrors({});
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setShowExiting(false);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setShowExiting(true);
        setTimeout(() => {
            onClose();
            setShowExiting(false);
        }, 300);
    };

    const handleSubmit = () => {
        const formErrors: typeof errors = {};

        if (!name || name.trim().length < 3) {
            formErrors.name = "Mínimo 3 caracteres.";
        }
        if (!holderId) {
            formErrors.holder = "Selecione um titular.";
        }

        if (type === 'account') {
            if (!initialBalance) {
                formErrors.balance = "Informe o saldo inicial.";
            }
        } else {
            const closing = parseInt(closingDay);
            const due = parseInt(dueDay);
            const limitVal = parseFloat(limit.replace(/\./g, '').replace(',', '.'));

            if (!closingDay || isNaN(closing) || closing < 1 || closing > 31) {
                formErrors.closingDay = "Dia inválido.";
            }
            if (!dueDay || isNaN(due) || due < 1 || due > 31) {
                formErrors.dueDay = "Dia inválido.";
            }
            if (!limit || isNaN(limitVal) || limitVal <= 0) {
                formErrors.limit = "Limite deve ser maior que zero.";
            }
            if (last4Digits && (!/^\d{4}$/.test(last4Digits))) {
                formErrors.last4digits = "Deve ter 4 dígitos.";
            }
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            if (type === 'account') {
                const numericBalance = parseFloat(initialBalance.replace(/\./g, '').replace(',', '.'));

                // Colors for accounts usually fixed or random. Prompt didn't specify, picking random.
                const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                addAccount({
                    name: name.trim(),
                    type: 'checking', // Default to checking as prompt didn't specify account type selector
                    balance: numericBalance,
                    color: randomColor
                });

                // Show Toast
                showToast("Conta adicionada com sucesso!");
            } else {
                const numericLimit = parseFloat(limit.replace(/\./g, '').replace(',', '.'));

                const selectedBank = BANKS.find(b => b.id === bankId);

                addCard({
                    name: name.trim(),
                    closingDay: parseInt(closingDay),
                    dueDay: parseInt(dueDay),
                    limit: numericLimit,
                    currentInvoice: 0,
                    theme: theme,
                    last4Digits: last4Digits || undefined,
                    logoUrl: selectedBank?.logoUrl, // Prompt didn't specify logo upload
                    bankName: selectedBank?.name
                });

                // Show Toast
                showToast("Cartão adicionado com sucesso!");
            }

            handleClose();
        }
    };

    const showToast = (message: string) => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[60] animate-in slide-in-from-right duration-300';
        toast.innerHTML = `<div class="bg-green-500 rounded-full p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="font-bold">${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    if (!isOpen) return null;

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
                    "relative w-full max-w-[600px] bg-white rounded-3xl shadow-2xl flex flex-col transition-all duration-300 max-h-[90vh]",
                    showExiting ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in zoom-in-95 duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-2xl font-bold text-secondary">Adicionar Conta/Cartão</h2>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

                    {/* Type Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setType('account')}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200",
                                type === 'account'
                                    ? "bg-secondary text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Conta Bancária
                        </button>
                        <button
                            onClick={() => setType('creditCard')}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200",
                                type === 'creditCard'
                                    ? "bg-secondary text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Cartão de Crédito
                        </button>
                    </div>



                    {/* Bank Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Instituição Financeira</label>
                        <div className="relative">
                            <select
                                value={bankId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setBankId(id);
                                    const bank = BANKS.find(b => b.id === id);
                                    if (bank && !name) {
                                        setName(bank.name + (type === 'creditCard' ? '' : ''));
                                    }
                                }}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Selecione um banco (Opcional)</option>
                                {BANKS.map(bank => (
                                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">
                            {type === 'account' ? "Nome da Conta" : "Nome do Cartão"}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            placeholder={type === 'account' ? "Ex: Nubank Conta" : "Ex: Nubank Mastercard"}
                            className={cn(
                                "w-full h-12 px-4 rounded-xl border bg-white focus:outline-none transition-all",
                                errors.name
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-200 focus:border-brand"
                            )}
                        />
                        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    {/* Holder */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Titular</label>
                        <div className="relative">
                            <select
                                value={holderId}
                                onChange={(e) => {
                                    setHolderId(e.target.value);
                                    if (errors.holder) setErrors({ ...errors, holder: undefined });
                                }}
                                className={cn(
                                    "w-full h-12 px-4 rounded-xl border bg-white focus:outline-none transition-all appearance-none cursor-pointer",
                                    errors.holder
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-200 focus:border-brand"
                                )}
                            >
                                <option value="" disabled>Selecione um membro</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                        {errors.holder && <p className="text-xs text-red-500 font-medium">{errors.holder}</p>}
                    </div>

                    {/* Conditional Fields */}
                    {type === 'account' ? (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-bold text-gray-700">Saldo Inicial</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
                                <input
                                    type="number"
                                    value={initialBalance}
                                    onChange={(e) => {
                                        setInitialBalance(e.target.value);
                                        if (errors.balance) setErrors({ ...errors, balance: undefined });
                                    }}
                                    placeholder="0,00"
                                    className={cn(
                                        "w-full h-12 pl-10 pr-4 rounded-xl border bg-white focus:outline-none transition-all",
                                        errors.balance
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:border-brand"
                                    )}
                                />
                            </div>
                            {errors.balance && <p className="text-xs text-red-500 font-medium">{errors.balance}</p>}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Dia Fechamento</label>
                                    <input
                                        type="number"
                                        value={closingDay}
                                        onChange={(e) => {
                                            setClosingDay(e.target.value);
                                            if (errors.closingDay) setErrors({ ...errors, closingDay: undefined });
                                        }}
                                        placeholder="1-31"
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl border bg-white focus:outline-none transition-all",
                                            errors.closingDay
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-200 focus:border-brand"
                                        )}
                                    />
                                    {errors.closingDay && <p className="text-xs text-red-500 font-medium">{errors.closingDay}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Dia Vencimento</label>
                                    <input
                                        type="number"
                                        value={dueDay}
                                        onChange={(e) => {
                                            setDueDay(e.target.value);
                                            if (errors.dueDay) setErrors({ ...errors, dueDay: undefined });
                                        }}
                                        placeholder="1-31"
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl border bg-white focus:outline-none transition-all",
                                            errors.dueDay
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-200 focus:border-brand"
                                        )}
                                    />
                                    {errors.dueDay && <p className="text-xs text-red-500 font-medium">{errors.dueDay}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">Limite Total</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
                                    <input
                                        type="number"
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(e.target.value);
                                            if (errors.limit) setErrors({ ...errors, limit: undefined });
                                        }}
                                        placeholder="0,00"
                                        className={cn(
                                            "w-full h-12 pl-10 pr-4 rounded-xl border bg-white focus:outline-none transition-all",
                                            errors.limit
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-200 focus:border-brand"
                                        )}
                                    />
                                </div>
                                {errors.limit && <p className="text-xs text-red-500 font-medium">{errors.limit}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">Últimos 4 Dígitos (Opcional)</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={last4Digits}
                                    onChange={(e) => {
                                        setLast4Digits(e.target.value.replace(/\D/g, ''));
                                        if (errors.last4digits) setErrors({ ...errors, last4digits: undefined });
                                    }}
                                    placeholder="1234"
                                    className={cn(
                                        "w-full h-12 px-4 rounded-xl border bg-white focus:outline-none transition-all tracking-widest",
                                        errors.last4digits
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-200 focus:border-brand"
                                    )}
                                />
                                {errors.last4digits && <p className="text-xs text-red-500 font-medium">{errors.last4digits}</p>}
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-gray-700">Tema Visual</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setTheme('black')}
                                        className={cn(
                                            "h-16 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold transition-all",
                                            theme === 'black' ? "ring-2 ring-brand ring-offset-2" : "opacity-80 hover:opacity-100"
                                        )}
                                    >
                                        Black
                                    </button>
                                    <button
                                        onClick={() => setTheme('lime')}
                                        className={cn(
                                            "h-16 rounded-xl bg-[#CCFF00] flex items-center justify-center text-black text-xs font-bold transition-all",
                                            theme === 'lime' ? "ring-2 ring-brand ring-offset-2" : "opacity-80 hover:opacity-100"
                                        )}
                                    >
                                        Lime
                                    </button>
                                    <button
                                        onClick={() => setTheme('white')}
                                        className={cn(
                                            "h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-black text-xs font-bold transition-all",
                                            theme === 'white' ? "ring-2 ring-brand ring-offset-2" : "hover:bg-gray-50"
                                        )}
                                    >
                                        White
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 rounded-b-3xl bg-gray-50/50">
                    <button
                        onClick={handleClose}
                        className="px-6 h-12 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 h-12 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div >
    );
}
