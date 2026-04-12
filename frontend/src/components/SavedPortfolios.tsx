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
        <div className="mb-8">
            <button
                onClick={() => setOpen(!open)}
                className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
            >
                {open ? '▾' : '▸'} Kaydedilmiş Portföyler ({portfolios.length})
            </button>
            {open && (
                <div className="mt-3 space-y-3">
                    {loading && <p className="text-sm text-gray-400">Yükleniyor...</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {!loading && portfolios.length === 0 && (
                        <p className="text-sm text-gray-400">Henüz kaydedilmiş portföy yok.</p>
                    )}
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800 dark:text-white">{portfolio.name}</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onLoad(portfolio.portfolio_items)}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        Analiz Et
                                    </button>
                                    <button
                                        onClick={() => handleDelete(portfolio.id)}
                                        className="text-red-400 hover:text-red-600 text-sm"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                                <span>Sembol</span>
                                <span>Miktar</span>
                                <span>Alış Fiyatı</span>
                            </div>
                            {portfolio.portfolio_items?.map((item: any) => (
                                <div key={item.id} className="grid grid-cols-3 gap-1 text-sm text-gray-700 dark:text-gray-300 px-1 py-1 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-medium">{item.symbol.toUpperCase()}</span>
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