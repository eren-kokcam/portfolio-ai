import ReactMarkdown from 'react-markdown';
import PortfolioForm from '../components/PortfolioForm';
import SavedPortfolios from '../components/SavedPortfolios';
import PortfolioChart from '../components/PortfolioChart';
import { usePortfolio } from '../hooks/usePortfolio';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { portfolioDbService } from '../services/portfolioDbService';
import type { PortfolioItem, PortfolioRequest } from '../types/portfolio';
import { normalizeSymbol } from '../utils/symbolUtils';
import { toast } from 'sonner';

const PortfolioPage = () => {
    const { loading, analysis, error, stockData, submitPortfolio } = usePortfolio();
    const [currentItems, setCurrentItems] = useState<PortfolioItem[]>([]);
    const [portfolioName, setPortfolioName] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadedItems, setLoadedItems] = useState<PortfolioItem[]>([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                setUserName(name);
            }
        });
    }, []);

    useEffect(() => {
        if (stockData.length > 0 && currentItems.length > 0) {
            const totalValue = stockData.reduce((sum, stock) => {
                const item = currentItems.find(i => normalizeSymbol(i.symbol) === stock.symbol);
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

    const handleLoad = (items: PortfolioItem[]) => {
        setLoadedItems(items);
    };

    const handleSubmit = (request: PortfolioRequest) => {
        setCurrentItems(request.items);
        submitPortfolio(request);
    };

    const handleSave = async () => {
        if (!portfolioName.trim()) return;
        setSaving(true);
        try {
            await portfolioDbService.saveFullPortfolio(portfolioName, currentItems);
            toast.success('Portföy kaydedildi!');
            setPortfolioName('');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-60 h-screen border-r border-white/[0.06] flex flex-col px-6 py-8">
                <div className="mb-10">
                    <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Portfolio AI</span>
                </div>

                {userName && (
                    <div className="mb-8 pb-8 border-b border-white/[0.06]">
                        <p className="text-white/25 text-[10px] tracking-widest uppercase mb-1.5">Hoş geldin</p>
                        <p className="text-white text-sm font-semibold tracking-tight">{userName}</p>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto min-h-0">
                    <SavedPortfolios onLoad={handleLoad} />
                </div>

                <div className="pt-6 border-t border-white/[0.06]">
                    <button
                        onClick={handleSignOut}
                        className="text-white/25 hover:text-white text-[10px] tracking-widest uppercase transition-colors"
                    >
                        Çıkış →
                    </button>
                </div>
            </aside>

            {/* Ana içerik */}
            <main className="ml-60 flex-1 min-h-screen">
                <div className="max-w-2xl px-12 py-12">

                    <div className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Portföy Analizi</h1>
                        <p className="text-white/30 text-sm">Varlıklarınızı girin, AI analiz etsin</p>
                    </div>

                    <PortfolioForm onSubmit={handleSubmit} loading={loading} initialItems={loadedItems} />

                    {loading && (
                        <div className="mt-8 flex items-center gap-3 text-white/30 text-sm">
                            <div className="w-3.5 h-3.5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
                            Analiz yapılıyor...
                        </div>
                    )}

                    {error && <p className="mt-6 text-red-400/80 text-sm">{error}</p>}

                    {analysis && (
                        <div className="mt-14 space-y-10">

                            {stockData.length > 0 && (
                                <div>
                                    <p className="text-[10px] tracking-widest uppercase text-white/25 mb-5">Portföy Dağılımı</p>
                                    <PortfolioChart items={currentItems} stockData={stockData} />
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] tracking-widest uppercase text-white/25 mb-5">Analiz Sonucu</p>
                                <div className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed">
                                    <ReactMarkdown>{analysis}</ReactMarkdown>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/[0.06]">
                                <p className="text-[10px] tracking-widest uppercase text-white/25 mb-4">Portföyü Kaydet</p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Portföy adı"
                                        value={portfolioName}
                                        onChange={(e) => setPortfolioName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        className="flex-1 bg-transparent border-b border-white/15 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !portfolioName.trim()}
                                        className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-colors disabled:opacity-20"
                                    >
                                        {saving ? '...' : 'Kaydet →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PortfolioPage;