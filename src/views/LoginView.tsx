import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

export function LoginView() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Preencha todos os campos.');
            return;
        }

        setIsLoading(true);
        try {
            await login(email);
            navigate('/dashboard');
        } catch (err) {
            setError('Falha ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F2F4F8] p-4 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 md:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-brand/30">
                        ⚡
                    </div>
                    <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">MyCash+</h1>
                    <p className="text-gray-500">Gerencie suas finanças com inteligência.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand/50 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-secondary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand/50 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-secondary"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-bold text-center animate-in shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-secondary text-white rounded-2xl font-bold text-lg hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Entrar
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Não tem uma conta? <a href="#" className="font-bold text-secondary hover:underline">Cadastre-se</a>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-center text-xs text-gray-400 font-medium">
                © 2026 MyCash+. Todos os direitos reservados.
            </div>
        </div>
    );
}
