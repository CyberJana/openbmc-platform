"""BMC Systems API endpoints."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.bmc_system import (
    BMCSystemCreate,
    BMCSystemResponse,
    BMCSystemUpdate,
    BMCSystemListResponse,
)
from app.services.bmc_service import BMCService

logger = logging.getLogger(__name__)
router = APIRouter()


def get_bmc_service(db: Session = Depends(get_db)) -> BMCService:
    """Get BMC service."""
    return BMCService(db)


@router.get(
    "",
    response_model=BMCSystemListResponse,
    status_code=status.HTTP_200_OK,
    summary="List BMC systems",
)
async def list_bmc_systems(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    bmc_service: BMCService = Depends(get_bmc_service),
) -> BMCSystemListResponse:
    """List all BMC systems with pagination."""
    systems, total = bmc_service.list_bmc_systems(skip, limit)
    return BMCSystemListResponse(total=total, systems=systems)


@router.get(
    "/{system_id}",
    response_model=BMCSystemResponse,
    status_code=status.HTTP_200_OK,
    summary="Get BMC system",
)
async def get_bmc_system(
    system_id: int,
    bmc_service: BMCService = Depends(get_bmc_service),
) -> BMCSystemResponse:
    """Get BMC system by ID."""
    system = bmc_service.get_bmc_system(system_id)
    if not system:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BMC system with ID {system_id} not found",
        )
    return system


@router.post(
    "",
    response_model=BMCSystemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create BMC system",
)
async def create_bmc_system(
    system_data: BMCSystemCreate,
    bmc_service: BMCService = Depends(get_bmc_service),
) -> BMCSystemResponse:
    """Create new BMC system."""
    system = bmc_service.create_bmc_system(system_data)
    return system


@router.put(
    "/{system_id}",
    response_model=BMCSystemResponse,
    status_code=status.HTTP_200_OK,
    summary="Update BMC system",
)
async def update_bmc_system(
    system_id: int,
    system_data: BMCSystemUpdate,
    bmc_service: BMCService = Depends(get_bmc_service),
) -> BMCSystemResponse:
    """Update BMC system."""
    system = bmc_service.update_bmc_system(system_id, system_data)
    if not system:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BMC system with ID {system_id} not found",
        )
    return system


@router.delete(
    "/{system_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete BMC system",
)
async def delete_bmc_system(
    system_id: int,
    bmc_service: BMCService = Depends(get_bmc_service),
):
    """Delete BMC system."""
    success = bmc_service.delete_bmc_system(system_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BMC system with ID {system_id} not found",
        )


@router.post(
    "/{system_id}/health-check",
    status_code=status.HTTP_200_OK,
    summary="Check system health",
)
async def check_health(
    system_id: int,
    bmc_service: BMCService = Depends(get_bmc_service),
) -> dict:
    """Check BMC system health status."""
    status_result = bmc_service.check_system_health(system_id)
    if status_result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"BMC system with ID {system_id} not found",
        )
    return {"system_id": system_id, "health_status": status_result}