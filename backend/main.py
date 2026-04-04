from fastapi import FastAPI

app = FastAPI(title="Portfolio AI")

@app.get("/health")
def health_check():
    return {"status": "ok"}