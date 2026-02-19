from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None # To continue an existing conversation

class ChatMessageResponse(BaseModel):
    conversation_id: str
    message_id: str
    role: str # "user" or "assistant"
    content: str
    timestamp: datetime
