import logging
import logging.handlers
import os
from datetime import datetime

def setup_logging():
    # Create logs directory if it doesn't exist
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Generate log filename with timestamp
    current_time = datetime.now().strftime("%Y-%m-%d")
    log_filename = os.path.join(log_dir, f"app_{current_time}.log")

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # File handler with rotation
            logging.handlers.RotatingFileHandler(
                log_filename,
                maxBytes=10485760,  # 10MB
                backupCount=5
            ),
            # Console handler
            logging.StreamHandler()
        ]
    )

    # Create logger
    logger = logging.getLogger("openalgo")
    
    # Log startup message
    logger.info("Logging system initialized")
    
    return logger
