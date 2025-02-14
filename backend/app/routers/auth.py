from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .. import models, schemas, auth
import logging

router = APIRouter()
logger = logging.getLogger("openalgo")

@router.post("/register", response_model=schemas.User)
async def register(user: schemas.UserCreate):
    logger.info(f"Registration attempt for user: {user.username}")
    # Check if user exists
    exists = await models.User.filter(
        email=user.email
    ).exists() or await models.User.filter(
        username=user.username
    ).exists()
    
    if exists:
        logger.warning(f"Registration failed: User {user.username} or email {user.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    try:
        hashed_password = auth.get_password_hash(user.password)
        db_user = await models.User.create(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password
        )
        logger.info(f"User {user.username} registered successfully")
        return db_user
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during registration"
        )

@router.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Login attempt for user: {form_data.username}")
    user = await auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    logger.info(f"Successful login for user: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    logger.debug(f"Profile accessed by user: {current_user.username}")
    return current_user
