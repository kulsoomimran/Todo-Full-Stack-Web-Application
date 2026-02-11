from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
import logging
from ..database.database import get_session
from ..models.todo_model import TodoCreate, TodoUpdate, TodoReplace, TodoResponse, Todo
from ..services.todo_service import TodoService
from ..core.auth import get_current_user, CurrentUser

# Set up logging
logger = logging.getLogger(__name__)

# Create router
todo_router = APIRouter()

@todo_router.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> TodoResponse:
    """
    Create a new todo task for the authenticated user.
    The user_id is automatically assigned from the authenticated user's JWT token.
    """
    try:
        # Use the TodoService to create the todo with user_id
        created_todo = TodoService.create_todo(
            session=session,
            todo_data=todo,
            user_id=current_user.id
        )
        return created_todo
    except ValueError as e:
        logger.error(f"Validation error creating todo: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid data: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error creating todo: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create todo"
        )


@todo_router.get("/todos", response_model=List[TodoResponse])
def get_todos(
    completed: Optional[bool] = None,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> List[TodoResponse]:
    """
    Retrieve all todos for the authenticated user.
    Only returns todos owned by the authenticated user.
    """
    try:
        todos = TodoService.get_todos_by_user(session, current_user.id, completed)
        return todos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve todos"
        )


@todo_router.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> TodoResponse:
    """
    Retrieve a specific todo by ID for the authenticated user.
    Returns 404 if the todo is not found or does not belong to the user.
    """
    try:
        todo = TodoService.get_todo_by_id(session, todo_id, current_user.id)
        return todo
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Check if it's a todo-related exception that should be handled differently
        from ..core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
        if isinstance(e, (TodoNotFoundException, UnauthorizedTodoAccessException)):
            # Return generic unauthorized message to avoid revealing resource existence
            raise HTTPException(
                status_code=404,
                detail="Unauthorized"
            )
        # For other exceptions, return 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve todo"
        )


@todo_router.put("/todos/{todo_id}", response_model=TodoResponse)
def replace_todo(
    todo_id: int,
    todo_replace: TodoReplace,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> TodoResponse:
    """
    Replace a specific todo by ID for the authenticated user (full replacement).
    Returns 404 if the todo is not found or does not belong to the user.
    """
    try:
        replaced_todo = TodoService.replace_todo(session, todo_id, current_user.id, todo_replace)
        return replaced_todo
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Check if it's a todo-related exception that should be handled differently
        from ..core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
        if isinstance(e, (TodoNotFoundException, UnauthorizedTodoAccessException)):
            # Return generic unauthorized message to avoid revealing resource existence
            raise HTTPException(
                status_code=404,
                detail="Unauthorized"
            )
        # For other exceptions, return 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to replace todo"
        )


@todo_router.patch("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> TodoResponse:
    """
    Partially update a specific todo by ID for the authenticated user.
    Returns 404 if the todo is not found or does not belong to the user.
    """
    try:
        updated_todo = TodoService.update_todo(session, todo_id, current_user.id, todo_update)
        return updated_todo
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Check if it's a todo-related exception that should be handled differently
        from ..core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
        if isinstance(e, (TodoNotFoundException, UnauthorizedTodoAccessException)):
            # Return generic unauthorized message to avoid revealing resource existence
            raise HTTPException(
                status_code=404,
                detail="Unauthorized"
            )
        # For other exceptions, return 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update todo"
        )


@todo_router.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo by ID for the authenticated user.
    Returns 404 if the todo is not found or does not belong to the user.
    """
    try:
        TodoService.delete_todo(session, todo_id, current_user.id)
        return  # 204 No Content
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Check if it's a todo-related exception that should be handled differently
        from ..core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
        if isinstance(e, (TodoNotFoundException, UnauthorizedTodoAccessException)):
            # Return generic unauthorized message to avoid revealing resource existence
            raise HTTPException(
                status_code=404,
                detail="Unauthorized"
            )
        # For other exceptions, return 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete todo"
        )