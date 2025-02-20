from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.database import init_db, close_db
from utils.auto_logout import init_auto_logout
from app.logging_config import setup_logging
import os
import secrets
from fastapi.security import HTTPBearer
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse

# Set up logging
logger = setup_logging()

app = FastAPI(
    title="OpenAlgo MultiUser API",
    description="API for OpenAlgo MultiUser Platform",
    version="1.0.0"
)

# Add CORS middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Register startup and shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("Starting application...")
    await init_db()
    init_auto_logout(app)
    logger.info("Application startup complete!")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down application...")
    await close_db()
    logger.info("Application shutdown complete!")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "Welcome to OpenAlgo MultiUser API"}
