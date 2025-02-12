from tortoise import Tortoise
import logging
import asyncpg
from .config import settings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_database_if_not_exists():
    """Create the database if it doesn't exist, otherwise use existing database"""
    conn = None
    try:
        # Connect to default postgres database to check if our database exists
        logger.info(f"Checking if database '{settings.POSTGRES_DB}' exists...")
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB  # Connect to default postgres database
        )

        # Check if database exists
        result = await conn.fetchrow(
            'SELECT datname, datdba, datistemplate, datallowconn FROM pg_database WHERE datname = $1',
            settings.POSTGRES_DB
        )

        if result:
            logger.info(f"Database '{settings.POSTGRES_DB}' already exists, using existing database")
            if not result['datallowconn']:
                logger.warning(f"Database '{settings.POSTGRES_DB}' exists but does not allow connections")
                raise Exception(f"Database '{settings.POSTGRES_DB}' exists but does not allow connections")
        else:
            logger.info(f"Database '{settings.POSTGRES_DB}' does not exist, creating new database...")
            try:
                # Create database (cannot be done while connected to it)
                await conn.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}"')
                logger.info(f"Database '{settings.POSTGRES_DB}' created successfully!")
            except asyncpg.PostgresError as e:
                logger.error(f"Failed to create database: {str(e)}")
                raise

    except asyncpg.PostgresError as e:
        logger.error(f"PostgreSQL Error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error while checking/creating database: {str(e)}")
        raise
    finally:
        if conn:
            try:
                await conn.close()
                logger.debug("Database connection closed successfully")
            except Exception as e:
                logger.warning(f"Error closing connection: {str(e)}")

async def init_db():
    """Initialize database connection and create schemas"""
    try:
        # First ensure database exists
        await create_database_if_not_exists()

        logger.info("Initializing Tortoise ORM connection...")
        await Tortoise.init(
            config=settings.TORTOISE_ORM,
            use_tz=True
        )
        
        logger.info("Generating database schemas...")
        # Generate schemas for all models
        await Tortoise.generate_schemas(safe=True)
        logger.info("Database initialization complete!")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

async def close_db():
    """Close database connection"""
    try:
        logger.info("Closing database connections...")
        await Tortoise.close_connections()
        logger.info("Database connections closed successfully!")
    except Exception as e:
        logger.error(f"Error closing database connections: {str(e)}")
        raise
