from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    credit_accounts = relationship("CreditAccount", back_populates="owner", cascade="all, delete")
    debts = relationship("Debt", back_populates="owner", cascade="all, delete")


class CreditAccount(Base):
    __tablename__ = "credit_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    credit_limit = Column(Float, nullable=False)
    current_balance = Column(Float, default=0.0)
    due_date = Column(Integer, nullable=True)  # day of month
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="credit_accounts")
    payments = relationship("Payment", back_populates="account", cascade="all, delete")


class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    remaining_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, default=0.0)
    minimum_payment = Column(Float, default=0.0)
    due_date = Column(Integer, nullable=True)  # day of month
    is_paid_off = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="debts")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("credit_accounts.id"), nullable=False)
    amount = Column(Float, nullable=False)
    note = Column(Text, nullable=True)
    paid_at = Column(DateTime(timezone=True), server_default=func.now())

    account = relationship("CreditAccount", back_populates="payments")
