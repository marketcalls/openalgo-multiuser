from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from app.config import settings
import functools

# Create limiter with in-memory storage
limiter = Limiter(key_func=get_remote_address)

def setup_rate_limiter(app: FastAPI) -> None:
    """
    Configure rate limiting for the FastAPI application
    
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
