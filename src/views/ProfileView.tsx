import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../utils/cn';
import { User, Mail, DollarSign, LogOut, Plus, Edit2 } from 'lucide-react';
import { AddMemberModal } from '../components/dashboard/members/AddMemberModal';

export function ProfileView() {
    const { members } = useFinance();
    const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    // Assume first member is the logged user for now
    const currentUser = members[0];

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">
                    Meu Perfil
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('info')}
                    className={cn(
                        "px-8 py-4 text-sm font-bold transition-all relative",
                        activeTab === 'info'
                            ? "text-secondary"
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Informações
                    {activeTab === 'info' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={cn(
                        "px-8 py-4 text-sm font-bold transition-all relative",
                        activeTab === 'settings'
                            ? "text-secondary"
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Configurações
                    {activeTab === 'settings' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'info' ? (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">

                    {/* User Profile Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                        {/* Edit Button Absolute */}
                        <button className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors">
                            <Edit2 size={18} />
                        </button>

                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full bg-gray-100 p-1 shrink-0">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {currentUser?.avatarUrl ? (
                                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-secondary">{currentUser?.name || "Usuário"}</h2>
                                <p className="text-gray-500 font-medium">{currentUser?.role || "Membro da Família"}</p>
                            </div>

                            <div className="flex flex-col gap-2 items-center md:items-start">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Mail size={16} />
                                    <span className="text-sm">usuario@email.com</span> {/* Mock Email */}
                                </div>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                    <DollarSign size={16} />
                                    <span className="text-sm font-bold">
                                        {currentUser?.income ? currentUser.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'} / mês
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Family Members List */}
                    <div className="bg-surface rounded-3xl p-8 border border-secondary-50 shadow-sm flex flex-col gap-6">
                        <section className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-secondary">Membros da Família</h3>
                            <button
                                onClick={() => setIsMemberModalOpen(true)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-secondary transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </section>

                        <div className="flex flex-col gap-3">
                            {members.map(member => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-gray-100 transition-all cursor-pointer group"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm shrink-0">
                                        {member.avatarUrl ? (
                                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-secondary group-hover:text-black transition-colors">{member.name}</h4>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>

                                    {/* Income */}
                                    <span className="text-sm font-bold text-green-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                        {(member.income || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {members.length === 1 && (
                            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 text-sm mb-3">Adicione mais membros para gerenciar as finanças da casa juntos.</p>
                                <button
                                    onClick={() => setIsMemberModalOpen(true)}
                                    className="text-sm font-bold text-brand hover:underline"
                                >
                                    Adicionar Membro da Família
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <div className="flex justify-center md:justify-start pt-4">
                        <button className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-xl transition-colors">
                            <LogOut size={20} />
                            Sair do Sistema
                        </button>
                    </div>

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Edit2 size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">Configurações</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">
                        Opções de tema, notificações e segurança estarão disponíveis em breve.
                    </p>
                </div>
            )}

            {/* Modals */}
            <AddMemberModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
            />
        </div>
    );
}
