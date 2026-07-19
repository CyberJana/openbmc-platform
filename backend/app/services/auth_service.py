"""Authentication service."""

import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.session import SessionToken
from app.schemas.user import UserCreate, LoginRequest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication service for user login, registration, and token management."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        self.db = db

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user by email and password."""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"Authentication failed: User {email} not found")
            return None
        if not user.is_active:
            logger.warning(f"Authentication failed: User {email} is inactive")
            return None
        if not user.verify_password(password):
            logger.warning(f"Authentication failed: Invalid password for {email}")
            return None
        logger.info(f"User {email} authenticated successfully")
        return user

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.error(f"User creation failed: {user_data.email} already exists")
            raise ValueError(f"User {user_data.email} already exists")

        # Create new user
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
            is_active=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        logger.info(f"User {user_data.email} created successfully")
        return user

    def create_tokens(
        self, user: User, ip_address: Optional[str] = None, user_agent: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create access and refresh tokens for user."""
        # Create tokens
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.email, "user_id": user.id}
        )

        # Store session token
        expires_at = datetime.utcnow() + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        session = SessionToken(
            user_id=user.id,
            token=refresh_token,
            token_type="bearer",
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at,
        )
        self.db.add(session)
        self.db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }

    def refresh_access_token(self, refresh_token: str) -> str:
        """Refresh access token using refresh token."""
        try:
            payload = decode_token(refresh_token)
            user_email = payload.get("sub")
            user_id = payload.get("user_id")

            if not user_email or not user_id:
                raise ValueError("Invalid token payload")

            # Verify session exists
            session = self.db.query(SessionToken).filter(
                SessionToken.token == refresh_token,
                SessionToken.user_id == user_id,
            ).first()

            if not session or not session.is_active:
                raise ValueError("Session not found or inactive")

            # Create new access token
            access_token = create_access_token(
                data={"sub": user_email, "user_id": user_id}
            )
            logger.info(f"Access token refreshed for user {user_email}")
            return access_token
        except Exception as e:
            logger.error(f"Token refresh failed: {e}")
            raise

    def logout(self, user_id: int, token: str) -> bool:
        """Logout user by invalidating session."""
        session = self.db.query(SessionToken).filter(
            SessionToken.user_id == user_id,
            SessionToken.token == token,
        ).first()

        if session:
            session.is_active = False
            self.db.commit()
            logger.info(f"User {user_id} logged out")
            return True
        return False

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode token."""
        return decode_token(token)