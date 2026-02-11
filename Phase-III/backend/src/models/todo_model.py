from sqlmodel import SQLModel, Field, create_engine, Relationship
from typing import Optional
from datetime import datetime, timezone
import uuid

class TodoBase(SQLModel):
    """Base model for Todo with common fields"""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Todo(TodoBase, table=True):
    """Todo model for database table"""
    __tablename__ = "todos"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(nullable=False, foreign_key="user.id", index=True)  # UUID stored as VARCHAR string - for user scoping
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to User model (optional, for joins if needed)
    # user: Optional["User"] = Relationship(back_populates="todos")

class TodoCreate(TodoBase):
    """Schema for creating a new todo - user_id assigned by server"""
    pass

class TodoUpdate(SQLModel):
    """Schema for partial updating an existing todo (PATCH)"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)

class TodoReplace(SQLModel):
    """Schema for full replacing an existing todo (PUT)"""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class TodoResponse(TodoBase):
    """Schema for todo response"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime