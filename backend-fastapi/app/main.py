from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.auth import router as auth_router
from app.api.payments import router as payments_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models import Brand

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_defaults()


def seed_defaults():
    db = SessionLocal()
    try:
        has_brands = db.query(Brand).count() > 0
        if not has_brands:
            db.add_all(
                [
                    Brand(
                        name="Zara",
                        url="https://www.zara.com",
                        affiliate_link="https://www.zara.com/?ref=tryonhub",
                        logo_text="ZA",
                        status=True,
                        product_selector="img[data-qa-anchor='product-image']",
                    ),
                    Brand(
                        name="Gucci",
                        url="https://www.gucci.com",
                        affiliate_link="https://www.gucci.com/?utm_source=tryonhub",
                        logo_text="GC",
                        status=True,
                        product_selector=".product-gallery img",
                    ),
                    Brand(
                        name="Fashion Nova",
                        url="https://www.fashionnova.com",
                        affiliate_link="https://www.fashionnova.com/?utm_source=tryonhub",
                        logo_text="FN",
                        status=True,
                        product_selector=".product-main-image img",
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


app.include_router(router, prefix=settings.api_v1_prefix)
app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(payments_router, prefix=settings.api_v1_prefix)
