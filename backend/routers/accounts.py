from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/accounts", tags=["Credit Accounts"])


@router.get("/", response_model=List[schemas.CreditAccountOut])
def get_accounts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.CreditAccount).filter(models.CreditAccount.user_id == current_user.id).all()


@router.post("/", response_model=schemas.CreditAccountOut, status_code=201)
def create_account(account: schemas.CreditAccountCreate, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    new_account = models.CreditAccount(**account.model_dump(), user_id=current_user.id)
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


@router.put("/{account_id}", response_model=schemas.CreditAccountOut)
def update_account(account_id: int, updates: schemas.CreditAccountUpdate,
                   db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    account = db.query(models.CreditAccount).filter(
        models.CreditAccount.id == account_id,
        models.CreditAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(account, key, value)

    db.commit()
    db.refresh(account)
    return account


@router.delete("/{account_id}", status_code=204)
def delete_account(account_id: int, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    account = db.query(models.CreditAccount).filter(
        models.CreditAccount.id == account_id,
        models.CreditAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()


@router.post("/{account_id}/payments", response_model=schemas.PaymentOut, status_code=201)
def add_payment(account_id: int, payment: schemas.PaymentCreate,
                db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    account = db.query(models.CreditAccount).filter(
        models.CreditAccount.id == account_id,
        models.CreditAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    new_payment = models.Payment(account_id=account_id, **payment.model_dump())
    account.current_balance = max(0, account.current_balance - payment.amount)
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment


@router.get("/{account_id}/payments", response_model=List[schemas.PaymentOut])
def get_payments(account_id: int, db: Session = Depends(get_db),
                 current_user: models.User = Depends(get_current_user)):
    account = db.query(models.CreditAccount).filter(
        models.CreditAccount.id == account_id,
        models.CreditAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account.payments
