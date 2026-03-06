from datetime import datetime
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.email_verification import (
    generate_verification_token,
    hash_verification_token,
    send_verification_email,
)
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models import User
from app.schemas import (
    EmailVerificationRequest,
    GoogleLoginRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    UserOut,
)

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


@router.post("/register", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    if len(payload.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    try:
        password_hash = hash_password(payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

    token, token_hash, expires_at = generate_verification_token()
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=password_hash,
        email_verified=False,
        email_verification_token_hash=token_hash,
        email_verification_expires_at=expires_at,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    send_verification_email(user, token)
    return RegisterResponse(message="Account created. Please verify your email from the link we sent.")


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
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before signing in.",
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
    if not (getattr(settings, "google_client_id", None) or "").strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Sign-In is not configured. Set GOOGLE_CLIENT_ID in backend .env",
        )
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.google_client_id.strip(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token.",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google token verification failed: {str(e)}",
        ) from e
    google_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name") or (email or "User").split("@")[0]
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account must have an email.",
        )
    try:
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
                    email_verified=True,
                    email_verified_at=datetime.utcnow(),
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}",
        ) from e


def _verify_email_token(token: str, db: Session) -> str:
    token_hash = hash_verification_token(token)
    user = db.scalar(select(User).where(User.email_verification_token_hash == token_hash))
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token.")

    if user.email_verified:
        return "already_verified"

    if not user.email_verification_expires_at or user.email_verification_expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification token has expired.")

    user.email_verified = True
    user.email_verified_at = datetime.utcnow()
    user.email_verification_token_hash = None
    user.email_verification_expires_at = None
    db.commit()
    return "success"


@router.get("/verify-email")
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    base = settings.frontend_public_url.rstrip("/")
    path = (settings.frontend_verification_redirect_path or "/brands").strip()
    if not path.startswith("/"):
        path = "/" + path

    def redirect_to_signin(verification: str) -> RedirectResponse:
        url = f"{base}/sign-in?{urlencode({'verification': verification})}"
        return RedirectResponse(url=url, status_code=302)

    def redirect_logged_in(user: User) -> RedirectResponse:
        access_token = create_access_token(subject=user.id)
        url = f"{base}/auth/callback#access_token={access_token}"
        return RedirectResponse(url=url, status_code=302)

    try:
        token_hash = hash_verification_token(token)
        user = db.scalar(select(User).where(User.email_verification_token_hash == token_hash))
        if not user:
            return redirect_to_signin("invalid")
        result = _verify_email_token(token, db)
        if result in ("success", "already_verified"):
            return redirect_logged_in(user)
        return redirect_to_signin(result)
    except HTTPException as exc:
        detail = (exc.detail or "").lower()
        if "expired" in detail:
            return redirect_to_signin("expired")
        if "invalid" in detail:
            return redirect_to_signin("invalid")
        return redirect_to_signin("error")


@router.post("/verify-email/resend", response_model=MessageResponse)
def resend_verification_email(payload: EmailVerificationRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    # Avoid account enumeration.
    if not user:
        return MessageResponse(message="If your account exists, a verification email has been sent.")

    if user.email_verified:
        return MessageResponse(message="Email already verified. You can sign in.")

    token, token_hash, expires_at = generate_verification_token()
    user.email_verification_token_hash = token_hash
    user.email_verification_expires_at = expires_at
    db.commit()
    send_verification_email(user, token)
    return MessageResponse(message="If your account exists, a verification email has been sent.")


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
