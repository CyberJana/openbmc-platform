"""Events API endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="List events",
)
async def list_events(
    system_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    severity: str = Query(None),
    db: Session = Depends(get_db),
) -> dict:
    """List system events."""
    return {
        "system_id": system_id,
        "total": 0,
        "events": [],
    }


@router.get(
    "/summary",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get event summary",
)
async def get_event_summary(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get event summary."""
    return {
        "system_id": system_id,
        "critical_count": 0,
        "warning_count": 0,
        "info_count": 0,
        "total_count": 0,
    }