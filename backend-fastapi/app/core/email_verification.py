from datetime import datetime, timedelta
from hashlib import sha256
import secrets
import smtplib
from email.message import EmailMessage

from app.core.config import settings
from app.models import User


def _token_hash(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def generate_verification_token() -> tuple[str, str, datetime]:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.email_verification_expire_minutes)
    return token, _token_hash(token), expires_at


def hash_verification_token(token: str) -> str:
    return _token_hash(token)


def verification_link(token: str) -> str:
    base = settings.backend_public_url.rstrip("/")
    return f"{base}{settings.api_v1_prefix}/auth/verify-email?token={token}"


def send_verification_email(user: User, token: str) -> None:
    link = verification_link(token)
    sender = settings.smtp_from_email or settings.smtp_username

    # If SMTP is not configured, print link for local development.
    if not settings.smtp_host or not sender:
        print(f"[email-verification] {user.email}: {link}")
        return

    message = EmailMessage()
    message["Subject"] = "Verify your email"
    message["From"] = sender
    message["To"] = user.email
    message.set_content(
        (
            f"Hi {user.full_name},\n\n"
            f"Please verify your email by clicking this link:\n{link}\n\n"
            f"This link expires in {settings.email_verification_expire_minutes} minutes.\n\n"
            "If you did not sign up, you can ignore this message."
        )
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_username:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
