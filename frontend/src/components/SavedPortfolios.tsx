import { useState, useEffect } from "react";
import { portfolioDbService } from "../services/portfolioDbService";

interface SavedPortfoliosProps {
    onLoad: (items: any[]) => void;
}

const SavedPortfolios = ({ onLoad }: SavedPortfoliosProps) => {
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const fetchPortfolios = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await portfolioDbService.getPortfolios();
            setPortfolios(data ?? []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (portfolioId: string) => {
        try {
            await portfolioDbService.deletePortfolio(portfolioId);
            setPortfolios(portfolios.filter(p => p.id !== portfolioId));
        } catch (err: any) {
            alert('Silme hatası: ' + err.message);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    return (
        <div className="mb-10">
            <button
                onClick={() => setOpen(!open)}
                className="text-xs tracking-widest uppercase text-white/30 hover:text-white flex items-center gap-2 transition-colors"
            >
                {open ? '▾' : '▸'} Kaydedilmiş Portföyler ({portfolios.length})
            </button>
            {open && (
                <div className="mt-4 space-y-3">
                    {loading && <p className="text-xs text-white/30">Yükleniyor...</p>}
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    {!loading && portfolios.length === 0 && (
                        <p className="text-xs text-white/30">Henüz kaydedilmiş portföy yok.</p>
                    )}
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="border border-white/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white">{portfolio.name}</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => onLoad(portfolio.portfolio_items)}
                                        className="text-xs text-white/40 hover:text-white transition-colors"
                                    >
                                        Yükle →
                                    </button>
                                    <button
                                        onClick={() => handleDelete(portfolio.id)}
                                        className="text-xs text-white/20 hover:text-red-400 transition-colors"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-xs text-white/20 mb-2">
                                <span>Sembol</span>
                                <span>Miktar</span>
                                <span>Alış</span>
                            </div>
                            {portfolio.portfolio_items?.map((item: any) => (
                                <div key={item.id} className="grid grid-cols-3 gap-1 text-xs text-white/50 py-1 border-t border-white/5">
                                    <span className="font-medium text-white/70">{item.symbol.toUpperCase()}</span>
                                    <span>{item.quantity}</span>
                                    <span>{item.purchase_price} {item.currency ?? 'TRY'}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPortfolios;