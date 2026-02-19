import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from uuid import UUID, uuid4
from unittest.mock import patch, MagicMock

from src.main import app
from src.database.database import get_session
from src.core.auth import get_current_user
from src.models.user_model import User

@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory SQLite database for testing"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine) # Clean up after tests


@pytest.fixture(name="mock_user")
def mock_user_fixture():
    """Create a mock user for authentication"""
    return User(
        id=uuid4(),
        email="test@example.com",
        username="testuser",
        hashed_password="hashed_password_here"
    )

@pytest.fixture(name="client")
def client_fixture(session: Session, mock_user: User):
    """Create a TestClient with the in-memory database and mocked authentication"""
    def get_session_override():
        return session

    def get_current_user_override():
        return mock_user

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[get_current_user] = get_current_user_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture
def mock_agents_sdk():
    """
    Mocks the OpenAI Agents SDK components (Agent, Runner, SQLiteSession).
    """
    with patch('src.core.ai_agent.Agent') as mock_agent_class, \
         patch('src.core.ai_agent.Runner') as mock_runner_class, \
         patch('src.core.ai_agent.SQLiteSession') as mock_session_class:

        # Mock Agent instance
        mock_agent_instance = MagicMock()
        mock_agent_class.return_value = mock_agent_instance

        # Mock SQLiteSession instance
        mock_sqlite_session = MagicMock()
        mock_session_class.return_value = mock_sqlite_session

        # Mock Runner.run_sync to return a default response
        mock_result = MagicMock()
        mock_result.final_output = "Mocked AI response"
        mock_runner_class.run_sync.return_value = mock_result

        yield {
            'agent_class': mock_agent_class,
            'agent_instance': mock_agent_instance,
            'runner_class': mock_runner_class,
            'session_class': mock_session_class,
            'sqlite_session': mock_sqlite_session
        }


class TestChatAPI:
    """Integration tests for the Chat API endpoints"""

    def test_post_chat_message_new_conversation(self, client: TestClient, mock_agents_sdk):
        """
        Test POST /chat/message to start a new conversation.
        """
        os.environ["OPENAI_API_KEY"] = "test-key"

        mock_runner = mock_agents_sdk['runner_class']
        mock_result = MagicMock()
        mock_result.final_output = "Mocked AI response"
        mock_runner.run_sync.return_value = mock_result

        response = client.post(
            "/api/v1/chat/message",
            json={"message": "Hello AI!"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "conversation_id" in data
        assert "message_id" in data
        assert data["role"] == "assistant"
        assert data["content"] == "Mocked AI response"
        assert "timestamp" in data

        # Verify Runner.run_sync was called
        mock_runner.run_sync.assert_called_once()
        call_kwargs = mock_runner.run_sync.call_args[1]
        assert call_kwargs['input'] == "Hello AI!"

    def test_post_chat_message_continue_conversation(self, client: TestClient, session: Session, mock_user: User, mock_agents_sdk):
        """
        Test POST /chat/message to continue an existing conversation.
        """
        os.environ["OPENAI_API_KEY"] = "test-key"

        # Manually create a conversation and some initial messages
        from src.services.chat_service import ChatService
        conversation = ChatService.create_conversation(session, user_id=str(mock_user.id))
        conversation.thread_id = "thread_existing_123"  # Set a thread_id
        session.add(conversation)
        session.commit()

        ChatService.create_message(session, conversation.id, "user", "Hi there")
        ChatService.create_message(session, conversation.id, "assistant", "How can I help?")

        mock_runner = mock_agents_sdk['runner_class']
        mock_result = MagicMock()
        mock_result.final_output = "I can help you with todos!"
        mock_runner.run_sync.return_value = mock_result

        response = client.post(
            "/api/v1/chat/message",
            json={"message": "I need help with todos.", "conversation_id": str(conversation.id)}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["conversation_id"] == str(conversation.id)
        assert data["content"] == "I can help you with todos!"

        # Verify Runner.run_sync was called with the existing thread_id
        mock_runner.run_sync.assert_called_once()
        call_kwargs = mock_runner.run_sync.call_args[1]
        assert call_kwargs['input'] == "I need help with todos."

        # Verify SQLiteSession was created with the existing thread_id
        mock_session_class = mock_agents_sdk['session_class']
        mock_session_class.assert_called_once()
        call_args = mock_session_class.call_args[0]
        assert call_args[0] == "thread_existing_123"


    def test_post_chat_message_non_existent_conversation_id(self, client: TestClient, mock_agents_sdk):
        """
        Test POST /chat/message with a non-existent conversation ID returns 404.
        """
        os.environ["OPENAI_API_KEY"] = "test-key"
        non_existent_id = UUID("00000000-0000-0000-0000-000000000001")

        mock_runner = mock_agents_sdk['runner_class']

        response = client.post(
            "/api/v1/chat/message",
            json={"message": "Hello", "conversation_id": str(non_existent_id)}
        )
        assert response.status_code == 404
        assert "Conversation with ID" in response.json()["detail"]

        # AI should not be called if conversation not found
        mock_runner.run_sync.assert_not_called()

    def test_get_chat_history_existing_conversation(self, client: TestClient, session: Session, mock_user: User):
        """
        Test GET /chat/message/{conversation_id} for an existing conversation.
        """
        from src.services.chat_service import ChatService
        conversation = ChatService.create_conversation(session, user_id=str(mock_user.id))
        ChatService.create_message(session, conversation.id, "user", "First message")
        ChatService.create_message(session, conversation.id, "assistant", "First reply")
        ChatService.create_message(session, conversation.id, "user", "Second message")

        response = client.get(f"/api/v1/chat/message/{conversation.id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3
        assert data[0]["content"] == "First message"
        assert data[1]["content"] == "First reply"
        assert data[2]["content"] == "Second message"
        assert data[0]["conversation_id"] == str(conversation.id)

    def test_get_chat_history_non_existent_conversation(self, client: TestClient):
        """
        Test GET /chat/message/{conversation_id} for a non-existent conversation returns 404.
        """
        non_existent_id = UUID("00000000-0000-0000-0000-000000000002")
        response = client.get(f"/api/v1/chat/message/{non_existent_id}")
        assert response.status_code == 404
        assert "Conversation with ID" in response.json()["detail"]

    @patch('src.core.ai_agent.get_current_time')
    def test_post_chat_message_tool_call_integration(self, mock_get_current_time, client: TestClient, mock_agents_sdk):
        """
        Test POST /chat/message when the AI agent uses a tool.
        With the Agents SDK, tool execution is handled automatically by the Runner.
        """
        os.environ["OPENAI_API_KEY"] = "test-key"

        # Mock the tool function
        mock_get_current_time.return_value = "2023-10-27 11:30:00 America/Los_Angeles"

        # Mock Runner to return a response that includes tool execution result
        mock_runner = mock_agents_sdk['runner_class']
        mock_result = MagicMock()
        mock_result.final_output = "The current time in Los Angeles is 11:30 AM."
        mock_runner.run_sync.return_value = mock_result

        response = client.post(
            "/api/v1/chat/message",
            json={"message": "What time is it in Los Angeles?"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "The current time in Los Angeles is 11:30 AM."

        # Verify Runner.run_sync was called
        mock_runner.run_sync.assert_called_once()
        call_kwargs = mock_runner.run_sync.call_args[1]
        assert call_kwargs['input'] == "What time is it in Los Angeles?"

    def test_post_chat_message_creates_thread_id(self, client: TestClient, session: Session, mock_agents_sdk):
        """
        Test that a new conversation gets a thread_id assigned after the first message.
        """
        os.environ["OPENAI_API_KEY"] = "test-key"

        mock_runner = mock_agents_sdk['runner_class']
        mock_result = MagicMock()
        mock_result.final_output = "Hello! How can I help?"
        mock_runner.run_sync.return_value = mock_result

        response = client.post(
            "/api/v1/chat/message",
            json={"message": "Hello"}
        )

        assert response.status_code == 200
        data = response.json()
        conversation_id = UUID(data["conversation_id"])

        # Verify the conversation now has a thread_id
        from src.services.chat_service import ChatService
        conversation = ChatService.get_conversation_by_id(session, conversation_id)
        assert conversation is not None
        assert conversation.thread_id is not None
        assert conversation.thread_id.startswith("thread_")
