import { useState } from 'react';
import type { PortfolioItem, PortfolioRequest } from '../types/portfolio';

interface PortfolioFormProps {
    onSubmit: (request: PortfolioRequest) => void;
    loading: boolean;
}

const PortfolioForm = ({ onSubmit, loading }: PortfolioFormProps) => {
    const [items, setItems] = useState<PortfolioItem[]>([
        { symbol: '', quantity: 0, purchase_price: 0 }
    ]);
    const [userQuestion, setUserQuestion] = useState('');

    return (
        <div>
            <h2>Enter Your Portfolio</h2>
            {items.map((item, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Symbol"
                        value={item.symbol}
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].symbol = e.target.value;
                            setItems(newItems);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity = parseFloat(e.target.value);
                            setItems(newItems);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Purchase Price"
                        value={item.purchase_price}
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].purchase_price = parseFloat(e.target.value);
                            setItems(newItems);
                        }}
                    />
                </div>
            ))}
            <button onClick={() => setItems([...items, { symbol: '', quantity: 0, purchase_price: 0 }])}>
                Add Item
            </button>
            <div>
                <input
                    type="text"
                    placeholder="Your Question"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                />
            </div>
            <button
                onClick={() => onSubmit({ items, user_question: userQuestion })}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Portfolio'}
            </button>
            
        </div>
    );
};

export default PortfolioForm;