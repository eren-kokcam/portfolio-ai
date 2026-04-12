from fastapi import APIRouter
from models.portfolio import PortfolioRequest
from services.data_service import fetch_portfolio_data
from services.context_service import prepare_context
from services.llm_service import analyze_portfolio

router = APIRouter(
    prefix="/portfolio",
    tags=["portfolio"],
)

@router.post("/")
def send_portfolio(request: PortfolioRequest):
    stock_data = fetch_portfolio_data(request)
    context = prepare_context(request.items, stock_data, request.user_question)
    analysis = analyze_portfolio(context)
    return {
        "analysis": analysis,
        "stock_data": stock_data
    }

