from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models import User
from app.schemas import GoogleLoginRequest, LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def user_to_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        api_key=user.api_key,
        subscription_status=user.subscription_status,
        body_type=user.body_type,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
        photo_url=user.photo_url,
        status=user.status,
        created_at=user.created_at,
    )


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user_to_out(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if user.status.value != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive.",
        )
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user_to_out(user))


@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Sign-In is not configured.",
        )
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.google_client_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token.",
        ) from e
    google_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name") or (email or "User").split("@")[0]
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account must have an email.",
        )
    user = db.scalar(select(User).where(User.google_id == google_id))
    if not user:
        user = db.scalar(select(User).where(User.email == email))
        if user:
            user.google_id = google_id
            user.full_name = user.full_name or name
            db.commit()
            db.refresh(user)
        else:
            user = User(
                email=email,
                full_name=name,
                google_id=google_id,
                password_hash=None,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    if user.status.value != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive.",
        )
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user_to_out(user))


def _get_bearer_token(authorization: str | None = Header(None)) -> str | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    return authorization[7:].strip()


def get_current_user_id(token: str | None = Depends(_get_bearer_token)) -> str | None:
    from app.core.security import decode_access_token
    if not token:
        return None
    return decode_access_token(token)


def get_current_user(
    db: Session = Depends(get_db),
    user_id: str | None = Depends(get_current_user_id),
) -> User:
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.get("/me", response_model=UserOut)
def me(
    db: Session = Depends(get_db),
    token: str | None = Depends(_get_bearer_token),
):
    from app.core.security import decode_access_token
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user_to_out(user)
