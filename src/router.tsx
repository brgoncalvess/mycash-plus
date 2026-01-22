import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { FinanceProvider } from './context/FinanceContext';
import { Outlet } from 'react-router-dom';

// Placeholder Pages (will be replaced by actual components later)
const Dashboard = () => <div className="p-4"><h1>Dashboard</h1></div>;
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
