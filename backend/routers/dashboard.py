from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db),
                        current_user: models.User = Depends(get_current_user)):
    accounts = db.query(models.CreditAccount).filter(
        models.CreditAccount.user_id == current_user.id
    ).all()

    debts = db.query(models.Debt).filter(
        models.Debt.user_id == current_user.id
    ).all()

    total_limit = sum(a.credit_limit for a in accounts)
    total_balance = sum(a.current_balance for a in accounts)
    utilization = (total_balance / total_limit * 100) if total_limit > 0 else 0.0

    total_debt = sum(d.total_amount for d in debts)
    total_remaining = sum(d.remaining_amount for d in debts)
    debt_paid = total_debt - total_remaining
    payoff_progress = (debt_paid / total_debt * 100) if total_debt > 0 else 0.0

    active_debts = sum(1 for d in debts if not d.is_paid_off)

    return schemas.DashboardStats(
        total_credit_limit=total_limit,
        total_balance=total_balance,
        utilization_rate=round(utilization, 2),
        total_debt=total_debt,
        total_debt_remaining=total_remaining,
        debt_payoff_progress=round(payoff_progress, 2),
        accounts_count=len(accounts),
        debts_count=len(debts),
        active_debts=active_debts,
    )
