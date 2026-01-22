import React, { useState } from 'react';
import { X, LayoutDashboard, Target, CreditCard, ArrowLeftRight, User, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

type NavItem = {
    icon: React.ElementType;
    label: string;
    path: string;
};

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Target, label: 'Objetivos', path: '/goals' },
    { icon: CreditCard, label: 'Cartões', path: '/cards' },
    { icon: ArrowLeftRight, label: 'Transações', path: '/transactions' },
    { icon: User, label: 'Perfil', path: '/profile' },
];

export function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check active path logic
    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/dashboard') return true;
        return location.pathname === path;
    };

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-secondary-50 z-40 px-4 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg text-secondary">+</span>
                    </div>
                    <span className="font-bold text-xl text-secondary">mycash+</span>
                </div>

                {/* User Avatar (Toggle) */}
                <button onClick={() => setIsOpen(!isOpen)} className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User"
                        className="w-10 h-10 rounded-full border border-secondary-50"
                    />
                </button>
            </header>

            {/* Dropdown / Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-secondary-500/50 z-40 lg:hidden backdrop-blur-sm"
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-0 left-0 right-0 bg-surface z-50 rounded-b-3xl shadow-float overflow-hidden pt-20 pb-6 px-4 lg:hidden border-b border-secondary-50"
                        >
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-background rounded-full hover:bg-secondary-50 transition-colors text-secondary"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                            isActive(item.path)
                                                ? "bg-secondary text-surface"
                                                : "text-secondary hover:bg-background hover:text-secondary-500"
                                        )}
                                    >
                                        <item.icon
                                            size={20}
                                            className={isActive(item.path) ? "text-brand" : "text-current"}
                                        />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}

                                <div className="h-px bg-secondary-50 my-2" />

                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={20} />
                                    <span className="font-medium">Sair</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
