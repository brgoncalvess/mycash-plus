import React from 'react';
import {
    LayoutDashboard,
    Target,
    CreditCard,
    ArrowLeftRight,
    User,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
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

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    // Check active path logic
    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/dashboard') return true;
        return location.pathname === path;
    };

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                    <div className="w-8 h-8 bg-brand rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="font-bold text-lg text-black">+</span>
                    </div>
                    <span className={cn(
                        "font-bold text-xl text-black transition-opacity duration-300",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    )}>
                        mycash+
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                            isActive(item.path)
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-50 hover:text-black"
                        )}
                    >
                        <item.icon
                            size={20}
                            className={cn(
                                "flex-shrink-0 transition-colors",
                                isActive(item.path) ? "text-brand" : "text-current"
                            )}
                        />
                        <span className={cn(
                            "font-medium whitespace-nowrap transition-all duration-300 origin-left",
                            isCollapsed ? "opacity-0 w-0 translate-x-4" : "opacity-100 w-auto"
                        )}>
                            {item.label}
                        </span>

                        {/* Tooltip for Collapsed State */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer overflow-hidden",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    />
                    <div className={cn(
                        "flex-col transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isCollapsed ? "opacity-0 w-0 hidden" : "flex opacity-100"
                    )}>
                        <span className="text-sm font-bold text-gray-900">Bruno G.</span>
                        <span className="text-xs text-gray-500">bruno@email.com</span>
                    </div>
                </div>
            </div>

            {/* Collapse Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
}
