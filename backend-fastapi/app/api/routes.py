from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models import AffiliateClick, Brand, SystemSetting, TryOnRecord, User
from app.schemas import (
    AffiliateClickCreate,
    AffiliateClickOut,
    BrandCreate,
    BrandOut,
    BrandUpdate,
    HealthResponse,
    SettingOut,
    SettingUpdate,
    TryOnCreate,
    TryOnOut,
    UserCreate,
    UserOut,
    UserUpdate,
)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok", environment=settings.environment)


@router.get("/brands", response_model=list[BrandOut])
def list_brands(db: Session = Depends(get_db)):
    return db.scalars(select(Brand).order_by(Brand.name.asc())).all()


@router.post("/brands", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
def create_brand(payload: BrandCreate, db: Session = Depends(get_db)):
    brand = Brand(**payload.model_dump())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@router.patch("/brands/{brand_id}", response_model=BrandOut)
def update_brand(brand_id: int, payload: BrandUpdate, db: Session = Depends(get_db)):
    brand = db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(brand, key, value)
    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/brands/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    db.delete(brand)
    db.commit()
    return None


@router.get("/users", response_model=list[UserOut])
def list_users(
    q: str | None = Query(default=None, description="Search by name/email"),
    db: Session = Depends(get_db),
):
    query = select(User).order_by(desc(User.created_at))
    if q:
        like_q = f"%{q}%"
        query = query.where((User.full_name.ilike(like_q)) | (User.email.ilike(like_q)))
    return db.scalars(query).all()


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None


@router.get("/try-ons", response_model=list[TryOnOut])
def list_try_ons(
    brand_id: int | None = None,
    user_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = select(TryOnRecord).order_by(desc(TryOnRecord.created_at))
    if brand_id is not None:
        query = query.where(TryOnRecord.brand_id == brand_id)
    if user_id is not None:
        query = query.where(TryOnRecord.user_id == user_id)
    return db.scalars(query).all()


@router.post("/try-ons", response_model=TryOnOut, status_code=status.HTTP_201_CREATED)
def create_try_on(payload: TryOnCreate, db: Session = Depends(get_db)):
    record = TryOnRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/affiliate-clicks", response_model=list[AffiliateClickOut])
def list_affiliate_clicks(
    brand_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = select(AffiliateClick).order_by(desc(AffiliateClick.clicked_at))
    if brand_id is not None:
        query = query.where(AffiliateClick.brand_id == brand_id)
    return db.scalars(query).all()


@router.post("/affiliate-clicks", response_model=AffiliateClickOut, status_code=status.HTTP_201_CREATED)
def create_affiliate_click(payload: AffiliateClickCreate, db: Session = Depends(get_db)):
    event = AffiliateClick(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/affiliate-clicks/summary")
def affiliate_summary(db: Session = Depends(get_db)):
    rows = db.execute(
        select(
            Brand.name.label("brand"),
            func.count(AffiliateClick.id).label("clicks"),
            func.coalesce(func.sum(AffiliateClick.revenue_estimate), 0).label("estimated_revenue"),
        )
        .join(Brand, Brand.id == AffiliateClick.brand_id)
        .group_by(Brand.name)
        .order_by(desc(func.count(AffiliateClick.id)))
    ).all()
    return [
        {"brand": row.brand, "clicks": row.clicks, "estimated_revenue": float(row.estimated_revenue)}
        for row in rows
    ]


@router.get("/settings/{key}", response_model=SettingOut)
def get_setting(key: str, db: Session = Depends(get_db)):
    row = db.scalar(select(SystemSetting).where(SystemSetting.key == key))
    if not row:
        raise HTTPException(status_code=404, detail="Setting not found")
    return row


@router.put("/settings/{key}", response_model=SettingOut)
def upsert_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db)):
    row = db.scalar(select(SystemSetting).where(SystemSetting.key == key))
    if row:
        row.value = payload.value
    else:
        row = SystemSetting(key=key, value=payload.value)
        db.add(row)
    db.commit()
    db.refresh(row)
    return row
