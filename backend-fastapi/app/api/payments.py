"""
Stripe payment endpoints. Uses Stripe Checkout (hosted) so card data never touches our server.
Webhook verifies signature and updates user subscription status.
"""
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.config import settings
from app.db.session import get_db
from app.models import User
from app.api.auth import get_current_user
from sqlalchemy.orm import Session

router = APIRouter(prefix="/payments", tags=["payments"])

def _stripe():
    if not settings.stripe_secret_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payments are not configured.",
        )
    import stripe
    stripe.api_key = settings.stripe_secret_key
    return stripe


def _safe_client_url(url: str | None) -> str | None:
    if not url:
        return None
    val = url.strip()
    if not (val.startswith("http://") or val.startswith("https://")):
        return None
    try:
        parsed = urlparse(val)
        if not parsed.scheme or not parsed.netloc:
            return None
        # Allow redirects only to known frontend origins from CORS allowlist.
        allowed = set(settings.cors_origins)
        origin = f"{parsed.scheme}://{parsed.netloc}"
        if origin not in allowed:
            return None
        return val
    except Exception:
        return None
    return None


@router.post("/create-checkout-session")
async def create_checkout_session(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a Stripe Checkout Session for subscription. Returns { url } to redirect the client."""
    stripe = _stripe()
    try:
        body = await request.json()
    except Exception:
        body = {}
    plan_id = (body.get("plan_id") or "pro").lower()
    success_url = _safe_client_url(body.get("success_url"))
    cancel_url = _safe_client_url(body.get("cancel_url"))

    if current_user.status.value != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive.")

    if plan_id not in {"pro", "pro_yearly"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported plan.")

    price_id = settings.stripe_price_id_pro if plan_id == "pro" else settings.stripe_price_id_pro_yearly
    if not price_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected plan is not configured in Stripe.",
        )

    customer_id = current_user.stripe_customer_id
    if not customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            name=current_user.full_name,
            metadata={"user_id": str(current_user.id)},
        )
        customer_id = customer.id
        current_user.stripe_customer_id = customer_id
        db.commit()

    # Fallback to first configured frontend origin if client did not provide URLs.
    base_origin = settings.cors_origins[0] if settings.cors_origins else str(request.base_url).rstrip("/")
    if not success_url:
        success_url = f"{base_origin}/profile?subscription=success"
    if not cancel_url:
        cancel_url = f"{base_origin}/#pricing"

    session = stripe.checkout.Session.create(
        customer=customer_id,
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        client_reference_id=str(current_user.id),
        metadata={"user_id": str(current_user.id), "plan_id": plan_id},
        subscription_data={"metadata": {"user_id": str(current_user.id)}},
        allow_promotion_codes=True,
    )
    return {"url": session.url}


@router.post("/create-billing-portal-session")
async def create_billing_portal_session(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    stripe = _stripe()
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No Stripe customer on file.")

    try:
        body = await request.json()
    except Exception:
        body = {}
    return_url = _safe_client_url(body.get("return_url"))
    if not return_url:
        base_origin = settings.cors_origins[0] if settings.cors_origins else str(request.base_url).rstrip("/")
        return_url = f"{base_origin}/profile"

    session = stripe.billing_portal.Session.create(
        customer=current_user.stripe_customer_id,
        return_url=return_url,
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Stripe webhook: verify signature and update user subscription status. Must receive raw body."""
    payload = await request.body()
    sig = request.headers.get("Stripe-Signature") or ""
    secret = settings.stripe_webhook_secret
    if not secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Webhook secret not set")
    stripe = _stripe()
    try:
        event = stripe.Webhook.construct_event(payload, sig, secret)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload") from e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature") from e

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        sub_id = session.get("subscription")
        user_id_str = (session.get("metadata") or {}).get("user_id")
        if user_id_str and sub_id:
            try:
                user_id = int(user_id_str)
                user = db.get(User, user_id)
                if user:
                    user.stripe_subscription_id = sub_id
                    from app.models import SubscriptionStatus
                    user.subscription_status = SubscriptionStatus.PRO
                    db.commit()
            except (ValueError, TypeError):
                pass

    elif event["type"] == "customer.subscription.updated":
        sub = event["data"]["object"]
        if sub.get("status") in ("active", "trialing"):
            user_id_str = (sub.get("metadata") or {}).get("user_id")
            if user_id_str:
                try:
                    user_id = int(user_id_str)
                    user = db.get(User, user_id)
                    if user:
                        from app.models import SubscriptionStatus
                        user.subscription_status = SubscriptionStatus.PRO
                        user.stripe_subscription_id = sub.get("id")
                        db.commit()
                except (ValueError, TypeError):
                    pass
        else:
            user_id_str = (sub.get("metadata") or {}).get("user_id")
            if user_id_str:
                try:
                    user_id = int(user_id_str)
                    user = db.get(User, user_id)
                    if user:
                        from app.models import SubscriptionStatus
                        user.subscription_status = SubscriptionStatus.STARTER
                        db.commit()
                except (ValueError, TypeError):
                    pass

    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        user_id_str = (sub.get("metadata") or {}).get("user_id")
        if user_id_str:
            try:
                user_id = int(user_id_str)
                user = db.get(User, user_id)
                if user:
                    from app.models import SubscriptionStatus
                    user.subscription_status = SubscriptionStatus.STARTER
                    user.stripe_subscription_id = None
                    db.commit()
            except (ValueError, TypeError):
                pass

    return {"received": True}
