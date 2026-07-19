"""Sensor Pydantic schemas."""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class SensorBase(BaseModel):
    """Base sensor schema."""

    name: str = Field(..., description="Sensor name")
    sensor_type: str = Field(..., description="Sensor type")
    unit: Optional[str] = Field(None, description="Measurement unit")
    location: Optional[str] = Field(None, description="Sensor location")


class SensorCreate(SensorBase):
    """Sensor creation schema."""

    bmc_system_id: int
    lower_threshold: Optional[float] = None
    upper_threshold: Optional[float] = None


class SensorResponse(SensorBase):
    """Sensor response schema."""

    id: int
    bmc_system_id: int
    reading: Optional[float] = None
    status: str
    lower_threshold: Optional[float] = None
    upper_threshold: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SensorListResponse(BaseModel):
    """Sensor list response schema."""

    total: int
    sensors: list[SensorResponse]