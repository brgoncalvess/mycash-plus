import { useState } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ExpensesByCategoryCarousel } from '../components/dashboard/categories/ExpensesByCategoryCarousel';
import { SummarySection } from '../components/dashboard/summary/SummarySection';
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

    return (
        <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
            {/* Header with Controls */}
            <DashboardHeader
                onNewTransaction={() => setIsTransactionModalOpen(true)}
                onAddMember={() => setIsMemberModalOpen(true)}
            />

            {/* Main Grid: Left Content (2/3) + Right Sidebar (1/3) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                {/* LEFT COLUMN: Main content area */}
                <div className="xl:col-span-2 flex flex-col gap-6 w-full min-w-0">
                    {/* 1. Categories */}
                    <ExpensesByCategoryCarousel />

                    {/* 2. Summary Cards */}
                    <SummarySection />

                    {/* 3. Financial Flow Chart */}
                    <FinancialFlowChart />
                </div>

                {/* RIGHT COLUMN: Sidebar widgets */}
                <div className="xl:col-span-1 flex flex-col gap-6 w-full min-w-0">
                    <CreditCardsWidget
                        onAddCard={() => setIsCardModalOpen(true)}
                    />
                    <UpcomingExpensesWidget
                        onAddExpense={() => setIsTransactionModalOpen(true)}
                    />
                </div>
            </div>

            {/* 4. Transactions Table (Full Width) */}
            <TransactionsTable itemsPerPage={10} />

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
