export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string; // ISO string
    accountId: string;
    memberId?: string; // Optional (family transaction)
    installments?: number; // 1 = one time
    status: TransactionStatus;
}

export interface FinanceGoal {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    targetAmount: number;
    currentAmount: number;
    category: string;
    deadline?: string;
    status: 'active' | 'archived';
}

export type CardTheme = 'black' | 'lime' | 'white';

export interface CreditCard {
    id: string;
    name: string;
    closingDay: number;
    dueDay: number;
    limit: number;
    currentInvoice: number;
    theme: CardTheme;
    logoUrl?: string;
    last4Digits?: string;
}

export interface BankAccount {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'investment' | 'cash';
    balance: number;
    color: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    income?: number;
}

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
}

// Filter State types
export interface DateRange {
    start: Date;
    end: Date;
}

export interface GlobalFilters {
    memberId: string | null; // null = all
    dateRange: DateRange;
    transactionType: 'all' | 'income' | 'expense';
    searchQuery: string;
}
