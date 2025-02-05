from tortoise import Tortoise
import logging
from .config import settings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    """Initialize database connection"""
    try:
        logger.info("Initializing database connection...")
        await Tortoise.init(
            config=settings.TORTOISE_ORM,
            use_tz=True
        )
        logger.info("Generating database schemas...")
        await Tortoise.generate_schemas()
        logger.info("Database initialization complete!")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

async def close_db():
    """Close database connection"""
    try:
        logger.info("Closing database connection...")
        await Tortoise.close_connections()
        logger.info("Database connection closed!")
    except Exception as e:
        logger.error(f"Error closing database connection: {str(e)}")
        raise
