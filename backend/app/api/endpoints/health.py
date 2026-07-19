"""Health check API endpoints."""

import logging

from fastapi import APIRouter, status
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="API health check",
)
async def api_health() -> dict:
    """API health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
    }