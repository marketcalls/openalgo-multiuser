from tortoise import Tortoise
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Database configuration
DB_CONFIG = {
    'user': os.getenv("POSTGRES_USER", "postgres"),
    'password': os.getenv("POSTGRES_PASSWORD", "1111"),
    'host': os.getenv("POSTGRES_SERVER", "localhost"),
    'port': os.getenv("POSTGRES_PORT", "5432"),
    'database': os.getenv("POSTGRES_DB", "openalgo_db")
}

# Build connection string for Tortoise
DATABASE_URL = f"postgres://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

TORTOISE_ORM = {
    "connections": {"default": DATABASE_URL},
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}

async def init_db():
    """Initialize database connection"""
    try:
        logger.info("Initializing database connection...")
        await Tortoise.init(
            config=TORTOISE_ORM,
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
