"""Inventory database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Text

from app.models.base import Base, BaseModel


class Inventory(Base, BaseModel):
    """Inventory model for system components."""

    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    component_type = Column(String(100), nullable=False)  # CPU, Memory, PSU, Fan, etc.
    component_name = Column(String(255), nullable=False)
    manufacturer = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    serial_number = Column(String(100), nullable=True)
    firmware_version = Column(String(100), nullable=True)
    status = Column(String(50), default="ok", nullable=False)
    details = Column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Inventory(id={self.id}, type={self.component_type})>"