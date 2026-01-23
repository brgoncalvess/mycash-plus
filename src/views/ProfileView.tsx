import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { User, Mail, DollarSign, LogOut, Plus, Edit2, Save, Lock, Eye, EyeOff, Bell, Moon, Shield, Download, Trash2, HelpCircle, ChevronRight, Smartphone, Globe } from 'lucide-react';
import { AddMemberModal } from '../components/dashboard/members/AddMemberModal';

export function ProfileView() {
    const { logout } = useAuth();
    const { members, updateMember, deleteMember } = useFinance();
    const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    // Assume first member is the logged user for now
    const currentUser = members[0];

    // Edit Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('usuario@email.com');
    const [editPassword, setEditPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setEditName(currentUser.name);
        }
    }, [currentUser]);

    const handleSaveProfile = () => {
        if (currentUser) {
            updateMember(currentUser.id, { name: editName });
            setIsEditingProfile(false);

            // Toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-right duration-300';
            toast.innerHTML = `<div class="bg-green-500 rounded-full p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="font-bold">Perfil atualizado!</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };

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
                        {/* Edit Button Absolute (Toggle) */}
                        {!isEditingProfile ? (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                        ) : (
                            <div className="absolute top-6 right-6 flex gap-2">
                                <button
                                    onClick={() => setIsEditingProfile(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2"
                                >
                                    <Save size={14} />
                                    Salvar
                                </button>
                            </div>
                        )}

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

                        {/* Info Form */}
                        <div className="flex-1 text-center md:text-left space-y-4 w-full md:w-auto">
                            <div>
                                {isEditingProfile ? (
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="text-2xl font-bold text-secondary border-b border-gray-300 focus:border-brand focus:outline-none w-full md:w-auto text-center md:text-left bg-transparent"
                                        placeholder="Seu Nome"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-secondary">{currentUser?.name || "Usuário"}</h2>
                                )}
                                <p className="text-gray-500 font-medium">{currentUser?.role || "Membro da Família"}</p>
                            </div>

                            <div className="flex flex-col gap-4 items-center md:items-start max-w-md">
                                {/* Email Field */}
                                <div className="flex flex-col gap-1 w-full">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">Email / Login</label>
                                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus-within:border-brand focus-within:bg-white transition-all w-full">
                                        <Mail size={16} />
                                        {isEditingProfile ? (
                                            <input
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                                placeholder="Seu email"
                                            />
                                        ) : (
                                            <span className="text-sm">{editEmail}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Password Field (Only shows when editing or placeholder) */}
                                {isEditingProfile && (
                                    <div className="flex flex-col gap-1 w-full animate-in fade-in slide-in-from-top-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">Senha</label>
                                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus-within:border-brand focus-within:bg-white transition-all w-full">
                                            <Lock size={16} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                                placeholder="Nova senha (opcional)"
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-secondary">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit mt-2">
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
                                    {/* Delete Button (Only if not self - simplified check) */}
                                    {members.indexOf(member) !== 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Tem certeza que deseja remover este membro?')) {
                                                    deleteMember(member.id);
                                                }
                                            }}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remover membro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
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
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            Sair do Sistema
                        </button>
                    </div>

                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">

                    {/* General Settings */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-brand" />
                            Geral
                        </h3>
                        <div className="space-y-1">
                            {/* Dark Mode */}
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                                        <Moon size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold text-secondary">Tema Escuro</span>
                                        <span className="text-xs text-gray-500">Ajustar aparência do app</span>
                                    </div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                                        <Bell size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold text-secondary">Notificações</span>
                                        <span className="text-xs text-gray-500">Gerenciar alertas e avisos</span>
                                    </div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary cursor-pointer">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-brand" />
                            Segurança
                        </h3>
                        <div className="space-y-1">
                            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-brand group-hover:text-secondary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-secondary">Alterar Senha</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-brand group-hover:text-secondary transition-colors">
                                        <Smartphone size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-secondary">Autenticação em 2 Fatores</span>
                                </div>
                                <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Ativado</div>
                            </button>
                        </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                            <Download size={20} className="text-brand" />
                            Dados
                        </h3>
                        <div className="space-y-1">
                            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-brand group-hover:text-secondary transition-colors">
                                        <Download size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold text-secondary">Exportar Dados</span>
                                        <span className="text-xs text-gray-500">Baixar cópia em JSON</span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-brand group-hover:text-secondary transition-colors">
                                        <HelpCircle size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-secondary">Central de Ajuda</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 mb-8">
                        <h3 className="text-lg font-bold text-red-600 mb-4">Zona de Perigo</h3>
                        <button className="w-full flex items-center gap-3 p-4 bg-white border border-red-100 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all font-bold shadow-sm">
                            <Trash2 size={18} />
                            Excluir minha conta
                        </button>
                    </div>
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
