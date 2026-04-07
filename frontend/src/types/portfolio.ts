export interface PortfolioItem {
    symbol: string;
    quantity: number;
    purchase_price: number;
  }

export interface PortfolioRequest {
    items: PortfolioItem[];
    user_question: string;
}