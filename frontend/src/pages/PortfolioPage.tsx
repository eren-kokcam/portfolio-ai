import ReactMarkdown from 'react-markdown';
import PortfolioForm from '../components/PortfolioForm';
import { usePortfolio } from '../hooks/usePortfolio';
import { useState, useEffect } from 'react';

const PortfolioPage = () => {
    const { loading, analysis, error, submitPortfolio } = usePortfolio();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio AI</h1>
                <button onClick={() => setDarkMode(!darkMode)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </header>
            <main className="max-w-3xl mx-auto px-6 py-8">
                <PortfolioForm onSubmit={submitPortfolio} loading={loading} />
                {loading && <p className="mt-4 text-gray-500 dark:text-gray-400">Analiz yapılıyor...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {analysis && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Analiz Sonucu</h2>
                        <div className="text-gray-800 dark:text-gray-200">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PortfolioPage;