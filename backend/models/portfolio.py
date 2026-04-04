from pydantic import BaseModel
from typing import List

class PortfolioItem(BaseModel):
    symbol: str
    quantity: float
    purchase_price: float

class PortfolioRequest(BaseModel):
    items: List[PortfolioItem]
