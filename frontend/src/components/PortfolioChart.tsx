import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { normalizeSymbol } from '../utils/symbolUtils';

interface PortfolioChartProps {
    items: any[];
    stockData: any[];
}

const COLORS = ['#e2e8f0', '#94a3b8', '#475569', '#cbd5e1', '#64748b', '#334155'];

const PortfolioChart = ({ items, stockData }: PortfolioChartProps) => {
    const stockMap = Object.fromEntries(stockData.map(s => [s.symbol, s]));

    const chartData = items
        .map(item => {
            const stock = stockMap[normalizeSymbol(item.symbol)];
            if (!stock) return null;
            const value = stock.price * item.quantity;
            return { name: item.symbol.toUpperCase(), value: Math.round(value) };
        })
        .filter(Boolean) as { name: string; value: number }[];

    if (chartData.length === 0) return null;

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex gap-8 items-center">

            {/* Pie */}
            <div className="shrink-0">
                <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            strokeWidth={0}
                            activeShape={(props: any) => <Sector {...props} outerRadius={props.outerRadius} />}
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0a0a0a',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                            }}
                            formatter={(value: any) => [
                                value.toLocaleString('tr-TR') + ' ₺',
                                'Değer'
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend + metrikler */}
            <div className="flex-1 space-y-3">
                {chartData.map((d, index) => {
                    const percent = ((d.value / total) * 100).toFixed(1);
                    return (
                        <div key={d.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-xs text-white/50">{d.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-white/25">%{percent}</span>
                                <span className="text-xs text-white/60 tabular-nums">
                                    {d.value.toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-3 border-t border-white/[0.06] flex justify-between">
                    <span className="text-[10px] tracking-widest uppercase text-white/25">Toplam</span>
                    <span className="text-sm font-semibold text-white">
                        {total.toLocaleString('tr-TR')} ₺
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PortfolioChart;