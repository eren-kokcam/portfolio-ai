import Spline from '@splinetool/react-spline';
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
    const { loading, error, stockData, messages, submitPortfolio, resetConversation } = usePortfolio();
    const [currentItems, setCurrentItems] = useState<PortfolioItem[]>([]);
    const [portfolioName, setPortfolioName] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadedItems, setLoadedItems] = useState<PortfolioItem[]>([]);
    const [userName, setUserName] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const handleSignOut = async () => await supabase.auth.signOut();

    const handleLoad = (items: PortfolioItem[]) => {
        setLoadedItems(items);
        setSidebarOpen(false);
    };

    const handleSubmit = (request: PortfolioRequest) => {
        setCurrentItems(request.items);
        resetConversation();
        submitPortfolio(request);
    };

    const handleFollowUp = (question: string) => {
        submitPortfolio({ items: currentItems, user_question: question });
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

    const SidebarContent = () => (
        <div className="flex flex-col h-full px-6 py-8">
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
        </div>
    );

    return (
        <div className="flex min-h-screen bg-black text-white">

            {/* Desktop sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 w-60 h-screen border-r border-white/[0.06] flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside className={`
                fixed left-0 top-0 w-72 h-screen border-r border-white/[0.06] bg-black z-50 flex flex-col
                transition-transform duration-300 md:hidden
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white/30 hover:text-white text-lg transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Ana içerik */}
            <main className="md:ml-60 flex-1 min-h-screen relative overflow-hidden">

                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Portfolio AI</span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex flex-col gap-1.5 p-1"
                    >
                        <span className="w-5 h-px bg-white/40" />
                        <span className="w-5 h-px bg-white/40" />
                        <span className="w-5 h-px bg-white/40" />
                    </button>
                </div>

                {/* Spline — sadece desktop */}
                <div className="hidden md:block fixed bottom-0 right-0 w-[600px] h-[700px]" style={{ bottom: '-100px' }}>
                    <Spline scene="https://prod.spline.design/4daccO-MAH36LS4n/scene.splinecode" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-2xl px-6 md:px-12 py-8 md:py-14">

                    {/* Hero başlık */}
                    <div className="mb-10 md:mb-14">
                        <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6">
                            Portföy Analizi
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-3 md:mb-4">
                            Varlıklarını<br />analiz et
                        </h1>
                        <p className="text-white/30 text-sm">
                            Yapay zeka destekli portföy değerlendirmesi
                        </p>
                    </div>

                    <PortfolioForm
                        onSubmit={handleSubmit}
                        loading={loading}
                        initialItems={loadedItems}
                    />

                    {/* İlk analiz loading — sadece henüz mesaj yokken */}
                    {loading && messages.length === 0 && (
                        <div className="mt-10 flex items-center gap-3 text-white/30 text-sm">
                            <div className="w-3.5 h-3.5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
                            Analiz yapılıyor...
                        </div>
                    )}

                    {error && (
                        <p className="mt-8 text-red-400/70 text-sm">{error}</p>
                    )}

                    {/* Sohbet alanı */}
                    {messages.length > 0 && (
                        <div className="mt-12 md:mt-16 space-y-10 md:space-y-12">

                            {/* Grafik */}
                            {stockData.length > 0 && (
                                <div>
                                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5 md:mb-6">
                                        Portföy Dağılımı
                                    </p>
                                    <PortfolioChart items={currentItems} stockData={stockData} />
                                </div>
                            )}

                            {/* Mesajlar */}
                            <div className="space-y-8">
                                {messages.map((msg, index) => (
                                    msg.role === 'assistant' && (
                                        <div key={index}>
                                            {index > 1 && (
                                                <>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-px flex-1 bg-white/[0.06]" />
                                                        <span className="text-[10px] tracking-widest uppercase text-white/20">
                                                            Yanıt {Math.floor(index / 2) + 1}
                                                        </span>
                                                        <div className="h-px flex-1 bg-white/[0.06]" />
                                                    </div>
                                                    <p className="text-xs text-white/30 mb-3 italic">
                                                        "{messages[index - 1]?.content}"
                                                    </p>
                                                </>
                                            )}
                                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed
                                                            prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
                                                            prose-h2:text-base prose-h2:mt-8 prose-h2:mb-3
                                                            prose-p:text-white/60 prose-p:leading-relaxed
                                                            prose-li:text-white/60 prose-li:leading-relaxed
                                                            prose-strong:text-white prose-strong:font-semibold
                                                            prose-ul:my-2 prose-ol:my-2">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Devam et */}
                            <div className="border-t border-white/[0.06] pt-6">
                                <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">
                                    Devam Et
                                </p>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Sorunuzu yazın..."
                                        disabled={loading}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                handleFollowUp(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="flex-1 bg-transparent border-b border-white/10 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/35 transition-colors disabled:opacity-40"
                                    />
                                </div>
                                {loading && (
                                    <div className="mt-4 flex items-center gap-3 text-white/30 text-sm">
                                        <div className="w-3.5 h-3.5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
                                        Analiz yapılıyor...
                                    </div>
                                )}
                            </div>

                            {/* Kaydet */}
                            <div className="pt-6 md:pt-8 border-t border-white/[0.06]">
                                <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4 md:mb-5">
                                    Portföyü Kaydet
                                </p>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Portföy adı"
                                        value={portfolioName}
                                        onChange={(e) => setPortfolioName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        className="flex-1 bg-transparent border-b border-white/10 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/35 transition-colors"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !portfolioName.trim()}
                                        className="text-[10px] tracking-widest uppercase text-white/35 hover:text-white transition-colors disabled:opacity-20 shrink-0"
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