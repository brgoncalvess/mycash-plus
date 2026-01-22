import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { SummarySection } from './components/dashboard/summary/SummarySection';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from './components/dashboard/categories/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from './components/dashboard/charts/FinancialFlowChart';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

const Dashboard = () => (
    <div className="flex flex-col gap-6 pb-20">
        {/* Page Title */}
        <div>
            <h1 className="text-2xl font-bold text-secondary mb-1">Dashboard</h1>
            <p className="text-gray-500">Visão geral das suas finanças</p>
        </div>

        {/* Header with Controls */}
        <DashboardHeader />

        {/* Category Carousel */}
        <ExpensesByCategoryCarousel />

        {/* Summary Cards */}
        <SummarySection />

        {/* Main Content Grid: Left (Charts + Table) + Right (Widgets) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Financial Flow Chart */}
                <FinancialFlowChart />

                {/* Detailed Statement Table */}
                <section className="bg-surface border border-secondary-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Extrato detalhado
                        </h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Buscar lançamentos"
                                className="h-9 px-3 text-sm border border-secondary-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand/20"
                            />
                            <select className="h-9 px-3 text-sm border border-secondary-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand/20">
                                <option>Despesas</option>
                                <option>Receitas</option>
                                <option>Todos</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 text-center py-8">
                        Tabela de transações (em desenvolvimento)
                    </div>
                </section>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="flex flex-col gap-6">
                {/* Cards & Accounts Widget */}
                <section className="bg-surface border border-secondary-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-secondary flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Cards & contas
                        </h2>
                        <div className="flex items-center gap-1">
                            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-background">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-background">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {/* Card items placeholder */}
                        <div className="text-xs text-gray-400 text-center py-4">
                            Cards e contas (em desenvolvimento)
                        </div>
                    </div>
                </section>

                {/* Upcoming Expenses Widget */}
                <section className="bg-surface border border-secondary-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-secondary flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Próximas despesas
                        </h2>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-background">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {/* Expense items placeholder */}
                        <div className="text-xs text-gray-400 text-center py-4">
                            Próximas despesas (em desenvolvimento)
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
);

const Goals = () => <div className="p-4"><h1>Objetivos</h1></div>;
const Cards = () => <div className="p-4"><h1>Cartões</h1></div>;
const Transactions = () => <div className="p-4"><h1>Transações</h1></div>;
const Profile = () => <div className="p-4"><h1>Perfil</h1></div>;

// Layout Component
function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop only */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Mobile Header - Mobile only */}
            <MobileHeader />

            {/* Main Content */}
            <main
                className={`flex-1 overflow-y-auto pt-16 lg:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                    }`}
            >
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/goals', element: <Goals /> },
            { path: '/cards', element: <Cards /> },
            { path: '/transactions', element: <Transactions /> },
            { path: '/profile', element: <Profile /> },
        ],
    },
]);
