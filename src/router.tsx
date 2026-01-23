import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui/PageTransition';
import { SummarySection } from './components/dashboard/summary/SummarySection';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from './components/dashboard/categories/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from './components/dashboard/charts/FinancialFlowChart';
import { CreditCardsWidget } from './components/dashboard/widgets/CreditCardsWidget';
import { UpcomingExpensesWidget } from './components/dashboard/widgets/UpcomingExpensesWidget';
import { TransactionsTable } from './components/dashboard/transactions/TransactionsTable';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { CardsView } from './views/CardsView';
import { TransactionsView } from './views/TransactionsView';
import { ProfileView } from './views/ProfileView';

const Dashboard = () => (
    <div className="flex flex-col gap-6 pb-20">
        {/* Header with Controls */}
        <DashboardHeader />

        {/* Main Grid: Left Content (2/3) + Right Sidebar (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT COLUMN: Main content area */}
            <div className="xl:col-span-2 flex flex-col gap-6">
                {/* 1. Categories */}
                <ExpensesByCategoryCarousel />

                {/* 2. Summary Cards */}
                <SummarySection />

                {/* 3. Financial Flow Chart */}
                <FinancialFlowChart />

                {/* 4. Transactions Table */}
                <TransactionsTable />
            </div>

            {/* RIGHT COLUMN: Sidebar widgets */}
            <div className="xl:col-span-1 flex flex-col gap-6">
                {/* 1. Cards (Top Right) */}
                <CreditCardsWidget />

                {/* 2. Upcoming Expenses (Below Cards, roughly next to Chart/Table) */}
                <UpcomingExpensesWidget />
            </div>
        </div>
    </div>
);

const Goals = () => <div className="p-4"></div>;

// Layout Component
function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

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
                className={`flex-1 overflow-y-auto pt-16 xl:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'xl:ml-20' : 'xl:ml-64'
                    }`}
            >
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
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
            { path: '/cards', element: <CardsView /> },
            { path: '/transactions', element: <TransactionsView /> },
            { path: '/profile', element: <ProfileView /> },
        ],
    },
]);
