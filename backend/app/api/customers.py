from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.entities import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/api/customers", tags=["Customers"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=CustomerResponse)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(Customer.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get("/", response_model=list[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()