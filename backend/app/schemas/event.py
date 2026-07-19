"""Event Pydantic schemas."""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class EventBase(BaseModel):
    """Base event schema."""

    severity: str = Field(..., description="Event severity")
    message: str = Field(..., description="Event message")
    event_type: str = Field(..., description="Event type")


class EventCreate(EventBase):
    """Event creation schema."""

    bmc_system_id: int
    event_id: Optional[str] = None
    source: Optional[str] = None
    event_timestamp: Optional[str] = None


class EventResponse(EventBase):
    """Event response schema."""

    id: int
    bmc_system_id: int
    event_id: str
    source: Optional[str] = None
    event_timestamp: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    """Event list response schema."""

    total: int
    events: list[EventResponse]


class EventSummary(BaseModel):
    """Event summary schema."""

    critical_count: int
    warning_count: int
    info_count: int
    total_count: int
    last_event_timestamp: Optional[datetime] = None