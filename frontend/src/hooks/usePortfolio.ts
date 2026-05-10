import { useState } from 'react';
import type { PortfolioRequest } from '../types/portfolio';
import { portfolioService } from '../services/portfolioService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const usePortfolio = () => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stockData, setStockData] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const submitPortfolio = async (request: PortfolioRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await portfolioService.submitPortfolio(request, messages);
            
            // History'e ekle
            const userMessage: Message = { role: 'user', content: request.user_question };
            const assistantMessage: Message = { role: 'assistant', content: response.analysis };
            setMessages(prev => [...prev, userMessage, assistantMessage]);
            
            setAnalysis(response.analysis);
            setStockData(response.stock_data ?? []);
        } catch (err) {
            setError('Failed to submit portfolio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetConversation = () => {
        setMessages([]);
        setAnalysis(null);
        setStockData([]);
    };

    return { loading, analysis, error, stockData, messages, submitPortfolio, resetConversation };
};