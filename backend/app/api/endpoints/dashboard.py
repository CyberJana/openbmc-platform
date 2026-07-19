"""Dashboard API endpoints."""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import DashboardStatusResponse, HealthCheckResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/status",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard status",
)
async def get_dashboard_status(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get overall system status for dashboard."""
    return {
        "bmc_system_id": system_id,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "healthy",
        "message": "System status retrieved successfully",
    }


@router.get(
    "/metrics",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard metrics",
)
async def get_dashboard_metrics(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get system metrics for dashboard."""
    return {
        "bmc_system_id": system_id,
        "timestamp": datetime.utcnow().isoformat(),
        "cpu_usage": 45.5,
        "memory_usage": 60.2,
        "temperature_c": 38.5,
        "power_watts": 250.0,
    }


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Get health status",
)
async def get_health_status(
    system_id: int,
    db: Session = Depends(get_db),
) -> HealthCheckResponse:
    """Get system health status."""
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        environment="production",
        timestamp=datetime.utcnow(),
    )