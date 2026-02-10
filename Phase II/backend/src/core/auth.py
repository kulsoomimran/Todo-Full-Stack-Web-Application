"""JWT authentication helpers.

This module provides a FastAPI dependency (`get_current_user`) that:
- Reads `Authorization: Bearer <token>`
- Verifies HS256 signature using `JWT_SECRET_KEY`
- Verifies token expiration (`exp`) via PyJWT's built-in checks
- Extracts `sub` as canonical user_id

All auth failures raise `HTTPException(status_code=401, detail="Unauthorized")`.

Reference: specs/002-jwt-auth/contracts/auth-context.md
"""

from __future__ import annotations

from typing import Optional

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from pydantic_settings import BaseSettings


class _AuthSettings(BaseSettings):
    """Auth settings loaded from environment variables."""

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 30


# Ensure .env is loaded for local/dev execution (idempotent).
load_dotenv()

settings = _AuthSettings()  # reads from environment

_security = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    id: str
    email: Optional[str] = None


def _unauthorized() -> HTTPException:
    # Contract: always return 401 + detail="Unauthorized" for auth failures.
    return HTTPException(status_code=401, detail="Unauthorized")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_security),
) -> CurrentUser:
    """Resolve current user from Bearer JWT.

    Raises:
        HTTPException(401): when header/token is missing, invalid, or expired.
    """

    if credentials is None or not credentials.credentials:
        raise _unauthorized()

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": True},
        )
    except jwt.PyJWTError:
        # Covers: ExpiredSignatureError, InvalidSignatureError, DecodeError, etc.
        raise _unauthorized()

    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id.strip():
        raise _unauthorized()

    email = payload.get("email")
    if email is not None and not isinstance(email, str):
        # Email is optional/informational; treat non-string as invalid token.
        raise _unauthorized()

    return CurrentUser(id=user_id, email=email)
