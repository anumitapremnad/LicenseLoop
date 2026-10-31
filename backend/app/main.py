from app.api.customers import router as customer_router
from app.models import entities
from app.database import Base, engine
from sqlalchemy import text
from app.database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LicenseLoop API")
app.include_router(customer_router)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "LicenseLoop backend running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
@app.get("/api/db-test")
def test_database():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"database": "connected"}