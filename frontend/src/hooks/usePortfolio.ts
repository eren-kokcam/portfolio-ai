import { useState } from 'react';
import type { PortfolioRequest } from '../types/portfolio';
import { portfolioService } from '../services/portfolioService';

export const usePortfolio = () => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submitPortfolio = async (request: PortfolioRequest) => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const response = await portfolioService.submitPortfolio(request);
            setAnalysis(response.analysis);
        } catch (err) {
            setError('Failed to submit portfolio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, analysis, error, submitPortfolio };
};