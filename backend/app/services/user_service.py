"""User management service."""

import logging
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

logger = logging.getLogger(__name__)


class UserService:
    """User management service."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        self.db = db

    def get_user(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def list_users(
        self, skip: int = 0, limit: int = 100
    ) -> tuple[List[User], int]:
        """List users with pagination."""
        total = self.db.query(User).count()
        users = self.db.query(User).offset(skip).limit(limit).all()
        return users, total

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user exists
        existing = self.get_user_by_email(user_data.email)
        if existing:
            raise ValueError(f"User with email {user_data.email} already exists")

        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
            is_active=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        logger.info(f"User created: {user_data.email}")
        return user

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user."""
        user = self.get_user(user_id)
        if not user:
            return None

        update_data = user_data.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = hash_password(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        logger.info(f"User updated: {user.email}")
        return user

    def delete_user(self, user_id: int) -> bool:
        """Delete user."""
        user = self.get_user(user_id)
        if not user:
            return False

        self.db.delete(user)
        self.db.commit()
        logger.info(f"User deleted: {user.email}")
        return True

    def activate_user(self, user_id: int) -> Optional[User]:
        """Activate user."""
        user = self.get_user(user_id)
        if user:
            user.is_active = True
            self.db.commit()
            self.db.refresh(user)
            logger.info(f"User activated: {user.email}")
        return user

    def deactivate_user(self, user_id: int) -> Optional[User]:
        """Deactivate user."""
        user = self.get_user(user_id)
        if user:
            user.is_active = False
            self.db.commit()
            self.db.refresh(user)
            logger.info(f"User deactivated: {user.email}")
        return user