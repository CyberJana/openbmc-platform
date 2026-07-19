"""Authentication service tests."""

import pytest
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService
from app.core.security import hash_password


class TestAuthService:
    """Authentication service tests."""

    @pytest.fixture
    def auth_service(self, db: Session) -> AuthService:
        """Create auth service instance."""
        return AuthService(db)

    def test_authenticate_user_success(self, auth_service: AuthService, db: Session, test_user_data):
        """Test successful user authentication."""
        # Create user
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()

        # Test authentication
        authenticated_user = auth_service.authenticate_user(
            test_user_data["email"], test_user_data["password"]
        )
        assert authenticated_user is not None
        assert authenticated_user.email == test_user_data["email"]

    def test_authenticate_user_invalid_password(self, auth_service: AuthService, db: Session, test_user_data):
        """Test authentication with invalid password."""
        # Create user
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()

        # Test authentication with wrong password
        authenticated_user = auth_service.authenticate_user(
            test_user_data["email"], "WrongPassword123!"
        )
        assert authenticated_user is None

    def test_create_user(self, auth_service: AuthService, test_user_data):
        """Test user creation."""
        user_data = UserCreate(**test_user_data)
        user = auth_service.create_user(user_data)
        assert user.email == test_user_data["email"]
        assert user.is_active is True

    def test_create_user_duplicate_email(self, auth_service: AuthService, test_user_data):
        """Test creating user with duplicate email."""
        user_data = UserCreate(**test_user_data)
        auth_service.create_user(user_data)

        # Try to create another user with same email
        with pytest.raises(ValueError):
            auth_service.create_user(user_data)

    def test_create_tokens(self, auth_service: AuthService, db: Session, test_user_data):
        """Test token creation."""
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

        # Create tokens
        tokens = auth_service.create_tokens(user)
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert tokens["token_type"] == "bearer"

    def test_verify_token(self, auth_service: AuthService, db: Session, test_user_data):
        """Test token verification."""
        # Create user and tokens
        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        tokens = auth_service.create_tokens(user)
        payload = auth_service.verify_token(tokens["access_token"])
        assert payload["sub"] == test_user_data["email"]
        assert payload["user_id"] == user.id