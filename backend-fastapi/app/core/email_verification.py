from datetime import datetime, timedelta
from hashlib import sha256
import secrets
import smtplib
from email.message import EmailMessage
import requests

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

    # Preferred: Resend.com (transactional email)
    if (settings.resend_api_key or "").strip() and (settings.resend_from_email or "").strip():
        _send_via_resend(user=user, link=link)
        return

    # Fallback: SMTP
    sender = settings.smtp_from_email or settings.smtp_username
    if settings.smtp_host and sender:
        _send_via_smtp(user=user, link=link, sender=sender)
        return

    # Final fallback: print link for local development.
    print(f"[email-verification] {user.email}: {link}")
    return

def _send_via_resend(user: User, link: str) -> None:
    payload = {
        "from": settings.resend_from_email,
        # "to": [user.email],
        "to": "giregiriqegu74@gmail.com",
        "subject": "Verify your email",
        "html": (
            f"<div style='font-family:Arial,sans-serif;font-size:14px;line-height:1.5'>"
            f"<p>Hi {user.full_name},</p>"
            f"<p>Please verify your email by clicking this link:</p>"
            f"<p><a href='{link}' target='_blank' rel='noreferrer'>{link}</a></p>"
            f"<p>This link expires in {settings.email_verification_expire_minutes} minutes.</p>"
            f"<p>If you did not sign up, you can ignore this email.</p>"
            f"</div>"
        ),
        "text": (
            f"Hi {user.full_name},\n\n"
            f"Please verify your email by clicking this link:\n{link}\n\n"
            f"This link expires in {settings.email_verification_expire_minutes} minutes.\n\n"
            "If you did not sign up, you can ignore this email."
        ),
    }
    res = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=15,
    )
    if res.status_code >= 400:
        # Don't fail registration on mail provider issue; keep dev-friendly behavior.
        print(f"[email-verification] Resend failed ({res.status_code}): {res.text}")


def _send_via_smtp(user: User, link: str, sender: str) -> None:
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
