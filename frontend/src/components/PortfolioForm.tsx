import { useState } from 'react';
import type { PortfolioItem, PortfolioRequest } from '../types/portfolio';

interface PortfolioFormProps {
    onSubmit: (request: PortfolioRequest) => void;
    loading: boolean;
}

const PortfolioForm = ({ onSubmit, loading }: PortfolioFormProps) => {
    const [items, setItems] = useState<PortfolioItem[]>([
        { symbol: '', quantity: 0, purchase_price: 0, currency: 'TRY' }
    ]);
    const [userQuestion, setUserQuestion] = useState('');

    const inputClass = "border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500";

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Portföyünü Gir</h2>
            
            <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 px-1">
                    <span>Sembol</span>
                    <span>Miktar</span>
                    <span>Alış Fiyatı</span>
                    <span>Para Birimi</span>
                    <span></span>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2">
                        <input
                            type="text"
                            placeholder="THYAO"
                            value={item.symbol}
                            onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].symbol = e.target.value;
                                setItems(newItems);
                            }}
                            className={inputClass}
                        />
                        <input
                            type="number"
                            placeholder="0"
                            value={item.quantity || ''}
                            onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].quantity = parseFloat(e.target.value);
                                setItems(newItems);
                            }}
                            className={inputClass}
                        />
                        <input
                            type="number"
                            placeholder="0.00"
                            value={item.purchase_price || ''}
                            onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].purchase_price = parseFloat(e.target.value);
                                setItems(newItems);
                            }}
                            className={inputClass}
                        />
                        <select
                            value={item.currency}
                            onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].currency = e.target.value as 'TRY' | 'USD';
                                setItems(newItems);
                            }}
                            className={inputClass}
                        >
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                        </select>
                        <button
                            onClick={() => setItems(items.filter((_, i) => i !== index))}
                            className="text-red-400 hover:text-red-600 text-sm"
                        >
                            Sil
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setItems([...items, { symbol: '', quantity: 0, purchase_price: 0, currency: 'TRY' }])}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
                + Varlık Ekle
            </button>

            <input
                type="text"
                placeholder="Sorunuz nedir? (ör: Portföyümün riski nedir?)"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className={`w-full ${inputClass}`}
            />

            <button
                onClick={() => onSubmit({ items, user_question: userQuestion })}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded transition-colors"
            >
                {loading ? 'Analiz yapılıyor...' : 'Analiz Et'}
            </button>
        </div>
    );
};

export default PortfolioForm;