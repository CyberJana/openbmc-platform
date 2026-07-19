"""FastAPI Application Entry Point"""

import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logger import setup_logging
from app.database.session import init_db
from app.middleware.auth import JWTMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.error_handler import ErrorHandlerMiddleware
from app.api import router as api_router

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info("Starting OpenBMC Firmware Research Platform")
    logger.info(f"Application Version: {settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down OpenBMC Firmware Research Platform")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="OpenBMC Firmware Research Platform - Complete BMC and Redfish API Management System",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# Add middleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ErrorHandlerMiddleware)
app.add_middleware(JWTMiddleware)
app.add_middleware(RequestIDMiddleware)


# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Any, exc: RequestValidationError
) -> JSONResponse:
    """Handle validation errors."""
    logger.warning(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation Error",
            "errors": exc.errors(),
        },
    )


# Health check endpoint
@app.get("/health", tags=["Health"], response_model=dict)
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root() -> dict:
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api": f"{settings.API_V1_STR}",
    }


# Include API routes
app.include_router(api_router.router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )