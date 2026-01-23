import type {
    Transaction,
    FinanceGoal,
    CreditCard,
    BankAccount,
    FamilyMember,
    Category
} from '../types';

export const MOCK_MEMBERS: FamilyMember[] = [
    { id: 'm1', name: 'Ana Silva', role: 'Mãe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', income: 8500 },
    { id: 'm2', name: 'Carlos Silva', role: 'Pai', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', income: 9200 },
    { id: 'm3', name: 'Lucas Silva', role: 'Filho', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026302d', income: 0 }
];

export const MOCK_CATEGORIES: Category[] = [
    { id: 'c1', name: 'Moradia', type: 'expense', color: '#EF4444' },
    { id: 'c2', name: 'Alimentação', type: 'expense', color: '#F97316' },
    { id: 'c3', name: 'Transporte', type: 'expense', color: '#EAB308' },
    { id: 'c4', name: 'Lazer', type: 'expense', color: '#3B82F6' },
    { id: 'c5', name: 'Saúde', type: 'expense', color: '#EC4899' },
    { id: 'c6', name: 'Educação', type: 'expense', color: '#8B5CF6' },
    { id: 'c7', name: 'Salário', type: 'income', color: '#22C55E' },
    { id: 'c8', name: 'Investimentos', type: 'income', color: '#10B981' },
    { id: 'c9', name: 'Freelance', type: 'income', color: '#14B8A6' }
];

export const MOCK_ACCOUNTS: BankAccount[] = [
    { id: 'a1', name: 'Nubank', type: 'checking', balance: 12500.50, color: '#820AD1' },
    { id: 'a2', name: 'Inter', type: 'investment', balance: 45000.00, color: '#FF7A00' },
    { id: 'a3', name: 'Itaú', type: 'checking', balance: 3200.10, color: '#EC7000' },
    { id: 'a4', name: 'Carteira', type: 'cash', balance: 450.00, color: '#1A1A1A' }
];

import { BANKS } from '../constants/banks';

export const MOCK_CARDS: CreditCard[] = [
    {
        id: 'cd1',
        name: 'Nubank Ultravioleta',
        closingDay: 25,
        dueDay: 5,
        limit: 20000,
        currentInvoice: 4500.20,
        theme: 'black',
        last4Digits: '8834',
        bankName: 'Nubank',
        logoUrl: BANKS.find(b => b.id === 'nubank')?.logoUrl
    },
    {
        id: 'cd2',
        name: 'XP Visa Infinite',
        closingDay: 10,
        dueDay: 17,
        limit: 50000,
        currentInvoice: 1250.00,
        theme: 'black', // Using black theme for premium feel
        last4Digits: '1290',
        bankName: 'XP Investimentos',
        logoUrl: BANKS.find(b => b.id === 'xp')?.logoUrl
    },
    {
        id: 'cd3',
        name: 'Inter Black',
        closingDay: 1,
        dueDay: 10,
        limit: 15000,
        currentInvoice: 890.90,
        theme: 'white', // Changed to white for variety
        last4Digits: '9921',
        bankName: 'Inter',
        logoUrl: BANKS.find(b => b.id === 'inter')?.logoUrl
    }
];

export const MOCK_GOALS: FinanceGoal[] = [
    {
        id: 'g1',
        name: 'Viagem Europa',
        description: 'Férias em família para Itália e França',
        targetAmount: 30000,
        currentAmount: 12500,
        category: 'Viagem',
        status: 'active',
        deadline: '2026-12-01'
    },
    {
        id: 'g2',
        name: 'Troca de Carro',
        description: 'Entrada para um SUV híbrido',
        targetAmount: 80000,
        currentAmount: 45000,
        category: 'Bens',
        status: 'active',
        deadline: '2027-06-01'
    },
    {
        id: 'g3',
        name: 'Reserva de Emergência',
        description: '6 meses de custo de vida',
        targetAmount: 50000,
        currentAmount: 50000,
        category: 'Segurança',
        status: 'active'
    },
    {
        id: 'g4',
        name: 'Novo MacBook',
        description: 'Upgrade para trabalho',
        targetAmount: 15000,
        currentAmount: 2000,
        category: 'Eletrônicos',
        status: 'active',
        deadline: '2026-06-01'
    }
];


export const MOCK_TRANSACTIONS: Transaction[] = [
    // JANEIRO 2026 (Current Month)
    { id: 't1', type: 'expense', amount: 850.00, description: 'Supermercado Semanal', category: 'Alimentação', date: '2026-01-20', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't2', type: 'expense', amount: 120.50, description: 'Uber Trabalho', category: 'Transporte', date: '2026-01-18', accountId: 'a1', memberId: 'm2', status: 'completed' },
    { id: 't3', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2026-01-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't4', type: 'expense', amount: 350.00, description: 'Jantar Fora', category: 'Lazer', date: '2026-01-15', accountId: 'cd1', memberId: 'm1', status: 'completed' },
    { id: 't5', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2026-01-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't100', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2026-01-05', accountId: 'a3', memberId: 'm2', status: 'completed' },

    // DEZEMBRO 2025
    { id: 't6', type: 'expense', amount: 450.00, description: 'Combustível', category: 'Transporte', date: '2025-12-20', accountId: 'cd2', memberId: 'm2', status: 'completed' },
    { id: 't7', type: 'expense', amount: 2500.00, description: 'Escola Lucas', category: 'Educação', date: '2025-12-15', accountId: 'a3', memberId: 'm1', status: 'completed' },
    { id: 't8', type: 'income', amount: 1200.00, description: 'Freelance Design', category: 'Freelance', date: '2025-12-10', accountId: 'a2', memberId: 'm1', status: 'completed' },
    { id: 't101', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-12-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't102', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-12-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't103', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-12-10', accountId: 'a3', memberId: 'm2', status: 'completed' },

    // NOVEMBRO 2025
    { id: 't104', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-11-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't105', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-11-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't106', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-11-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't107', type: 'expense', amount: 800.00, description: 'Supermercado', category: 'Alimentação', date: '2025-11-12', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // OUTUBRO 2025
    { id: 't108', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-10-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't109', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-10-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't110', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-10-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't111', type: 'expense', amount: 750.00, description: 'Supermercado', category: 'Alimentação', date: '2025-10-15', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // SETEMBRO 2025
    { id: 't112', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-09-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't113', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-09-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't114', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-09-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't115', type: 'expense', amount: 900.00, description: 'Supermercado', category: 'Alimentação', date: '2025-09-18', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // AGOSTO 2025
    { id: 't116', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-08-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't117', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-08-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't118', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-08-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't119', type: 'expense', amount: 820.00, description: 'Supermercado', category: 'Alimentação', date: '2025-08-20', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // JULHO 2025
    { id: 't120', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-07-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't121', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-07-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't122', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-07-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't123', type: 'expense', amount: 780.00, description: 'Supermercado', category: 'Alimentação', date: '2025-07-22', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // JUNHO 2025
    { id: 't124', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-06-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't125', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-06-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't126', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-06-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't127', type: 'expense', amount: 850.00, description: 'Supermercado', category: 'Alimentação', date: '2025-06-25', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // MAIO 2025
    { id: 't128', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-05-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't129', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-05-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't130', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-05-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't131', type: 'expense', amount: 920.00, description: 'Supermercado', category: 'Alimentação', date: '2025-05-28', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // ABRIL 2025
    { id: 't132', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-04-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't133', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-04-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't134', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-04-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't135', type: 'expense', amount: 870.00, description: 'Supermercado', category: 'Alimentação', date: '2025-04-18', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // MARÇO 2025
    { id: 't136', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-03-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't137', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-03-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't138', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-03-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't139', type: 'expense', amount: 810.00, description: 'Supermercado', category: 'Alimentação', date: '2025-03-20', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // FEVEREIRO 2025
    { id: 't140', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: '2025-02-05', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't141', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: '2025-02-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't142', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: '2025-02-10', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't143', type: 'expense', amount: 890.00, description: 'Supermercado', category: 'Alimentação', date: '2025-02-22', accountId: 'a1', memberId: 'm1', status: 'completed' },

    // Additional varied transactions
    { id: 't11', type: 'expense', amount: 67.80, description: 'Farmácia', category: 'Saúde', date: '2026-01-16', accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't12', type: 'expense', amount: 3200.00, description: 'Seguro Carro', category: 'Transporte', date: '2025-12-05', accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't14', type: 'expense', amount: 89.90, description: 'Spotify', category: 'Lazer', date: '2026-01-08', accountId: 'cd1', memberId: 'm3', status: 'completed' },
    { id: 't15', type: 'expense', amount: 450.00, description: 'Feira Mensal', category: 'Alimentação', date: '2025-12-28', accountId: 'a4', memberId: 'm1', status: 'completed' }
];

