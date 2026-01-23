import { createContext, useContext, useState, type ReactNode, useMemo } from 'react';
import type {
    Transaction,
    FinanceGoal,
    CreditCard,
    BankAccount,
    FamilyMember,
    Category,
    GlobalFilters
} from '../types';
import {
    MOCK_ACCOUNTS,
    MOCK_CARDS,
    MOCK_CATEGORIES,
    MOCK_GOALS,
    MOCK_MEMBERS,
    MOCK_TRANSACTIONS
} from '../data/mockData';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface FinanceContextType {
    // State
    transactions: Transaction[];
    goals: FinanceGoal[];
    cards: CreditCard[];
    accounts: BankAccount[];
    members: FamilyMember[];
    categories: Category[];
    filters: GlobalFilters;

    // Actions
    setFilters: (filters: Partial<GlobalFilters>) => void;

    // CRUD Transactions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;

    // CRUD Goals
    addGoal: (goal: Omit<FinanceGoal, 'id'>) => void;
    updateGoal: (id: string, updates: Partial<FinanceGoal>) => void;
    deleteGoal: (id: string) => void;

    // Derived Calculations (Selectors)
    getFilteredTransactions: () => Transaction[];
    calculateTotalBalance: () => number;
    calculateIncomeForPeriod: () => number;
    calculateExpensesForPeriod: () => number;
    calculateExpensesByCategory: () => { category: string; amount: number; color: string }[];
    calculateCategoryPercentage: (categoryName: string) => number;
    calculateSavingsRate: () => number;
    addCategory: (category: Omit<Category, 'id'>) => void;
    addMember: (member: Omit<FamilyMember, 'id'>) => void;
    updateMember: (id: string, updates: Partial<FamilyMember>) => void;
    addAccount: (account: Omit<BankAccount, 'id'>) => void;
    updateAccount: (id: string, updates: Partial<BankAccount>) => void;
    addCard: (card: Omit<CreditCard, 'id'>) => void;
    updateCard: (id: string, updates: Partial<CreditCard>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    // --- State Initialization with Mock Data ---
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [goals, setGoals] = useState<FinanceGoal[]>(MOCK_GOALS);
    const [cards, setCards] = useState<CreditCard[]>(MOCK_CARDS);
    const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
    const [members, setMembers] = useState<FamilyMember[]>(MOCK_MEMBERS);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

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

    // --- CRUD Actions ---

    // Members
    const addMember = (member: Omit<FamilyMember, 'id'>) => {
        const newMember = { ...member, id: crypto.randomUUID() };
        setMembers(prev => [...prev, newMember]);
    };

    const updateMember = (id: string, updates: Partial<FamilyMember>) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    // Categories
    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = { ...category, id: crypto.randomUUID() };
        setCategories(prev => [...prev, newCategory]);
    };

    // Accounts
    const addAccount = (account: Omit<BankAccount, 'id'>) => {
        const newAccount = { ...account, id: crypto.randomUUID() };
        setAccounts(prev => [...prev, newAccount]);
    };

    const updateAccount = (id: string, updates: Partial<BankAccount>) => {
        setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    // Cards
    const addCard = (card: Omit<CreditCard, 'id'>) => {
        const newCard = { ...card, id: crypto.randomUUID() };
        setCards(prev => [...prev, newCard]);
    };

    const updateCard = (id: string, updates: Partial<CreditCard>) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    // Transactions
    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const updateTransaction = (id: string, updates: Partial<Transaction>) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Goals
    const addGoal = (goal: Omit<FinanceGoal, 'id'>) => {
        const newGoal = { ...goal, id: crypto.randomUUID() };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoal = (id: string, updates: Partial<FinanceGoal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };


    // --- Derived Calculations ---

    // Memoize the filtered transactions to avoid recalculating on every render unless dependencies change
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Filter by Member
            if (filters.memberId && t.memberId !== filters.memberId) return false;

            // Filter by Date Range
            const tDate = parseISO(t.date);
            if (!isWithinInterval(tDate, { start: filters.dateRange.start, end: filters.dateRange.end })) return false;

            // Filter by Type
            if (filters.transactionType !== 'all' && t.type !== filters.transactionType) return false;

            // Filter by Search Query
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                return (
                    t.description.toLowerCase().includes(query) ||
                    t.category.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [transactions, filters]);

    const getFilteredTransactions = () => filteredTransactions;

    const calculateTotalBalance = () => {
        // Defines "Net Worth" = Sum(Accounts) - Sum(Card Invoices)
        // If a member is selected, we could try to filter, but Accounts/Cards usually aren't strictly 1:1 with members in this model type.
        // Assuming Accounts/Cards are family assets unless we add owners to them. 
        // For now, TotalBalance is Global (or we could filter if we add ownerId to accounts/cards).
        // Since the prompt asks for "Calculate Total Balance" and "Filtered Transactions" separately, I will treat Balance as global or respecting filters?
        // Usually Balance is a snapshot. I will respect the 'memberId' filter if possible, but the mock data for accounts doesn't have memberId. 
        // So `calculateTotalBalance` will be GLOBAL net worth, ignoring filters (except maybe if we add ownership later). 
        // WAIT: logic says "soma saldos de contas e subtrai faturas".

        const totalAccounts = accounts.reduce((acc, curr) => acc + curr.balance, 0);
        const totalInvoices = cards.reduce((acc, curr) => acc + curr.currentInvoice, 0);
        return totalAccounts - totalInvoices;
    };

    const calculateIncomeForPeriod = () => {
        return filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const calculateExpensesForPeriod = () => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const calculateExpensesByCategory = () => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const grouped: Record<string, number> = {};

        expenses.forEach(t => {
            grouped[t.category] = (grouped[t.category] || 0) + t.amount;
        });

        return Object.entries(grouped)
            .map(([category, amount]) => ({
                category,
                amount,
                color: categories.find(c => c.name === category)?.color || '#9CA3AF'
            }))
            .sort((a, b) => b.amount - a.amount);
    };

    const calculateCategoryPercentage = (categoryName: string) => {
        const totalIncome = calculateIncomeForPeriod(); // Usually percentage is of Income? Or Total Expenses?
        // Prompt says "percentual em relação à receita total" (percentage relative to total income).
        if (totalIncome === 0) return 0;

        // Find expenses for this category in the filtered set
        const categoryExpenses = filteredTransactions
            .filter(t => t.type === 'expense' && t.category === categoryName)
            .reduce((acc, curr) => acc + curr.amount, 0);

        return (categoryExpenses / totalIncome) * 100;
    };

    const calculateSavingsRate = () => {
        const income = calculateIncomeForPeriod();
        const expenses = calculateExpensesForPeriod();

        if (income === 0) return 0;
        return ((income - expenses) / income) * 100;
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
            addTransaction,
            updateTransaction,
            deleteTransaction,
            addGoal,
            updateGoal,
            deleteGoal,
            getFilteredTransactions,
            calculateTotalBalance,
            calculateIncomeForPeriod,
            calculateExpensesForPeriod,
            calculateExpensesByCategory,
            calculateCategoryPercentage,
            calculateSavingsRate,
            addCategory,
            addMember,
            updateMember,
            addAccount,
            updateAccount,
            addCard,
            updateCard
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
