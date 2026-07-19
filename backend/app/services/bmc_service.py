"""BMC system management service."""

import logging
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.bmc_system import BMCSystem
from app.schemas.bmc_system import BMCSystemCreate, BMCSystemUpdate
from app.services.redfish_service import RedfishClient

logger = logging.getLogger(__name__)


class BMCService:
    """BMC system management service."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        self.db = db

    def get_bmc_system(self, system_id: int) -> Optional[BMCSystem]:
        """Get BMC system by ID."""
        return self.db.query(BMCSystem).filter(BMCSystem.id == system_id).first()

    def list_bmc_systems(
        self, skip: int = 0, limit: int = 100
    ) -> tuple[List[BMCSystem], int]:
        """List BMC systems with pagination."""
        total = self.db.query(BMCSystem).count()
        systems = self.db.query(BMCSystem).offset(skip).limit(limit).all()
        return systems, total

    def create_bmc_system(self, system_data: BMCSystemCreate) -> BMCSystem:
        """Create new BMC system."""
        system = BMCSystem(**system_data.dict())
        self.db.add(system)
        self.db.commit()
        self.db.refresh(system)
        logger.info(f"BMC system created: {system.name}")
        return system

    def update_bmc_system(
        self, system_id: int, system_data: BMCSystemUpdate
    ) -> Optional[BMCSystem]:
        """Update BMC system."""
        system = self.get_bmc_system(system_id)
        if not system:
            return None

        update_data = system_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(system, field, value)

        self.db.commit()
        self.db.refresh(system)
        logger.info(f"BMC system updated: {system.name}")
        return system

    def delete_bmc_system(self, system_id: int) -> bool:
        """Delete BMC system."""
        system = self.get_bmc_system(system_id)
        if not system:
            return False

        self.db.delete(system)
        self.db.commit()
        logger.info(f"BMC system deleted: {system.name}")
        return True

    def check_system_health(self, system_id: int) -> Optional[str]:
        """Check system health status using Redfish API."""
        system = self.get_bmc_system(system_id)
        if not system:
            return None

        try:
            client = RedfishClient(
                host=system.host,
                username=system.username,
                password=system.password,
                port=system.port,
                verify_ssl=system.verify_ssl,
            )

            if not client.authenticate():
                system.health_status = "Unknown"
                self.db.commit()
                return "Unknown"

            health_data = client.get_system_health()
            if health_data:
                status = health_data.get("Status", {}).get("HealthRollup", "Unknown")
                system.health_status = status
                system.last_health_check = "now"
                self.db.commit()
                logger.info(f"Health check for {system.name}: {status}")
                return status
            else:
                system.health_status = "Unknown"
                self.db.commit()
                return "Unknown"
        except Exception as e:
            logger.error(f"Health check failed for {system.name}: {e}")
            system.health_status = "Unknown"
            self.db.commit()
            return "Unknown"
        finally:
            client.close()