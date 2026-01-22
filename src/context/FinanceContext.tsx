import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
    Transaction,
    FinanceGoal,
    CreditCard,
    BankAccount,
    FamilyMember,
    Category,
    GlobalFilters
} from '../types';
import { startOfMonth, endOfMonth } from 'date-fns';

interface FinanceContextType {
    transactions: Transaction[];
    goals: FinanceGoal[];
    cards: CreditCard[];
    accounts: BankAccount[];
    members: FamilyMember[];
    categories: Category[];
    filters: GlobalFilters;

    // Actions
    setFilters: (filters: Partial<GlobalFilters>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    // ... more actions to be added
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    // Mock Data Initialization
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals] = useState<FinanceGoal[]>([]);
    const [cards] = useState<CreditCard[]>([]);
    const [accounts] = useState<BankAccount[]>([]);
    const [members] = useState<FamilyMember[]>([]);
    const [categories] = useState<Category[]>([]);

    const [filters, setFiltersState] = useState<GlobalFilters>({
        memberId: null,
        dateRange: {
            start: startOfMonth(new Date()),
            end: endOfMonth(new Date())
        },
        transactionType: 'all',
        searchQuery: ''
    });

    const setFilters = (newFilters: Partial<GlobalFilters>) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            goals,
            cards,
            accounts,
            members,
            categories,
            filters,
            setFilters,
            addTransaction
        }}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
