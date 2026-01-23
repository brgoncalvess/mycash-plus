import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui/PageTransition';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { CardsView } from './views/CardsView';
import { TransactionsView } from './views/TransactionsView';
import { ProfileView } from './views/ProfileView';

import { DashboardView } from './views/DashboardView';

// ...

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
            { path: '/', element: <DashboardView /> },
            { path: '/dashboard', element: <DashboardView /> },
            { path: '/goals', element: <Goals /> },
            { path: '/cards', element: <CardsView /> },
            { path: '/transactions', element: <TransactionsView /> },
            { path: '/profile', element: <ProfileView /> },
        ],
    },
]);
