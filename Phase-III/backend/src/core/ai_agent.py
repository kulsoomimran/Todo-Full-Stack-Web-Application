import os
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime
from sqlmodel import Session
from dataclasses import dataclass

from agents import Agent, Runner, function_tool, RunContextWrapper, SQLiteSession
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel

from ..services.todo_service import TodoService
from ..models.todo_model import TodoCreate, TodoUpdate

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

third_model = OpenAIChatCompletionsModel(
    openai_client=client,
    model="mistralai/mistral-small-3.1-24b-instruct:free"
)

# --- Context for passing session and user_id to tools ---
@dataclass
class AgentContext:
    """Context object to pass database session and user_id to tools"""
    session: Session
    user_id: str


# --- Tool Functions using @function_tool decorator ---
@function_tool
def get_current_time(timezone: str = "UTC") -> str:
    """Get the current time in a given timezone.

    Args:
        timezone: The timezone, e.g. 'America/Los_Angeles' or 'UTC'
    """
    now = datetime.now()
    return f"{now.strftime('%Y-%m-%d %H:%M:%S')} {timezone}"


@function_tool
def create_todo_tool(
    ctx: RunContextWrapper[AgentContext],
    title: str,
    description: Optional[str] = None,
    completed: bool = False
) -> str:
    """Creates a new todo item for the current user.

    Args:
        title: The title of the todo item.
        description: An optional description for the todo item.
        completed: Whether the todo item is completed (defaults to False).
    """
    try:
        todo_data = TodoCreate(title=title, description=description, completed=completed)
        todo = TodoService.create_todo(ctx.context.session, todo_data, ctx.context.user_id)
        return f"Created todo: {todo.model_dump_json()}"
    except Exception as e:
        return f"Error creating todo: {str(e)}"


@function_tool
def get_todos_tool(
    ctx: RunContextWrapper[AgentContext],
    completed: Optional[bool] = None
) -> str:
    """Retrieves todo items for the current user, optionally filtered by completion status.

    Args:
        completed: Filter by completion status (True for completed, False for pending, None for all).
    """
    try:
        todos = TodoService.get_todos_by_user(ctx.context.session, ctx.context.user_id, completed)
        todos_list = [todo.model_dump() for todo in todos]
        if not todos_list:
            return "No todos found."
        return f"Found {len(todos_list)} todos: {todos_list}"
    except Exception as e:
        return f"Error retrieving todos: {str(e)}"


@function_tool
def get_todo_details_tool(
    ctx: RunContextWrapper[AgentContext],
    todo_id: int
) -> str:
    """Retrieves details of a specific todo item by its ID for the current user.

    Args:
        todo_id: The ID of the todo item.
    """
    try:
        todo = TodoService.get_todo_by_id(ctx.context.session, todo_id, ctx.context.user_id)
        return f"Todo details: {todo.model_dump_json()}"
    except Exception as e:
        return f"Error retrieving todo: {str(e)}"


@function_tool
def update_todo_tool(
    ctx: RunContextWrapper[AgentContext],
    todo_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None
) -> str:
    """Updates an existing todo item for the current user.

    Args:
        todo_id: The ID of the todo item to update.
        title: New title for the todo item (optional).
        description: New description for the todo item (optional).
        completed: New completion status for the todo item (optional).
    """
    try:
        todo_data = TodoUpdate(title=title, description=description, completed=completed)
        todo = TodoService.update_todo(ctx.context.session, todo_id, ctx.context.user_id, todo_data)
        return f"Updated todo: {todo.model_dump_json()}"
    except Exception as e:
        return f"Error updating todo: {str(e)}"


@function_tool
def delete_todo_tool(
    ctx: RunContextWrapper[AgentContext],
    todo_id: int
) -> str:
    """Deletes a specific todo item by its ID for the current user.

    Args:
        todo_id: The ID of the todo item to delete.
    """
    try:
        success = TodoService.delete_todo(ctx.context.session, todo_id, ctx.context.user_id)
        if success:
            return f"Successfully deleted todo with ID {todo_id}"
        else:
            return f"Failed to delete todo with ID {todo_id}"
    except Exception as e:
        return f"Error deleting todo: {str(e)}"


# --- AI Agent using OpenAI Agents SDK ---
class AIAgent:
    """
    Core class for the AI conversational agent using OpenAI Agents SDK.
    Handles agent creation, session management, and automatic tool execution.
    """
    def __init__(self):
        # self.model_name = "gpt-4o-mini"
        self.model_name = third_model
        self.system_instructions = (
            "You are a helpful AI assistant for a todo application. "
            "Your primary goal is to help users manage their tasks: create, read, update, and delete todo items. "
            "Be concise and always ask for clarification if a request is ambiguous. "
            "You have access to tools to manage todos and get the current time."
        )

        # Create the agent with tools
        self.agent = Agent(
            name="Todo Assistant",
            instructions=self.system_instructions,
            model=self.model_name,
            tools=[
                get_current_time,
                create_todo_tool,
                get_todos_tool,
                get_todo_details_tool,
                update_todo_tool,
                delete_todo_tool,
            ]
        )

        # SQLite session storage directory
        self.session_db_path = os.environ.get("AGENT_SESSION_DB_PATH", "./agent_sessions.db")

    async def process_message(
        self,
        message: str,
        session: Session,
        user_id: str,
        thread_id: Optional[str] = None
    ) -> tuple[str, str]:
        """
        Processes an incoming message using OpenAI Agents SDK.
        Reuses existing conversation if thread_id is provided, otherwise creates a new one.

        Args:
            message: The user's message
            session: Database session for tool execution
            user_id: Current user ID for tool authorization
            thread_id: Optional existing thread ID to reuse

        Returns:
            Tuple of (assistant_response, thread_id)
        """
        try:
            # Create context for tools
            context = AgentContext(session=session, user_id=user_id)

            # Use thread_id as session_id for conversation persistence
            # If no thread_id provided, generate a new one
            if not thread_id:
                import uuid
                thread_id = f"thread_{uuid.uuid4().hex[:16]}"

            # Create SQLite session for conversation history
            agent_session = SQLiteSession(thread_id, db_path=self.session_db_path)

            # Run the agent asynchronously
            result = await Runner.run(
                starting_agent=self.agent,
                input=message,
                context=context,
                session=agent_session
            )

            # Extract the final output
            response_text = result.final_output if result.final_output else "I apologize, but I couldn't generate a response."

            return response_text, thread_id

        except Exception as e:
            error_message = f"Error processing message: {str(e)}"
            return error_message, thread_id or "error"
            error_message = f"Error processing message: {str(e)}"
            return error_message, thread_id or "error"
