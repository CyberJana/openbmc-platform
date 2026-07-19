"""Response utility functions."""

from typing import Any, Dict, Optional
from datetime import datetime


def success_response(
    data: Any,
    message: str = "Success",
    status_code: int = 200,
) -> Dict[str, Any]:
    """Create a success response."""
    return {
        "status": status_code,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat(),
    }


def error_response(
    error: str,
    message: str,
    status_code: int = 400,
    details: Optional[Any] = None,
) -> Dict[str, Any]:
    """Create an error response."""
    response = {
        "status": status_code,
        "error": error,
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
    }
    if details:
        response["details"] = details
    return response


def paginated_response(
    items: list,
    total: int,
    skip: int = 0,
    limit: int = 100,
) -> Dict[str, Any]:
    """Create a paginated response."""
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": items,
        "has_more": (skip + limit) < total,
    }