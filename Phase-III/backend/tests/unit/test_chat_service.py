import pytest
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from uuid import UUID
from datetime import datetime, timezone

from src.services.chat_service import ChatService
from src.models.conversation_model import Conversation
from src.models.message_model import Message
from src.schemas.chat_schema import ChatMessageResponse

# Fixture for an in-memory SQLite database session
@pytest.fixture(name="session")
def session_fixture():
    """Creates an in-memory SQLite database for testing and yields a session."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine) # Clean up after tests

def test_create_conversation(session: Session):
    """
    Test that a new conversation can be created.
    """
    user_id = "test-user-123"
    conversation = ChatService.create_conversation(session, user_id)
    assert conversation.id is not None
    assert isinstance(conversation.id, UUID)
    assert conversation.user_id == user_id
    assert isinstance(conversation.created_at, datetime)
    assert isinstance(conversation.updated_at, datetime)

    retrieved_conversation = session.get(Conversation, conversation.id)
    assert retrieved_conversation == conversation

def test_create_message(session: Session):
    """
    Test that a new message can be created and linked to a conversation.
    """
    user_id = "test-user-123"
    conversation = ChatService.create_conversation(session, user_id)
    message_content = "Hello AI!"
    message_role = "user"

    message = ChatService.create_message(session, conversation.id, message_role, message_content)

    assert message.id is not None
    assert isinstance(message.id, UUID)
    assert message.conversation_id == conversation.id
    assert message.role == message_role
    assert message.content == message_content
    assert isinstance(message.timestamp, datetime)

    retrieved_message = session.get(Message, message.id)
    assert retrieved_message == message
    assert retrieved_message.conversation == conversation

def test_get_conversation_by_id(session: Session):
    """
    Test retrieving an existing conversation by ID.
    """
    user_id = "test-user-123"
    conversation = ChatService.create_conversation(session, user_id)
    retrieved_conversation = ChatService.get_conversation_by_id(session, conversation.id)

    assert retrieved_conversation is not None
    assert retrieved_conversation.id == conversation.id

def test_get_conversation_by_id_not_found(session: Session):
    """
    Test retrieving a non-existent conversation by ID.
    """
    non_existent_id = UUID("00000000-0000-0000-0000-000000000001")
    retrieved_conversation = ChatService.get_conversation_by_id(session, non_existent_id)
    assert retrieved_conversation is None

def test_get_messages_for_conversation(session: Session):
    """
    Test retrieving all messages for a given conversation.
    """
    user_id = "test-user-123"
    conversation = ChatService.create_conversation(session, user_id)

    msg1 = ChatService.create_message(session, conversation.id, "user", "Hi")
    msg2 = ChatService.create_message(session, conversation.id, "assistant", "Hello there!")
    msg3 = ChatService.create_message(session, conversation.id, "user", "How are you?")

    messages = ChatService.get_messages_for_conversation(session, conversation.id)

    assert len(messages) == 3
    assert messages[0].content == "Hi"
    assert messages[1].content == "Hello there!"
    assert messages[2].content == "How are you?"
    
    # Check types and IDs
    assert isinstance(messages[0], ChatMessageResponse)
    assert messages[0].message_id == str(msg1.id)
    assert messages[1].message_id == str(msg2.id)
    assert messages[2].message_id == str(msg3.id)

def test_get_messages_for_conversation_empty(session: Session):
    """
    Test retrieving messages for a conversation with no messages.
    """
    user_id = "test-user-123"
    conversation = ChatService.create_conversation(session, user_id)
    messages = ChatService.get_messages_for_conversation(session, conversation.id)
    assert len(messages) == 0
    assert messages == []
