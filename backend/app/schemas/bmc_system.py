"""BMC System Pydantic schemas."""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class BMCSystemBase(BaseModel):
    """Base BMC system schema."""

    name: str = Field(..., description="System name")
    host: str = Field(..., description="BMC host address")
    port: int = Field(default=443, description="BMC port")
    username: str = Field(..., description="BMC username")
    password: str = Field(..., description="BMC password")
    verify_ssl: bool = Field(default=False, description="Verify SSL certificate")


class BMCSystemCreate(BMCSystemBase):
    """BMC system creation schema."""

    pass


class BMCSystemUpdate(BaseModel):
    """BMC system update schema."""

    name: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    verify_ssl: Optional[bool] = None
    is_active: Optional[bool] = None


class BMCSystemResponse(BMCSystemBase):
    """BMC system response schema."""

    id: int
    firmware_version: Optional[str] = None
    bios_version: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    cpu_count: Optional[int] = None
    memory_gb: Optional[float] = None
    is_active: bool
    last_health_check: Optional[str] = None
    health_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BMCSystemListResponse(BaseModel):
    """BMC system list response schema."""

    total: int
    systems: list[BMCSystemResponse]