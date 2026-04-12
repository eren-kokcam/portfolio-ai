import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PortfolioChartProps {
    items: any[];
    stockData: any[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PortfolioChart = ({ items, stockData }: PortfolioChartProps) => {
    const normalizeSymbol = (s: string) =>
        s.replace(/İ/g, 'I').replace(/ı/g, 'i').replace(/Ş/g, 'S').replace(/ş/g, 's')
         .replace(/Ğ/g, 'G').replace(/ğ/g, 'g').replace(/Ü/g, 'U').replace(/ü/g, 'u')
         .replace(/Ö/g, 'O').replace(/ö/g, 'o').replace(/Ç/g, 'C').replace(/ç/g, 'c')
         .toUpperCase();

    const stockMap = Object.fromEntries(stockData.map(s => [s.symbol, s]));

    const chartData = items
        .map(item => {
            const stock = stockMap[normalizeSymbol(item.symbol)];
            if (!stock) return null;
            const value = stock.price * item.quantity;
            return { name: item.symbol.toUpperCase(), value: Math.round(value) };
        })
        .filter(Boolean);

    if (chartData.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} %${((percent ?? 0) * 100).toFixed(1)}`}
                    labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                >
                    {chartData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                    formatter={(value: any) => [value.toLocaleString('tr-TR'), 'Değer']}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PortfolioChart;