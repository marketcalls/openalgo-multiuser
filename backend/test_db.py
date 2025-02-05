import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Database configuration
DB_CONFIG = {
    'user': os.getenv("POSTGRES_USER", "postgres"),
    'password': os.getenv("POSTGRES_PASSWORD", "1111"),
    'host': os.getenv("POSTGRES_SERVER", "localhost"),
    'port': os.getenv("POSTGRES_PORT", "5432"),
    'database': 'postgres'  # Try connecting to default database first
}

try:
    # Try connecting to the default database
    conn = psycopg2.connect(**DB_CONFIG)
    conn.close()
    print("Successfully connected to default database!")
    
    # Try creating our database if it doesn't exist
    DB_CONFIG['database'] = 'openalgo_db'
    conn = psycopg2.connect(**DB_CONFIG)
    conn.close()
    print("Successfully connected to openalgo_db!")
    
except psycopg2.OperationalError as e:
    print(f"Connection failed: {str(e)}")
except Exception as e:
    print(f"An error occurred: {str(e)}")
