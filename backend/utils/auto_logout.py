import asyncio
import logging
from datetime import datetime, time
import pytz
from fastapi import FastAPI
from app import models

# Configure logging
logging.basicConfig(
    filename='auto_logout.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

async def check_and_logout_users():
    """Check if current time is 10:35 IST and logout all users"""
    ist = pytz.timezone('Asia/Kolkata')
    target_time = time(10, 35)  # Set to 10:35 IST
    
    while True:
        current_time = datetime.now(ist).time()
        if (current_time.hour == target_time.hour and 
            current_time.minute == target_time.minute):
            
            # Get all active users
            active_users = await models.User.filter(is_active=True)
            active_usernames = [user.username for user in active_users]
            
            if active_users:
                # Log active users before logout
                logging.info(f"Active users before auto-logout: {', '.join(active_usernames)}")
                
                # Update all active users to logged out state
                await models.User.filter(is_active=True).update(is_active=False)
                
                logging.info("Auto-logout completed successfully")
            else:
                logging.info("No active users found during auto-logout time")
                
        # Sleep for 50 seconds to avoid multiple checks in the same minute
        await asyncio.sleep(50)

def init_auto_logout(app: FastAPI):
    """Initialize the auto-logout background task"""
    @app.on_event("startup")
    async def start_auto_logout():
        asyncio.create_task(check_and_logout_users())
