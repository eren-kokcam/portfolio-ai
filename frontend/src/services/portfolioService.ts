import type { PortfolioRequest } from '../types/portfolio';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const portfolioService = {
    async submitPortfolio(portfolioRequest: PortfolioRequest) {
        try {
            const response = await fetch(`${BASE_URL}/portfolio/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(portfolioRequest),
            });
            if (!response.ok) {
                throw new Error('Failed to submit portfolio');
            }
            return await response.json();
        } catch (error) {
            console.error('Error submitting portfolio:', error);
            throw error;
        }
    },
}