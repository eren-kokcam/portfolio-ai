import { useState, useEffect } from "react";
import { portfolioDbService } from "../services/portfolioDbService";
import type { PortfolioItem } from "../types/portfolio";

interface SavedPortfoliosProps {
    onLoad: (items: PortfolioItem[]) => void;
}

const SavedPortfolios = ({ onLoad }: SavedPortfoliosProps) => {
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        portfolioDbService.getPortfolios()
            .then(data => setPortfolios(data ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (e: React.MouseEvent, portfolioId: string) => {
        e.stopPropagation();
        try {
            await portfolioDbService.deletePortfolio(portfolioId);
            setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div>
            <p className="text-[10px] tracking-widest uppercase text-white/25 mb-4">
                Kaydedilmiş ({portfolios.length})
            </p>

            {loading && <p className="text-[10px] text-white/20">Yükleniyor...</p>}

            {!loading && portfolios.length === 0 && (
                <p className="text-[10px] text-white/20">Henüz portföy yok</p>
            )}

            <div className="space-y-0.5">
                {portfolios.map((portfolio) => (
                    <div key={portfolio.id}>
                        <div
                            className="group flex items-center justify-between py-2 cursor-pointer"
                            onClick={() => setExpanded(expanded === portfolio.id ? null : portfolio.id)}
                        >
                            <span className="text-xs text-white/40 group-hover:text-white/80 transition-colors truncate flex-1">
                                {portfolio.name}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onLoad(portfolio.portfolio_items); }}
                                    className="text-[10px] text-white/40 hover:text-white transition-colors"
                                >
                                    Yükle
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, portfolio.id)}
                                    className="text-[10px] text-white/20 hover:text-red-400 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>

                        {expanded === portfolio.id && (
                            <div className="mb-2 pl-2 space-y-1">
                                {portfolio.portfolio_items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-[10px] text-white/20">
                                        <span>{item.symbol.toUpperCase()}</span>
                                        <span>{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedPortfolios;