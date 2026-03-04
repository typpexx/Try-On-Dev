import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class BodyType(str, enum.Enum):
    S = "S"
    M = "M"
    L = "L"


class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class TryOnStatus(str, enum.Enum):
    COMPLETED = "completed"
    PROCESSING = "processing"
    FAILED = "failed"


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    affiliate_link: Mapped[str] = mapped_column(String(500), nullable=False)
    logo_text: Mapped[str] = mapped_column(String(24), default="BR")
    status: Mapped[bool] = mapped_column(Boolean, default=True)
    product_selector: Mapped[str] = mapped_column(String(255), default="img")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    try_ons: Mapped[list["TryOnRecord"]] = relationship(back_populates="brand")
    clicks: Mapped[list["AffiliateClick"]] = relationship(back_populates="brand")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    body_type: Mapped[BodyType] = mapped_column(Enum(BodyType), default=BodyType.M)
    height_cm: Mapped[float] = mapped_column(Float, default=170)
    weight_kg: Mapped[float] = mapped_column(Float, default=65)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[UserStatus] = mapped_column(Enum(UserStatus), default=UserStatus.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    try_ons: Mapped[list["TryOnRecord"]] = relationship(back_populates="user")


class TryOnRecord(Base):
    __tablename__ = "try_on_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    brand_id: Mapped[int] = mapped_column(ForeignKey("brands.id"), nullable=False, index=True)
    product_image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    result_image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[TryOnStatus] = mapped_column(Enum(TryOnStatus), default=TryOnStatus.PROCESSING)
    latency_seconds: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    user: Mapped["User"] = relationship(back_populates="try_ons")
    brand: Mapped["Brand"] = relationship(back_populates="try_ons")


class AffiliateClick(Base):
    __tablename__ = "affiliate_clicks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[int] = mapped_column(ForeignKey("brands.id"), nullable=False, index=True)
    session_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    product_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source: Mapped[str] = mapped_column(String(64), default="brand-hub")
    revenue_estimate: Mapped[float] = mapped_column(Float, default=0)
    clicked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    brand: Mapped["Brand"] = relationship(back_populates="clicks")


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    value: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
