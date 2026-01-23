import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function FinancialFlowChart() {
    const { transactions } = useFinance();

    // Generate last 12 months data
    const chartData = useMemo(() => {
        try {
            const today = new Date();
            const start = startOfMonth(subMonths(today, 11));
            const end = endOfMonth(today);

            const monthsInterval = eachMonthOfInterval({ start, end });

            if (!Array.isArray(transactions) || transactions.length === 0) {
                return monthsInterval.map(monthDate => ({
                    month: format(monthDate, 'MMM', { locale: ptBR }).toUpperCase(),
                    income: 0,
                    expense: 0,
                }));
            }

            const data = monthsInterval.map(monthDate => {
                const monthTransactions = transactions.filter(t => {
                    try {
                        const tDate = parseISO(t.date);
                        return isSameMonth(tDate, monthDate);
                    } catch {
                        return false;
                    }
                });

                const income = monthTransactions
                    .filter(t => t.type === 'income')
                    .reduce((acc, t) => acc + t.amount, 0);

                const expense = monthTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => acc + t.amount, 0);

                return {
                    month: format(monthDate, 'MMM', { locale: ptBR }).toUpperCase(),
                    income,
                    expense,
                };
            });

            return data;
        } catch (error) {
            console.error('Error generating chart data:', error);
            return [];
        }
    }, [transactions]);

    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `R$ ${value / 1000}k`;
        }
        return `R$ ${value}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-float border border-secondary-50">
                    <p className="text-sm font-bold text-secondary mb-2">{label}</p>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand" />
                            <span className="text-xs text-gray-500">Receitas:</span>
                            <span className="text-xs font-bold text-secondary">
                                {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs text-gray-500">Despesas:</span>
                            <span className="text-xs font-bold text-secondary">
                                {payload[1].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="bg-white rounded-[32px] p-8 flex flex-col h-full min-h-[500px] shadow-sm border border-secondary-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <BarChart3 size={24} className="text-secondary" />
                    <h2 className="text-xl font-bold text-secondary">Fluxo financeiro</h2>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand" />
                        <span className="text-xs font-bold text-secondary">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs font-bold text-secondary">Despesas</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full h-full min-h-[350px]">
                {Array.isArray(chartData) && chartData.length > 0 ? (
                    <ResponsiveContainer width={500} height={500}>
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D7FF00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D7FF00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={formatCurrency}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#D7FF00"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444" // red-500
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">Carregando dados do gráfico...</p>
                    </div>
                )}
            </div>
        </section>
    );
}
