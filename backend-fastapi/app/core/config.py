from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    app_name: str = os.getenv("APP_NAME")
    environment: str = os.getenv("ENVIRONMENT")
    api_v1_prefix: str = os.getenv("API_V1_PREFIX")
    database_url: str = os.getenv("DATABASE_URL")
    backend_cors_origins: str = os.getenv("BACKEND_CORS_ORIGINS")
    # Auth
    secret_key: str = os.getenv("SECRET_KEY")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM")
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID")
    backend_public_url: str = os.getenv("BACKEND_PUBLIC_URL", "http://localhost:8000")
    frontend_public_url: str = os.getenv("FRONTEND_PUBLIC_URL", "http://localhost:8081")
    frontend_verification_redirect_path: str = os.getenv("FRONTEND_VERIFICATION_REDIRECT_PATH", "/brands")
    email_verification_expire_minutes: int = int(os.getenv("EMAIL_VERIFICATION_EXPIRE_MINUTES", "60"))
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_username: str = os.getenv("SMTP_USERNAME", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email: str = os.getenv("SMTP_FROM_EMAIL", "")
    smtp_use_tls: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    resend_api_key: str = os.getenv("RESEND_API_KEY", "")
    resend_from_email: str = os.getenv("RESEND_FROM_EMAIL", "")
    # Stripe (set in .env for payments)
    stripe_secret_key: str = os.getenv("STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = os.getenv("STRIPE_WEBHOOK_SECRET")
    stripe_price_id_pro: str = os.getenv("STRIPE_PRICE_ID_PRO")
    stripe_price_id_pro_yearly: str = os.getenv("STRIPE_PRICE_ID_PRO_YEARLY")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


settings = Settings()
