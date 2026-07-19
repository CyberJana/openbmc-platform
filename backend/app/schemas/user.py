"""User Pydantic schemas."""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr = Field(..., description="User email address")
    full_name: Optional[str] = Field(None, description="User full name")


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8, description="User password")


class UserUpdate(BaseModel):
    """User update schema."""

    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)


class UserResponse(UserBase):
    """User response schema."""

    id: int
    is_active: bool
    is_superadmin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """User list response schema."""

    total: int
    users: list[UserResponse]


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response schema."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class TokenRefresh(BaseModel):
    """Token refresh schema."""

    refresh_token: str


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int