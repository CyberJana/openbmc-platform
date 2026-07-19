"""API router configuration."""

from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    users,
    bmc_systems,
    dashboard,
    sensors,
    events,
    health,
)

router = APIRouter()

# Include routers
router.include_router(auth.router, tags=["Authentication"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(
    bmc_systems.router, prefix="/systems", tags=["BMC Systems"]
)
router.include_router(
    dashboard.router, prefix="/dashboard", tags=["Dashboard"]
)
router.include_router(sensors.router, prefix="/sensors", tags=["Sensors"])
router.include_router(events.router, prefix="/events", tags=["Events"])
router.include_router(health.router, prefix="/health", tags=["Health"])