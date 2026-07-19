"""Session token database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base, BaseModel


class SessionToken(Base, BaseModel):
    """Session token model for tracking user sessions."""

    __tablename__ = "session_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(500), unique=True, nullable=False)
    token_type = Column(String(20), default="bearer", nullable=False)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(DateTime, default=True, nullable=False)

    # Relationships
    user = relationship("User", back_populates="sessions")

    def __repr__(self) -> str:
        return f"<SessionToken(id={self.id}, user_id={self.user_id})>"