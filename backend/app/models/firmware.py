"""Firmware database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Text

from app.models.base import Base, BaseModel


class Firmware(Base, BaseModel):
    """Firmware model for firmware inventory and updates."""

    __tablename__ = "firmware"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    component = Column(String(100), nullable=False)  # BMC, BIOS, CPLD, etc.
    current_version = Column(String(100), nullable=False)
    available_version = Column(String(100), nullable=True)
    release_date = Column(String(50), nullable=True)
    release_notes = Column(Text, nullable=True)
    update_status = Column(String(50), default="None", nullable=False)  # None, InProgress, Success, Failed
    update_percentage = Column(Integer, default=0, nullable=False)

    def __repr__(self) -> str:
        return f"<Firmware(id={self.id}, component={self.component})>"