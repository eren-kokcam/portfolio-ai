def prepare_context(potfolio_items, stock_data, user_question: str) -> str:
    context = "Kullanıcının portföyü\n"

    stock_map = {s["symbol"]: s for s in stock_data}

    for item in potfolio_items:
        stock = stock_map.get(item.symbol.upper())
        if not stock:
            context += f"- {item.symbol}:fiyat verisi alınamadı\n"
            continue

        current_price = stock["price"]
        change_percent = stock["change_percent"]
        total_value = current_price * item.quantity

        context += f"- {item.symbol}: {item.quantity} adet, alış fiyatı {item.purchase_price} {item.currency}, güncel fiyat {current_price} (piyasa fiyatı), değişim {change_percent}\n"

    context += f"\nKullanıcının sorusu: {user_question}"

    return context

