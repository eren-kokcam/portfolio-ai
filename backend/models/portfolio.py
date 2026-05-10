from pydantic import BaseModel
from typing import List, Literal, Optional

class PortfolioItem(BaseModel):
    symbol: str
    quantity: float
    purchase_price: float
    currency: Literal['TRY', 'USD'] = 'TRY'

class Message(BaseModel):
    role: Literal['user', 'assistant']
    content: str

class PortfolioRequest(BaseModel):
    items: List[PortfolioItem]
    user_question: str
    messages: Optional[List[Message]] = []