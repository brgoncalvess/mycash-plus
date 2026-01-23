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
        logoUrl: 'https://logo.clearbit.com/nubank.com.br'
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
        logoUrl: 'https://logo.clearbit.com/xpi.com.br'
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
        logoUrl: 'https://logo.clearbit.com/bancointer.com.br'
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

// Helper to create dates relative to today
const today = new Date();
const getDate = (dayOffset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString();
};

export const MOCK_TRANSACTIONS: Transaction[] = [
    // This Month
    { id: 't1', type: 'expense', amount: 850.00, description: 'Supermercado Semanal', category: 'Alimentação', date: getDate(-2), accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't2', type: 'expense', amount: 120.50, description: 'Uber Trabalho', category: 'Transporte', date: getDate(-1), accountId: 'a1', memberId: 'm2', status: 'completed' },
    { id: 't3', type: 'income', amount: 8500.00, description: 'Salário Mensal', category: 'Salário', date: getDate(-5), accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't4', type: 'expense', amount: 350.00, description: 'Jantar Fora', category: 'Lazer', date: getDate(-3), accountId: 'cd1', memberId: 'm1', status: 'completed' },
    { id: 't5', type: 'expense', amount: 1500.00, description: 'Aluguel', category: 'Moradia', date: getDate(-10), accountId: 'a3', memberId: 'm2', status: 'completed' },

    // Last Month
    { id: 't6', type: 'expense', amount: 450.00, description: 'Combustível', category: 'Transporte', date: getDate(-35), accountId: 'cd2', memberId: 'm2', status: 'completed' },
    { id: 't7', type: 'expense', amount: 2500.00, description: 'Escola Lucas', category: 'Educação', date: getDate(-32), accountId: 'a3', memberId: 'm1', status: 'completed' },
    { id: 't8', type: 'income', amount: 1200.00, description: 'Freelance Design', category: 'Freelance', date: getDate(-38), accountId: 'a2', memberId: 'm1', status: 'completed' },

    // Future / Pending
    { id: 't9', type: 'expense', amount: 129.90, description: 'Netflix', category: 'Lazer', date: getDate(5), accountId: 'cd1', memberId: 'm3', status: 'pending' },
    { id: 't10', type: 'expense', amount: 250.00, description: 'Academia', category: 'Saúde', date: getDate(2), accountId: 'cd1', memberId: 'm2', status: 'pending' },

    // More varied data
    { id: 't11', type: 'expense', amount: 67.80, description: 'Farmácia', category: 'Saúde', date: getDate(-4), accountId: 'a1', memberId: 'm1', status: 'completed' },
    { id: 't12', type: 'expense', amount: 3200.00, description: 'Seguro Carro', category: 'Transporte', date: getDate(-50), accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't13', type: 'income', amount: 9200.00, description: 'Salário Mensal', category: 'Salário', date: getDate(-35), accountId: 'a3', memberId: 'm2', status: 'completed' },
    { id: 't14', type: 'expense', amount: 89.90, description: 'Spotify', category: 'Lazer', date: getDate(-15), accountId: 'cd1', memberId: 'm3', status: 'completed' },
    { id: 't15', type: 'expense', amount: 450.00, description: 'Feira Mensal', category: 'Alimentação', date: getDate(-22), accountId: 'a4', memberId: 'm1', status: 'completed' }
];
