from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    company = Column(String(150))

    subscriptions = relationship("Subscription", back_populates="customer")


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    billing_cycle = Column(String(30), nullable=False)

    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    status = Column(String(30), default="active")
    start_date = Column(Date, nullable=False)
    renewal_date = Column(Date)

    customer = relationship("Customer", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")
    invoices = relationship("Invoice", back_populates="subscription")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(30), default="pending")
    due_date = Column(Date)

    subscription = relationship("Subscription", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(Date)
    status = Column(String(30), default="completed")

    invoice = relationship("Invoice", back_populates="payments")