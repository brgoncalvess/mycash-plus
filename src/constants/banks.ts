export interface Bank {
    id: string;
    name: string;
    code: string;
    logoUrl: string;
    color: string;
}

export const BANKS: Bank[] = [
    {
        id: 'nubank',
        name: 'Nubank',
        code: '260',
        logoUrl: 'https://logo.clearbit.com/nubank.com.br',
        color: '#820AD1'
    },
    {
        id: 'inter',
        name: 'Inter',
        code: '077',
        logoUrl: 'https://logo.clearbit.com/inter.co',
        color: '#FF7A00'
    },
    {
        id: 'xp',
        name: 'XP Investimentos',
        code: '341', // XP Code? 102? XP é corretora mas tem banco. 348 é XP.
        logoUrl: 'https://logo.clearbit.com/xpi.com.br',
        color: '#000000'
    },
    {
        id: 'itau',
        name: 'Itaú',
        code: '341',
        logoUrl: 'https://logo.clearbit.com/itau.com.br',
        color: '#EC7000'
    },
    {
        id: 'bradesco',
        name: 'Bradesco',
        code: '237',
        logoUrl: 'https://logo.clearbit.com/bradesco.com.br',
        color: '#CC092F'
    },
    {
        id: 'santander',
        name: 'Santander',
        code: '033',
        logoUrl: 'https://logo.clearbit.com/santander.com.br',
        color: '#EC0000'
    },
    {
        id: 'btg',
        name: 'BTG Pactual',
        code: '208',
        logoUrl: 'https://logo.clearbit.com/btgpactual.com',
        color: '#003664'
    },
    {
        id: 'c6',
        name: 'C6 Bank',
        code: '336',
        logoUrl: 'https://logo.clearbit.com/c6bank.com.br',
        color: '#242424'
    },
    {
        id: 'neon',
        name: 'Neon',
        code: '655',
        logoUrl: 'https://logo.clearbit.com/neon.com.br',
        color: '#00A4D3'
    },
    {
        id: 'original',
        name: 'Banco Original',
        code: '212',
        logoUrl: 'https://logo.clearbit.com/original.com.br',
        color: '#00A45B'
    }
];

export const getBankLogo = (bankName: string): string => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s/g, '');
    const bank = BANKS.find(b => normalize(b.name).includes(normalize(bankName)) || normalize(bankName).includes(normalize(b.id)));
    return bank ? bank.logoUrl : ''; // Return empty or a default generic bank icon
};
