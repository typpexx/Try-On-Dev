from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import BodyType, SubscriptionStatus, TryOnStatus, UserRole, UserStatus


class HealthResponse(BaseModel):
    status: str
    environment: str


class BrandBase(BaseModel):
    name: str
    url: str
    affiliate_link: str
    logo_text: str = "BR"
    status: bool = True
    product_selector: str = "img"


class BrandCreate(BrandBase):
    pass


class BrandUpdate(BaseModel):
    name: str | None = None
    url: str | None = None
    affiliate_link: str | None = None
    logo_text: str | None = None
    status: bool | None = None
    product_selector: str | None = None


class BrandOut(BrandBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: UserRole = UserRole.USER
    api_key: str | None = None
    subscription_status: SubscriptionStatus = SubscriptionStatus.STARTER
    body_type: BodyType = BodyType.M
    height_cm: float = 170
    weight_kg: float = 65
    photo_url: str | None = None
    status: UserStatus = UserStatus.ACTIVE


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    role: UserRole | None = None
    api_key: str | None = None
    subscription_status: SubscriptionStatus | None = None
    body_type: BodyType | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    photo_url: str | None = None
    status: UserStatus | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# Auth schemas
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    id_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TryOnCreate(BaseModel):
    user_id: int
    brand_id: int
    product_image_url: str
    result_image_url: str
    status: TryOnStatus = TryOnStatus.PROCESSING
    latency_seconds: float | None = None


class TryOnOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    brand_id: int
    product_image_url: str
    result_image_url: str
    status: TryOnStatus
    latency_seconds: float | None
    created_at: datetime


class AffiliateClickCreate(BaseModel):
    brand_id: int
    session_id: str
    product_url: str | None = None
    source: str = "brand-hub"
    revenue_estimate: float = 0


class AffiliateClickOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    brand_id: int
    session_id: str
    product_url: str | None
    source: str
    revenue_estimate: float
    clicked_at: datetime


class SettingUpdate(BaseModel):
    value: str


class SettingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    key: str
    value: str
    updated_at: datetime
