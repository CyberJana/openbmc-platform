"""BMC System database model."""

from sqlalchemy import Column, String, Integer, Float, Boolean

from app.models.base import Base, BaseModel


class BMCSystem(Base, BaseModel):
    """BMC System model for storing Redfish system information."""

    __tablename__ = "bmc_systems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    host = Column(String(255), nullable=False)
    port = Column(Integer, default=443, nullable=False)
    username = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    firmware_version = Column(String(100), nullable=True)
    bios_version = Column(String(100), nullable=True)
    serial_number = Column(String(100), unique=True, nullable=True)
    manufacturer = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    cpu_count = Column(Integer, nullable=True)
    memory_gb = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    verify_ssl = Column(Boolean, default=False, nullable=False)
    last_health_check = Column(String(50), nullable=True)
    health_status = Column(String(50), default="Unknown", nullable=False)

    def __repr__(self) -> str:
        return f"<BMCSystem(id={self.id}, name={self.name}, host={self.host})>"