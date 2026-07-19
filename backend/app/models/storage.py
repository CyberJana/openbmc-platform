"""Storage database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Float

from app.models.base import Base, BaseModel


class Storage(Base, BaseModel):
    """Storage model for disk and volume information."""

    __tablename__ = "storage"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    name = Column(String(255), nullable=False)
    storage_type = Column(String(50), nullable=False)  # SSD, HDD, NVMe, etc.
    capacity_gb = Column(Float, nullable=False)
    used_gb = Column(Float, nullable=True)
    status = Column(String(50), default="ok", nullable=False)
    interface_type = Column(String(50), nullable=True)  # SATA, NVMe, SAS, etc.
    model = Column(String(255), nullable=True)
    serial_number = Column(String(100), nullable=True)
    firmware_version = Column(String(100), nullable=True)

    def __repr__(self) -> str:
        return f"<Storage(id={self.id}, name={self.name})>"