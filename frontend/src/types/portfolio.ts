export interface PortfolioItem {
    symbol: string;
    quantity: number;
    purchase_price: number;
    currency: 'TRY' | 'USD';
  }

export interface PortfolioRequest {
    items: PortfolioItem[];
    user_question: string;
}