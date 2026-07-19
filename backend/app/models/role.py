"""Role database model."""

from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from app.models.base import Base, BaseModel


class Role(Base, BaseModel):
    """Role model."""

    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    # Relationships
    users = relationship("User", back_populates="role")
    permissions = relationship("Permission", secondary="role_permissions", back_populates="roles")

    def __repr__(self) -> str:
        return f"<Role(id={self.id}, name={self.name})>"