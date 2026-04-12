import { useState, useEffect } from 'react';
import type { PortfolioItem, PortfolioRequest } from '../types/portfolio';

interface PortfolioFormProps {
    onSubmit: (request: PortfolioRequest) => void;
    loading: boolean;
    initialItems?: PortfolioItem[];
}

const PortfolioForm = ({ onSubmit, loading, initialItems }: PortfolioFormProps) => {
    const [items, setItems] = useState<PortfolioItem[]>(
        initialItems ?? [{ symbol: '', quantity: 0, purchase_price: 0, currency: 'TRY' }]
    );
    const [userQuestion, setUserQuestion] = useState('');

    useEffect(() => {
        if (initialItems && initialItems.length > 0) {
            setItems(initialItems);
        }
    }, [initialItems]);

    const inputClass = "w-full bg-transparent border-b border-white/15 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors";
    const selectClass = "w-full bg-black border-b border-white/15 py-2 text-white text-sm focus:outline-none focus:border-white/50 transition-colors";

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="grid grid-cols-5 gap-4 text-xs tracking-widest uppercase text-white/30 pb-1">
                    <span>Sembol</span>
                    <span>Miktar</span>
                    <span>Alış Fiyatı</span>
                    <span>Birim</span>
                    <span></span>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-end">
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
                            className={selectClass}
                        >
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                        </select>
                        <button
                            onClick={() => setItems(items.filter((_, i) => i !== index))}
                            className="text-white/20 hover:text-red-400 text-xs transition-colors pb-2"
                        >
                            Sil
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setItems([...items, { symbol: '', quantity: 0, purchase_price: 0, currency: 'TRY' }])}
                className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors"
            >
                + Varlık Ekle
            </button>

            <input
                type="text"
                placeholder="Sorunuz nedir? (ör: Portföyümün riski nedir?)"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className={inputClass}
            />

            <button
                onClick={() => onSubmit({ items, user_question: userQuestion })}
                disabled={loading}
                className="w-full bg-white text-black text-sm font-semibold py-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
                {loading ? '...' : 'Analiz Et →'}
            </button>
        </div>
    );
};

export default PortfolioForm;