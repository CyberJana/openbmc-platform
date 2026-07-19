"""Event database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.models.base import Base, BaseModel


class Event(Base, BaseModel):
    """Event model for storing system events."""

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    event_id = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)  # info, warning, critical
    message = Column(Text, nullable=False)
    event_type = Column(String(100), nullable=False)
    source = Column(String(100), nullable=True)
    event_timestamp = Column(String(50), nullable=True)

    def __repr__(self) -> str:
        return f"<Event(id={self.id}, severity={self.severity})>"