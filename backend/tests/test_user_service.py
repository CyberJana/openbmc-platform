"""User service tests."""

import pytest
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.user_service import UserService
from app.core.security import hash_password


class TestUserService:
    """User service tests."""

    @pytest.fixture
    def user_service(self, db: Session) -> UserService:
        """Create user service instance."""
        return UserService(db)

    def test_get_user(self, user_service: UserService, db: Session, test_user_data):
        """Test getting user by ID."""
        # Create user
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Get user
        retrieved_user = user_service.get_user(user.id)
        assert retrieved_user is not None
        assert retrieved_user.email == test_user_data["email"]

    def test_list_users(self, user_service: UserService, db: Session, test_user_data):
        """Test listing users."""
        # Create users
        for i in range(3):
            user = User(
                email=f"user{i}@example.com",
                full_name=f"User {i}",
                hashed_password=hash_password("Password123!"),
                is_active=True,
            )
            db.add(user)
        db.commit()

        # List users
        users, total = user_service.list_users(skip=0, limit=10)
        assert len(users) == 3
        assert total == 3

    def test_create_user(self, user_service: UserService, test_user_data):
        """Test creating user."""
        user_data = UserCreate(**test_user_data)
        user = user_service.create_user(user_data)
        assert user.email == test_user_data["email"]

    def test_update_user(self, user_service: UserService, db: Session, test_user_data):
        """Test updating user."""
        # Create user
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Update user
        update_data = UserUpdate(full_name="Updated Name")
        updated_user = user_service.update_user(user.id, update_data)
        assert updated_user.full_name == "Updated Name"

    def test_delete_user(self, user_service: UserService, db: Session, test_user_data):
        """Test deleting user."""
        # Create user
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Delete user
        success = user_service.delete_user(user.id)
        assert success is True

        # Verify deletion
        retrieved_user = user_service.get_user(user.id)
        assert retrieved_user is None