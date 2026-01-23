import { useState } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from '../components/dashboard/categories/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from '../components/dashboard/charts/FinancialFlowChart';
import { CreditCardsWidget } from '../components/dashboard/widgets/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../components/dashboard/widgets/UpcomingExpensesWidget';
import { TransactionsTable } from '../components/dashboard/transactions/TransactionsTable';
import { NewTransactionModal } from '../components/dashboard/transactions/NewTransactionModal';
import { AddCardModal } from '../components/dashboard/members/AddCardModal';
import { AddMemberModal } from '../components/dashboard/members/AddMemberModal';

export function DashboardView() {
    // Shared Modal States
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    // Filter controls (passed to Header)
    // Actually Header uses context for filters, but might need local state for UI toggles? 
    // Header manages its own UI state mostly, but we trigger Modals from here now to share with widgets

    return (
        <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
            {/* Header with Controls */}
            <DashboardHeader
                onNewTransaction={() => setIsTransactionModalOpen(true)}
                onAddMember={() => setIsMemberModalOpen(true)}
            />

            {/* Main Grid: Left Content (2/3) + Right Sidebar (1/3) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Main content area */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {/* 1. Categories */}
                    <ExpensesByCategoryCarousel />

                    {/* 2. Summary Cards */}
                    {/* SummarySection was imported in router, need to import here or keep it in router? 
                        Wait, SummarySection is a component. I should import it. 
                        I forgot to import it in the imports list above. I'll add it.
                    */}

                    {/* 3. Financial Flow Chart */}
                    <FinancialFlowChart />

                    {/* 4. Transactions Table */}
                    <TransactionsTable />
                </div>

                {/* RIGHT COLUMN: Sidebar widgets */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    {/* 1. Cards (Top Right) */}
                    <CreditCardsWidget
                        onAddCard={() => setIsCardModalOpen(true)}
                    />

                    {/* 2. Upcoming Expenses (Below Cards) */}
                    <UpcomingExpensesWidget
                        onAddExpense={() => setIsTransactionModalOpen(true)}
                    />
                </div>
            </div>

            {/* Global Modals at Page Level */}
            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />

            <AddCardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
            />

            <AddMemberModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
            />
        </div>
    );
}
