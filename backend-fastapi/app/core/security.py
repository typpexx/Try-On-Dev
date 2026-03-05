from datetime import datetime, timezone, timedelta
import hashlib
import secrets

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings

# Use bcrypt directly (passlib is incompatible with bcrypt 4.1+).
# We hash with SHA-256 first so any password length works within bcrypt's 72-byte limit.


def hash_password(password: str) -> str:
    if len(password.encode("utf-8")) > 4096:
        raise ValueError("Password too long")
    digest = hashlib.sha256(password.encode("utf-8")).digest()
    return bcrypt.hashpw(digest, bcrypt.gensalt()).decode("ascii")


def verify_password(plain: str, hashed: str) -> bool:
    digest = hashlib.sha256(plain.encode("utf-8")).digest()
    try:
        return bcrypt.checkpw(digest, hashed.encode("ascii"))
    except Exception:
        return False


def create_access_token(subject: str | int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    to_encode = {"sub": str(subject), "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload.get("sub")
    except JWTError:
        return None


def generate_api_key() -> str:
    return f"sk_{secrets.token_urlsafe(32)}"
