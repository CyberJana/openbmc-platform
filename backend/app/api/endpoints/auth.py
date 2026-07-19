"""Authentication API endpoints."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import LoginRequest, LoginResponse, UserCreate, TokenResponse, TokenRefresh
from app.services.auth_service import AuthService
from app.core.security import decode_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth")


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Get authentication service."""
    return AuthService(db)


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="User login",
)
async def login(
    credentials: LoginRequest,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    """Authenticate user and return access token."""
    user = auth_service.authenticate_user(credentials.email, credentials.password)
    if not user:
        logger.warning(f"Failed login attempt for {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    tokens = auth_service.create_tokens(user, ip_address, user_agent)

    return LoginResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        expires_in=tokens["expires_in"],
        user=user,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",
)
async def refresh_token(
    token_data: TokenRefresh,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    """Refresh access token using refresh token."""
    try:
        access_token = auth_service.refresh_access_token(token_data.refresh_token)
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=1800,
        )
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="User logout",
)
async def logout(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Logout user by invalidating session."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )

    try:
        scheme, token = auth_header.split()
        payload = decode_token(token)
        user_id = payload.get("user_id")
        auth_service.logout(user_id, token)
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed",
        )