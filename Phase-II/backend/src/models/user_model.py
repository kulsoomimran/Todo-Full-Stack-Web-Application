"""User model for authentication."""

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, List


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)


class User(UserBase, table=True):
    """User model for authentication."""

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to todos (optional, for joins if needed)
    # todos: List["Todo"] = Relationship(back_populates="user")


class UserRead(UserBase):
    """User response model."""

    id: UUID
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    """User creation model."""

    password: str