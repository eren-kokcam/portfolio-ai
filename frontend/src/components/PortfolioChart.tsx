import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PortfolioChartProps {
    items: any[];
    stockData: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Portföy Dağılımı</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} %${((percent ?? 0) * 100).toFixed(1)}`}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => (value !== undefined ? value.toLocaleString('tr-TR') : 'N/A')} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PortfolioChart;