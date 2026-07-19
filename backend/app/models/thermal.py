"""Thermal database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Float

from app.models.base import Base, BaseModel


class Thermal(Base, BaseModel):
    """Thermal model for temperature and cooling data."""

    __tablename__ = "thermal"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    fan_name = Column(String(255), nullable=False)
    status = Column(String(50), default="ok", nullable=False)
    speed_rpm = Column(Integer, nullable=True)
    speed_percent = Column(Float, nullable=True)
    lower_threshold_rpm = Column(Integer, nullable=True)
    upper_threshold_rpm = Column(Integer, nullable=True)
    location = Column(String(255), nullable=True)
    model = Column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<Thermal(id={self.id}, name={self.fan_name})>"