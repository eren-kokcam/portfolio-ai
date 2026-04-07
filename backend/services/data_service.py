import requests
from core.config import settings
import yfinance as yf

def fetch_stock_data(symbol: str):
    try:
        yf_symbol = f"{symbol}.IS" if not symbol.endswith(".IS") else symbol
        ticker = yf.Ticker(yf_symbol)
        info = ticker.fast_info
        
        price = info.last_price
        prev_close = info.previous_close
        
        if not price:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info
            price = info.last_price
            prev_close = info.previous_close
        
        if not price:
            return None
            
        change = price - prev_close
        change_percent = f"{(change / prev_close * 100):.2f}%"
        
        return {
            "symbol": symbol,
            "price": float(price),
            "change": float(change),
            "change_percent": change_percent,
            "prev_close": float(prev_close),
        }
    except Exception as e:
        print(f"Error fetching stock data for {symbol}: {e}")
        return None

def fetch_portfolio_data(portfolio_request):
    results = []
    for item in portfolio_request.items:
        data = fetch_stock_data(item.symbol)
        if data:
            results.append(data)
    return results