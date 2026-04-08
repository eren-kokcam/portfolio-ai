from pydantic import BaseModel
from typing import List, Literal

class PortfolioItem(BaseModel):
    symbol: str
    quantity: float
    purchase_price: float
    currency: Literal['TRY', 'USD'] = 'TRY'

class PortfolioRequest(BaseModel):
    items: List[PortfolioItem]
    user_question: str
