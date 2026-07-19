"""Base model for all database models."""

from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.orm import declarative_base


class BaseModel:
    """Base model with common fields."""

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


Base = declarative_base()