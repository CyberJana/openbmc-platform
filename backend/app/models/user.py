"""User database model."""

from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base, BaseModel
from app.core.security import hash_password, verify_password


class User(Base, BaseModel):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superadmin = Column(Boolean, default=False, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)

    # Relationships
    role = relationship("Role", back_populates="users")
    audit_logs = relationship("AuditLog", back_populates="user")
    sessions = relationship("SessionToken", back_populates="user")

    def set_password(self, password: str) -> None:
        """Set user password."""
        self.hashed_password = hash_password(password)

    def verify_password(self, password: str) -> bool:
        """Verify user password."""
        return verify_password(password, self.hashed_password)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"