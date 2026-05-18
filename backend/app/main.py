from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import predict, alerts, audit
from app.db.session import init_db

app = FastAPI(title="SafeScan API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    print("Database initialized")

app.include_router(predict.router, prefix="/api/v1")
app.include_router(alerts.router,  prefix="/api/v1")
app.include_router(audit.router,   prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "safescan-api"}
