export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string; // ISO 8601
    accountId: string;
    memberId?: string; // Optional for family-shared
    installments?: number; // 1 = instant
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
    yieldType?: 'CDI' | 'Savings' | 'Crypto' | 'Stocks';
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
    bankName?: string;
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

export interface GlobalFilters {
    memberId: string | null;
    dateRange: {
        start: Date;
        end: Date;
    };
    transactionType: 'all' | 'income' | 'expense';
    searchQuery: string;
}
