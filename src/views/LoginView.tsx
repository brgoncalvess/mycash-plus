import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Loader2, User as UserIcon } from 'lucide-react';

export function LoginView() {
    const { login, signUp } = useAuth();
    const navigate = useNavigate();

    // Mode State
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !password) {
            setError('Preencha email e senha.');
            return;
        }

        if (!isLogin && !name) {
            setError('Preencha seu nome.');
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await login(email, password);
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { error } = await signUp(email, password, name);
                if (error) throw error;
                setSuccessMessage('Conta criada! Verifique seu email ou faça login.');
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
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
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-brand/30">
                        ⚡
                    </div>
                    <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">MyCash+</h1>
                    <p className="text-gray-500">
                        {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta agora.'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLogin && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Seu nome completo"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand/50 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-secondary"
                                />
                            </div>
                        </div>
                    )}

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
                                placeholder="Minimo 6 caracteres"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand/50 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-secondary"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-bold text-center animate-in shake">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-4 rounded-xl bg-green-50 text-green-600 text-sm font-bold text-center animate-in zoom-in">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-secondary text-white rounded-2xl font-bold text-lg hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Entrar' : 'Cadastrar'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'} {' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setSuccessMessage('');
                            }}
                            className="font-bold text-secondary hover:underline"
                        >
                            {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                        </button>
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
