import requests
from core.config import settings

def fetch_stock_data(symbol: str):
    try:
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={settings.alpha_vantage_api_key}'
        r = requests.get(url)
        data = r.json()
        quote = data["Global Quote"]
        if not quote:
            return None

        return {
            "symbol": quote["01. symbol"],
            "price": float(quote["05. price"]),
            "change": float(quote["09. change"]),
            "change_percent": quote["10. change percent"],
            "prev_close": float(quote["08. previous close"]),
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