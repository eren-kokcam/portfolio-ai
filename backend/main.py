from fastapi import FastAPI
from routers.portfolio import router as portfolio_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Portfolio AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://portfolio-ai-eren.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(portfolio_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}