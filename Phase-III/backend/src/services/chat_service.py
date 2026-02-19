from sqlmodel import Session, select
import logging
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone

from ..models.conversation_model import Conversation
from ..models.message_model import Message
from ..schemas.chat_schema import ChatMessageResponse


logger = logging.getLogger(__name__)

class ChatService:
    """Service class for chat operations"""

    @staticmethod
    def create_conversation(session: Session, user_id: str) -> Conversation:
        """
        Creates a new conversation in the database, associated with a user.
        """
        logger.debug(f"Creating a new conversation for user: {user_id}.")
        # Validate user_id here if needed, or assume it's validated by the caller
        conversation = Conversation(user_id=user_id) # Assume user_id is a valid UUID string
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        logger.info(f"Created conversation with id: {conversation.id} for user: {user_id}")
        return conversation

    @staticmethod
    def create_message(
        session: Session,
        conversation_id: UUID,
        role: str,
        content: str
    ) -> Message:
        """
        Creates a new message within a specific conversation.
        """
        logger.debug(f"Creating message for conversation {conversation_id} with role {role}.")
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        session.add(message)
        session.commit()
        session.refresh(message)
        logger.info(f"Created message with id: {message.id} in conversation {conversation_id}")
        return message

    @staticmethod
    def get_messages_for_conversation(
        session: Session,
        conversation_id: UUID
    ) -> List[ChatMessageResponse]:
        """
        Retrieves all messages for a given conversation, ordered by timestamp.
        """
        logger.debug(f"Retrieving messages for conversation {conversation_id}.")
        statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.timestamp)
        messages = session.exec(statement).all()
        
        # Convert to ChatMessageResponse schema
        chat_message_responses = [
            ChatMessageResponse(
                conversation_id=str(msg.conversation_id),
                message_id=str(msg.id),
                role=msg.role,
                content=msg.content,
                timestamp=msg.timestamp
            )
            for msg in messages
        ]
        logger.info(f"Retrieved {len(chat_message_responses)} messages for conversation {conversation_id}.")
        return chat_message_responses

    @staticmethod
    def get_conversation_by_id(session: Session, conversation_id: UUID) -> Optional[Conversation]:
        """
        Retrieves a conversation by its ID.
        """
        logger.debug(f"Retrieving conversation with ID: {conversation_id}")
        conversation = session.get(Conversation, conversation_id)
        if conversation:
            logger.info(f"Found conversation with ID: {conversation_id}")
        else:
            logger.warning(f"Conversation with ID: {conversation_id} not found.")
        return conversation

