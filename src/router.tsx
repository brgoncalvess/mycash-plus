import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { FinanceProvider } from './context/FinanceContext';
import { Outlet } from 'react-router-dom';

// Placeholder Pages (will be replaced by actual components later)
import { SummarySection } from './components/dashboard/summary/SummarySection';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from './components/dashboard/categories/ExpensesByCategoryCarousel';

const Dashboard = () => (
    <div className="flex flex-col gap-6 pb-20">
        <div>
            <h1 className="text-2xl font-bold text-secondary mb-1">Dashboard</h1>
            <p className="text-gray-500">Visão geral das suas finanças</p>
        </div>
        <DashboardHeader />
        <SummarySection />

        {/* Expenses by Category */}
        <section>
            <h2 className="text-lg font-bold text-secondary mb-4">Gastos por Categoria</h2>
            <ExpensesByCategoryCarousel />
        </section>
    </div>
);
const Goals = () => <div className="p-4"><h1>Objetivos</h1></div>;
const Cards = () => <div className="p-4"><h1>Cartões</h1></div>;
const Transactions = () => <div className="p-4"><h1>Transações</h1></div>;
const Profile = () => <div className="p-4"><h1>Perfil</h1></div>;

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <FinanceProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </FinanceProvider>
        ),
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/goals',
                element: <Goals />,
            },
            {
                path: '/cards',
                element: <Cards />,
            },
            {
                path: '/transactions',
                element: <Transactions />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
        ],
    },
]);
