import { useState, useEffect } from 'react';
import type { PortfolioRequest } from '../types/portfolio';

interface FormItem {
    symbol: string;
    quantity: string;
    purchase_price: string;
    currency: 'TRY' | 'USD';
}

interface PortfolioFormProps {
    onSubmit: (request: PortfolioRequest) => void;
    loading: boolean;
    initialItems?: any[];
}

const emptyItem = (): FormItem => ({
    symbol: '',
    quantity: '',
    purchase_price: '',
    currency: 'TRY',
});

const toFormItem = (item: any): FormItem => ({
    symbol: item.symbol ?? '',
    quantity: item.quantity?.toString() ?? '',
    purchase_price: item.purchase_price?.toString() ?? '',
    currency: item.currency ?? 'TRY',
});

const PortfolioForm = ({ onSubmit, loading, initialItems }: PortfolioFormProps) => {
    const [items, setItems] = useState<FormItem[]>(
        initialItems && initialItems.length > 0
            ? initialItems.map(toFormItem)
            : [emptyItem()]
    );
    const [userQuestion, setUserQuestion] = useState('');

    useEffect(() => {
        if (initialItems && initialItems.length > 0) {
            setItems(initialItems.map(toFormItem));
        }
    }, [initialItems]);

    const updateItem = (index: number, field: keyof FormItem, value: string) => {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const addItem = () => setItems(prev => [...prev, emptyItem()]);

    const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = () => {
        onSubmit({
            items: items.map(item => ({
                symbol: item.symbol,
                quantity: parseFloat(item.quantity) || 0,
                purchase_price: parseFloat(item.purchase_price) || 0,
                currency: item.currency,
            })),
            user_question: userQuestion,
        });
    };

    const inputClass = "w-full bg-transparent border-b border-white/15 py-2 text-white text-sm placeholder-white/35 focus:outline-none focus:border-white/40 transition-colors";
    const selectClass = "w-full bg-black border-b border-white/10 py-2 text-white/60 text-sm focus:outline-none focus:border-white/40 transition-colors";

    return (
        <div className="space-y-8">
            <div>
                <div className="grid grid-cols-5 gap-4 mb-3">
                    {['Sembol', 'Miktar', 'Alış Fiyatı', 'Birim', ''].map((label, i) => (
                        <span key={i} className="text-[10px] tracking-widest uppercase text-white/25">{label}</span>
                    ))}
                </div>

                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 items-end group">
                            <input
                                type="text"
                                placeholder="THYAO"
                                value={item.symbol}
                                onChange={(e) => updateItem(index, 'symbol', e.target.value)}
                                className={inputClass}
                            />
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                className={inputClass}
                            />
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={item.purchase_price}
                                onChange={(e) => updateItem(index, 'purchase_price', e.target.value)}
                                className={inputClass}
                            />
                            <select
                                value={item.currency}
                                onChange={(e) => updateItem(index, 'currency', e.target.value as 'TRY' | 'USD')}
                                className={selectClass}
                            >
                                <option value="TRY">TRY</option>
                                <option value="USD">USD</option>
                            </select>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-white/15 hover:text-red-400/70 text-xs transition-colors pb-2 opacity-0 group-hover:opacity-100"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={addItem}
                className="text-[10px] tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors"
            >
                + Varlık Ekle
            </button>

            <input
                type="text"
                placeholder="Sorunuz nedir? (ör: Portföyümün riski nedir?)"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={inputClass}
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-white text-black text-sm font-semibold py-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-30"
            >
                {loading ? 'Analiz ediliyor...' : 'Analiz Et →'}
            </button>
        </div>
    );
};

export default PortfolioForm;