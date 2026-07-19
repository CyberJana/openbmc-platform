"""Error response schemas."""

from typing import Optional, List, Any
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Error detail schema."""

    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    details: Optional[Any] = Field(None, description="Additional error details")


class ErrorResponse(BaseModel):
    """Standard error response schema."""

    status: int = Field(..., description="HTTP status code")
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    timestamp: str = Field(..., description="Error timestamp")
    path: Optional[str] = Field(None, description="Request path")
    details: Optional[List[ErrorDetail]] = Field(None, description="Detailed errors")


class ValidationErrorResponse(ErrorResponse):
    """Validation error response schema."""

    errors: Optional[List[dict]] = Field(None, description="Validation errors")