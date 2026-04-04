from fastapi import APIRouter
from models.portfolio import PortfolioRequest

router = APIRouter(
    prefix="/portfolio",
    tags=["portfolio"],
)

@router.post("/")
def send_portfolio(request: PortfolioRequest):
    return request

