from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/debts", tags=["Debts"])


@router.get("/", response_model=List[schemas.DebtOut])
def get_debts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Debt).filter(models.Debt.user_id == current_user.id).all()


@router.post("/", response_model=schemas.DebtOut, status_code=201)
def create_debt(debt: schemas.DebtCreate, db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_user)):
    new_debt = models.Debt(**debt.model_dump(), user_id=current_user.id)
    db.add(new_debt)
    db.commit()
    db.refresh(new_debt)
    return new_debt


@router.put("/{debt_id}", response_model=schemas.DebtOut)
def update_debt(debt_id: int, updates: schemas.DebtUpdate,
                db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    debt = db.query(models.Debt).filter(
        models.Debt.id == debt_id,
        models.Debt.user_id == current_user.id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(debt, key, value)

    if debt.remaining_amount <= 0:
        debt.is_paid_off = True

    db.commit()
    db.refresh(debt)
    return debt


@router.delete("/{debt_id}", status_code=204)
def delete_debt(debt_id: int, db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_user)):
    debt = db.query(models.Debt).filter(
        models.Debt.id == debt_id,
        models.Debt.user_id == current_user.id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    db.delete(debt)
    db.commit()
