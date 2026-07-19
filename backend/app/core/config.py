"""Application configuration settings."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application settings."""

    # Application settings
    APP_NAME: str = "OpenBMC Firmware Research Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_V1_STR: str = "/api/v1"

    # Database settings
    DATABASE_URL: str = "sqlite:///./openbmc.db"
    SQLALCHEMY_ECHO: bool = False
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40
    DATABASE_POOL_PRE_PING: bool = True

    # JWT settings
    SECRET_KEY: str = Field(..., min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Security settings
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    TRUST_PROXY: bool = False

    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60

    # BMC/Redfish settings
    BMC_HOST: str = "192.168.1.100"
    BMC_PORT: int = 443
    BMC_USERNAME: str = "root"
    BMC_PASSWORD: str = "root"
    BMC_VERIFY_SSL: bool = False
    BMC_TIMEOUT: int = 30
    BMC_RETRIES: int = 3
    BMC_RETRY_DELAY: int = 1

    # Logging settings
    LOG_FILE_PATH: str = "./logs/application.log"
    LOG_MAX_SIZE: int = 10485760  # 10 MB
    LOG_BACKUP_COUNT: int = 5

    # Frontend settings
    FRONTEND_URL: str = "http://localhost:3000"
    FRONTEND_PORT: int = 3000

    # Redis settings (optional)
    REDIS_ENABLED: bool = False
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = ""

    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090

    # Session settings
    SESSION_TIMEOUT_MINUTES: int = 30
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"

    # Timezone
    TIMEZONE: str = "UTC"

    class Config:
        """Pydantic config."""
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        """Parse allowed hosts from string."""
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()