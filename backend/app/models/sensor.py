"""Sensor database model."""

from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base, BaseModel


class Sensor(Base, BaseModel):
    """Sensor model for storing hardware sensor readings."""

    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    name = Column(String(255), nullable=False)
    sensor_type = Column(String(50), nullable=False)  # temperature, voltage, fan, etc.
    reading = Column(Float, nullable=True)
    unit = Column(String(20), nullable=True)  # C, V, RPM, etc.
    status = Column(String(50), default="ok", nullable=False)  # ok, warning, critical
    lower_threshold = Column(Float, nullable=True)
    upper_threshold = Column(Float, nullable=True)
    location = Column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<Sensor(id={self.id}, name={self.name}, type={self.sensor_type})>"