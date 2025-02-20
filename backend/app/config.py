from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os
from typing import Optional

load_dotenv()

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', case_sensitive=True)

    # PostgreSQL Configuration
    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")

    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Auto-logout Configuration
    AUTO_LOGOUT_TIME: str = os.getenv("AUTO_LOGOUT_TIME", "03:30")
    AUTO_LOGOUT_TIMEZONE: str = os.getenv("AUTO_LOGOUT_TIMEZONE", "Asia/Kolkata")

    # CORS Configuration
    CORS_ALLOWED_ORIGINS: str = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    CORS_ALLOW_METHODS: str = os.getenv("CORS_ALLOW_METHODS", "GET,POST,PUT,DELETE,OPTIONS")
    CORS_ALLOW_HEADERS: str = os.getenv("CORS_ALLOW_HEADERS", "Authorization,Content-Type,X-CSRF-Token")
    CORS_EXPOSE_HEADERS: str = os.getenv("CORS_EXPOSE_HEADERS", "X-CSRF-Token")
    CORS_MAX_AGE: int = int(os.getenv("CORS_MAX_AGE", "600"))

    # CSRF Configuration
    CSRF_SECRET_KEY: str = os.getenv("CSRF_SECRET_KEY", "your-csrf-secret-key-here")
    CSRF_TOKEN_LIFETIME: int = int(os.getenv("CSRF_TOKEN_LIFETIME", "3600"))
    CSRF_COOKIE_NAME: str = os.getenv("CSRF_COOKIE_NAME", "csrf_token")
    CSRF_COOKIE_SECURE: bool = os.getenv("CSRF_COOKIE_SECURE", "False").lower() == "true"
    CSRF_COOKIE_HTTP_ONLY: bool = os.getenv("CSRF_COOKIE_HTTP_ONLY", "True").lower() == "true"
    CSRF_COOKIE_SAMESITE: str = os.getenv("CSRF_COOKIE_SAMESITE", "lax")

    # Rate Limiting Configuration
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_PERIOD: int = int(os.getenv("RATE_LIMIT_PERIOD", "3600"))  # in seconds

    # Database URL
    @property
    def DATABASE_URL(self) -> str:
        return f"postgres://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Tortoise ORM Config
    @property
    def TORTOISE_ORM(self) -> dict:
        return {
            "connections": {"default": self.DATABASE_URL},
            "apps": {
                "models": {
                    "models": ["app.models"],
                    "default_connection": "default",
                }
            }
        }

# Create a global settings instance
settings = Settings()
