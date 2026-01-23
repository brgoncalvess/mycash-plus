import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Link, Upload as UploadIcon } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import { formatCurrencyMask, parseCurrencyToNumber } from '../../../utils/masks';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COMMON_ROLES = ["Pai", "Mãe", "Filho", "Filha", "Avô", "Avó", "Tio", "Tia"];

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const { addMember } = useFinance();

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [income, setIncome] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<{
        name?: string;
        role?: string;
        avatar?: string;
    }>({});

    const [showExiting, setShowExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset
            setName('');
            setRole('');
            setIncome('');
            setAvatarUrl('');
            setAvatarType('url');
            setAvatarFile(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, avatar: "O arquivo deve ter no máximo 5MB." });
                return;
            }
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, avatar: "Apenas arquivos de imagem são permitidos." });
                return;
            }

            setAvatarFile(file);
            setErrors({ ...errors, avatar: undefined });

            // Create preview URL
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    const handleSubmit = () => {
        const formErrors: typeof errors = {};

        if (!name || name.trim().length < 3) {
            formErrors.name = "Por favor, insira um nome válido (min 3 caracteres).";
        }
        if (!role || role.trim().length === 0) {
            formErrors.role = "Por favor, informe a função na família.";
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            const numericIncome = income
                ? parseCurrencyToNumber(income)
                : 0;

            // For file upload, in a real app we'd upload to a server here.
            // For now, we use the objectUrl or the text URL.

            addMember({
                name: name.trim(),
                role: role.trim(),
                income: numericIncome,
                avatarUrl: avatarUrl || undefined // Assuming context handles undefined by showing default later or we can simulate
            });

            // Simulate Success Toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[60] animate-in slide-in-from-right duration-300';
            toast.innerHTML = `<div class="bg-green-500 rounded-full p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="font-bold">Membro adicionado com sucesso!</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => toast.remove(), 300);
            }, 3000);

            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    showExiting ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
            />

            <div
                className={cn(
                    "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300",
                    showExiting ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in zoom-in-95 duration-300"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-secondary">Adicionar Membro da Família</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            placeholder="Ex: João Silva"
                            className={cn(
                                "w-full h-11 px-4 rounded-lg border bg-white focus:outline-none transition-all",
                                errors.name
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10"
                            )}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Função na Família</label>
                        <div className="relative">
                            <input
                                list="roles"
                                type="text"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (errors.role) setErrors({ ...errors, role: undefined });
                                }}
                                placeholder="Ex: Pai, Mãe, Filho..."
                                className={cn(
                                    "w-full h-11 px-4 rounded-lg border bg-white focus:outline-none transition-all",
                                    errors.role
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10"
                                )}
                            />
                            <datalist id="roles">
                                {COMMON_ROLES.map(r => <option key={r} value={r} />)}
                            </datalist>
                        </div>
                        {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-gray-700">Avatar (Opcional)</label>
                        <div className="bg-gray-50 rounded-xl p-1 flex gap-1">
                            <button
                                onClick={() => setAvatarType('url')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                                    avatarType === 'url' ? "bg-white shadow text-secondary" : "text-gray-500 hover:text-secondary"
                                )}
                            >
                                <Link size={14} />
                                URL da Imagem
                            </button>
                            <button
                                onClick={() => setAvatarType('upload')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                                    avatarType === 'upload' ? "bg-white shadow text-secondary" : "text-gray-500 hover:text-secondary"
                                )}
                            >
                                <UploadIcon size={14} />
                                Upload
                            </button>
                        </div>

                        {avatarType === 'url' ? (
                            <input
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://exemplo.com/foto.jpg"
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none text-sm"
                            />
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <ImageIcon size={24} className="text-gray-400" />
                                    <span className="text-xs font-medium">
                                        {avatarFile ? avatarFile.name : "Clique para selecionar ou arraste"}
                                    </span>
                                </div>
                            </div>
                        )}
                        {errors.avatar && <p className="text-xs text-red-500">{errors.avatar}</p>}
                    </div>

                    {/* Income */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Renda Mensal Estimada (Opcional)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={income}
                                onChange={(e) => setIncome(formatCurrencyMask(e.target.value))}
                                placeholder="0,00"
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none text-sm"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl bg-gray-50/50">
                    <button
                        onClick={handleClose}
                        className="px-5 h-10 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 h-10 rounded-lg bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                        Adicionar Membro
                    </button>
                </div>
            </div>
        </div>
    );
}
