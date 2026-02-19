from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class Message(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True)
    
    role: str # "user", "assistant", "system", "tool"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    conversation: "Conversation" = Relationship(back_populates="messages")
