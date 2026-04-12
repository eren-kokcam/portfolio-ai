import yfinance as yf

SYMBOL_MAP = {
    'BIST': 'XU100.IS',
    'BIST100': 'XU100.IS',
    'XU100': 'XU100.IS',
    'GOLD': 'GC=F',
    'ALTIN': 'GC=F',
    'DOLAR': 'USDTRY=X',
    'USD': 'USDTRY=X',
    'EURO': 'EURTRY=X',
    'EUR': 'EURTRY=X',
}

USD_SYMBOLS = {'GC=F'}
OZ_TO_GRAM = 31.1034768 

def normalize_symbol(symbol: str) -> str:
    return (
        symbol
        .replace('İ', 'I').replace('ı', 'i')
        .replace('Ş', 'S').replace('ş', 's')
        .replace('Ğ', 'G').replace('ğ', 'g')
        .replace('Ü', 'U').replace('ü', 'u')
        .replace('Ö', 'O').replace('ö', 'o')
        .replace('Ç', 'C').replace('ç', 'c')
        .upper()
    )

def fetch_usdtry() -> float:
    try:
        ticker = yf.Ticker("USDTRY=X")
        hist = ticker.history(period="2d")
        if not hist.empty:
            return float(hist['Close'].iloc[-1])
    except Exception:
        pass
    return 38.0  # fallback

def fetch_stock_data(symbol: str, usdtry: float):
    symbol_upper = normalize_symbol(symbol)

    if symbol_upper in SYMBOL_MAP:
        candidates = [SYMBOL_MAP[symbol_upper]]
    else:
        candidates = [
            f"{symbol_upper}-USD",
            f"{symbol_upper}.IS",
            symbol_upper,
        ]

    for yf_symbol in candidates:
        try:
            ticker = yf.Ticker(yf_symbol)
            hist = ticker.history(period="5d")
            if hist.empty:
                continue

            price = float(hist['Close'].iloc[-1])
            prev_close = float(hist['Close'].iloc[-2]) if len(hist) > 1 else price

            is_usd = yf_symbol.endswith('-USD') or yf_symbol in USD_SYMBOLS
            if is_usd:
                price = price * usdtry
                prev_close = prev_close * usdtry
            
            if yf_symbol == 'GC=F':
                price = price / OZ_TO_GRAM
                prev_close = prev_close / OZ_TO_GRAM

            change = price - prev_close
            change_percent = f"{(change / prev_close * 100):.2f}%"

            return {
                "symbol": symbol_upper,
                "price": price,
                "change": change,
                "change_percent": change_percent,
                "prev_close": prev_close,
                "currency": "TRY",
            }
        except Exception:
            continue

    print(f"Error fetching stock data for {symbol}: no data found")
    return None

def fetch_portfolio_data(portfolio_request):
    usdtry = fetch_usdtry()
    results = []
    for item in portfolio_request.items:
        data = fetch_stock_data(item.symbol, usdtry)
        if data:
            results.append(data)
    return results