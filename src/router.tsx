import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { SummarySection } from './components/dashboard/summary/SummarySection';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from './components/dashboard/categories/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from './components/dashboard/charts/FinancialFlowChart';
import { CreditCardsWidget } from './components/dashboard/widgets/CreditCardsWidget';
import { UpcomingExpensesWidget } from './components/dashboard/widgets/UpcomingExpensesWidget';
import { TransactionsTable } from './components/dashboard/transactions/TransactionsTable';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

const Dashboard = () => (
    <div className="flex flex-col gap-6 pb-20">
        {/* Header with Controls */}
        <DashboardHeader />

        {/* Top Section: Categories & Summary (Left) + Credit Cards (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Categories + Summary */}
            <div className="xl:col-span-2 flex flex-col gap-6">
                <ExpensesByCategoryCarousel />
                <SummarySection />
            </div>

            {/* Right Column: Cards & Accounts */}
            <div className="xl:col-span-1 flex flex-col gap-6">
                <CreditCardsWidget />
            </div>
        </div>

        {/* Middle Section: Charts */}
        <div className="w-full">
            <FinancialFlowChart />
        </div>

        {/* Bottom Section: Transactions & Upcoming */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
                <TransactionsTable />
            </div>
            <div className="xl:col-span-1">
                <UpcomingExpensesWidget />
            </div>
        </div>
    </div>
);

const Goals = () => <div className="p-4"></div>;
const Cards = () => <div className="p-4"></div>;
const Transactions = () => <div className="p-4"></div>;
const Profile = () => <div className="p-4"></div>;

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
