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

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


settings = Settings()
