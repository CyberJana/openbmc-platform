"""Sensors API endpoints."""

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
    summary="List sensors",
)
async def list_sensors(
    system_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
) -> dict:
    """List all sensors for a system."""
    return {
        "system_id": system_id,
        "total": 0,
        "sensors": [],
    }


@router.get(
    "/temperature",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get temperature sensors",
)
async def get_temperature_sensors(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get temperature sensors."""
    return {
        "system_id": system_id,
        "sensor_type": "temperature",
        "sensors": [],
    }


@router.get(
    "/fans",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get fan sensors",
)
async def get_fan_sensors(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get fan sensors."""
    return {
        "system_id": system_id,
        "sensor_type": "fan",
        "sensors": [],
    }


@router.get(
    "/power",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get power sensors",
)
async def get_power_sensors(
    system_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get power sensors."""
    return {
        "system_id": system_id,
        "sensor_type": "power",
        "sensors": [],
    }