import { BarChart3 } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Mock data for 7 months
const mockData = [
    { month: 'Jan', receitas: 12000, despesas: 8000 },
    { month: 'Fev', receitas: 15000, despesas: 10000 },
    { month: 'Mar', receitas: 13000, despesas: 9500 },
    { month: 'Abr', receitas: 16000, despesas: 11000 },
    { month: 'Mai', receitas: 14000, despesas: 9000 },
    { month: 'Jun', receitas: 17500, despesas: 12500 },
    { month: 'Jul', receitas: 15500, despesas: 10000 },
];

// Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface border border-secondary-50 rounded-xl shadow-float p-3">
                <p className="font-bold text-sm text-secondary mb-2">{label}</p>
                <p className="text-xs text-green-700 mb-1">
                    Receitas: {payload[0]?.value?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
                <p className="text-xs text-secondary">
                    Despesas: {payload[1]?.value?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
            </div>
        );
    }
    return null;
}

// Format Y-axis values
const formatYAxis = (value: number) => {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value}`;
};

export function FinancialFlowChart() {
    return (
        <section className="bg-surface border border-secondary-50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                    <BarChart3 size={20} className="text-secondary" />
                    Fluxo financeiro
                </h2>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand"></div>
                        <span className="text-gray-600">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span className="text-gray-600">Despesas</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={mockData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        {/* Gradient for Receitas (Income) */}
                        <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                        </linearGradient>
                        {/* Gradient for Despesas (Expenses) */}
                        <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#080b12" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#080b12" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Grid */}
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E7E8EA"
                        vertical={false}
                    />

                    {/* X Axis */}
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />

                    {/* Y Axis */}
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={formatYAxis}
                        dx={-10}
                    />

                    {/* Tooltip */}
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E7E8EA', strokeWidth: 1 }} />

                    {/* Areas */}
                    <Area
                        type="monotone"
                        dataKey="receitas"
                        stroke="#a3e635"
                        strokeWidth={3}
                        fill="url(#colorReceitas)"
                        name="Receitas"
                    />
                    <Area
                        type="monotone"
                        dataKey="despesas"
                        stroke="#080b12"
                        strokeWidth={3}
                        fill="url(#colorDespesas)"
                        name="Despesas"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </section>
    );
}
