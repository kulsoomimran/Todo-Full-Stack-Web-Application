from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class Conversation(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)  # User ID as string for flexibility
    thread_id: Optional[str] = Field(default=None, nullable=True)  # OpenAI thread ID for Assistants API
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    messages: List["Message"] = Relationship(back_populates="conversation")
