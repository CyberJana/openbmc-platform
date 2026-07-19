"""Request ID middleware for tracking requests."""

import uuid
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Add request ID to every request."""

    async def dispatch(self, request: Request, call_next: Callable) -> any:
        """Add request ID and pass through."""
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response