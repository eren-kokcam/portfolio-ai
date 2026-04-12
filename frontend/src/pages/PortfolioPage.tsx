import ReactMarkdown from 'react-markdown';
import PortfolioForm from '../components/PortfolioForm';
import SavedPortfolios from '../components/SavedPortfolios';
import PortfolioChart from '../components/PortfolioChart';
import { usePortfolio } from '../hooks/usePortfolio';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { portfolioDbService } from '../services/portfolioDbService';
import type { PortfolioRequest } from '../types/portfolio';

const PortfolioPage = () => {
    const { loading, analysis, error, stockData, submitPortfolio } = usePortfolio();
    const [darkMode, setDarkMode] = useState(true);
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
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
                <div>
                    <span className="text-white/40 text-xs tracking-widest uppercase">Portfolio AI</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors"
                    >
                        Çıkış
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-12">

                {/* Saved Portfolios */}
                <div className="mb-10">
                    <SavedPortfolios onLoad={handleLoad} />
                </div>

                {/* Form başlığı */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Portföy Analizi</h1>
                    <p className="text-white/30 text-sm">Varlıklarınızı girin, AI analiz etsin</p>
                </div>

                {/* Form */}
                <PortfolioForm onSubmit={handleSubmit} loading={loading} initialItems={loadedItems} />

                {/* Loading */}
                {loading && (
                    <div className="mt-8 flex items-center gap-3 text-white/40 text-sm">
                        <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                        Analiz yapılıyor...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="mt-6 text-red-400 text-sm">{error}</p>
                )}

                {/* Analiz Sonucu */}
                {analysis && (
                    <div className="mt-12">
                        <div className="border-t border-white/10 pt-8 mb-6">
                            <h2 className="text-xs tracking-widest uppercase text-white/40 mb-6">Analiz Sonucu</h2>
                            <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed">
                                <ReactMarkdown>{analysis}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Grafik */}
                        {stockData.length > 0 && (
                            <div className="border-t border-white/10 pt-8 mb-6">
                                <h2 className="text-xs tracking-widest uppercase text-white/40 mb-6">Portföy Dağılımı</h2>
                                <PortfolioChart items={currentItems} stockData={stockData} />
                            </div>
                        )}

                        {/* Kaydet */}
                        <div className="border-t border-white/10 pt-8">
                            <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Portföyü Kaydet</h2>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Portföy adı"
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                    className="flex-1 bg-transparent border-b border-white/15 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors"
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors disabled:opacity-30"
                                >
                                    {saving ? '...' : 'Kaydet →'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PortfolioPage;