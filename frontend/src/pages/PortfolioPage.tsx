import PortfolioForm from "../components/PortfolioForm";
import { usePortfolio } from "../hooks/usePortfolio";
import ReactMarkdown from 'react-markdown';

const PortfolioPage = () => {
    const { loading, analysis, error, submitPortfolio } = usePortfolio();
    return (
        <div>
            <h1>Portfolio AI</h1>
            <PortfolioForm onSubmit={submitPortfolio} loading={loading} />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {analysis && (
                <div>
                    <h2>Analysis Result</h2>
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default PortfolioPage;