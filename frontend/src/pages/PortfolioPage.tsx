import ReactMarkdown from 'react-markdown';
import PortfolioForm from '../components/PortfolioForm';
import { usePortfolio } from '../hooks/usePortfolio';

const PortfolioPage = () => {
    const { loading, analysis, error, submitPortfolio } = usePortfolio();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Portfolio AI</h1>
                <button className="text-gray-500 hover:text-gray-900">🌙</button>
            </header>
            <main className="max-w-3xl mx-auto px-6 py-8">
                <PortfolioForm onSubmit={submitPortfolio} loading={loading} />
                {loading && <p className="mt-4 text-gray-500">Analiz yapılıyor...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {analysis && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Analiz Sonucu</h2>
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PortfolioPage;