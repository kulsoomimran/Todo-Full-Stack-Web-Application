from sqlmodel import Session, select
import logging
from ..models.todo_model import Todo, TodoCreate, TodoUpdate, TodoResponse
from ..core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
from typing import List, Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class TodoService:
    """Service class for todo operations"""

    @staticmethod
    def _validate_user_id(user_id: str) -> str:
        """
        Validate user_id is a non-empty string.
        Returns the validated user_id string.
        """
        if not user_id or not isinstance(user_id, str):
            logger.error(f"Invalid user_id format: {user_id}. Must be a non-empty string.")
            raise ValueError(f"Invalid user ID format: {user_id}")
        return user_id.strip()

    @staticmethod
    def create_todo(session: Session, todo_data: TodoCreate, user_id: str) -> TodoResponse:
        """
        Create a new todo for a user
        """
        logger.debug(f"Creating todo with user_id: {user_id}, title: {todo_data.title}")
        
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Create the todo object with user_id assigned by server
        todo = Todo(
            title=todo_data.title,
            description=todo_data.description,
            completed=todo_data.completed,
            user_id=user_uuid
        )

        # Add to session and commit
        session.add(todo)
        session.commit()
        session.refresh(todo)

        logger.info(f"Successfully created todo with id: {todo.id} for user: {user_uuid}")
        # Convert to response model
        return TodoResponse.model_validate(todo)

    @staticmethod
    def get_todo_by_id(session: Session, todo_id: int, user_id: str) -> TodoResponse:
        """
        Get a specific todo by ID for a user
        """
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Query for the specific todo that belongs to the user
        statement = select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user_uuid)
        todo = session.exec(statement).first()

        if not todo:
            raise TodoNotFoundException(todo_id)

        return TodoResponse.model_validate(todo)

    @staticmethod
    def get_todos_by_user(session: Session, user_id: str, completed: Optional[bool] = None) -> List[TodoResponse]:
        """
        Get all todos for a specific user
        """
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Build query based on filters
        query = select(Todo).where(Todo.user_id == user_uuid)

        if completed is not None:
            query = query.where(Todo.completed == completed)

        # Execute query
        results = session.exec(query).all()

        # Convert to response models
        return [TodoResponse.model_validate(todo) for todo in results]

    @staticmethod
    def update_todo(session: Session, todo_id: int, user_id: str, todo_data: TodoUpdate) -> TodoResponse:
        """
        Update a specific todo for a user
        """
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Get the todo that belongs to the user
        statement = select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user_uuid)
        todo = session.exec(statement).first()

        if not todo:
            raise TodoNotFoundException(todo_id)

        # Update the todo with provided data
        update_data = todo_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo, field, value)

        # Update the timestamp
        todo.updated_at = datetime.now(timezone.utc)

        # Commit changes
        session.add(todo)
        session.commit()
        session.refresh(todo)

        return TodoResponse.model_validate(todo)

    @staticmethod
    def delete_todo(session: Session, todo_id: int, user_id: str) -> bool:
        """
        Delete a specific todo for a user
        """
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Get the todo that belongs to the user
        statement = select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user_uuid)
        todo = session.exec(statement).first()

        if not todo:
            raise TodoNotFoundException(todo_id)

        # Delete the todo
        session.delete(todo)
        session.commit()

        return True

    @staticmethod
    def replace_todo(session: Session, todo_id: int, user_id: str, todo_data: 'TodoReplace') -> TodoResponse:
        """
        Replace a specific todo for a user (full update)
        """
        # Validate and convert user_id string to UUID
        user_uuid = TodoService._validate_user_id(user_id)

        # Get the todo that belongs to the user
        statement = select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user_uuid)
        todo = session.exec(statement).first()

        if not todo:
            raise TodoNotFoundException(todo_id)

        # Replace all fields with provided data
        todo.title = todo_data.title
        todo.description = todo_data.description
        todo.completed = todo_data.completed

        # Update the timestamp
        todo.updated_at = datetime.now(timezone.utc)

        # Commit changes
        session.add(todo)
        session.commit()
        session.refresh(todo)

        return TodoResponse.model_validate(todo)