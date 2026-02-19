import pytest
from unittest.mock import MagicMock, patch, Mock
from src.core.ai_agent import AIAgent, get_current_time, AgentContext
import os

# Mock the agents SDK components for tests
@pytest.fixture
def mock_agents_sdk():
    with patch('src.core.ai_agent.Agent') as mock_agent_class, \
         patch('src.core.ai_agent.Runner') as mock_runner_class, \
         patch('src.core.ai_agent.SQLiteSession') as mock_session_class:

        mock_agent_instance = MagicMock()
        mock_agent_class.return_value = mock_agent_instance

        yield {
            'agent_class': mock_agent_class,
            'agent_instance': mock_agent_instance,
            'runner_class': mock_runner_class,
            'session_class': mock_session_class
        }

@pytest.fixture
def ai_agent(mock_agents_sdk):
    """Create an AIAgent instance with mocked SDK components"""
    os.environ["OPENAI_API_KEY"] = "test-api-key"
    agent = AIAgent()
    return agent

def test_ai_agent_initialization(ai_agent, mock_agents_sdk):
    """
    Test that the AI agent initializes correctly with OpenAI Agents SDK.
    """
    mock_agent_class = mock_agents_sdk['agent_class']

    # Verify Agent was created with correct parameters
    mock_agent_class.assert_called_once()
    call_kwargs = mock_agent_class.call_args[1]

    assert call_kwargs['name'] == "Todo Assistant"
    assert call_kwargs['model'] == "gpt-4o-mini"
    assert "todo application" in call_kwargs['instructions'].lower()
    assert len(call_kwargs['tools']) == 6  # 6 tools: time + 5 todo tools

    assert ai_agent.model_name == "gpt-4o-mini"

def test_process_message_basic_response(ai_agent, mock_agents_sdk):
    """
    Test that process_message returns a basic text response using the SDK.
    """
    mock_runner = mock_agents_sdk['runner_class']
    mock_session_class = mock_agents_sdk['session_class']

    # Create mock database session and user_id
    mock_db_session = MagicMock()
    user_id = "test-user-123"

    # Mock the Runner.run_sync result
    mock_result = MagicMock()
    mock_result.final_output = "I can help you manage your todos!"
    mock_runner.run_sync.return_value = mock_result

    # Mock SQLiteSession
    mock_sqlite_session = MagicMock()
    mock_session_class.return_value = mock_sqlite_session

    message = "Hi there!"
    response, thread_id = ai_agent.process_message(message, mock_db_session, user_id)

    assert response == "I can help you manage your todos!"
    assert thread_id.startswith("thread_")

    # Verify Runner.run_sync was called with correct parameters
    mock_runner.run_sync.assert_called_once()
    call_kwargs = mock_runner.run_sync.call_args[1]
    assert call_kwargs['input'] == message
    assert isinstance(call_kwargs['context'], AgentContext)
    assert call_kwargs['context'].session == mock_db_session
    assert call_kwargs['context'].user_id == user_id

def test_process_message_with_existing_thread(ai_agent, mock_agents_sdk):
    """
    Test that process_message reuses an existing thread_id for conversation continuity.
    """
    mock_runner = mock_agents_sdk['runner_class']
    mock_session_class = mock_agents_sdk['session_class']

    mock_db_session = MagicMock()
    user_id = "test-user-123"
    existing_thread_id = "thread_existing_abc123"

    # Mock the Runner.run_sync result
    mock_result = MagicMock()
    mock_result.final_output = "Here are your todos."
    mock_runner.run_sync.return_value = mock_result

    # Mock SQLiteSession
    mock_sqlite_session = MagicMock()
    mock_session_class.return_value = mock_sqlite_session

    message = "Show me my todos"
    response, thread_id = ai_agent.process_message(
        message,
        mock_db_session,
        user_id,
        thread_id=existing_thread_id
    )

    assert response == "Here are your todos."
    assert thread_id == existing_thread_id

    # Verify SQLiteSession was created with the existing thread_id
    mock_session_class.assert_called_once()
    call_args = mock_session_class.call_args[0]
    assert call_args[0] == existing_thread_id

def test_process_message_error_handling(ai_agent, mock_agents_sdk):
    """
    Test that process_message handles errors gracefully.
    """
    mock_runner = mock_agents_sdk['runner_class']
    mock_session_class = mock_agents_sdk['session_class']

    mock_db_session = MagicMock()
    user_id = "test-user-123"

    # Mock Runner.run_sync to raise an exception
    mock_runner.run_sync.side_effect = Exception("API connection failed")

    # Mock SQLiteSession
    mock_sqlite_session = MagicMock()
    mock_session_class.return_value = mock_sqlite_session

    message = "Create a todo"
    response, thread_id = ai_agent.process_message(message, mock_db_session, user_id)

    assert "Error processing message" in response
    assert "API connection failed" in response

def test_agent_has_correct_tools(ai_agent, mock_agents_sdk):
    """
    Test that the agent is initialized with the correct number of tools.
    """
    mock_agent_class = mock_agents_sdk['agent_class']
    call_kwargs = mock_agent_class.call_args[1]

    # Verify we have 6 tools: get_current_time + 5 todo tools
    tools = call_kwargs['tools']
    assert len(tools) == 6

    # Verify tools are FunctionTool objects (wrapped by @function_tool decorator)
    from agents import FunctionTool
    for tool in tools:
        assert isinstance(tool, FunctionTool)
