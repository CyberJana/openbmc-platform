"""Permission database model."""

from sqlalchemy import Column, String, Integer, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base, BaseModel

# Association table for role-permission relationship
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id"), primary_key=True),
)


class Permission(Base, BaseModel):
    """Permission model."""

    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    resource = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)

    # Relationships
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")

    def __repr__(self) -> str:
        return f"<Permission(id={self.id}, name={self.name})>"