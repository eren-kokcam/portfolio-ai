import ReactMarkdown from 'react-markdown';
import PortfolioForm from '../components/PortfolioForm';
import SavedPortfolios from '../components/SavedPortfolios';
import { usePortfolio } from '../hooks/usePortfolio';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { portfolioDbService } from '../services/portfolioDbService';
import type { PortfolioRequest } from '../types/portfolio';
import PortfolioChart from '../components/PortfolioChart';
/* import PortfolioLineChart from '../components/PortfolioLineChart'; */

const PortfolioPage = () => {
    const { loading, analysis, error, stockData, submitPortfolio } = usePortfolio();
    const [darkMode, setDarkMode] = useState(false);
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    const [portfolioName, setPortfolioName] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadedItems, setLoadedItems] = useState<any[]>([]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        if (stockData.length > 0 && currentItems.length > 0) {
            const totalValue = stockData.reduce((sum, stock) => {
                const item = currentItems.find(i => 
                    i.symbol
                        .replace(/İ/g, 'I').replace(/ı/g, 'i')
                        .replace(/Ş/g, 'S').replace(/ş/g, 's')
                        .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
                        .replace(/Ü/g, 'U').replace(/ü/g, 'u')
                        .replace(/Ö/g, 'O').replace(/ö/g, 'o')
                        .replace(/Ç/g, 'C').replace(/ç/g, 'c')
                        .toUpperCase() === stock.symbol
                );
                if (!item) return sum;
                return sum + stock.price * item.quantity;
            }, 0);
    
            if (totalValue > 0) {
                portfolioDbService.saveSnapshot(totalValue).catch(console.error);
            }
        }
    }, [stockData]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const handleLoad = (items: any[]) => {
        setLoadedItems(items);
    };

    const handleSubmit = (request: PortfolioRequest) => {
        setCurrentItems(request.items);
        submitPortfolio(request);
    };

    const handleSave = async () => {
        if (!portfolioName) return;
        setSaving(true);
        try {
            await portfolioDbService.saveFullPortfolio(portfolioName, currentItems);
            alert('Portföy kaydedildi!');
        } catch (err) {
            alert('Kayıt hatası!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio AI</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => setDarkMode(!darkMode)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">
                        Çıkış
                    </button>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-6 py-8">
                <SavedPortfolios onLoad={handleLoad} />
                <PortfolioForm onSubmit={handleSubmit} loading={loading} initialItems={loadedItems} />
                {loading && <p className="mt-4 text-gray-500 dark:text-gray-400">Analiz yapılıyor...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {analysis && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Analiz Sonucu</h2>
                        <div className="text-gray-800 dark:text-gray-200">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                        {analysis && stockData.length > 0 && (
                            <PortfolioChart items={currentItems} stockData={stockData} />
                        )}
                        {/* <PortfolioLineChart /> */}
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Portföy adı"
                                value={portfolioName}
                                onChange={(e) => setPortfolioName(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                            >
                                {saving ? 'Kaydediliyor...' : 'Portföyü Kaydet'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PortfolioPage;