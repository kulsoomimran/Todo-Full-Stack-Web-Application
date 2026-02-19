from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import Session # Import Session

from ..schemas.chat_schema import ChatMessageRequest, ChatMessageResponse
from ..core.ai_agent import AIAgent
from ..services.chat_service import ChatService # Import ChatService
from ..database.database import get_session # Import get_session
from ..core.auth import get_current_user # Import get_current_user
from ..models.user_model import User # Import User model

router = APIRouter(prefix="/chat", tags=["Chat"])

# Initialize the AI Agent (consider dependency injection for a more robust solution in production)
ai_agent = AIAgent()

@router.get("/")
async def read_chat_root():
    return {"message": "Chat API is alive!"}

@router.post("/message", response_model=ChatMessageResponse, status_code=status.HTTP_200_OK)
async def chat_message(
    chat_request: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Receives a user message, relays it to the AI agent, and returns the agent's response.
    Persists user and AI messages to the database.
    Uses OpenAI Assistants API with thread reuse for conversation continuity.
    """
    conversation_id: UUID

    # 1. Handle conversation creation or retrieval
    if chat_request.conversation_id:
        conversation = ChatService.get_conversation_by_id(session, chat_request.conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation with ID {chat_request.conversation_id} not found."
            )
        # Verify ownership
        if str(conversation.user_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this conversation."
            )
        conversation_id = conversation.id
        thread_id = conversation.thread_id
    else:
        conversation = ChatService.create_conversation(session, user_id=str(current_user.id))
        conversation_id = conversation.id
        thread_id = None  # Will be created by AI agent

    # 2. Persist user message
    user_message = ChatService.create_message(
        session,
        conversation_id=conversation_id,
        role="user",
        content=chat_request.message
    )

    # 3. Get AI response using Assistants API
    # The agent now handles thread creation/reuse internally
    ai_response_content, new_thread_id = await ai_agent.process_message(
        message=chat_request.message,
        session=session,
        user_id=str(current_user.id),
        thread_id=thread_id
    )

    # 4. Update conversation with thread_id if it was just created
    if not thread_id and new_thread_id:
        conversation.thread_id = new_thread_id
        session.add(conversation)
        session.commit()

    # 5. Persist AI response
    ai_message = ChatService.create_message(
        session,
        conversation_id=conversation_id,
        role="assistant",
        content=ai_response_content
    )

    return ChatMessageResponse(
        conversation_id=str(conversation_id),
        message_id=str(ai_message.id),
        role="assistant",
        content=ai_response_content,
        timestamp=ai_message.timestamp
    )


@router.get("/message/{conversation_id}", response_model=List[ChatMessageResponse], status_code=status.HTTP_200_OK)
async def get_conversation(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieves the conversation history for a given conversation ID.
    Ensures that only the owner of the conversation can access it.
    """
    conversation = ChatService.get_conversation_by_id(session, conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} not found."
        )
    
    # Ensure the current user is the owner of the conversation
    if str(conversation.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this conversation."
        )
            
    messages = ChatService.get_messages_for_conversation(session, conversation_id)
    return messages
