from fastapi import FastAPI
from routers.portfolio import router as portfolio_router

app = FastAPI(title="Portfolio AI")

app.include_router(portfolio_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}