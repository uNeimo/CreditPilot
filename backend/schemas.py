from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# --- Auth ---
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# --- Credit Accounts ---
class CreditAccountCreate(BaseModel):
    name: str
    credit_limit: float
    current_balance: float = 0.0
    due_date: Optional[int] = None


class CreditAccountUpdate(BaseModel):
    name: Optional[str] = None
    credit_limit: Optional[float] = None
    current_balance: Optional[float] = None
    due_date: Optional[int] = None


class CreditAccountOut(BaseModel):
    id: int
    name: str
    credit_limit: float
    current_balance: float
    due_date: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Debts ---
class DebtCreate(BaseModel):
    name: str
    total_amount: float
    remaining_amount: float
    interest_rate: float = 0.0
    minimum_payment: float = 0.0
    due_date: Optional[int] = None


class DebtUpdate(BaseModel):
    name: Optional[str] = None
    remaining_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    minimum_payment: Optional[float] = None
    due_date: Optional[int] = None
    is_paid_off: Optional[bool] = None


class DebtOut(BaseModel):
    id: int
    name: str
    total_amount: float
    remaining_amount: float
    interest_rate: float
    minimum_payment: float
    due_date: Optional[int]
    is_paid_off: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Payments ---
class PaymentCreate(BaseModel):
    amount: float
    note: Optional[str] = None


class PaymentOut(BaseModel):
    id: int
    account_id: int
    amount: float
    note: Optional[str]
    paid_at: datetime

    class Config:
        from_attributes = True


# --- Dashboard ---
class DashboardStats(BaseModel):
    total_credit_limit: float
    total_balance: float
    utilization_rate: float
    total_debt: float
    total_debt_remaining: float
    debt_payoff_progress: float
    accounts_count: int
    debts_count: int
    active_debts: int
