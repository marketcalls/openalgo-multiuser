from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
import functools

# Create limiter with in-memory storage
limiter = Limiter(key_func=get_remote_address)

# Request Size Limit Middleware
class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_content_length: int = 1024 * 1024):  # 1MB default
        super().__init__(app)
        self.max_content_length = max_content_length

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get('content-length')
        if content_length:
            content_length = int(content_length)
            if content_length > self.max_content_length:
                return JSONResponse(
                    status_code=413,
                    content={"detail": "Request too large"}
                )
        return await call_next(request)

def setup_rate_limiter(app: FastAPI) -> None:
    """
    Configure rate limiting and request size limits for the FastAPI application
    
    Args:
        app: FastAPI application instance
    """
    # Set up limiter instance in app state
    app.state.limiter = limiter
    
    # Add rate limit exceeded handler
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "limit": f"{settings.RATE_LIMIT_REQUESTS} requests per {settings.RATE_LIMIT_PERIOD} seconds"
            }
        )
    
    # Add Request Size Limit middleware (10MB limit)
    app.add_middleware(RequestSizeLimitMiddleware, max_content_length=10 * 1024 * 1024)

# Decorator for applying rate limits to endpoints
def rate_limit(limit: str = None):
    """
    Decorator for applying rate limits to endpoints
    
    Args:
        limit: Rate limit string (e.g., "5/minute", "100/hour")
              If None, uses the default rate limit from settings
    """
    if limit is None:
        limit = f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_PERIOD}second"
    
    return limiter.limit(limit)
