"""Authentication endpoints for user signup and signin."""

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from ..core.auth import CurrentUser, settings
from ..models.user_model import User
from ..database.database import get_session
from sqlmodel import Session, select

load_dotenv()

router = APIRouter(tags=["auth"])

# Pydantic models for request/response
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: CurrentUser

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/auth/signup", response_model=AuthResponse)
def signup(signup_data: SignUpRequest, session: Session = Depends(get_session)):
    """Create a new user account and return JWT token."""

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == signup_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = hash_password(signup_data.password)

    # Create new user
    user = User(email=signup_data.email, password_hash=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # FIX: Define 'now' with UTC timezone
    now = datetime.now(timezone.utc)
    expiration = now + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    token_payload = {
        "sub": str(user.id),  # user ID as subject (UUID converted to string)
        "email": user.email,
        "exp": int(expiration.timestamp()),
        "iat": int(now.timestamp()),
    }
    access_token = jwt.encode(token_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    # Return token and user info
    current_user = CurrentUser(id=str(user.id), email=user.email)
    return AuthResponse(access_token=access_token, user=current_user)


@router.post("/auth/signin", response_model=AuthResponse)
def signin(signin_data: SignInRequest, session: Session = Depends(get_session)):
    """Authenticate user and return JWT token."""

    # Find user by email
    user = session.exec(select(User).where(User.email == signin_data.email)).first()
    if not user:
        # To prevent user enumeration, use the same error message
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(signin_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    now = datetime.now(timezone.utc)
    expiration = now + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    token_payload = {
        "sub": str(user.id),  # user ID as subject (UUID converted to string)
        "email": user.email,
        "exp": int(expiration.timestamp()),
        "iat": int(now.timestamp()),
    }
    access_token = jwt.encode(token_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    # Return token and user info
    current_user = CurrentUser(id=str(user.id), email=user.email)
    return AuthResponse(access_token=access_token, user=current_user)