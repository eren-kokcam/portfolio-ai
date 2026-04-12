import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { portfolioDbService } from '../services/portfolioDbService';

const PortfolioLineChart = () => {
    const [snapshots, setSnapshots] = useState<any[]>([]);

    useEffect(() => {
        portfolioDbService.getSnapshots().then(data => {
            if (data) {
                const chartData = data.map(s => ({
                    date: new Date(s.created_at).toLocaleDateString('tr-TR'),
                    value: Math.round(s.total_value)
                }));
                setSnapshots(chartData);
            }
        }).catch(console.error);
    }, []);

    if (snapshots.length < 2) return null;

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Portföy Değeri Geçmişi</h2>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={snapshots}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString('tr-TR')} />
                    <Tooltip formatter={(value: any) => [value.toLocaleString('tr-TR') + ' TL', 'Değer']} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PortfolioLineChart;